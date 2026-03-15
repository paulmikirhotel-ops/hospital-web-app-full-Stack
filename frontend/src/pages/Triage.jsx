import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  IoMedicalOutline, IoPulseOutline, IoAlertCircleOutline,
  IoCheckmarkCircleOutline, IoTimeOutline, IoArrowForwardOutline,
  IoRefreshOutline, IoShieldCheckmarkOutline, IoCallOutline,
  IoInformationCircleOutline,
} from 'react-icons/io5';
import API from '../api/axiosConfig';

const urgencyConfig = {
  Emergency: {
    bg:       'linear-gradient(135deg,#fef2f2,#fff5f5)',
    border:   '#fca5a5',
    badge:    'bg-red-500',
    text:     '#991b1b',
    icon:     <IoAlertCircleOutline size={28}/>,
    pulse:    'bg-red-500',
    label:    '🚨 Emergency',
    sub:      'Go to the Emergency Unit immediately',
  },
  Urgent: {
    bg:       'linear-gradient(135deg,#fefce8,#fffbf0)',
    border:   '#fde047',
    badge:    'bg-amber-500',
    text:     '#854d0e',
    icon:     <IoTimeOutline size={28}/>,
    pulse:    'bg-amber-500',
    label:    '⚠️ Urgent',
    sub:      'Seek medical attention within 24 hours',
  },
  Routine: {
    bg:       'linear-gradient(135deg,#f0fdf4,#f8fffa)',
    border:   '#86efac',
    badge:    'bg-emerald-500',
    text:     '#166534',
    icon:     <IoCheckmarkCircleOutline size={28}/>,
    pulse:    'bg-emerald-500',
    label:    '✓ Routine',
    sub:      'Schedule a regular appointment',
  },
};

const departments = [
  'Emergency','General Practice','Cardiology','Neurology',
  'Pediatrics','Orthopedics','Gynecology / Obstetrics',
  'Dermatology','Psychiatry','ENT','Oncology','Radiology',
];

