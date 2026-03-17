import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import {
  IoAlertCircle, IoArrowForward, IoHourglassOutline,
  IoCheckmarkCircle, IoPersonOutline, IoTimeOutline,
} from 'react-icons/io5';
import API from '../../api/axiosInstance'; // ✅ FIXED: was axiosConfig

const PendingDoctors = () => {
  const [pending, setPending]   = useState([]);
  const [loading, setLoading]   = useState(true);
  const [actioning, setActioning] = useState(null); // tracks which doctor is being approved/rejected
  const navigate = useNavigate();

  /* ── Fetch pending doctors ─────────────────────────────── */
  useEffect(() => {
    const fetchPending = async () => {
      try {
        setLoading(true);
        // ✅ FIXED: backend returns { success, doctors } NOT { success, users }
        // Route: GET /api/admin/pending-doctors
        // Returns Doctor documents populated with userId (name, email, image)
        const { data } = await API.get('/admin/pending-doctors');
        if (data.success) setPending(data.doctors); // ✅ was data.users
      } catch (err) {
        if (err.response?.status === 403) {
          toast.error('Admin access required.');
        } else {
          toast.error('Could not load pending doctors.');
        }
      } finally {
        setLoading(false);
      }
    };
    fetchPending();
  }, []);

  /* ── Approve doctor ────────────────────────────────────── */
  const handleApprove = async (doctorId, doctorName) => {
    setActioning(doctorId);
    try {
      // Route: PATCH /api/admin/approve-doctor/:id
      await API.patch(`/admin/approve-doctor/${doctorId}`);
      setPending(prev => prev.filter(d => d._id !== doctorId));
      toast.success(`Dr. ${doctorName} has been approved.`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Approval failed.');
    } finally {
      setActioning(null);
    }
  };

  /* ── Reject doctor ─────────────────────────────────────── */
  const handleReject = async (doctorId, doctorName) => {
    if (!window.confirm(`Reject Dr. ${doctorName}'s application?`)) return;
    setActioning(doctorId);
    try {
      // Route: PATCH /api/admin/reject-doctor/:id
      await API.patch(`/admin/reject-doctor/${doctorId}`);
      setPending(prev => prev.filter(d => d._id !== doctorId));
      toast.success(`Dr. ${doctorName} has been rejected.`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Rejection failed.');
    } finally {
      setActioning(null);
    }
  };

  /* ── Loading ───────────────────────────────────────────── */
  if (loading) return (
    <div className="bg-slate-50 p-8 rounded-[3rem] border border-slate-100 h-64
      flex flex-col items-center justify-center">
      <IoHourglassOutline className="text-slate-300 mb-2 animate-spin" size={24} />
      <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">
        Scanning Registry…
      </p>
    </div>
  );

  /* ── Empty state ───────────────────────────────────────── */
  if (pending.length === 0) return (
    <div className="bg-emerald-50 p-8 rounded-[3rem] border border-emerald-100 text-center">
      <IoCheckmarkCircle className="mx-auto text-emerald-400 mb-3" size={32} />
      <p className="text-emerald-700 font-black uppercase text-[10px] tracking-widest">
        ✔ All Specialist Profiles are Up-to-Date
      </p>
    </div>
  );

  /* ── Main ──────────────────────────────────────────────── */
  return (
    <div className="bg-rose-50 p-6 md:p-8 rounded-[3rem] border border-rose-100 shadow-sm">

      {/* Header */}
      <h3 className="text-rose-900 font-black uppercase text-xs tracking-widest mb-6 flex items-center gap-2">
        <IoAlertCircle size={18} className="text-rose-500" />
        Pending Doctor Approvals
        <span className="ml-auto bg-rose-500 text-white text-[9px] font-black px-2.5 py-1 rounded-full">
          {pending.length}
        </span>
      </h3>

      {/* List */}
      <div className="space-y-3 max-h-[480px] overflow-y-auto pr-1">
        {pending.map(doctor => {
          // ✅ doctor.userId is the populated User (name, email, image)
          // doctor._id is the Doctor model ID used for approve/reject
          const user        = doctor.userId;
          const isActioning = actioning === doctor._id;

          return (
            <div
              key={doctor._id}
              className="bg-white p-4 md:p-5 rounded-[2rem] border border-rose-100/50
                hover:border-rose-200 transition-all shadow-sm
                flex flex-col sm:flex-row items-start sm:items-center gap-4"
            >
              {/* Avatar */}
              <img
                src={
                  user?.image ||
                  `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || 'Dr')}&background=fff1f2&color=be123c&size=80`
                }
                alt={user?.name}
                className="w-12 h-12 rounded-2xl object-cover border border-rose-100 flex-shrink-0"
              />

              {/* Info */}
              <div className="flex-1 min-w-0">
                <p className="font-black text-slate-900 leading-none truncate">
                  {user?.name || 'Unknown Doctor'}
                </p>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter truncate mt-0.5">
                  {user?.email || '—'}
                </p>
                {doctor.specialization && (
                  <p className="text-[10px] text-blue-500 font-bold mt-1">
                    {doctor.specialization}
                  </p>
                )}
                <div className="flex items-center gap-1 mt-1.5">
                  <IoTimeOutline size={11} className="text-amber-500" />
                  <span className="text-[9px] text-amber-600 font-black uppercase tracking-widest">
                    Pending Review
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 flex-shrink-0 w-full sm:w-auto">

                {/* Complete profile */}
                <button
                  onClick={() => navigate('/admin/add-doctor', {
                    state: { userId: user?._id, email: user?.email, name: user?.name },
                  })}
                  className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl text-[9px] font-black uppercase
                    tracking-widest border border-slate-200 text-slate-600 bg-white
                    hover:border-blue-300 hover:text-blue-600 transition-all"
                >
                  Edit Profile
                </button>

                {/* Approve */}
                <button
                  onClick={() => handleApprove(doctor._id, user?.name)}
                  disabled={isActioning}
                  className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-[9px] font-black
                    uppercase tracking-widest bg-emerald-600 text-white hover:bg-emerald-700
                    disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-emerald-100
                    transition-all active:scale-95"
                >
                  <IoCheckmarkCircle size={14} />
                  {isActioning ? '…' : 'Approve'}
                </button>

                {/* Reject */}
                <button
                  onClick={() => handleReject(doctor._id, user?.name)}
                  disabled={isActioning}
                  className="w-10 h-10 rounded-xl bg-rose-100 text-rose-600
                    hover:bg-rose-600 hover:text-white disabled:opacity-50
                    disabled:cursor-not-allowed transition-all flex items-center justify-center
                    active:scale-95"
                  title="Reject application"
                >
                  ✕
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <p className="mt-5 text-[9px] font-bold text-rose-400 uppercase tracking-widest text-center">
        {pending.length} account{pending.length !== 1 ? 's' : ''} awaiting clinical verification
      </p>
    </div>
  );
};


export default PendingDoctors;