import React, { useState, useRef } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import {
  IoSchoolOutline, IoRibbonOutline, IoFlaskOutline,
  IoPeopleOutline, IoArrowForwardOutline, IoCheckmarkCircle,
  IoReaderOutline, IoStatsChartOutline, IoCloseOutline,
  IoChevronDownOutline,
} from 'react-icons/io5';

/* ─── DATA ─────────────────────────────────────────────────── */
const TRAIN_COLORS = {
  blue:   { bg: '#1d4ed8', light: '#eff6ff', border: '#bfdbfe' },
  teal:   { bg: '#0d9488', light: '#f0fdfa', border: '#99f6e4' },
  indigo: { bg: '#4338ca', light: '#eef2ff', border: '#c7d2fe' },
  orange: { bg: '#c2410c', light: '#fff7ed', border: '#fed7aa' },
};

const trainingPrograms = [
  {
    id: 1, title: 'Medical Internships', category: 'Professional Development',
    description: 'Hands-on clinical rotations for medical students and graduates, providing exposure to diverse pathologies in a mission-driven environment.',
    details: 'Our internship program is accredited and follows the national curriculum, focusing on Internal Medicine, Surgery, Pediatrics, and OBGYN. Interns work alongside senior consultants in a high-volume clinical setting.',
    stats: '12 Spots Available', icon: <IoSchoolOutline />, colorKey: 'blue',
  },
  {
    id: 2, title: 'Nursing Excellence', category: 'Specialized Training',
    description: 'Advanced clinical training for registered nurses, focusing on critical care, maternal health, and emergency response protocols.',
    details: 'This program enhances the capacity of nurses to handle specialized equipment, manage intensive care units, and implement modern patient safety protocols.',
    stats: 'Last 4 Seats', icon: <IoRibbonOutline />, colorKey: 'teal',
  },
  {
    id: 3, title: 'Laboratory Sciences', category: 'Technical Training',
    description: 'Specialized workshops in diagnostic pathology, microbiology, and blood bank management using modern laboratory standards.',
    details: 'Participants gain proficiency in automated diagnostic systems, quality control measures, and biosafety regulations in a clinical laboratory environment.',
    stats: 'Registration Open', icon: <IoFlaskOutline />, colorKey: 'indigo',
  },
  {
    id: 4, title: 'Community Health', category: 'Outreach Program',
    description: 'Training for community health workers to bridge the gap between hospital care and rural Liberian communities.',
    details: 'Focuses on preventative medicine, maternal health education, and disease surveillance at the community level.',
    stats: 'Coming Soon', icon: <IoPeopleOutline />, colorKey: 'orange',
  },
];

const checkFeatures = ['Accredited Internships', 'International Mentors', 'Modern Clinical Labs', 'Research Opportunities'];

