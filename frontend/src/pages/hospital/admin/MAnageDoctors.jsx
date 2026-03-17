import React, { useEffect, useState, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';
import {
  IoPencilOutline, IoTrashOutline, IoAddOutline, IoCloseOutline,
  IoPersonOutline, IoMedicalOutline, IoStatsChartOutline,
  IoCloudUploadOutline, IoCheckmarkCircleOutline, IoTimeOutline,
  IoSearchOutline, IoChevronDownOutline, IoImageOutline,
  IoCalendarOutline, IoWalletOutline, IoPeopleOutline,
  IoFunnelOutline, IoCheckboxOutline, IoSquareOutline,
  IoKeyOutline, IoMailOutline, IoShieldCheckmarkOutline,
  IoCopyOutline, IoEyeOutline, IoEyeOffOutline,
} from 'react-icons/io5';
import API from '../../../api/axiosConfig';

/* ─────────────────────────────────────────────
   CONSTANTS
───────────────────────────────────────────── */
const SPECIALIZATIONS = [
  'All',
  'General Practice', 'Cardiology', 'Neurology', 'Pediatrics',
  'Orthopedics', 'Gynecology', 'Dermatology', 'Psychiatry',
  'Oncology', 'Radiology', 'Surgery', 'Emergency Medicine',
  'Internal Medicine', 'Maternity', 'ENT',
];

const SPEC_COLORS = {
  'Cardiology':         'bg-rose-500/15 text-rose-400 border-rose-500/20',
  'Neurology':          'bg-violet-500/15 text-violet-400 border-violet-500/20',
  'Pediatrics':         'bg-sky-500/15 text-sky-400 border-sky-500/20',
  'Orthopedics':        'bg-amber-500/15 text-amber-400 border-amber-500/20',
  'Gynecology':         'bg-pink-500/15 text-pink-400 border-pink-500/20',
  'Dermatology':        'bg-orange-500/15 text-orange-400 border-orange-500/20',
  'Psychiatry':         'bg-teal-500/15 text-teal-400 border-teal-500/20',
  'Oncology':           'bg-red-500/15 text-red-400 border-red-500/20',
  'Radiology':          'bg-cyan-500/15 text-cyan-400 border-cyan-500/20',
  'Surgery':            'bg-indigo-500/15 text-indigo-400 border-indigo-500/20',
  'Emergency Medicine': 'bg-red-500/15 text-red-400 border-red-500/20',
  'Internal Medicine':  'bg-blue-500/15 text-blue-400 border-blue-500/20',
  'General Practice':   'bg-emerald-500/15 text-emerald-400 border-emerald-500/20',
  'Maternity':          'bg-purple-500/15 text-purple-400 border-purple-500/20',
  'ENT':                'bg-lime-500/15 text-lime-400 border-lime-500/20',
};

const emptyForm = {
  name: '', email: '', password: '', specialization: 'General Practice',
  fee: '', experience: '', qualification: '', about: '',
};

const specBadge = (spec) =>
  SPEC_COLORS[spec] || 'bg-slate-500/15 text-slate-400 border-slate-500/20';

const inputCls =
  'w-full px-4 py-3 bg-white/[0.05] border border-white/[0.08] rounded-xl text-sm text-white placeholder:text-slate-600 outline-none focus:border-indigo-500/60 focus:bg-white/[0.08] transition-all';

/* ─────────────────────────────────────────────
   SHARED: MODAL BACKDROP + CONTAINER
───────────────────────────────────────────── */
const ModalShell = ({ onClose, children, maxWidth = 'max-w-2xl' }) => (
  <motion.div
    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
    className="fixed inset-0 bg-black/70 backdrop-blur-md z-50 flex items-center justify-center p-4"
    onClick={onClose}
  >
    <motion.div
      initial={{ y: 28, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 28, opacity: 0 }}
      transition={{ type: 'spring', stiffness: 300, damping: 28 }}
      className={`bg-[#0f1117] border border-white/[0.08] rounded-3xl w-full ${maxWidth} max-h-[90vh] overflow-y-auto shadow-2xl`}
      onClick={e => e.stopPropagation()}
    >
      {children}
    </motion.div>
  </motion.div>
);

/* ─────────────────────────────────────────────
   SHARED: FORM FIELD WRAPPER
───────────────────────────────────────────── */
const Field = ({ label, children }) => (
  <div>
    <label className="text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-500 block mb-2">
      {label}
    </label>
    {children}
  </div>
);

/* ─────────────────────────────────────────────
   SHARED: SPINNER BUTTON
───────────────────────────────────────────── */
const SpinnerBtn = ({ loading, onClick, disabled, className, icon, label, loadingLabel }) => (
  <button
    onClick={onClick}
    disabled={loading || disabled}
    className={`flex items-center justify-center gap-2 transition-all disabled:opacity-40 ${className}`}
  >
    {loading
      ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />{loadingLabel}</>
      : <>{icon}{label}</>
    }
  </button>
);

/* ─────────────────────────────────────────────
   STAT CARD
───────────────────────────────────────────── */
const StatCard = ({ icon, label, value, sub }) => (
  <div className="bg-white/[0.04] border border-white/[0.08] rounded-2xl p-5 flex flex-col gap-3 hover:bg-white/[0.06] transition-colors">
    <div className="w-9 h-9 rounded-xl bg-white/[0.07] flex items-center justify-center text-slate-400 text-lg">
      {icon}
    </div>
    <div>
      <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-500 mb-1">{label}</p>
      <p className="text-2xl font-bold text-white">{value}</p>
      {sub && <p className="text-[11px] text-slate-500 mt-0.5">{sub}</p>}
    </div>
  </div>
);

/* ─────────────────────────────────────────────
   ANALYTICS PANEL
───────────────────────────────────────────── */
const AnalyticsPanel = ({ data, loading }) => {
  if (loading) return (
    <div className="flex items-center justify-center py-20">
      <div className="w-8 h-8 border-2 border-white/10 border-t-white/60 rounded-full animate-spin" />
    </div>
  );

  const { sessionsByDate = [], sessionsByDoctor = [] } = data;
  const maxDate = Math.max(...sessionsByDate.map(d => d.totalSessions), 1);
  const maxDoc  = Math.max(...sessionsByDoctor.map(d => d.totalSessions), 1);

  const Empty = ({ text }) => (
    <p className="text-slate-600 text-xs text-center py-10 italic">{text}</p>
  );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Sessions by date */}
      <div>
        <div className="flex items-center gap-2 mb-5">
          <IoCalendarOutline className="text-slate-500" size={14} />
          <span className="text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-500">
            Sessions — last 30 days
          </span>
        </div>
        {sessionsByDate.length === 0 ? <Empty text="No session data yet." /> : (
          <div className="space-y-2.5 max-h-72 overflow-y-auto pr-2">
            {sessionsByDate.map((row, i) => (
              <div key={i} className="flex items-center gap-3">
                <span className="text-[10px] text-slate-500 w-20 flex-shrink-0 font-mono">{row._id}</span>
                <div className="flex-1 bg-white/[0.06] rounded-full h-4 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${(row.totalSessions / maxDate) * 100}%` }}
                    transition={{ duration: 0.5, delay: i * 0.03 }}
                    className="h-full rounded-full bg-indigo-500/70"
                  />
                </div>
                <span className="text-[10px] font-bold text-white w-5 text-right flex-shrink-0">
                  {row.totalSessions}
                </span>
                <span className="text-[10px] font-semibold text-emerald-400 w-14 text-right flex-shrink-0">
                  ${row.revenue || 0}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Sessions per doctor */}
      <div>
        <div className="flex items-center gap-2 mb-5">
          <IoPeopleOutline className="text-slate-500" size={14} />
          <span className="text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-500">
            Sessions per doctor
          </span>
        </div>
        {sessionsByDoctor.length === 0 ? <Empty text="No doctor data yet." /> : (
          <div className="space-y-3 max-h-72 overflow-y-auto pr-2">
            {sessionsByDoctor.map((row, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-white/[0.08] flex-shrink-0 overflow-hidden">
                  {row.doctorInfo?.image
                    ? <img src={row.doctorInfo.image} alt="" className="w-full h-full object-cover" />
                    : <div className="w-full h-full flex items-center justify-center">
                        <IoPersonOutline size={11} className="text-slate-500" />
                      </div>
                  }
                </div>
                <span className="text-[10px] text-slate-400 w-24 flex-shrink-0 truncate">
                  {row.doctorInfo?.name || 'Unknown'}
                </span>
                <div className="flex-1 bg-white/[0.06] rounded-full h-4 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${(row.totalSessions / maxDoc) * 100}%` }}
                    transition={{ duration: 0.5, delay: i * 0.04 }}
                    className="h-full rounded-full bg-teal-500/70"
                  />
                </div>
                <span className="text-[10px] font-bold text-white w-5 text-right flex-shrink-0">
                  {row.totalSessions}
                </span>
                <span className="text-[10px] font-semibold text-emerald-400 w-14 text-right flex-shrink-0">
                  ${row.revenue || 0}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

/* ─────────────────────────────────────────────
   DOCTOR FORM MODAL  (Add / Edit)
───────────────────────────────────────────── */
const DoctorModal = ({ mode, doctor, onClose, onSaved }) => {
  const [form, setForm] = useState(
    mode === 'edit'
      ? {
          name:           doctor.name || '',
          email:          doctor.email || '',
          password:       '',
          specialization: doctor.specialization || 'General Practice',
          fee:            doctor.fee || '',
          experience:     doctor.experience || '',
          qualification:  doctor.qualification || '',
          about:          doctor.about || '',
        }
      : emptyForm
  );
  const [imgFile, setImgFile]       = useState(null);
  const [imgPreview, setImgPreview] = useState(mode === 'edit' ? doctor.image || '' : '');
  const [saving, setSaving]         = useState(false);
  const fileRef                     = useRef(null);

  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }));

  const handleImg = (e) => {
    const f = e.target.files[0];
    if (!f) return;
    if (f.size > 5 * 1024 * 1024) return toast.error('Image must be under 5 MB');
    setImgFile(f);
    setImgPreview(URL.createObjectURL(f));
  };

  const handleSubmit = async () => {
    const { name, email, password, specialization, fee, experience, qualification } = form;
    if (!name || !email || !specialization || !fee || !experience || !qualification)
      return toast.error('Please fill all required fields');
    if (mode === 'add' && !password) return toast.error('Password is required');
    if (mode === 'add' && !imgFile)  return toast.error('Please upload a doctor photo');

    setSaving(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => { if (v) fd.append(k, v); });
      if (imgFile) fd.append('image', imgFile);

      const res = mode === 'add'
        ? await API.post('/doctors/add-doctor-direct', fd, { headers: { 'Content-Type': 'multipart/form-data' } })
        : await API.put(`/doctors/edit/${doctor._id}`, fd, { headers: { 'Content-Type': 'multipart/form-data' } });

      if (res.data.success) {
        toast.success(mode === 'add' ? 'Doctor added!' : 'Doctor updated!');
        onSaved();
        onClose();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Operation failed');
    } finally {
      setSaving(false);
    }
  };

  return (
    <ModalShell onClose={onClose}>
      {/* Header */}
      <div className="flex items-center justify-between px-7 py-6 border-b border-white/[0.06] sticky top-0 bg-[#0f1117] z-10 rounded-t-3xl">
        <div>
          <h3 className="text-lg font-bold text-white">
            {mode === 'add' ? 'Add New Doctor' : 'Edit Doctor'}
          </h3>
          <p className="text-[11px] text-slate-500 mt-0.5">
            {mode === 'add' ? 'Create a new specialist profile' : `Editing: ${doctor.name}`}
          </p>
        </div>
        <button
          onClick={onClose}
          className="w-9 h-9 rounded-xl bg-white/[0.06] hover:bg-red-500/20 hover:text-red-400 text-slate-400 flex items-center justify-center transition-all"
        >
          <IoCloseOutline size={18} />
        </button>
      </div>

      {/* Body */}
      <div className="px-7 py-6 space-y-6">
        {/* Photo upload */}
        <Field label={`Doctor Photo${mode === 'add' ? ' *' : ''}`}>
          <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleImg} />
          {imgPreview ? (
            <div className="relative group w-24 h-24">
              <img
                src={imgPreview}
                alt="Preview"
                className="w-24 h-24 rounded-2xl object-cover border border-white/[0.1]"
              />
              <div className="absolute inset-0 bg-black/50 rounded-2xl opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center gap-2">
                <button
                  type="button"
                  onClick={() => fileRef.current.click()}
                  className="p-1.5 bg-white/10 hover:bg-indigo-500/50 rounded-lg transition-all text-white"
                >
                  <IoImageOutline size={13} />
                </button>
                <button
                  type="button"
                  onClick={() => { setImgFile(null); setImgPreview(''); }}
                  className="p-1.5 bg-white/10 hover:bg-red-500/50 rounded-lg transition-all text-white"
                >
                  <IoCloseOutline size={13} />
                </button>
              </div>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => fileRef.current.click()}
              className="w-24 h-24 border border-dashed border-white/[0.12] rounded-2xl flex flex-col items-center justify-center gap-2 hover:border-indigo-500/50 hover:bg-indigo-500/5 transition-all text-slate-600"
            >
              <IoCloudUploadOutline size={20} />
              <span className="text-[9px] uppercase tracking-widest">Upload</span>
            </button>
          )}
        </Field>

        {/* Grid fields */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Full Name *">
            <input type="text" className={inputCls} value={form.name} onChange={set('name')} placeholder="Dr. John Smith" />
          </Field>
          <Field label="Email *">
            <input type="email" className={inputCls} value={form.email} onChange={set('email')} placeholder="doctor@sjch.com" />
          </Field>
          {mode === 'add' && (
            <Field label="Password *">
              <input type="password" className={inputCls} value={form.password} onChange={set('password')} placeholder="••••••••" />
            </Field>
          )}
          <Field label="Consultation Fee ($) *">
            <input type="number" className={inputCls} value={form.fee} onChange={set('fee')} placeholder="50" />
          </Field>
          <Field label="Experience *">
            <input type="text" className={inputCls} value={form.experience} onChange={set('experience')} placeholder="e.g. 5 Years" />
          </Field>
          <Field label="Qualification *">
            <input type="text" className={inputCls} value={form.qualification} onChange={set('qualification')} placeholder="e.g. MBBS, MD" />
          </Field>
        </div>

        {/* Specialization */}
        <Field label="Specialization *">
          <div className="relative">
            <select
              value={form.specialization}
              onChange={set('specialization')}
              className={`${inputCls} appearance-none cursor-pointer pr-10`}
            >
              {SPECIALIZATIONS.filter(s => s !== 'All').map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
            <IoChevronDownOutline
              className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none"
              size={15}
            />
          </div>
        </Field>

        {/* About */}
        <Field label="About">
          <textarea
            rows={3}
            className={`${inputCls} resize-none`}
            value={form.about}
            onChange={set('about')}
            placeholder="Brief professional biography..."
          />
        </Field>

        {/* Submit */}
        <SpinnerBtn
          loading={saving}
          onClick={handleSubmit}
          icon={<IoCheckmarkCircleOutline size={17} />}
          label={mode === 'add' ? 'Add Doctor' : 'Save Changes'}
          loadingLabel={mode === 'add' ? 'Adding...' : 'Saving...'}
          className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 text-white rounded-2xl font-semibold text-sm shadow-lg shadow-indigo-900/40"
        />
      </div>
    </ModalShell>
  );
};

/* ─────────────────────────────────────────────
   DELETE CONFIRM MODAL  (single or bulk)
───────────────────────────────────────────── */
const DeleteModal = ({ targets, onClose, onDeleted }) => {
  const [deleting, setDeleting] = useState(false);
  const isBulk = targets.length > 1;

  const handleDelete = async () => {
    setDeleting(true);
    try {
      if (isBulk) {
        await Promise.all(targets.map(doc => API.delete(`/doctors/delete/${doc._id}`)));
        toast.success(`${targets.length} doctors deleted`);
      } else {
        const { data } = await API.delete(`/doctors/delete/${targets[0]._id}`);
        if (data.success) toast.success('Doctor deleted');
      }
      onDeleted();
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Delete failed');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <ModalShell onClose={onClose} maxWidth="max-w-sm">
      <div className="p-8">
        <div className="w-12 h-12 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center justify-center mx-auto mb-5">
          <IoTrashOutline size={22} className="text-red-400" />
        </div>
        <h3 className="text-lg font-bold text-white text-center mb-2">
          {isBulk ? `Delete ${targets.length} Doctors?` : 'Delete Doctor?'}
        </h3>
        <p className="text-sm text-slate-500 text-center mb-1">
          {isBulk
            ? `This will permanently delete ${targets.length} selected doctors and their linked accounts.`
            : <>Permanently delete <span className="text-slate-300 font-semibold">{targets[0].name}</span> and their linked account.</>
          }
        </p>
        <p className="text-[10px] text-red-500/70 text-center uppercase tracking-wider font-semibold mb-7">
          This cannot be undone.
        </p>
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-3 border border-white/[0.1] rounded-2xl text-slate-400 hover:bg-white/[0.05] text-sm font-semibold transition-all"
          >
            Cancel
          </button>
          <SpinnerBtn
            loading={deleting}
            onClick={handleDelete}
            icon={<IoTrashOutline size={15} />}
            label="Delete"
            loadingLabel="Deleting…"
            className="flex-1 py-3 bg-red-500/90 hover:bg-red-500 text-white rounded-2xl text-sm font-semibold"
          />
        </div>
      </div>
    </ModalShell>
  );
};

/* ─────────────────────────────────────────────
   DOCTOR ACCESS MODAL
   ─ Tab 1: Send email setup link  → POST /api/auth/invite-doctor
   ─ Tab 2: Admin sets password    → POST /api/auth/admin-set-password
───────────────────────────────────────────── */
const DoctorAccessModal = ({ doctor, onClose }) => {
  const [tab, setTab]           = useState('email');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm]   = useState('');
  const [showPwd, setShowPwd]   = useState(false);
  const [showCfm, setShowCfm]   = useState(false);
  const [loading, setLoading]   = useState(false);
  const [setupUrl, setSetupUrl] = useState('');
  const [emailSent, setEmailSent] = useState(false);

  const handleSendEmail = async () => {
    setLoading(true);
    try {
      const { data } = await API.post('/auth/invite-doctor', { doctorId: doctor._id });

      if (data.success) {
        toast.success(`Setup email sent to ${doctor.email}`);
        setEmailSent(true);
      } else {
        // Email transport failed — backend still returns setupUrl
        toast.error('Email failed to send. Copy the link below to share manually.');
      }

      // Always capture setupUrl if returned (used as manual fallback)
      if (data.setupUrl) setSetupUrl(data.setupUrl);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to send invite');
    } finally {
      setLoading(false);
    }
  };

  const handleSetPassword = async () => {
    if (!password)            return toast.error('Enter a password');
    if (password.length < 6)  return toast.error('Minimum 6 characters');
    if (password !== confirm)  return toast.error('Passwords do not match');

    setLoading(true);
    try {
      const { data } = await API.post('/auth/admin-set-password', {
        doctorId: doctor._id,
        password,
      });
      if (data.success) {
        toast.success(data.message);
        onClose();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to set password');
    } finally {
      setLoading(false);
    }
  };

  const copyUrl = () => {
    navigator.clipboard.writeText(setupUrl);
    toast.success('Link copied to clipboard!');
  };

  const tabs = [
    { id: 'email',  label: 'Send Email Link', icon: <IoMailOutline size={14} /> },
    { id: 'manual', label: 'Set Manually',    icon: <IoKeyOutline size={14} /> },
  ];

  return (
    <ModalShell onClose={onClose} maxWidth="max-w-md">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-5 border-b border-white/[0.06]">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-indigo-500/15 border border-indigo-500/20 flex items-center justify-center">
            <IoShieldCheckmarkOutline size={17} className="text-indigo-400" />
          </div>
          <div>
            <h3 className="font-bold text-white text-base">Account Access</h3>
            <p className="text-[11px] text-slate-500 mt-0.5">Dr. {doctor.name}</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="w-8 h-8 rounded-xl bg-white/[0.06] hover:bg-red-500/20 hover:text-red-400 text-slate-400 flex items-center justify-center transition-all"
        >
          <IoCloseOutline size={16} />
        </button>
      </div>

      {/* Tabs */}
      <div className="px-6 pt-5">
        <div className="flex gap-1 bg-white/[0.04] border border-white/[0.06] p-1 rounded-xl">
          {tabs.map(t => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-semibold transition-all ${
                tab === t.id
                  ? 'bg-white/[0.1] text-white shadow-sm'
                  : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              {t.icon} {t.label}
            </button>
          ))}
        </div>
      </div>

      <div className="px-6 py-5 space-y-4">

        {/* ── EMAIL TAB ── */}
        {tab === 'email' && (
          <div className="space-y-4">
            {/* Info box */}
            <div className="bg-white/[0.03] border border-white/[0.07] rounded-2xl p-4 space-y-2">
              <div className="flex items-center gap-2">
                <IoMailOutline size={14} className="text-indigo-400 flex-shrink-0" />
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                  Sending to
                </span>
              </div>
              <p className="text-sm text-indigo-300 font-mono pl-5">{doctor.email}</p>
            </div>

            <p className="text-sm text-slate-400 leading-relaxed">
              An email will be sent to{' '}
              <span className="text-white font-semibold">Dr. {doctor.name}</span> with a
              secure link to set their own password. The link expires in{' '}
              <span className="text-white">48 hours</span>.
            </p>

            {/* Send button */}
            {!emailSent ? (
              <SpinnerBtn
                loading={loading}
                onClick={handleSendEmail}
                icon={<IoMailOutline size={16} />}
                label="Send Setup Email"
                loadingLabel="Sending…"
                className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl text-sm font-semibold shadow-lg shadow-indigo-900/30"
              />
            ) : (
              <div className="flex items-center gap-3 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl px-4 py-3">
                <IoCheckmarkCircleOutline size={18} className="text-emerald-400 flex-shrink-0" />
                <span className="text-sm text-emerald-400 font-semibold">Email sent successfully!</span>
              </div>
            )}

            {/* Resend link after first send */}
            {emailSent && (
              <button
                onClick={handleSendEmail}
                disabled={loading}
                className="w-full py-2.5 border border-white/[0.08] hover:border-indigo-500/30 text-slate-500 hover:text-indigo-400 rounded-2xl text-xs font-semibold transition-all disabled:opacity-40"
              >
                {loading ? 'Resending…' : 'Resend Email'}
              </button>
            )}

            {/* Manual fallback URL — shown when email transport fails */}
            {setupUrl && (
              <div className="space-y-2">
                <p className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">
                  Or share this link directly:
                </p>
                <div className="flex items-center gap-2 bg-white/[0.04] border border-white/[0.08] rounded-xl px-3 py-2.5">
                  <span className="text-[11px] text-slate-400 truncate flex-1 font-mono">
                    {setupUrl}
                  </span>
                  <button
                    onClick={copyUrl}
                    className="flex items-center gap-1.5 text-[10px] font-semibold text-indigo-400 hover:text-indigo-300 flex-shrink-0 transition-colors px-2 py-1 bg-indigo-500/10 rounded-lg"
                  >
                    <IoCopyOutline size={12} /> Copy
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── MANUAL TAB ── */}
        {tab === 'manual' && (
          <div className="space-y-4">
            {/* Warning notice */}
            <div className="bg-amber-500/[0.08] border border-amber-500/20 rounded-2xl px-4 py-3 flex items-start gap-3">
              <IoKeyOutline size={15} className="text-amber-400 flex-shrink-0 mt-0.5" />
              <p className="text-[12px] text-amber-300/80 leading-relaxed">
                You're setting a password on behalf of{' '}
                <span className="font-semibold text-amber-300">Dr. {doctor.name}</span>.
                Share it with them securely. Their account will be activated immediately
                and any pending email links will be invalidated.
              </p>
            </div>

            {/* New password */}
            <Field label="New Password">
              <div className="relative">
                <input
                  type={showPwd ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Min. 6 characters"
                  className={`${inputCls} pr-11`}
                />
                <button
                  type="button"
                  onClick={() => setShowPwd(v => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-600 hover:text-slate-400 transition-colors"
                >
                  {showPwd ? <IoEyeOffOutline size={16} /> : <IoEyeOutline size={16} />}
                </button>
              </div>
              {/* Strength indicator */}
              {password.length > 0 && (
                <div className="mt-2 flex gap-1">
                  {[1, 2, 3, 4].map(n => (
                    <div
                      key={n}
                      className={`h-1 flex-1 rounded-full transition-all ${
                        password.length >= n * 3
                          ? password.length < 6
                            ? 'bg-red-500'
                            : password.length < 10
                            ? 'bg-amber-500'
                            : 'bg-emerald-500'
                          : 'bg-white/[0.08]'
                      }`}
                    />
                  ))}
                  <span className="text-[10px] text-slate-600 ml-1">
                    {password.length < 6 ? 'Too short' : password.length < 10 ? 'Fair' : 'Strong'}
                  </span>
                </div>
              )}
            </Field>

            {/* Confirm password */}
            <Field label="Confirm Password">
              <div className="relative">
                <input
                  type={showCfm ? 'text' : 'password'}
                  value={confirm}
                  onChange={e => setConfirm(e.target.value)}
                  placeholder="Repeat password"
                  className={`${inputCls} pr-11 ${
                    confirm && confirm !== password ? 'border-red-500/50' : ''
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowCfm(v => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-600 hover:text-slate-400 transition-colors"
                >
                  {showCfm ? <IoEyeOffOutline size={16} /> : <IoEyeOutline size={16} />}
                </button>
              </div>
              {confirm && confirm !== password && (
                <p className="text-[11px] text-red-400 mt-1.5">Passwords do not match</p>
              )}
            </Field>

            {/* Submit */}
            <SpinnerBtn
              loading={loading}
              onClick={handleSetPassword}
              disabled={!password || !confirm || password !== confirm}
              icon={<IoShieldCheckmarkOutline size={16} />}
              label="Set Password & Activate"
              loadingLabel="Activating…"
              className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl text-sm font-semibold shadow-lg shadow-indigo-900/30"
            />
          </div>
        )}
      </div>
    </ModalShell>
  );
};

/* ─────────────────────────────────────────────
   MAIN — ManageDoctors
───────────────────────────────────────────── */
const ManageDoctors = () => {
  const [doctors, setDoctors]             = useState([]);
  const [loading, setLoading]             = useState(true);
  const [search, setSearch]               = useState('');
  const [specFilter, setSpecFilter]       = useState('All');
  const [activeTab, setActiveTab]         = useState('list');
  const [modal, setModal]                 = useState(null);        // add / edit
  const [deleteTargets, setDeleteTargets] = useState(null);        // single or bulk
  const [accessTarget, setAccessTarget]   = useState(null);        // access modal
  const [selected, setSelected]           = useState(new Set());
  const [analytics, setAnalytics]         = useState({});
  const [analyticsLoading, setAnalyticsLoading] = useState(false);

  /* ── Fetch doctors ── */
  const fetchDoctors = useCallback(async () => {
    try {
      setLoading(true);
      const { data } = await API.get('/doctors/list');
      setDoctors(data.doctors || []);
    } catch {
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
    } catch {
      toast.error('Failed to load analytics');
    } finally {
      setAnalyticsLoading(false);
    }
  }, []);

  useEffect(() => { fetchDoctors(); }, [fetchDoctors]);
  useEffect(() => { if (activeTab === 'analytics') fetchAnalytics(); }, [activeTab, fetchAnalytics]);

  /* ── Derived state ── */
  const filtered = doctors.filter(d => {
    const matchSearch = d.name?.toLowerCase().includes(search.toLowerCase()) ||
      d.specialization?.toLowerCase().includes(search.toLowerCase());
    const matchSpec = specFilter === 'All' || d.specialization === specFilter;
    return matchSearch && matchSpec;
  });

  const availableCount = doctors.filter(d => d.available).length;
  const totalRevenue   = (analytics.sessionsByDoctor || []).reduce((a, b) => a + (b.revenue || 0), 0);
  const totalSessions  = (analytics.sessionsByDate || []).reduce((a, b) => a + (b.totalSessions || 0), 0);

  /* ── Selection helpers ── */
  const toggleSelect = (id) =>
    setSelected(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });

  const toggleAll = () =>
    setSelected(
      selected.size === filtered.length
        ? new Set()
        : new Set(filtered.map(d => d._id))
    );

  const clearSelection = () => setSelected(new Set());

  const handleBulkDelete = () =>
    setDeleteTargets(doctors.filter(d => selected.has(d._id)));

  const onDeleted = () => {
    clearSelection();
    fetchDoctors();
  };

  /* ── Tabs ── */
  const pageTabs = [
    { id: 'list',      label: 'Doctors',   icon: <IoPeopleOutline size={14} /> },
    { id: 'analytics', label: 'Analytics', icon: <IoStatsChartOutline size={14} /> },
  ];

  return (
    <div className="min-h-screen bg-[#080a0f] text-white">
      <div className="max-w-7xl mx-auto p-5 lg:p-8 space-y-6">

        {/* ── PAGE HEADER ── */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold tracking-tight text-white">
              Manage Doctors
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              {doctors.length} specialist{doctors.length !== 1 ? 's' : ''} registered
            </p>
          </div>
          <button
            onClick={() => setModal({ mode: 'add' })}
            className="self-start sm:self-auto flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 text-white rounded-xl font-semibold text-sm transition-all shadow-lg shadow-indigo-900/40"
          >
            <IoAddOutline size={16} /> Add Doctor
          </button>
        </div>

        {/* ── STAT CARDS ── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <StatCard
            icon={<IoPeopleOutline />}
            label="Total"
            value={doctors.length}
          />
          <StatCard
            icon={<IoCheckmarkCircleOutline />}
            label="Available"
            value={availableCount}
            sub={`${doctors.length - availableCount} unavailable`}
          />
          <StatCard
            icon={<IoCalendarOutline />}
            label="Sessions"
            value={activeTab === 'analytics' ? totalSessions : '—'}
          />
          <StatCard
            icon={<IoWalletOutline />}
            label="Revenue"
            value={activeTab === 'analytics' ? `$${totalRevenue}` : '—'}
          />
        </div>

        {/* ── PAGE TABS ── */}
        <div className="flex items-center gap-1 bg-white/[0.04] border border-white/[0.06] p-1 rounded-xl w-fit">
          {pageTabs.map(t => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
                activeTab === t.id
                  ? 'bg-white/[0.1] text-white shadow-sm'
                  : 'text-slate-500 hover:text-slate-300'
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
            <motion.div
              key="list"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-4"
            >
              {/* Search + filter row */}
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <IoSearchOutline
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-600"
                    size={16}
                  />
                  <input
                    type="text"
                    placeholder="Search by name or specialization…"
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-white/[0.04] border border-white/[0.07] rounded-xl text-sm text-white placeholder:text-slate-600 outline-none focus:border-indigo-500/50 transition-all"
                  />
                </div>
                <div className="relative">
                  <IoFunnelOutline
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-600"
                    size={14}
                  />
                  <select
                    value={specFilter}
                    onChange={e => setSpecFilter(e.target.value)}
                    className="pl-9 pr-8 py-2.5 bg-white/[0.04] border border-white/[0.07] rounded-xl text-sm text-slate-300 outline-none focus:border-indigo-500/50 transition-all appearance-none cursor-pointer"
                  >
                    {SPECIALIZATIONS.map(s => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                  <IoChevronDownOutline
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-600 pointer-events-none"
                    size={13}
                  />
                </div>
              </div>

              {/* Bulk action bar */}
              <AnimatePresence>
                {selected.size > 0 && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="flex items-center justify-between bg-indigo-600/10 border border-indigo-500/20 rounded-xl px-4 py-3">
                      <span className="text-sm font-semibold text-indigo-300">
                        {selected.size} selected
                      </span>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={clearSelection}
                          className="text-xs text-slate-500 hover:text-slate-300 transition-colors px-3 py-1.5 rounded-lg hover:bg-white/[0.05]"
                        >
                          Clear
                        </button>
                        <button
                          onClick={handleBulkDelete}
                          className="flex items-center gap-1.5 text-xs font-semibold text-red-400 hover:text-red-300 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 px-3 py-1.5 rounded-lg transition-all"
                        >
                          <IoTrashOutline size={13} /> Delete {selected.size}
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Select all row */}
              {filtered.length > 0 && !loading && (
                <div className="flex items-center gap-3 px-1">
                  <button
                    onClick={toggleAll}
                    className="flex items-center gap-2 text-xs text-slate-500 hover:text-slate-300 transition-colors"
                  >
                    {selected.size === filtered.length && filtered.length > 0
                      ? <IoCheckboxOutline size={16} className="text-indigo-400" />
                      : <IoSquareOutline size={16} />
                    }
                    {selected.size === filtered.length && filtered.length > 0
                      ? 'Deselect all'
                      : 'Select all'
                    }
                  </button>
                  <span className="text-slate-700 text-xs">
                    {filtered.length} result{filtered.length !== 1 ? 's' : ''}
                  </span>
                </div>
              )}

              {/* Loading state */}
              {loading ? (
                <div className="flex flex-col items-center justify-center py-24 gap-4">
                  <div className="w-9 h-9 border-2 border-white/[0.08] border-t-indigo-500 rounded-full animate-spin" />
                  <p className="text-xs text-slate-600 uppercase tracking-widest font-semibold">
                    Loading specialists…
                  </p>
                </div>
              ) : filtered.length === 0 ? (
                /* Empty state */
                <div className="text-center py-24 border border-dashed border-white/[0.06] rounded-3xl">
                  <IoMedicalOutline size={36} className="text-slate-700 mx-auto mb-4" />
                  <p className="text-slate-600 font-semibold text-sm uppercase tracking-widest">
                    No doctors found
                  </p>
                  <button
                    onClick={() => setModal({ mode: 'add' })}
                    className="mt-5 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-sm font-semibold transition-all"
                  >
                    Add First Doctor
                  </button>
                </div>
              ) : (
                /* ── DOCTOR CARDS GRID ── */
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                  {filtered.map((doc, i) => {
                    const isSelected = selected.has(doc._id);
                    return (
                      <motion.div
                        key={doc._id}
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.035 }}
                        onClick={() => toggleSelect(doc._id)}
                        className={`relative bg-white/[0.03] border rounded-2xl overflow-hidden cursor-pointer transition-all group ${
                          isSelected
                            ? 'border-indigo-500/50 bg-indigo-500/[0.06]'
                            : 'border-white/[0.07] hover:border-white/[0.14] hover:bg-white/[0.05]'
                        }`}
                      >
                        {/* Selection checkbox */}
                        <div className={`absolute top-3 left-3 z-10 w-5 h-5 rounded-md border flex items-center justify-center transition-all ${
                          isSelected
                            ? 'bg-indigo-500 border-indigo-400'
                            : 'bg-black/30 border-white/20 opacity-0 group-hover:opacity-100'
                        }`}>
                          {isSelected && <IoCheckmarkCircleOutline size={14} className="text-white" />}
                        </div>

                        {/* Image banner */}
                        <div className="relative h-36 bg-white/[0.04] overflow-hidden">
                          {doc.image
                            ? <img
                                src={doc.image}
                                alt={doc.name}
                                className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                              />
                            : <div className="w-full h-full flex items-center justify-center">
                                <IoPersonOutline size={40} className="text-white/10" />
                              </div>
                          }
                          {/* Availability badge */}
                          <div className={`absolute bottom-3 right-3 flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-semibold backdrop-blur-md border ${
                            doc.available
                              ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/20'
                              : 'bg-white/[0.08] text-slate-500 border-white/[0.1]'
                          }`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${doc.available ? 'bg-emerald-400' : 'bg-slate-500'}`} />
                            {doc.available ? 'Available' : 'Unavailable'}
                          </div>
                        </div>

                        {/* Card body */}
                        <div className="p-4">
                          <span className={`inline-block text-[9px] font-bold uppercase tracking-[0.12em] px-2 py-1 rounded-lg border mb-2 ${specBadge(doc.specialization)}`}>
                            {doc.specialization}
                          </span>
                          <h3 className="text-sm font-bold text-white truncate mb-0.5">
                            {doc.name || 'Unknown'}
                          </h3>
                          <p className="text-[11px] text-slate-600 truncate mb-3">{doc.email}</p>

                          <div className="flex items-center gap-2 mb-4">
                            <span className="flex items-center gap-1 text-[10px] text-slate-500 bg-white/[0.05] px-2 py-1 rounded-lg">
                              <IoTimeOutline size={10} className="text-indigo-400" /> {doc.experience}
                            </span>
                            <span className="flex items-center gap-1 text-[10px] text-slate-500 bg-white/[0.05] px-2 py-1 rounded-lg">
                              <IoWalletOutline size={10} className="text-emerald-400" /> ${doc.fee}
                            </span>
                          </div>

                          {/* Action buttons — stop click propagation so they don't toggle selection */}
                          <div className="grid grid-cols-3 gap-1.5" onClick={e => e.stopPropagation()}>
                            <button
                              onClick={() => setModal({ mode: 'edit', doctor: doc })}
                              className="flex items-center justify-center gap-1 py-2 bg-white/[0.05] hover:bg-indigo-500/10 hover:text-indigo-400 text-slate-500 rounded-xl text-[10px] font-semibold uppercase tracking-wider transition-all border border-white/[0.06] hover:border-indigo-500/20"
                            >
                              <IoPencilOutline size={11} /> Edit
                            </button>
                            <button
                              onClick={() => setAccessTarget(doc)}
                              className="flex items-center justify-center gap-1 py-2 bg-white/[0.05] hover:bg-emerald-500/10 hover:text-emerald-400 text-slate-500 rounded-xl text-[10px] font-semibold uppercase tracking-wider transition-all border border-white/[0.06] hover:border-emerald-500/20"
                            >
                              <IoKeyOutline size={11} /> Access
                            </button>
                            <button
                              onClick={() => setDeleteTargets([doc])}
                              className="flex items-center justify-center gap-1 py-2 bg-white/[0.05] hover:bg-red-500/10 hover:text-red-400 text-slate-500 rounded-xl text-[10px] font-semibold uppercase tracking-wider transition-all border border-white/[0.06] hover:border-red-500/20"
                            >
                              <IoTrashOutline size={11} /> Delete
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </motion.div>
          )}

          {/* ANALYTICS TAB */}
          {activeTab === 'analytics' && (
            <motion.div
              key="analytics"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="bg-white/[0.03] border border-white/[0.07] rounded-3xl p-6 lg:p-8"
            >
              <div className="flex items-center gap-3 mb-7">
                <div className="w-9 h-9 bg-white/[0.07] rounded-xl flex items-center justify-center">
                  <IoStatsChartOutline size={17} className="text-slate-400" />
                </div>
                <div>
                  <h2 className="font-bold text-white text-base">Session Analytics</h2>
                  <p className="text-[11px] text-slate-500">Appointments by date & doctor</p>
                </div>
              </div>
              <AnalyticsPanel data={analytics} loading={analyticsLoading} />
            </motion.div>
          )}

        </AnimatePresence>
      </div>

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
        {deleteTargets && (
          <DeleteModal
            targets={deleteTargets}
            onClose={() => setDeleteTargets(null)}
            onDeleted={onDeleted}
          />
        )}
        {accessTarget && (
          <DoctorAccessModal
            doctor={accessTarget}
            onClose={() => setAccessTarget(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default ManageDoctors;