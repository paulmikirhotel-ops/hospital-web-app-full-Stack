import React, { useEffect, useState, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  IoCalendarOutline, IoTimeOutline, IoCloseCircleOutline, 
  IoCheckmarkCircle, IoWalletOutline, IoVideocam, IoMedkitOutline 
} from 'react-icons/io5';

import API from '../../api/axiosConfig';

const MyAppointments = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [appointments, setAppointments] = useState(location.state?.freshAppointments || []);
  const [loading, setLoading] = useState(!location.state?.freshAppointments);

  const fetchAppointments = useCallback(async () => {
    try {
      setLoading(true);
      const { data } = await API.get('/appointments/my-appointments');
      if (data.success) {
        setAppointments(data.appointments);
      }
    } catch (error) {
      console.error("Fetch Error:", error);
      toast.error("Unable to sync health records.");
    } finally {
      setTimeout(() => setLoading(false), 600);
    }
  }, []);

  useEffect(() => {
    if (!location.state?.freshAppointments) {
      fetchAppointments();
    }
  }, [location.state, fetchAppointments]);

  const handleJoinMeeting = async (appointmentId) => {
    const loadingToast = toast.loading("Establishing secure connection...");
    try {
      const { data } = await API.get(`/meetings/join/${appointmentId}`);
      if (data.success) {
        toast.dismiss(loadingToast);
        navigate(`/video-consultation/${data.roomId}`);
      }
    } catch (err) {
      toast.error("Room not active. Please join at your scheduled time.", { id: loadingToast });
    }
  };

  const handlePayment = async (appointmentId) => {
    const loadingToast = toast.loading("Processing clinical fee...");
    try {
      const { data } = await API.post('/appointments/mark-as-paid', { appointmentId });
      if (data.success) {
        toast.success("Payment Verified", { id: loadingToast });
        // Refresh list to show confirmed status
        fetchAppointments();
      }
    } catch (error) {
      toast.error("Transaction declined", { id: loadingToast });
    }
  };

  const handleCancel = async (id) => {
    try {
      const { data } = await API.patch(`/appointments/cancel/${id}`);
      if (data.success) {
        toast.success("Consultation Cancelled");
        setAppointments(prev => prev.map(app => 
          app._id === id ? { ...app, status: 'Cancelled' } : app
        ));
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to cancel");
    }
  };

  if (loading) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white">
      <div className="w-12 h-12 border-4 border-blue-50 border-t-blue-600 rounded-full animate-spin mb-4"></div>
      <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Syncing Records...</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#FDFDFD] py-12 px-4 md:px-8">
      <div className="max-w-5xl mx-auto">
        
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
          <div className="space-y-2">
            <h1 className="text-5xl font-black text-slate-900 tracking-tighter uppercase">My <span className="text-blue-600">Visits</span></h1>
            <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span> Encrypted Health Portal
            </p>
          </div>
          <button 
            onClick={() => navigate('/doctors')} 
            className="px-8 py-4 bg-white border border-slate-100 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-900 hover:text-white transition-all shadow-sm active:scale-95"
          >
            Schedule New Visit
          </button>
        </header>

        <div className="grid grid-cols-1 gap-6">
          <AnimatePresence mode="popLayout">
            {appointments.length > 0 ? (
              appointments.map((item) => (
                <motion.div 
                  layout
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  key={item._id} 
                  className={`bg-white p-6 md:p-8 rounded-[3rem] border transition-all flex flex-col md:flex-row gap-8 items-center ${
                    item.status === 'Cancelled' ? 'border-slate-50 grayscale opacity-50' : 'border-slate-100 shadow-sm hover:shadow-xl hover:shadow-blue-900/5'
                  }`}
                >
                  <div className="relative flex-shrink-0">
                    {/* 🚀 FIX: Access image via populated userId */}
                    <img 
                      src={item.doctorId?.userId?.image || 'https://via.placeholder.com/150'} 
                      className="w-28 h-28 rounded-[2.5rem] object-cover bg-slate-100 border-4 border-white shadow-lg" 
                      alt="Specialist" 
                    />
                    {item.payment && item.status !== 'Cancelled' && (
                      <div className="absolute -top-2 -right-2 w-8 h-8 bg-blue-600 rounded-2xl flex items-center justify-center text-white border-4 border-white shadow-md">
                        <IoCheckmarkCircle size={18} />
                      </div>
                    )}
                  </div>
                  
                  <div className="flex-1 text-center md:text-left space-y-1">
                    <span className="text-[9px] font-black text-blue-600/40 uppercase tracking-[0.2em]">Clinical ID: {item._id.slice(-8).toUpperCase()}</span>
                    {/* 🚀 FIX: Access name via populated userId */}
                    <h3 className="text-2xl font-black text-slate-900 tracking-tight">Dr. {item.doctorId?.userId?.name}</h3>
                    <p className="text-blue-600 text-[10px] font-black uppercase tracking-widest pb-4">{item.doctorId?.specialization}</p>
                    
                    <div className="flex flex-wrap justify-center md:justify-start gap-2">
                      <div className="flex items-center gap-2 px-5 py-2.5 bg-slate-50 rounded-2xl text-slate-600 font-black text-[9px] uppercase tracking-tighter">
                        <IoCalendarOutline className="text-blue-600" size={14} /> {item.date}
                      </div>
                      <div className="flex items-center gap-2 px-5 py-2.5 bg-slate-50 rounded-2xl text-slate-600 font-black text-[9px] uppercase tracking-tighter">
                        <IoTimeOutline className="text-blue-600" size={14} /> {item.slot}
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-3 w-full md:w-auto min-w-[240px]">
                    {item.payment && item.status === 'Confirmed' && (
                      <button 
                        onClick={() => handleJoinMeeting(item._id)}
                        className="flex items-center justify-center gap-3 w-full py-5 bg-blue-600 text-white text-[10px] font-black uppercase rounded-2xl hover:bg-slate-900 transition-all shadow-xl shadow-blue-100 group"
                      >
                        <IoVideocam size={18} className="group-hover:scale-110 transition-transform" /> Start Consultation
                      </button>
                    )}

                    {!item.payment && item.status !== 'Cancelled' ? (
                      <button 
                        onClick={() => handlePayment(item._id)}
                        className="group flex items-center justify-center gap-3 w-full py-5 bg-slate-900 text-white text-[10px] font-black uppercase rounded-2xl hover:bg-blue-600 transition-all shadow-xl"
                      >
                        <IoWalletOutline size={16} /> Pay Fee: ${item.amount}
                      </button>
                    ) : (
                      <div className={`flex items-center justify-center gap-2 py-5 rounded-2xl text-[10px] font-black uppercase border ${
                        item.payment ? 'bg-emerald-50 border-emerald-100 text-emerald-600' : 'bg-slate-50 border-slate-100 text-slate-400'
                      }`}>
                        {item.payment ? 'Payment Received' : 'No Payment Required'}
                      </div>
                    )}

                    <div className={`py-2 rounded-xl text-[9px] font-black uppercase text-center border-b-2 ${
                      item.status === 'Cancelled' ? 'bg-white text-slate-300 border-slate-100' : 
                      item.status === 'Confirmed' ? 'bg-blue-50 text-blue-600 border-blue-100' : 
                      'bg-amber-50 text-amber-500 border-amber-100'
                    }`}>
                      {item.status}
                    </div>

                    {item.status !== 'Cancelled' && (
                      <button 
                        onClick={() => handleCancel(item._id)}
                        className="text-slate-400 hover:text-red-500 transition-colors text-[9px] font-black uppercase flex items-center justify-center gap-1.5 pt-1"
                      >
                        <IoCloseCircleOutline size={16} /> Cancel Booking
                      </button>
                    )}
                  </div>
                </motion.div>
              ))
            ) : (
              <motion.div 
                initial={{ opacity: 0, y: 20 }} 
                animate={{ opacity: 1, y: 0 }}
                className="text-center py-32 bg-slate-50 rounded-[4rem] border-2 border-dashed border-slate-200"
              >
                <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-sm">
                  <IoMedkitOutline className="text-slate-300" size={32} />
                </div>
                <h3 className="text-xl font-black text-slate-900 mb-2">No Appointments Found</h3>
                <p className="text-slate-400 font-medium mb-8">You haven't scheduled any medical consultations yet.</p>
                <button 
                  onClick={() => navigate('/doctors')} 
                  className="px-10 py-4 bg-blue-600 text-white rounded-2xl font-black text-[10px] uppercase shadow-lg shadow-blue-100 hover:bg-slate-900 transition-all"
                >
                  Find a Doctor
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default MyAppointments;