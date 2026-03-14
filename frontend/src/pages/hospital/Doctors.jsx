import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import {
  IoSearchOutline, IoChevronForward, IoMedkitOutline,
  IoFilterOutline, IoStarOutline, IoStar,
  IoTimeOutline, IoPersonOutline,
} from 'react-icons/io5';
import API from '../../api/axiosConfig';
import { useSiteTheme } from '../../context/ThemeContext';

const SPECIALTY_COLORS = {
  'General Physician': { bg: '#e0f2fe', text: '#0369a1', dot: '#0ea5e9' },
  'Gynecologist':      { bg: '#fce7f3', text: '#9d174d', dot: '#ec4899' },
  'Dermatologist':     { bg: '#fef3c7', text: '#92400e', dot: '#f59e0b' },
  'Pediatrician':      { bg: '#dcfce7', text: '#166534', dot: '#22c55e' },
  'Neurologist':       { bg: '#ede9fe', text: '#5b21b6', dot: '#8b5cf6' },
  'Cardiologist':      { bg: '#fee2e2', text: '#991b1b', dot: '#ef4444' },
};
const defaultColor = { bg: '#f1f5f9', text: '#475569', dot: '#94a3b8' };

const DoctorCard = ({ doctor, theme, onClick, idx }) => {
  const [hovered, setHovered] = useState(false);
  const sc = SPECIALTY_COLORS[doctor.specialization] || defaultColor;
  const rating = (4.5 + (doctor._id?.charCodeAt(0) % 5) * 0.1).toFixed(1);
  const reviews = 80 + (doctor._id?.charCodeAt(1) % 120);

  return (
    <motion.div
      initial={{ opacity: 0, y: 32 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: idx * 0.07, type: 'spring', stiffness: 100, damping: 18 }}
      whileHover={{ y: -4 }}
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: theme.siteCard,
        borderRadius: 24,
        border: `1.5px solid ${hovered ? sc.dot : theme.siteBorder}`,
        overflow: 'hidden',
        cursor: 'pointer',
        transition: 'border-color 0.3s ease, box-shadow 0.35s ease',
        boxShadow: hovered
          ? `0 16px 48px ${sc.dot}28, 0 4px 16px rgba(0,0,0,0.06)`
          : '0 2px 12px rgba(0,0,0,0.05)',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Image */}
      <div style={{ position: 'relative', height: 'clamp(180px, 25vw, 240px)', overflow: 'hidden', background: theme.siteAltBg, flexShrink: 0 }}>
        <motion.img
          animate={{ scale: hovered ? 1.06 : 1 }}
          transition={{ duration: 0.55, ease: 'easeOut' }}
          src={doctor.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(doctor.name)}&background=1e3a8a&color=fff&size=400&bold=true`}
          alt={doctor.name}
          style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
        />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(15,23,42,0.55) 0%, transparent 60%)' }} />

        {/* Specialty badge */}
        <div style={{
          position: 'absolute', top: 12, left: 12,
          display: 'flex', alignItems: 'center', gap: 5,
          padding: '4px 10px', borderRadius: 999,
          background: 'rgba(255,255,255,0.92)',
          backdropFilter: 'blur(8px)',
          border: `1px solid ${sc.dot}33`,
        }}>
          <div style={{ width: 6, height: 6, borderRadius: '50%', background: sc.dot }} />
          <span style={{ fontSize: 8, fontWeight: 900, color: sc.text, textTransform: 'uppercase', letterSpacing: '0.12em' }}>
            {doctor.specialization}
          </span>
        </div>

        {/* Available badge */}
        <div style={{
          position: 'absolute', top: 12, right: 12,
          padding: '4px 10px', borderRadius: 999,
          background: 'rgba(16,185,129,0.14)',
          border: '1px solid rgba(16,185,129,0.3)',
          backdropFilter: 'blur(8px)',
        }}>
          <span style={{ fontSize: 8, fontWeight: 900, color: '#10b981', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Available</span>
        </div>

        {/* Rating */}
        <div style={{ position: 'absolute', bottom: 12, left: 12, display: 'flex', alignItems: 'center', gap: 4 }}>
          <div style={{ display: 'flex', gap: 1 }}>
            {[1,2,3,4,5].map(i => (
              <span key={i} style={{ color: i <= Math.floor(rating) ? '#fbbf24' : 'rgba(255,255,255,0.4)', fontSize: 10, display: 'flex' }}>
                {i <= Math.floor(rating) ? <IoStar /> : <IoStarOutline />}
              </span>
            ))}
          </div>
          <span style={{ fontSize: 11, fontWeight: 800, color: '#fff' }}>{rating}</span>
          <span style={{ fontSize: 9, color: 'rgba(255,255,255,0.55)' }}>({reviews})</span>
        </div>
      </div>

      {/* Content */}
      <div style={{ padding: 'clamp(14px, 3vw, 20px)', display: 'flex', flexDirection: 'column', flex: 1 }}>
        <div style={{ marginBottom: 12 }}>
          <p style={{ fontSize: 9, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.18em', color: theme.siteMuted, margin: '0 0 4px' }}>
            {doctor.qualification}
          </p>
          <h3 style={{ fontSize: 'clamp(1rem, 2.5vw, 1.2rem)', fontWeight: 900, color: theme.siteText, margin: 0, letterSpacing: '-0.02em', lineHeight: 1.25 }}>
            Dr. {doctor.name}
          </h3>
        </div>

        <div style={{ display: 'flex', gap: 12, marginBottom: 14, flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <IoTimeOutline style={{ color: theme.siteMuted, fontSize: 12 }} />
            <span style={{ fontSize: 10, fontWeight: 700, color: theme.siteMuted }}>Mon – Sat</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <IoPersonOutline style={{ color: theme.siteMuted, fontSize: 12 }} />
            <span style={{ fontSize: 10, fontWeight: 700, color: theme.siteMuted }}>
              {200 + (doctor._id?.charCodeAt(2) % 300)}+ patients
            </span>
          </div>
        </div>

        <div style={{ height: 1, background: theme.siteBorder, marginBottom: 14 }} />

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 'auto' }}>
          <div>
            <p style={{ fontSize: 8, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.18em', color: theme.siteMuted, margin: '0 0 2px' }}>Consultation</p>
            <p style={{ fontSize: 'clamp(1.1rem, 2.5vw, 1.25rem)', fontWeight: 900, color: theme.siteText, margin: 0 }}>
              ${doctor.fee}
              <span style={{ fontSize: 10, fontWeight: 700, color: theme.siteMuted }}> /visit</span>
            </p>
          </div>
          <motion.div
            animate={{ background: hovered ? sc.dot : theme.siteBtnBg }}
            transition={{ duration: 0.2 }}
            style={{
              width: 40, height: 40, borderRadius: 12,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: '#fff', fontSize: 16,
              boxShadow: hovered ? `0 6px 18px ${sc.dot}50` : 'none',
              flexShrink: 0,
            }}
          >
            <IoChevronForward />
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

const SkeletonCard = ({ theme }) => (
  <div style={{ background: theme.siteCard, borderRadius: 24, overflow: 'hidden', border: `1px solid ${theme.siteBorder}` }}>
    <div style={{ height: 200, background: theme.siteAltBg, animation: 'pulse 1.5s ease-in-out infinite' }} />
    <div style={{ padding: 18 }}>
      <div style={{ height: 10, width: '40%', borderRadius: 6, background: theme.siteAltBg, marginBottom: 10, animation: 'pulse 1.5s ease-in-out infinite' }} />
      <div style={{ height: 20, width: '70%', borderRadius: 8, background: theme.siteAltBg, marginBottom: 14, animation: 'pulse 1.5s ease-in-out infinite 0.1s' }} />
      <div style={{ height: 1, background: theme.siteBorder, marginBottom: 14 }} />
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ height: 24, width: '30%', borderRadius: 8, background: theme.siteAltBg, animation: 'pulse 1.5s ease-in-out infinite 0.2s' }} />
        <div style={{ width: 40, height: 40, borderRadius: 12, background: theme.siteAltBg, animation: 'pulse 1.5s ease-in-out infinite 0.3s' }} />
      </div>
    </div>
  </div>
);

const Doctors = () => {
  const [doctors, setDoctors]         = useState([]);
  const [loading, setLoading]         = useState(true);
  const [searchName, setSearchName]   = useState('');
  const [specialty, setSpecialty]     = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [direction, setDirection]     = useState(0);
  const doctorsPerPage = 6;

  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const { siteTheme } = useSiteTheme();

  const fetchDoctors = async () => {
    setLoading(true);
    try {
      const params = {};
      if (searchName) params.name = searchName;
      if (specialty)  params.specialization = specialty;
      const response = await API.get('/doctors/list', { params });
      if (response.data.success) setDoctors(response.data.doctors);
      else setDoctors([]);
      setCurrentPage(1);
    } catch { setDoctors([]); }
    finally  { setTimeout(() => setLoading(false), 350); }
  };

  useEffect(() => {
    const t = setTimeout(fetchDoctors, 400);
    return () => clearTimeout(t);
  }, [searchName, specialty]);

  const indexOfLast    = currentPage * doctorsPerPage;
  const indexOfFirst   = indexOfLast - doctorsPerPage;
  const currentDoctors = doctors?.slice(indexOfFirst, indexOfLast) || [];
  const totalPages     = Math.ceil(doctors.length / doctorsPerPage);
  const specialties    = ['General Physician', 'Gynecologist', 'Dermatologist', 'Pediatrician', 'Neurologist', 'Cardiologist'];

  const inputBase = {
    background: siteTheme.siteInputBg,
    border: `1.5px solid ${siteTheme.siteInputBorder}`,
    color: siteTheme.siteText,
    borderRadius: 14,
    padding: '12px 16px 12px 42px',
    fontSize: 16,
    fontWeight: 700,
    outline: 'none',
    transition: 'border-color 0.25s ease',
    fontFamily: 'inherit',
    width: '100%',
    boxSizing: 'border-box',
  };

  return (
    <div style={{ minHeight: '100vh', background: siteTheme.siteBg, transition: 'background 0.5s ease' }}>
      <style>{`
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.45} }
        .doc-input:focus { border-color: ${siteTheme.siteAccent} !important; }
        .spec-btn:hover  { background: ${siteTheme.siteAccent} !important; color:#fff !important; border-color:${siteTheme.siteAccent} !important; }
        .page-btn:hover  { background: ${siteTheme.siteAccent} !important; color:#fff !important; }
        .reset-btn:hover { opacity:0.8; }

        /* ── RESPONSIVE ── */
        .doctors-hero    { padding: 80px 32px 60px; }
        .doctors-content { padding: 40px 32px 80px; }
        .doctors-grid    { display:grid; grid-template-columns:repeat(auto-fill,minmax(290px,1fr)); gap:28px; }
        .hero-bottom     { display:flex; flex-wrap:wrap; align-items:flex-end; justify-content:space-between; gap:24px; }
        .hero-stats      { display:flex; gap:32px; }
        .search-bar      { display:flex; flex-wrap:wrap; gap:12px; align-items:center; margin-top:36px; }
        .search-bar > div { flex:1 1 260px; min-width:200px; }
        .search-bar > div:last-child { flex:0 1 220px; min-width:160px; }
        .spec-pills      { display:flex; flex-wrap:wrap; gap:8px; margin-top:16px; }
        .pagination      { display:flex; justify-content:center; align-items:center; gap:8px; margin-top:56px; flex-wrap:wrap; }

        @media (max-width:768px) {
          .doctors-hero    { padding:56px 16px 36px !important; }
          .doctors-content { padding:24px 16px 60px !important; }
          .doctors-grid    { grid-template-columns:1fr !important; gap:16px !important; }
          .hero-stats      { display:none !important; }
          .hero-bottom     { flex-direction:column; align-items:flex-start; }
          .search-bar      { margin-top:24px; }
          .search-bar > div { flex:1 1 100% !important; min-width:unset !important; }
          .spec-pills      { gap:6px; }
          .pagination      { gap:4px; margin-top:36px; }
        }

        @media (max-width:480px) {
          .doctors-grid { gap:12px !important; }
          .spec-btn     { padding:4px 8px !important; font-size:8px !important; }
        }

        @media (min-width:640px) and (max-width:1023px) {
          .doctors-grid { grid-template-columns:repeat(2,1fr) !important; }
        }
      `}</style>

      {/* ── HERO ── */}
      <div className="doctors-hero" style={{
        background: 'linear-gradient(135deg,#0f172a 0%,#1e3a8a 65%,#0ea5e9 100%)',
        position: 'relative', overflow: 'hidden',
      }}>
        <div style={{ position:'absolute', top:-80, right:-80, width:320, height:320, borderRadius:'50%', background:'rgba(255,255,255,0.04)', pointerEvents:'none' }} />
        <div style={{ position:'absolute', bottom:-120, left:'30%', width:400, height:400, borderRadius:'50%', background:'rgba(255,255,255,0.03)', pointerEvents:'none' }} />

        <div style={{ maxWidth:1280, margin:'0 auto', position:'relative', zIndex:1 }}>
          {/* Eyebrow */}
          <motion.div initial={{ opacity:0, y:-10 }} animate={{ opacity:1, y:0 }}
            style={{ display:'inline-flex', alignItems:'center', gap:8, marginBottom:20, padding:'5px 16px', borderRadius:999, background:'rgba(255,255,255,0.1)', border:'1px solid rgba(255,255,255,0.15)' }}>
            <div style={{ width:6, height:6, borderRadius:'50%', background:'#4ade80', boxShadow:'0 0 8px #4ade80' }} />
            <span style={{ fontSize:9, fontWeight:900, color:'rgba(255,255,255,0.75)', textTransform:'uppercase', letterSpacing:'0.2em' }}>
              Saint Joseph's Catholic Hospital
            </span>
          </motion.div>

          <motion.div className="hero-bottom" initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.05 }}>
            <div>
              <h1 style={{ fontSize:'clamp(2rem,6vw,3.8rem)', fontWeight:900, color:'#fff', letterSpacing:'-0.04em', margin:'0 0 10px', lineHeight:1.05 }}>
                Our Medical<br />
                <span style={{ WebkitTextFillColor:'transparent', background:'linear-gradient(90deg,#7dd3fc,#a5b4fc)', WebkitBackgroundClip:'text', backgroundClip:'text' }}>
                  Specialists
                </span>
              </h1>
              <p style={{ color:'rgba(255,255,255,0.55)', fontWeight:500, margin:0, fontSize:14, fontStyle:'italic' }}>
                {user
                  ? `Welcome back, ${user.name.split(' ')[0]}. Find the right specialist.`
                  : 'Expert physicians dedicated to your health and wellbeing.'}
              </p>
            </div>

            <div className="hero-stats">
              {[{ label:'Specialists', value:`${doctors.length||'45'}+` },{ label:'Specialties', value:'12' },{ label:'Years Service', value:'60+' }].map(s => (
                <div key={s.label} style={{ textAlign:'center' }}>
                  <p style={{ fontSize:'1.8rem', fontWeight:900, color:'#fff', margin:0, letterSpacing:'-0.03em' }}>{s.value}</p>
                  <p style={{ fontSize:9, fontWeight:900, color:'rgba(255,255,255,0.45)', margin:0, textTransform:'uppercase', letterSpacing:'0.2em' }}>{s.label}</p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Search bar */}
          <motion.div className="search-bar" initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.12 }}>
            <div style={{ position:'relative' }}>
              <IoSearchOutline style={{ position:'absolute', left:14, top:'50%', transform:'translateY(-50%)', color:'rgba(255,255,255,0.4)', pointerEvents:'none', fontSize:17 }} />
              <input type="text" placeholder="Search by name..." value={searchName} onChange={e=>setSearchName(e.target.value)}
                className="doc-input"
                style={{ ...inputBase, background:'rgba(255,255,255,0.08)', border:'1.5px solid rgba(255,255,255,0.15)', color:'#fff' }}
              />
            </div>
            <div style={{ position:'relative' }}>
              <IoFilterOutline style={{ position:'absolute', left:14, top:'50%', transform:'translateY(-50%)', color:'rgba(255,255,255,0.4)', pointerEvents:'none', fontSize:16 }} />
              <select value={specialty} onChange={e=>setSpecialty(e.target.value)} className="doc-input"
                style={{ ...inputBase, background:'rgba(255,255,255,0.08)', border:'1.5px solid rgba(255,255,255,0.15)', color:specialty?'#fff':'rgba(255,255,255,0.5)', appearance:'none', paddingRight:40, cursor:'pointer' }}>
                <option value="">All Specialties</option>
                {specialties.map(s=><option key={s} value={s} style={{ color:'#0f172a', background:'#fff' }}>{s}</option>)}
              </select>
            </div>
          </motion.div>

          {/* Specialty pills */}
          <motion.div className="spec-pills" initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:0.18 }}>
            <button className="spec-btn" onClick={()=>setSpecialty('')}
              style={{ padding:'5px 14px', borderRadius:999, fontSize:9, fontWeight:900, textTransform:'uppercase', letterSpacing:'0.12em', cursor:'pointer', transition:'all 0.2s ease', border:'1px solid rgba(255,255,255,0.2)', background:specialty===''?siteTheme.siteAccent:'rgba(255,255,255,0.08)', color:specialty===''?'#fff':'rgba(255,255,255,0.65)' }}>
              All
            </button>
            {specialties.map(s => {
              const sc = SPECIALTY_COLORS[s] || defaultColor;
              return (
                <button key={s} className="spec-btn" onClick={()=>setSpecialty(specialty===s?'':s)}
                  style={{ padding:'5px 14px', borderRadius:999, fontSize:9, fontWeight:900, textTransform:'uppercase', letterSpacing:'0.1em', cursor:'pointer', transition:'all 0.2s ease', border:`1px solid ${specialty===s?sc.dot:'rgba(255,255,255,0.15)'}`, background:specialty===s?sc.dot:'rgba(255,255,255,0.07)', color:specialty===s?'#fff':'rgba(255,255,255,0.6)' }}>
                  {s}
                </button>
              );
            })}
          </motion.div>
        </div>
      </div>

      {/* ── CONTENT ── */}
      <div className="doctors-content" style={{ maxWidth:1280, margin:'0 auto' }}>
        {!loading && doctors.length > 0 && (
          <motion.p initial={{ opacity:0 }} animate={{ opacity:1 }}
            style={{ fontSize:11, fontWeight:900, textTransform:'uppercase', letterSpacing:'0.2em', color:siteTheme.siteMuted, marginBottom:28 }}>
            {doctors.length} specialist{doctors.length!==1?'s':''} found
            {specialty ? ` · ${specialty}` : ''}
            {searchName ? ` · "${searchName}"` : ''}
          </motion.p>
        )}

        <div style={{ minHeight:400 }}>
          {loading ? (
            <div className="doctors-grid">
              {[...Array(6)].map((_,i) => <SkeletonCard key={i} theme={siteTheme} />)}
            </div>
          ) : currentDoctors.length > 0 ? (
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div key={`${currentPage}-${specialty}-${searchName}`}
                custom={direction} initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }} transition={{ duration:0.25 }}
                className="doctors-grid">
                {currentDoctors.map((doctor, idx) => (
                  <DoctorCard key={doctor._id} doctor={doctor} theme={siteTheme} idx={idx} onClick={()=>navigate(`/doctor/${doctor._id}`)} />
                ))}
              </motion.div>
            </AnimatePresence>
          ) : (
            <motion.div initial={{ opacity:0, scale:0.97 }} animate={{ opacity:1, scale:1 }}
              style={{ display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', padding:'clamp(3rem,8vw,7rem) 2rem', background:siteTheme.siteAltBg, borderRadius:32, border:`2px dashed ${siteTheme.siteBorder}`, textAlign:'center' }}>
              <div style={{ width:60, height:60, borderRadius:18, background:siteTheme.siteBg, display:'flex', alignItems:'center', justifyContent:'center', marginBottom:18, border:`1px solid ${siteTheme.siteBorder}` }}>
                <IoMedkitOutline size={26} style={{ color:siteTheme.siteMuted }} />
              </div>
              <h3 style={{ fontSize:'1.1rem', fontWeight:900, color:siteTheme.siteText, textTransform:'uppercase', letterSpacing:'-0.02em', margin:'0 0 8px' }}>No Specialists Found</h3>
              <p style={{ color:siteTheme.siteMuted, fontSize:13, margin:'0 0 24px' }}>Try adjusting your search or clearing filters.</p>
              <button className="reset-btn" onClick={()=>{ setSearchName(''); setSpecialty(''); }}
                style={{ padding:'11px 28px', background:siteTheme.siteAccent, color:'#fff', borderRadius:14, fontSize:10, fontWeight:900, textTransform:'uppercase', letterSpacing:'0.2em', border:'none', cursor:'pointer', transition:'opacity 0.2s' }}>
                Reset All Filters
              </button>
            </motion.div>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && !loading && (
          <motion.div className="pagination" initial={{ opacity:0, y:12 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.3 }}>
            <button className="page-btn" disabled={currentPage===1}
              onClick={()=>{ setDirection(-1); setCurrentPage(p=>Math.max(1,p-1)); }}
              style={{ padding:'9px 18px', borderRadius:12, fontWeight:900, fontSize:11, border:`1px solid ${siteTheme.siteBorder}`, cursor:currentPage===1?'default':'pointer', transition:'all 0.2s ease', background:siteTheme.siteCard, color:currentPage===1?siteTheme.siteMuted:siteTheme.siteText, opacity:currentPage===1?0.4:1, textTransform:'uppercase', letterSpacing:'0.1em' }}>
              ← Prev
            </button>
            {[...Array(totalPages)].map((_,i) => (
              <button key={i} className="page-btn"
                onClick={()=>{ setDirection(i+1>currentPage?1:-1); setCurrentPage(i+1); }}
                style={{ width:40, height:40, borderRadius:12, fontWeight:900, fontSize:13, border:`1px solid ${currentPage===i+1?siteTheme.siteAccent:siteTheme.siteBorder}`, cursor:'pointer', transition:'all 0.2s ease', background:currentPage===i+1?siteTheme.siteAccent:siteTheme.siteCard, color:currentPage===i+1?'#fff':siteTheme.siteMuted, transform:currentPage===i+1?'scale(1.1)':'scale(1)', boxShadow:currentPage===i+1?`0 4px 14px ${siteTheme.siteAccent}44`:'none' }}>
                {i+1}
              </button>
            ))}
            <button className="page-btn" disabled={currentPage===totalPages}
              onClick={()=>{ setDirection(1); setCurrentPage(p=>Math.min(totalPages,p+1)); }}
              style={{ padding:'9px 18px', borderRadius:12, fontWeight:900, fontSize:11, border:`1px solid ${siteTheme.siteBorder}`, cursor:currentPage===totalPages?'default':'pointer', transition:'all 0.2s ease', background:siteTheme.siteCard, color:currentPage===totalPages?siteTheme.siteMuted:siteTheme.siteText, opacity:currentPage===totalPages?0.4:1, textTransform:'uppercase', letterSpacing:'0.1em' }}>
              Next →
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Doctors;