const Triage = () => {
  const navigate  = useNavigate();
  const [symptoms,  setSymptoms]  = useState('');
  const [result,    setResult]    = useState(null);
  const [loading,   setLoading]   = useState(false);
  const [error,     setError]     = useState('');
  const [charCount, setCharCount] = useState(0);

  const handleChange = (e) => {
    setSymptoms(e.target.value);
    setCharCount(e.target.value.length);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setResult(null);
    setLoading(true);
    try {
      const response = await API.post('/ai/triage', { symptoms });
      setResult(response.data.triage);
    } catch (err) {
      const msg = err.response?.data?.message || '';
      if (err.response?.status === 401) {
        setError('Please log in to use the AI Triage tool.');
      } else if (err.response?.status === 429) {
        setError('Too many requests. Please wait a minute and try again.');
      } else if (msg) {
        setError(msg);
      } else {
        setError('Triage AI is currently offline. Please visit the hospital directly or call +231 770 000 000.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setResult(null);
    setSymptoms('');
    setCharCount(0);
    setError('');
  };

  const cfg = result ? urgencyConfig[result.urgency] || urgencyConfig.Routine : null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-white py-16 px-4">
      <style>{`
        @keyframes spin    { to { transform: rotate(360deg); } }
        @keyframes fadeUp  { from { opacity:0; transform:translateY(20px); } to { opacity:1; transform:translateY(0); } }
        @keyframes ping    { 75%,100% { transform:scale(2); opacity:0; } }
        .triage-spin       { animation: spin 0.8s linear infinite; }
        .triage-ping       { animation: ping 1.2s cubic-bezier(0,0,0.2,1) infinite; }
        .triage-fade-up    { animation: fadeUp 0.5s ease forwards; }
      `}</style>

      <div className="max-w-2xl mx-auto">

        {/* ── HEADER ── */}
        <motion.div initial={{ opacity:0, y:-20 }} animate={{ opacity:1, y:0 }} className="text-center mb-10">
          <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-100 px-4 py-2 rounded-full mb-5">
            <div className="relative">
              <div className="w-2 h-2 rounded-full bg-blue-600"/>
              <div className="w-2 h-2 rounded-full bg-blue-600 absolute inset-0 triage-ping opacity-75"/>
            </div>
            <span className="text-[10px] font-black uppercase tracking-widest text-blue-600">AI-Powered · Live</span>
          </div>

          <h1 className="text-4xl lg:text-5xl font-black text-slate-900 tracking-tighter mb-3 leading-none">
            Symptom <span className="text-blue-600">Triage</span>
          </h1>
          <p className="text-slate-500 text-base leading-relaxed max-w-md mx-auto">
            Describe how you're feeling and our AI will direct you to the right department at St. Joseph's.
          </p>

          {/* Feature pills */}
          <div className="flex flex-wrap justify-center gap-2 mt-5">
            {[
              { icon:<IoShieldCheckmarkOutline size={12}/>, text:'Private & Secure'     },
              { icon:<IoPulseOutline size={12}/>,           text:'Instant Analysis'     },
              { icon:<IoMedicalOutline size={12}/>,         text:'Clinically Guided'    },
            ].map(p => (
              <span key={p.text} className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-100 rounded-full text-[10px] font-black text-slate-500 uppercase tracking-widest shadow-sm">
                <span className="text-blue-500">{p.icon}</span> {p.text}
              </span>
            ))}
          </div>
        </motion.div>

        {/* ── FORM ── */}
        <AnimatePresence mode="wait">
          {!result ? (
            <motion.div key="form" initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0, y:-20 }}>
              <form onSubmit={handleSubmit}>
                <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-100/50 overflow-hidden">

                  {/* Dark header bar */}
                  <div className="bg-slate-900 px-7 py-5 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-white text-xl">
                      <IoPulseOutline/>
                    </div>
                    <div>
                      <p className="text-white font-black text-sm">Describe Your Symptoms</p>
                      <p className="text-slate-400 text-[10px] uppercase tracking-widest font-bold">Be as detailed as possible</p>
                    </div>
                  </div>

                  <div className="p-6 lg:p-8">
                    {/* Textarea */}
                    <div className="relative mb-5">
                      <textarea
                        value={symptoms}
                        onChange={handleChange}
                        rows={6}
                        maxLength={1000}
                        placeholder="e.g. I have had a severe headache for 2 days, my vision is blurry, I feel nauseous and my neck feels stiff. The pain is worse in the morning..."
                        className="w-full border-2 border-slate-100 rounded-2xl p-5 text-sm text-slate-800 outline-none resize-none font-medium leading-relaxed placeholder:text-slate-300 transition-all focus:border-blue-500 focus:ring-4 focus:ring-blue-50"
                        style={{ background:'#fafbff' }}
                      />
                      <div className="absolute bottom-3 right-4 flex items-center gap-3">
                        <span className={`text-[10px] font-black ${charCount > 900 ? 'text-red-400' : charCount > 0 ? 'text-blue-500' : 'text-slate-300'}`}>
                          {charCount}/1000
                        </span>
                        {charCount >= 10 && (
                          <div className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_6px_rgba(74,222,128,0.8)]"/>
                        )}
                      </div>
                    </div>

                    {/* Min chars indicator */}
                    <div className="flex items-center gap-2 mb-5">
                      <div className={`flex-1 h-1 rounded-full overflow-hidden bg-slate-100`}>
                        <motion.div
                          animate={{ width: `${Math.min((charCount / 10) * 100, 100)}%` }}
                          className={`h-full rounded-full transition-all ${charCount >= 10 ? 'bg-emerald-500' : 'bg-blue-400'}`}
                        />
                      </div>
                      <span className={`text-[10px] font-black uppercase tracking-widest ${charCount >= 10 ? 'text-emerald-500' : 'text-slate-400'}`}>
                        {charCount >= 10 ? '✓ Ready' : `${10 - charCount} more chars`}
                      </span>
                    </div>

                    {/* Quick symptom chips */}
                    <div className="mb-6">
                      <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-2">Quick add:</p>
                      <div className="flex flex-wrap gap-2">
                        {['Chest pain','Fever','Headache','Shortness of breath','Abdominal pain','Dizziness','Nausea','Back pain'].map(s => (
                          <button key={s} type="button"
                            onClick={() => {
                              const sep = symptoms.trim() ? ', ' : '';
                              const val = symptoms + sep + s.toLowerCase();
                              setSymptoms(val);
                              setCharCount(val.length);
                            }}
                            className="px-3 py-1.5 bg-slate-50 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 text-slate-500 border border-slate-100 rounded-full text-[10px] font-black uppercase tracking-widest transition-all">
                            + {s}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Error */}
                    <AnimatePresence>
                      {error && (
                        <motion.div initial={{ opacity:0, y:-8 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0, y:-8 }}
                          className="flex items-start gap-3 bg-red-50 border border-red-100 rounded-2xl p-4 mb-5">
                          <IoAlertCircleOutline size={18} className="text-red-500 flex-shrink-0 mt-0.5"/>
                          <div>
                            <p className="text-sm font-bold text-red-700">{error}</p>
                            {error.includes('offline') && (
                              <button type="button" onClick={() => navigate('/contact')}
                                className="text-[10px] font-black text-red-500 uppercase tracking-widest mt-1 hover:underline">
                                Contact us instead →
                              </button>
                            )}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Submit */}
                    <button type="submit" disabled={loading || charCount < 10}
                      className="w-full py-4 rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-3 disabled:cursor-not-allowed"
                      style={{
                        background: loading || charCount < 10 ? '#e2e8f0' : 'linear-gradient(135deg,#1d4ed8,#2563eb)',
                        color: loading || charCount < 10 ? '#94a3b8' : '#fff',
                        boxShadow: loading || charCount < 10 ? 'none' : '0 8px 28px rgba(37,99,235,0.35)',
                      }}>
                      {loading ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full triage-spin"/>
                          Analyzing Symptoms...
                        </>
                      ) : (
                        <>
                          <IoPulseOutline size={18}/> Analyze My Symptoms
                        </>
                      )}
                    </button>

                    {/* Disclaimer */}
                    <p className="text-center text-[10px] text-slate-400 mt-4 leading-relaxed">
                      This tool does not replace a real doctor. In a life-threatening emergency call{' '}
                      <a href="tel:+231770000000" className="font-black text-blue-600">+231 770 000 000</a> immediately.
                    </p>
                  </div>
                </div>
              </form>
            </motion.div>
          ) : (

            /* ── RESULT ── */
            <motion.div key="result" initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0, y:-20 }}
              className="space-y-4">

              {/* Urgency hero card */}
              <div
                className="rounded-[2.5rem] overflow-hidden border-2 shadow-xl"
                style={{ background: cfg.bg, borderColor: cfg.border }}
              >
                {/* Top banner */}
                <div className="px-7 py-6 flex items-center justify-between flex-wrap gap-4"
                  style={{ borderBottom:`1px solid ${cfg.border}` }}>
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <div className={`w-14 h-14 rounded-2xl ${cfg.badge} bg-opacity-20 flex items-center justify-center`}
                        style={{ color: cfg.text }}>
                        {cfg.icon}
                      </div>
                      <div className={`absolute -top-1 -right-1 w-4 h-4 rounded-full ${cfg.pulse} border-2 border-white`}>
                        <div className={`absolute inset-0 rounded-full ${cfg.pulse} triage-ping opacity-75`}/>
                      </div>
                    </div>
                    <div>
                      <p className="text-[9px] font-black uppercase tracking-widest mb-0.5" style={{ color:`${cfg.text}99` }}>Urgency Level</p>
                      <p className="text-2xl font-black tracking-tighter" style={{ color: cfg.text }}>{cfg.label}</p>
                      <p className="text-[11px] font-bold" style={{ color:`${cfg.text}99` }}>{cfg.sub}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-[9px] font-black uppercase tracking-widest mb-1" style={{ color:`${cfg.text}99` }}>Recommended Department</p>
                    <p className="text-xl font-black tracking-tighter" style={{ color: cfg.text }}>{result.department}</p>
                  </div>
                </div>

                <div className="p-6 lg:p-8 space-y-5">

                  {/* Advice */}
                  <div>
                    <p className="text-[9px] font-black uppercase tracking-widest text-slate-500 mb-2 flex items-center gap-2">
                      <IoInformationCircleOutline size={14}/> What To Do Now
                    </p>
                    <p className="text-base text-slate-700 leading-relaxed font-medium">{result.advice}</p>
                  </div>

                  {/* Red flags */}
                  {result.redFlags?.length > 0 && (
                    <div>
                      <p className="text-[9px] font-black uppercase tracking-widest text-slate-500 mb-3 flex items-center gap-2">
                        <IoAlertCircleOutline size={14} className="text-red-500"/> Warning Signs — Go to ER immediately if:
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {result.redFlags.map((flag, i) => (
                          <span key={i} className="flex items-center gap-1.5 px-3 py-1.5 bg-red-50 text-red-700 border border-red-100 rounded-full text-xs font-bold">
                            <span className="w-1.5 h-1.5 rounded-full bg-red-500 flex-shrink-0"/>
                            {flag}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Disclaimer */}
                  <div className="bg-white/70 border border-slate-100 rounded-2xl p-4 flex items-start gap-3">
                    <IoShieldCheckmarkOutline size={16} className="text-blue-500 flex-shrink-0 mt-0.5"/>
                    <p className="text-xs text-slate-500 leading-relaxed">{result.disclaimer}</p>
                  </div>
                </div>
              </div>

              {/* Action buttons */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Book appointment */}
                <motion.button whileHover={{ scale:1.02 }} whileTap={{ scale:0.97 }}
                  onClick={() => navigate('/doctors')}
                  className="flex items-center justify-center gap-3 py-4 bg-slate-900 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-slate-200 transition-all hover:bg-blue-600">
                  <IoMedicalOutline size={16}/> Find a Specialist
                </motion.button>

                {/* Emergency call */}
                {result.urgency === 'Emergency' ? (
                  <motion.a whileHover={{ scale:1.02 }} whileTap={{ scale:0.97 }}
                    href="tel:+231770000000"
                    className="flex items-center justify-center gap-3 py-4 bg-red-500 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-red-100 transition-all hover:bg-red-600">
                    <IoCallOutline size={16}/> Call Emergency Now
                  </motion.a>
                ) : (
                  <motion.button whileHover={{ scale:1.02 }} whileTap={{ scale:0.97 }}
                    onClick={() => navigate('/appointment')}
                    className="flex items-center justify-center gap-3 py-4 bg-blue-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-blue-100 transition-all hover:bg-blue-700">
                    <IoArrowForwardOutline size={16}/> Book Appointment
                  </motion.button>
                )}
              </div>

              {/* Department quick links */}
              <div className="bg-white rounded-[2rem] border border-slate-100 p-6 shadow-sm">
                <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-4">All Departments</p>
                <div className="flex flex-wrap gap-2">
                  {departments.map(dept => (
                    <button key={dept}
                      onClick={() => navigate('/doctors')}
                      className={`px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all border ${
                        dept === result.department
                          ? 'bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-100'
                          : 'bg-slate-50 text-slate-500 border-slate-100 hover:border-blue-200 hover:text-blue-600'
                      }`}>
                      {dept}
                    </button>
                  ))}
                </div>
              </div>

              {/* Start over */}
              <button onClick={handleReset}
                className="w-full flex items-center justify-center gap-2 py-3.5 bg-white border border-slate-200 rounded-2xl font-black text-[10px] uppercase tracking-widest text-slate-500 hover:bg-slate-50 hover:border-slate-300 transition-all shadow-sm">
                <IoRefreshOutline size={15}/> Analyze New Symptoms
              </button>

              {/* Footer disclaimer */}
              <p className="text-center text-[10px] text-slate-400 leading-relaxed pb-4">
                This is an AI-generated assessment and does not constitute medical advice.
                Always consult a qualified healthcare professional. Emergency:{' '}
                <a href="tel:+231770000000" className="font-black text-blue-600">+231 770 000 000</a>
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Triage;