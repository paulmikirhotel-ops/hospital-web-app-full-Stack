import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  IoPencilOutline,
  IoTrashOutline,
  IoCloseOutline,
  IoSaveOutline,
  IoPersonOutline,
  IoSearchOutline,
  IoCheckmarkCircleOutline,
  IoWarningOutline,
} from 'react-icons/io5';

const API_BASE = 'https://hospital-web-app-full-stack-1.onrender.com/api/doctors';

// ── Toast ──────────────────────────────────────────────────────────────────
const Toast = ({ toast, onClose }) => {
  useEffect(() => {
    const t = setTimeout(onClose, 3500);
    return () => clearTimeout(t);
  }, [onClose]);

  if (!toast) return null;
  const isError = toast.type === 'error';
  return (
    <div className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-4 rounded-2xl shadow-xl text-sm font-bold ${
      isError ? 'bg-red-600 text-white' : 'bg-emerald-600 text-white'
    }`}>
      {isError ? <IoWarningOutline size={18} /> : <IoCheckmarkCircleOutline size={18} />}
      {toast.message}
    </div>
  );
};

// ── Edit Modal ─────────────────────────────────────────────────────────────
const EditModal = ({ doctor, onClose, onSave }) => {
  const [form, setForm] = useState({
    name:           doctor.name           || '',
    email:          doctor.email          || '',
    specialization: doctor.specialization || '',
    qualification:  doctor.qualification  || '',
    experience:     doctor.experience     || '',
    fee:            doctor.fee            || '',
    about:          doctor.about          || '',
  });
  const [saving, setSaving] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    await onSave(doctor._id, form);
    setSaving(false);
  };

  const fields = [
    { label: 'Full Name',       name: 'name',           type: 'text',     half: true  },
    { label: 'Email',           name: 'email',          type: 'email',    half: true  },
    { label: 'Specialization',  name: 'specialization', type: 'text',     half: true  },
    { label: 'Qualification',   name: 'qualification',  type: 'text',     half: true  },
    { label: 'Experience',      name: 'experience',     type: 'text',     half: true  },
    { label: 'Consultation Fee',name: 'fee',            type: 'number',   half: true  },
    { label: 'About',           name: 'about',          type: 'textarea', half: false },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-8 border-b border-slate-100">
          <div>
            <h2 className="text-xl font-black text-slate-900">Edit Doctor</h2>
            <p className="text-sm text-slate-400 font-medium mt-0.5">Update profile information</p>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-all">
            <IoCloseOutline size={22} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8">
          <div className="grid grid-cols-2 gap-4">
            {fields.map(({ label, name, type, half }) => (
              <div key={name} className={half ? '' : 'col-span-2'}>
                <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-2">
                  {label}
                </label>
                {type === 'textarea' ? (
                  <textarea
                    name={name}
                    value={form[name]}
                    onChange={handleChange}
                    rows={3}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none transition-all"
                  />
                ) : (
                  <input
                    type={type}
                    name={name}
                    value={form[name]}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  />
                )}
              </div>
            ))}
          </div>

          <div className="flex justify-end gap-3 mt-8">
            <button type="button" onClick={onClose} className="px-6 py-3 rounded-xl border border-slate-200 text-sm font-black text-slate-600 hover:bg-slate-50 transition-all">
              Cancel
            </button>
            <button type="submit" disabled={saving} className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl text-sm font-black shadow-lg shadow-blue-200 hover:bg-blue-700 transition-all disabled:opacity-60">
              <IoSaveOutline size={16} />
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// ── Delete Modal ───────────────────────────────────────────────────────────
const DeleteModal = ({ doctor, onClose, onConfirm }) => {
  const [deleting, setDeleting] = useState(false);

  const handleConfirm = async () => {
    setDeleting(true);
    await onConfirm(doctor._id);
    setDeleting(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-8 text-center">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-5">
          <IoTrashOutline size={28} className="text-red-500" />
        </div>
        <h2 className="text-xl font-black text-slate-900 mb-2">Delete Doctor?</h2>
        <p className="text-sm text-slate-400 font-medium mb-1">You are about to permanently remove</p>
        <p className="text-base font-black text-slate-700 mb-6">{doctor.name}</p>
        <p className="text-xs text-slate-400 mb-8">This will also delete their linked user account.</p>
        <div className="flex gap-3">
          <button onClick={onClose} className="flex-1 px-6 py-3 rounded-xl border border-slate-200 text-sm font-black text-slate-600 hover:bg-slate-50 transition-all">
            Cancel
          </button>
          <button onClick={handleConfirm} disabled={deleting} className="flex-1 px-6 py-3 bg-red-500 text-white rounded-xl text-sm font-black hover:bg-red-600 transition-all disabled:opacity-60">
            {deleting ? 'Deleting...' : 'Yes, Delete'}
          </button>
        </div>
      </div>
    </div>
  );
};

// ── Doctor Card ────────────────────────────────────────────────────────────
const DoctorCard = ({ doctor, onEdit, onDelete }) => (
  <div className="bg-white border border-slate-100 rounded-2xl p-5 flex items-center gap-5 hover:shadow-md hover:border-slate-200 transition-all">
    <div className="w-16 h-16 rounded-2xl overflow-hidden bg-slate-100 flex-shrink-0">
      {doctor.image ? (
        <img src={doctor.image} alt={doctor.name} className="w-full h-full object-cover" />
      ) : (
        <div className="w-full h-full flex items-center justify-center">
          <IoPersonOutline size={28} className="text-slate-400" />
        </div>
      )}
    </div>

    <div className="flex-1 min-w-0">
      <p className="font-black text-slate-900 text-base truncate">{doctor.name}</p>
      <p className="text-sm font-bold text-blue-600 truncate">{doctor.specialization}</p>
      <p className="text-xs text-slate-400 font-medium truncate">{doctor.qualification}</p>
    </div>

    <div className="hidden md:flex flex-col gap-1.5 items-end">
      {doctor.experience && (
        <span className="text-[10px] font-black uppercase tracking-wider bg-slate-100 text-slate-500 px-3 py-1 rounded-full">
          {doctor.experience}
        </span>
      )}
      {doctor.fee && (
        <span className="text-[10px] font-black uppercase tracking-wider bg-blue-50 text-blue-500 px-3 py-1 rounded-full">
          ${doctor.fee} fee
        </span>
      )}
    </div>

    <div className="flex gap-2 flex-shrink-0">
      <button onClick={() => onEdit(doctor)} className="p-2.5 rounded-xl bg-blue-50 text-blue-600 hover:bg-blue-100 transition-all" title="Edit">
        <IoPencilOutline size={16} />
      </button>
      <button onClick={() => onDelete(doctor)} className="p-2.5 rounded-xl bg-red-50 text-red-500 hover:bg-red-100 transition-all" title="Delete">
        <IoTrashOutline size={16} />
      </button>
    </div>
  </div>
);

// ── Main Page ──────────────────────────────────────────────────────────────
const ManageDoctors = () => {
  const [doctors, setDoctors]           = useState([]);
  const [filtered, setFiltered]         = useState([]);
  const [loading, setLoading]           = useState(true);
  const [search, setSearch]             = useState('');
  const [editTarget, setEditTarget]     = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [toast, setToast]               = useState(null);

  const showToast = (message, type = 'success') => setToast({ message, type });

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const { data } = await axios.get(`${API_BASE}/list`, { withCredentials: true });
        // response shape: { success: true, doctors: [...] }
        const list = data.doctors || [];
        setDoctors(list);
        setFiltered(list);
      } catch (err) {
        showToast('Failed to load doctors.', 'error');
      } finally {
        setLoading(false);
      }
    };
    fetchDoctors();
  }, []);

  useEffect(() => {
    const q = search.toLowerCase();
    setFiltered(
      doctors.filter((d) =>
        d.name?.toLowerCase().includes(q) ||
        d.specialization?.toLowerCase().includes(q) ||
        d.qualification?.toLowerCase().includes(q)
      )
    );
  }, [search, doctors]);

  const handleSave = async (id, form) => {
    try {
      const { data } = await axios.put(`${API_BASE}/edit/${id}`, form, { withCredentials: true });
      setDoctors(doctors.map((d) => (d._id === id ? { ...d, ...data.doctor } : d)));
      setEditTarget(null);
      showToast('Doctor updated successfully.');
    } catch (err) {
      showToast('Failed to update doctor.', 'error');
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_BASE}/delete/${id}`, { withCredentials: true });
      setDoctors(doctors.filter((d) => d._id !== id));
      setDeleteTarget(null);
      showToast('Doctor removed successfully.');
    } catch (err) {
      showToast('Failed to delete doctor.', 'error');
    }
  };

  return (
    <div className="p-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h2 className="text-2xl font-black text-slate-900">Manage Doctors</h2>
          <p className="text-sm text-slate-400 font-medium mt-1">
            {doctors.length} doctor{doctors.length !== 1 ? 's' : ''} registered
          </p>
        </div>
        <div className="relative">
          <IoSearchOutline size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search by name, specialization…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 pr-5 py-3 bg-slate-100 rounded-xl text-sm font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 w-72 transition-all"
          />
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col gap-3">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-24 bg-slate-100 rounded-2xl animate-pulse" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
            <IoPersonOutline size={28} className="text-slate-300" />
          </div>
          <p className="font-black text-slate-400 text-lg">
            {search ? 'No doctors match your search' : 'No doctors found'}
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {filtered.map((doctor) => (
            <DoctorCard
              key={doctor._id}
              doctor={doctor}
              onEdit={setEditTarget}
              onDelete={setDeleteTarget}
            />
          ))}
        </div>
      )}

      {editTarget && (
        <EditModal doctor={editTarget} onClose={() => setEditTarget(null)} onSave={handleSave} />
      )}
      {deleteTarget && (
        <DeleteModal doctor={deleteTarget} onClose={() => setDeleteTarget(null)} onConfirm={handleDelete} />
      )}

      <Toast toast={toast} onClose={() => setToast(null)} />
    </div>
  );
};

export default ManageDoctors;