import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  IoShieldHalfOutline, IoEarthOutline, IoBodyOutline, 
  IoPeopleOutline, IoSparklesOutline, IoRibbonOutline,
  IoReaderOutline, IoOpenOutline
} from 'react-icons/io5';

const coreValues = [
  { title:'Hospitality',    desc:'Our primary value, manifesting in open arms to all who suffer.',                      icon:<IoPeopleOutline/>,    grad:'linear-gradient(135deg,#3b82f6,#06b6d4)' },
  { title:'Quality',        desc:'Professional excellence combined with deep human compassion.',                         icon:<IoSparklesOutline/>,  grad:'linear-gradient(135deg,#14b8a6,#10b981)' },
  { title:'Respect',        desc:'Recognizing the divine dignity in every patient and staff member.',                    icon:<IoShieldHalfOutline/>,grad:'linear-gradient(135deg,#6366f1,#3b82f6)' },
  { title:'Responsibility', desc:'Ethical stewardship of resources and community trust.',                                icon:<IoRibbonOutline/>,    grad:'linear-gradient(135deg,#f43f5e,#f97316)' },
];

const TheOrder = () => {
  const [expanded, setExpanded] = useState(false);

  return (
    <div style={{ background:'#f8fafc', minHeight:'100vh' }}>
      <style>{`
        .order-hero { position:relative; height:clamp(300px,60vw,85vh); display:flex; align-items:center; justify-content:center; overflow:hidden; background:#020617; }
        .order-hero-title { font-size:clamp(3rem,12vw,9rem); font-weight:900; color:#fff; line-height:0.82; letter-spacing:-0.055em; margin:0 0 clamp(12px,2vw,24px); }
        .order-main-card  { background:#fff; border-radius:clamp(24px,5vw,56px); box-shadow:0 32px 80px rgba(15,23,42,0.1); border:1px solid #f1f5f9; padding:clamp(24px,5vw,80px); margin-top:-clamp(60px,8vw,96px); position:relative; z-index:20; }
        .order-main-inner { display:flex; flex-direction:column; gap:clamp(32px,5vw,48px); }
        .order-stats-box  { background:#f8fafc; border-radius:clamp(20px,4vw,40px); padding:clamp(24px,4vw,32px); border:1px solid #f1f5f9; position:relative; overflow:hidden; }
        .order-values-grid{ display:grid; grid-template-columns:repeat(auto-fill,minmax(200px,1fr)); gap:clamp(14px,2vw,32px); }
        .order-value-card { background:#fff; padding:clamp(28px,4vw,40px); border-radius:clamp(20px,4vw,40px); box-shadow:0 2px 8px rgba(0,0,0,0.04); border:1px solid #f1f5f9; text-align:center; transition:all 0.3s; }
        .order-value-card:hover { border-color:#bfdbfe; box-shadow:0 20px 60px rgba(15,23,42,0.08); transform:translateY(-8px); }
        .order-cta { border-radius:clamp(28px,5vw,64px); padding:clamp(40px,7vw,96px) clamp(24px,5vw,96px); text-align:center; position:relative; overflow:hidden; }
        .order-cta-title { font-size:clamp(1.5rem,4vw,4rem); font-weight:900; line-height:1.15; margin-bottom:clamp(16px,3vw,32px); }
        .order-cta-btns  { display:flex; flex-wrap:wrap; justify-content:center; gap:clamp(12px,2vw,24px); }

        @media (min-width:768px) {
          .order-main-inner { flex-direction:row; }
          .order-text-col   { flex:0 0 65%; }
          .order-side-col   { flex:1; }
        }
      `}</style>

      {/* Hero */}
      <section className="order-hero">
        <motion.div initial={{ scale:1.1, opacity:0 }} animate={{ scale:1, opacity:0.4 }} transition={{ duration:2 }}
          style={{ position:'absolute', inset:0 }}>
          <img src="https://images.ctfassets.net/jwk3944w4k64/5KY8qX7H264DNBQg6mdiO1/d796f3e774fa63a7ef1f8d60d8fe2a4f/The_Order.jpg"
            alt="St. John of God Heritage" style={{ width:'100%', height:'100%', objectFit:'cover' }}/>
          <div style={{ position:'absolute', inset:0, background:'linear-gradient(to bottom,transparent,rgba(2,6,23,0.6),#020617)' }}/>
        </motion.div>
        <div style={{ position:'relative', zIndex:10, textAlign:'center', padding:'0 clamp(16px,5vw,40px)' }}>
          <motion.div initial={{ y:20, opacity:0 }} animate={{ y:0, opacity:1 }}
            style={{ display:'inline-block', padding:'6px 20px', borderRadius:999, border:'1px solid rgba(96,165,250,0.3)', background:'rgba(59,130,246,0.1)', backdropFilter:'blur(8px)', color:'#93c5fd', fontSize:9, fontWeight:900, textTransform:'uppercase', letterSpacing:'0.4em', marginBottom:clamp(20,3,32), marginBottom:'clamp(20px,3vw,32px)' }}>
            A Five-Century Legacy of Care
          </motion.div>
          <h1 className="order-hero-title">
            THE <br/>
            <span style={{ background:'linear-gradient(to right,#60a5fa,#2dd4bf)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text' }}>ORDER.</span>
          </h1>
        </div>
      </section>

      {/* Main card */}
      <section style={{ padding:'0 clamp(12px,4vw,24px)' }}>
        <div className="order-main-card">
          <div className="order-main-inner">
            <div className="order-text-col">
              <h2 style={{ fontSize:'clamp(1.5rem,3.5vw,2.5rem)', fontWeight:900, color:'#0f172a', marginBottom:clamp(20,3,32), marginBottom:'clamp(20px,3vw,32px)' }}>The Brothers' Charism</h2>
              <p style={{ fontSize:'clamp(13px,1.5vw,18px)', color:'#475569', lineHeight:1.8, fontWeight:500, marginBottom:0 }}>
                The Hospitaller Order of Saint John of God is a worldwide Catholic religious order. In Liberia, we are the custodians of a 500-year-old mission: to see the face of Christ in the suffering and to provide "Hospitality" without borders.
              </p>

              <AnimatePresence>
                {expanded && (
                  <motion.div initial={{ opacity:0, height:0 }} animate={{ opacity:1, height:'auto' }} exit={{ opacity:0, height:0 }}
                    style={{ overflow:'hidden', marginTop:24, paddingLeft:20, borderLeft:'4px solid #eff6ff', display:'flex', flexDirection:'column', gap:20 }}>
                    <p style={{ fontSize:'clamp(13px,1.5vw,16px)', color:'#64748b', lineHeight:1.8, margin:0 }}>
                      Founded in Granada, Spain, the Order has survived wars, pandemics, and social upheavals. Our Charism—a gift of the Holy Spirit—is specifically tailored to the healthcare vocation. It is more than just service; it is a spiritual commitment to professional excellence and human warmth.
                    </p>
                    <p style={{ fontSize:'clamp(13px,1.5vw,16px)', color:'#64748b', lineHeight:1.8, margin:0 }}>
                      Today, the Brothers work alongside lay professionals in Monrovia, ensuring that the spirit of St. John of God remains the heartbeat of the hospital's operations.
                    </p>
                    <div>
                      <a href="https://www.ohsjd.org/Objects/Pagina.asp?ID=514&m=2" target="_blank" rel="noopener noreferrer"
                        style={{ display:'inline-flex', alignItems:'center', gap:10, padding:'10px 20px', background:'#eff6ff', color:'#2563eb', borderRadius:14, fontWeight:700, fontSize:'clamp(12px,1.5vw,14px)', textDecoration:'none', transition:'all 0.2s' }}
                        onMouseEnter={e=>{e.currentTarget.style.background='#2563eb';e.currentTarget.style.color='#fff';}}
                        onMouseLeave={e=>{e.currentTarget.style.background='#eff6ff';e.currentTarget.style.color='#2563eb';}}>
                        Explore Global Charism <IoOpenOutline/>
                      </a>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <button onClick={()=>setExpanded(!expanded)}
                style={{ marginTop:clamp(28,4,40), marginTop:'clamp(28px,4vw,40px)', display:'flex', alignItems:'center', gap:10, background:'#0f172a', color:'#fff', padding:'clamp(12px,2vw,16px) clamp(20px,3vw,32px)', borderRadius:16, fontWeight:900, fontSize:10, textTransform:'uppercase', letterSpacing:'0.2em', border:'none', cursor:'pointer', transition:'background 0.2s', boxShadow:'0 8px 24px #e2e8f0' }}
                onMouseEnter={e=>e.currentTarget.style.background='#2563eb'}
                onMouseLeave={e=>e.currentTarget.style.background='#0f172a'}>
                <IoReaderOutline size={17}/> {expanded ? 'Show Less' : 'Read the Full History'}
              </button>
            </div>

            <div className="order-side-col">
              <div className="order-stats-box">
                <IoEarthOutline style={{ position:'absolute', right:-10, top:-10, fontSize:100, color:'#e2e8f0', opacity:0.5 }}/>
                <h4 style={{ color:'#0f172a', fontWeight:900, textTransform:'uppercase', fontSize:10, letterSpacing:'0.2em', marginBottom:20, position:'relative', zIndex:1 }}>Global Impact</h4>
                <div style={{ display:'flex', flexDirection:'column', gap:20, position:'relative', zIndex:1 }}>
                  {[{ num:'50+', label:'Countries with Presence', color:'#2563eb' },{ num:'400+', label:'Health & Social Centers', color:'#14b8a6' },{ num:'1572', label:'Year Officially Recognized', color:'#6366f1' }].map(s=>(
                    <div key={s.num} style={{ display:'flex', alignItems:'center', gap:14 }}>
                      <span style={{ fontSize:'clamp(1.5rem,4vw,2rem)', fontWeight:900, color:s.color }}>{s.num}</span>
                      <p style={{ fontSize:10, fontWeight:700, color:'#64748b', textTransform:'uppercase', letterSpacing:'0.1em', margin:0 }}>{s.label}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section style={{ padding:'clamp(48px,8vw,128px) clamp(12px,4vw,24px)' }}>
        <div style={{ textAlign:'center', marginBottom:'clamp(32px,5vw,80px)' }}>
          <span style={{ color:'#2563eb', fontWeight:900, textTransform:'uppercase', letterSpacing:'0.3em', fontSize:10 }}>The Four Pillars</span>
          <h2 style={{ fontSize:'clamp(1.6rem,4vw,3.5rem)', fontWeight:900, color:'#0f172a', marginTop:8, letterSpacing:'-0.025em' }}>Foundational Values</h2>
        </div>
        <div className="order-values-grid">
          {coreValues.map((v,i) => (
            <motion.div key={i} className="order-value-card" whileHover={{ y:-8 }}>
              <div style={{ width:'clamp(52px,8vw,64px)', height:'clamp(52px,8vw,64px)', margin:'0 auto clamp(20px,3vw,32px)', borderRadius:16, background:v.grad, color:'#fff', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'clamp(20px,3vw,28px)', boxShadow:'0 8px 24px rgba(0,0,0,0.15)' }}>
                {v.icon}
              </div>
              <h3 style={{ fontSize:'clamp(1rem,2vw,1.3rem)', fontWeight:900, color:'#0f172a', textTransform:'uppercase', letterSpacing:'-0.01em', marginBottom:12 }}>{v.title}</h3>
              <p style={{ fontSize:'clamp(12px,1.5vw,14px)', color:'#64748b', lineHeight:1.7, fontWeight:500, margin:0 }}>{v.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding:'0 clamp(12px,4vw,24px)', marginBottom:'clamp(48px,8vw,128px)' }}>
        <div className="order-cta" style={{ background:'linear-gradient(135deg,#0f172a,#1e3a8a)', color:'#fff', boxShadow:'0 32px 80px rgba(30,58,138,0.3)' }}>
          <div style={{ position:'absolute', top:0, right:0, width:'clamp(150px,25vw,384px)', height:'clamp(150px,25vw,384px)', background:'rgba(59,130,246,0.1)', borderRadius:'50%', marginRight:'-clamp(50px,8vw,128px)', marginTop:'-clamp(50px,8vw,128px)', filter:'blur(60px)', animation:'pulse 3s ease-in-out infinite', pointerEvents:'none' }}/>
          <style>{`@keyframes pulse{0%,100%{opacity:1}50%{opacity:0.6}}`}</style>
          <motion.h2 className="order-cta-title" initial={{ opacity:0 }} whileInView={{ opacity:1 }}>
            "Go on doing good, <br/>brothers."
          </motion.h2>
          <p style={{ color:'#bfdbfe', fontSize:'clamp(13px,1.8vw,18px)', marginBottom:'clamp(28px,4vw,48px)', maxWidth:560, margin:'0 auto clamp(28px,4vw,48px)', fontWeight:500, lineHeight:1.7 }}>
            The final words of St. John of God remain our guiding light today in Monrovia. Join us in this mission of healing.
          </p>
          <div className="order-cta-btns">
            <button style={{ padding:'clamp(12px,2vw,20px) clamp(24px,4vw,40px)', background:'#fff', color:'#0f172a', borderRadius:16, fontWeight:900, fontSize:10, textTransform:'uppercase', letterSpacing:'0.2em', border:'none', cursor:'pointer', transition:'all 0.2s' }}
              onMouseEnter={e=>{e.currentTarget.style.background='#60a5fa';e.currentTarget.style.color='#fff';}}
              onMouseLeave={e=>{e.currentTarget.style.background='#fff';e.currentTarget.style.color='#0f172a';}}>
              Contact the Order
            </button>
            <a href="https://www.ohsjd.org/" target="_blank" rel="noopener noreferrer"
              style={{ padding:'clamp(12px,2vw,20px) clamp(24px,4vw,40px)', border:'1px solid rgba(255,255,255,0.2)', color:'#fff', borderRadius:16, fontWeight:900, fontSize:10, textTransform:'uppercase', letterSpacing:'0.2em', textDecoration:'none', display:'flex', alignItems:'center', gap:8, transition:'background 0.2s' }}
              onMouseEnter={e=>e.currentTarget.style.background='rgba(255,255,255,0.1)'}
              onMouseLeave={e=>e.currentTarget.style.background='transparent'}>
              International Site <IoOpenOutline/>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default TheOrder;