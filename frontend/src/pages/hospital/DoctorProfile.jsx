import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import {
  IoShieldCheckmark, IoArrowBackOutline,
  IoChevronForwardOutline, IoMedkitOutline,
  IoStar, IoStarOutline, IoCalendarOutline,
  IoTimeOutline, IoLocationOutline, IoCallOutline,
  IoCheckmarkCircleOutline, IoPulseOutline,
  IoPersonOutline, IoChatbubbleOutline,
} from 'react-icons/io5';
import API from '../../api/axiosConfig';
import { useSiteTheme } from '../../context/ThemeContext';

const SPECIALTY_COLORS = {
  'General Physician': { bg:'#e0f2fe', text:'#0369a1', dot:'#0ea5e9' },
  'Gynecologist':      { bg:'#fce7f3', text:'#9d174d', dot:'#ec4899' },
  'Dermatologist':     { bg:'#fef3c7', text:'#92400e', dot:'#f59e0b' },
  'Pediatrician':      { bg:'#dcfce7', text:'#166534', dot:'#22c55e' },
  'Neurologist':       { bg:'#ede9fe', text:'#5b21b6', dot:'#8b5cf6' },
  'Cardiologist':      { bg:'#fee2e2', text:'#991b1b', dot:'#ef4444' },
};
const defaultColor = { bg:'#eff6ff', text:'#1e40af', dot:'#2563eb' };

const StarRating = ({ rating, count, light = false }) => (
  <div style={{ display:'flex', alignItems:'center', gap:5 }}>
    {[1,2,3,4,5].map(i => (
      <span key={i} style={{ fontSize:13, color:i<=Math.floor(rating)?'#fbbf24':(light?'rgba(255,255,255,0.22)':'#e2e8f0'), display:'flex' }}>
        {i<=Math.floor(rating)?<IoStar/>:<IoStarOutline/>}
      </span>
    ))}
    <span style={{ fontSize:12, fontWeight:900, color:light?'#fff':'#0f172a', marginLeft:4 }}>{rating}</span>
    <span style={{ fontSize:11, color:light?'rgba(255,255,255,0.4)':'#94a3b8', fontWeight:600 }}>({count} reviews)</span>
  </div>
);

const SectionHeading = ({ text, theme }) => (
  <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:20 }}>
    <div style={{ width:32, height:3, borderRadius:999, background:'#2563eb' }}/>
    <span style={{ fontSize:10, fontWeight:900, textTransform:'uppercase', letterSpacing:'0.3em', color:theme.siteText }}>{text}</span>
  </div>
);

const StatPill = ({ icon, label, value, accent, theme }) => (
  <div style={{ display:'flex', alignItems:'center', gap:10, padding:'12px 14px', borderRadius:16, background:theme.siteCard, border:`1px solid ${theme.siteBorder}`, flex:'1 1 120px', boxShadow:'0 2px 8px rgba(0,0,0,0.04)' }}>
    <div style={{ width:34, height:34, borderRadius:10, background:`${accent}18`, display:'flex', alignItems:'center', justifyContent:'center', color:accent, fontSize:17, flexShrink:0 }}>{icon}</div>
    <div>
      <p style={{ fontSize:9, fontWeight:900, textTransform:'uppercase', letterSpacing:'0.2em', color:theme.siteMuted, margin:0 }}>{label}</p>
      <p style={{ fontSize:12, fontWeight:900, color:theme.siteText, margin:0 }}>{value}</p>
    </div>
  </div>
);

