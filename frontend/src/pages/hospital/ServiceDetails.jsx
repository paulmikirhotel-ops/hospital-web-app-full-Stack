import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  IoArrowBack, IoCalendarOutline, IoShieldCheckmarkOutline, 
  IoSparklesOutline, IoPulseOutline, IoChevronForwardOutline 
} from 'react-icons/io5';

const ServiceDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
  const fetchService = async () => {
    // 🚀 1. Prevent the "undefined" crash
    if (!id || id === 'undefined' || id.length !== 24) {
      console.error("Invalid ID provided to ServiceDetails:", id);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const { data } = await axios.get(`http://localhost:5001/api/services/${id}`);
      
      if (data.success && data.service) {
        setService(data.service);
      } else {
        setService(null);
      }
    } catch (err) {
      console.error("Fetch error details:", err.response?.data || err.message);
      setService(null);
    } finally {
      setLoading(false);
    }
  };

  fetchService();
  window.scrollTo(0, 0);
}, [id]);
  if (loading) return (
    <div className="h-screen flex items-center justify-center bg-slate-50">
      <div className="flex flex-col items-center gap-4">
        <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Loading Clinical Profile...</p>
      </div>
    </div>
  );

  if (!service) return <div className="h-screen flex items-center justify-center">Service Offline.</div>;

  return (
    <div className="min-h-screen bg-slate-50 pt-32 pb-20 px-4 md:px-12">
      <div className="max-w-7xl mx-auto">
        
        {/* TOP NAVIGATION */}
        <button 
          onClick={() => navigate(-1)} 
          className="group flex items-center gap-3 text-slate-400 font-black text-[10px] uppercase tracking-widest mb-12 hover:text-blue-600 transition-all"
        >
          <div className="p-2 rounded-full bg-white shadow-sm group-hover:bg-blue-600 group-hover:text-white transition-all">
            <IoArrowBack size={16} />
          </div>
          Return to Registry
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          
          {/* LEFT: VISUAL PANEL (Sticky) */}
          <div className="lg:col-span-5">
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              className="sticky top-32 bg-white rounded-[4rem] p-16 aspect-square shadow-2xl shadow-blue-900/5 border border-slate-100 flex items-center justify-center overflow-hidden"
            >
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-50/50 to-transparent" />
              <motion.img 
                whileHover={{ scale: 1.05, rotate: 2 }}
                src={service.image} 
                alt={service.title} 
                className="w-full h-full object-contain relative z-10" 
              />
            </motion.div>
          </div>

          {/* RIGHT: CONTENT PANEL */}
          <div className="lg:col-span-7">
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="flex items-center gap-3 mb-6">
                <span className="px-5 py-2 bg-blue-600 text-white rounded-full text-[9px] font-black uppercase tracking-widest shadow-lg shadow-blue-200">
                  {service.category || 'Clinical Unit'}
                </span>
                <div className="h-px w-12 bg-slate-200" />
                <span className="flex items-center gap-2 text-emerald-500 text-[10px] font-black uppercase tracking-widest">
                  <IoPulseOutline /> System Active
                </span>
              </div>

              <h1 className="text-6xl font-black text-slate-900 mb-8 leading-[1.1] tracking-tighter">
                {service.title}
              </h1>

              {/* INTERACTIVE TABS */}
              <div className="flex gap-8 border-b border-slate-200 mb-10">
                {['overview', 'technology', 'specialists'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`pb-4 text-[10px] font-black uppercase tracking-[0.2em] transition-all relative ${
                      activeTab === tab ? 'text-blue-600' : 'text-slate-400 hover:text-slate-600'
                    }`}
                  >
                    {tab}
                    {activeTab === tab && (
                      <motion.div layoutId="tab-underline" className="absolute bottom-0 left-0 right-0 h-1 bg-blue-600 rounded-full" />
                    )}
                  </button>
                ))}
              </div>

              {/* TAB CONTENT */}
              <div className="min-h-[200px] mb-12">
                <AnimatePresence mode="wait">
                  {activeTab === 'overview' && (
                    <motion.div
                      key="overview"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                    >
                      <p className="text-xl text-slate-500 leading-relaxed italic mb-8">
                        "{service.description}"
                      </p>
                      <div className="grid grid-cols-2 gap-6">
                        <FeatureCard icon={<IoShieldCheckmarkOutline />} text="ISO Certified Standards" />
                        <FeatureCard icon={<IoSparklesOutline />} text="AI-Assisted Diagnostics" />
                      </div>
                    </motion.div>
                  )}
                  {activeTab === 'technology' && (
                    <motion.p key="tech" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-slate-500">
                      Our {service.title} department utilizes 2026-gen medical infrastructure, including non-invasive precision imaging and real-time biometric monitoring.
                    </motion.p>
                  )}
                  {activeTab === 'specialists' && (
                    <motion.p key="spec" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-slate-500">
                      Staffed by board-certified consultants with a minimum of 15 years clinical experience in {service.category}.
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>

              {/* CALL TO ACTION */}
              <div className="flex flex-col sm:flex-row gap-4">
                <button className="flex-grow py-6 bg-slate-900 text-white rounded-[2rem] font-black text-[10px] uppercase tracking-[0.2em] shadow-2xl hover:bg-blue-600 transition-all flex items-center justify-center gap-3 group">
                  Initiate Booking <IoChevronForwardOutline className="group-hover:translate-x-2 transition-transform" size={18}/>
                </button>
                <button className="p-6 bg-white border border-slate-200 text-slate-900 rounded-[2rem] hover:bg-slate-50 transition-all">
                  <IoCalendarOutline size={20} />
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Sub-component for features
const FeatureCard = ({ icon, text }) => (
  <div className="flex items-center gap-4 bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
    <div className="text-blue-600 text-2xl">{icon}</div>
    <span className="text-[10px] font-black text-slate-700 uppercase tracking-widest">{text}</span>
  </div>
);

export default ServiceDetails;