import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  IoHeartOutline, IoShieldCheckmarkOutline, IoGitNetworkOutline, 
  IoMedicalOutline, IoCloseOutline, IoArrowForward, IoInformationCircleOutline 
} from 'react-icons/io5';

const PROG_COLORS = {
  rose:   { bg:'#f43f5e', light:'#fff1f2', border:'#fecdd3', text:'#9f1239' },
  blue:   { bg:'#2563eb', light:'#eff6ff', border:'#bfdbfe', text:'#1e3a8a' },
  teal:   { bg:'#14b8a6', light:'#f0fdfa', border:'#99f6e4', text:'#134e4a' },
  indigo: { bg:'#4f46e5', light:'#eef2ff', border:'#c7d2fe', text:'#312e81' },
};

const hospitalPrograms = [
  { id:'p1', title:'Maternal & Child Health', category:'Specialized Care',   shortDesc:'Comprehensive prenatal, delivery, and postnatal services ensuring the safety of both mother and child.', fullDesc:'Our flagship program focuses on reducing maternal mortality through expert clinical intervention. We provide 24/7 emergency obstetric care, neonatal intensive care unit (NICU) support, and a dedicated team of midwives and pediatricians.', icon:<IoHeartOutline/>,           colorKey:'rose',   stats:'Active 24/7' },
  { id:'p2', title:'HIV/AIDS Outreach',       category:'Community Health',   shortDesc:'Integrated testing, counseling, and long-term antiretroviral treatment support for the community.',            fullDesc:'Working in partnership with international health bodies, we offer confidential testing and holistic management. Our program includes peer support groups, nutritional counseling, and prevention of mother-to-child transmission (PMTCT).', icon:<IoShieldCheckmarkOutline/>, colorKey:'blue',   stats:'Free Services' },
  { id:'p3', title:'Surgical Outreach',       category:'Clinical Excellence', shortDesc:'Specialized surgical campaigns providing critical operations to underserved populations.',                     fullDesc:'We regularly host surgical missions focusing on corrective procedures, ophthalmic surgery, and general surgical needs. Our state-of-the-art theaters are equipped to handle complex cases with a focus on post-operative recovery.', icon:<IoMedicalOutline/>,         colorKey:'teal',   stats:'Quarterly Missions' },
  { id:'p4', title:'Health Education',        category:'Preventative',       shortDesc:'Empowering Monrovia with the knowledge to prevent communicable diseases and maintain wellness.',               fullDesc:'This program bridges the gap between the hospital and the home. We conduct school visits, community workshops, and radio broadcasts to educate the public on hygiene, sanitation, and early symptom recognition.', icon:<IoGitNetworkOutline/>,     colorKey:'indigo', stats:'Community Wide' },
];

