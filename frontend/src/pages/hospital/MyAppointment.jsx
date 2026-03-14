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
  const location  = useLocation();
  const navigate  = useNavigate();

  const [appointments, setAppointments] = useState(location.state?.freshAppointments || []);
  const [loading, setLoading]           = useState(!location.state?.freshAppointments);

  const fetchAppointments = useCallback(async () => {
    try {
      setLoading(true);
      const { data } = await API.get('/appointments/my-appointments');
      if (data.success) setAppointments(data.appointments);
    } catch (error) {
      console.error('Fetch Error:', error);
      toast.error('Unable to sync health records.');
    } finally {
      setTimeout(() => setLoading(false), 600);
    }
  }, []);

  useEffect(() => {
    if (!location.state?.freshAppointments) fetchAppointments();
  }, [location.state, fetchAppointments]);

  const handleJoinMeeting = async (appointmentId) => {
    const id = toast.loading('Establishing secure connection...');
    try {
      const { data } = await API.get(`/meetings/join/${appointmentId}`);
      if (data.success) { toast.dismiss(id); navigate(`/video-consultation/${data.roomId}`); }
    } catch { toast.error('Room not active. Please join at your scheduled time.', { id }); }
  };

  const handlePayment = async (appointmentId) => {
    const id = toast.loading('Processing clinical fee...');
    try {
      const { data } = await API.post('/appointments/mark-as-paid', { appointmentId });
      if (data.success) { toast.success('Payment Verified', { id }); fetchAppointments(); }
    } catch { toast.error('Transaction declined', { id }); }
  };

  const handleCancel = async (id) => {
    try {
      const { data } = await API.patch(`/appointments/cancel/${id}`);
      if (data.success) {
        toast.success('Consultation Cancelled');
        setAppointments(prev => prev.map(a => a._id === id ? { ...a, status: 'Cancelled' } : a));
      }
    } catch (error) { toast.error(error.response?.data?.message || 'Unable to cancel'); }
  };

  if (loading) return (
    <div style={{ minHeight:'100vh', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', background:'#fff' }}>
      <div style={{ width:44, height:44, border:'4px solid #dbeafe', borderTopColor:'#2563eb', borderRadius:'50%', animation:'spin 0.8s linear infinite', marginBottom:16 }}/>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      <p style={{ fontSize:10, fontWeight:900, color:'#94a3b8', textTransform:'uppercase', letterSpacing:'0.3em' }}>Syncing Records...</p>
    </div>
  );

  return (
    <div style={{ minHeight:'100vh', background:'#fdfdfd', padding:'clamp(48px,8vw,80px) clamp(14px,4vw,32px)' }}>
      <style>{`
        .appt-header  { display:flex; flex-direction:column; gap:20px; margin-bottom:clamp(40px,8vw,64px); }
        .appt-card    { display:flex; flex-direction:column; gap:20px; align-items:center; padding:clamp(20px,4vw,32px); border-radius:clamp(20px,4vw,48px); }
        .appt-actions { width:100%; }
        .appt-info    { text-align:center; flex:1; }

        @media (min-width: 640px) {
          .appt-header { flex-direction:row; align-items:flex-end; justify-content:space-between; }
          .appt-card   { flex-direction:row; align-items:center; }
          .appt-info   { text-align:left; }
          .appt-actions{ width:auto; min-width:220px; }
        }
      `}</style>

      <div style={{ maxWidth:900, margin:'0 auto' }}>

        {/* Header */}
        <header className="appt-header">
          <div>
            <h1 style={{ fontSize:'clamp(2rem,6vw,3.5rem)', fontWeight:900, color:'#0f172a', letterSpacing:'-0.04em', textTransform:'uppercase', margin:0 }}>
              My <span style={{ color:'#2563eb' }}>Visits</span>
            </h1>
            <p style={{ fontSize:9, fontWeight:900, textTransform:'uppercase', letterSpacing:'0.2em', color:'#94a3b8', display:'flex', alignItems:'center', gap:7, marginTop:8 }}>
              <span style={{ width:8, height:8, borderRadius:'50%', background:'#10b981', display:'inline-block', animation:'pulse 2s ease-in-out infinite' }}/>
              <style>{`@keyframes pulse{0%,100%{opacity:1}50%{opacity:0.5}}`}</style>
              Encrypted Health Portal
            </p>
          </div>
          <button onClick={()=>navigate('/doctors')}
            style={{ padding:'clamp(10px,2vw,16px) clamp(18px,3vw,32px)', background:'#fff', border:'1px solid #f1f5f9', borderRadius:18, fontSize:10, fontWeight:900, textTransform:'uppercase', letterSpacing:'0.15em', cursor:'pointer', boxShadow:'0 1px 4px rgba(0,0,0,0.06)', transition:'all 0.2s', whiteSpace:'nowrap' }}
            onMouseEnter={e=>{e.currentTarget.style.background='#0f172a';e.currentTarget.style.color='#fff';}}
            onMouseLeave={e=>{e.currentTarget.style.background='#fff';e.currentTarget.style.color='inherit';}}>
            Schedule New Visit
          </button>
        </header>

        {/* Cards */}
        <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
          <AnimatePresence mode="popLayout">
            {appointments.length > 0 ? appointments.map(item => (
              <motion.div layout key={item._id}
                initial={{ opacity:0, x:-20 }} animate={{ opacity:1, x:0 }} exit={{ opacity:0, scale:0.95 }}
                className="appt-card"
                style={{ background:'#fff', border:`1px solid ${item.status==='Cancelled'?'#f8fafc':'#f1f5f9'}`, boxShadow:item.status==='Cancelled'?'none':'0 2px 16px rgba(0,0,0,0.04)', opacity:item.status==='Cancelled'?0.5:1, filter:item.status==='Cancelled'?'grayscale(1)':'none', transition:'box-shadow 0.3s' }}>

                {/* Avatar */}
                <div style={{ position:'relative', flexShrink:0 }}>
                  <img src={item.doctorId?.userId?.image||'https://via.placeholder.com/150'} alt="Specialist"
                    style={{ width:clamp(80,28,112), height:clamp(80,28,112), width:'clamp(80px,15vw,110px)', height:'clamp(80px,15vw,110px)', borderRadius:'clamp(16px,4vw,32px)', objectFit:'cover', background:'#f1f5f9', border:'4px solid #fff', boxShadow:'0 4px 20px rgba(0,0,0,0.1)' }}/>
                  {item.payment && item.status!=='Cancelled' && (
                    <div style={{ position:'absolute', top:-6, right:-6, width:28, height:28, background:'#2563eb', borderRadius:10, display:'flex', alignItems:'center', justifyContent:'center', color:'#fff', border:'3px solid #fff', boxShadow:'0 2px 8px rgba(37,99,235,0.3)' }}>
                      <IoCheckmarkCircle size={16}/>
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="appt-info">
                  <span style={{ fontSize:9, fontWeight:900, color:'rgba(37,99,235,0.4)', textTransform:'uppercase', letterSpacing:'0.2em' }}>
                    Clinical ID: {item._id.slice(-8).toUpperCase()}
                  </span>
                  <h3 style={{ fontSize:'clamp(1.2rem,3vw,1.6rem)', fontWeight:900, color:'#0f172a', letterSpacing:'-0.03em', margin:'4px 0 2px' }}>
                    Dr. {item.doctorId?.userId?.name}
                  </h3>
                  <p style={{ fontSize:10, fontWeight:900, color:'#2563eb', textTransform:'uppercase', letterSpacing:'0.15em', marginBottom:14 }}>
                    {item.doctorId?.specialization}
                  </p>
                  <div style={{ display:'flex', flexWrap:'wrap', gap:8, justifyContent:'center' }} className="appt-chips">
                    <style>{`.appt-info .appt-chips{justify-content:flex-start}`}</style>
                    <div style={{ display:'flex', alignItems:'center', gap:6, padding:'8px 14px', background:'#f8fafc', borderRadius:14, fontSize:9, fontWeight:900, textTransform:'uppercase', letterSpacing:'0.1em', color:'#475569' }}>
                      <IoCalendarOutline style={{ color:'#2563eb' }} size={13}/> {item.date}
                    </div>
                    <div style={{ display:'flex', alignItems:'center', gap:6, padding:'8px 14px', background:'#f8fafc', borderRadius:14, fontSize:9, fontWeight:900, textTransform:'uppercase', letterSpacing:'0.1em', color:'#475569' }}>
                      <IoTimeOutline style={{ color:'#2563eb' }} size={13}/> {item.slot}
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="appt-actions" style={{ display:'flex', flexDirection:'column', gap:10 }}>
                  {item.payment && item.status==='Confirmed' && (
                    <button onClick={()=>handleJoinMeeting(item._id)}
                      style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:10, width:'100%', padding:'clamp(12px,2vw,18px)', background:'#2563eb', color:'#fff', fontSize:10, fontWeight:900, textTransform:'uppercase', letterSpacing:'0.15em', borderRadius:16, border:'none', cursor:'pointer', boxShadow:'0 8px 24px rgba(37,99,235,0.25)', transition:'background 0.2s' }}
                      onMouseEnter={e=>e.currentTarget.style.background='#0f172a'}
                      onMouseLeave={e=>e.currentTarget.style.background='#2563eb'}>
                      <IoVideocam size={16}/> Start Consultation
                    </button>
                  )}

                  {!item.payment && item.status!=='Cancelled' ? (
                    <button onClick={()=>handlePayment(item._id)}
                      style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:10, width:'100%', padding:'clamp(12px,2vw,18px)', background:'#0f172a', color:'#fff', fontSize:10, fontWeight:900, textTransform:'uppercase', letterSpacing:'0.15em', borderRadius:16, border:'none', cursor:'pointer', boxShadow:'0 8px 24px rgba(0,0,0,0.12)', transition:'background 0.2s' }}
                      onMouseEnter={e=>e.currentTarget.style.background='#2563eb'}
                      onMouseLeave={e=>e.currentTarget.style.background='#0f172a'}>
                      <IoWalletOutline size={15}/> Pay Fee: ${item.amount}
                    </button>
                  ) : (
                    <div style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:8, padding:'clamp(12px,2vw,18px)', borderRadius:16, fontSize:10, fontWeight:900, textTransform:'uppercase', border:'1px solid', ...(item.payment ? { background:'#f0fdf4', borderColor:'#bbf7d0', color:'#16a34a' } : { background:'#f8fafc', borderColor:'#e2e8f0', color:'#94a3b8' }) }}>
                      {item.payment ? 'Payment Received' : 'No Payment Required'}
                    </div>
                  )}

                  <div style={{ padding:'8px 0', borderRadius:10, fontSize:9, fontWeight:900, textTransform:'uppercase', textAlign:'center', borderBottom:'2px solid', ...(
                    item.status==='Cancelled' ? { color:'#cbd5e1', borderColor:'#f1f5f9' } :
                    item.status==='Confirmed' ? { color:'#2563eb', borderColor:'#bfdbfe', background:'#eff6ff' } :
                    { color:'#d97706', borderColor:'#fde68a', background:'#fffbeb' }
                  )}}>
                    {item.status}
                  </div>

                  {item.status!=='Cancelled' && (
                    <button onClick={()=>handleCancel(item._id)}
                      style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:6, background:'none', border:'none', cursor:'pointer', fontSize:9, fontWeight:900, textTransform:'uppercase', letterSpacing:'0.12em', color:'#94a3b8', padding:'4px 0', transition:'color 0.2s' }}
                      onMouseEnter={e=>e.currentTarget.style.color='#ef4444'}
                      onMouseLeave={e=>e.currentTarget.style.color='#94a3b8'}>
                      <IoCloseCircleOutline size={15}/> Cancel Booking
                    </button>
                  )}
                </div>
              </motion.div>
            )) : (
              <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }}
                style={{ textAlign:'center', padding:'clamp(48px,10vw,100px) 24px', background:'#f8fafc', borderRadius:'clamp(24px,5vw,48px)', border:'2px dashed #e2e8f0' }}>
                <div style={{ width:64, height:64, background:'#fff', borderRadius:20, display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 20px', boxShadow:'0 2px 8px rgba(0,0,0,0.06)' }}>
                  <IoMedkitOutline style={{ color:'#cbd5e1' }} size={28}/>
                </div>
                <h3 style={{ fontSize:'1.2rem', fontWeight:900, color:'#0f172a', margin:'0 0 8px' }}>No Appointments Found</h3>
                <p style={{ color:'#94a3b8', fontWeight:500, margin:'0 0 28px', fontSize:14 }}>You haven't scheduled any medical consultations yet.</p>
                <button onClick={()=>navigate('/doctors')}
                  style={{ padding:'14px 32px', background:'#2563eb', color:'#fff', borderRadius:16, fontWeight:900, fontSize:10, textTransform:'uppercase', letterSpacing:'0.15em', border:'none', cursor:'pointer', boxShadow:'0 8px 24px rgba(37,99,235,0.25)' }}>
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