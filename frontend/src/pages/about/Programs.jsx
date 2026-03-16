import React, { useState, useRef } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import {
  IoHeartOutline, IoShieldCheckmarkOutline, IoGitNetworkOutline,
  IoMedicalOutline, IoCloseOutline, IoArrowForward,
  IoInformationCircleOutline, IoChevronDownOutline,
} from 'react-icons/io5';

/* ─── DATA ─────────────────────────────────────────────────── */
const PROG_COLORS = {
  rose:   { bg: '#e11d48', light: '#fff1f2', border: '#fecdd3', pill: '#fda4af' },
  blue:   { bg: '#1d4ed8', light: '#eff6ff', border: '#bfdbfe', pill: '#93c5fd' },
  teal:   { bg: '#0d9488', light: '#f0fdfa', border: '#99f6e4', pill: '#5eead4' },
  indigo: { bg: '#4338ca', light: '#eef2ff', border: '#c7d2fe', pill: '#a5b4fc' },
};

const hospitalPrograms = [
  {
    id: 'p1', title: 'Maternal & Child Health', category: 'Specialized Care',
    shortDesc: 'Comprehensive prenatal, delivery, and postnatal services ensuring the safety of both mother and child.',
    fullDesc: 'Our flagship program focuses on reducing maternal mortality through expert clinical intervention. We provide 24/7 emergency obstetric care, neonatal intensive care unit (NICU) support, and a dedicated team of midwives and pediatricians.',
    icon: <IoHeartOutline />, colorKey: 'rose', stats: 'Active 24/7',
  },
  {
    id: 'p2', title: 'HIV/AIDS Outreach', category: 'Community Health',
    shortDesc: 'Integrated testing, counseling, and long-term antiretroviral treatment support for the community.',
    fullDesc: 'Working in partnership with international health bodies, we offer confidential testing and holistic management. Our program includes peer support groups, nutritional counseling, and prevention of mother-to-child transmission (PMTCT).',
    icon: <IoShieldCheckmarkOutline />, colorKey: 'blue', stats: 'Free Services',
  },
  {
    id: 'p3', title: 'Surgical Outreach', category: 'Clinical Excellence',
    shortDesc: 'Specialized surgical campaigns providing critical operations to underserved populations.',
    fullDesc: 'We regularly host surgical missions focusing on corrective procedures, ophthalmic surgery, and general surgical needs. Our state-of-the-art theaters are equipped to handle complex cases.',
    icon: <IoMedicalOutline />, colorKey: 'teal', stats: 'Quarterly Missions',
  },
  {
    id: 'p4', title: 'Health Education', category: 'Preventative',
    shortDesc: 'Empowering Monrovia with the knowledge to prevent communicable diseases and maintain wellness.',
    fullDesc: 'This program bridges the gap between the hospital and the home. We conduct school visits, community workshops, and radio broadcasts to educate the public on hygiene, sanitation, and early symptom recognition.',
    icon: <IoGitNetworkOutline />, colorKey: 'indigo', stats: 'Community Wide',
  },
];

/* ─── PROGRAM CARD ──────────────────────────────────────────── */
const ProgramCard = ({ prog, onClick, index }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  const c = PROG_COLORS[prog.colorKey];

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 32 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
      onClick={onClick}
      style={{
        background: '#fff',
        border: `1px solid #f0f0f0`,
        borderRadius: 16,
        padding: 'clamp(24px,3vw,36px)',
        cursor: 'pointer',
        display: 'flex',
        flexDirection: 'column',
        transition: 'all 0.3s',
        position: 'relative',
        overflow: 'hidden',
      }}
      whileHover={{ y: -6, boxShadow: `0 24px 60px rgba(0,0,0,0.09)` }}
      whileTap={{ scale: 0.98 }}
    >
      {/* Top accent line */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: c.bg, borderRadius: '16px 16px 0 0' }} />

      {/* Icon */}
      <div style={{
        width: 52, height: 52, borderRadius: 14,
        background: c.light, border: `1px solid ${c.border}`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 22, color: c.bg,
        marginBottom: 20, flexShrink: 0,
      }}>
        {prog.icon}
      </div>

      {/* Category pill */}
      <span style={{
        display: 'inline-block', marginBottom: 8,
        fontFamily: '"Lora", Georgia, serif',
        fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.2em',
        color: c.bg, fontWeight: 600,
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
        fontFamily: '"Lora", Georgia, serif',
        fontSize: 'clamp(13px,1.3vw,14px)', color: '#64748b',
        lineHeight: 1.75, margin: '0 0 24px', flexGrow: 1,
        display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden',
      }}>
        {prog.shortDesc}
      </p>

      {/* Footer */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: 16, borderTop: `1px solid ${c.border}`, marginTop: 'auto' }}>
        <span style={{ fontFamily: '"Lora", serif', fontSize: 11, color: '#94a3b8', letterSpacing: '0.05em', fontStyle: 'italic' }}>
          {prog.stats}
        </span>
        <div style={{
          width: 36, height: 36, borderRadius: '50%',
          background: c.light, color: c.bg,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 16, transition: 'all 0.2s',
        }}>
          <IoArrowForward />
        </div>
      </div>
    </motion.div>
  );
};

