import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useTransform, useInView } from 'framer-motion';
import {
  IoMedkitOutline, IoShieldCheckmarkOutline, IoGlobeOutline,
  IoRibbonOutline, IoFitnessOutline, IoReaderOutline, IoOpenOutline,
  IoChevronDownOutline, IoArrowUpOutline
} from 'react-icons/io5';

/* ─── DATA ─────────────────────────────────────────────────── */
const timelineData = [
  {
    year: '1956',
    title: 'The Visionary Request',
    content:
      'During a state visit to Rome, President William V.S. Tubman requested Pope Pius XII for the Catholic Church to establish a hospital and medical teaching school in Liberia for the benefit of the sick and needy.',
    icon: <IoGlobeOutline />,
    accent: '#c9a84c',
  },
  {
    year: '1963',
    title: 'The Citadel Opens',
    content:
      "Opened on August 23rd, 1963. President Tubman dedicated it as a 'Citadel waging war against the enemy of our commonality—Death.' Built on land donated by Mrs. M. Eva McGill Hilton.",
    icon: <IoMedkitOutline />,
    accent: '#4c9bc9',
  },
  {
    year: '1990s',
    title: 'The Civil War Test',
    content:
      'At the peak of the war, the hospital relocated to Gbarnga for safety. It famously served as a place of refuge for victims of the Lutheran Church Massacre under the support of Archbishop Michael K. Francis.',
    icon: <IoShieldCheckmarkOutline />,
    accent: '#c94c4c',
  },
  {
    year: '2014',
    title: 'The Ebola Sacrifice',
    content:
      'Nine staffers lost their lives serving humanity during the outbreak. These brothers and sisters from Liberia, Ghana, Cameroon, Equatorial Guinea, and Spain are remembered as heroes.',
    icon: <IoRibbonOutline />,
    accent: '#c97c4c',
  },
  {
    year: '2019',
    title: 'Defeating COVID-19',
    content:
      'Unlike 2014, a prepared staff stood firm. Through a robust triaging system and partners like CRS, the hospital defeated the virus with no lives lost.',
    icon: <IoFitnessOutline />,
    accent: '#4cc97c',
  },
];

