import React, { useEffect, useState, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';
import {
  IoPencilOutline, IoTrashOutline, IoAddOutline, IoCloseOutline,
  IoPersonOutline, IoMedicalOutline, IoStatsChartOutline,
  IoCloudUploadOutline, IoCheckmarkCircleOutline, IoTimeOutline,
  IoSearchOutline, IoChevronDownOutline, IoImageOutline,
  IoCalendarOutline, IoWalletOutline, IoPeopleOutline,
} from 'react-icons/io5';
import API from '../../../api/axiosConfig';

const SPECIALIZATIONS = [
  'General Practice', 'Cardiology', 'Neurology', 'Pediatrics',
  'Orthopedics', 'Gynecology', 'Dermatology', 'Psychiatry',
  'Oncology', 'Radiology', 'Surgery', 'Emergency Medicine',
  'Internal Medicine', 'Maternity', 'ENT',
];

/* ─────────────────────────────────────────────
   EMPTY FORM
───────────────────────────────────────────── */
const emptyForm = {
  name: '', email: '', password: '', specialization: 'General Practice',
  fee: '', experience: '', qualification: '', about: '',
};

/* ─────────────────────────────────────────────
   STAT MINI CARD
───────────────────────────────────────────── */
const StatMini = ({ icon, label, value, color = 'blue' }) => {
  const colors = {
    blue:  { bg: 'bg-blue-50',    icon: 'text-blue-600',   val: 'text-blue-700'   },
    green: { bg: 'bg-emerald-50', icon: 'text-emerald-600', val: 'text-emerald-700' },
    amber: { bg: 'bg-amber-50',   icon: 'text-amber-500',  val: 'text-amber-700'  },
    slate: { bg: 'bg-slate-50',   icon: 'text-slate-500',  val: 'text-slate-700'  },
  };
  const c = colors[color] || colors.blue;
  return (
    <div className={`${c.bg} rounded-2xl p-5 flex items-center gap-4`}>
      <div className={`${c.icon} text-2xl flex-shrink-0`}>{icon}</div>
      <div>
        <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">{label}</p>
        <p className={`text-2xl font-black ${c.val}`}>{value}</p>
      </div>
    </div>
  );
};

/* ─────────────────────────────────────────────
   ANALYTICS CHART (pure CSS bar chart)
───────────────────────────────────────────── */
const AnalyticsPanel = ({ data, loading }) => {
  if (loading) return (
    <div className="flex items-center justify-center py-16">
      <div className="w-8 h-8 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin" />
    </div>
  );

  const { sessionsByDate = [], sessionsByDoctor = [] } = data;
  const maxSessions = Math.max(...sessionsByDate.map(d => d.totalSessions), 1);

  return (
    <div className="space-y-8">
      {/* Sessions by date */}
      <div>
        <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4 flex items-center gap-2">
          <IoCalendarOutline /> Sessions by Date (last 30)
        </h4>
        {sessionsByDate.length === 0 ? (
          <p className="text-slate-300 text-xs italic text-center py-8">No session data yet.</p>
        ) : (
          <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
            {sessionsByDate.map((row, i) => (
              <div key={i} className="flex items-center gap-3">
                <span className="text-[10px] font-bold text-slate-400 w-24 flex-shrink-0">{row._id}</span>
                <div className="flex-1 bg-slate-100 rounded-full h-5 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${(row.totalSessions / maxSessions) * 100}%` }}
                    transition={{ duration: 0.6, delay: i * 0.04 }}
                    className="h-full rounded-full bg-gradient-to-r from-blue-500 to-blue-400 flex items-center justify-end pr-2"
                  >
                    <span className="text-[8px] font-black text-white">{row.totalSessions}</span>
                  </motion.div>
                </div>
                <span className="text-[10px] font-black text-emerald-600 w-16 text-right flex-shrink-0">
                  ${row.revenue || 0}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Sessions per doctor */}
      <div>
        <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4 flex items-center gap-2">
          <IoPeopleOutline /> Sessions per Doctor
        </h4>
        {sessionsByDoctor.length === 0 ? (
          <p className="text-slate-300 text-xs italic text-center py-8">No doctor session data yet.</p>
        ) : (
          <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
            {sessionsByDoctor.map((row, i) => {
              const maxDoc = Math.max(...sessionsByDoctor.map(d => d.totalSessions), 1);
              return (
                <div key={i} className="flex items-center gap-3">
                  <div className="flex items-center gap-2 w-36 flex-shrink-0 min-w-0">
                    {row.doctorInfo?.image ? (
                      <img src={row.doctorInfo.image} alt="" className="w-6 h-6 rounded-full object-cover flex-shrink-0" />
                    ) : (
                      <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                        <IoPersonOutline size={12} className="text-blue-500" />
                      </div>
                    )}
                    <span className="text-[10px] font-bold text-slate-600 truncate">
                      {row.doctorInfo?.name || 'Unknown'}
                    </span>
                  </div>
                  <div className="flex-1 bg-slate-100 rounded-full h-5 overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${(row.totalSessions / maxDoc) * 100}%` }}
                      transition={{ duration: 0.6, delay: i * 0.06 }}
                      className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-emerald-400 flex items-center justify-end pr-2"
                    >
                      <span className="text-[8px] font-black text-white">{row.totalSessions}</span>
                    </motion.div>
                  </div>
                  <span className="text-[10px] font-black text-emerald-600 w-16 text-right flex-shrink-0">
                    ${row.revenue || 0}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

/* ─────────────────────────────────────────────
   DOCTOR FORM MODAL
───────────────────────────────────────────── */
const DoctorModal = ({ mode, doctor, onClose, onSaved }) => {
  const [form, setForm]         = useState(mode === 'edit' ? {
    name:           doctor.name || '',
    email:          doctor.email || '',
    password:       '',
    specialization: doctor.specialization || 'General Practice',
    fee:            doctor.fee || '',
    experience:     doctor.experience || '',
    qualification:  doctor.qualification || '',
    about:          doctor.about || '',
  } : emptyForm);
  const [imgFile, setImgFile]   = useState(null);
  const [imgPreview, setImgPreview] = useState(mode === 'edit' ? doctor.image || '' : '');
  const [saving, setSaving]     = useState(false);
  const fileRef                 = useRef(null);

  const handleImg = (e) => {
    const f = e.target.files[0];
    if (!f) return;
    if (f.size > 5 * 1024 * 1024) return toast.error('Image must be under 5MB');
    setImgFile(f);
    setImgPreview(URL.createObjectURL(f));
  };

  const handleSubmit = async () => {
    const { name, email, password, specialization, fee, experience, qualification } = form;
    if (!name || !email || !specialization || !fee || !experience || !qualification)
      return toast.error('Please fill all required fields');
    if (mode === 'add' && !password)
      return toast.error('Password is required for new doctor');
    if (mode === 'add' && !imgFile)
      return toast.error('Please upload a doctor photo');

    setSaving(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => { if (v) fd.append(k, v); });
      if (imgFile) fd.append('image', imgFile);

      let res;
      if (mode === 'add') {
        res = await API.post('/doctors/add-doctor-direct', fd, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      } else {
        res = await API.put(`/doctors/edit/${doctor._id}`, fd, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      }

      if (res.data.success) {
        toast.success(mode === 'add' ? 'Doctor added successfully!' : 'Doctor updated!');
        onSaved();
        onClose();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Operation failed');
    } finally {
      setSaving(false);
    }
  };

  const field = (label, key, type = 'text', placeholder = '') => (
    <div>
      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-2">{label}</label>
      <input
        type={type}
        value={form[key]}
        onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
        placeholder={placeholder}
        className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm outline-none focus:border-blue-500 transition-all"
      />
    </div>
  );

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.92, opacity: 0, y: 24 }}
        animate={{ scale: 1,    opacity: 1, y: 0  }}
        exit={{    scale: 0.92, opacity: 0, y: 24  }}
        transition={{ type: 'spring', stiffness: 280, damping: 26 }}
        className="bg-white rounded-[2rem] w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 lg:p-8 border-b border-slate-100 sticky top-0 bg-white z-10 rounded-t-[2rem]">
          <div>
            <h3 className="text-xl font-black text-slate-900 tracking-tighter">
              {mode === 'add' ? 'Add New Doctor' : 'Edit Doctor'}
            </h3>
            <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mt-1">
              {mode === 'add' ? 'Create a new specialist profile' : `Editing: ${doctor.name}`}
            </p>
          </div>
          <button onClick={onClose} className="w-10 h-10 rounded-xl bg-slate-100 hover:bg-red-50 hover:text-red-500 flex items-center justify-center transition-all">
            <IoCloseOutline size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 lg:p-8 space-y-6">

          {/* Photo upload */}
          <div>
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-3">
              Doctor Photo {mode === 'add' && <span className="text-red-400">*</span>}
            </label>
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleImg} />
            {imgPreview ? (
              <div className="relative group w-28 h-28">
                <img src={imgPreview} alt="Preview" className="w-28 h-28 rounded-2xl object-cover border-2 border-slate-100" />
                <div className="absolute inset-0 bg-black/40 rounded-2xl opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center gap-2">
                  <button type="button" onClick={() => fileRef.current.click()} className="p-1.5 bg-white rounded-lg hover:bg-blue-500 hover:text-white transition-all">
                    <IoImageOutline size={14} />
                  </button>
                  <button type="button" onClick={() => { setImgFile(null); setImgPreview(''); }} className="p-1.5 bg-white rounded-lg hover:bg-red-500 hover:text-white transition-all">
                    <IoCloseOutline size={14} />
                  </button>
                </div>
              </div>
            ) : (
              <button type="button" onClick={() => fileRef.current.click()}
                className="w-28 h-28 border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center gap-2 hover:border-blue-400 hover:bg-blue-50/30 transition-all">
                <IoCloudUploadOutline size={22} className="text-slate-300" />
                <span className="text-[9px] text-slate-300 font-black uppercase">Upload</span>
              </button>
            )}
          </div>

          {/* Form fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {field('Full Name *',    'name',          'text', 'Dr. John Smith')}
            {field('Email *',        'email',         'email', 'doctor@sjch.com')}
            {mode === 'add' && field('Password *', 'password', 'password', '••••••••')}
            {field('Fee ($) *',      'fee',           'number', '50')}
            {field('Experience *',   'experience',    'text', 'e.g. 5 Years')}
            {field('Qualification *','qualification', 'text', 'e.g. MBBS, MD')}
          </div>

          {/* Specialization */}
          <div>
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-2">Specialization *</label>
            <div className="relative">
              <select
                value={form.specialization}
                onChange={e => setForm(f => ({ ...f, specialization: e.target.value }))}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm outline-none focus:border-blue-500 transition-all appearance-none cursor-pointer"
              >
                {SPECIALIZATIONS.map(s => <option key={s}>{s}</option>)}
              </select>
              <IoChevronDownOutline className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={16} />
            </div>
          </div>

          {/* About */}
          <div>
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-2">About</label>
            <textarea
              rows={4}
              value={form.about}
              onChange={e => setForm(f => ({ ...f, about: e.target.value }))}
              placeholder="Brief professional biography..."
              className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm outline-none focus:border-blue-500 transition-all resize-none"
            />
          </div>

          {/* Submit */}
          <button
            onClick={handleSubmit}
            disabled={saving}
            className="w-full py-4 bg-blue-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-900 transition-all disabled:opacity-50 flex items-center justify-center gap-2 shadow-xl shadow-blue-100"
          >
            {saving ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                {mode === 'add' ? 'Adding Doctor...' : 'Saving Changes...'}
              </>
            ) : (
              <>
                <IoCheckmarkCircleOutline size={18} />
                {mode === 'add' ? 'Add Doctor' : 'Save Changes'}
              </>
            )}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

/* ─────────────────────────────────────────────
   DELETE CONFIRM MODAL
───────────────────────────────────────────── */
const DeleteModal = ({ doctor, onClose, onDeleted }) => {
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    setDeleting(true);
    try {
      const { data } = await API.delete(`/doctors/delete/${doctor._id}`);
      if (data.success) {
        toast.success('Doctor deleted successfully');
        onDeleted();
        onClose();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Delete failed');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white rounded-[2rem] w-full max-w-sm p-8 shadow-2xl"
        onClick={e => e.stopPropagation()}
      >
        <div className="w-14 h-14 bg-red-50 rounded-2xl flex items-center justify-center mx-auto mb-5">
          <IoTrashOutline size={26} className="text-red-500" />
        </div>
        <h3 className="text-xl font-black text-slate-900 text-center mb-2">Delete Doctor?</h3>
        <p className="text-sm text-slate-400 text-center mb-2">
          This will permanently delete <span className="font-bold text-slate-600">{doctor.name}</span> and their linked account.
        </p>
        <p className="text-[10px] font-black text-red-400 uppercase tracking-widest text-center mb-8">This action cannot be undone.</p>
        <div className="flex gap-3">
          <button onClick={onClose} className="flex-1 py-3 border border-slate-200 rounded-2xl text-slate-600 font-black text-[10px] uppercase tracking-widest hover:bg-slate-50 transition-all">
            Cancel
          </button>
          <button onClick={handleDelete} disabled={deleting}
            className="flex-1 py-3 bg-red-500 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-red-600 transition-all disabled:opacity-50 flex items-center justify-center gap-2">
            {deleting ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <IoTrashOutline size={15} />}
            {deleting ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

/* ─────────────────────────────────────────────
   MAIN — ManageDoctors
───────────────────────────────────────────── */
const ManageDoctors = () => {
  const [doctors, setDoctors]         = useState([]);
  const [loading, setLoading]         = useState(true);
  const [search, setSearch]           = useState('');
  const [activeTab, setActiveTab]     = useState('list');   // 'list' | 'analytics'
  const [modal, setModal]             = useState(null);     // null | { mode: 'add'|'edit', doctor? }
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [analytics, setAnalytics]     = useState({});
  const [analyticsLoading, setAnalyticsLoading] = useState(false);

  /* ── Fetch all doctors ── */
  const fetchDoctors = useCallback(async () => {
    try {
      setLoading(true);
      const { data } = await API.get('/doctors/list');
      setDoctors(data.doctors || []);
    } catch (err) {
      toast.error('Failed to load doctors');
    } finally {
      setLoading(false);
    }
  }, []);

  /* ── Fetch analytics ── */
  const fetchAnalytics = useCallback(async () => {
    try {
      setAnalyticsLoading(true);
      const { data } = await API.get('/doctors/analytics');
      setAnalytics(data);
    } catch (err) {
      toast.error('Failed to load analytics');
    } finally {
      setAnalyticsLoading(false);
    }
  }, []);

  useEffect(() => { fetchDoctors(); }, [fetchDoctors]);
  useEffect(() => { if (activeTab === 'analytics') fetchAnalytics(); }, [activeTab, fetchAnalytics]);

  const filtered = doctors.filter(d =>
    d.name?.toLowerCase().includes(search.toLowerCase()) ||
    d.specialization?.toLowerCase().includes(search.toLowerCase())
  );

  const totalRevenue = (analytics.sessionsByDoctor || []).reduce((a, b) => a + (b.revenue || 0), 0);
  const totalSessions = (analytics.sessionsByDate || []).reduce((a, b) => a + (b.totalSessions || 0), 0);

  /* ── Tabs ── */
  const tabs = [
    { id: 'list',      label: 'Doctor List',  icon: <IoPeopleOutline /> },
    { id: 'analytics', label: 'Analytics',    icon: <IoStatsChartOutline /> },
  ];

  return (
    <div className="p-4 lg:p-8 space-y-6">

      {/* ── PAGE HEADER ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl lg:text-3xl font-black text-slate-900 tracking-tighter">Manage Doctors</h2>
          <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mt-1">
            {doctors.length} specialist{doctors.length !== 1 ? 's' : ''} on record
          </p>
        </div>
        <button
          onClick={() => setModal({ mode: 'add' })}
          className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-900 transition-all shadow-lg shadow-blue-100 self-start sm:self-auto"
        >
          <IoAddOutline size={18} /> Add Doctor
        </button>
      </div>

      {/* ── STAT MINI CARDS ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
        <StatMini icon={<IoPeopleOutline />}          label="Total Doctors"    value={doctors.length}                                                                            color="blue"  />
        <StatMini icon={<IoCheckmarkCircleOutline />}  label="Available"        value={doctors.filter(d => d.available).length}                                                  color="green" />
        <StatMini icon={<IoCalendarOutline />}         label="Total Sessions"   value={activeTab === 'analytics' ? totalSessions : '—'}                                          color="amber" />
        <StatMini icon={<IoWalletOutline />}           label="Session Revenue"  value={activeTab === 'analytics' ? `$${totalRevenue}` : '—'}                                     color="slate" />
      </div>

      {/* ── TABS ── */}
      <div className="flex gap-2 bg-slate-100 p-1.5 rounded-2xl w-fit">
        {tabs.map(t => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id)}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all ${
              activeTab === t.id
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            {t.icon} {t.label}
          </button>
        ))}
      </div>

      {/* ── TAB CONTENT ── */}
      <AnimatePresence mode="wait">

        {/* LIST TAB */}
        {activeTab === 'list' && (
          <motion.div key="list" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }}>

            {/* Search */}
            <div className="relative mb-5">
              <IoSearchOutline className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input
                type="text"
                placeholder="Search by name or specialization..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl text-sm outline-none focus:border-blue-500 transition-all"
              />
            </div>

            {loading ? (
              <div className="flex flex-col items-center justify-center py-20 gap-4">
                <div className="w-10 h-10 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin" />
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Loading specialists...</p>
              </div>
            ) : filtered.length === 0 ? (
              <div className="text-center py-20 border-2 border-dashed border-slate-200 rounded-[2rem]">
                <IoMedicalOutline size={40} className="text-slate-200 mx-auto mb-4" />
                <p className="text-slate-400 font-black uppercase text-xs tracking-widest">No doctors found</p>
                <button onClick={() => setModal({ mode: 'add' })} className="mt-4 px-6 py-3 bg-blue-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-900 transition-all">
                  Add First Doctor
                </button>
              </div>
            ) : (
              /* ── DOCTOR CARDS GRID ── */
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 lg:gap-6">
                {filtered.map((doc, i) => (
                  <motion.div
                    key={doc._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.04 }}
                    className="bg-white border border-slate-100 rounded-[2rem] overflow-hidden shadow-sm hover:shadow-lg hover:shadow-slate-200/60 transition-all group"
                  >
                    {/* Image banner */}
                    <div className="relative h-40 bg-gradient-to-br from-blue-50 to-slate-100 overflow-hidden">
                      {doc.image ? (
                        <img
                          src={doc.image}
                          alt={doc.name}
                          className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <IoPersonOutline size={48} className="text-slate-300" />
                        </div>
                      )}
                      {/* Availability badge */}
                      <div className={`absolute top-3 right-3 px-3 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest backdrop-blur-md border ${
                        doc.available
                          ? 'bg-emerald-500/90 text-white border-emerald-400/50'
                          : 'bg-slate-900/80 text-slate-300 border-slate-700/50'
                      }`}>
                        {doc.available ? '● Available' : '○ Unavailable'}
                      </div>
                    </div>

                    {/* Info */}
                    <div className="p-5">
                      <p className="text-[9px] font-black uppercase tracking-widest text-blue-600 mb-1">{doc.specialization}</p>
                      <h3 className="text-lg font-black text-slate-900 tracking-tighter mb-1 truncate">
                        {doc.name || 'Unknown Doctor'}
                      </h3>
                      <p className="text-xs text-slate-400 truncate mb-3">{doc.email}</p>

                      <div className="flex items-center gap-3 mb-4 flex-wrap">
                        <span className="flex items-center gap-1 text-[10px] font-bold text-slate-500 bg-slate-50 px-2.5 py-1.5 rounded-lg">
                          <IoTimeOutline size={12} className="text-blue-500" /> {doc.experience}
                        </span>
                        <span className="flex items-center gap-1 text-[10px] font-bold text-slate-500 bg-slate-50 px-2.5 py-1.5 rounded-lg">
                          <IoWalletOutline size={12} className="text-emerald-500" /> ${doc.fee}
                        </span>
                      </div>

                      {/* Actions */}
                      <div className="flex gap-2">
                        <button
                          onClick={() => setModal({ mode: 'edit', doctor: doc })}
                          className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-slate-50 hover:bg-blue-50 hover:text-blue-600 text-slate-500 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all border border-slate-100 hover:border-blue-200"
                        >
                          <IoPencilOutline size={14} /> Edit
                        </button>
                        <button
                          onClick={() => setDeleteTarget(doc)}
                          className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-slate-50 hover:bg-red-50 hover:text-red-500 text-slate-500 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all border border-slate-100 hover:border-red-200"
                        >
                          <IoTrashOutline size={14} /> Delete
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        )}

        {/* ANALYTICS TAB */}
        {activeTab === 'analytics' && (
          <motion.div key="analytics" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }}
            className="bg-white border border-slate-100 rounded-[2rem] p-6 lg:p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
                <IoStatsChartOutline size={20} className="text-blue-600" />
              </div>
              <div>
                <h3 className="font-black text-slate-900 text-lg tracking-tighter">Session Analytics</h3>
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Appointments by date and doctor</p>
              </div>
            </div>
            <AnalyticsPanel data={analytics} loading={analyticsLoading} />
          </motion.div>
        )}

      </AnimatePresence>

      {/* ── MODALS ── */}
      <AnimatePresence>
        {modal && (
          <DoctorModal
            mode={modal.mode}
            doctor={modal.doctor}
            onClose={() => setModal(null)}
            onSaved={fetchDoctors}
          />
        )}
        {deleteTarget && (
          <DeleteModal
            doctor={deleteTarget}
            onClose={() => setDeleteTarget(null)}
            onDeleted={fetchDoctors}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default ManageDoctors;