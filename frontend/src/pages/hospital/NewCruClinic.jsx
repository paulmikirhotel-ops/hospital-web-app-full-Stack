import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  IoFlaskOutline, IoPulseOutline, IoArrowForward, IoLocationOutline,
  IoTimeOutline, IoCallOutline, IoSparklesOutline, IoScanOutline,
  IoWaterOutline, IoCloseOutline, IoCheckmarkCircleOutline
} from 'react-icons/io5';

/* ── CENTERED WRAPPER STYLE ──────────────────────────────────────
   Equal padding on BOTH sides using clamp().
   No max-width + margin:auto tricks — just symmetric padding.
──────────────────────────────────────────────────────────────── */
const center = {
  width: '100%',
  paddingLeft:  'clamp(20px, 6vw, 100px)',
  paddingRight: 'clamp(20px, 6vw, 100px)',
  boxSizing: 'border-box',
};

const NewCruClinic = () => {
  const [activeService, setActiveService] = useState(null);

  const services = [
    {
      id: 'lab',
      title: 'Diagnostic Laboratory',
      shortDesc: 'Automated digital reporting for rapid results.',
      longDesc: 'Our New Kru Town Laboratory is fully synced with the SJCH central database. We provide high-precision hematology, chemistry, and microscopy services with results delivered directly to your mobile portal.',
      icon: <IoFlaskOutline size={28} />,
      tag: 'Live Sync',
      stats: ['99.8% Accuracy', 'Digital Results', 'Real-time Monitoring'],
    },
    {
      id: 'maternal',
      title: 'Maternal Health',
      shortDesc: 'Comprehensive care for mothers and infants.',
      longDesc: 'Dedicated to the New Kru Town community, our maternal wing offers digital fetal monitoring, personalized prenatal nutrition plans, and 24/7 postnatal support, bridging the gap to the main hospital facilities.',
      icon: <IoPulseOutline size={28} />,
      tag: 'Priority',
      stats: ['Prenatal Care', 'Newborn Screening', 'Lactation Support'],
    },
    {
      id: 'pharmacy',
      title: 'Smart Pharmacy',
      shortDesc: 'AI-tracked inventory and digital prescriptions.',
      longDesc: 'Never run out of essential medication. Our pharmacy uses smart inventory tracking to ensure life-saving drugs are always in stock. Patients receive automated SMS alerts when their prescriptions are ready for pickup.',
      icon: <IoScanOutline size={28} />,
      tag: 'Verified',
      stats: ['SMS Alerts', 'Safety Checks', 'Stock Tracking'],
    },
    {
      id: 'outpatient',
      title: 'Outpatient Services',
      shortDesc: 'Specialized primary care and consultations.',
      longDesc: 'General health assessments and specialized management for chronic conditions. Our outpatient services are designed for efficiency, minimizing wait times through a digital queueing system.',
      icon: <IoWaterOutline size={28} />,
      tag: 'Efficiency',
      stats: ['Quick Queue', 'Expert Staff', 'Follow-up Sync'],
    },
  ];

  return (
    <>
      <style>{`
        .nkc-page {
          min-height: 100vh;
          background: #fcfdfe;
          color: #0f172a;
          font-family: sans-serif;
          width: 100%;
          box-sizing: border-box;
          overflow-x: hidden;
        }

        /* ── THE ONE RULE THAT FIXES EVERYTHING ──
           Every direct section uses this class.
           clamp gives EQUAL left + right padding at every width.
        */
        .nkc-section {
          width: 100%;
          padding-left:  clamp(20px, 6vw, 100px);
          padding-right: clamp(20px, 6vw, 100px);
          box-sizing: border-box;
        }

        /* Hero grid */
        .hero-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 64px;
          align-items: center;
          width: 100%;
        }
        @media (max-width: 900px) {
          .hero-grid {
            grid-template-columns: 1fr;
            gap: 40px;
            text-align: center;
          }
          .hero-grid .hero-cta { justify-content: center; }
        }

        /* Services grid */
        .svc-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
          gap: 28px;
          width: 100%;
        }

        /* Service card */
        .svc-card {
          background: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 40px;
          padding: 40px 32px;
          cursor: pointer;
          transition: box-shadow 0.3s, transform 0.3s;
          box-shadow: 0 2px 12px rgba(0,0,0,0.06);
        }
        .svc-card:hover {
          box-shadow: 0 20px 60px rgba(15,61,158,0.14);
          transform: translateY(-8px);
        }

        /* Icon box */
        .svc-icon {
          width: 56px; height: 56px;
          border-radius: 18px;
          background: #1d4ed8;
          display: flex; align-items: center; justify-content: center;
          color: #fff;
          margin-bottom: 28px;
        }

        /* Read more link */
        .read-more {
          display: inline-flex; align-items: center; gap: 6px;
          font-size: 10px; font-weight: 900;
          text-transform: uppercase; letter-spacing: 0.18em;
          color: #2563eb;
          background: none; border: none; cursor: pointer;
          padding: 0;
          transition: gap 0.2s;
        }
        .read-more:hover { gap: 12px; }

        /* Modal overlay */
        .modal-overlay {
          position: fixed; inset: 0; z-index: 100;
          background: rgba(15,23,42,0.45);
          backdrop-filter: blur(16px);
          display: flex; align-items: center; justify-content: center;
          padding: clamp(16px, 4vw, 48px);
        }

        /* Modal box */
        .modal-box {
          background: #fff;
          width: 100%; max-width: 880px;
          border-radius: 48px;
          overflow: hidden;
          display: flex;
          flex-direction: row;
          position: relative;
          box-shadow: 0 40px 100px rgba(0,0,0,0.25);
        }
        @media (max-width: 700px) {
          .modal-box { flex-direction: column; border-radius: 32px; }
          .modal-sidebar { width: 100% !important; }
        }

        .modal-sidebar {
          width: 280px;
          flex-shrink: 0;
          background: #0f172a;
          padding: 48px 36px;
          display: flex; flex-direction: column; justify-content: space-between;
          color: #fff;
        }

        .modal-body {
          flex: 1;
          padding: 48px 44px;
          overflow-y: auto;
        }

        .stat-chip {
          display: flex; align-items: center; gap: 10px;
          padding: 14px 16px;
          background: #f8faff;
          border: 1px solid #e2eaf8;
          border-radius: 16px;
        }

        .btn-primary {
          padding: 14px 28px;
          background: #1d4ed8;
          color: #fff;
          border: none; border-radius: 14px;
          font-size: 10px; font-weight: 900;
          text-transform: uppercase; letter-spacing: 0.18em;
          cursor: pointer;
          transition: background 0.2s, transform 0.15s;
        }
        .btn-primary:hover { background: #1e40af; transform: scale(1.02); }

        .btn-ghost {
          padding: 14px 24px;
          background: #f1f5f9;
          color: #475569;
          border: none; border-radius: 14px;
          font-size: 10px; font-weight: 900;
          text-transform: uppercase; letter-spacing: 0.18em;
          cursor: pointer;
          transition: background 0.2s;
        }
        .btn-ghost:hover { background: #e2e8f0; }
      `}</style>

      <div className="nkc-page">

        {/* ── HERO ── */}
        <section className="nkc-section" style={{ paddingTop: 120, paddingBottom: 80 }}>
          <div className="hero-grid">

            {/* Left */}
            <motion.div
              initial={{ opacity: 0, x: -24 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '6px 14px', background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: 999, marginBottom: 24 }}>
                <IoSparklesOutline style={{ color: '#2563eb', fontSize: 14 }} />
                <span style={{ fontSize: 10, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.22em', color: '#1d4ed8' }}>2026 AI Patient Care</span>
              </div>

              <h1 style={{ fontSize: 'clamp(2.8rem, 6vw, 5rem)', fontWeight: 900, letterSpacing: '-0.04em', lineHeight: 0.95, marginBottom: 24, color: '#0f172a' }}>
                Clinic <br />
                <span style={{ color: '#2563eb', fontStyle: 'italic' }}>Redefined.</span>
              </h1>

              <p style={{ fontSize: 17, color: '#64748b', lineHeight: 1.75, marginBottom: 36, maxWidth: 460, fontWeight: 400 }}>
                Bringing the legacy of St. Joseph's Catholic Hospital to New Kru Town with next-generation digital healthcare.
              </p>

              <div className="hero-cta" style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                <button className="btn-primary" style={{ padding: '16px 32px', fontSize: 11 }}>
                  Access Patient Portal
                </button>
                <button className="btn-ghost" style={{ padding: '16px 24px', fontSize: 11, display: 'flex', alignItems: 'center', gap: 8 }}>
                  <IoCallOutline /> Call Clinic
                </button>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 28, fontSize: 13, color: '#94a3b8' }}>
                <IoLocationOutline style={{ color: '#3b82f6' }} />
                New Kru Town, Monrovia
                <span style={{ opacity: 0.4 }}>·</span>
                <IoTimeOutline style={{ color: '#3b82f6' }} />
                Mon–Sat 7am–9pm
              </div>
            </motion.div>

            {/* Right — image */}
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              style={{ position: 'relative' }}
            >
              <div style={{ borderRadius: 56, overflow: 'hidden', border: '10px solid #fff', boxShadow: '0 24px 80px rgba(15,61,158,0.18)' }}>
                <img
                  src="https://images.ctfassets.net/jwk3944w4k64/39TmfjvYttHFQobNrERsvZ/c632d90e75b70aac329797be977ea219/New_Kru_Clinic.jpg"
                  alt="New Kru Town Clinic"
                  style={{ width: '100%', height: 420, objectFit: 'cover', display: 'block', transition: 'transform 0.7s', filter: 'grayscale(8%)' }}
                  onMouseEnter={e => e.target.style.transform = 'scale(1.04)'}
                  onMouseLeave={e => e.target.style.transform = 'scale(1)'}
                />
              </div>
              {/* Badge */}
              <div style={{ position: 'absolute', bottom: -16, right: -16, background: '#fff', padding: '16px 20px', borderRadius: 20, boxShadow: '0 8px 32px rgba(15,61,158,0.14)', border: '1px solid #e2e8f0' }}>
                <p style={{ fontSize: 9, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.22em', color: '#2563eb', marginBottom: 3 }}>Clinic Hub</p>
                <p style={{ fontSize: 14, fontWeight: 700, color: '#0f172a' }}>New Kru Town, Liberia</p>
              </div>
            </motion.div>
          </div>
        </section>

        {/* ── SERVICES ── */}
        <section className="nkc-section" style={{ paddingTop: 64, paddingBottom: 80 }}>

          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
              <div style={{ width: 28, height: 1, background: '#e2e8f0' }} />
              <span style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.28em', color: '#3b82f6' }}>Clinical Infrastructure</span>
              <div style={{ width: 28, height: 1, background: '#e2e8f0' }} />
            </div>
            <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', fontWeight: 900, letterSpacing: '-0.03em', color: '#0f172a', marginBottom: 12 }}>
              Clinic Specializations
            </h2>
            <p style={{ fontSize: 15, color: '#64748b', maxWidth: 440, margin: '0 auto', lineHeight: 1.7 }}>
              Four fully integrated clinical units, each synced to the SJCH main hospital network.
            </p>
          </div>

          {/* Cards */}
          <div className="svc-grid">
            {services.map((s, idx) => (
              <motion.div
                key={s.id}
                className="svc-card"
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.08 }}
                onClick={() => setActiveService(s)}
              >
                <div className="svc-icon">{s.icon}</div>

                <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '3px 12px', background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: 999, marginBottom: 14 }}>
                  <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#3b82f6', display: 'inline-block' }} />
                  <span style={{ fontSize: 9, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.2em', color: '#1d4ed8' }}>{s.tag}</span>
                </div>

                <h3 style={{ fontSize: '1.25rem', fontWeight: 900, letterSpacing: '-0.02em', color: '#0f172a', marginBottom: 10, lineHeight: 1.2 }}>
                  {s.title}
                </h3>
                <p style={{ fontSize: 13, color: '#64748b', lineHeight: 1.75, marginBottom: 28 }}>
                  {s.shortDesc}
                </p>

                <button className="read-more">
                  Read More <IoArrowForward size={12} />
                </button>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ── MODAL ── */}
        <AnimatePresence>
          {activeService && (
            <motion.div
              className="modal-overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={e => e.target === e.currentTarget && setActiveService(null)}
            >
              <motion.div
                className="modal-box"
                initial={{ scale: 0.93, y: 24 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.93, y: 24 }}
                transition={{ duration: 0.3 }}
              >
                {/* Close */}
                <button
                  onClick={() => setActiveService(null)}
                  style={{ position: 'absolute', top: 20, right: 20, zIndex: 10, width: 40, height: 40, borderRadius: '50%', background: '#f1f5f9', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#475569', transition: 'background 0.2s' }}
                >
                  <IoCloseOutline size={20} />
                </button>

                {/* Sidebar */}
                <div className="modal-sidebar">
                  <div>
                    <div style={{ width: 60, height: 60, borderRadius: 18, background: 'rgba(59,130,246,0.18)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#93c5fd', marginBottom: 24 }}>
                      {activeService.icon}
                    </div>
                    <div style={{ display: 'inline-block', padding: '4px 12px', background: 'rgba(147,197,253,0.12)', border: '1px solid rgba(147,197,253,0.25)', borderRadius: 999, fontSize: 9, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.2em', color: '#93c5fd', marginBottom: 16 }}>
                      {activeService.tag}
                    </div>
                    <h2 style={{ fontSize: '1.8rem', fontWeight: 900, color: '#fff', letterSpacing: '-0.03em', lineHeight: 1.15, marginBottom: 12 }}>
                      {activeService.title}
                    </h2>
                    <p style={{ fontSize: 12, color: 'rgba(147,197,253,0.65)', lineHeight: 1.7 }}>
                      St. Joseph's Catholic Hospital · New Kru Town
                    </p>
                  </div>
                  <div style={{ fontSize: 9, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.2em', color: 'rgba(255,255,255,0.3)' }}>
                    SJCH Medical Unit 2026
                  </div>
                </div>

                {/* Body */}
                <div className="modal-body">
                  <p style={{ fontSize: 18, color: '#1e293b', fontWeight: 600, lineHeight: 1.55, marginBottom: 32 }}>
                    {activeService.longDesc}
                  </p>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 12, marginBottom: 36 }}>
                    {activeService.stats.map((stat, i) => (
                      <div key={i} className="stat-chip">
                        <IoCheckmarkCircleOutline size={18} style={{ color: '#2563eb', flexShrink: 0 }} />
                        <span style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em', color: '#334155' }}>{stat}</span>
                      </div>
                    ))}
                  </div>

                  <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                    <button className="btn-primary">Book Service Now</button>
                    <button className="btn-ghost" onClick={() => setActiveService(null)}>Back to Clinic</button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </>
  );
};

export default NewCruClinic;