/* ─── TIMELINE ITEM ─────────────────────────────────────────── */
const TimelineItem = ({ item, index }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  const isEven = index % 2 === 0;

  return (
    <div
      ref={ref}
      style={{
        display: 'grid',
        gridTemplateColumns: '1fr 64px 1fr',
        gap: 0,
        marginBottom: 0,
        position: 'relative',
      }}
    >
      {/* Left content */}
      <motion.div
        initial={{ opacity: 0, x: -48 }}
        animate={inView ? { opacity: 1, x: 0 } : {}}
        transition={{ duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
        style={{
          padding: 'clamp(24px,4vw,48px)',
          textAlign: 'right',
          display: isEven ? 'flex' : 'none',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'flex-end',
        }}
      >
        {isEven && <TimelineContent item={item} align="right" />}
      </motion.div>

      {/* Center spine */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative' }}>
        <div style={{ width: 1, flex: 1, background: 'linear-gradient(to bottom, transparent, rgba(201,168,76,0.3), rgba(201,168,76,0.3))' }} />
        <motion.div
          initial={{ scale: 0, rotate: -45 }}
          animate={inView ? { scale: 1, rotate: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.3, type: 'spring', stiffness: 200 }}
          style={{
            width: 48, height: 48, borderRadius: 14,
            background: '#0d1b2e',
            border: `2px solid ${item.accent}`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 20, color: item.accent,
            boxShadow: `0 0 24px ${item.accent}40`,
            flexShrink: 0, zIndex: 2,
          }}
        >
          {item.icon}
        </motion.div>
        <div style={{ width: 1, flex: 1, background: 'linear-gradient(to bottom, rgba(201,168,76,0.3), transparent)' }} />
      </div>

      {/* Right content */}
      <motion.div
        initial={{ opacity: 0, x: 48 }}
        animate={inView ? { opacity: 1, x: 0 } : {}}
        transition={{ duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
        style={{
          padding: 'clamp(24px,4vw,48px)',
          textAlign: 'left',
          display: !isEven ? 'flex' : 'none',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'flex-start',
        }}
      >
        {!isEven && <TimelineContent item={item} align="left" />}
      </motion.div>

      {/* mobile full-width */}
      <style>{`
        @media (max-width: 640px) {
          .tl-left, .tl-right { display: none !important; }
          .tl-mobile { display: flex !important; }
        }
      `}</style>
    </div>
  );
};

const TimelineContent = ({ item, align }) => (
  <div style={{ maxWidth: 380 }}>
    <span style={{
      display: 'inline-block',
      fontFamily: '"DM Serif Display", Georgia, serif',
      fontSize: 'clamp(2rem,4vw,3rem)',
      fontWeight: 400,
      color: item.accent,
      lineHeight: 1,
      marginBottom: 8,
      letterSpacing: '-0.02em',
    }}>
      {item.year}
    </span>
    <h3 style={{
      fontFamily: '"DM Serif Display", Georgia, serif',
      fontSize: 'clamp(1.1rem,2vw,1.5rem)',
      color: '#f0e9d6',
      fontWeight: 400,
      margin: '0 0 12px',
      letterSpacing: '-0.02em',
    }}>
      {item.title}
    </h3>
    <p style={{
      fontFamily: '"Lora", Georgia, serif',
      fontSize: 'clamp(13px,1.3vw,15px)',
      color: '#8a9bb0',
      lineHeight: 1.8,
      margin: 0,
    }}>
      {item.content}
    </p>
  </div>
);

/* ─── STAT CARD ─────────────────────────────────────────────── */
const StatCard = ({ number, label, delay }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      style={{
        padding: 'clamp(24px,3vw,40px)',
        borderTop: '1px solid rgba(201,168,76,0.4)',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
      }}
    >
      <div style={{
        fontFamily: '"DM Serif Display", Georgia, serif',
        fontSize: 'clamp(2.5rem,6vw,5rem)',
        color: '#c9a84c',
        lineHeight: 1,
        marginBottom: 8,
        letterSpacing: '-0.03em',
      }}>
        {number}
      </div>
      <div style={{
        fontFamily: '"Lora", Georgia, serif',
        fontSize: 'clamp(11px,1.2vw,13px)',
        color: '#8a9bb0',
        textTransform: 'uppercase',
        letterSpacing: '0.2em',
      }}>
        {label}
      </div>
    </motion.div>
  );
};

/* ─── MAIN COMPONENT ────────────────────────────────────────── */
const History = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  const heroY = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  useEffect(() => {
    const onScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <>
      {/* Google Fonts */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=Lora:ital,wght@0,400;0,500;0,600;1,400&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        .hist-root {
          background: #060f1a;
          min-height: 100vh;
          font-family: "Lora", Georgia, serif;
          color: #f0e9d6;
          overflow-x: hidden;
        }

        /* Grain overlay */
        .hist-root::before {
          content: '';
          position: fixed; inset: 0; z-index: 0;
          pointer-events: none;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E");
          background-size: 200px 200px;
          opacity: 0.35;
          mix-blend-mode: overlay;
        }

        /* Scroll indicator */
        .scroll-line {
          position: fixed; top: 0; left: 0; height: 2px; z-index: 100;
          background: linear-gradient(to right, #c9a84c, #e8c96b);
          transform-origin: left;
        }

        /* Back to top */
        .back-top {
          position: fixed; bottom: 32px; right: 32px; z-index: 50;
          width: 48px; height: 48px; border-radius: 50%;
          background: #c9a84c; color: #060f1a;
          border: none; cursor: pointer;
          display: flex; align-items: center; justify-content: center;
          font-size: 20px;
          box-shadow: 0 8px 32px rgba(201,168,76,0.4);
          transition: transform 0.2s, opacity 0.3s;
        }
        .back-top:hover { transform: translateY(-4px) scale(1.08); }

        /* Mobile timeline */
        @media (max-width: 640px) {
          .tl-desktop { display: none !important; }
          .tl-mobile-list { display: flex !important; }
        }
        @media (min-width: 641px) {
          .tl-mobile-list { display: none !important; }
        }

        /* Expand button */
        .expand-btn {
          display: inline-flex; align-items: center; gap: 10px;
          padding: 14px 28px;
          background: transparent;
          border: 1px solid rgba(201,168,76,0.5);
          color: #c9a84c;
          border-radius: 4px;
          font-family: "Lora", serif;
          font-size: 12px;
          text-transform: uppercase;
          letter-spacing: 0.2em;
          cursor: pointer;
          transition: background 0.25s, color 0.25s, border-color 0.25s;
        }
        .expand-btn:hover {
          background: #c9a84c;
          color: #060f1a;
          border-color: #c9a84c;
        }

        /* Source link */
        .source-link {
          display: inline-flex; align-items: center; gap: 6px;
          padding: 8px 16px;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.1);
          color: #8a9bb0;
          border-radius: 4px;
          font-size: 10px;
          text-transform: uppercase;
          letter-spacing: 0.2em;
          text-decoration: none;
          transition: border-color 0.2s, color 0.2s;
          white-space: nowrap;
        }
        .source-link:hover { border-color: rgba(201,168,76,0.6); color: #c9a84c; }

        /* Divider line */
        .gold-rule { height: 1px; background: linear-gradient(to right, transparent, rgba(201,168,76,0.5), transparent); margin: 0; border: none; }
      `}</style>

      <div className="hist-root">
        {/* Scroll progress bar */}
        <motion.div
          className="scroll-line"
          style={{ scaleX: scrollYProgress }}
        />

        {/* Back to top */}
        <AnimatePresence>
          {scrollY > 400 && (
            <motion.button
              className="back-top"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            >
              <IoArrowUpOutline />
            </motion.button>
          )}
        </AnimatePresence>

        {/* ══════════════════ HERO ══════════════════ */}
        <section
          ref={heroRef}
          style={{ position: 'relative', height: 'clamp(520px,100vh,100vh)', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >
          {/* Parallax image */}
          <motion.div style={{ position: 'absolute', inset: '-10%', y: heroY }}>
            <img
              src="https://images.ctfassets.net/jwk3944w4k64/3GLL9aLkmNoL49nOF2H1M4/d5f5abb6ec19845a5e125719d85fdfd7/About_Us.jpg"
              alt="St. Joseph's Catholic Hospital"
              style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'brightness(0.35) saturate(0.6)' }}
            />
          </motion.div>

          {/* Gradient vignette */}
          <div style={{
            position: 'absolute', inset: 0, zIndex: 1,
            background: 'radial-gradient(ellipse at center, transparent 20%, rgba(6,15,26,0.7) 80%), linear-gradient(to bottom, rgba(6,15,26,0.2) 0%, rgba(6,15,26,0.0) 50%, rgba(6,15,26,1) 100%)',
          }} />

          {/* Hero copy */}
          <motion.div
            style={{ position: 'relative', zIndex: 2, textAlign: 'center', padding: '0 clamp(20px,6vw,48px)', opacity: heroOpacity }}
          >
            {/* Eyebrow */}
            <motion.p
              initial={{ opacity: 0, letterSpacing: '0.8em' }}
              animate={{ opacity: 1, letterSpacing: '0.4em' }}
              transition={{ duration: 1.2, ease: 'easeOut' }}
              style={{
                fontFamily: '"Lora", serif',
                fontSize: 'clamp(9px,1.2vw,11px)',
                color: '#c9a84c',
                textTransform: 'uppercase',
                letterSpacing: '0.4em',
                marginBottom: 'clamp(16px,3vw,28px)',
              }}
            >
              Monrovia, Liberia &nbsp;·&nbsp; Est. 1963
            </motion.p>

            {/* Main title */}
            <motion.h1
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
              style={{
                fontFamily: '"DM Serif Display", Georgia, serif',
                fontSize: 'clamp(3.5rem,12vw,11rem)',
                fontWeight: 400,
                color: '#f0e9d6',
                lineHeight: 0.88,
                letterSpacing: '-0.04em',
                marginBottom: 'clamp(12px,2vw,20px)',
              }}
            >
              A History<br />
              <span style={{ color: '#c9a84c', fontStyle: 'italic' }}>of Grace</span>
            </motion.h1>

            {/* Sub-title */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              style={{
                fontFamily: '"Lora", serif',
                fontSize: 'clamp(13px,1.8vw,18px)',
                color: 'rgba(240,233,214,0.6)',
                maxWidth: 520,
                margin: '0 auto clamp(32px,5vw,56px)',
                lineHeight: 1.7,
                fontStyle: 'italic',
              }}
            >
              Six decades of compassionate care, sacrifice, and resilience in the heart of West Africa.
            </motion.p>

            {/* Scroll cue */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2 }}
              style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}
            >
              <span style={{ fontFamily: '"Lora", serif', fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.3em', color: 'rgba(201,168,76,0.7)' }}>Scroll</span>
              <motion.div
                animate={{ y: [0, 8, 0] }}
                transition={{ duration: 1.6, repeat: Infinity }}
                style={{ color: '#c9a84c', fontSize: 20 }}
              >
                <IoChevronDownOutline />
              </motion.div>
            </motion.div>
          </motion.div>
        </section>

        {/* ══════════════════ STATS BAR ══════════════════ */}
        <section style={{ position: 'relative', zIndex: 10, background: '#0a1525', borderTop: '1px solid rgba(201,168,76,0.2)', borderBottom: '1px solid rgba(201,168,76,0.2)' }}>
          <div style={{ maxWidth: 1100, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))' }}>
            <StatCard number="60+" label="Years of Service" delay={0} />
            <StatCard number="1963" label="Year Founded" delay={0.1} />
            <StatCard number="9" label="Heroes of 2014" delay={0.2} />
            <StatCard number="0" label="Covid Lives Lost" delay={0.3} />
          </div>
        </section>

        {/* ══════════════════ STORY CARD ══════════════════ */}
        <section style={{ padding: 'clamp(64px,10vw,128px) clamp(16px,5vw,40px)', position: 'relative', zIndex: 5 }}>
          <div style={{ maxWidth: 900, margin: '0 auto' }}>

            {/* Section label */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 40 }}
            >
              <div style={{ width: 40, height: 1, background: '#c9a84c' }} />
              <span style={{ fontFamily: '"Lora", serif', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.3em', color: '#c9a84c' }}>
                Brief History
              </span>
            </motion.div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 24, flexWrap: 'wrap', marginBottom: 40 }}>
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                style={{
                  fontFamily: '"DM Serif Display", Georgia, serif',
                  fontSize: 'clamp(2rem,5vw,3.5rem)',
                  fontWeight: 400,
                  color: '#f0e9d6',
                  lineHeight: 1.1,
                  letterSpacing: '-0.03em',
                  maxWidth: 560,
                }}
              >
                Waging War Against<br />
                <span style={{ color: '#c9a84c', fontStyle: 'italic' }}>the Enemy of Life</span>
              </motion.h2>

              <motion.a
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                className="source-link"
                href="https://www.sjchmonrovialiberia.com/about"
                target="_blank"
                rel="noopener noreferrer"
              >
                Verified Source <IoOpenOutline size={12} />
              </motion.a>
            </div>

            <hr className="gold-rule" style={{ marginBottom: 40 }} />

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              style={{
                fontFamily: '"Lora", serif',
                fontSize: 'clamp(15px,2vw,20px)',
                color: '#b0bec8',
                lineHeight: 1.85,
                marginBottom: 32,
                fontStyle: 'italic',
              }}
            >
              The St. Joseph's Catholic Hospital has provided high-quality and compassionate healthcare
              services to the people of Liberia for 60 years, having opened its doors to the public on the
              23rd of August, 1963…
            </motion.p>

            {/* Expandable body */}
            <AnimatePresence>
              {isExpanded && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                  style={{ overflow: 'hidden' }}
                >
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 24, paddingTop: 8 }}>
                    <p style={{ fontFamily: '"Lora", serif', fontSize: 'clamp(13px,1.5vw,16px)', color: '#8a9bb0', lineHeight: 1.85 }}>
                      In 1956, during a state visit to Rome, the late President William V.S. Tubman made a request that the Holy Father Pope Pius XII grant permission for the Catholic Church to establish a hospital and medical teaching school in the country.
                    </p>

                    {/* Pull quote */}
                    <blockquote style={{
                      margin: '8px 0',
                      paddingLeft: 28,
                      borderLeft: '3px solid #c9a84c',
                    }}>
                      <p style={{
                        fontFamily: '"DM Serif Display", serif',
                        fontSize: 'clamp(1.1rem,2.5vw,1.6rem)',
                        fontStyle: 'italic',
                        color: '#c9a84c',
                        lineHeight: 1.5,
                        margin: 0,
                      }}>
                        "This hospital should be a citadel waging war against the enemy of our commonality — Death."
                      </p>
                      <cite style={{ display: 'block', marginTop: 12, fontFamily: '"Lora", serif', fontSize: 12, color: '#8a9bb0', letterSpacing: '0.1em', textTransform: 'uppercase', fontStyle: 'normal' }}>
                        — President William V.S. Tubman
                      </cite>
                    </blockquote>

                    <p style={{ fontFamily: '"Lora", serif', fontSize: 'clamp(13px,1.5vw,16px)', color: '#8a9bb0', lineHeight: 1.85 }}>
                      The Liberian Civil War was a test to those words. At the peak of the war, the hospital relocated all patients and some staffers to Phebe Hospital in Gbarnga, Bong County, for safety. In the midst of the fierce battle, Archbishop Michael K. Francis supported the hospital to care for all victims of the Lutheran Church Massacre.
                    </p>

                    {/* Crisis cards */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 20, margin: '8px 0' }}>
                      <div style={{
                        padding: 'clamp(20px,3vw,32px)',
                        background: 'rgba(201, 76, 76, 0.06)',
                        borderRadius: 8,
                        border: '1px solid rgba(201,76,76,0.2)',
                        position: 'relative', overflow: 'hidden',
                      }}>
                        <div style={{ position: 'absolute', top: 0, left: 0, width: 3, height: '100%', background: '#c94c4c' }} />
                        <h4 style={{ fontFamily: '"Lora", serif', color: '#c94c4c', fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.25em', marginBottom: 10 }}>
                          2014 Ebola Outbreak
                        </h4>
                        <p style={{ fontFamily: '"Lora", serif', fontSize: 'clamp(12px,1.4vw,14px)', color: '#8a9bb0', lineHeight: 1.75 }}>
                          Nine able staffers gave their lives. Seven others were contaminated but gracefully recovered. Their sacrifice is forever remembered.
                        </p>
                      </div>
                      <div style={{
                        padding: 'clamp(20px,3vw,32px)',
                        background: 'rgba(76,201,124, 0.06)',
                        borderRadius: 8,
                        border: '1px solid rgba(76,201,124,0.2)',
                        position: 'relative', overflow: 'hidden',
                      }}>
                        <div style={{ position: 'absolute', top: 0, left: 0, width: 3, height: '100%', background: '#4cc97c' }} />
                        <h4 style={{ fontFamily: '"Lora", serif', color: '#4cc97c', fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.25em', marginBottom: 10 }}>
                          2019 Covid-19
                        </h4>
                        <p style={{ fontFamily: '"Lora", serif', fontSize: 'clamp(12px,1.4vw,14px)', color: '#8a9bb0', lineHeight: 1.75 }}>
                          A prepared staff stood firm. Through a robust triaging system and CRS partnership, the virus was defeated — no lives lost.
                        </p>
                      </div>
                    </div>

                    <p style={{ fontFamily: '"Lora", serif', fontSize: 'clamp(13px,1.5vw,16px)', color: '#8a9bb0', lineHeight: 1.85 }}>
                      Over the years, the hospital has encountered many challenges that could have crippled her operations — but through the hardworking effort of staffers, donors, the Government, and the Catholic Church of Liberia, it has always remained open in serving humanity.
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div style={{ marginTop: 40, display: 'flex', alignItems: 'center', gap: 16 }}>
              <button className="expand-btn" onClick={() => setIsExpanded(!isExpanded)}>
                <IoReaderOutline size={16} />
                {isExpanded ? 'Show Less' : 'Read Full Background'}
              </button>
            </div>
          </div>
        </section>

        {/* ══════════════════ TIMELINE ══════════════════ */}
        <section style={{ padding: 'clamp(64px,10vw,120px) clamp(16px,5vw,40px)', position: 'relative', zIndex: 5, background: 'rgba(10,21,37,0.6)' }}>
          {/* Background text */}
          <div style={{
            position: 'absolute', top: '50%', left: '50%',
            transform: 'translate(-50%,-50%)',
            fontFamily: '"DM Serif Display", serif',
            fontSize: 'clamp(80px,20vw,240px)',
            fontWeight: 400, color: 'rgba(201,168,76,0.03)',
            whiteSpace: 'nowrap', userSelect: 'none', pointerEvents: 'none',
            letterSpacing: '-0.05em',
          }}>
            LEGACY
          </div>

          <div style={{ maxWidth: 1100, margin: '0 auto', position: 'relative', zIndex: 2 }}>
            {/* Label */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              style={{ textAlign: 'center', marginBottom: 'clamp(48px,8vw,96px)' }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 16, marginBottom: 20 }}>
                <div style={{ flex: 1, maxWidth: 80, height: 1, background: 'linear-gradient(to left, rgba(201,168,76,0.6), transparent)' }} />
                <span style={{ fontFamily: '"Lora", serif', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.3em', color: '#c9a84c' }}>
                  Milestones
                </span>
                <div style={{ flex: 1, maxWidth: 80, height: 1, background: 'linear-gradient(to right, rgba(201,168,76,0.6), transparent)' }} />
              </div>
              <h2 style={{
                fontFamily: '"DM Serif Display", Georgia, serif',
                fontSize: 'clamp(2rem,5vw,3.5rem)',
                fontWeight: 400, color: '#f0e9d6',
                letterSpacing: '-0.03em', lineHeight: 1.1,
              }}>
                Six Decades of Milestones
              </h2>
            </motion.div>

            {/* Desktop timeline */}
            <div className="tl-desktop" style={{ position: 'relative' }}>
              {timelineData.map((item, i) => (
                <TimelineItem key={i} item={item} index={i} />
              ))}
            </div>

            {/* Mobile timeline */}
            <div className="tl-mobile-list" style={{ flexDirection: 'column', gap: 32 }}>
              {timelineData.map((item, i) => {
                const ref = useRef(null);
                const inView = useInView(ref, { once: true });
                return (
                  <motion.div
                    key={i}
                    ref={ref}
                    initial={{ opacity: 0, y: 24 }}
                    animate={inView ? { opacity: 1, y: 0 } : {}}
                    transition={{ delay: i * 0.08, duration: 0.6 }}
                    style={{
                      display: 'flex', gap: 20,
                      paddingLeft: 16,
                      borderLeft: `2px solid ${item.accent}40`,
                    }}
                  >
                    <div>
                      <span style={{ fontFamily: '"DM Serif Display", serif', fontSize: '2rem', color: item.accent, display: 'block', lineHeight: 1 }}>{item.year}</span>
                      <h3 style={{ fontFamily: '"DM Serif Display", serif', fontSize: '1.1rem', color: '#f0e9d6', fontWeight: 400, margin: '6px 0 8px' }}>{item.title}</h3>
                      <p style={{ fontFamily: '"Lora", serif', fontSize: 13, color: '#8a9bb0', lineHeight: 1.8 }}>{item.content}</p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ══════════════════ CTA ══════════════════ */}
        <section style={{ padding: 'clamp(64px,10vw,128px) clamp(16px,5vw,40px) 100px', position: 'relative', zIndex: 5 }}>
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            style={{
              maxWidth: 900, margin: '0 auto',
              background: 'linear-gradient(135deg, #0d1b2e 0%, #0a1525 100%)',
              border: '1px solid rgba(201,168,76,0.3)',
              borderRadius: 8,
              padding: 'clamp(40px,7vw,96px) clamp(24px,6vw,96px)',
              textAlign: 'center',
              position: 'relative', overflow: 'hidden',
            }}
          >
            {/* Corner ornament */}
            <div style={{ position: 'absolute', top: 0, left: 0, width: 60, height: 60, borderTop: '2px solid rgba(201,168,76,0.6)', borderLeft: '2px solid rgba(201,168,76,0.6)', borderTopLeftRadius: 8 }} />
            <div style={{ position: 'absolute', bottom: 0, right: 0, width: 60, height: 60, borderBottom: '2px solid rgba(201,168,76,0.6)', borderRight: '2px solid rgba(201,168,76,0.6)', borderBottomRightRadius: 8 }} />

            <p style={{ fontFamily: '"Lora", serif', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.3em', color: '#c9a84c', marginBottom: 24 }}>
              Since 1963
            </p>
            <h2 style={{
              fontFamily: '"DM Serif Display", Georgia, serif',
              fontSize: 'clamp(2rem,5vw,4rem)',
              fontWeight: 400, color: '#f0e9d6',
              letterSpacing: '-0.03em', lineHeight: 1.1,
              marginBottom: 24,
            }}>
              Continuing the warfare<br />
              <span style={{ color: '#c9a84c', fontStyle: 'italic' }}>against death.</span>
            </h2>
            <p style={{ fontFamily: '"Lora", serif', fontSize: 'clamp(13px,1.5vw,16px)', color: '#8a9bb0', lineHeight: 1.8, maxWidth: 440, margin: '0 auto 40px' }}>
              St. Joseph's Catholic Hospital remains committed to compassionate, high-quality care for every person who walks through its doors.
            </p>
            <button
              className="expand-btn"
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              style={{ background: '#c9a84c', color: '#060f1a', borderColor: '#c9a84c' }}
            >
              <IoArrowUpOutline size={16} /> Back to Top
            </button>
          </motion.div>
        </section>

      </div>
    </>
  );
};

export default History;