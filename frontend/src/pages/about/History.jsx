import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  IoMedkitOutline, IoShieldCheckmarkOutline, IoGlobeOutline, 
  IoRibbonOutline, IoFitnessOutline,
  IoReaderOutline, IoOpenOutline
} from 'react-icons/io5';

const History = () => {
  const [isExpanded, setIsExpanded] = useState(false);

  const timelineData = [
    { year:'1956', title:'The Visionary Request',  content:'During a state visit to Rome, President William V.S. Tubman requested Pope Pius XII for the Catholic Church to establish a hospital and medical teaching school in Liberia for the benefit of the sick and needy.', icon:<IoGlobeOutline/> },
    { year:'1963', title:'The Citadel Opening',    content:"Opened on August 23rd, 1963. President Tubman dedicated it as a 'Citadel waging war against the enemy of our commonality—Death.' Built on land donated by Mrs. M. Eva McGill Hilton.", icon:<IoMedkitOutline/> },
    { year:'1990s',title:'The Civil War Test',     content:'At the peak of the war, the hospital relocated to Gbarnga for safety. It famously served as a place of refuge for victims of the Lutheran Church Massacre under the support of Archbishop Michael K. Francis.', icon:<IoShieldCheckmarkOutline/> },
    { year:'2014', title:'The Ebola Sacrifice',    content:'Nine staffers lost their lives serving humanity during the outbreak. These brothers and sisters from Liberia, Ghana, Cameroon, Equatorial Guinea, and Spain are remembered as heroes.', icon:<IoRibbonOutline/> },
    { year:'2019', title:'Defeating COVID-19',     content:'Unlike 2014, a prepared staff stood firm. Through a robust triaging system and partners like CRS, the hospital defeated the virus with no lives lost.', icon:<IoFitnessOutline/> },
  ];

  return (
    <div style={{ background:'#fff', minHeight:'100vh', paddingBottom:80, overflow:'hidden' }}>
      <style>{`
        /* ── Hero ── */
        .hist-hero {
          position:relative; height:clamp(320px,70vw,90vh);
          display:flex; align-items:center; justify-content:center; overflow:hidden;
        }
        .hist-hero-title {
          font-size:clamp(2.5rem,10vw,10rem);
          font-weight:900; color:#fff;
          letter-spacing:-0.05em; line-height:0.85;
          margin:0 0 clamp(16px,3vw,32px);
        }
        .hist-hero-sub {
          font-size:clamp(9px,1.5vw,11px);
          font-weight:900; text-transform:uppercase;
          letter-spacing:0.5em; color:rgba(255,255,255,0.8);
        }

        /* ── Card ── */
        .hist-card {
          max-width:900px; margin:0 auto;
          background:#fff;
          border-radius:clamp(20px,4vw,48px);
          box-shadow:0 32px 80px rgba(15,23,42,0.1);
          border:1px solid #f1f5f9;
          padding:clamp(24px,5vw,64px);
        }
        .hist-card-header {
          display:flex; flex-wrap:wrap;
          justify-content:space-between; align-items:flex-start;
          gap:16px; margin-bottom:clamp(24px,4vw,40px);
        }
        .hist-card-title { font-size:clamp(1.5rem,4vw,2.5rem); font-weight:900; color:#0f172a; margin:0 0 8px; }

        /* ── Timeline ── */
        .hist-timeline-item {
          display:flex; flex-direction:column;
          align-items:center; gap:clamp(20px,4vw,48px);
          margin-bottom:clamp(48px,8vw,128px);
        }
        .hist-timeline-text { text-align:center; }
        .hist-timeline-year {
          display:inline-block; padding:6px 18px; border-radius:999px;
          background:#eff6ff; color:#2563eb; font-weight:900;
          font-size:clamp(11px,1.5vw,14px); margin-bottom:clamp(12px,2vw,24px);
        }
        .hist-timeline-h3 {
          font-size:clamp(1.3rem,3vw,2rem);
          font-weight:900; color:#0f172a;
          margin:0 0 clamp(8px,1.5vw,16px); letter-spacing:-0.025em;
        }
        .hist-timeline-p {
          color:#64748b; font-weight:500; line-height:1.7;
          font-size:clamp(13px,1.5vw,16px); margin:0;
        }
        .hist-timeline-icon {
          flex-shrink:0; width:clamp(60px,10vw,96px); height:clamp(60px,10vw,96px);
          border-radius:clamp(16px,3vw,40px); background:#fff;
          border:4px solid #f8fafc;
          display:flex; align-items:center; justify-content:center;
          font-size:clamp(1.5rem,3vw,2.5rem); color:#2563eb;
          box-shadow:0 8px 32px rgba(0,0,0,0.1);
        }

        /* ── CTA ── */
        .hist-cta {
          border-radius:clamp(24px,5vw,64px);
          padding:clamp(40px,6vw,96px) clamp(24px,5vw,96px);
          text-align:center;
        }
        .hist-cta-title {
          font-size:clamp(1.5rem,4vw,3.5rem);
          font-weight:900; margin-bottom:clamp(20px,3vw,32px); line-height:1.15;
        }

        /* ── Desktop: alternate timeline ── */
        @media (min-width:768px) {
          .hist-timeline-item { flex-direction:row; align-items:center; }
          .hist-timeline-item.reverse { flex-direction:row-reverse; }
          .hist-timeline-text { text-align:left; flex:1; }
          .hist-timeline-spacer { flex:1; }
          .hist-timeline-line {
            position:absolute; left:50%; top:0; bottom:0;
            width:1px; background:#f1f5f9;
          }
        }
      `}</style>

      {/* Hero */}
      <section className="hist-hero">
        <motion.div initial={{ scale:1.1 }} animate={{ scale:1 }} transition={{ duration:10, repeat:Infinity, repeatType:'reverse' }}
          style={{ position:'absolute', inset:0, zIndex:0 }}>
          <img src="https://images.ctfassets.net/jwk3944w4k64/3GLL9aLkmNoL49nOF2H1M4/d5f5abb6ec19845a5e125719d85fdfd7/About_Us.jpg"
            alt="SJCH Building" style={{ width:'100%', height:'100%', objectFit:'cover' }}/>
          <div style={{ position:'absolute', inset:0, background:'linear-gradient(to bottom, rgba(15,23,42,0.8), rgba(15,23,42,0.4), #fff)' }}/>
        </motion.div>

        <div style={{ position:'relative', zIndex:10, textAlign:'center', padding:'0 clamp(16px,5vw,40px)' }}>
          <motion.h1 className="hist-hero-title" initial={{ opacity:0, y:30 }} animate={{ opacity:1, y:0 }}>
            HISTORY OF <br/><span style={{ color:'#60a5fa' }}>EXCELLENCE</span>
          </motion.h1>
          <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:0.5 }}
            style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:12 }}>
            <p className="hist-hero-sub">Monrovia, Liberia • Est. 1963</p>
            <div style={{ height:60, width:1, background:'linear-gradient(to bottom, #3b82f6, transparent)' }}/>
          </motion.div>
        </div>
      </section>

      {/* Story card */}
      <section style={{ padding:'0 clamp(12px,4vw,24px)', marginTop:'-clamp(60px,8vw,128px)', position:'relative', zIndex:20 }}>
        <div className="hist-card">
          <div className="hist-card-header">
            <div>
              <h2 className="hist-card-title">Brief History & Background</h2>
              <div style={{ height:6, width:64, background:'#2563eb', borderRadius:999 }}/>
            </div>
            <a href="https://www.sjchmonrovialiberia.com/about" target="_blank" rel="noopener noreferrer"
              style={{ display:'flex', alignItems:'center', gap:7, padding:'8px 16px', background:'#f8fafc', color:'#64748b', borderRadius:999, fontSize:10, fontWeight:900, textTransform:'uppercase', letterSpacing:'0.15em', border:'1px solid #f1f5f9', textDecoration:'none', transition:'all 0.2s', whiteSpace:'nowrap' }}
              onMouseEnter={e=>{e.currentTarget.style.background='#eff6ff';e.currentTarget.style.color='#2563eb';}}
              onMouseLeave={e=>{e.currentTarget.style.background='#f8fafc';e.currentTarget.style.color='#64748b';}}>
              Verified Source <IoOpenOutline size={13}/>
            </a>
          </div>

          <p style={{ fontSize:'clamp(14px,2vw,20px)', color:'#475569', lineHeight:1.75, fontWeight:500, marginBottom:24 }}>
            The St. Joseph's Catholic Hospital has provided high-quality and compassionate healthcare services to the people of Liberia for 60 years now as it opened its doors to the public on the 23rd August, 1963...
          </p>

          <AnimatePresence>
            {isExpanded && (
              <motion.div initial={{ height:0, opacity:0 }} animate={{ height:'auto', opacity:1 }} exit={{ height:0, opacity:0 }}
                style={{ overflow:'hidden', display:'flex', flexDirection:'column', gap:20, color:'#475569', lineHeight:1.8 }}>
                <p style={{ fontSize:'clamp(13px,1.5vw,16px)', margin:0 }}>
                  In 1956, during a state visit to Rome, the late President William V.S. Tubman, made a request that the Holy Father Pope Pius XII, grant permission for the Catholic Church to establish a hospital and medical teaching school in the country...
                </p>
                <p style={{ fontSize:'clamp(13px,1.5vw,16px)', margin:0 }}>
                  The Hospital was dedicated to humanity as Late President Tubman made an appeal: <span style={{ color:'#2563eb', fontWeight:700, fontStyle:'italic' }}>"this hospital should be citadel waging war against the enemy of our commonality-Death."</span>
                </p>
                <p style={{ fontSize:'clamp(13px,1.5vw,16px)', margin:0 }}>
                  The Liberian Civil War was a test to his words. At the peak of the war, the hospital had to relocate all patients and some staffers to Phebe Hospital in Gbarnga at Bong County for safety. In the midst of the fierce battle, the Late Archbishop Michael K. Francis supported the hospital to care for all victims of the Lutheran Church Massacre.
                </p>
                <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(220px,1fr))', gap:20, margin:'8px 0' }}>
                  <div style={{ padding:'clamp(20px,3vw,32px)', background:'#fef2f2', borderRadius:'clamp(16px,3vw,24px)', border:'1px solid #fecaca' }}>
                    <h4 style={{ color:'#dc2626', fontWeight:900, textTransform:'uppercase', fontSize:10, letterSpacing:'0.2em', marginBottom:10 }}>2014 Ebola Outbreak</h4>
                    <p style={{ fontSize:'clamp(12px,1.5vw,14px)', color:'#475569', margin:0, lineHeight:1.7 }}>Took away the lives of nine (9) able staffers while seven (7) others were contaminated but gracefully recovered. These nine staffers were Liberian, Ghanaian, Cameroonian, Equatorial Guinean and Spanish Nationals.</p>
                  </div>
                  <div style={{ padding:'clamp(20px,3vw,32px)', background:'#f0fdf4', borderRadius:'clamp(16px,3vw,24px)', border:'1px solid #bbf7d0' }}>
                    <h4 style={{ color:'#16a34a', fontWeight:900, textTransform:'uppercase', fontSize:10, letterSpacing:'0.2em', marginBottom:10 }}>2019 Covid-19</h4>
                    <p style={{ fontSize:'clamp(12px,1.5vw,14px)', color:'#475569', margin:0, lineHeight:1.7 }}>Met a well prepared staff who solidly stood to their feet and defeated it. Through the resilience of the staffers and support of partners like CRS, NCHC, and God's grace, no life was lost.</p>
                  </div>
                </div>
                <p style={{ fontSize:'clamp(13px,1.5vw,16px)', margin:0 }}>
                  Over the years, the hospital has encountered many challenges that could have crippled her operations but through the hardworking effort of staffers, donors, the Government, and the Catholic Church of Liberia, it has always remained opened in serving humanity.
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          <button onClick={()=>setIsExpanded(!isExpanded)}
            style={{ marginTop:clamp, display:'flex', alignItems:'center', gap:9, padding:'clamp(12px,2vw,16px) clamp(20px,3vw,32px)', background:'#0f172a', color:'#fff', borderRadius:18, fontWeight:900, fontSize:10, textTransform:'uppercase', letterSpacing:'0.2em', border:'none', cursor:'pointer', boxShadow:'0 8px 24px #e2e8f0', transition:'background 0.2s', marginTop:clamp(24,'3vw',32) }}
            onMouseEnter={e=>e.currentTarget.style.background='#2563eb'}
            onMouseLeave={e=>e.currentTarget.style.background='#0f172a'}>
            <IoReaderOutline size={17}/> {isExpanded ? 'Show Less' : 'Read Full Background'}
          </button>
        </div>
      </section>

      {/* Timeline */}
      <section style={{ padding:'clamp(48px,8vw,128px) clamp(12px,4vw,24px)', position:'relative' }}>
        <div className="hist-timeline-line" style={{ display:'none' }}/>
        <div style={{ maxWidth:900, margin:'0 auto' }}>
          {timelineData.map((item, idx) => (
            <motion.div key={idx} className={`hist-timeline-item${idx%2!==0?' reverse':''}`}
              initial={{ opacity:0, y:40 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }}>
              <div className="hist-timeline-text">
                <span className="hist-timeline-year">{item.year}</span>
                <h3 className="hist-timeline-h3">{item.title}</h3>
                <p className="hist-timeline-p">{item.content}</p>
              </div>
              <div className="hist-timeline-icon">{item.icon}</div>
              <div className="hist-timeline-spacer"/>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding:'0 clamp(12px,4vw,24px)', marginBottom:clamp(48,8,80) }}>
        <div className="hist-cta" style={{ background:'#2563eb', color:'#fff', position:'relative', overflow:'hidden', boxShadow:'0 32px 80px rgba(37,99,235,0.25)' }}>
          <div style={{ position:'absolute', top:0, right:0, width:'clamp(120px,25vw,256px)', height:'clamp(120px,25vw,256px)', background:'rgba(255,255,255,0.1)', borderRadius:'50%', marginRight:'-clamp(40px,5vw,80px)', marginTop:'-clamp(40px,5vw,80px)', filter:'blur(40px)', pointerEvents:'none' }}/>
          <h2 className="hist-cta-title">Continuing the warfare <br/> against death.</h2>
          <button onClick={()=>window.scrollTo({top:0,behavior:'smooth'})}
            style={{ padding:'clamp(12px,2vw,16px) clamp(24px,4vw,40px)', background:'#fff', color:'#2563eb', borderRadius:999, fontWeight:900, fontSize:10, textTransform:'uppercase', letterSpacing:'0.2em', border:'none', cursor:'pointer', transition:'all 0.2s' }}
            onMouseEnter={e=>{e.currentTarget.style.background='#0f172a';e.currentTarget.style.color='#fff';}}
            onMouseLeave={e=>{e.currentTarget.style.background='#fff';e.currentTarget.style.color='#2563eb';}}>
            Back to Top
          </button>
        </div>
      </section>
    </div>
  );
};

export default History;