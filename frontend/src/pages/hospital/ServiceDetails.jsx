import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import {
  IoArrowBack, IoCalendarOutline, IoShieldCheckmarkOutline,
  IoSparklesOutline, IoPulseOutline,
  IoChatbubbleEllipsesOutline, IoSendOutline, IoCloseOutline,
  IoPersonOutline, IoMedicalOutline, IoTimeOutline,
  IoStarOutline, IoStar, IoHeartOutline, IoCallOutline,
  IoLocationOutline, IoCheckmarkCircleOutline, IoInformationCircleOutline,
  IoAlertCircleOutline, IoArrowForwardOutline, IoExpandOutline,
} from 'react-icons/io5';
import API from '../../api/axiosConfig';

/* ── Markdown renderer ── */
const renderMarkdown = (text) =>
  text.split(/(\*\*[^*]+\*\*)/g).map((part, i) =>
    part.startsWith('**') && part.endsWith('**')
      ? <strong key={i}>{part.slice(2, -2)}</strong>
      : part
  );

/* ══════════════════════════════════════════════
   AI CHAT PANEL (unchanged logic, same design)
══════════════════════════════════════════════ */
const AIChatPanel = ({ service, onClose }) => {
  const [messages, setMessages] = useState([{
    role: 'assistant',
    content: `Hello! I'm the AI assistant for the **${service?.title || 'Medical'}** department at St. Joseph's Catholic Hospital. How can I help you prepare for your visit?`,
  }]);
  const [input, setInput]   = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages, loading]);

  const sendMessage = async (text) => {
    const msg = (text || input).trim();
    if (!msg || loading) return;
    const userMsg = { role: 'user', content: msg };
    const updated = [...messages, userMsg];
    setMessages(updated); setInput(''); setLoading(true);
    try {
      const { data } = await API.post('/ai/chat', {
        system: `You are a warm, helpful medical information assistant for the ${service?.title} department at Saint Joseph's Catholic Hospital in Monrovia, Liberia. Be concise (under 100 words). Never diagnose or prescribe.`,
        messages: updated.map(m => ({ role: m.role, content: m.content })),
      });
      setMessages(prev => [...prev, { role: 'assistant', content: data?.reply || data?.content?.[0]?.text || 'Please try again.' }]);
    } catch {
      setMessages(prev => [...prev, { role: 'assistant', content: 'Trouble connecting. Please call **+231 770 000 000**.' }]);
    } finally { setLoading(false); }
  };

  const quickPrompts = ['What should I bring?', 'How long does it take?', 'Do I need a referral?', 'Is it covered by insurance?'];

  return (
    <motion.div initial={{ opacity: 0, x: 80 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 80 }}
      transition={{ type: 'spring', stiffness: 280, damping: 28 }}
      style={{ position: 'fixed', top: 0, right: 0, bottom: 0, width: '100%', maxWidth: 420, background: '#fff', borderLeft: '1px solid #e2e8f0', boxShadow: '-24px 0 80px rgba(0,0,0,0.14)', zIndex: 1000, display: 'flex', flexDirection: 'column' }}>
      <div style={{ padding: '16px 18px', background: 'linear-gradient(135deg,#0f172a,#1e3a8a)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 40, height: 40, borderRadius: 12, background: 'rgba(255,255,255,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#60a5fa', fontSize: 20 }}><IoMedicalOutline /></div>
          <div>
            <p style={{ fontSize: 12, fontWeight: 900, color: '#fff', margin: 0 }}>AI Medical Assistant</p>
            <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.5)', margin: 0 }}>{service?.title} Dept.</p>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <div style={{ width: 7, height: 7, borderRadius: '50%', background: '#4ade80', boxShadow: '0 0 8px #4ade80' }} />
            <span style={{ fontSize: 9, fontWeight: 800, color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Live</span>
          </div>
          <button onClick={onClose} style={{ background: 'rgba(255,255,255,0.1)', border: 'none', borderRadius: 8, padding: 8, cursor: 'pointer', color: '#fff', fontSize: 18, display: 'flex' }}><IoCloseOutline /></button>
        </div>
      </div>
      <div style={{ padding: '7px 14px', background: '#fefce8', borderBottom: '1px solid #fde68a', flexShrink: 0 }}>
        <p style={{ fontSize: 9, color: '#92400e', margin: 0, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em' }}>⚕ General info only — consult your doctor for personal advice</p>
      </div>
      <div style={{ flex: 1, overflowY: 'auto', padding: 14, display: 'flex', flexDirection: 'column', gap: 10 }}>
        {messages.map((msg, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
            style={{ display: 'flex', flexDirection: msg.role === 'user' ? 'row-reverse' : 'row', alignItems: 'flex-end', gap: 7 }}>
            <div style={{ width: 28, height: 28, borderRadius: '50%', flexShrink: 0, background: msg.role === 'user' ? '#2563eb' : '#0f172a', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 13 }}>
              {msg.role === 'user' ? <IoPersonOutline /> : <IoMedicalOutline />}
            </div>
            <div style={{ maxWidth: '76%', padding: '10px 13px', borderRadius: msg.role === 'user' ? '16px 4px 16px 16px' : '4px 16px 16px 16px', background: msg.role === 'user' ? '#2563eb' : '#f8fafc', border: msg.role === 'user' ? 'none' : '1px solid #e2e8f0', color: msg.role === 'user' ? '#fff' : '#1e293b', fontSize: 13, lineHeight: 1.65, fontWeight: 500 }}>
              {renderMarkdown(msg.content)}
            </div>
          </motion.div>
        ))}
        {loading && (
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 7 }}>
            <div style={{ width: 28, height: 28, borderRadius: '50%', background: '#0f172a', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 13 }}><IoMedicalOutline /></div>
            <div style={{ padding: '12px 16px', borderRadius: '4px 16px 16px 16px', background: '#f8fafc', border: '1px solid #e2e8f0', display: 'flex', gap: 5, alignItems: 'center' }}>
              {[0, 0.18, 0.36].map((d, i) => <motion.div key={i} animate={{ y: [0, -5, 0] }} transition={{ duration: 0.55, repeat: Infinity, delay: d }} style={{ width: 6, height: 6, borderRadius: '50%', background: '#94a3b8' }} />)}
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>
      <div style={{ padding: '7px 12px 3px', display: 'flex', gap: 6, flexWrap: 'wrap', borderTop: '1px solid #f1f5f9', flexShrink: 0 }}>
        {quickPrompts.map(q => (
          <button key={q} onClick={() => sendMessage(q)}
            style={{ fontSize: 10, fontWeight: 700, padding: '5px 10px', borderRadius: 999, background: '#eff6ff', color: '#2563eb', border: '1px solid #bfdbfe', cursor: 'pointer', whiteSpace: 'nowrap' }}
            onMouseEnter={e => { e.currentTarget.style.background = '#2563eb'; e.currentTarget.style.color = '#fff'; }}
            onMouseLeave={e => { e.currentTarget.style.background = '#eff6ff'; e.currentTarget.style.color = '#2563eb'; }}>
            {q}
          </button>
        ))}
      </div>
      <div style={{ padding: '9px 12px 13px', display: 'flex', gap: 8, alignItems: 'flex-end', flexShrink: 0 }}>
        <textarea value={input} onChange={e => setInput(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); } }}
          placeholder="Ask about this department..." rows={1}
          style={{ flex: 1, padding: '10px 14px', borderRadius: 12, border: '2px solid #e2e8f0', outline: 'none', fontSize: 13, fontWeight: 500, color: '#0f172a', resize: 'none', fontFamily: 'inherit', background: '#f8fafc', transition: 'border-color 0.2s' }}
          onFocus={e => e.target.style.borderColor = '#2563eb'}
          onBlur={e => e.target.style.borderColor = '#e2e8f0'} />
        <motion.button whileTap={{ scale: 0.9 }} onClick={() => sendMessage()} disabled={loading || !input.trim()}
          style={{ width: 42, height: 42, borderRadius: 12, border: 'none', background: input.trim() && !loading ? '#2563eb' : '#e2e8f0', color: input.trim() && !loading ? '#fff' : '#94a3b8', cursor: input.trim() && !loading ? 'pointer' : 'default', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 17, flexShrink: 0, transition: 'all 0.2s' }}>
          <IoSendOutline />
        </motion.button>
      </div>
    </motion.div>
  );
};

/* ══════════════════════════════════════════════
   STAR RATING
══════════════════════════════════════════════ */
const StarRating = ({ rating = 4.8, count = 128, light = false }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
    {[1, 2, 3, 4, 5].map(i => (
      <span key={i} style={{ color: i <= Math.floor(rating) ? '#f59e0b' : (light ? 'rgba(255,255,255,0.3)' : '#e2e8f0'), fontSize: 15, display: 'flex' }}>
        {i <= Math.floor(rating) ? <IoStar /> : <IoStarOutline />}
      </span>
    ))}
    <span style={{ fontSize: 13, fontWeight: 800, color: light ? '#fff' : '#0f172a', marginLeft: 4 }}>{rating}</span>
    <span style={{ fontSize: 11, color: light ? 'rgba(255,255,255,0.45)' : '#94a3b8', fontWeight: 600 }}>({count} reviews)</span>
  </div>
);

/* ══════════════════════════════════════════════
   TIMELINE STEP
══════════════════════════════════════════════ */
const TimelineStep = ({ step, title, desc, isLast, accent }) => (
  <div style={{ display: 'flex', gap: 14 }}>
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0 }}>
      <div style={{ width: 36, height: 36, borderRadius: '50%', background: `linear-gradient(135deg,${accent},${accent}cc)`, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 900, flexShrink: 0, boxShadow: `0 4px 14px ${accent}40` }}>{step}</div>
      {!isLast && <div style={{ width: 2, flex: 1, background: `${accent}22`, margin: '6px 0', minHeight: 28 }} />}
    </div>
    <div style={{ paddingBottom: isLast ? 0 : 20 }}>
      <p style={{ fontSize: 12, fontWeight: 900, color: '#0f172a', margin: '6px 0 4px', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{title}</p>
      <p style={{ fontSize: 13, color: '#64748b', margin: 0, lineHeight: 1.65 }}>{desc}</p>
    </div>
  </div>
);

/* ══════════════════════════════════════════════
   MAIN COMPONENT
══════════════════════════════════════════════ */
const ServiceDetails = () => {
  const { id }     = useParams();
  const navigate   = useNavigate();

  const [service, setService]   = useState(null);
  const [loading, setLoading]   = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [showAI, setShowAI]     = useState(false);
  const [saved, setSaved]       = useState(false);
  const [imgExpanded, setImgExpanded] = useState(false);

  const heroRef = useRef(null);
  const { scrollY } = useScroll();
  // Parallax: image moves slower than scroll
  const imgY = useTransform(scrollY, [0, 600], [0, -80]);

  useEffect(() => {
    const fetch_ = async () => {
      if (!id || id === 'undefined' || id.length !== 24) { setLoading(false); return; }
      try {
        setLoading(true);
        const { data } = await API.get(`/services/${id}`);
        if (data.success && data.service) setService(data.service);
        else setService(null);
      } catch { setService(null); }
      finally { setLoading(false); }
    };
    fetch_();
    window.scrollTo(0, 0);
  }, [id]);

  /* ── Loading ── */
  if (loading) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8fafc' }}>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
        <div style={{ width: 52, height: 52, borderRadius: '50%', border: '4px solid #2563eb', borderTopColor: 'transparent', animation: 'spin 0.8s linear infinite' }} />
        <p style={{ fontSize: 10, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.2em', color: '#94a3b8' }}>Loading Clinical Profile...</p>
      </div>
    </div>
  );

  if (!service) return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16, background: '#f8fafc' }}>
      <p style={{ color: '#64748b', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.2em' }}>Service Not Found</p>
      <button onClick={() => navigate('/services')} style={{ padding: '12px 28px', background: '#2563eb', color: '#fff', border: 'none', borderRadius: 14, fontWeight: 900, fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.18em', cursor: 'pointer' }}>Back to Services</button>
    </div>
  );

  const accent = '#2563eb';
  const tabs = ['overview', 'what to expect', 'specialists'];
  const patientSteps = [
    { title: 'Registration',          desc: 'Check in at the front desk with your ID and referral letter if applicable.' },
    { title: 'Consultation',          desc: 'Meet a specialist who will assess your condition and recommend a care plan.' },
    { title: 'Procedure / Treatment', desc: 'Receive diagnostic tests or treatment in a safe, sterile environment.' },
    { title: 'Follow-Up',             desc: 'Schedule follow-up visits and receive your full care summary report.' },
  ];

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc' }}>
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.5} }

        /* ── Full-bleed image hero ── */
        .sd-image-hero {
          position: relative;
          width: 100%;
          height: clamp(340px, 55vw, 680px);
          overflow: hidden;
          background: #0f172a;
        }
        .sd-image-hero img {
          width: 100%; height: 100%;
          object-fit: cover; object-position: center;
          display: block;
        }
        .sd-hero-overlay {
          position: absolute; inset: 0;
          background: linear-gradient(
            to bottom,
            rgba(15,23,42,0.15) 0%,
            rgba(15,23,42,0.4)  50%,
            rgba(15,23,42,0.92) 100%
          );
        }
        .sd-hero-content {
          position: absolute; bottom: 0; left: 0; right: 0;
          padding: clamp(24px,5vw,56px) clamp(16px,5vw,56px);
          z-index: 2;
        }

        /* ── Layout ── */
        .sd-body { max-width: 1280px; margin: 0 auto; padding: clamp(24px,4vw,48px) clamp(12px,4vw,32px) 80px; }
        .sd-main-grid { display: grid; grid-template-columns: minmax(0,1fr) 340px; gap: 24px; align-items: start; }
        .sd-info-grid  { display: grid; grid-template-columns: repeat(auto-fit,minmax(140px,1fr)); gap: 12px; margin-bottom: 24px; }
        .sd-feature-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
        .sd-spec-grid    { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
        .sd-tabs-scroll  { overflow-x: auto; -webkit-overflow-scrolling: touch; }

        /* ── Expand button ── */
        .sd-expand-btn {
          position: absolute; top: 14px; right: 14px; z-index: 3;
          width: 38px; height: 38px; border-radius: 10px;
          background: rgba(255,255,255,0.15); backdrop-filter: blur(10px);
          border: 1px solid rgba(255,255,255,0.2);
          display: flex; align-items: center; justify-content: center;
          color: #fff; cursor: pointer; font-size: 17px;
          transition: background 0.2s;
        }
        .sd-expand-btn:hover { background: rgba(255,255,255,0.28); }

        /* ── Lightbox ── */
        .sd-lightbox {
          position: fixed; inset: 0; z-index: 2000;
          background: rgba(0,0,0,0.92); backdrop-filter: blur(8px);
          display: flex; align-items: center; justify-content: center;
          padding: 20px;
        }
        .sd-lightbox img {
          max-width: 100%; max-height: 90vh;
          border-radius: 16px; box-shadow: 0 40px 100px rgba(0,0,0,0.6);
          object-fit: contain;
        }

        /* ── Stat pills ── */
        .sd-stat-row { display: flex; flex-wrap: wrap; gap: 10px; margin-bottom: 20px; }
        .sd-stat-pill {
          display: flex; align-items: center; gap: 8px;
          padding: 8px 16px; border-radius: 999px;
          background: rgba(255,255,255,0.12); backdrop-filter: blur(8px);
          border: 1px solid rgba(255,255,255,0.18);
          font-size: 11px; font-weight: 800; color: #fff;
          text-transform: uppercase; letter-spacing: 0.12em;
        }

        /* ── Info card ── */
        .sd-info-card {
          background: #fff; border-radius: 18px; padding: 15px 17px;
          border: 1px solid #f1f5f9; box-shadow: 0 2px 8px rgba(0,0,0,0.04);
          display: flex; align-items: center; gap: 12;
          transition: all 0.25s ease;
        }
        .sd-info-card:hover { transform: translateY(-3px); box-shadow: 0 12px 32px rgba(0,0,0,0.08); }

        /* ── Feature pill ── */
        .sd-feat-pill {
          display: flex; align-items: center; gap: 7px;
          padding: 6px 12px; border-radius: 999px;
        }

        @media (max-width: 860px) {
          .sd-main-grid { grid-template-columns: 1fr !important; }
          .sd-sidebar   { order: -1; }
        }
        @media (max-width: 560px) {
          .sd-feature-grid { grid-template-columns: 1fr !important; }
          .sd-spec-grid    { grid-template-columns: 1fr !important; }
        }
      `}</style>

      {/* ══════════════════════════════════════════
          FULL-BLEED IMAGE HERO
      ══════════════════════════════════════════ */}
      <div className="sd-image-hero" ref={heroRef}>
        {/* Parallax image */}
        <motion.div style={{ y: imgY, position: 'absolute', inset: '-10% 0', height: '120%' }}>
          <img
            src={service.image}
            alt={service.title}
            style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center' }}
          />
        </motion.div>

        {/* Gradient overlay */}
        <div className="sd-hero-overlay" />

        {/* Expand to lightbox */}
        <button className="sd-expand-btn" onClick={() => setImgExpanded(true)}>
          <IoExpandOutline />
        </button>

        {/* Back button */}
        <motion.button
          initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }}
          onClick={() => navigate(-1)}
          style={{ position: 'absolute', top: 'clamp(16px,3vw,28px)', left: 'clamp(16px,4vw,32px)', zIndex: 3, display: 'flex', alignItems: 'center', gap: 8, padding: '9px 16px', background: 'rgba(255,255,255,0.12)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: 12, color: '#fff', fontSize: 10, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.18em', cursor: 'pointer', transition: 'background 0.2s' }}
          onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.22)'}
          onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.12)'}
        >
          <IoArrowBack size={14} /> Return
        </motion.button>

        {/* Hero content */}
        <div className="sd-hero-content">
          {/* Category + status */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 10, marginBottom: 14 }}>
            <span style={{ padding: '4px 14px', borderRadius: 999, background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.2)', color: '#7dd3fc', fontSize: 9, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.22em' }}>
              {service.category || 'Clinical Unit'}
            </span>
            <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
              <div style={{ width: 7, height: 7, borderRadius: '50%', background: '#4ade80', boxShadow: '0 0 10px #4ade80', animation: 'pulse 2s ease-in-out infinite' }} />
              <span style={{ fontSize: 9, fontWeight: 800, color: '#4ade80', textTransform: 'uppercase', letterSpacing: '0.15em' }}>Active Department</span>
            </div>
          </motion.div>

          {/* Title */}
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
            style={{ fontSize: 'clamp(1.8rem,5vw,4rem)', fontWeight: 900, color: '#fff', margin: '0 0 12px', letterSpacing: '-0.035em', lineHeight: 1.05, textShadow: '0 2px 20px rgba(0,0,0,0.4)' }}>
            {service.title}
          </motion.h1>

          {/* Rating */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} style={{ marginBottom: 18 }}>
            <StarRating rating={4.8} count={128} light />
          </motion.div>

          {/* Stat pills */}
          <motion.div className="sd-stat-row" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
            {[
              { icon: <IoShieldCheckmarkOutline size={13}/>, text: 'ISO Certified' },
              { icon: <IoTimeOutline size={13}/>,           text: 'Open 24/7' },
              { icon: <IoHeartOutline size={13}/>,          text: 'Patient-Centred' },
              { icon: <IoPulseOutline size={13}/>,          text: 'Real-time Care' },
            ].map(p => (
              <div key={p.text} className="sd-stat-pill">
                {p.icon} {p.text}
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* ══════════════════════════════════════════
          BODY
      ══════════════════════════════════════════ */}
      <div className="sd-body">

        {/* Quick info row */}
        <motion.div className="sd-info-grid" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          {[
            { icon: <IoTimeOutline size={18}/>,     label: 'Avg. Wait Time', value: '20–35 minutes',    accent: '#2563eb' },
            { icon: <IoCalendarOutline size={18}/>, label: 'Appointments',   value: 'Walk-in & Booked', accent: '#7c3aed' },
            { icon: <IoLocationOutline size={18}/>, label: 'Location',       value: 'Block C, 2nd Floor', accent: '#0ea5e9' },
            { icon: <IoCallOutline size={18}/>,     label: 'Direct Line',    value: '+231 770 000 000',  accent: '#16a34a' },
          ].map(c => (
            <motion.div key={c.label} className="sd-info-card" whileHover={{ y: -3 }}>
              <div style={{ width: 42, height: 42, borderRadius: 13, flexShrink: 0, background: `${c.accent}14`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: c.accent }}>
                {c.icon}
              </div>
              <div>
                <p style={{ fontSize: 9, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.2em', color: '#94a3b8', margin: 0 }}>{c.label}</p>
                <p style={{ fontSize: 13, fontWeight: 800, color: '#0f172a', margin: 0 }}>{c.value}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Main grid */}
        <div className="sd-main-grid">

          {/* ── LEFT COLUMN ── */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>

            {/* Tabs card */}
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
              style={{ background: '#fff', borderRadius: 20, border: '1px solid #f1f5f9', boxShadow: '0 2px 12px rgba(0,0,0,0.04)', overflow: 'hidden' }}>
              <div className="sd-tabs-scroll" style={{ borderBottom: '1px solid #f1f5f9', padding: '0 clamp(14px,4vw,24px)' }}>
                <div style={{ display: 'flex', minWidth: 'max-content' }}>
                  {tabs.map(tab => (
                    <button key={tab} onClick={() => setActiveTab(tab)}
                      style={{ padding: '17px 0', marginRight: 22, background: 'none', border: 'none', cursor: 'pointer', fontSize: 9, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.15em', color: activeTab === tab ? accent : '#94a3b8', position: 'relative', transition: 'color 0.2s', whiteSpace: 'nowrap' }}>
                      {tab}
                      {activeTab === tab && <motion.div layoutId="sd-tab" style={{ position: 'absolute', bottom: -1, left: 0, right: 0, height: 2.5, background: accent, borderRadius: 999 }} />}
                    </button>
                  ))}
                </div>
              </div>

              <AnimatePresence mode="wait">
                {activeTab === 'overview' && (
                  <motion.div key="ov" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
                    style={{ padding: 'clamp(18px,4vw,28px)' }}>
                    <p style={{ fontSize: 'clamp(14px,1.8vw,16px)', color: '#475569', lineHeight: 1.8, fontStyle: 'italic', marginBottom: 20, borderLeft: '3px solid #2563eb', paddingLeft: 16 }}>
                      "{service.description}"
                    </p>
                    <div className="sd-feature-grid">
                      {[
                        { icon: <IoCheckmarkCircleOutline />, text: 'ISO Certified Standards', color: '#16a34a', bg: '#f0fdf4' },
                        { icon: <IoShieldCheckmarkOutline />, text: 'Sterile Environment',     color: '#2563eb', bg: '#eff6ff' },
                        { icon: <IoAlertCircleOutline />,     text: 'Emergency Ready 24/7',    color: '#dc2626', bg: '#fef2f2' },
                        { icon: <IoInformationCircleOutline />, text: 'Multilingual Staff',    color: '#7c3aed', bg: '#f5f3ff' },
                      ].map(({ icon, text, color, bg }) => (
                        <div key={text} style={{ display: 'flex', alignItems: 'center', gap: 9, padding: '11px 13px', borderRadius: 13, background: bg, border: `1px solid ${color}20` }}>
                          <span style={{ color, fontSize: 18 }}>{icon}</span>
                          <span style={{ fontSize: 9, fontWeight: 900, color, textTransform: 'uppercase', letterSpacing: '0.1em' }}>{text}</span>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
                {activeTab === 'what to expect' && (
                  <motion.div key="wte" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
                    style={{ padding: 'clamp(18px,4vw,28px)' }}>
                    <p style={{ fontSize: 13, fontWeight: 600, color: '#64748b', marginBottom: 20, lineHeight: 1.65 }}>
                      Your step-by-step journey through the {service.title} department:
                    </p>
                    {patientSteps.map((step, i) => (
                      <TimelineStep key={i} step={i + 1} title={step.title} desc={step.desc} isLast={i === patientSteps.length - 1} accent={accent} />
                    ))}
                  </motion.div>
                )}
                {activeTab === 'specialists' && (
                  <motion.div key="sp" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
                    style={{ padding: 'clamp(18px,4vw,28px)' }}>
                    <p style={{ fontSize: 13, color: '#475569', lineHeight: 1.75, marginBottom: 18 }}>
                      Our {service.title} department is staffed by board-certified consultants with a minimum of 15 years clinical experience in <strong>{service.category}</strong>.
                    </p>
                    <div className="sd-spec-grid">
                      {[
                        { name: 'Dr. A. Kollie',  role: 'Lead Consultant',   exp: '18 yrs', color: '#2563eb' },
                        { name: 'Dr. M. Togba',   role: 'Senior Specialist', exp: '14 yrs', color: '#7c3aed' },
                        { name: 'Dr. F. Konneh',  role: 'Resident Doctor',   exp: '8 yrs',  color: '#0ea5e9' },
                        { name: 'Nurse T. Pewee', role: 'Head Nurse',        exp: '12 yrs', color: '#16a34a' },
                      ].map(doc => (
                        <motion.div key={doc.name} whileHover={{ y: -3 }}
                          style={{ padding: '14px 16px', borderRadius: 16, background: '#f8fafc', border: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', gap: 12, transition: 'all 0.2s' }}>
                          <div style={{ width: 40, height: 40, borderRadius: '50%', background: `${doc.color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: doc.color, fontSize: 18, flexShrink: 0 }}>
                            <IoPersonOutline />
                          </div>
                          <div>
                            <p style={{ fontSize: 12, fontWeight: 900, color: '#0f172a', margin: 0 }}>{doc.name}</p>
                            <p style={{ fontSize: 10, color: '#64748b', margin: 0 }}>{doc.role} · {doc.exp}</p>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            {/* What to bring */}
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
              style={{ background: '#fff', borderRadius: 20, padding: 'clamp(18px,4vw,28px)', border: '1px solid #f1f5f9', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
              <h3 style={{ fontSize: 11, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.2em', color: '#0f172a', margin: '0 0 16px', display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ width: 28, height: 3, borderRadius: 999, background: accent, display: 'inline-block' }} />
                What to Bring
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {['National ID or Passport', 'Referral letter (if applicable)', 'Previous test results or X-rays', 'List of current medications', 'Insurance card or payment method'].map((item, i) => (
                  <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.06 }}
                    style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ width: 22, height: 22, borderRadius: '50%', background: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center', color: accent, fontSize: 13, flexShrink: 0 }}>
                      <IoCheckmarkCircleOutline />
                    </div>
                    <span style={{ fontSize: 13, fontWeight: 600, color: '#475569' }}>{item}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Description expanded */}
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
              style={{ background: 'linear-gradient(135deg,#0f172a,#1e3a8a)', borderRadius: 20, padding: 'clamp(24px,4vw,36px)', position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', top: -40, right: -40, width: 180, height: 180, borderRadius: '50%', background: 'rgba(59,130,246,0.1)', pointerEvents: 'none' }} />
              <p style={{ fontSize: 10, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.25em', color: '#7dd3fc', margin: '0 0 8px' }}>About this service</p>
              <p style={{ fontSize: 'clamp(14px,1.8vw,16px)', color: 'rgba(255,255,255,0.75)', lineHeight: 1.8, margin: '0 0 20px', fontStyle: 'italic', position: 'relative', zIndex: 1 }}>
                "{service.description}"
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {['Expert Staff', 'Modern Equipment', 'Evidence-Based Care', 'Safe Environment'].map(tag => (
                  <span key={tag} style={{ padding: '5px 14px', borderRadius: 999, background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.15)', fontSize: 9, fontWeight: 800, color: 'rgba(255,255,255,0.7)', textTransform: 'uppercase', letterSpacing: '0.12em' }}>
                    {tag}
                  </span>
                ))}
              </div>
            </motion.div>
          </div>

          {/* ── RIGHT SIDEBAR ── */}
          <div className="sd-sidebar" style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>

            {/* ── Book appointment — FIXED link to /appointment ── */}
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
              style={{ background: 'linear-gradient(135deg,#0f172a,#1e3a8a)', borderRadius: 22, padding: 'clamp(20px,4vw,28px)', position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', top: -30, right: -30, width: 140, height: 140, borderRadius: '50%', background: 'rgba(37,99,235,0.2)', pointerEvents: 'none' }} />
              <p style={{ fontSize: 10, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.2em', color: '#7dd3fc', margin: '0 0 5px', position: 'relative', zIndex: 1 }}>Ready to visit?</p>
              <p style={{ fontSize: 'clamp(16px,2.5vw,20px)', fontWeight: 900, color: '#fff', margin: '0 0 18px', lineHeight: 1.25, position: 'relative', zIndex: 1 }}>Book Your<br/>Appointment</p>

              {/* FIXED: links to /appointment with service context */}
              <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                onClick={() => navigate('/appointment', { state: { service: { id: service._id, title: service.title, category: service.category } } })}
                style={{ width: '100%', padding: 14, borderRadius: 14, border: 'none', background: '#2563eb', color: '#fff', fontSize: 10, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.18em', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, boxShadow: '0 8px 28px rgba(37,99,235,0.4)', transition: 'all 0.2s', position: 'relative', zIndex: 1, marginBottom: 10 }}>
                <IoCalendarOutline size={15} /> Schedule Now
              </motion.button>

              <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                onClick={() => navigate('/doctors')}
                style={{ width: '100%', padding: 12, borderRadius: 14, border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(255,255,255,0.08)', color: '#fff', fontSize: 10, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.15em', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, transition: 'all 0.2s', position: 'relative', zIndex: 1 }}>
                <IoPersonOutline size={14} /> Find a Doctor
              </motion.button>

              <p style={{ fontSize: 9, color: 'rgba(255,255,255,0.3)', textAlign: 'center', margin: '10px 0 0', textTransform: 'uppercase', letterSpacing: '0.12em', position: 'relative', zIndex: 1 }}>Walk-ins also welcome</p>
            </motion.div>

            {/* Service image card (second display — smaller) */}
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.18 }}
              style={{ background: '#fff', borderRadius: 20, overflow: 'hidden', border: '1px solid #f1f5f9', boxShadow: '0 4px 16px rgba(0,0,0,0.06)', cursor: 'pointer' }}
              onClick={() => setImgExpanded(true)}
              whileHover={{ scale: 1.01 }}>
              <div style={{ position: 'relative', height: 'clamp(160px,20vw,220px)', overflow: 'hidden', background: '#0f172a' }}>
                <img src={service.image} alt={service.title} style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.85, transition: 'transform 0.5s ease, opacity 0.3s' }}
                  onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.05)'; e.currentTarget.style.opacity = '1'; }}
                  onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.opacity = '0.85'; }} />
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top,rgba(15,23,42,0.5),transparent)' }} />
                <div style={{ position: 'absolute', bottom: 10, right: 10, padding: '4px 10px', borderRadius: 8, background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(6px)', border: '1px solid rgba(255,255,255,0.15)', fontSize: 9, fontWeight: 800, color: '#fff', textTransform: 'uppercase', letterSpacing: '0.12em' }}>
                  Tap to expand
                </div>
              </div>
              <div style={{ padding: '14px 16px' }}>
                <p style={{ fontSize: 11, fontWeight: 900, color: '#0f172a', margin: '0 0 3px' }}>{service.title}</p>
                <p style={{ fontSize: 10, color: '#94a3b8', margin: 0, textTransform: 'uppercase', letterSpacing: '0.15em', fontWeight: 700 }}>{service.category}</p>
              </div>
            </motion.div>

            {/* AI Assistant */}
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
              style={{ background: '#fff', borderRadius: 20, padding: 'clamp(16px,3vw,22px)', border: '1px solid #f1f5f9', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                <div style={{ width: 38, height: 38, borderRadius: 12, background: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center', color: accent, fontSize: 18 }}><IoSparklesOutline /></div>
                <div>
                  <p style={{ fontSize: 12, fontWeight: 900, color: '#0f172a', margin: 0 }}>AI Assistant</p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                    <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#4ade80', boxShadow: '0 0 6px #4ade80' }} />
                    <span style={{ fontSize: 9, color: '#4ade80', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Online</span>
                  </div>
                </div>
              </div>
              <p style={{ fontSize: 12, color: '#64748b', margin: '0 0 14px', lineHeight: 1.65 }}>Have questions before your visit? Our AI can help you prepare.</p>
              <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }} onClick={() => setShowAI(true)}
                style={{ width: '100%', padding: 12, borderRadius: 12, border: `1.5px solid ${accent}33`, background: '#eff6ff', color: accent, fontSize: 10, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.18em', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, transition: 'all 0.2s' }}>
                <IoChatbubbleEllipsesOutline size={14} /> Ask a Question
              </motion.button>
            </motion.div>

            {/* Save / Contact */}
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.23 }}
              style={{ display: 'flex', gap: 10 }}>
              <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.95 }} onClick={() => setSaved(s => !s)}
                style={{ flex: 1, padding: 12, borderRadius: 14, background: saved ? '#fef2f2' : '#fff', border: `1px solid ${saved ? '#fecaca' : '#e2e8f0'}`, color: saved ? '#dc2626' : '#64748b', fontSize: 10, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.12em', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, transition: 'all 0.2s' }}>
                {saved ? <IoStar style={{ color: '#dc2626' }} /> : <IoHeartOutline />} {saved ? 'Saved' : 'Save'}
              </motion.button>
              <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.95 }} onClick={() => navigate('/contact')}
                style={{ flex: 1, padding: 12, borderRadius: 14, background: '#fff', border: '1px solid #e2e8f0', color: '#64748b', fontSize: 10, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.12em', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, transition: 'all 0.2s' }}>
                <IoCallOutline /> Contact
              </motion.button>
            </motion.div>

            {/* Emergency */}
            <div style={{ padding: '14px 16px', borderRadius: 16, background: '#fef2f2', border: '1px solid #fecaca', display: 'flex', gap: 10, alignItems: 'flex-start' }}>
              <IoAlertCircleOutline style={{ color: '#dc2626', fontSize: 20, flexShrink: 0, marginTop: 1 }} />
              <div>
                <p style={{ fontSize: 10, fontWeight: 900, color: '#dc2626', margin: '0 0 4px', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Emergency?</p>
                <p style={{ fontSize: 11, color: '#991b1b', margin: 0, lineHeight: 1.55 }}>Call <strong>+231 770 000 000</strong> or go to Emergency Unit, Ground Floor — open 24/7.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════
          LIGHTBOX — full screen image
      ══════════════════════════════════════════ */}
      <AnimatePresence>
        {imgExpanded && (
          <motion.div className="sd-lightbox" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setImgExpanded(false)}>
            <motion.img
              src={service.image} alt={service.title}
              initial={{ scale: 0.88, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.88, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 280, damping: 28 }}
            />
            <button onClick={() => setImgExpanded(false)}
              style={{ position: 'fixed', top: 20, right: 20, width: 42, height: 42, borderRadius: '50%', background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.25)', color: '#fff', fontSize: 22, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(10px)' }}>
              <IoCloseOutline />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ══════════════════════════════════════════
          AI CHAT OVERLAY
      ══════════════════════════════════════════ */}
      <AnimatePresence>
        {showAI && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowAI(false)}
              style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.3)', zIndex: 999, backdropFilter: 'blur(2px)' }} />
            <AIChatPanel service={service} onClose={() => setShowAI(false)} />
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ServiceDetails;