const Programs = () => {
  const [selected, setSelected]     = useState(null);
  const [introOpen, setIntroOpen]   = useState(false);

  return (
    <div style={{ background:'#fcfcfd', minHeight:'100vh' }}>
      <style>{`
        .prog-hero { position:relative; height:clamp(280px,55vw,70vh); display:flex; align-items:center; background:#0f172a; overflow:hidden; }
        .prog-hero-title { font-size:clamp(2.8rem,10vw,8rem); font-weight:900; color:#fff; line-height:0.88; letter-spacing:-0.05em; margin:0 0 clamp(12px,2vw,32px); }
        .prog-card-grid  { display:grid; grid-template-columns:repeat(auto-fill,minmax(240px,1fr)); gap:clamp(14px,2vw,24px); }
        .prog-card       { background:#fff; padding:clamp(20px,3vw,32px); border-radius:clamp(20px,3vw,32px); border:1px solid #f1f5f9; box-shadow:0 1px 4px rgba(0,0,0,0.04); cursor:pointer; display:flex; flex-direction:column; transition:all 0.25s; }
        .prog-card:hover { box-shadow:0 20px 60px rgba(37,99,235,0.1); transform:translateY(-8px); border-color:#dbeafe; }
        .prog-intro-card { background:#fff; border-radius:clamp(20px,4vw,40px); box-shadow:0 16px 60px rgba(0,0,0,0.08); border:1px solid #f1f5f9; padding:clamp(24px,5vw,64px); margin-top:-clamp(40px,6vw,64px); position:relative; z-index:20; }
        .prog-modal-overlay { position:fixed; inset:0; z-index:100; display:flex; align-items:center; justify-content:center; padding:clamp(12px,3vw,24px); background:rgba(2,6,23,0.8); backdrop-filter:blur(16px); }
        .prog-modal { background:#fff; width:100%; max-width:600px; border-radius:clamp(20px,4vw,48px); overflow:hidden; position:relative; box-shadow:0 40px 100px rgba(0,0,0,0.3); max-height:90vh; overflow-y:auto; }
        .prog-modal-header { padding:clamp(28px,5vw,48px); display:flex; flex-direction:column; justify-content:flex-end; min-height:clamp(120px,15vw,192px); }
      `}</style>

      {/* Hero */}
      <section className="prog-hero">
        <div style={{ position:'absolute', inset:0, opacity:0.4 }}>
          <img src="https://images.ctfassets.net/jwk3944w4k64/NRDVy9jkNhZGlYCAwEH32/150933d871ecb963d98f54ca53894e78/picture-4-scaled.jpg"
            alt="Hospital Programs" style={{ width:'100%', height:'100%', objectFit:'cover' }}/>
        </div>
        <div style={{ position:'relative', zIndex:10, padding:'0 clamp(16px,5vw,40px)' }}>
          <motion.div initial={{ opacity:0, x:-30 }} animate={{ opacity:1, x:0 }} style={{ maxWidth:700 }}>
            <span style={{ background:'rgba(59,130,246,0.2)', color:'#93c5fd', padding:'5px 16px', borderRadius:999, fontSize:10, fontWeight:900, textTransform:'uppercase', letterSpacing:'0.3em', marginBottom:clamp(16,3,24), display:'inline-block', backdropFilter:'blur(8px)', border:'1px solid rgba(59,130,246,0.3)' }}>
              Impact & Outreach
            </span>
            <h1 className="prog-hero-title">
              OUR <br/>
              <span style={{ background:'linear-gradient(to right,#60a5fa,#2dd4bf)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text' }}>PROGRAMS.</span>
            </h1>
          </motion.div>
        </div>
      </section>

      {/* Intro */}
      <section style={{ padding:'0 clamp(12px,4vw,24px)' }}>
        <div className="prog-intro-card">
          <div style={{ maxWidth:760 }}>
            <h2 style={{ fontSize:'clamp(1.4rem,3vw,2rem)', fontWeight:900, color:'#0f172a', marginBottom:20 }}>Sustainable Health for Liberia</h2>
            <p style={{ fontSize:'clamp(13px,1.5vw,17px)', color:'#475569', lineHeight:1.75, marginBottom:16 }}>
              Saint Joseph's Catholic Hospital operates far beyond its clinical walls. Through our specialized programs, we address the root causes of health instability in our communities...
            </p>
            <AnimatePresence>
              {introOpen && (
                <motion.div initial={{ opacity:0, height:0 }} animate={{ opacity:1, height:'auto' }} exit={{ opacity:0, height:0 }} style={{ overflow:'hidden' }}>
                  <p style={{ fontSize:'clamp(13px,1.5vw,16px)', color:'#475569', lineHeight:1.8, marginBottom:0 }}>
                    By integrating clinical expertise with community outreach, we ensure that healthcare is accessible, equitable, and sustainable. Our programs are designed in collaboration with global health partners and local leaders to meet the unique needs of the Liberian people.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
            <button onClick={()=>setIntroOpen(!introOpen)}
              style={{ marginTop:20, display:'flex', alignItems:'center', gap:8, color:'#2563eb', background:'none', border:'none', cursor:'pointer', fontWeight:700, fontSize:'clamp(12px,1.5vw,14px)', padding:0 }}>
              <IoInformationCircleOutline size={18}/> {introOpen ? 'Show Less' : 'Learn About Our Impact'}
            </button>
          </div>
        </div>
      </section>

      {/* Grid */}
      <section style={{ padding:'clamp(40px,7vw,96px) clamp(12px,4vw,24px)' }}>
        <div className="prog-card-grid">
          {hospitalPrograms.map(prog => {
            const c = PROG_COLORS[prog.colorKey];
            return (
              <motion.div key={prog.id} className="prog-card" whileTap={{ scale:0.98 }} onClick={()=>setSelected(prog)}>
                <div style={{ width:clamp(48,8,56), height:clamp(48,8,56), width:'clamp(44px,8vw,56px)', height:'clamp(44px,8vw,56px)', borderRadius:14, background:c.bg, color:'#fff', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'clamp(18px,3vw,24px)', marginBottom:clamp(20,3,32), marginBottom:'clamp(20px,3vw,32px)', boxShadow:`0 8px 20px ${c.bg}44`, flexShrink:0 }}>
                  {prog.icon}
                </div>
                <span style={{ fontSize:9, fontWeight:900, color:'#2563eb', textTransform:'uppercase', letterSpacing:'0.2em', marginBottom:6, display:'block' }}>{prog.category}</span>
                <h3 style={{ fontSize:'clamp(1rem,2.5vw,1.4rem)', fontWeight:900, color:'#0f172a', marginBottom:10, lineHeight:1.2 }}>{prog.title}</h3>
                <p style={{ fontSize:'clamp(12px,1.5vw,14px)', color:'#64748b', lineHeight:1.7, marginBottom:20, flexGrow:1, display:'-webkit-box', WebkitLineClamp:3, WebkitBoxOrient:'vertical', overflow:'hidden' }}>{prog.shortDesc}</p>
                <div style={{ marginTop:'auto', display:'flex', alignItems:'center', justifyContent:'space-between', paddingTop:16, borderTop:'1px solid #f8fafc' }}>
                  <span style={{ fontSize:10, fontWeight:700, color:'#94a3b8', fontStyle:'italic' }}>{prog.stats}</span>
                  <div style={{ width:36, height:36, borderRadius:'50%', background:'#f8fafc', display:'flex', alignItems:'center', justifyContent:'center', color:'#475569', fontSize:16, transition:'all 0.2s' }}>
                    <IoArrowForward/>
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
          <motion.div className="prog-modal-overlay" initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
            onClick={e=>{if(e.target===e.currentTarget)setSelected(null);}}>
            <motion.div className="prog-modal" initial={{ opacity:0, scale:0.95, y:20 }} animate={{ opacity:1, scale:1, y:0 }} exit={{ opacity:0, scale:0.95, y:20 }}>
              <button onClick={()=>setSelected(null)}
                style={{ position:'absolute', top:16, right:16, zIndex:10, padding:8, background:'rgba(255,255,255,0.2)', border:'none', borderRadius:'50%', cursor:'pointer', color:'#fff', fontSize:22, display:'flex', alignItems:'center' }}>
                <IoCloseOutline/>
              </button>
              <div className="prog-modal-header" style={{ background:PROG_COLORS[selected.colorKey].bg }}>
                <p style={{ color:'rgba(255,255,255,0.65)', fontSize:9, fontWeight:900, textTransform:'uppercase', letterSpacing:'0.2em', marginBottom:6 }}>{selected.category}</p>
                <h3 style={{ fontSize:'clamp(1.5rem,4vw,2.5rem)', fontWeight:900, color:'#fff', lineHeight:1, margin:0 }}>{selected.title}</h3>
              </div>
              <div style={{ padding:'clamp(24px,4vw,48px)' }}>
                <p style={{ fontSize:'clamp(13px,1.5vw,17px)', color:'#475569', lineHeight:1.8, marginBottom:clamp(24,4,40), marginBottom:'clamp(24px,4vw,40px)' }}>{selected.fullDesc}</p>
                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14 }}>
                  <div style={{ background:'#f8fafc', padding:'clamp(16px,3vw,24px)', borderRadius:20 }}>
                    <p style={{ fontSize:9, fontWeight:900, color:'#94a3b8', textTransform:'uppercase', letterSpacing:'0.2em', marginBottom:6 }}>Availability</p>
                    <p style={{ fontWeight:700, color:'#0f172a', margin:0, fontSize:'clamp(12px,1.5vw,15px)' }}>{selected.stats}</p>
                  </div>
                  <button style={{ background:'#0f172a', color:'#fff', borderRadius:20, fontWeight:900, fontSize:10, textTransform:'uppercase', letterSpacing:'0.15em', border:'none', cursor:'pointer', transition:'background 0.2s' }}
                    onMouseEnter={e=>e.currentTarget.style.background='#2563eb'}
                    onMouseLeave={e=>e.currentTarget.style.background='#0f172a'}>
                    Partner With Us
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

export default Programs;