/* ─── TRAINING CARD ─────────────────────────────────────────── */
const TrainingCard = ({ prog, onClick, index }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  const c = TRAIN_COLORS[prog.colorKey];

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 28 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
      onClick={onClick}
      style={{
        background: '#fff', border: '1px solid #f0f0f0',
        borderRadius: 16, padding: 'clamp(24px,3vw,36px)',
        cursor: 'pointer', display: 'flex', flexDirection: 'column',
        position: 'relative', overflow: 'hidden',
        transition: 'all 0.3s',
      }}
      whileHover={{ y: -6, boxShadow: '0 24px 60px rgba(0,0,0,0.09)' }}
      whileTap={{ scale: 0.98 }}
    >
      {/* Left accent bar */}
      <div style={{ position: 'absolute', top: 0, left: 0, bottom: 0, width: 3, background: c.bg, borderRadius: '16px 0 0 16px' }} />

      {/* Icon */}
      <div style={{
        width: 52, height: 52, borderRadius: 14,
        background: c.light, border: `1px solid ${c.border}`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 22, color: c.bg, marginBottom: 20, flexShrink: 0,
      }}>
        {prog.icon}
      </div>

      {/* Category */}
      <span style={{
        fontFamily: '"Lora", serif', fontSize: 10,
        textTransform: 'uppercase', letterSpacing: '0.2em',
        color: c.bg, marginBottom: 8, display: 'block',
      }}>
        {prog.category}
      </span>

      {/* Title */}
      <h3 style={{
        fontFamily: '"DM Serif Display", Georgia, serif',
        fontSize: 'clamp(1.1rem,2.2vw,1.4rem)',
        fontWeight: 400, color: '#0f172a',
        margin: '0 0 12px', lineHeight: 1.2,
        letterSpacing: '-0.02em',
      }}>
        {prog.title}
      </h3>

      {/* Desc */}
      <p style={{
        fontFamily: '"Lora", serif',
        fontSize: 'clamp(13px,1.3vw,14px)', color: '#64748b',
        lineHeight: 1.75, margin: '0 0 24px', flexGrow: 1,
        display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden',
      }}>
        {prog.description}
      </p>

      {/* Footer */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 'auto' }}>
        <span style={{
          display: 'flex', alignItems: 'center', gap: 5,
          fontFamily: '"Lora", serif', fontSize: 10,
          color: c.bg, textTransform: 'uppercase', letterSpacing: '0.15em',
        }}>
          <IoStatsChartOutline size={12} /> {prog.stats}
        </span>
        <div style={{
          width: 36, height: 36, borderRadius: '50%',
          background: c.light, color: c.bg,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 16,
        }}>
          <IoArrowForwardOutline />
        </div>
      </div>
    </motion.div>
  );
};

