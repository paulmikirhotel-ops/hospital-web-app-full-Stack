import React, { useState, useRef } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import {
  IoShieldHalfOutline, IoEarthOutline, IoBodyOutline,
  IoPeopleOutline, IoSparklesOutline, IoRibbonOutline,
  IoReaderOutline, IoOpenOutline, IoChevronDownOutline,
} from 'react-icons/io5';

/* ─── DATA ─────────────────────────────────────────────────── */
const coreValues = [
  { title: 'Hospitality',    desc: 'Our primary value, manifesting in open arms to all who suffer.',             icon: <IoPeopleOutline />,    accent: '#1d4ed8' },
  { title: 'Quality',        desc: 'Professional excellence combined with deep human compassion.',                icon: <IoSparklesOutline />,  accent: '#0d9488' },
  { title: 'Respect',        desc: 'Recognizing the divine dignity in every patient and staff member.',           icon: <IoShieldHalfOutline />,accent: '#4338ca' },
  { title: 'Responsibility', desc: 'Ethical stewardship of resources and community trust.',                      icon: <IoRibbonOutline />,    accent: '#e11d48' },
];

const globalStats = [
  { num: '50+',  label: 'Countries with Presence', color: '#1d4ed8' },
  { num: '400+', label: 'Health & Social Centers',  color: '#0d9488' },
  { num: '1572', label: 'Year Officially Recognized', color: '#4338ca' },
];

/* ─── VALUE CARD ─────────────────────────────────────────────── */
const ValueCard = ({ v, index }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 28 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
      style={{
        background: '#fff',
        border: '1px solid #f0f0f0',
        borderRadius: 16,
        padding: 'clamp(28px,4vw,40px)',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden',
        transition: 'all 0.3s',
      }}
      whileHover={{ y: -6, boxShadow: '0 24px 60px rgba(0,0,0,0.09)' }}
    >
      {/* Bottom accent */}
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 3, background: v.accent }} />

      <div style={{
        width: 56, height: 56, borderRadius: 16, margin: '0 auto 20px',
        background: `${v.accent}12`,
        border: `1px solid ${v.accent}30`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 24, color: v.accent,
      }}>
        {v.icon}
      </div>
      <h3 style={{
        fontFamily: '"DM Serif Display", Georgia, serif',
        fontSize: 'clamp(1.1rem,2vw,1.3rem)',
        fontWeight: 400, color: '#0f172a',
        letterSpacing: '-0.02em', marginBottom: 12,
      }}>
        {v.title}
      </h3>
      <p style={{
        fontFamily: '"Lora", Georgia, serif',
        fontSize: 'clamp(12px,1.3vw,14px)', color: '#64748b',
        lineHeight: 1.75, margin: 0,
      }}>
        {v.desc}
      </p>
    </motion.div>
  );
};