const BlogCard = ({ blog, theme, onClick, idx }) => {
  const [hovered, setHovered] = useState(false);
  return (
    <motion.div initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }} transition={{ delay:idx*0.07, type:'spring', stiffness:100, damping:18 }}
      whileHover={{ y:-5 }} onClick={onClick} onMouseEnter={()=>setHovered(true)} onMouseLeave={()=>setHovered(false)}
      style={{ padding:20, borderRadius:20, cursor:'pointer', background:hovered?'#0f172a':theme.siteAltBg, border:`1.5px solid ${hovered?'#334155':theme.siteBorder}`, transition:'all 0.35s ease', boxShadow:hovered?'0 16px 40px rgba(15,23,42,0.18)':'none' }}>
      {blog.coverImg && (
        <div style={{ borderRadius:12, overflow:'hidden', marginBottom:14, height:100, background:'#e2e8f0' }}>
          <motion.img animate={{ scale:hovered?1.06:1 }} transition={{ duration:0.5 }} src={blog.coverImg} alt={blog.title} style={{ width:'100%', height:'100%', objectFit:'cover' }}/>
        </div>
      )}
      <p style={{ fontSize:9, fontWeight:900, textTransform:'uppercase', letterSpacing:'0.2em', color:hovered?'#60a5fa':'#2563eb', margin:'0 0 8px' }}>{blog.category}</p>
      <h4 style={{ fontSize:'0.9rem', fontWeight:900, color:hovered?'#fff':theme.siteText, margin:'0 0 14px', lineHeight:1.4, letterSpacing:'-0.01em' }}>{blog.title}</h4>
      <div style={{ display:'flex', alignItems:'center', gap:6, color:hovered?'rgba(255,255,255,0.45)':theme.siteMuted }}>
        <span style={{ fontSize:9, fontWeight:900, textTransform:'uppercase', letterSpacing:'0.15em' }}>Read Article</span>
        <motion.span animate={{ x:hovered?4:0 }} style={{ display:'flex', fontSize:14 }}><IoChevronForwardOutline/></motion.span>
      </div>
    </motion.div>
  );
};

