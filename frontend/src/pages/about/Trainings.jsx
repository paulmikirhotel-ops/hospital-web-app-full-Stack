import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  IoSchoolOutline, IoRibbonOutline, IoFlaskOutline, 
  IoPeopleOutline, IoArrowForwardOutline, IoCheckmarkCircle,
  IoReaderOutline, IoStatsChartOutline, IoCloseOutline
} from 'react-icons/io5';

const TRAIN_COLORS = {
  blue:   '#2563eb',
  teal:   '#14b8a6',
  indigo: '#4f46e5',
  orange: '#f97316',
};

const trainingPrograms = [
  { id:1, title:'Medical Internships',  category:'Professional Development', description:'Hands-on clinical rotations for medical students and graduates, providing exposure to diverse pathologies in a mission-driven environment.', details:'Our internship program is accredited and follows the national curriculum, focusing on Internal Medicine, Surgery, Pediatrics, and OBGYN. Interns work alongside senior consultants in a high-volume clinical setting.', stats:'12 Spots Available', icon:<IoSchoolOutline/>,  colorKey:'blue' },
  { id:2, title:'Nursing Excellence',   category:'Specialized Training',     description:'Advanced clinical training for registered nurses, focusing on critical care, maternal health, and emergency response protocols.',                details:'This program enhances the capacity of nurses to handle specialized equipment, manage intensive care units, and implement modern patient safety protocols.',                                                        stats:'Last 4 Seats',      icon:<IoRibbonOutline/>,  colorKey:'teal' },
  { id:3, title:'Laboratory Sciences',  category:'Technical Training',       description:'Specialized workshops in diagnostic pathology, microbiology, and blood bank management using modern laboratory standards.',                      details:'Participants gain proficiency in automated diagnostic systems, quality control measures, and biosafety regulations in a clinical laboratory environment.',                                                         stats:'Registration Open',  icon:<IoFlaskOutline/>,   colorKey:'indigo' },
  { id:4, title:'Community Health',     category:'Outreach Program',         description:'Training for community health workers to bridge the gap between hospital care and rural Liberian communities.',                                   details:'Focuses on preventative medicine, maternal health education, and disease surveillance at the community level.',                                                                                                      stats:'Coming Soon',        icon:<IoPeopleOutline/>,  colorKey:'orange' },
];

