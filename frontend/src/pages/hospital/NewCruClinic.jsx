import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  IoFlaskOutline, IoPulseOutline, IoArrowForward, IoLocationOutline,
  IoTimeOutline, IoCallOutline, IoSparklesOutline, IoScanOutline,
  IoWaterOutline, IoCloseOutline, IoCheckmarkCircleOutline
} from 'react-icons/io5';

const NewCruClinic = () => {
  const [activeService, setActiveService] = useState(null);

  // Service data integrated with SJCH clinical standards
  const services = [
    {
      id: "lab",
      title: "Diagnostic Laboratory",
      shortDesc: "Automated digital reporting for rapid results.",
      longDesc: "Our New Kru Town Laboratory is fully synced with the SJCH central database. We provide high-precision hematology, chemistry, and microscopy services with results delivered directly to your mobile portal.",
      icon: <IoFlaskOutline size={28} />,
      color: "from-blue-600 to-indigo-600",
      tag: "Live Sync",
      stats: ["99.8% Accuracy", "Digital Results", "Real-time Monitoring"]
    },
    {
      id: "maternal",
      title: "Maternal Health",
      shortDesc: "Comprehensive care for mothers and infants.",
      longDesc: "Dedicated to the New Kru Town community, our maternal wing offers digital fetal monitoring, personalized prenatal nutrition plans, and 24/7 postnatal support, bridging the gap to the main hospital facilities.",
      icon: <IoPulseOutline size={28} />,
      color: "from-rose-500 to-pink-600",
      tag: "Priority",
      stats: ["Prenatal Care", "Newborn Screening", "Lactation Support"]
    },
    {
      id: "pharmacy",
      title: "Smart Pharmacy",
      shortDesc: "AI-tracked inventory and digital prescriptions.",
      longDesc: "Never run out of essential medication. Our pharmacy uses smart inventory tracking to ensure life-saving drugs are always in stock. Patients receive automated SMS alerts when their prescriptions are ready for pickup.",
      icon: <IoScanOutline size={28} />,
      color: "from-emerald-500 to-teal-600",
      tag: "Verified",
      stats: ["SMS Alerts", "Safety Checks", "Stock Tracking"]
    },
    {
      id: "outpatient",
      title: "Outpatient Services",
      shortDesc: "Specialized primary care and consultations.",
      longDesc: "General health assessments and specialized management for chronic conditions. Our outpatient services are designed for efficiency, minimizing wait times through a digital queueing system.",
      icon: <IoWaterOutline size={28} />,
      color: "from-amber-500 to-orange-600",
      tag: "Efficiency",
      stats: ["Quick Queue", "Expert Staff", "Follow-up Sync"]
    }
  ];

  return (
    <div className="min-h-screen bg-[#fcfdfe] text-slate-900 font-sans">
      
      {/* --- HERO: INTEGRATED FACILITY IMAGE --- */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
              <div className="inline-flex items-center gap-2 px-3 py-1 mb-6 border border-blue-100 bg-blue-50/50 rounded-full">
                <IoSparklesOutline className="text-blue-600 animate-pulse" />
                <span className="text-[10px] font-black tracking-widest text-blue-700 uppercase">2026 AI Patient Care</span>
              </div>
              <h1 className="text-7xl font-black tracking-tighter leading-[0.9] mb-8">
                Clinic <br /> <span className="text-blue-600 italic">Redefined.</span>
              </h1>
              <p className="text-xl text-slate-500 mb-10 max-w-lg font-medium">
                Bringing the legacy of Saint John Catholic Hospital to New Kru Town with next-generation digital healthcare.
              </p>
              <button className="px-10 py-5 bg-slate-900 text-white text-[11px] font-black uppercase tracking-widest rounded-2xl shadow-2xl hover:bg-blue-600 transition-all">
                Access Patient Portal
              </button>
            </motion.div>

            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="relative">
              <div className="rounded-[4rem] overflow-hidden border-[12px] border-white shadow-2xl">
                {/* SHARED FILE IMAGE INTEGRATION */}
                <img 
                  src="https://images.ctfassets.net/jwk3944w4k64/39TmfjvYttHFQobNrERsvZ/c632d90e75b70aac329797be977ea219/New_Kru_Clinic.jpg" 
                  alt="New Kru Town Clinic" 
                  className="w-full h-full object-cover grayscale-[10%] hover:grayscale-0 transition-all duration-700"
                />
              </div>
              <div className="absolute -bottom-6 -right-6 bg-white p-6 rounded-3xl shadow-xl border border-slate-50">
                <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest mb-1">Clinic Hub</p>
                <p className="text-sm font-bold text-slate-800">New Kru Town, Liberia</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* --- SERVICES GRID --- */}
      <section className="max-w-7xl mx-auto px-4 lg:px-8 py-20">
        <h2 className="text-4xl font-black tracking-tighter mb-12">Clinic Specializations</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {services.map((s) => (
            <motion.div
              key={s.id}
              whileHover={{ y: -10 }}
              className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all cursor-pointer group"
              onClick={() => setActiveService(s)}
            >
              <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${s.color} flex items-center justify-center text-white mb-8 shadow-lg`}>
                {s.icon}
              </div>
              <h3 className="text-xl font-black mb-4 tracking-tight">{s.title}</h3>
              <p className="text-slate-500 text-sm mb-10 leading-relaxed">{s.shortDesc}</p>
              
              <button className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-blue-600 group-hover:gap-4 transition-all">
                Read More <IoArrowForward />
              </button>
            </motion.div>
          ))}
        </div>
      </section>

      {/* --- IMMERSIVE 'READ MORE' BEAUTIFUL PAGE/OVERLAY --- */}
      <AnimatePresence>
        {activeService && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-slate-900/40 backdrop-blur-xl flex items-center justify-center p-4 lg:p-8"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-white w-full max-w-5xl rounded-[4rem] overflow-hidden shadow-3xl relative flex flex-col lg:flex-row"
            >
              <button 
                onClick={() => setActiveService(null)}
                className="absolute top-8 right-8 z-50 p-4 bg-slate-100 rounded-full hover:bg-red-50 hover:text-red-600 transition-all"
              >
                <IoCloseOutline size={24} />
              </button>

              <div className={`lg:w-1/3 bg-gradient-to-br ${activeService.color} p-12 text-white flex flex-col justify-between`}>
                <div>
                  <div className="w-20 h-20 bg-white/20 backdrop-blur-md rounded-3xl flex items-center justify-center mb-8">
                    {activeService.icon}
                  </div>
                  <h2 className="text-4xl font-black tracking-tighter leading-none mb-4">{activeService.title}</h2>
                  <span className="px-3 py-1 bg-white/20 rounded-full text-[10px] font-bold tracking-widest uppercase">{activeService.tag}</span>
                </div>
                <div className="text-[10px] font-black uppercase tracking-[0.2em] opacity-50">
                  SJCH Medical Unit 2026
                </div>
              </div>

              <div className="lg:w-2/3 p-12 lg:p-20 bg-white overflow-y-auto">
                <p className="text-2xl text-slate-800 font-bold mb-8 leading-tight">{activeService.longDesc}</p>
                <div className="grid sm:grid-cols-2 gap-4 mb-12">
                  {activeService.stats.map((stat, i) => (
                    <div key={i} className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                      <IoCheckmarkCircleOutline className="text-blue-600" size={20} />
                      <span className="text-xs font-black uppercase text-slate-600 tracking-wider">{stat}</span>
                    </div>
                  ))}
                </div>
                <div className="flex gap-4">
                  <button className="px-8 py-4 bg-blue-600 text-white text-[10px] font-black uppercase tracking-widest rounded-xl hover:scale-105 transition-transform">
                    Book Service Now
                  </button>
                  <button onClick={() => setActiveService(null)} className="px-8 py-4 bg-slate-100 text-slate-600 text-[10px] font-black uppercase tracking-widest rounded-xl">
                    Back to Clinic
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default NewCruClinic;