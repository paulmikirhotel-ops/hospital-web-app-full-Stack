import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  IoChevronForwardOutline, IoSearchOutline, IoCallOutline,
  IoTimeOutline, IoStarOutline, IoStar, IoCheckmarkCircle,
  IoLocationOutline, IoFilterOutline, IoGridOutline, IoListOutline,
  IoHeartOutline, IoShieldCheckmarkOutline, IoMedicalOutline,
  IoAlertCircleOutline, IoCloseOutline,
} from 'react-icons/io5';
import API from '../../api/axiosConfig';

/* ── STYLES ───────────────────────────────────────────────────── */
const ServicesStyles = () => (
  <style>{`
    .srv-root { box-sizing: border-box; }
    .srv-root *, .srv-root *::before, .srv-root *::after { box-sizing: border-box; }

    /* Accreditation */
    .accred-bar {
      background: #1e3a8a; color: #fff;
      padding: 8px 16px; text-align: center;
      font-size: 11px; font-weight: 700;
      letter-spacing: 0.12em; text-transform: uppercase;
    }

    /* Emergency bar */
    .emerg-bar {
      background: #1d4ed8; color: #fff;
      padding: 8px 16px;
      display: flex; align-items: center; justify-content: center;
      gap: 10px; flex-wrap: wrap;
      font-size: 11px; font-weight: 700;
      text-transform: uppercase; letter-spacing: 0.12em;
    }

    /* Stats strip */
    .stats-strip {
      background: #fff;
      border-bottom: 1px solid #f1f5f9;
      padding: 20px 16px;
    }
    .stats-grid {
      max-width: 1280px; margin: 0 auto;
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 16px; text-align: center;
    }

    /* Page layout */
    .srv-page { background: #f8fafc; min-height: 100vh; }
    .srv-inner {
      max-width: 1280px; margin: 0 auto;
      padding: clamp(32px,5vw,64px) clamp(16px,4vw,48px) clamp(48px,7vw,96px);
    }

    /* Header */
    .srv-header { margin-bottom: clamp(28px,4vw,48px); text-align: center; }
    .srv-header h1 { font-size: clamp(2.2rem,6vw,3.5rem); font-weight: 900; color: #0f172a; letter-spacing: -0.04em; margin-bottom: 12px; }

    /* Filters bar */
    .filters-bar {
      background: #fff; border-radius: 18px;
      border: 1px solid #f1f5f9;
      box-shadow: 0 2px 12px rgba(0,0,0,0.04);
      padding: 14px; margin-bottom: 20px;
      display: flex; gap: 12px; align-items: center;
      flex-wrap: wrap;
    }
    .filters-bar .search-wrap { position: relative; flex: 1; min-width: 180px; }
    .filters-bar .search-wrap input {
      width: 100%; padding: 10px 14px 10px 40px;
      border-radius: 12px; border: 1px solid #e2e8f0;
      font-size: 14px; color: #1e293b;
      outline: none; transition: border-color 0.2s;
    }
    .filters-bar .search-wrap input:focus { border-color: #3b82f6; box-shadow: 0 0 0 3px rgba(59,130,246,0.1); }
    .filters-bar .search-wrap svg { position: absolute; left: 12px; top: 50%; transform: translateY(-50%); color: #94a3b8; }

    /* Category pills scroll */
    .cat-scroll {
      overflow-x: auto; -webkit-overflow-scrolling: touch;
      display: flex; gap: 8px; padding-bottom: 4px;
      margin-bottom: 20px; scrollbar-width: none;
    }
    .cat-scroll::-webkit-scrollbar { display: none; }
    .cat-pill {
      flex-shrink: 0; padding: 7px 16px;
      border-radius: 999px; font-size: 11px; font-weight: 800;
      text-transform: uppercase; letter-spacing: 0.12em;
      cursor: pointer; transition: all 0.2s; border: 1px solid #e2e8f0;
      background: #fff; color: #64748b; white-space: nowrap;
    }
    .cat-pill:hover  { border-color: #93c5fd; color: #1d4ed8; }
    .cat-pill.active { background: #1d4ed8; color: #fff; border-color: #1d4ed8; }

    /* Services grid */
    .srv-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 20px;
    }
    .srv-list { display: flex; flex-direction: column; gap: 14px; }

    /* Service card grid */
    .srv-card-grid {
      background: #fff; border-radius: 28px;
      padding: clamp(20px,3vw,32px);
      border: 1px solid #f1f5f9;
      box-shadow: 0 2px 8px rgba(0,0,0,0.04);
      transition: box-shadow 0.3s, border-color 0.3s, transform 0.3s;
      cursor: pointer; display: flex; flex-direction: column;
    }
    .srv-card-grid:hover { box-shadow: 0 20px 60px rgba(29,94,216,0.12); border-color: #bfdbfe; transform: translateY(-4px); }

    /* Service card list */
    .srv-card-list {
      background: #fff; border-radius: 18px;
      border: 1px solid #f1f5f9;
      box-shadow: 0 2px 8px rgba(0,0,0,0.04);
      transition: box-shadow 0.25s, border-color 0.25s;
      cursor: pointer;
      display: flex; gap: 16px; padding: clamp(14px,2vw,24px);
      align-items: center;
    }
    .srv-card-list:hover { box-shadow: 0 10px 30px rgba(29,94,216,0.1); border-color: #bfdbfe; }

    /* Trust badges */
    .trust-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 16px; margin-top: clamp(32px,5vw,64px);
    }
    .trust-card {
      background: #fff; border-radius: 18px;
      border: 1px solid #f1f5f9; padding: 18px;
      display: flex; align-items: flex-start; gap: 14px;
    }

    /* CTA banner */
    .cta-banner {
      background: #1d4ed8; border-radius: 28px;
      padding: clamp(24px,4vw,56px) clamp(20px,4vw,56px);
      display: flex; align-items: center;
      justify-content: space-between; gap: 24px;
      flex-wrap: wrap; margin-top: clamp(28px,4vw,56px);
    }
    .cta-btns { display: flex; gap: 12px; flex-wrap: wrap; }

    /* Modal */
    .modal-overlay {
      position: fixed; inset: 0;
      background: rgba(15,23,42,0.6);
      backdrop-filter: blur(4px);
      z-index: 50;
      display: flex; align-items: center; justify-content: center;
      padding: 16px;
    }
    .modal-box {
      background: #fff; border-radius: 28px;
      width: 100%; max-width: 480px;
      max-height: 90vh; overflow-y: auto;
      box-shadow: 0 40px 80px rgba(0,0,0,0.3);
    }
    .time-grid {
      display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px;
    }

    /* ── RESPONSIVE ── */
    @media (max-width: 1024px) {
      .srv-grid   { grid-template-columns: repeat(2, 1fr) !important; }
      .trust-grid { grid-template-columns: repeat(2, 1fr) !important; }
      .stats-grid { grid-template-columns: repeat(2, 1fr) !important; }
    }

    @media (max-width: 640px) {
      .srv-grid        { grid-template-columns: 1fr !important; gap: 14px !important; }
      .trust-grid      { grid-template-columns: 1fr 1fr !important; gap: 10px !important; }
      .stats-grid      { grid-template-columns: repeat(2, 1fr) !important; }
      .cta-banner      { flex-direction: column; align-items: flex-start; border-radius: 20px; }
      .cta-btns        { width: 100%; }
      .cta-btns a, .cta-btns button { flex: 1; justify-content: center; }
      .srv-card-list   { flex-direction: row; }
      .filters-bar     { flex-direction: column; align-items: stretch; }
      .filters-bar .search-wrap { min-width: unset; }
      .time-grid       { grid-template-columns: repeat(3, 1fr); }
      .modal-box       { border-radius: 20px; }
    }

    @media (max-width: 400px) {
      .trust-grid { grid-template-columns: 1fr !important; }
      .time-grid  { grid-template-columns: repeat(2, 1fr) !important; }
    }
  `}</style>
);

