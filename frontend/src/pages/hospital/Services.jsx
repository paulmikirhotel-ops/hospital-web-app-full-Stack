import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { IoArrowBack, IoCalendarOutline, IoShieldCheckmarkOutline, IoSparklesOutline, IoPulseOutline, IoChevronForwardOutline } from 'react-icons/io5';

const ServiceDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    const fetchService = async () => {
      try {
        // MATCHING PLURAL PATH: /api/services/
        const { data } = await axios.get(`http://localhost:5001/api/services/${id}`);
        if (data.success) setService(data.service);
      } catch (err) {
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchService();
    window.scrollTo(0, 0);
  }, [id]);

  if (loading) return <div className="h-screen flex items-center justify-center">Loading...</div>;
  if (!service) return <div className="h-screen flex items-center justify-center">Service Not Found.</div>;

  return (
    <div className="min-h-screen bg-slate-50 pt-32 pb-20 px-4 md:px-12">
      <div className="max-w-7xl mx-auto">
        <button onClick={() => navigate(-1)} className="flex items-center gap-3 text-slate-400 font-black text-[10px] uppercase tracking-widest mb-12 hover:text-blue-600">
          <IoArrowBack /> Return to Registry
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          <div className="lg:col-span-5">
            <div className="sticky top-32 bg-white rounded-[4rem] p-16 aspect-square shadow-2xl border border-slate-100 flex items-center justify-center">
              <img src={service.image} alt={service.title} className="w-full h-full object-contain" />
            </div>
          </div>

          <div className="lg:col-span-7">
            <span className="px-5 py-2 bg-blue-600 text-white rounded-full text-[9px] font-black uppercase tracking-widest">
              {service.category || 'Clinical Unit'}
            </span>
            <h1 className="text-6xl font-black text-slate-900 my-8 tracking-tighter">{service.title}</h1>
            
            <p className="text-xl text-slate-500 leading-relaxed italic mb-12">"{service.description}"</p>

            <button className="w-full py-6 bg-slate-900 text-white rounded-[2rem] font-black text-[10px] uppercase tracking-[0.2em] shadow-2xl hover:bg-blue-600 transition-all flex items-center justify-center gap-3">
              Initiate Booking <IoChevronForwardOutline />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceDetails;