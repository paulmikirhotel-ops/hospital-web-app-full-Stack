import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  IoShieldHalfOutline, IoEarthOutline, IoBodyOutline, 
  IoPeopleOutline, IoSparklesOutline, IoRibbonOutline,
  IoReaderOutline, IoOpenOutline, IoChevronDown 
} from 'react-icons/io5';

const TheOrder = () => {
  const [isHistoryExpanded, setIsHistoryExpanded] = useState(false);

  const coreValues = [
    { 
      title: "Hospitality", 
      desc: "Our primary value, manifesting in open arms to all who suffer.", 
      icon: <IoPeopleOutline />, 
      accent: "from-blue-500 to-cyan-400" 
    },
    { 
      title: "Quality", 
      desc: "Professional excellence combined with deep human compassion.", 
      icon: <IoSparklesOutline />, 
      accent: "from-teal-500 to-emerald-400" 
    },
    { 
      title: "Respect", 
      desc: "Recognizing the divine dignity in every patient and staff member.", 
      icon: <IoShieldHalfOutline />, 
      accent: "from-indigo-500 to-blue-400" 
    },
    { 
      title: "Responsibility", 
      desc: "Ethical stewardship of resources and community trust.", 
      icon: <IoRibbonOutline />, 
      accent: "from-rose-500 to-orange-400" 
    }
  ];

  return (
    <div className="bg-[#f8fafc] min-h-screen selection:bg-blue-100">
      
      {/* --- CINEMATIC HERO SECTION --- */}
      <section className="relative h-[85vh] flex items-center justify-center overflow-hidden bg-slate-950">
        <motion.div 
          initial={{ scale: 1.1, opacity: 0 }}
          animate={{ scale: 1, opacity: 0.4 }}
          transition={{ duration: 2 }}
          className="absolute inset-0"
        >
          <img 
            src="https://images.ctfassets.net/jwk3944w4k64/5KY8qX7H264DNBQg6mdiO1/d796f3e774fa63a7ef1f8d60d8fe2a4f/The_Order.jpg" 
            alt="St. John of God Heritage" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-slate-950/60 to-slate-950" />
        </motion.div>
        
        <div className="relative z-10 text-center px-6">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="inline-block px-6 py-2 rounded-full border border-blue-400/30 bg-blue-500/10 backdrop-blur-md text-blue-300 text-[10px] font-black uppercase tracking-[0.4em] mb-8"
          >
            A Five-Century Legacy of Care
          </motion.div>
          <h1 className="text-6xl md:text-9xl font-black text-white leading-[0.8] tracking-tighter mb-6">
            THE <br /><span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-teal-300">ORDER.</span>
          </h1>
        </div>
      </section>

      {/* --- THE CHARISM & HISTORY (READ MORE) --- */}
      <section className="container mx-auto px-6 -mt-24 relative z-20">
        <div className="bg-white rounded-[3.5rem] shadow-2xl shadow-blue-900/10 p-10 lg:p-20 border border-slate-100">
          <div className="flex flex-col lg:flex-row justify-between items-start gap-12">
            <div className="lg:w-2/3">
              <h2 className="text-4xl font-black text-slate-900 mb-8">The Brothers' Charism</h2>
              <div className="prose prose-slate lg:prose-xl max-w-none">
                <p className="text-slate-600 leading-relaxed font-medium">
                  The Hospitaller Order of Saint John of God is a worldwide Catholic religious order. In Liberia, we are the custodians of a 500-year-old mission: to see the face of Christ in the suffering and to provide "Hospitality" without borders.
                </p>

                <AnimatePresence>
                  {isHistoryExpanded && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="overflow-hidden mt-6 space-y-6 border-l-4 border-blue-50 ml-2 pl-6"
                    >
                      <p className="text-slate-500">
                        Founded in Granada, Spain, the Order has survived wars, pandemics, and social upheavals. Our Charism—a gift of the Holy Spirit—is specifically tailored to the healthcare vocation. It is more than just service; it is a spiritual commitment to professional excellence and human warmth.
                      </p>
                      <p className="text-slate-500">
                        Today, the Brothers work alongside lay professionals in Monrovia, ensuring that the spirit of St. John of God remains the heartbeat of the hospital’s operations.
                      </p>
                      
                      {/* CLICKABLE SOURCE LINK TO GLOBAL ORDER */}
                      <div className="pt-4">
                        <a 
                          href="https://www.ohsjd.org/Objects/Pagina.asp?ID=514&m=2" 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-3 px-6 py-3 bg-blue-50 text-blue-600 rounded-2xl font-bold text-sm hover:bg-blue-600 hover:text-white transition-all group"
                        >
                          Explore Global Charism <IoOpenOutline className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                        </a>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <button 
                onClick={() => setIsHistoryExpanded(!isHistoryExpanded)}
                className="mt-10 flex items-center gap-3 bg-slate-900 text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-blue-600 transition-all shadow-xl shadow-slate-200"
              >
                <IoReaderOutline size={18}/>
                {isHistoryExpanded ? "Show Less" : "Read the Full History"}
              </button>
            </div>

            <div className="lg:w-1/3 w-full">
              <div className="bg-slate-50 rounded-[2.5rem] p-8 border border-slate-100 relative overflow-hidden">
                <IoEarthOutline className="absolute -right-4 -top-4 text-slate-200 text-9xl opacity-50" />
                <h4 className="text-slate-900 font-black uppercase text-xs tracking-widest mb-4 relative z-10">Global Impact</h4>
                <div className="space-y-6 relative z-10">
                  <div className="flex items-center gap-4">
                    <span className="text-3xl font-black text-blue-600">50+</span>
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-tighter">Countries with Presence</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-3xl font-black text-teal-500">400+</span>
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-tighter">Health & Social Centers</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-3xl font-black text-indigo-500">1572</span>
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-tighter">Year Officially Recognized</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- CORE VALUES INTERACTIVE GRID --- */}
      <section className="py-32 container mx-auto px-6">
        <div className="text-center mb-20">
          <span className="text-blue-600 font-black uppercase tracking-[0.3em] text-[10px]">The Four Pillars</span>
          <h2 className="text-4xl lg:text-5xl font-black text-slate-900 mt-2">Foundational Values</h2>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {coreValues.map((val, idx) => (
            <motion.div 
              key={idx}
              whileHover={{ y: -10 }}
              className="bg-white p-10 rounded-[2.5rem] shadow-sm border border-slate-100 text-center hover:border-blue-200 hover:shadow-2xl hover:shadow-blue-900/5 transition-all group"
            >
              <div className={`w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br ${val.accent} text-white flex items-center justify-center text-3xl mb-8 shadow-lg group-hover:scale-110 transition-transform`}>
                {val.icon}
              </div>
              <h3 className="text-xl font-black text-slate-900 mb-4 uppercase tracking-tighter">{val.title}</h3>
              <p className="text-slate-500 text-sm leading-relaxed font-medium">
                {val.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* --- THE BROTHERS' CALL (INTERACTIVE CTA) --- */}
      <section className="container mx-auto px-6 mb-32">
        <div className="bg-gradient-to-br from-slate-900 to-blue-900 rounded-[4rem] p-12 lg:p-24 text-center text-white relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full -mr-32 -mt-32 blur-3xl animate-pulse" />
          <motion.h2 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="text-4xl lg:text-6xl font-black mb-8 leading-tight"
          >
            "Go on doing good, <br />brothers."
          </motion.h2>
          <p className="text-blue-100 text-lg mb-12 max-w-2xl mx-auto font-medium">
            The final words of St. John of God remain our guiding light today in Monrovia. Join us in this mission of healing.
          </p>
          <div className="flex flex-wrap justify-center gap-6">
            <button className="px-10 py-5 bg-white text-slate-900 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-blue-400 hover:text-white transition-all transform hover:scale-105">
              Contact the Order
            </button>
            <a 
              href="https://www.ohsjd.org/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="px-10 py-5 border border-white/20 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-white/10 transition-all flex items-center gap-2"
            >
              International Site <IoOpenOutline />
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default TheOrder;