/* ── APPOINTMENT MODAL ── */
const AppointmentModal = ({ service, onClose }) => {
  const [form, setForm]           = useState({ name:'', phone:'', date:'', time:'' });
  const [submitted, setSubmitted] = useState(false);
  const times = ['08:00','09:30','11:00','14:00','15:30','17:00'];

  return (
    <div className="modal-overlay" onClick={e=>e.target===e.currentTarget&&onClose()}>
      <motion.div className="modal-box" initial={{ opacity:0, scale:0.95, y:20 }} animate={{ opacity:1, scale:1, y:0 }} exit={{ opacity:0, scale:0.95, y:20 }}>
        {/* Header */}
        <div style={{ background:'#1d4ed8', padding:'clamp(20px,4vw,28px) clamp(20px,4vw,32px)', display:'flex', alignItems:'flex-start', justifyContent:'space-between' }}>
          <div>
            <p style={{ color:'#bfdbfe', fontSize:10, fontWeight:700, textTransform:'uppercase', letterSpacing:'0.2em', marginBottom:4 }}>Book Appointment</p>
            <h3 style={{ color:'#fff', fontSize:'clamp(1.1rem,3vw,1.5rem)', fontWeight:900, letterSpacing:'-0.02em' }}>{service?.title??'Select Department'}</h3>
          </div>
          <button onClick={onClose} style={{ color:'rgba(255,255,255,0.6)', background:'none', border:'none', cursor:'pointer', padding:4, marginTop:2 }}>
            <IoCloseOutline size={24} />
          </button>
        </div>

        <div style={{ padding:'clamp(20px,4vw,32px)' }}>
          {submitted ? (
            <motion.div initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }} style={{ textAlign:'center', padding:'24px 0' }}>
              <IoCheckmarkCircle style={{ color:'#3b82f6', margin:'0 auto 16px', display:'block' }} size={52} />
              <h4 style={{ color:'#0f172a', fontWeight:900, fontSize:'1.4rem', marginBottom:8 }}>Appointment Confirmed</h4>
              <p style={{ color:'#64748b', fontSize:13, marginBottom:4 }}>SMS sent to <strong>{form.phone}</strong></p>
              <p style={{ color:'#64748b', fontSize:13 }}>Ref # <span style={{ fontWeight:700, color:'#1d4ed8' }}>APT-{Math.floor(Math.random()*90000)+10000}</span></p>
              <button onClick={onClose} style={{ marginTop:24, background:'#1d4ed8', color:'#fff', padding:'12px 32px', borderRadius:999, fontWeight:700, fontSize:13, border:'none', cursor:'pointer' }}>Done</button>
            </motion.div>
          ) : (
            <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
                <div>
                  <label style={{ fontSize:9, fontWeight:800, textTransform:'uppercase', letterSpacing:'0.18em', color:'#94a3b8', display:'block', marginBottom:6 }}>Full Name</label>
                  <input required value={form.name} onChange={e=>setForm({...form,name:e.target.value})} placeholder="Jane Smith"
                    style={{ width:'100%', border:'1px solid #e2e8f0', borderRadius:12, padding:'10px 14px', fontSize:14, color:'#1e293b', outline:'none' }} />
                </div>
                <div>
                  <label style={{ fontSize:9, fontWeight:800, textTransform:'uppercase', letterSpacing:'0.18em', color:'#94a3b8', display:'block', marginBottom:6 }}>Phone</label>
                  <input required type="tel" value={form.phone} onChange={e=>setForm({...form,phone:e.target.value})} placeholder="+1 555 000 0000"
                    style={{ width:'100%', border:'1px solid #e2e8f0', borderRadius:12, padding:'10px 14px', fontSize:14, color:'#1e293b', outline:'none' }} />
                </div>
              </div>
              <div>
                <label style={{ fontSize:9, fontWeight:800, textTransform:'uppercase', letterSpacing:'0.18em', color:'#94a3b8', display:'block', marginBottom:6 }}>Preferred Date</label>
                <input required type="date" value={form.date} onChange={e=>setForm({...form,date:e.target.value})} min={new Date().toISOString().split('T')[0]}
                  style={{ width:'100%', border:'1px solid #e2e8f0', borderRadius:12, padding:'10px 14px', fontSize:16, color:'#1e293b', outline:'none' }} />
              </div>
              <div>
                <label style={{ fontSize:9, fontWeight:800, textTransform:'uppercase', letterSpacing:'0.18em', color:'#94a3b8', display:'block', marginBottom:8 }}>Time Slot</label>
                <div className="time-grid">
                  {times.map(t=>(
                    <button key={t} type="button" onClick={()=>setForm({...form,time:t})}
                      style={{ padding:'10px 4px', borderRadius:12, fontSize:13, fontWeight:700, border:`1px solid ${form.time===t?'#1d4ed8':'#e2e8f0'}`, cursor:'pointer', transition:'all 0.2s', background:form.time===t?'#1d4ed8':'#fff', color:form.time===t?'#fff':'#64748b' }}>
                      {t}
                    </button>
                  ))}
                </div>
              </div>
              <div style={{ display:'flex', alignItems:'flex-start', gap:12, background:'#eff6ff', borderRadius:16, padding:14 }}>
                <IoShieldCheckmarkOutline style={{ color:'#1d4ed8', flexShrink:0, marginTop:2 }} size={17} />
                <p style={{ fontSize:12, color:'#1d4ed8', lineHeight:1.6 }}>We accept Medicare, Medicaid, and 200+ private insurance plans. Bring your card to the appointment.</p>
              </div>
              <button type="button" onClick={()=>form.name&&form.phone&&form.date&&form.time&&setSubmitted(true)}
                style={{ width:'100%', background:'#1d4ed8', color:'#fff', fontWeight:900, padding:'14px', borderRadius:18, fontSize:13, border:'none', cursor:'pointer', transition:'background 0.2s', letterSpacing:'0.05em' }}>
                Confirm Appointment
              </button>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

/* ── STARS ── */
const Stars = ({ rating=4.8 }) => {
  const full = Math.floor(rating);
  return (
    <span style={{ display:'flex', alignItems:'center', gap:2 }}>
      {Array.from({length:5}).map((_,i)=>(
        <span key={i} style={{ color:i<full?'#3b82f6':'#e2e8f0', display:'flex' }}>
          {i<full?<IoStar size={11}/>:<IoStarOutline size={11}/>}
        </span>
      ))}
      <span style={{ fontSize:10, color:'#94a3b8', marginLeft:4, fontWeight:600 }}>{rating}</span>
    </span>
  );
};

/* ── SERVICE CARD ── */
const ServiceCard = ({ service, index, view, onBook }) => {
  const navigate    = useNavigate();
  const rating      = (4.5+(index%5)*0.1).toFixed(1);
  const reviewCount = 120+index*17;
  const waitTime    = `${8+(index%5)*3} min`;
  const specialists = 5+(index%10);

  if (view==='list') return (
    <motion.div className="srv-card-list" initial={{ opacity:0, x:-16 }} animate={{ opacity:1, x:0 }} transition={{ delay:index*0.04 }}>
      <div style={{ width:56, height:56, borderRadius:14, background:'#f8fafc', display:'flex', alignItems:'center', justifyContent:'center', padding:10, flexShrink:0 }}>
        <img src={service.image} alt={service.title} style={{ width:'100%', height:'100%', objectFit:'contain' }} />
      </div>
      <div style={{ flex:1, minWidth:0 }}>
        <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', gap:10, flexWrap:'wrap' }}>
          <div>
            <span style={{ fontSize:9, fontWeight:900, textTransform:'uppercase', letterSpacing:'0.18em', color:'#2563eb' }}>{service.category||'Clinical Unit'}</span>
            <h3 style={{ fontSize:'clamp(0.95rem,2.5vw,1.1rem)', fontWeight:900, color:'#0f172a', marginTop:2, letterSpacing:'-0.02em' }}>{service.title}</h3>
          </div>
          <span style={{ fontSize:9, fontWeight:800, textTransform:'uppercase', letterSpacing:'0.14em', padding:'4px 10px', borderRadius:999, background:'#eff6ff', color:service.isAvailable?'#2563eb':'#93c5fd', flexShrink:0 }}>
            {service.isAvailable?'Available':'Unavailable'}
          </span>
        </div>
        <p style={{ fontSize:12, color:'#64748b', lineHeight:1.6, margin:'6px 0 10px', display:'-webkit-box', WebkitLineClamp:1, WebkitBoxOrient:'vertical', overflow:'hidden' }}>{service.description}</p>
        <div style={{ display:'flex', alignItems:'center', gap:14, flexWrap:'wrap' }}>
          <Stars rating={parseFloat(rating)} />
          <span style={{ fontSize:10, color:'#94a3b8' }}><strong style={{ color:'#475569' }}>{reviewCount}</strong> reviews</span>
          <span style={{ fontSize:10, color:'#94a3b8', display:'flex', alignItems:'center', gap:3 }}><IoTimeOutline size={10}/> Avg <strong style={{ color:'#475569', marginLeft:2 }}>{waitTime}</strong></span>
        </div>
      </div>
      <div style={{ display:'flex', flexDirection:'column', gap:8, flexShrink:0 }}>
        <button onClick={()=>onBook(service)} style={{ background:'#1d4ed8', color:'#fff', fontSize:11, fontWeight:800, padding:'8px 16px', borderRadius:12, border:'none', cursor:'pointer', whiteSpace:'nowrap', transition:'background 0.2s' }}>Book Now</button>
        <button onClick={()=>navigate(`/services/${service._id}`)} style={{ border:'1px solid #e2e8f0', color:'#64748b', fontSize:11, fontWeight:700, padding:'8px 16px', borderRadius:12, cursor:'pointer', whiteSpace:'nowrap', background:'#fff', transition:'all 0.2s' }}>Learn More</button>
      </div>
    </motion.div>
  );

  return (
    <motion.div className="srv-card-grid" initial={{ opacity:0, y:24 }} animate={{ opacity:1, y:0 }} transition={{ delay:index*0.07 }}>
      <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', marginBottom:20 }}>
        <div style={{ width:56, height:56, borderRadius:18, background:'#f8fafc', display:'flex', alignItems:'center', justifyContent:'center', padding:10 }}>
          <img src={service.image} alt={service.title} style={{ width:'100%', height:'100%', objectFit:'contain' }} />
        </div>
        <span style={{ fontSize:9, fontWeight:800, textTransform:'uppercase', letterSpacing:'0.14em', padding:'4px 10px', borderRadius:999, background:'#eff6ff', color:service.isAvailable?'#2563eb':'#93c5fd' }}>
          {service.isAvailable?'Available':'Unavailable'}
        </span>
      </div>
      <span style={{ fontSize:9, fontWeight:900, textTransform:'uppercase', letterSpacing:'0.2em', color:'#2563eb' }}>{service.category||'Clinical Unit'}</span>
      <h3 style={{ fontSize:'clamp(1rem,2.5vw,1.2rem)', fontWeight:900, color:'#0f172a', margin:'4px 0 8px', letterSpacing:'-0.02em', lineHeight:1.3 }}>{service.title}</h3>
      <p style={{ fontSize:12, color:'#64748b', lineHeight:1.7, marginBottom:14, flex:1, display:'-webkit-box', WebkitLineClamp:2, WebkitBoxOrient:'vertical', overflow:'hidden' }}>{service.description}</p>
      <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:10, paddingBottom:10, borderBottom:'1px solid #f1f5f9' }}>
        <Stars rating={parseFloat(rating)} />
        <span style={{ fontSize:10, color:'#94a3b8' }}>({reviewCount})</span>
      </div>
      <div style={{ display:'flex', alignItems:'center', gap:14, marginBottom:16, flexWrap:'wrap' }}>
        <span style={{ fontSize:10, color:'#94a3b8', display:'flex', alignItems:'center', gap:4 }}><IoTimeOutline size={11}/> Wait: <strong style={{ color:'#475569', marginLeft:2 }}>{waitTime}</strong></span>
        <span style={{ fontSize:10, color:'#94a3b8', display:'flex', alignItems:'center', gap:4 }}><IoMedicalOutline size={11}/> <strong style={{ color:'#475569' }}>{specialists}</strong> Specialists</span>
      </div>
      <div style={{ display:'flex', alignItems:'center', gap:10 }}>
        <button onClick={e=>{e.stopPropagation();onBook(service);}} style={{ flex:1, background:'#1d4ed8', color:'#fff', fontSize:11, fontWeight:900, padding:'11px 8px', borderRadius:16, border:'none', cursor:'pointer', transition:'background 0.2s' }}>Book Appointment</button>
        <button onClick={()=>navigate(`/services/${service._id}`)} style={{ width:40, height:40, borderRadius:'50%', background:'#f1f5f9', border:'none', display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer', transition:'all 0.2s', flexShrink:0 }}>
          <IoChevronForwardOutline size={16} style={{ color:'#64748b' }} />
        </button>
      </div>
    </motion.div>
  );
};

/* ── CATEGORIES ── */
const CATEGORIES = ['All','Cardiology','Neurology','Oncology','Orthopedics','Pediatrics','Radiology','Surgery','Emergency'];

/* ── MAIN ── */
const Services = () => {
  const [services, setServices]               = useState([]);
  const [loading, setLoading]                 = useState(true);
  const [search, setSearch]                   = useState('');
  const [activeCategory, setActiveCategory]   = useState('All');
  const [view, setView]                       = useState('grid');
  const [filterAvailable, setFilterAvailable] = useState(false);
  const [bookingService, setBookingService]   = useState(null);
  const [sortBy, setSortBy]                   = useState('default');

  useEffect(()=>{
    const fetchServices = async () => {
      try {
        const { data } = await API.get('/services/list');
        if (data.success) setServices(data.services);
      } catch(err){ console.error(err.message); }
      finally { setLoading(false); }
    };
    fetchServices();
    window.scrollTo(0,0);
  },[]);

  const filtered = services
    .filter(s=>{
      const matchSearch = s.title.toLowerCase().includes(search.toLowerCase()) || s.description?.toLowerCase().includes(search.toLowerCase());
      const matchCat    = activeCategory==='All' || s.category===activeCategory;
      const matchAvail  = !filterAvailable || s.isAvailable;
      return matchSearch && matchCat && matchAvail;
    })
    .sort((a,b)=>{ if(sortBy==='name') return a.title.localeCompare(b.title); return 0; });

  if (loading) return (
    <div style={{ height:'100vh', display:'flex', alignItems:'center', justifyContent:'center', background:'#f8fafc', flexDirection:'column', gap:16 }}>
      <div style={{ width:56, height:56, border:'4px solid #2563eb', borderTopColor:'transparent', borderRadius:'50%', animation:'spin 0.8s linear infinite' }} />
      <p style={{ fontSize:10, fontWeight:900, textTransform:'uppercase', letterSpacing:'0.2em', color:'#94a3b8' }}>Loading Departments…</p>
      <style>{`@keyframes spin { to { transform:rotate(360deg); } }`}</style>
    </div>
  );

  return (
    <>
      <ServicesStyles />
      <div className="srv-root">
        {/* Accreditation */}
        <div className="accred-bar">
          <span style={{ opacity:0.6, marginRight:8 }}>✦</span>
          JCI Accredited &nbsp;·&nbsp; ISO 9001:2015 Certified &nbsp;·&nbsp; NABH Accredited
          <span style={{ opacity:0.6, marginLeft:8 }}>✦</span>
        </div>

        {/* Emergency bar */}
        <motion.div className="emerg-bar" initial={{ opacity:0, y:-10 }} animate={{ opacity:1, y:0 }}>
          <span style={{ width:8, height:8, borderRadius:'50%', background:'#fff', animation:'pulse 1.5s ease-in-out infinite', flexShrink:0 }} />
          Emergency Hotline:&nbsp;
          <a href="tel:+11800911000" style={{ color:'#fff', textDecoration:'underline' }}>1-800-911-000</a>
          &nbsp;·&nbsp; Open 24/7 &nbsp;·&nbsp; Avg ER Wait:&nbsp;
          <span style={{ color:'#bfdbfe' }}>12 min</span>
        </motion.div>

        <div className="srv-page">
          {/* Stats strip */}
          <div className="stats-strip">
            <div className="stats-grid">
              {[{value:'98.6%',label:'Patient Satisfaction'},{value:'1,200+',label:'Specialists'},{value:'50+',label:'Departments'},{value:'40 yrs',label:'Of Excellence'}].map(s=>(
                <div key={s.label} style={{ textAlign:'center' }}>
                  <p style={{ fontSize:'clamp(1.2rem,3vw,1.6rem)', fontWeight:900, color:'#1d4ed8', letterSpacing:'-0.03em', margin:0 }}>{s.value}</p>
                  <p style={{ fontSize:9, fontWeight:700, textTransform:'uppercase', letterSpacing:'0.18em', color:'#94a3b8', marginTop:4 }}>{s.label}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="srv-inner">
            {/* Header */}
            <div className="srv-header">
              <div style={{ display:'inline-flex', alignItems:'center', gap:8, background:'#eff6ff', borderRadius:999, padding:'6px 16px', marginBottom:14 }}>
                <IoCheckmarkCircle style={{ color:'#2563eb' }} size={14} />
                <span style={{ fontSize:10, fontWeight:900, textTransform:'uppercase', letterSpacing:'0.18em', color:'#2563eb' }}>Clinical Infrastructure</span>
              </div>
              <h1>Our Services</h1>
              <p style={{ color:'#64748b', maxWidth:520, margin:'0 auto', fontSize:14, lineHeight:1.7 }}>
                World-class medical departments staffed by board-certified specialists. All departments are JCI-accredited.
              </p>
            </div>

            {/* Filters bar */}
            <div className="filters-bar">
              <div className="search-wrap">
                <IoSearchOutline size={17} />
                <input type="text" value={search} onChange={e=>setSearch(e.target.value)}
                  placeholder="Search departments or treatments…"
                  style={{ fontSize:14 }} />
              </div>
              <button onClick={()=>setFilterAvailable(!filterAvailable)}
                style={{ display:'flex', alignItems:'center', gap:8, padding:'10px 14px', borderRadius:12, border:`1px solid ${filterAvailable?'#93c5fd':'#e2e8f0'}`, fontSize:12, fontWeight:700, cursor:'pointer', transition:'all 0.2s', background:filterAvailable?'#eff6ff':'#fff', color:filterAvailable?'#1d4ed8':'#64748b', whiteSpace:'nowrap' }}>
                <IoAlertCircleOutline size={14}/> Available Only
              </button>
              <select value={sortBy} onChange={e=>setSortBy(e.target.value)}
                style={{ padding:'10px 14px', borderRadius:12, border:'1px solid #e2e8f0', fontSize:12, fontWeight:700, color:'#475569', outline:'none', background:'#fff', cursor:'pointer' }}>
                <option value="default">Sort: Default</option>
                <option value="name">Sort: A–Z</option>
              </select>
              <div style={{ display:'flex', alignItems:'center', gap:2, background:'#f1f5f9', borderRadius:12, padding:4, flexShrink:0 }}>
                <button onClick={()=>setView('grid')} style={{ padding:'7px 10px', borderRadius:9, border:'none', cursor:'pointer', background:view==='grid'?'#fff':'transparent', color:view==='grid'?'#2563eb':'#94a3b8', transition:'all 0.2s', boxShadow:view==='grid'?'0 1px 4px rgba(0,0,0,0.08)':'none' }}><IoGridOutline size={16}/></button>
                <button onClick={()=>setView('list')} style={{ padding:'7px 10px', borderRadius:9, border:'none', cursor:'pointer', background:view==='list'?'#fff':'transparent', color:view==='list'?'#2563eb':'#94a3b8', transition:'all 0.2s', boxShadow:view==='list'?'0 1px 4px rgba(0,0,0,0.08)':'none' }}><IoListOutline size={16}/></button>
              </div>
            </div>

            {/* Category pills */}
            <div className="cat-scroll">
              {CATEGORIES.map(cat=>(
                <button key={cat} className={`cat-pill ${activeCategory===cat?'active':''}`} onClick={()=>setActiveCategory(cat)}>{cat}</button>
              ))}
            </div>

            {/* Results count */}
            <p style={{ fontSize:10, fontWeight:800, textTransform:'uppercase', letterSpacing:'0.18em', color:'#94a3b8', marginBottom:20 }}>
              {filtered.length} department{filtered.length!==1?'s':''} found
            </p>

            {/* Services */}
            {filtered.length===0 ? (
              <div style={{ textAlign:'center', padding:'clamp(40px,8vw,80px) 0' }}>
                <IoAlertCircleOutline style={{ color:'#cbd5e1', display:'block', margin:'0 auto 14px' }} size={44} />
                <p style={{ color:'#94a3b8', fontWeight:900, textTransform:'uppercase', letterSpacing:'0.15em', fontSize:13 }}>No services match your search.</p>
                <button onClick={()=>{setSearch('');setActiveCategory('All');setFilterAvailable(false);}}
                  style={{ marginTop:14, color:'#2563eb', fontSize:13, fontWeight:700, background:'none', border:'none', cursor:'pointer' }}>Clear filters</button>
              </div>
            ) : view==='grid' ? (
              <div className="srv-grid">
                {filtered.map((service,index)=>(
                  <ServiceCard key={service._id} service={service} index={index} view="grid" onBook={setBookingService} />
                ))}
              </div>
            ) : (
              <div className="srv-list">
                {filtered.map((service,index)=>(
                  <ServiceCard key={service._id} service={service} index={index} view="list" onBook={setBookingService} />
                ))}
              </div>
            )}

            {/* Trust badges */}
            <div className="trust-grid">
              {[
                { icon:<IoShieldCheckmarkOutline size={24}/>, label:'HIPAA Compliant', sub:'Patient privacy protected' },
                { icon:<IoMedicalOutline size={24}/>,         label:'24/7 Telehealth',  sub:'Virtual visits available' },
                { icon:<IoLocationOutline size={24}/>,        label:'5 Locations',      sub:'Across the metro area' },
                { icon:<IoHeartOutline size={24}/>,           label:'Patient-First Care',sub:'Compassionate & evidence-based' },
              ].map(b=>(
                <div key={b.label} className="trust-card">
                  <div style={{ color:'#2563eb', flexShrink:0, marginTop:2 }}>{b.icon}</div>
                  <div>
                    <p style={{ fontSize:13, fontWeight:900, color:'#0f172a', margin:0 }}>{b.label}</p>
                    <p style={{ fontSize:10, color:'#94a3b8', marginTop:3 }}>{b.sub}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* CTA */}
            <div className="cta-banner">
              <div>
                <p style={{ color:'#bfdbfe', fontSize:10, fontWeight:800, textTransform:'uppercase', letterSpacing:'0.2em', marginBottom:8 }}>Need Guidance?</p>
                <h3 style={{ color:'#fff', fontSize:'clamp(1.4rem,3.5vw,2rem)', fontWeight:900, letterSpacing:'-0.03em', marginBottom:8 }}>Not sure which department?</h3>
                <p style={{ color:'#bfdbfe', fontSize:13, maxWidth:400 }}>Our patient navigators are available 24/7 to route you to the right specialist.</p>
              </div>
              <div className="cta-btns">
                <a href="tel:+11800911000" style={{ display:'flex', alignItems:'center', gap:8, background:'#fff', color:'#1d4ed8', fontWeight:900, padding:'12px 22px', borderRadius:18, fontSize:13, textDecoration:'none', transition:'background 0.2s' }}>
                  <IoCallOutline size={17} /> Call Us
                </a>
                <button style={{ display:'flex', alignItems:'center', gap:8, background:'rgba(255,255,255,0.12)', color:'#fff', fontWeight:900, padding:'12px 22px', borderRadius:18, fontSize:13, border:'1px solid rgba(255,255,255,0.2)', cursor:'pointer', transition:'all 0.2s' }}>
                  <IoMedicalOutline size={17} /> Symptom Check
                </button>
              </div>
            </div>

            <p style={{ textAlign:'center', fontSize:10, color:'#cbd5e1', marginTop:40, lineHeight:1.7, maxWidth:560, margin:'40px auto 0' }}>
              All information is for general purposes only and does not constitute medical advice. In a life-threatening emergency, call 911 immediately.
              © {new Date().getFullYear()} City General Hospital. All rights reserved.
            </p>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {bookingService && (
          <AppointmentModal service={bookingService} onClose={()=>setBookingService(null)} />
        )}
      </AnimatePresence>

      <style>{`
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }
        @keyframes spin  { to { transform:rotate(360deg); } }
      `}</style>
    </>
  );
};

export default Services;