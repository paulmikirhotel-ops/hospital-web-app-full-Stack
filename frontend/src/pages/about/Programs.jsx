import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  IoHeartOutline, IoShieldCheckmarkOutline, IoGitNetworkOutline, 
  IoMedicalOutline, IoCloseOutline, IoArrowForward, IoInformationCircleOutline 
} from 'react-icons/io5';

const Programs = () => {
  const [selectedProgram, setSelectedProgram] = useState(null);
  const [isIntroExpanded, setIsIntroExpanded] = useState(false);

  // Data mapped directly from your Programs file logic
  const hospitalPrograms = [
    {
      id: "p1",
      title: "Maternal & Child Health",
      category: "Specialized Care",
      shortDesc: "Comprehensive prenatal, delivery, and postnatal services ensuring the safety of both mother and child.",
      fullDesc: "Our flagship program focuses on reducing maternal mortality through expert clinical intervention. We provide 24/7 emergency obstetric care, neonatal intensive care unit (NICU) support, and a dedicated team of midwives and pediatricians.",
      icon: <IoHeartOutline />,
      color: "bg-rose-500",
      stats: "Active 24/7"
    },
    {
      id: "p2",
      title: "HIV/AIDS Outreach",
      category: "Community Health",
      shortDesc: "Integrated testing, counseling, and long-term antiretroviral treatment support for the community.",
      fullDesc: "Working in partnership with international health bodies, we offer confidential testing and holistic management. Our program includes peer support groups, nutritional counseling, and prevention of mother-to-child transmission (PMTCT).",
      icon: <IoShieldCheckmarkOutline />,
      color: "bg-blue-600",
      stats: "Free Services"
    },
    {
      id: "p3",
      title: "Surgical Outreach",
      category: "Clinical Excellence",
      shortDesc: "Specialized surgical campaigns providing critical operations to underserved populations.",
      fullDesc: "We regularly host surgical missions focusing on corrective procedures, ophthalmic surgery, and general surgical needs. Our state-of-the-art theaters are equipped to handle complex cases with a focus on post-operative recovery.",
      icon: <IoMedicalOutline />,
      color: "bg-teal-500",
      stats: "Quarterly Missions"
    },
    {
      id: "p4",
      title: "Health Education",
      category: "Preventative",
      shortDesc: "Empowering Monrovia with the knowledge to prevent communicable diseases and maintain wellness.",
      fullDesc: "This program bridges the gap between the hospital and the home. We conduct school visits, community workshops, and radio broadcasts to educate the public on hygiene, sanitation, and early symptom recognition.",
      icon: <IoGitNetworkOutline />,
      color: "bg-indigo-600",
      stats: "Community Wide"
    }
  ];

  return (
    <div className="bg-[#fcfcfd] min-h-screen font-sans selection:bg-blue-100">
      
      {/* --- PREMIUM HERO SECTION --- */}
      <section className="relative h-[70vh] flex items-center bg-slate-900 overflow-hidden">
        <div className="absolute inset-0 opacity-40">
           <img 
            src="https://images.ctfassets.net/jwk3944w4k64/NRDVy9jkNhZGlYCAwEH32/150933d871ecb963d98f54ca53894e78/picture-4-scaled.jpg" 
            alt="Hospital Programs" 
            className="w-full h-full object-cover"
          />
        </div>
        
        <div className="container mx-auto px-6 relative z-10">
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            className="max-w-3xl"
          >
            <span className="bg-blue-500/20 text-blue-400 px-4 py-1 rounded-full text-xs font-black uppercase tracking-widest mb-6 inline-block backdrop-blur-md border border-blue-500/30">
              Impact & Outreach
            </span>
            <h1 className="text-7xl lg:text-8xl font-black text-white leading-none tracking-tighter mb-8">
              OUR <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-teal-300">PROGRAMS.</span>
            </h1>
          </motion.div>
        </div>
      </section>

      {/* --- INTERACTIVE INTRODUCTION --- */}
      <section className="container mx-auto px-6 -mt-16 relative z-20">
        <div className="bg-white rounded-[2.5rem] shadow-xl p-10 lg:p-16 border border-slate-100">
          <div className="max-w-4xl">
            <h2 className="text-3xl font-black text-slate-900 mb-6">Sustainable Health for Liberia</h2>
            <p className="text-slate-600 text-lg leading-relaxed mb-4">
              Saint Joseph’s Catholic Hospital operates far beyond its clinical walls. Through our specialized programs, we address the root causes of health instability in our communities...
            </p>
            
            <AnimatePresence>
              {isIntroExpanded && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden text-slate-600 leading-relaxed space-y-4"
                >
                  <p>
                    By integrating clinical expertise with community outreach, we ensure that healthcare is accessible, equitable, and sustainable. Our programs are designed in collaboration with global health partners and local leaders to meet the unique needs of the Liberian people.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

            <button 
              onClick={() => setIsIntroExpanded(!isIntroExpanded)}
              className="mt-6 flex items-center gap-2 text-blue-600 font-bold text-sm group"
            >
              <IoInformationCircleOutline size={20} className="group-hover:rotate-12 transition-transform"/>
              {isIntroExpanded ? "Show Less" : "Learn About Our Impact"}
            </button>
          </div>
        </div>
      </section>

      {/* --- BENTO PROGRAM GRID --- */}
      <section className="py-24 container mx-auto px-6">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {hospitalPrograms.map((prog) => (
            <motion.div
              key={prog.id}
              whileHover={{ y: -10 }}
              onClick={() => setSelectedProgram(prog)}
              className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-2xl hover:shadow-blue-500/10 transition-all cursor-pointer group flex flex-col h-full"
            >
              <div className={`w-14 h-14 rounded-2xl ${prog.color} text-white flex items-center justify-center text-2xl mb-8 shadow-lg shadow-inherit/20`}>
                {prog.icon}
              </div>
              <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest mb-2 block">{prog.category}</span>
              <h3 className="text-2xl font-black text-slate-900 mb-4 leading-tight">{prog.title}</h3>
              <p className="text-slate-500 text-sm leading-relaxed mb-8 line-clamp-3">{prog.shortDesc}</p>
              
              <div className="mt-auto flex items-center justify-between pt-6 border-t border-slate-50">
                <span className="text-[10px] font-bold text-slate-400 italic">{prog.stats}</span>
                <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-slate-900 group-hover:text-white transition-all">
                  <IoArrowForward />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* --- PROGRAM DETAIL MODAL --- */}
      <AnimatePresence>
        {selectedProgram && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-950/80 backdrop-blur-xl"
          >
            <motion.div 
              layoutId={selectedProgram.id}
              className="bg-white w-full max-w-2xl rounded-[3rem] overflow-hidden relative shadow-2xl"
            >
              <button 
                onClick={() => setSelectedProgram(null)}
                className="absolute top-8 right-8 z-10 p-2 bg-white/20 hover:bg-white/40 text-white rounded-full transition-colors"
              >
                <IoCloseOutline size={28} />
              </button>
              
              <div className={`h-48 ${selectedProgram.color} flex items-end p-12`}>
                <div>
                  <p className="text-white/60 text-xs font-black uppercase tracking-widest mb-2">{selectedProgram.category}</p>
                  <h3 className="text-4xl font-black text-white leading-none">{selectedProgram.title}</h3>
                </div>
              </div>
              
              <div className="p-12">
                <p className="text-slate-600 text-lg leading-relaxed mb-10">
                  {selectedProgram.fullDesc}
                </p>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-slate-50 p-6 rounded-3xl">
                    <p className="text-[10px] font-black text-slate-400 uppercase mb-1">Availability</p>
                    <p className="text-slate-900 font-bold">{selectedProgram.stats}</p>
                  </div>
                  <button className="bg-slate-900 text-white rounded-3xl font-black text-xs uppercase tracking-widest hover:bg-blue-600 transition-colors">
                    Partner With Us
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

export default Programs;