/* ─── MAIN ───────────────────────────────────────────────────── */
const TheOrder = () => {
  const [expanded, setExpanded] = useState(false);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=Lora:ital,wght@0,400;0,500;0,600;1,400&display=swap');
        *, *::before, *::after { box-sizing: border-box; }

        .order-root {
          background: #fff;
          min-height: 100vh;
          font-family: "Lora", Georgia, serif;
        }

        .order-root::before {
          content: '';
          position: fixed; inset: 0; z-index: 0; pointer-events: none;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E");
          background-size: 200px; opacity: 0.2; mix-blend-mode: multiply;
        }

        .order-main-layout {
          display: flex;
          flex-direction: column;
          gap: clamp(32px, 5vw, 56px);
        }
        @media (min-width: 768px) {
          .order-main-layout { flex-direction: row; align-items: flex-start; }
          .order-text-col { flex: 0 0 62%; }
          .order-side-col { flex: 1; }
        }

        .order-values-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
          gap: clamp(16px, 2vw, 28px);
        }
        @media (max-width: 480px) {
          .order-values-grid { grid-template-columns: 1fr 1fr; }
        }
        @media (max-width: 360px) {
          .order-values-grid { grid-template-columns: 1fr; }
        }

        .gold-rule { height: 1px; background: linear-gradient(to right, transparent, #e2e8f0, transparent); border: none; margin: 0; }

        .order-expand-btn {
          display: inline-flex; align-items: center; gap: 10px;
          padding: 14px 28px;
          background: #0f172a; color: #fff;
          border: none; border-radius: 8px;
          font-family: "Lora", serif; font-weight: 700;
          font-size: 11px; text-transform: uppercase; letter-spacing: 0.2em;
          cursor: pointer; transition: background 0.25s;
        }
        .order-expand-btn:hover { background: #1d4ed8; }

        .order-cta-btns {
          display: flex; flex-wrap: wrap; gap: 14px;
          justify-content: center;
        }

        @keyframes subtlePulse { 0%,100%{opacity:0.6} 50%{opacity:1} }
      `}</style>

      <div className="order-root">

        {/* ══════════ HERO ══════════ */}
        <section style={{
          position: 'relative', height: 'clamp(380px,62vh,80vh)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          overflow: 'hidden', background: '#020617',
        }}>
          <motion.div
            initial={{ scale: 1.08, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 2, ease: 'easeOut' }}
            style={{ position: 'absolute', inset: 0 }}
          >
            <img
              src="https://images.ctfassets.net/jwk3944w4k64/5KY8qX7H264DNBQg6mdiO1/d796f3e774fa63a7ef1f8d60d8fe2a4f/The_Order.jpg"
              alt="St. John of God Heritage"
              style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'brightness(0.28) saturate(0.6)' }}
            />
          </motion.div>
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, transparent 40%, #fff 100%)' }} />

          {/* Decorative ring */}
          <div style={{
            position: 'absolute', width: 'clamp(240px,50vw,560px)', height: 'clamp(240px,50vw,560px)',
            border: '1px solid rgba(255,255,255,0.07)', borderRadius: '50%',
            pointerEvents: 'none',
          }} />

          <div style={{ position: 'relative', zIndex: 10, textAlign: 'center', padding: '0 clamp(20px,6vw,48px)' }}>
            <motion.p
              initial={{ opacity: 0, letterSpacing: '1em' }}
              animate={{ opacity: 1, letterSpacing: '0.4em' }}
              transition={{ duration: 1.4 }}
              style={{ fontFamily: '"Lora", serif', fontSize: 10, textTransform: 'uppercase', color: '#4338ca', letterSpacing: '0.4em', marginBottom: 24 }}
            >
              A Five-Century Legacy of Care
            </motion.p>
            <motion.h1
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
              style={{
                fontFamily: '"DM Serif Display", Georgia, serif',
                fontSize: 'clamp(3.5rem,12vw,10rem)',
                fontWeight: 400, color: '#fff',
                lineHeight: 0.88, letterSpacing: '-0.04em',
                margin: 0,
              }}
            >
              The<br />
              <span style={{ fontStyle: 'italic', color: '#93c5fd' }}>Order.</span>
            </motion.h1>
          </div>
        </section>

        {/* ══════════ MAIN CARD ══════════ */}
        <section style={{ padding: '0 clamp(16px,5vw,48px)', marginTop: 'clamp(-48px,-6vw,-80px)', position: 'relative', zIndex: 20 }}>
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
            style={{
              maxWidth: 1100, margin: '0 auto',
              background: '#fff', borderRadius: 16,
              border: '1px solid #e2e8f0',
              boxShadow: '0 16px 56px rgba(0,0,0,0.07)',
              padding: 'clamp(28px,5vw,64px)',
            }}
          >
            <div className="order-main-layout">
              {/* Text col */}
              <div className="order-text-col">
                <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 28 }}>
                  <div style={{ width: 36, height: 1, background: '#4338ca' }} />
                  <span style={{ fontFamily: '"Lora", serif', fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.3em', color: '#4338ca' }}>
                    The Charism
                  </span>
                </div>
                <h2 style={{
                  fontFamily: '"DM Serif Display", Georgia, serif',
                  fontSize: 'clamp(1.8rem,4vw,3rem)',
                  fontWeight: 400, color: '#0f172a',
                  letterSpacing: '-0.03em', lineHeight: 1.1,
                  margin: '0 0 20px',
                }}>
                  The Brothers'<br />
                  <span style={{ color: '#4338ca', fontStyle: 'italic' }}>Sacred Mission</span>
                </h2>
                <hr className="gold-rule" style={{ margin: '0 0 24px' }} />
                <p style={{
                  fontFamily: '"Lora", serif',
                  fontSize: 'clamp(14px,1.6vw,18px)', color: '#475569',
                  lineHeight: 1.85, margin: 0,
                }}>
                  The Hospitaller Order of Saint John of God is a worldwide Catholic religious order. In Liberia, we are the custodians of a 500-year-old mission: to see the face of Christ in the suffering and to provide "Hospitality" without borders.
                </p>

                <AnimatePresence>
                  {expanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                      style={{ overflow: 'hidden' }}
                    >
                      <div style={{ marginTop: 28, paddingLeft: 20, borderLeft: '2px solid #4338ca20', display: 'flex', flexDirection: 'column', gap: 20 }}>
                        <p style={{ fontFamily: '"Lora", serif', fontSize: 'clamp(13px,1.4vw,16px)', color: '#64748b', lineHeight: 1.85, margin: 0 }}>
                          Founded in Granada, Spain, the Order has survived wars, pandemics, and social upheavals. Our Charism—a gift of the Holy Spirit—is specifically tailored to the healthcare vocation. It is more than just service; it is a spiritual commitment to professional excellence and human warmth.
                        </p>
                        <blockquote style={{ margin: 0, paddingLeft: 20, borderLeft: '3px solid #4338ca' }}>
                          <p style={{
                            fontFamily: '"DM Serif Display", serif',
                            fontSize: 'clamp(1rem,2.2vw,1.4rem)',
                            fontStyle: 'italic', color: '#4338ca',
                            lineHeight: 1.5, margin: 0,
                          }}>
                            "Go on doing good, brothers."
                          </p>
                          <cite style={{ display: 'block', marginTop: 8, fontFamily: '"Lora", serif', fontSize: 11, color: '#94a3b8', letterSpacing: '0.1em', textTransform: 'uppercase', fontStyle: 'normal' }}>
                            — St. John of God
                          </cite>
                        </blockquote>
                        <p style={{ fontFamily: '"Lora", serif', fontSize: 'clamp(13px,1.4vw,16px)', color: '#64748b', lineHeight: 1.85, margin: 0 }}>
                          Today, the Brothers work alongside lay professionals in Monrovia, ensuring that the spirit of St. John of God remains the heartbeat of the hospital's operations.
                        </p>
                        <a
                          href="https://www.ohsjd.org/Objects/Pagina.asp?ID=514&m=2"
                          target="_blank" rel="noopener noreferrer"
                          style={{
                            display: 'inline-flex', alignItems: 'center', gap: 8,
                            padding: '12px 22px', background: '#eff6ff',
                            color: '#1d4ed8', borderRadius: 8,
                            fontFamily: '"Lora", serif', fontWeight: 700, fontSize: 12,
                            textDecoration: 'none', transition: 'all 0.2s', width: 'fit-content',
                          }}
                          onMouseEnter={e => { e.currentTarget.style.background = '#1d4ed8'; e.currentTarget.style.color = '#fff'; }}
                          onMouseLeave={e => { e.currentTarget.style.background = '#eff6ff'; e.currentTarget.style.color = '#1d4ed8'; }}
                        >
                          Explore Global Charism <IoOpenOutline />
                        </a>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <button className="order-expand-btn" onClick={() => setExpanded(!expanded)} style={{ marginTop: 32 }}>
                  <IoReaderOutline size={16} />
                  {expanded ? 'Show Less' : 'Read Full History'}
                  <motion.span animate={{ rotate: expanded ? 180 : 0 }} style={{ display: 'inline-flex' }}>
                    <IoChevronDownOutline size={14} />
                  </motion.span>
                </button>
              </div>

              {/* Side col */}
              <div className="order-side-col">
                <div style={{
                  background: '#f8fafc', borderRadius: 12,
                  border: '1px solid #e2e8f0',
                  padding: 'clamp(24px,4vw,36px)',
                  position: 'relative', overflow: 'hidden',
                }}>
                  <IoEarthOutline style={{ position: 'absolute', right: -12, top: -12, fontSize: 100, color: '#e2e8f0', opacity: 0.6 }} />
                  <h4 style={{ fontFamily: '"Lora", serif', fontSize: 10, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.25em', marginBottom: 28, position: 'relative', zIndex: 1 }}>
                    Global Impact
                  </h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 24, position: 'relative', zIndex: 1 }}>
                    {globalStats.map(s => (
                      <div key={s.num} style={{ display: 'flex', alignItems: 'center', gap: 16, paddingBottom: 24, borderBottom: '1px solid #e2e8f0' }}>
                        <span style={{ fontFamily: '"DM Serif Display", serif', fontSize: 'clamp(1.8rem,4vw,2.4rem)', color: s.color, lineHeight: 1 }}>
                          {s.num}
                        </span>
                        <p style={{ fontFamily: '"Lora", serif', fontSize: 11, fontWeight: 600, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.1em', margin: 0, lineHeight: 1.4 }}>
                          {s.label}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </section>

        {/* ══════════ VALUES ══════════ */}
        <section style={{ padding: 'clamp(64px,10vw,120px) clamp(16px,5vw,48px)', position: 'relative', zIndex: 5 }}>
          <div style={{ maxWidth: 1100, margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: 'clamp(40px,6vw,72px)' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 16, marginBottom: 16 }}>
                <div style={{ flex: 1, maxWidth: 80, height: 1, background: 'linear-gradient(to left, #e2e8f0, transparent)' }} />
                <span style={{ fontFamily: '"Lora", serif', fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.3em', color: '#4338ca' }}>
                  The Four Pillars
                </span>
                <div style={{ flex: 1, maxWidth: 80, height: 1, background: 'linear-gradient(to right, #e2e8f0, transparent)' }} />
              </div>
              <h2 style={{
                fontFamily: '"DM Serif Display", Georgia, serif',
                fontSize: 'clamp(2rem,5vw,3.5rem)',
                fontWeight: 400, color: '#0f172a',
                letterSpacing: '-0.03em', lineHeight: 1.1, margin: 0,
              }}>
                Foundational Values
              </h2>
            </div>
            <div className="order-values-grid">
              {coreValues.map((v, i) => <ValueCard key={i} v={v} index={i} />)}
            </div>
          </div>
        </section>

        {/* ══════════ CTA ══════════ */}
        <section style={{ padding: '0 clamp(16px,5vw,48px)', paddingBottom: 'clamp(64px,10vw,128px)' }}>
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            style={{
              maxWidth: 1100, margin: '0 auto',
              background: '#0a0f1e', borderRadius: 16,
              padding: 'clamp(52px,8vw,96px) clamp(24px,5vw,80px)',
              textAlign: 'center', position: 'relative', overflow: 'hidden',
              boxShadow: '0 32px 80px rgba(10,15,30,0.3)',
            }}
          >
            {/* Top accent */}
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: 'linear-gradient(to right, #e11d48, #4338ca, #0d9488)' }} />
            {/* Glow */}
            <div style={{
              position: 'absolute', top: '-20%', right: '-10%',
              width: 'clamp(200px,40vw,400px)', height: 'clamp(200px,40vw,400px)',
              background: 'rgba(67,56,202,0.15)', borderRadius: '50%',
              filter: 'blur(80px)', pointerEvents: 'none',
              animation: 'subtlePulse 4s ease-in-out infinite',
            }} />

            <p style={{ fontFamily: '"Lora", serif', fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.3em', color: '#a5b4fc', marginBottom: 24, position: 'relative', zIndex: 1 }}>
              The Final Words of St. John of God
            </p>
            <h2 style={{
              fontFamily: '"DM Serif Display", Georgia, serif',
              fontSize: 'clamp(2rem,5vw,4rem)',
              fontWeight: 400, color: '#fff',
              letterSpacing: '-0.03em', lineHeight: 1.1,
              margin: '0 0 24px', position: 'relative', zIndex: 1,
              fontStyle: 'italic',
            }}>
              "Go on doing good,<br />brothers."
            </h2>
            <p style={{
              fontFamily: '"Lora", serif',
              fontSize: 'clamp(13px,1.6vw,17px)', color: '#94a3b8',
              lineHeight: 1.85, maxWidth: 500, margin: '0 auto 48px',
              position: 'relative', zIndex: 1,
            }}>
              These words remain our guiding light today in Monrovia. Join us in this mission of healing.
            </p>
            <div className="order-cta-btns" style={{ position: 'relative', zIndex: 1 }}>
              <button style={{
                padding: 'clamp(14px,2vw,18px) clamp(28px,4vw,48px)',
                background: '#fff', color: '#0f172a',
                border: 'none', borderRadius: 8,
                fontFamily: '"Lora", serif', fontWeight: 700,
                fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.15em',
                cursor: 'pointer', transition: 'all 0.2s',
              }}
                onMouseEnter={e => { e.currentTarget.style.background = '#4338ca'; e.currentTarget.style.color = '#fff'; }}
                onMouseLeave={e => { e.currentTarget.style.background = '#fff'; e.currentTarget.style.color = '#0f172a'; }}
              >
                Contact the Order
              </button>
              <a href="https://www.ohsjd.org/" target="_blank" rel="noopener noreferrer"
                style={{
                  padding: 'clamp(14px,2vw,18px) clamp(28px,4vw,48px)',
                  border: '1px solid rgba(255,255,255,0.2)', color: '#fff',
                  borderRadius: 8, fontFamily: '"Lora", serif', fontWeight: 700,
                  fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.15em',
                  textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 8,
                  transition: 'border-color 0.2s',
                }}
                onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.5)'}
                onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)'}
              >
                International Site <IoOpenOutline />
              </a>
            </div>
          </motion.div>
        </section>

      </div>
    </>
  );
};

export default TheOrder;