/* ─── MODAL ──────────────────────────────────────────────────── */
const ProgramModal = ({ prog, onClose }) => {
  const c = PROG_COLORS[prog.colorKey];
  return (
    <motion.div
      style={{
        position: 'fixed', inset: 0, zIndex: 200,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: 'clamp(12px,3vw,24px)',
        background: 'rgba(15,23,42,0.75)',
        backdropFilter: 'blur(12px)',
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
          boxShadow: '0 40px 100px rgba(0,0,0,0.25)',
        }}
      >
        {/* Close */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute', top: 14, right: 14, zIndex: 10,
            width: 36, height: 36, borderRadius: '50%',
            background: 'rgba(255,255,255,0.25)', border: 'none',
            color: '#fff', fontSize: 20, cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            transition: 'background 0.2s',
          }}
          onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.4)'}
          onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.25)'}
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
            fontWeight: 400, color: '#fff', margin: 0, lineHeight: 1.1,
            letterSpacing: '-0.03em',
          }}>
            {prog.title}
          </h3>
        </div>

        {/* Body */}
        <div style={{ padding: 'clamp(24px,4vw,40px)' }}>
          <p style={{
            fontFamily: '"Lora", Georgia, serif',
            fontSize: 'clamp(13px,1.5vw,16px)', color: '#475569',
            lineHeight: 1.85, margin: '0 0 28px',
          }}>
            {prog.fullDesc}
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
            <div style={{ background: c.light, padding: 'clamp(14px,2.5vw,22px)', borderRadius: 12, border: `1px solid ${c.border}` }}>
              <p style={{ fontFamily: '"Lora", serif', fontSize: 9, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.2em', margin: '0 0 6px' }}>
                Availability
              </p>
              <p style={{ fontFamily: '"DM Serif Display", serif', fontSize: '1.1rem', color: '#0f172a', margin: 0 }}>
                {prog.stats}
              </p>
            </div>
            <button style={{
              background: '#0f172a', color: '#fff', borderRadius: 12,
              fontFamily: '"Lora", serif', fontWeight: 700,
              fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.15em',
              border: 'none', cursor: 'pointer', transition: 'background 0.2s',
              padding: '14px 20px',
            }}
              onMouseEnter={e => e.currentTarget.style.background = c.bg}
              onMouseLeave={e => e.currentTarget.style.background = '#0f172a'}
            >
              Partner With Us
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

/* ─── MAIN ───────────────────────────────────────────────────── */
const Programs = () => {
  const [selected, setSelected] = useState(null);
  const [introOpen, setIntroOpen] = useState(false);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=Lora:ital,wght@0,400;0,500;0,600;1,400&display=swap');
        *, *::before, *::after { box-sizing: border-box; }

        .prog-root {
          background: #fff;
          min-height: 100vh;
          font-family: "Lora", Georgia, serif;
        }

        /* Grain */
        .prog-root::before {
          content: '';
          position: fixed; inset: 0; z-index: 0; pointer-events: none;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E");
          background-size: 200px; opacity: 0.2; mix-blend-mode: multiply;
        }

        .prog-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
          gap: clamp(16px, 2vw, 28px);
        }

        @media (max-width: 480px) {
          .prog-grid { grid-template-columns: 1fr; }
        }

        .gold-rule { height: 1px; background: linear-gradient(to right, transparent, #e2e8f0, transparent); border: none; margin: 0; }

        .prog-expand-btn {
          display: inline-flex; align-items: center; gap: 8px;
          background: none; border: none; cursor: pointer; padding: 0;
          font-family: "Lora", serif; font-size: 12px;
          text-transform: uppercase; letter-spacing: 0.2em;
          color: #1d4ed8; transition: color 0.2s;
        }
        .prog-expand-btn:hover { color: #e11d48; }
      `}</style>

      <div className="prog-root">

        {/* ══════════ HERO ══════════ */}
        <section style={{
          position: 'relative', height: 'clamp(380px,60vh,75vh)',
          display: 'flex', alignItems: 'center', overflow: 'hidden',
          background: '#0a0f1e',
        }}>
          <motion.div
            initial={{ scale: 1.08 }} animate={{ scale: 1 }}
            transition={{ duration: 8, ease: 'easeOut' }}
            style={{ position: 'absolute', inset: 0 }}
          >
            <img
              src="https://images.ctfassets.net/jwk3944w4k64/NRDVy9jkNhZGlYCAwEH32/150933d871ecb963d98f54ca53894e78/picture-4-scaled.jpg"
              alt="Hospital Programs"
              style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'brightness(0.3) saturate(0.7)' }}
            />
          </motion.div>
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, transparent 30%, #fff 100%)' }} />

          <div style={{ position: 'relative', zIndex: 10, padding: '0 clamp(20px,6vw,64px)', maxWidth: 800 }}>
            <motion.p
              initial={{ opacity: 0, letterSpacing: '1em' }}
              animate={{ opacity: 1, letterSpacing: '0.35em' }}
              transition={{ duration: 1.2 }}
              style={{ fontFamily: '"Lora", serif', fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.35em', color: '#e11d48', marginBottom: 20 }}
            >
              Impact & Outreach
            </motion.p>
            <motion.h1
              initial={{ opacity: 0, y: 36 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
              style={{
                fontFamily: '"DM Serif Display", Georgia, serif',
                fontSize: 'clamp(3rem,11vw,9rem)',
                fontWeight: 400, color: '#fff',
                lineHeight: 0.88, letterSpacing: '-0.04em',
                margin: 0,
              }}
            >
              Our<br />
              <span style={{ fontStyle: 'italic', color: '#93c5fd' }}>Programs.</span>
            </motion.h1>
          </div>
        </section>

        {/* ══════════ INTRO CARD ══════════ */}
        <section style={{ padding: '0 clamp(16px,5vw,48px)', marginTop: 'clamp(-48px,-6vw,-80px)', position: 'relative', zIndex: 20 }}>
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
            style={{
              maxWidth: 900, margin: '0 auto',
              background: '#fff', borderRadius: 16,
              border: '1px solid #e2e8f0',
              boxShadow: '0 16px 56px rgba(0,0,0,0.08)',
              padding: 'clamp(28px,5vw,60px)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 28 }}>
              <div style={{ width: 36, height: 1, background: '#e11d48' }} />
              <span style={{ fontFamily: '"Lora", serif', fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.3em', color: '#e11d48' }}>
                Our Mission
              </span>
            </div>
            <h2 style={{
              fontFamily: '"DM Serif Display", Georgia, serif',
              fontSize: 'clamp(1.6rem,4vw,2.8rem)',
              fontWeight: 400, color: '#0f172a',
              letterSpacing: '-0.03em', lineHeight: 1.1,
              margin: '0 0 20px',
            }}>
              Sustainable Health<br />
              <span style={{ color: '#1d4ed8', fontStyle: 'italic' }}>for Liberia</span>
            </h2>
            <hr className="gold-rule" style={{ margin: '0 0 24px' }} />
            <p style={{ fontFamily: '"Lora", serif', fontSize: 'clamp(14px,1.6vw,17px)', color: '#475569', lineHeight: 1.85, margin: '0 0 0' }}>
              Saint Joseph's Catholic Hospital operates far beyond its clinical walls. Through our specialized programs, we address the root causes of health instability in our communities.
            </p>

            <AnimatePresence>
              {introOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                  style={{ overflow: 'hidden' }}
                >
                  <p style={{ fontFamily: '"Lora", serif', fontSize: 'clamp(13px,1.5vw,16px)', color: '#64748b', lineHeight: 1.85, marginTop: 20 }}>
                    By integrating clinical expertise with community outreach, we ensure that healthcare is accessible, equitable, and sustainable. Our programs are designed in collaboration with global health partners and local leaders to meet the unique needs of the Liberian people.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

            <button className="prog-expand-btn" onClick={() => setIntroOpen(!introOpen)} style={{ marginTop: 24 }}>
              <IoInformationCircleOutline size={16} />
              {introOpen ? 'Show Less' : 'Learn About Our Impact'}
              <motion.span animate={{ rotate: introOpen ? 180 : 0 }} style={{ display: 'inline-flex' }}>
                <IoChevronDownOutline size={14} />
              </motion.span>
            </button>
          </motion.div>
        </section>

        {/* ══════════ GRID ══════════ */}
        <section style={{ padding: 'clamp(56px,8vw,112px) clamp(16px,5vw,48px)', position: 'relative', zIndex: 5 }}>
          <div style={{ maxWidth: 1100, margin: '0 auto' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 'clamp(32px,5vw,56px)' }}>
              <div style={{ width: 36, height: 1, background: '#1d4ed8' }} />
              <span style={{ fontFamily: '"Lora", serif', fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.3em', color: '#1d4ed8' }}>
                Four Core Programs
              </span>
            </div>
            <div className="prog-grid">
              {hospitalPrograms.map((prog, i) => (
                <ProgramCard key={prog.id} prog={prog} index={i} onClick={() => setSelected(prog)} />
              ))}
            </div>
          </div>
        </section>

        {/* ══════════ CTA STRIP ══════════ */}
        <section style={{ padding: '0 clamp(16px,5vw,48px)', paddingBottom: 'clamp(64px,10vw,128px)' }}>
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            style={{
              maxWidth: 1100, margin: '0 auto',
              background: '#0a0f1e', borderRadius: 16,
              padding: 'clamp(40px,6vw,72px) clamp(24px,5vw,72px)',
              display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 32,
              position: 'relative', overflow: 'hidden',
            }}
          >
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: 'linear-gradient(to right, #e11d48, #1d4ed8, #0d9488)' }} />
            <div>
              <p style={{ fontFamily: '"Lora", serif', fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.3em', color: '#e11d48', margin: '0 0 12px' }}>
                Get Involved
              </p>
              <h2 style={{
                fontFamily: '"DM Serif Display", Georgia, serif',
                fontSize: 'clamp(1.5rem,4vw,2.5rem)',
                fontWeight: 400, color: '#fff',
                letterSpacing: '-0.03em', lineHeight: 1.1, margin: 0,
              }}>
                Join our mission<br />
                <span style={{ fontStyle: 'italic', color: '#93c5fd' }}>of healing.</span>
              </h2>
            </div>
            <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
              <button style={{
                padding: 'clamp(12px,2vw,16px) clamp(24px,3vw,36px)',
                background: '#fff', color: '#0f172a',
                border: 'none', borderRadius: 8,
                fontFamily: '"Lora", serif', fontWeight: 700,
                fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.15em',
                cursor: 'pointer', transition: 'all 0.2s',
              }}
                onMouseEnter={e => { e.currentTarget.style.background = '#e11d48'; e.currentTarget.style.color = '#fff'; }}
                onMouseLeave={e => { e.currentTarget.style.background = '#fff'; e.currentTarget.style.color = '#0f172a'; }}
              >
                Partner With Us
              </button>
              <button style={{
                padding: 'clamp(12px,2vw,16px) clamp(24px,3vw,36px)',
                background: 'transparent', color: '#fff',
                border: '1px solid rgba(255,255,255,0.25)', borderRadius: 8,
                fontFamily: '"Lora", serif', fontWeight: 700,
                fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.15em',
                cursor: 'pointer', transition: 'border-color 0.2s',
              }}
                onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.6)'}
                onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.25)'}
              >
                Learn More
              </button>
            </div>
          </motion.div>
        </section>

        {/* ══════════ MODAL ══════════ */}
        <AnimatePresence>
          {selected && <ProgramModal prog={selected} onClose={() => setSelected(null)} />}
        </AnimatePresence>

      </div>
    </>
  );
};

export default Programs;