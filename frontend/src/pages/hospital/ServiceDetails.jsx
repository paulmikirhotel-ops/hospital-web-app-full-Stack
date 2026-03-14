import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  IoArrowBack, IoCalendarOutline, IoShieldCheckmarkOutline,
  IoSparklesOutline, IoPulseOutline,
  IoChatbubbleEllipsesOutline, IoSendOutline, IoCloseOutline,
  IoPersonOutline, IoMedicalOutline, IoTimeOutline,
  IoStarOutline, IoStar, IoHeartOutline, IoCallOutline,
  IoLocationOutline, IoCheckmarkCircleOutline, IoInformationCircleOutline,
  IoAlertCircleOutline,
} from 'react-icons/io5';
import API from '../../api/axiosConfig';

// ─── Helpers ──────────────────────────────────────────────────────────────────
const renderMarkdown = (text) =>
  text.split(/(\*\*[^*]+\*\*)/g).map((part, i) =>
    part.startsWith('**') && part.endsWith('**')
      ? <strong key={i}>{part.slice(2, -2)}</strong>
      : part
  );

// ─── AI Chat Panel ────────────────────────────────────────────────────────────
const AIChatPanel = ({ service, onClose }) => {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: `Hello! I'm the AI assistant for the **${service?.title || 'Medical'}** department at St. Joseph's Catholic Hospital. I can help answer questions about what to expect, how to prepare, and general information about this service. How can I help?`,
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const sendMessage = async (text) => {
    const msg = (text || input).trim();
    if (!msg || loading) return;
    const userMsg = { role: 'user', content: msg };
    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    setInput('');
    setLoading(true);
    try {
      // Calls your backend proxy — create POST /api/ai/chat on your server
      // that forwards to Anthropic with the system prompt
      const { data } = await API.post('/ai/chat', {
        system: `You are a warm, helpful medical information assistant for the ${service?.title || 'Medical'} department at Saint Joseph's Catholic Hospital in Monrovia, Liberia.
Service: ${service?.title} | Category: ${service?.category} | Description: ${service?.description}
Rules: Answer only about this department. Be concise (under 100 words). Never diagnose or prescribe. Always recommend consulting medical staff for personal advice.`,
        messages: updatedMessages.map(m => ({ role: m.role, content: m.content })),
      });
      const reply = data?.reply || data?.content?.[0]?.text || 'Please try again.';
      setMessages(prev => [...prev, { role: 'assistant', content: reply }]);
    } catch {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'I had trouble connecting. Please try again, or call reception at **+231 770 000 000**.',
      }]);
    } finally {
      setLoading(false);
    }
  };

  const quickPrompts = ['What should I bring?', 'How long does it take?', 'Do I need a referral?', 'Is it covered by insurance?'];

  return (
    <motion.div
      initial={{ opacity: 0, x: 80 }} animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 80 }}
      transition={{ type: 'spring', stiffness: 280, damping: 28 }}
      style={{
        position: 'fixed', top: 0, right: 0, bottom: 0,
        width: '100%', maxWidth: 430,
        background: '#fff', borderLeft: '1px solid #e2e8f0',
        boxShadow: '-24px 0 80px rgba(0,0,0,0.14)',
        zIndex: 1000, display: 'flex', flexDirection: 'column', fontFamily: 'inherit',
      }}
    >
      {/* Header */}
      <div style={{ padding: '18px 20px', background: 'linear-gradient(135deg, #0f172a 0%, #1e3a8a 100%)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 42, height: 42, borderRadius: 14, background: 'rgba(255,255,255,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#60a5fa', fontSize: 22 }}>
            <IoMedicalOutline />
          </div>
          <div>
            <p style={{ fontSize: 12, fontWeight: 900, color: '#fff', margin: 0, letterSpacing: '0.06em' }}>AI Medical Assistant</p>
            <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.5)', margin: 0 }}>{service?.title} Dept.</p>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
            <div style={{ width: 7, height: 7, borderRadius: '50%', background: '#4ade80', boxShadow: '0 0 8px #4ade80' }} />
            <span style={{ fontSize: 9, fontWeight: 800, color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Live</span>
          </div>
          <button onClick={onClose} style={{ background: 'rgba(255,255,255,0.1)', border: 'none', borderRadius: 8, padding: 8, cursor: 'pointer', color: '#fff', fontSize: 18, display: 'flex', alignItems: 'center' }}>
            <IoCloseOutline />
          </button>
        </div>
      </div>

      {/* Disclaimer */}
      <div style={{ padding: '8px 16px', background: '#fefce8', borderBottom: '1px solid #fde68a', flexShrink: 0 }}>
        <p style={{ fontSize: 9, color: '#92400e', margin: 0, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
          ⚕ General info only — consult your doctor for personal medical advice
        </p>
      </div>

      {/* Messages */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '16px', display: 'flex', flexDirection: 'column', gap: 12 }}>
        {messages.map((msg, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
            style={{ display: 'flex', flexDirection: msg.role === 'user' ? 'row-reverse' : 'row', alignItems: 'flex-end', gap: 8 }}>
            <div style={{ width: 30, height: 30, borderRadius: '50%', flexShrink: 0, background: msg.role === 'user' ? '#2563eb' : '#0f172a', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 14 }}>
              {msg.role === 'user' ? <IoPersonOutline /> : <IoMedicalOutline />}
            </div>
            <div style={{ maxWidth: '76%', padding: '11px 15px', borderRadius: msg.role === 'user' ? '18px 4px 18px 18px' : '4px 18px 18px 18px', background: msg.role === 'user' ? '#2563eb' : '#f8fafc', border: msg.role === 'user' ? 'none' : '1px solid #e2e8f0', color: msg.role === 'user' ? '#fff' : '#1e293b', fontSize: 13, lineHeight: 1.65, fontWeight: 500 }}>
              {renderMarkdown(msg.content)}
            </div>
          </motion.div>
        ))}
        {loading && (
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8 }}>
            <div style={{ width: 30, height: 30, borderRadius: '50%', background: '#0f172a', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 14 }}><IoMedicalOutline /></div>
            <div style={{ padding: '14px 18px', borderRadius: '4px 18px 18px 18px', background: '#f8fafc', border: '1px solid #e2e8f0', display: 'flex', gap: 5, alignItems: 'center' }}>
              {[0, 0.18, 0.36].map((d, i) => (
                <motion.div key={i} animate={{ y: [0, -5, 0] }} transition={{ duration: 0.55, repeat: Infinity, delay: d }}
                  style={{ width: 6, height: 6, borderRadius: '50%', background: '#94a3b8' }} />
              ))}
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Quick prompts */}
      <div style={{ padding: '8px 14px 4px', display: 'flex', gap: 6, flexWrap: 'wrap', borderTop: '1px solid #f1f5f9', flexShrink: 0 }}>
        {quickPrompts.map(q => (
          <button key={q} onClick={() => sendMessage(q)}
            style={{ fontSize: 10, fontWeight: 700, padding: '5px 11px', borderRadius: 999, background: '#eff6ff', color: '#2563eb', border: '1px solid #bfdbfe', cursor: 'pointer', whiteSpace: 'nowrap', transition: 'all 0.15s' }}
            onMouseEnter={e => { e.currentTarget.style.background = '#2563eb'; e.currentTarget.style.color = '#fff'; }}
            onMouseLeave={e => { e.currentTarget.style.background = '#eff6ff'; e.currentTarget.style.color = '#2563eb'; }}>
            {q}
          </button>
        ))}
      </div>

      {/* Input */}
      <div style={{ padding: '10px 14px 14px', display: 'flex', gap: 9, alignItems: 'flex-end', flexShrink: 0 }}>
        <textarea value={input} onChange={e => setInput(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); } }}
          placeholder="Ask about this department..." rows={1}
          style={{ flex: 1, padding: '11px 15px', borderRadius: 14, border: '2px solid #e2e8f0', outline: 'none', fontSize: 13, fontWeight: 500, color: '#0f172a', resize: 'none', fontFamily: 'inherit', background: '#f8fafc', transition: 'border-color 0.2s' }}
          onFocus={e => e.target.style.borderColor = '#2563eb'}
          onBlur={e => e.target.style.borderColor = '#e2e8f0'} />
        <motion.button whileTap={{ scale: 0.9 }} onClick={() => sendMessage()} disabled={loading || !input.trim()}
          style={{ width: 44, height: 44, borderRadius: 13, border: 'none', background: input.trim() && !loading ? '#2563eb' : '#e2e8f0', color: input.trim() && !loading ? '#fff' : '#94a3b8', cursor: input.trim() && !loading ? 'pointer' : 'default', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, flexShrink: 0, transition: 'all 0.2s' }}>
          <IoSendOutline />
        </motion.button>
      </div>
    </motion.div>
  );
};