const DoctorProfile = () => {
  const { docId } = useParams();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const { siteTheme } = useSiteTheme();

  const [doctor, setDoctor] = useState(null);
  const [doctorBlogs, setDoctorBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('about');

  useEffect(() => {
    const fetchDoctorAndBlogs = async () => {
      try {
        setLoading(true);
        const docRes = await API.get(`/doctors/get-doctor/${docId}`);
        const doctorData = docRes.data.doctor;
        setDoctor(doctorData);
        const blogRes = await API.get('/blogs');
        const allBlogs = blogRes.data;
        const filteredBlogs = allBlogs.filter(blog => {
          const authorId = blog.author?._id || blog.author;
          return authorId?.toString() === doctorData?.userId?.toString();
        });
        setDoctorBlogs(filteredBlogs.slice(0,4));
      } catch (err) { console.error('Profile Fetch Error:', err); }
      finally { setTimeout(()=>setLoading(false), 450); }
    };
    if (docId) fetchDoctorAndBlogs();
  }, [docId]);

  const handleBooking = () => {
    if (!user) navigate('/login', { state:{ from:`/doctor/${docId}` } });
    else navigate(`/appointment/${docId}`);
  };

  const sc = SPECIALTY_COLORS[doctor?.specialization] || defaultColor;
  const rating = (4.5+((docId?.charCodeAt(0)||0)%5)*0.1).toFixed(1);
  const reviews = 80+((docId?.charCodeAt(1)||0)%120);
  const patientCount = 200+((docId?.charCodeAt(2)||0)%400);

  if (loading) return (
    <div style={{ minHeight:'100vh', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', background:siteTheme.siteBg }}>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      <div style={{ position:'relative', width:56, height:56, marginBottom:20 }}>
        <div style={{ width:56, height:56, borderRadius:'50%', border:'4px solid #dbeafe', borderTopColor:'#2563eb', animation:'spin 0.8s linear infinite' }}/>
        <div style={{ position:'absolute', inset:0, display:'flex', alignItems:'center', justifyContent:'center', color:'#2563eb', fontSize:20, fontWeight:900 }}>✚</div>
      </div>
      <p style={{ fontSize:10, fontWeight:900, textTransform:'uppercase', letterSpacing:'0.3em', color:'#94a3b8' }}>Synchronizing Records...</p>
    </div>
  );

  if (!doctor) return (
    <div style={{ minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', background:siteTheme.siteBg, padding:24 }}>
      <motion.div initial={{ opacity:0, scale:0.96 }} animate={{ opacity:1, scale:1 }}
        style={{ maxWidth:420, width:'100%', background:siteTheme.siteCard, padding:'48px 32px', borderRadius:40, border:`1px solid ${siteTheme.siteBorder}`, textAlign:'center' }}>
        <h2 style={{ fontSize:'1.3rem', fontWeight:900, color:siteTheme.siteText, margin:'0 0 10px' }}>Profile Not Found</h2>
        <button onClick={()=>navigate('/doctors')} style={{ width:'100%', padding:14, background:'#0f172a', color:'#fff', borderRadius:16, fontSize:10, fontWeight:900, textTransform:'uppercase', letterSpacing:'0.2em', border:'none', cursor:'pointer', marginTop:24 }}>Return to Directory</button>
      </motion.div>
    </div>
  );

  return (
    <div style={{ minHeight:'100vh', background:siteTheme.siteBg, transition:'background 0.5s ease' }}>
      <style>{`
        @keyframes spin       { to { transform: rotate(360deg); } }
        @keyframes pulse-ring { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.6;transform:scale(1.25)} }
        .dp-tab:hover  { color: ${siteTheme.siteText} !important; }
        .dp-back:hover { color: #2563eb !important; }
        .dp-cta:hover  { background: #fff !important; color: #0f172a !important; }

        /* ── Mobile responsive ── */
        .dp-hero-row  { display: flex; flex-wrap: wrap; gap: 24px; align-items: flex-end; }
        .dp-name-block { flex: 1; min-width: 200px; }
        .dp-fee-card   { flex-shrink: 0; min-width: 150px; }
        .dp-main-grid  { display: grid; grid-template-columns: minmax(0,1fr) 300px; gap: 20px; align-items: start; }
        .dp-pub-grid   { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }

        @media (max-width: 860px) {
          .dp-main-grid { grid-template-columns: 1fr !important; }
          .dp-sidebar   { order: -1; }
        }
        @media (max-width: 600px) {
          .dp-fee-card { min-width: unset; width: 100%; }
          .dp-pub-grid { grid-template-columns: 1fr !important; }
          .dp-about-feature-grid { grid-template-columns: 1fr !important; }
          .dp-stat-pills { flex-wrap: wrap; }
        }
      `}</style>

      {/* ── HERO BANNER ── */}
      <div style={{ background:'linear-gradient(135deg, #0f172a 0%, #1e3a8a 65%, #0ea5e9 100%)', padding:'clamp(60px,8vw,80px) clamp(16px,4vw,32px) clamp(36px,5vw,52px)', position:'relative', overflow:'hidden' }}>
        <div style={{ position:'absolute', top:-80, right:-80, width:320, height:320, borderRadius:'50%', background:'rgba(255,255,255,0.04)', pointerEvents:'none' }}/>
        <div style={{ maxWidth:1100, margin:'0 auto', position:'relative', zIndex:1 }}>
          <motion.button className="dp-back" initial={{ opacity:0, x:-10 }} animate={{ opacity:1, x:0 }}
            onClick={()=>navigate('/doctors')}
            style={{ display:'flex', alignItems:'center', gap:8, background:'rgba(255,255,255,0.08)', border:'1px solid rgba(255,255,255,0.14)', borderRadius:12, padding:'8px 16px', color:'rgba(255,255,255,0.6)', fontSize:10, fontWeight:900, textTransform:'uppercase', letterSpacing:'0.18em', cursor:'pointer', marginBottom:28, transition:'color 0.2s ease' }}>
            <IoArrowBackOutline size={14}/> Back to Specialists
          </motion.button>

          <motion.div className="dp-hero-row" initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.06 }}>
            {/* Avatar */}
            <div style={{ position:'relative', flexShrink:0 }}>
              <div style={{ width:100, height:100, borderRadius:24, overflow:'hidden', border:'3px solid rgba(255,255,255,0.18)', boxShadow:'0 16px 48px rgba(0,0,0,0.35)', background:'#1e3a8a' }}>
                <img src={doctor?.image||`https://ui-avatars.com/api/?name=${encodeURIComponent(doctor?.name||'Doctor')}&background=1e3a8a&color=fff&size=240&bold=true`} alt={doctor?.name} style={{ width:'100%', height:'100%', objectFit:'cover' }}/>
              </div>
              <div style={{ position:'absolute', bottom:5, right:5, width:16, height:16, borderRadius:'50%', background:doctor?.available?'#10b981':'#94a3b8', border:'2.5px solid #1e3a8a', boxShadow:doctor?.available?'0 0 10px #10b981':'none', animation:doctor?.available?'pulse-ring 2s ease-in-out infinite':'none' }}/>
            </div>

            {/* Name block */}
            <div className="dp-name-block">
              <div style={{ display:'flex', flexWrap:'wrap', alignItems:'center', gap:7, marginBottom:12 }}>
                <div style={{ display:'flex', alignItems:'center', gap:6, padding:'4px 12px', borderRadius:999, background:'rgba(255,255,255,0.1)', backdropFilter:'blur(8px)', border:`1px solid ${sc.dot}35` }}>
                  <div style={{ width:6, height:6, borderRadius:'50%', background:sc.dot, boxShadow:`0 0 6px ${sc.dot}` }}/>
                  <span style={{ fontSize:9, fontWeight:900, textTransform:'uppercase', letterSpacing:'0.16em', color:'rgba(255,255,255,0.8)' }}>{doctor?.specialization}</span>
                </div>
                <div style={{ padding:'4px 12px', borderRadius:999, background:'rgba(255,255,255,0.08)', border:'1px solid rgba(255,255,255,0.13)' }}>
                  <span style={{ fontSize:9, fontWeight:900, textTransform:'uppercase', letterSpacing:'0.15em', color:'rgba(255,255,255,0.6)' }}>{doctor?.experience} Exp.</span>
                </div>
                {doctor?.available && (
                  <div style={{ padding:'4px 12px', borderRadius:999, background:'rgba(16,185,129,0.15)', border:'1px solid rgba(16,185,129,0.28)' }}>
                    <span style={{ fontSize:9, fontWeight:900, textTransform:'uppercase', letterSpacing:'0.13em', color:'#34d399' }}>Available Today</span>
                  </div>
                )}
              </div>
              <h1 style={{ fontSize:'clamp(1.6rem,4vw,3.2rem)', fontWeight:900, color:'#fff', margin:'0 0 6px', letterSpacing:'-0.035em', lineHeight:1.1 }}>Dr. {doctor?.name}</h1>
              <p style={{ fontSize:13, color:'rgba(255,255,255,0.45)', fontWeight:600, fontStyle:'italic', margin:'0 0 14px' }}>{doctor?.qualification}</p>
              <StarRating rating={Number(rating)} count={reviews} light/>
            </div>

            {/* Fee card */}
            <motion.div className="dp-fee-card" initial={{ opacity:0, scale:0.95 }} animate={{ opacity:1, scale:1 }} transition={{ delay:0.1 }}
              style={{ background:'rgba(255,255,255,0.09)', backdropFilter:'blur(16px)', border:'1px solid rgba(255,255,255,0.14)', borderRadius:20, padding:'20px 24px', textAlign:'center' }}>
              <p style={{ fontSize:9, fontWeight:900, textTransform:'uppercase', letterSpacing:'0.2em', color:'rgba(255,255,255,0.4)', margin:'0 0 4px' }}>Consultation</p>
              <p style={{ fontSize:'2rem', fontWeight:900, color:'#fff', margin:'0 0 14px', letterSpacing:'-0.04em' }}>${doctor?.fee}</p>
              <motion.button whileHover={{ scale:1.04 }} whileTap={{ scale:0.96 }} className="dp-cta" onClick={handleBooking}
                style={{ width:'100%', padding:'10px 16px', borderRadius:12, background:'#2563eb', color:'#fff', fontSize:10, fontWeight:900, textTransform:'uppercase', letterSpacing:'0.16em', border:'none', cursor:'pointer', transition:'all 0.2s ease', display:'flex', alignItems:'center', justifyContent:'center', gap:7 }}>
                <IoCalendarOutline size={12}/>{user?'Book Now':'Login to Book'}
              </motion.button>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* ── MAIN CONTENT ── */}
      <div style={{ maxWidth:1100, margin:'0 auto', padding:'clamp(20px,4vw,36px) clamp(12px,4vw,32px) 80px' }}>
        <div className="dp-main-grid">

          {/* ─── LEFT ─── */}
          <div>
            {/* Stat pills */}
            <motion.div className="dp-stat-pills" initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.1 }}
              style={{ display:'flex', flexWrap:'wrap', gap:10, marginBottom:20 }}>
              <StatPill icon={<IoPersonOutline/>}   label="Patients Treated" value={`${patientCount}+`} accent="#2563eb" theme={siteTheme}/>
              <StatPill icon={<IoPulseOutline/>}    label="Procedures"       value="1,200+"            accent="#7c3aed" theme={siteTheme}/>
              <StatPill icon={<IoTimeOutline/>}     label="Schedule"         value="Mon – Sat"          accent="#0ea5e9" theme={siteTheme}/>
              <StatPill icon={<IoShieldCheckmark/>} label="Certification"    value="Board Certified"   accent="#16a34a" theme={siteTheme}/>
            </motion.div>

            {/* Tabs card */}
            <motion.div initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.14 }}
              style={{ background:siteTheme.siteCard, borderRadius:24, border:`1px solid ${siteTheme.siteBorder}`, boxShadow:'0 2px 12px rgba(0,0,0,0.05)', marginBottom:20, overflow:'hidden' }}>
              <div style={{ display:'flex', borderBottom:`1px solid ${siteTheme.siteBorder}`, padding:'0 clamp(16px,4vw,28px)', overflowX:'auto' }}>
                {[{ key:'about', label:'About' },{ key:'publications', label:'Publications' }].map(tab => (
                  <button key={tab.key} className="dp-tab" onClick={()=>setActiveTab(tab.key)}
                    style={{ padding:'16px 0', marginRight:24, background:'none', border:'none', cursor:'pointer', fontSize:10, fontWeight:900, textTransform:'uppercase', letterSpacing:'0.15em', color:activeTab===tab.key?siteTheme.siteText:siteTheme.siteMuted, position:'relative', transition:'color 0.2s ease', whiteSpace:'nowrap', flexShrink:0 }}>
                    {tab.label}
                    {activeTab===tab.key && <motion.div layoutId="dp-tab-line" style={{ position:'absolute', bottom:-1, left:0, right:0, height:2.5, background:'#2563eb', borderRadius:999 }}/>}
                  </button>
                ))}
              </div>

              <AnimatePresence mode="wait">
                {activeTab==='about' && (
                  <motion.div key="about" initial={{ opacity:0, y:8 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0, y:-8 }}
                    style={{ padding:'clamp(20px,4vw,32px)' }}>
                    <SectionHeading text="Clinical Background" theme={siteTheme}/>
                    <p style={{ fontSize:14, color:siteTheme.siteMuted, lineHeight:1.85, fontWeight:500, margin:'0 0 24px' }}>
                      {doctor?.about||'Dedicated to providing comprehensive medical excellence and personalized patient-centered care. With years of specialized experience, this physician brings deep clinical expertise and genuine compassion to every consultation.'}
                    </p>
                    <div className="dp-about-feature-grid" style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10 }}>
                      {[
                        { icon:<IoCheckmarkCircleOutline/>, text:'ISO Certified Practice',    accent:'#16a34a', bg:'#f0fdf4', border:'#bbf7d0' },
                        { icon:<IoShieldCheckmark/>,        text:'Board Certified',            accent:'#2563eb', bg:'#eff6ff', border:'#bfdbfe' },
                        { icon:<IoChatbubbleOutline/>,      text:'Multilingual Consultations', accent:'#7c3aed', bg:'#f5f3ff', border:'#ddd6fe' },
                        { icon:<IoCalendarOutline/>,        text:'Flexible Appointments',      accent:'#0ea5e9', bg:'#e0f2fe', border:'#bae6fd' },
                      ].map(({ icon,text,accent,bg,border }) => (
                        <div key={text} style={{ display:'flex', alignItems:'center', gap:9, padding:'11px 13px', borderRadius:14, background:bg, border:`1px solid ${border}` }}>
                          <span style={{ color:accent, fontSize:16 }}>{icon}</span>
                          <span style={{ fontSize:9, fontWeight:900, color:accent, textTransform:'uppercase', letterSpacing:'0.1em' }}>{text}</span>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
                {activeTab==='publications' && (
                  <motion.div key="pubs" initial={{ opacity:0, y:8 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0, y:-8 }}
                    style={{ padding:'clamp(20px,4vw,32px)' }}>
                    <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:20 }}>
                      <SectionHeading text="Research & Insights" theme={siteTheme}/>
                      <button onClick={()=>navigate('/blog')} style={{ fontSize:9, fontWeight:900, textTransform:'uppercase', letterSpacing:'0.15em', color:'#2563eb', background:'none', border:'none', cursor:'pointer' }}>View All →</button>
                    </div>
                    {doctorBlogs.length > 0 ? (
                      <div className="dp-pub-grid">
                        {doctorBlogs.map((blog,idx) => <BlogCard key={blog._id} blog={blog} theme={siteTheme} idx={idx} onClick={()=>navigate(`/blog/${blog._id}`)}/>)}
                      </div>
                    ) : (
                      <div style={{ padding:'40px 20px', textAlign:'center', background:siteTheme.siteAltBg, borderRadius:18, border:`2px dashed ${siteTheme.siteBorder}` }}>
                        <IoMedkitOutline size={22} style={{ color:siteTheme.siteMuted, marginBottom:10 }}/>
                        <p style={{ fontSize:10, fontWeight:900, textTransform:'uppercase', letterSpacing:'0.2em', color:siteTheme.siteMuted, margin:0 }}>No Recent Publications</p>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            {/* Booking CTA banner */}
            <motion.div initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.22 }}
              style={{ background:'linear-gradient(135deg, #0f172a 0%, #1e3a8a 100%)', borderRadius:24, padding:'clamp(24px,4vw,36px) clamp(20px,4vw,40px)', position:'relative', overflow:'hidden' }}>
              <div style={{ position:'absolute', top:-50, right:-50, width:200, height:200, borderRadius:'50%', background:'rgba(59,130,246,0.1)', pointerEvents:'none' }}/>
              <div style={{ display:'flex', flexWrap:'wrap', alignItems:'center', justifyContent:'space-between', gap:20, position:'relative', zIndex:1 }}>
                <div>
                  <p style={{ fontSize:10, fontWeight:900, textTransform:'uppercase', letterSpacing:'0.22em', color:'#7dd3fc', margin:'0 0 8px' }}>Ready to consult?</p>
                  <h3 style={{ fontSize:'clamp(1.1rem,3vw,2rem)', fontWeight:900, color:'#fff', margin:'0 0 6px', letterSpacing:'-0.025em', lineHeight:1.2 }}>Book with Dr. {doctor?.name?.split(' ')?.pop()||doctor?.name}</h3>
                  <p style={{ fontSize:12, color:'rgba(255,255,255,0.4)', margin:0, fontWeight:500 }}>Secure your priority slot.</p>
                </div>
                <motion.button whileHover={{ scale:1.04 }} whileTap={{ scale:0.96 }} className="dp-cta" onClick={handleBooking}
                  style={{ padding:'13px 24px', borderRadius:16, background:'#2563eb', color:'#fff', fontSize:10, fontWeight:900, textTransform:'uppercase', letterSpacing:'0.18em', border:'none', cursor:'pointer', boxShadow:'0 8px 24px rgba(37,99,235,0.4)', transition:'all 0.2s ease', display:'flex', alignItems:'center', gap:8, whiteSpace:'nowrap' }}>
                  <IoCalendarOutline size={13}/>{user?'Confirm Booking':'Login to Book'}<IoChevronForwardOutline size={12}/>
                </motion.button>
              </div>
            </motion.div>
          </div>

          {/* ─── RIGHT SIDEBAR ─── */}
          <div className="dp-sidebar" style={{ display:'flex', flexDirection:'column', gap:14 }}>
            {/* Photo card */}
            <motion.div initial={{ opacity:0, x:16 }} animate={{ opacity:1, x:0 }} transition={{ delay:0.1 }}>
              <div style={{ background:siteTheme.siteCard, borderRadius:24, border:`1.5px solid ${siteTheme.siteBorder}`, overflow:'hidden', boxShadow:'0 4px 20px rgba(0,0,0,0.06)' }}>
                <div style={{ height:280, overflow:'hidden', background:siteTheme.siteAltBg, position:'relative' }}>
                  <img src={doctor?.image||`https://ui-avatars.com/api/?name=${encodeURIComponent(doctor?.name||'Doctor')}&background=1e3a8a&color=fff&size=400&bold=true`} alt={doctor?.name} style={{ width:'100%', height:'100%', objectFit:'cover' }}/>
                  <div style={{ position:'absolute', inset:0, background:'linear-gradient(to top, rgba(15,23,42,0.55) 0%, rgba(15,23,42,0.1) 50%, transparent 100%)' }}/>
                  <div style={{ position:'absolute', bottom:12, left:12, display:'flex', alignItems:'center', gap:6, padding:'5px 12px', borderRadius:999, background:'rgba(255,255,255,0.92)', backdropFilter:'blur(8px)', border:`1px solid ${sc.dot}33` }}>
                    <div style={{ width:7, height:7, borderRadius:'50%', background:sc.dot, boxShadow:`0 0 6px ${sc.dot}` }}/>
                    <span style={{ fontSize:9, fontWeight:900, color:sc.text, textTransform:'uppercase', letterSpacing:'0.14em' }}>{doctor?.specialization}</span>
                  </div>
                  <div style={{ position:'absolute', top:12, right:12, padding:'5px 11px', borderRadius:999, background:'rgba(16,185,129,0.14)', border:'1px solid rgba(16,185,129,0.3)', backdropFilter:'blur(8px)' }}>
                    <span style={{ fontSize:9, fontWeight:900, color:'#10b981', textTransform:'uppercase', letterSpacing:'0.12em' }}>{doctor?.available?'Available':'Unavailable'}</span>
                  </div>
                </div>
                <div style={{ padding:'18px 20px 22px' }}>
                  <div style={{ marginBottom:14 }}>
                    <p style={{ fontSize:9, fontWeight:900, textTransform:'uppercase', letterSpacing:'0.2em', color:siteTheme.siteMuted, margin:'0 0 4px' }}>{doctor?.qualification}</p>
                    <h3 style={{ fontSize:'1.1rem', fontWeight:900, color:siteTheme.siteText, margin:0, letterSpacing:'-0.025em' }}>Dr. {doctor?.name}</h3>
                  </div>
                  <div style={{ marginBottom:14 }}><StarRating rating={Number(rating)} count={reviews}/></div>
                  <div style={{ display:'flex', alignItems:'center', gap:10, padding:'11px 14px', borderRadius:14, background:'#eff6ff', border:'1px solid #bfdbfe', marginBottom:16 }}>
                    <div style={{ width:32, height:32, borderRadius:10, background:'#fff', display:'flex', alignItems:'center', justifyContent:'center', color:'#2563eb', fontSize:17, boxShadow:'0 2px 6px rgba(37,99,235,0.12)', flexShrink:0 }}><IoShieldCheckmark/></div>
                    <div>
                      <p style={{ fontSize:11, fontWeight:900, color:'#1e3a8a', margin:0, textTransform:'uppercase', letterSpacing:'0.1em' }}>Verified Specialist</p>
                      <p style={{ fontSize:9, color:'#2563eb', margin:0, fontWeight:700, opacity:0.65, textTransform:'uppercase', letterSpacing:'0.1em' }}>Board Certified · SJCH</p>
                    </div>
                  </div>
                  <div style={{ height:1, background:siteTheme.siteBorder, marginBottom:16 }}/>
                  <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:16 }}>
                    <div>
                      <p style={{ fontSize:8, fontWeight:900, textTransform:'uppercase', letterSpacing:'0.2em', color:siteTheme.siteMuted, margin:'0 0 2px' }}>Consultation Fee</p>
                      <p style={{ fontSize:'1.3rem', fontWeight:900, color:siteTheme.siteText, margin:0, letterSpacing:'-0.02em' }}>${doctor?.fee}<span style={{ fontSize:10, fontWeight:700, color:siteTheme.siteMuted }}> /visit</span></p>
                    </div>
                    <motion.div whileHover={{ background:sc.dot, scale:1.08 }} onClick={handleBooking}
                      style={{ width:40, height:40, borderRadius:12, background:siteTheme.siteBtnBg||'#0f172a', color:'#fff', display:'flex', alignItems:'center', justifyContent:'center', fontSize:17, cursor:'pointer', transition:'background 0.25s ease' }}>
                      <IoChevronForwardOutline/>
                    </motion.div>
                  </div>
                  <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
                    {[
                      { icon:<IoLocationOutline/>, label:'Location',    value:'Block B, 1st Floor' },
                      { icon:<IoCallOutline/>,     label:'Direct Line', value:'+231 770 000 000' },
                      { icon:<IoTimeOutline/>,     label:'Hours',       value:'Mon – Sat, 8am – 5pm' },
                    ].map(item => (
                      <div key={item.label} style={{ display:'flex', alignItems:'center', gap:9 }}>
                        <span style={{ color:'#2563eb', fontSize:15, flexShrink:0 }}>{item.icon}</span>
                        <div>
                          <p style={{ fontSize:8, fontWeight:900, textTransform:'uppercase', letterSpacing:'0.15em', color:siteTheme.siteMuted, margin:0 }}>{item.label}</p>
                          <p style={{ fontSize:12, fontWeight:700, color:siteTheme.siteText, margin:0 }}>{item.value}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Emergency card */}
            <motion.div initial={{ opacity:0, x:16 }} animate={{ opacity:1, x:0 }} transition={{ delay:0.18 }}
              style={{ padding:'14px 16px', borderRadius:18, background:'#fef2f2', border:'1px solid #fecaca', display:'flex', gap:10, alignItems:'flex-start' }}>
              <span style={{ color:'#dc2626', fontSize:20, flexShrink:0, marginTop:1 }}>⚕</span>
              <div>
                <p style={{ fontSize:10, fontWeight:900, color:'#dc2626', margin:'0 0 4px', textTransform:'uppercase', letterSpacing:'0.12em' }}>Emergency?</p>
                <p style={{ fontSize:11, color:'#991b1b', margin:0, lineHeight:1.6 }}>Call <strong>+231 770 000 000</strong> or visit Emergency — Ground Floor, open 24/7.</p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorProfile;