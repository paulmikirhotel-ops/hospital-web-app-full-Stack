import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import {
  IoPlayCircle, IoPeople, IoTimeOutline,
  IoCheckmarkDoneCircle, IoPulseOutline, IoAlertCircleOutline,
  IoCalendarOutline, IoPersonOutline, IoCheckmarkCircle,
} from 'react-icons/io5';
import { useNavigate } from 'react-router-dom';
import API from '../../api/axiosConfig'; // ✅ FIXED: was axiosConfig

const STATUS_STYLES = {
  Pending:   { bg: 'bg-amber-50',   text: 'text-amber-600',   border: 'border-amber-100',  dot: 'bg-amber-400'   },
  Confirmed: { bg: 'bg-blue-50',    text: 'text-blue-600',    border: 'border-blue-100',   dot: 'bg-blue-500'    },
  Completed: { bg: 'bg-emerald-50', text: 'text-emerald-600', border: 'border-emerald-100',dot: 'bg-emerald-500' },
  Cancelled: { bg: 'bg-slate-50',   text: 'text-slate-400',   border: 'border-slate-100',  dot: 'bg-slate-300'   },
};

const DoctorDashboard = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading]           = useState(true);
  const [filter, setFilter]             = useState('All');
  const navigate = useNavigate();

  /* ── Fetch ─────────────────────────────────────────────── */
  const fetchDoctorAppointments = async () => {
    try {
      setLoading(true);
      // ✅ Backend route: GET /api/appointments/doctor-appointments
      // Backend populates: userId (patient), not patientId
      const { data } = await API.get('/appointments/doctor-appointments');
      if (data.success) setAppointments(data.appointments);
    } catch (err) {
      toast.error('Could not load your clinical schedule.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchDoctorAppointments(); }, []);

  /* ── Confirm appointment ───────────────────────────────── */
  const handleConfirm = async (appointmentId) => {
    const tid = toast.loading('Confirming appointment…');
    try {
      await API.patch(`/appointments/confirm/${appointmentId}`);
      setAppointments(prev =>
        prev.map(a => a._id === appointmentId ? { ...a, status: 'Confirmed' } : a)
      );
      toast.success('Appointment confirmed!', { id: tid });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to confirm.', { id: tid });
    }
  };

  /* ── Start video consultation ──────────────────────────── */
  const startConsultation = async (appointmentId, patientId) => {
    const tid = toast.loading('Initializing secure clinical room…');
    try {
      const { data } = await API.post('/meetings/create', { appointmentId, patientId });
      if (data.success) {
        toast.success('Room Securely Established', { id: tid });
        navigate(`/video-consultation/${data.roomId}`);
      }
    } catch (err) {
      toast.error('Failed to initialize session.', { id: tid });
    }
  };

  /* ── Derived stats ─────────────────────────────────────── */
  const stats = {
    total:     appointments.length,
    pending:   appointments.filter(a => a.status === 'Pending').length,
    confirmed: appointments.filter(a => a.status === 'Confirmed').length,
    paidReady: appointments.filter(a => a.payment && a.status === 'Confirmed').length,
  };

  /* ── Filter ────────────────────────────────────────────── */
  const TABS = ['All', 'Pending', 'Confirmed', 'Completed', 'Cancelled'];
  const filtered = filter === 'All'
    ? appointments
    : appointments.filter(a => a.status === filter);

  /* ── Loading ───────────────────────────────────────────── */
  if (loading) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white">
      <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4" />
      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
        Loading Specialist Portal…
      </p>
    </div>
  );

  /* ── Main ──────────────────────────────────────────────── */
  return (
    <div className="min-h-screen bg-[#F8FAFC] p-4 lg:p-10">
      <div className="max-w-6xl mx-auto">

        {/* ── Header ────────────────────────────────────── */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-blue-200">
                <IoPulseOutline size={20} />
              </div>
              <h1 className="text-3xl lg:text-4xl font-black text-slate-900 uppercase tracking-tighter">
                Specialist <span className="text-blue-600">Portal</span>
              </h1>
            </div>
            <p className="text-slate-400 font-bold text-[10px] uppercase tracking-[0.3em] ml-1">
              Central Consultation Management
            </p>
          </div>

          {/* Stat cards */}
          <div className="flex flex-wrap gap-3">
            {[
              { label: 'Total',     value: stats.total,     dark: false },
              { label: 'Pending',   value: stats.pending,   dark: false },
              { label: 'Ready',     value: stats.paidReady, dark: true  },
            ].map(s => (
              <div
                key={s.label}
                className={`px-5 py-4 rounded-[1.5rem] border text-center ${
                  s.dark
                    ? 'bg-blue-600 border-blue-600 shadow-xl shadow-blue-100'
                    : 'bg-white border-slate-100 shadow-sm'
                }`}
              >
                <p className={`text-[8px] font-black uppercase mb-1 ${s.dark ? 'text-blue-100' : 'text-slate-400'}`}>
                  {s.label}
                </p>
                <p className={`text-xl font-black ${s.dark ? 'text-white' : 'text-slate-900'}`}>
                  {s.value}
                </p>
              </div>
            ))}
          </div>
        </header>

        {/* ── Filter tabs ───────────────────────────────── */}
        <div className="flex flex-wrap gap-2 mb-8">
          {TABS.map(tab => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-4 py-2 rounded-full text-[11px] font-black uppercase tracking-widest border transition-all ${
                filter === tab
                  ? 'bg-slate-900 text-white border-slate-900'
                  : 'bg-white text-slate-500 border-slate-200 hover:border-blue-300 hover:text-blue-600'
              }`}
            >
              {tab}
              <span className="ml-1.5 opacity-60">
                ({tab === 'All'
                  ? appointments.length
                  : appointments.filter(a => a.status === tab).length})
              </span>
            </button>
          ))}
        </div>

        {/* ── Queue ─────────────────────────────────────── */}
        <div className="space-y-4">
          <h2 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
            <IoTimeOutline size={16} />
            {filter === 'All' ? 'All Appointments' : `${filter} Appointments`}
          </h2>

          {filtered.length === 0 ? (
            <div className="bg-white rounded-[3rem] p-16 border-2 border-dashed border-slate-200 text-center">
              <IoAlertCircleOutline className="mx-auto text-slate-200 mb-4" size={48} />
              <p className="text-slate-400 font-black uppercase tracking-widest text-xs">
                No {filter !== 'All' ? filter.toLowerCase() : ''} appointments found
              </p>
            </div>
          ) : (
            filtered.map(appt => {
              // ✅ FIXED: backend populates 'userId' for the patient, not 'patientId'
              const patient = appt.userId;
              const sc      = STATUS_STYLES[appt.status] || STATUS_STYLES.Pending;
              const isCancelled = appt.status === 'Cancelled';

              return (
                <div
                  key={appt._id}
                  className={`bg-white p-5 md:p-7 rounded-[2rem] border transition-all
                    flex flex-col md:flex-row items-start md:items-center justify-between gap-5
                    ${isCancelled
                      ? 'opacity-40 grayscale border-slate-100'
                      : 'hover:border-blue-200 hover:shadow-xl hover:shadow-blue-900/5 shadow-sm border-slate-100'
                    }`}
                >
                  {/* Left — patient info */}
                  <div className="flex items-center gap-5 flex-1 min-w-0">
                    {/* Avatar */}
                    <img
                      src={
                        patient?.image ||
                        `https://ui-avatars.com/api/?name=${encodeURIComponent(patient?.name || 'Patient')}&background=eff6ff&color=1d4ed8&size=80`
                      }
                      alt={patient?.name || 'Patient'}
                      className="w-16 h-16 rounded-[1.2rem] object-cover flex-shrink-0 border border-slate-100"
                    />

                    <div className="min-w-0">
                      {/* ID tag */}
                      <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
                        #{appt._id.slice(-6).toUpperCase()}
                      </span>

                      {/* Patient name — ✅ FIXED: was appt.patientId?.name */}
                      <h3 className="text-lg md:text-xl font-black text-slate-800 tracking-tight truncate">
                        {patient?.name || 'Private Patient'}
                      </h3>

                      {/* Patient email */}
                      {patient?.email && (
                        <p className="text-[11px] text-slate-400 font-medium truncate">{patient.email}</p>
                      )}

                      {/* Date / slot / payment badges */}
                      <div className="flex flex-wrap gap-2 mt-2">
                        <span className="flex items-center gap-1 px-2.5 py-1 bg-slate-50 rounded-lg text-[9px] font-black text-slate-500 uppercase border border-slate-100">
                          <IoCalendarOutline size={10} className="text-blue-500" />
                          {appt.date} · {appt.slot}
                        </span>

                        <span className={`px-2.5 py-1 rounded-lg text-[9px] font-black uppercase ${
                          appt.payment
                            ? 'bg-emerald-50 text-emerald-600 border border-emerald-100'
                            : 'bg-amber-50 text-amber-500 border border-amber-100'
                        }`}>
                          {appt.payment ? '✔ Paid' : '✘ Unpaid'}
                        </span>

                        {/* Status badge */}
                        <span className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-[9px] font-black uppercase border ${sc.bg} ${sc.text} ${sc.border}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${sc.dot}`} />
                          {appt.status}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Right — actions */}
                  <div className="flex items-center gap-3 w-full md:w-auto flex-shrink-0">
                    {appt.status === 'Completed' ? (
                      <div className="flex items-center gap-2 text-emerald-500 font-black text-[10px] uppercase tracking-widest px-4">
                        <IoCheckmarkDoneCircle size={18} /> Concluded
                      </div>

                    ) : appt.status === 'Pending' ? (
                      /* Doctor can confirm pending appointments */
                      <button
                        onClick={() => handleConfirm(appt._id)}
                        className="flex items-center gap-2 px-6 py-3.5 rounded-xl font-black uppercase text-[10px] tracking-widest
                          bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-100 active:scale-95 transition-all"
                      >
                        <IoCheckmarkCircle size={16} /> Confirm
                      </button>

                    ) : (
                      /* Confirmed appointments — can start video room if paid */
                      <button
                        onClick={() => startConsultation(appt._id, patient?._id)}
                        disabled={!appt.payment || isCancelled}
                        className={`flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl font-black uppercase text-[10px] tracking-widest transition-all
                          ${appt.payment && !isCancelled
                            ? 'bg-slate-900 text-white hover:bg-blue-600 shadow-xl shadow-slate-200 active:scale-95'
                            : 'bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200'
                          }`}
                      >
                        <IoPlayCircle size={18} />
                        {appt.payment ? 'Start Session' : 'Awaiting Payment'}
                      </button>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

      </div>
    </div>
  );
};

export default DoctorDashboard;