/* ─── MODAL ──────────────────────────────────────────────────── */
const TrainingModal = ({ prog, onClose }) => {
  const c = TRAIN_COLORS[prog.colorKey];
  return (
    <motion.div
      style={{
        position: 'fixed', inset: 0, zIndex: 200,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: 'clamp(12px,3vw,24px)',
        background: 'rgba(10,15,30,0.85)', backdropFilter: 'blur(12px)',
      }}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.94, y: 24 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.94, y: 24 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        style={{
          background: '#fff', width: '100%', maxWidth: 560,
          borderRadius: 20, overflow: 'hidden',
          position: 'relative', maxHeight: '90vh', overflowY: 'auto',
          boxShadow: '0 40px 100px rgba(0,0,0,0.3)',
        }}
      >
        <button
          onClick={onClose}
          style={{
            position: 'absolute', top: 12, right: 12, zIndex: 10,
            width: 36, height: 36, borderRadius: '50%',
            background: 'rgba(255,255,255,0.2)', border: 'none',
            color: '#fff', fontSize: 20, cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            transition: 'background 0.2s',
          }}
          onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.4)'}
          onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.2)'}
        >
          <IoCloseOutline />
        </button>

        {/* Header */}
        <div style={{
          padding: 'clamp(28px,5vw,48px)',
          background: c.bg,
          minHeight: 140,
          display: 'flex', flexDirection: 'column', justifyContent: 'flex-end',
        }}>
          <span style={{ fontFamily: '"Lora", serif', fontSize: 9, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.25em', color: 'rgba(255,255,255,0.65)', marginBottom: 8, display: 'block' }}>
            {prog.category}
          </span>
          <h3 style={{
            fontFamily: '"DM Serif Display", Georgia, serif',
            fontSize: 'clamp(1.5rem,4vw,2.2rem)',
            fontWeight: 400, color: '#fff', margin: 0,
            lineHeight: 1.1, letterSpacing: '-0.03em',
          }}>
            {prog.title}
          </h3>
        </div>

        {/* Body */}
        <div style={{ padding: 'clamp(24px,4vw,40px)' }}>
          <h4 style={{ fontFamily: '"Lora", serif', fontWeight: 700, color: '#0f172a', textTransform: 'uppercase', fontSize: 10, letterSpacing: '0.2em', marginBottom: 16 }}>
            Detailed Overview
          </h4>
          <p style={{ fontFamily: '"Lora", serif', fontSize: 'clamp(13px,1.5vw,16px)', color: '#475569', lineHeight: 1.85, margin: '0 0 28px' }}>
            {prog.details}
          </p>

          <div style={{ background: '#f8fafc', borderRadius: 12, border: '1px solid #e2e8f0', padding: 'clamp(16px,3vw,24px)', display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: 14, marginBottom: 0 }}>
            <div>
              <p style={{ fontFamily: '"Lora", serif', fontSize: 9, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.2em', margin: '0 0 6px' }}>
                Current Status
              </p>
              <p style={{ fontFamily: '"DM Serif Display", serif', fontSize: '1.2rem', color: c.bg, margin: 0 }}>
                {prog.stats}
              </p>
            </div>
            <button style={{
              padding: 'clamp(10px,2vw,14px) clamp(18px,3vw,28px)',
              background: '#0f172a', color: '#fff', borderRadius: 8,
              fontFamily: '"Lora", serif', fontWeight: 700, fontSize: 11,
              textTransform: 'uppercase', letterSpacing: '0.15em',
              border: 'none', cursor: 'pointer', whiteSpace: 'nowrap',
              transition: 'background 0.2s',
            }}
              onMouseEnter={e => e.currentTarget.style.background = c.bg}
              onMouseLeave={e => e.currentTarget.style.background = '#0f172a'}
            >
              Request Syllabus
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

/* ─── MAIN ───────────────────────────────────────────────────── */
const Trainings = () => {
  const [expanded, setExpanded] = useState(false);
  const [selected, setSelected] = useState(null);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=Lora:ital,wght@0,400;0,500;0,600;1,400&display=swap');
        *, *::before, *::after { box-sizing: border-box; }

        .train-root {
          background: #fff;
          min-height: 100vh;
          font-family: "Lora", Georgia, serif;
        }

        .train-root::before {
          content: '';
          position: fixed; inset: 0; z-index: 0; pointer-events: none;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E");
          background-size: 200px; opacity: 0.18; mix-blend-mode: multiply;
        }

        .train-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
          gap: clamp(16px, 2vw, 28px);
        }
        @media (max-width: 480px) {
          .train-grid { grid-template-columns: 1fr; }
        }

        .train-checks {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
          margin-top: 24px;
        }
        @media (max-width: 400px) {
          .train-checks { grid-template-columns: 1fr; }
        }

        .gold-rule { height: 1px; background: linear-gradient(to right, transparent, #e2e8f0, transparent); border: none; margin: 0; }

        .train-expand-btn {
          display: inline-flex; align-items: center; gap: 10px;
          background: none; border: none; cursor: pointer; padding: 0;
          font-family: "Lora", serif; font-size: 11px; font-weight: 700;
          text-transform: uppercase; letter-spacing: 0.2em;
          color: #1d4ed8; transition: color 0.2s;
        }
        .train-expand-btn:hover { color: #0d9488; }

        @keyframes subtlePulse { 0%,100%{opacity:0.5} 50%{opacity:1} }
      `}</style>

      <div className="train-root">

        {/* ══════════ HERO ══════════ */}
        <section style={{
          position: 'relative', height: 'clamp(380px,62vh,80vh)',
          display: 'flex', alignItems: 'center', overflow: 'hidden',
          background: '#0a0f1e',
        }}>
          <motion.div
            initial={{ scale: 1.08 }} animate={{ scale: 1 }}
            transition={{ duration: 8, ease: 'easeOut' }}
            style={{ position: 'absolute', inset: 0 }}
          >
            <img
              src="https://images.ctfassets.net/jwk3944w4k64/QgPvuGAn9OQO90yLSCfQV/256b0b91ea3137a7a1fa8de209acef28/post5-10-scaled.jpg"
              alt="Medical Education"
              style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'brightness(0.28) saturate(0.7)' }}
            />
          </motion.div>
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, transparent 30%, #fff 100%)' }} />

          <div style={{ position: 'relative', zIndex: 10, padding: '0 clamp(20px,6vw,64px)', maxWidth: 820 }}>
            <motion.p
              initial={{ opacity: 0, letterSpacing: '1em' }}
              animate={{ opacity: 1, letterSpacing: '0.4em' }}
              transition={{ duration: 1.2 }}
              style={{ fontFamily: '"Lora", serif', fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.4em', color: '#1d4ed8', marginBottom: 20 }}
            >
              Academic Catalog
            </motion.p>
            <motion.h1
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
              style={{
                fontFamily: '"DM Serif Display", Georgia, serif',
                fontSize: 'clamp(3rem,11vw,9rem)',
                fontWeight: 400, color: '#fff',
                lineHeight: 0.88, letterSpacing: '-0.04em',
                margin: '0 0 28px',
              }}
            >
              Train to<br />
              <span style={{ fontStyle: 'italic', color: '#93c5fd' }}>Transform.</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              style={{
                fontFamily: '"Lora", serif',
                fontSize: 'clamp(13px,1.6vw,17px)', color: 'rgba(255,255,255,0.7)',
                lineHeight: 1.75, margin: 0, maxWidth: 480,
                paddingLeft: 20, borderLeft: '2px solid #1d4ed8',
              }}
            >
              Advancing medical knowledge at the heart of Monrovia. We don't just teach medicine — we cultivate compassion.
            </motion.p>
          </div>
        </section>

        {/* ══════════ INTRO ══════════ */}
        <section style={{ padding: '0 clamp(16px,5vw,48px)', marginTop: 'clamp(-48px,-6vw,-80px)', position: 'relative', zIndex: 20 }}>
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
            style={{
              maxWidth: 900, margin: '0 auto',
              background: '#fff', borderRadius: 16,
              border: '1px solid #e2e8f0',
              boxShadow: '0 16px 56px rgba(0,0,0,0.07)',
              padding: 'clamp(28px,5vw,60px)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 28 }}>
              <div style={{ width: 36, height: 1, background: '#1d4ed8' }} />
              <span style={{ fontFamily: '"Lora", serif', fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.3em', color: '#1d4ed8' }}>
                Educational Mission
              </span>
            </div>
            <h2 style={{
              fontFamily: '"DM Serif Display", Georgia, serif',
              fontSize: 'clamp(1.6rem,4vw,2.8rem)',
              fontWeight: 400, color: '#0f172a',
              letterSpacing: '-0.03em', lineHeight: 1.1,
              margin: '0 0 20px',
            }}>
              Where Theory Meets<br />
              <span style={{ color: '#1d4ed8', fontStyle: 'italic' }}>Real Clinical Practice</span>
            </h2>
            <hr className="gold-rule" style={{ margin: '0 0 24px' }} />
            <p style={{ fontFamily: '"Lora", serif', fontSize: 'clamp(14px,1.6vw,17px)', color: '#475569', lineHeight: 1.85, margin: 0 }}>
              Saint Joseph's Catholic Hospital is recognized as a center of clinical excellence. We provide a rigorous training environment where academic theory meets real-world clinical challenges.
            </p>

            <AnimatePresence>
              {expanded && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                  style={{ overflow: 'hidden' }}
                >
                  <p style={{ fontFamily: '"Lora", serif', fontSize: 'clamp(13px,1.4vw,16px)', color: '#64748b', lineHeight: 1.85, marginTop: 20, marginBottom: 0 }}>
                    In alignment with our 60-year heritage, our training programs focus on both technical proficiency and the ethical dimensions of healthcare. We partner with the Ministry of Health and global NGOs to ensure our curriculum remains at the cutting edge of modern medicine in West Africa.
                  </p>
                  <div className="train-checks">
                    {checkFeatures.map(t => (
                      <div key={t} style={{ display: 'flex', alignItems: 'center', gap: 10, fontFamily: '"Lora", serif', fontWeight: 600, color: '#0f172a', fontSize: 'clamp(12px,1.4vw,14px)' }}>
                        <IoCheckmarkCircle style={{ color: '#1d4ed8', flexShrink: 0 }} size={18} /> {t}
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <button className="train-expand-btn" onClick={() => setExpanded(!expanded)} style={{ marginTop: 28 }}>
              <IoReaderOutline size={16} />
              {expanded ? 'Collapse Text' : 'Read Full Philosophy'}
              <motion.span animate={{ rotate: expanded ? 180 : 0 }} style={{ display: 'inline-flex' }}>
                <IoChevronDownOutline size={14} />
              </motion.span>
            </button>
          </motion.div>
        </section>

        {/* ══════════ GRID ══════════ */}
        <section style={{ padding: 'clamp(64px,10vw,120px) clamp(16px,5vw,48px)', position: 'relative', zIndex: 5 }}>
          <div style={{ maxWidth: 1100, margin: '0 auto' }}>
            <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'flex-end', justifyContent: 'space-between', gap: 20, marginBottom: 'clamp(32px,5vw,56px)' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 12 }}>
                  <div style={{ width: 36, height: 1, background: '#1d4ed8' }} />
                  <span style={{ fontFamily: '"Lora", serif', fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.3em', color: '#1d4ed8' }}>
                    Academic Catalog
                  </span>
                </div>
                <h2 style={{
                  fontFamily: '"DM Serif Display", Georgia, serif',
                  fontSize: 'clamp(1.8rem,4vw,3rem)',
                  fontWeight: 400, color: '#0f172a',
                  letterSpacing: '-0.03em', lineHeight: 1.1, margin: 0,
                }}>
                  Specialized<br />
                  <span style={{ color: '#1d4ed8', fontStyle: 'italic' }}>Pathways</span>
                </h2>
              </div>
            </div>
            <div className="train-grid">
              {trainingPrograms.map((prog, i) => (
                <TrainingCard key={prog.id} prog={prog} index={i} onClick={() => setSelected(prog)} />
              ))}
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
              display: 'flex', flexWrap: 'wrap',
              alignItems: 'center', justifyContent: 'space-between', gap: 40,
              position: 'relative', overflow: 'hidden',
            }}
          >
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: 'linear-gradient(to right, #1d4ed8, #0d9488, #4338ca)' }} />
            <div style={{
              position: 'absolute', bottom: '-20%', left: '-5%',
              width: 'clamp(160px,30vw,320px)', height: 'clamp(160px,30vw,320px)',
              background: 'rgba(29,78,216,0.12)', borderRadius: '50%',
              filter: 'blur(80px)', pointerEvents: 'none',
              animation: 'subtlePulse 5s ease-in-out infinite',
            }} />

            <div style={{ position: 'relative', zIndex: 1 }}>
              <p style={{ fontFamily: '"Lora", serif', fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.3em', color: '#93c5fd', margin: '0 0 16px' }}>
                Apply Today
              </p>
              <h2 style={{
                fontFamily: '"DM Serif Display", Georgia, serif',
                fontSize: 'clamp(1.8rem,4vw,3rem)',
                fontWeight: 400, color: '#fff',
                letterSpacing: '-0.03em', lineHeight: 1.1, margin: 0,
              }}>
                Begin your journey<br />
                <span style={{ fontStyle: 'italic', color: '#93c5fd' }}>in excellence.</span>
              </h2>
            </div>

            <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', position: 'relative', zIndex: 1 }}>
              <button style={{
                padding: 'clamp(14px,2vw,18px) clamp(28px,4vw,48px)',
                background: '#fff', color: '#0f172a',
                border: 'none', borderRadius: 8,
                fontFamily: '"Lora", serif', fontWeight: 700,
                fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.15em',
                cursor: 'pointer', transition: 'all 0.2s',
              }}
                onMouseEnter={e => { e.currentTarget.style.background = '#1d4ed8'; e.currentTarget.style.color = '#fff'; }}
                onMouseLeave={e => { e.currentTarget.style.background = '#fff'; e.currentTarget.style.color = '#0f172a'; }}
              >
                Apply Now
              </button>
              <button style={{
                padding: 'clamp(14px,2vw,18px) clamp(28px,4vw,48px)',
                background: 'transparent', color: '#fff',
                border: '1px solid rgba(255,255,255,0.2)', borderRadius: 8,
                fontFamily: '"Lora", serif', fontWeight: 700,
                fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.15em',
                cursor: 'pointer', transition: 'border-color 0.2s',
              }}
                onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.5)'}
                onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)'}
              >
                Download Catalog
              </button>
            </div>
          </motion.div>
        </section>

        {/* ══════════ MODAL ══════════ */}
        <AnimatePresence>
          {selected && <TrainingModal prog={selected} onClose={() => setSelected(null)} />}
        </AnimatePresence>

      </div>
    </>
  );
};

export default Trainings;