const Trainings = () => {
  const [expanded, setExpanded]   = useState(false);
  const [selected, setSelected]   = useState(null);

  return (
    <div style={{ background:'#fff', minHeight:'100vh' }}>
      <style>{`
        .train-hero { position:relative; height:clamp(280px,55vw,80vh); display:flex; align-items:center; overflow:hidden; background:#0f172a; }
        .train-hero-title { font-size:clamp(2.5rem,10vw,9rem); font-weight:900; color:#fff; line-height:0.85; letter-spacing:-0.05em; margin:0 0 clamp(12px,2vw,32px); }
        .train-hero-sub { font-size:clamp(13px,1.5vw,20px); color:#cbd5e1; font-weight:500; max-width:480px; line-height:1.65; border-left:4px solid #2563eb; padding-left:clamp(12px,2vw,24px); margin:0; }
        .train-intro-card { background:#fff; border-radius:clamp(20px,4vw,48px); padding:clamp(24px,5vw,64px); box-shadow:0 20px 60px rgba(0,0,0,0.08); border:1px solid #f1f5f9; margin-top:-clamp(40px,6vw,80px); position:relative; z-index:20; }
        .train-grid { display:grid; grid-template-columns:repeat(auto-fill,minmax(220px,1fr)); gap:clamp(14px,2vw,32px); }
        .train-card { background:#f8fafc; border-radius:clamp(20px,4vw,40px); padding:clamp(20px,3vw,32px); border:1px solid transparent; cursor:pointer; transition:all 0.25s; }
        .train-card:hover { border-color:#bfdbfe; background:#fff; box-shadow:0 16px 48px rgba(0,0,0,0.08); }
        .train-modal-overlay { position:fixed; inset:0; z-index:200; display:flex; align-items:center; justify-content:center; padding:clamp(12px,3vw,24px); background:rgba(15,23,42,0.9); backdrop-filter:blur(12px); }
        .train-modal { background:#fff; width:100%; max-width:580px; border-radius:clamp(20px,4vw,48px); overflow:hidden; position:relative; max-height:90vh; overflow-y:auto; }
        .train-modal-header { padding:clamp(24px,4vw,40px); display:flex; flex-direction:column; justify-content:flex-end; min-height:clamp(110px,15vw,160px); }
        .train-section-hdr { display:flex; flex-direction:column; gap:12px; margin-bottom:clamp(36px,5vw,64px); }
        @media (min-width:640px) {
          .train-section-hdr { flex-direction:row; align-items:flex-end; justify-content:space-between; }
        }
        .train-checks { display:grid; grid-template-columns:1fr; gap:10px; margin-top:24px; }
        @media (min-width:480px) { .train-checks { grid-template-columns:1fr 1fr; } }
      `}</style>

      {/* Hero */}
      <section className="train-hero">
        <motion.div initial={{ scale:1.2, opacity:0 }} animate={{ scale:1, opacity:0.4 }} transition={{ duration:1.5 }}
          style={{ position:'absolute', inset:0 }}>
          <img src="https://images.ctfassets.net/jwk3944w4k64/QgPvuGAn9OQO90yLSCfQV/256b0b91ea3137a7a1fa8de209acef28/post5-10-scaled.jpg"
            alt="Medical Education" style={{ width:'100%', height:'100%', objectFit:'cover' }}/>
        </motion.div>
        <div style={{ position:'relative', zIndex:10, padding:'0 clamp(16px,5vw,40px)', maxWidth:900 }}>
          <motion.div initial={{ opacity:0, y:50 }} animate={{ opacity:1, y:0 }}>
            <h1 className="train-hero-title">
              TRAIN TO <br/>
              <span style={{ color:'#3b82f6' }}>TRANSFORM.</span>
            </h1>
            <p className="train-hero-sub">
              Advancing medical knowledge at the heart of Monrovia. We don't just teach medicine; we cultivate compassion.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Intro */}
      <section style={{ padding:'0 clamp(12px,4vw,24px)' }}>
        <div className="train-intro-card">
          <div style={{ maxWidth:700 }}>
            <h2 style={{ fontSize:'clamp(1.4rem,3vw,2rem)', fontWeight:900, color:'#0f172a', marginBottom:20 }}>Our Educational Mission</h2>
            <p style={{ fontSize:'clamp(13px,1.5vw,17px)', color:'#475569', lineHeight:1.75, marginBottom:16 }}>
              Saint Joseph's Catholic Hospital is recognized as a center of clinical excellence. We provide a rigorous training environment where academic theory meets real-world clinical challenges...
            </p>
            <AnimatePresence>
              {expanded && (
                <motion.div initial={{ opacity:0, height:0 }} animate={{ opacity:1, height:'auto' }} exit={{ opacity:0, height:0 }} style={{ overflow:'hidden' }}>
                  <p style={{ fontSize:'clamp(13px,1.5vw,16px)', color:'#475569', lineHeight:1.8, marginBottom:0, marginTop:4 }}>
                    In alignment with our 60-year heritage, our training programs focus on both technical proficiency and the ethical dimensions of healthcare. We partner with the Ministry of Health and global NGOs to ensure our curriculum remains at the cutting edge of modern medicine in West Africa.
                  </p>
                  <div className="train-checks">
                    {['Accredited Internships','International Mentors','Modern Clinical Labs','Research Opportunities'].map(t=>(
                      <div key={t} style={{ display:'flex', alignItems:'center', gap:10, fontWeight:700, color:'#0f172a', fontSize:'clamp(12px,1.5vw,15px)' }}>
                        <IoCheckmarkCircle style={{ color:'#2563eb', flexShrink:0 }} size={18}/> {t}
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            <button onClick={()=>setExpanded(!expanded)}
              style={{ marginTop:24, display:'flex', alignItems:'center', gap:8, color:'#2563eb', background:'none', border:'none', cursor:'pointer', fontWeight:900, fontSize:10, textTransform:'uppercase', letterSpacing:'0.2em', padding:0 }}>
              <IoReaderOutline size={18}/> {expanded ? 'Collapse Text' : 'Read Full Philosophy'}
              <motion.span animate={{ x:expanded?0:4 }} style={{ marginLeft:2 }}>→</motion.span>
            </button>
          </div>
        </div>
      </section>

      {/* Grid */}
      <section style={{ padding:'clamp(40px,7vw,128px) clamp(12px,4vw,24px)' }}>
        <div className="train-section-hdr">
          <div>
            <span style={{ color:'#2563eb', fontWeight:900, textTransform:'uppercase', letterSpacing:'0.3em', fontSize:10 }}>Academic Catalog</span>
            <h2 style={{ fontSize:'clamp(1.6rem,4vw,3.5rem)', fontWeight:900, color:'#0f172a', marginTop:6, letterSpacing:'-0.03em' }}>Specialized Pathways</h2>
          </div>
          <p style={{ color:'#94a3b8', maxWidth:240, fontSize:'clamp(12px,1.5vw,14px)', textAlign:'right', display:'none' }} className="train-hdr-note">Click on any program to view full curriculum details and requirements.</p>
        </div>
        <div className="train-grid">
          {trainingPrograms.map(prog => {
            const color = TRAIN_COLORS[prog.colorKey];
            return (
              <motion.div key={prog.id} className="train-card" whileTap={{ scale:0.98 }} onClick={()=>setSelected(prog)}>
                <div style={{ width:'clamp(44px,8vw,56px)', height:'clamp(44px,8vw,56px)', borderRadius:14, background:color, color:'#fff', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'clamp(18px,3vw,24px)', marginBottom:'clamp(18px,3vw,24px)', boxShadow:`0 8px 20px ${color}44` }}>
                  {prog.icon}
                </div>
                <h3 style={{ fontSize:'clamp(1rem,2vw,1.3rem)', fontWeight:900, color:'#0f172a', marginBottom:8 }}>{prog.title}</h3>
                <p style={{ fontSize:'clamp(12px,1.5vw,14px)', color:'#64748b', lineHeight:1.7, marginBottom:20, display:'-webkit-box', WebkitLineClamp:3, WebkitBoxOrient:'vertical', overflow:'hidden' }}>{prog.description}</p>
                <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginTop:'auto' }}>
                  <span style={{ display:'flex', alignItems:'center', gap:5, fontSize:9, fontWeight:900, color:'#2563eb', textTransform:'uppercase', letterSpacing:'0.15em' }}>
                    <IoStatsChartOutline size={12}/> {prog.stats}
                  </span>
                  <div style={{ width:32, height:32, borderRadius:'50%', background:'#e2e8f0', display:'flex', alignItems:'center', justifyContent:'center', color:'#64748b', fontSize:15, transition:'all 0.2s' }}>
                    <IoArrowForwardOutline/>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* Modal */}
      <AnimatePresence>
        {selected && (
          <motion.div className="train-modal-overlay" initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
            onClick={e=>{if(e.target===e.currentTarget)setSelected(null);}}>
            <motion.div className="train-modal" initial={{ opacity:0, scale:0.95, y:16 }} animate={{ opacity:1, scale:1, y:0 }} exit={{ opacity:0, scale:0.95, y:16 }}>
              <button onClick={()=>setSelected(null)}
                style={{ position:'absolute', top:12, right:12, padding:8, background:'#f1f5f9', border:'none', borderRadius:'50%', cursor:'pointer', fontSize:22, display:'flex', alignItems:'center', transition:'all 0.2s' }}
                onMouseEnter={e=>{e.currentTarget.style.background='#fef2f2';e.currentTarget.style.color='#dc2626';}}
                onMouseLeave={e=>{e.currentTarget.style.background='#f1f5f9';e.currentTarget.style.color='inherit';}}>
                <IoCloseOutline/>
              </button>
              <div className="train-modal-header" style={{ background:TRAIN_COLORS[selected.colorKey] }}>
                <span style={{ fontSize:9, fontWeight:700, textTransform:'uppercase', letterSpacing:'0.2em', color:'rgba(255,255,255,0.75)', marginBottom:6, display:'block' }}>{selected.category}</span>
                <h3 style={{ fontSize:'clamp(1.4rem,4vw,2rem)', fontWeight:900, color:'#fff', margin:0 }}>{selected.title}</h3>
              </div>
              <div style={{ padding:'clamp(24px,4vw,40px)' }}>
                <h4 style={{ fontWeight:900, color:'#0f172a', textTransform:'uppercase', fontSize:10, letterSpacing:'0.2em', marginBottom:14 }}>Detailed Overview</h4>
                <p style={{ fontSize:'clamp(13px,1.5vw,17px)', color:'#475569', lineHeight:1.8, marginBottom:'clamp(24px,4vw,32px)' }}>{selected.details}</p>
                <div style={{ background:'#f8fafc', borderRadius:18, padding:'clamp(14px,3vw,24px)', display:'flex', flexWrap:'wrap', justifyContent:'space-between', alignItems:'center', gap:14, marginBottom:'clamp(24px,3vw,40px)' }}>
                  <div>
                    <p style={{ fontSize:9, fontWeight:900, color:'#94a3b8', textTransform:'uppercase', letterSpacing:'0.2em', margin:'0 0 4px' }}>Current Status</p>
                    <p style={{ fontWeight:700, color:'#2563eb', margin:0, fontSize:'clamp(12px,1.5vw,15px)' }}>{selected.stats}</p>
                  </div>
                  <button style={{ padding:'clamp(10px,2vw,14px) clamp(16px,3vw,24px)', background:'#0f172a', color:'#fff', borderRadius:12, fontWeight:900, fontSize:10, textTransform:'uppercase', letterSpacing:'0.15em', border:'none', cursor:'pointer', whiteSpace:'nowrap', transition:'background 0.2s' }}
                    onMouseEnter={e=>e.currentTarget.style.background='#2563eb'}
                    onMouseLeave={e=>e.currentTarget.style.background='#0f172a'}>
                    Request Syllabus
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Trainings;