// ─── Sub-components ───────────────────────────────────────────────────────────
const FeaturePill = ({ icon, text, color, bg }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 9, padding: '9px 16px', borderRadius: 999, background: bg, border: `1px solid ${color}22` }}>
    <span style={{ color, fontSize: 16 }}>{icon}</span>
    <span style={{ fontSize: 10, fontWeight: 900, color, textTransform: 'uppercase', letterSpacing: '0.14em' }}>{text}</span>
  </div>
);

const InfoCard = ({ icon, label, value, accent }) => (
  <motion.div whileHover={{ y: -3, boxShadow: `0 12px 32px ${accent}18` }}
    style={{ background: '#fff', borderRadius: 20, padding: '18px 20px', border: '1px solid #f1f5f9', boxShadow: '0 2px 8px rgba(0,0,0,0.04)', display: 'flex', alignItems: 'center', gap: 14, transition: 'all 0.25s ease' }}>
    <div style={{ width: 44, height: 44, borderRadius: 14, flexShrink: 0, background: `${accent}14`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: accent, fontSize: 20 }}>{icon}</div>
    <div>
      <p style={{ fontSize: 9, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.2em', color: '#94a3b8', margin: 0 }}>{label}</p>
      <p style={{ fontSize: 13, fontWeight: 800, color: '#0f172a', margin: 0, lineHeight: 1.3 }}>{value}</p>
    </div>
  </motion.div>
);

const StarRating = ({ rating = 4.8, count = 128 }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
    {[1,2,3,4,5].map(i => (
      <span key={i} style={{ color: i <= Math.floor(rating) ? '#f59e0b' : '#e2e8f0', fontSize: 17, display: 'flex' }}>
        {i <= Math.floor(rating) ? <IoStar /> : <IoStarOutline />}
      </span>
    ))}
    <span style={{ fontSize: 12, fontWeight: 800, color: '#fff', marginLeft: 4 }}>{rating}</span>
    <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.45)', fontWeight: 600 }}>({count} reviews)</span>
  </div>
);

const TimelineStep = ({ step, title, desc, isLast, accent }) => (
  <div style={{ display: 'flex', gap: 16 }}>
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0 }}>
      <div style={{ width: 36, height: 36, borderRadius: '50%', background: accent, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 900, flexShrink: 0, boxShadow: `0 4px 12px ${accent}40` }}>{step}</div>
      {!isLast && <div style={{ width: 2, flex: 1, background: `${accent}22`, margin: '6px 0', minHeight: 28 }} />}
    </div>
    <div style={{ paddingBottom: isLast ? 0 : 20 }}>
      <p style={{ fontSize: 12, fontWeight: 900, color: '#0f172a', margin: '6px 0 4px', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{title}</p>
      <p style={{ fontSize: 12, color: '#64748b', margin: 0, lineHeight: 1.6 }}>{desc}</p>
    </div>
  </div>
);

// ─── Main Component ───────────────────────────────────────────────────────────
const ServiceDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [showAI, setShowAI] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const fetchService = async () => {
      if (!id || id === 'undefined' || id.length !== 24) { setLoading(false); return; }
      try {
        setLoading(true);
        const { data } = await API.get(`/services/${id}`);
        if (data.success && data.service) setService(data.service);
        else setService(null);
      } catch { setService(null); }
      finally { setLoading(false); }
    };
    fetchService();
    window.scrollTo(0, 0);
  }, [id]);

  if (loading) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8fafc' }}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
        <div style={{ width: 52, height: 52, borderRadius: '50%', border: '4px solid #2563eb', borderTopColor: 'transparent', animation: 'spin 0.8s linear infinite' }} />
        <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
        <p style={{ fontSize: 10, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.2em', color: '#94a3b8' }}>Loading Clinical Profile...</p>
      </div>
    </div>
  );

  if (!service) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <p style={{ color: '#64748b', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.2em' }}>Service Not Found</p>
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
    <div style={{ minHeight: '100vh', background: '#f8fafc', paddingTop: 112, paddingBottom: 80 }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px' }}>

        {/* Back */}
        <motion.button initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
          onClick={() => navigate(-1)}
          style={{ display: 'flex', alignItems: 'center', gap: 10, background: 'none', border: 'none', cursor: 'pointer', marginBottom: 36, padding: 0 }}>
          <div style={{ width: 38, height: 38, borderRadius: '50%', background: '#fff', boxShadow: '0 2px 8px rgba(0,0,0,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b', fontSize: 16 }}>
            <IoArrowBack />
          </div>
          <span style={{ fontSize: 10, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.2em', color: '#94a3b8' }}>Return to Services</span>
        </motion.button>

        {/* ── Hero banner ── */}
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
          style={{ borderRadius: 32, overflow: 'hidden', background: 'linear-gradient(135deg, #0f172a 0%, #1e3a8a 60%, #0ea5e9 100%)', marginBottom: 28, position: 'relative', padding: '44px 48px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 32, minHeight: 200 }}>
          {/* Decorative blobs */}
          <div style={{ position: 'absolute', top: -50, right: 220, width: 220, height: 220, borderRadius: '50%', background: 'rgba(255,255,255,0.04)', pointerEvents: 'none' }} />
          <div style={{ position: 'absolute', bottom: -70, right: 60, width: 280, height: 280, borderRadius: '50%', background: 'rgba(255,255,255,0.03)', pointerEvents: 'none' }} />

          <div style={{ position: 'relative', zIndex: 1, flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
              <span style={{ padding: '4px 14px', borderRadius: 999, background: 'rgba(255,255,255,0.12)', color: '#7dd3fc', fontSize: 9, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.2em', border: '1px solid rgba(255,255,255,0.12)' }}>
                {service.category || 'Clinical Unit'}
              </span>
              <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#4ade80', boxShadow: '0 0 8px #4ade80' }} />
                <span style={{ fontSize: 9, fontWeight: 800, color: '#4ade80', textTransform: 'uppercase', letterSpacing: '0.12em' }}>Active</span>
              </div>
            </div>
            <h1 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 900, color: '#fff', margin: '0 0 12px', letterSpacing: '-0.03em', lineHeight: 1.1 }}>
              {service.title}
            </h1>
            <StarRating rating={4.8} count={128} />
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginTop: 20 }}>
              <FeaturePill icon={<IoShieldCheckmarkOutline />} text="ISO Certified"    color="#60a5fa" bg="rgba(96,165,250,0.12)" />
              <FeaturePill icon={<IoTimeOutline />}            text="Open 24/7"        color="#4ade80" bg="rgba(74,222,128,0.12)" />
              <FeaturePill icon={<IoHeartOutline />}           text="Patient-Centred"  color="#f472b6" bg="rgba(244,114,182,0.12)" />
              <FeaturePill icon={<IoPulseOutline />}           text="Real-time Care"   color="#fb923c" bg="rgba(251,146,60,0.12)" />
            </div>
          </div>

          <motion.div whileHover={{ scale: 1.06, rotate: 2 }}
            style={{ width: 156, height: 156, flexShrink: 0, background: 'rgba(255,255,255,0.08)', borderRadius: 28, padding: 20, display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(255,255,255,0.12)', position: 'relative', zIndex: 1 }}>
            <img src={service.image} alt={service.title} style={{ width: '100%', height: '100%', objectFit: 'contain', filter: 'brightness(1.1)' }} />
          </motion.div>
        </motion.div>

        {/* ── Quick info cards ── */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))', gap: 14, marginBottom: 28 }}>
          <InfoCard icon={<IoTimeOutline />}     label="Avg. Wait Time"  value="20–35 minutes"     accent="#2563eb" />
          <InfoCard icon={<IoCalendarOutline />} label="Appointments"    value="Walk-in & Booked"  accent="#7c3aed" />
          <InfoCard icon={<IoLocationOutline />} label="Location"        value="Block C, 2nd Floor" accent="#0ea5e9" />
          <InfoCard icon={<IoCallOutline />}     label="Direct Line"     value="+231 770 000 000"  accent="#16a34a" />
        </motion.div>

        {/* ── Main grid ── */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 350px', gap: 24, alignItems: 'start' }}>

          {/* LEFT */}
          <div>
            {/* Tabs card */}
            <div style={{ background: '#fff', borderRadius: 20, padding: '0 24px', border: '1px solid #f1f5f9', boxShadow: '0 2px 8px rgba(0,0,0,0.04)', marginBottom: 20 }}>
              <div style={{ display: 'flex', borderBottom: '1px solid #f1f5f9' }}>
                {tabs.map(tab => (
                  <button key={tab} onClick={() => setActiveTab(tab)}
                    style={{ padding: '18px 0', marginRight: 24, background: 'none', border: 'none', cursor: 'pointer', fontSize: 10, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.15em', color: activeTab === tab ? accent : '#94a3b8', position: 'relative', transition: 'color 0.2s', whiteSpace: 'nowrap' }}>
                    {tab}
                    {activeTab === tab && <motion.div layoutId="sd-tab-line" style={{ position: 'absolute', bottom: -1, left: 0, right: 0, height: 2, background: accent, borderRadius: 999 }} />}
                  </button>
                ))}
              </div>

              <AnimatePresence mode="wait">
                {activeTab === 'overview' && (
                  <motion.div key="ov" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} style={{ padding: '24px 0' }}>
                    <p style={{ fontSize: 15, color: '#475569', lineHeight: 1.75, fontStyle: 'italic', marginBottom: 20 }}>
                      "{service.description}"
                    </p>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                      {[
                        { icon: <IoCheckmarkCircleOutline />,  text: 'ISO Certified Standards', color: '#16a34a', bg: '#f0fdf4' },
                        { icon: <IoShieldCheckmarkOutline />,  text: 'Sterile Environment',     color: '#2563eb', bg: '#eff6ff' },
                        { icon: <IoAlertCircleOutline />,      text: 'Emergency Ready 24/7',   color: '#dc2626', bg: '#fef2f2' },
                        { icon: <IoInformationCircleOutline />, text: 'Multilingual Staff',    color: '#7c3aed', bg: '#f5f3ff' },
                      ].map(({ icon, text, color, bg }) => (
                        <div key={text} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 14px', borderRadius: 14, background: bg, border: `1px solid ${color}22` }}>
                          <span style={{ color, fontSize: 18 }}>{icon}</span>
                          <span style={{ fontSize: 10, fontWeight: 900, color, textTransform: 'uppercase', letterSpacing: '0.1em' }}>{text}</span>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
                {activeTab === 'what to expect' && (
                  <motion.div key="wte" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} style={{ padding: '24px 0' }}>
                    <p style={{ fontSize: 12, fontWeight: 700, color: '#64748b', marginBottom: 20, lineHeight: 1.6 }}>
                      Here's a step-by-step walkthrough of your visit to the {service.title} department:
                    </p>
                    {patientSteps.map((step, i) => (
                      <TimelineStep key={i} step={i + 1} title={step.title} desc={step.desc} isLast={i === patientSteps.length - 1} accent={accent} />
                    ))}
                  </motion.div>
                )}
                {activeTab === 'specialists' && (
                  <motion.div key="sp" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} style={{ padding: '24px 0' }}>
                    <p style={{ fontSize: 13, color: '#475569', lineHeight: 1.75, marginBottom: 20 }}>
                      Our {service.title} department is staffed by board-certified consultants with a minimum of 15 years of clinical experience in <strong>{service.category}</strong>.
                    </p>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                      {[
                        { name: 'Dr. A. Kollie',  role: 'Lead Consultant',   exp: '18 yrs' },
                        { name: 'Dr. M. Togba',   role: 'Senior Specialist', exp: '14 yrs' },
                        { name: 'Dr. F. Konneh',  role: 'Resident Doctor',   exp: '8 yrs'  },
                        { name: 'Nurse T. Pewee', role: 'Head Nurse',        exp: '12 yrs' },
                      ].map(doc => (
                        <div key={doc.name} style={{ padding: '14px 16px', borderRadius: 16, background: '#f8fafc', border: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', gap: 12 }}>
                          <div style={{ width: 40, height: 40, borderRadius: '50%', background: `${accent}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: accent, fontSize: 18, flexShrink: 0 }}>
                            <IoPersonOutline />
                          </div>
                          <div>
                            <p style={{ fontSize: 11, fontWeight: 900, color: '#0f172a', margin: 0 }}>{doc.name}</p>
                            <p style={{ fontSize: 10, color: '#64748b', margin: 0 }}>{doc.role} · {doc.exp}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* What to bring checklist */}
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
              style={{ background: '#fff', borderRadius: 20, padding: 24, border: '1px solid #f1f5f9', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
              <h3 style={{ fontSize: 11, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.2em', color: '#0f172a', margin: '0 0 16px' }}>
                What to Bring
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {['National ID or Passport', 'Referral letter (if applicable)', 'Previous test results or X-rays', 'List of current medications', 'Insurance card or payment method'].map((item, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ width: 22, height: 22, borderRadius: '50%', background: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center', color: accent, fontSize: 13, flexShrink: 0 }}>
                      <IoCheckmarkCircleOutline />
                    </div>
                    <span style={{ fontSize: 12, fontWeight: 600, color: '#475569' }}>{item}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* RIGHT SIDEBAR */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

            {/* Book appointment */}
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
              style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e3a8a 100%)', borderRadius: 24, padding: 24 }}>
              <p style={{ fontSize: 10, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.2em', color: '#7dd3fc', margin: '0 0 6px' }}>Ready to visit?</p>
              <p style={{ fontSize: 18, fontWeight: 900, color: '#fff', margin: '0 0 18px', lineHeight: 1.3 }}>Book Your Appointment</p>
              <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                onClick={() => navigate('/appointments', { state: { service: { id: service._id, title: service.title, category: service.category } } })}
                style={{ width: '100%', padding: 14, borderRadius: 14, border: 'none', background: '#2563eb', color: '#fff', fontSize: 10, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.18em', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, boxShadow: '0 8px 24px rgba(37,99,235,0.35)', transition: 'all 0.2s' }}>
                <IoCalendarOutline size={15} /> Schedule Now
              </motion.button>
              <p style={{ fontSize: 9, color: 'rgba(255,255,255,0.35)', textAlign: 'center', margin: '10px 0 0', textTransform: 'uppercase', letterSpacing: '0.12em' }}>Walk-ins also welcome</p>
            </motion.div>

            {/* AI Assistant */}
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
              style={{ background: '#fff', borderRadius: 24, padding: 24, border: '1px solid #f1f5f9', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                <div style={{ width: 38, height: 38, borderRadius: 12, background: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center', color: accent, fontSize: 18 }}>
                  <IoSparklesOutline />
                </div>
                <div>
                  <p style={{ fontSize: 11, fontWeight: 900, color: '#0f172a', margin: 0 }}>AI Assistant</p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#4ade80', boxShadow: '0 0 6px #4ade80' }} />
                    <span style={{ fontSize: 9, color: '#4ade80', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Online</span>
                  </div>
                </div>
              </div>
              <p style={{ fontSize: 12, color: '#64748b', margin: '0 0 16px', lineHeight: 1.6 }}>
                Have questions before your visit? Our AI can help you prepare.
              </p>
              <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }} onClick={() => setShowAI(true)}
                style={{ width: '100%', padding: 12, borderRadius: 14, border: `1.5px solid ${accent}33`, background: '#eff6ff', color: accent, fontSize: 10, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.18em', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, transition: 'all 0.2s' }}>
                <IoChatbubbleEllipsesOutline size={15} /> Ask a Question
              </motion.button>
            </motion.div>

            {/* Save / Contact */}
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
              style={{ background: '#fff', borderRadius: 24, padding: 20, border: '1px solid #f1f5f9', boxShadow: '0 2px 8px rgba(0,0,0,0.04)', display: 'flex', gap: 10 }}>
              <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.95 }} onClick={() => setSaved(s => !s)}
                style={{ flex: 1, padding: 12, borderRadius: 12, background: saved ? '#fef2f2' : '#f8fafc', border: `1px solid ${saved ? '#fecaca' : '#e2e8f0'}`, color: saved ? '#dc2626' : '#64748b', fontSize: 10, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.12em', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, transition: 'all 0.2s' }}>
                {saved ? <IoStar style={{ color: '#dc2626' }} /> : <IoHeartOutline />}
                {saved ? 'Saved' : 'Save'}
              </motion.button>
              <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.95 }} onClick={() => navigate('/contact')}
                style={{ flex: 1, padding: 12, borderRadius: 12, background: '#f8fafc', border: '1px solid #e2e8f0', color: '#64748b', fontSize: 10, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.12em', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, transition: 'all 0.2s' }}>
                <IoCallOutline /> Contact
              </motion.button>
            </motion.div>

            {/* Emergency note */}
            <div style={{ padding: '14px 18px', borderRadius: 16, background: '#fef2f2', border: '1px solid #fecaca', display: 'flex', gap: 10, alignItems: 'flex-start' }}>
              <IoAlertCircleOutline style={{ color: '#dc2626', fontSize: 20, flexShrink: 0, marginTop: 1 }} />
              <div>
                <p style={{ fontSize: 10, fontWeight: 900, color: '#dc2626', margin: '0 0 3px', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Emergency?</p>
                <p style={{ fontSize: 11, color: '#991b1b', margin: 0, lineHeight: 1.5 }}>
                  Call <strong>+231 770 000 000</strong> or go to the Emergency Unit, Ground Floor.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* AI Chat Overlay */}
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