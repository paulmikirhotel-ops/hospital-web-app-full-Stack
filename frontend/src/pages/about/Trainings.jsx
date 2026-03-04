import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  IoSchoolOutline, IoRibbonOutline, IoFlaskOutline, 
  IoPeopleOutline, IoArrowForwardOutline, IoCheckmarkCircle,
  IoReaderOutline, IoStatsChartOutline, IoCloseOutline
} from 'react-icons/io5';

const Trainings = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedProgram, setSelectedProgram] = useState(null);

  const trainingPrograms = [
    {
      id: 1,
      title: "Medical Internships",
      category: "Professional Development",
      description: "Hands-on clinical rotations for medical students and graduates, providing exposure to diverse pathologies in a mission-driven environment.",
      details: "Our internship program is accredited and follows the national curriculum, focusing on Internal Medicine, Surgery, Pediatrics, and OBGYN. Interns work alongside senior consultants in a high-volume clinical setting.",
      stats: "12 Spots Available",
      icon: <IoSchoolOutline />,
      color: "bg-blue-600"
    },
    {
      id: 2,
      title: "Nursing Excellence",
      category: "Specialized Training",
      description: "Advanced clinical training for registered nurses, focusing on critical care, maternal health, and emergency response protocols.",
      details: "This program enhances the capacity of nurses to handle specialized equipment, manage intensive care units, and implement modern patient safety protocols.",
      stats: "Last 4 Seats",
      icon: <IoRibbonOutline />,
      color: "bg-teal-500"
    },
    {
      id: 3,
      title: "Laboratory Sciences",
      category: "Technical Training",
      description: "Specialized workshops in diagnostic pathology, microbiology, and blood bank management using modern laboratory standards.",
      details: "Participants gain proficiency in automated diagnostic systems, quality control measures, and biosafety regulations in a clinical laboratory environment.",
      stats: "Registration Open",
      icon: <IoFlaskOutline />,
      color: "bg-indigo-600"
    },
    {
      id: 4,
      title: "Community Health",
      category: "Outreach Program",
      description: "Training for community health workers to bridge the gap between hospital care and rural Liberian communities.",
      details: "Focuses on preventative medicine, maternal health education, and disease surveillance at the community level.",
      stats: "Coming Soon",
      icon: <IoPeopleOutline />,
      color: "bg-orange-500"
    }
  ];

  return (
    <div className="bg-white min-h-screen font-sans">
      
      {/* --- INTERACTIVE HERO --- */}
      <section className="relative h-[80vh] flex items-center overflow-hidden bg-slate-900">
        <motion.div 
          initial={{ scale: 1.2, opacity: 0 }}
          animate={{ scale: 1, opacity: 0.4 }}
          transition={{ duration: 1.5 }}
          className="absolute inset-0"
        >
          <img 
            src="https://images.ctfassets.net/jwk3944w4k64/QgPvuGAn9OQO90yLSCfQV/256b0b91ea3137a7a1fa8de209acef28/post5-10-scaled.jpg" 
            alt="Medical Education" 
            className="w-full h-full object-cover"
          />
        </motion.div>

        <div className="container mx-auto px-6 relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl"
          >
            <h1 className="text-6xl lg:text-9xl font-black text-white leading-[0.85] tracking-tighter mb-8">
              TRAIN TO <br />
              <span className="text-blue-500">TRANSFORM.</span>
            </h1>
            <p className="text-xl text-slate-300 font-medium max-w-xl mb-10 border-l-4 border-blue-600 pl-6">
              Advancing medical knowledge at the heart of Monrovia. We don't just teach medicine; we cultivate compassion.
            </p>
          </motion.div>
        </div>
      </section>

      {/* --- READ MORE PHILOSOPHY SECTION --- */}
      <section className="container mx-auto px-6 -mt-20 relative z-20">
        <div className="bg-white rounded-[3rem] p-8 lg:p-16 shadow-2xl border border-slate-100">
          <div className="max-w-3xl">
            <h2 className="text-3xl font-black text-slate-900 mb-6">Our Educational Mission</h2>
            <p className="text-lg text-slate-600 leading-relaxed mb-4">
              Saint Joseph’s Catholic Hospital is recognized as a center of clinical excellence. We provide a rigorous training environment where academic theory meets real-world clinical challenges...
            </p>
            
            <AnimatePresence>
              {isExpanded && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden"
                >
                  <p className="text-slate-600 leading-relaxed mt-4">
                    In alignment with our 60-year heritage, our training programs focus on both technical proficiency and the ethical dimensions of healthcare. We partner with the Ministry of Health and global NGOs to ensure our curriculum remains at the cutting edge of modern medicine in West Africa.
                  </p>
                  <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center gap-3 font-bold text-slate-800"><IoCheckmarkCircle className="text-blue-600"/> Accredited Internships</div>
                    <div className="flex items-center gap-3 font-bold text-slate-800"><IoCheckmarkCircle className="text-blue-600"/> International Mentors</div>
                    <div className="flex items-center gap-3 font-bold text-slate-800"><IoCheckmarkCircle className="text-blue-600"/> Modern Clinical Labs</div>
                    <div className="flex items-center gap-3 font-bold text-slate-800"><IoCheckmarkCircle className="text-blue-600"/> Research Opportunities</div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <button 
              onClick={() => setIsExpanded(!isExpanded)}
              className="mt-8 flex items-center gap-2 text-blue-600 font-black text-xs uppercase tracking-[0.2em] group"
            >
              <IoReaderOutline size={20} />
              {isExpanded ? "Collapse Text" : "Read Full Philosophy"}
              <motion.span animate={{ x: isExpanded ? 0 : 5 }} className="ml-1">→</motion.span>
            </button>
          </div>
        </div>
      </section>

      {/* --- PROGRAM GRID WITH MODALS --- */}
      <section className="py-32 container mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
          <div>
            <span className="text-blue-600 font-black uppercase tracking-[0.3em] text-[10px]">Academic Catalog</span>
            <h2 className="text-4xl lg:text-5xl font-black text-slate-900 mt-2">Specialized Pathways</h2>
          </div>
          <p className="text-slate-500 max-w-xs text-right hidden md:block">Click on any program to view full curriculum details and requirements.</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {trainingPrograms.map((program) => (
            <motion.div 
              key={program.id}
              whileHover={{ scale: 1.02 }}
              className="relative group cursor-pointer bg-slate-50 rounded-[2.5rem] p-8 border border-transparent hover:border-blue-200 hover:bg-white transition-all"
              onClick={() => setSelectedProgram(program)}
            >
              <div className={`w-14 h-14 rounded-2xl ${program.color} text-white flex items-center justify-center text-2xl mb-6 shadow-xl`}>
                {program.icon}
              </div>
              <h3 className="text-xl font-black text-slate-900 mb-2">{program.title}</h3>
              <p className="text-slate-500 text-sm mb-6 line-clamp-3">{program.description}</p>
              
              <div className="flex items-center justify-between mt-auto">
                <span className="flex items-center gap-1 text-[10px] font-black text-blue-600 uppercase">
                  <IoStatsChartOutline /> {program.stats}
                </span>
                <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors">
                  <IoArrowForwardOutline />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* --- PROGRAM MODAL --- */}
      <AnimatePresence>
        {selectedProgram && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-slate-900/90 backdrop-blur-md"
          >
            <motion.div 
              layoutId={selectedProgram.id}
              className="bg-white w-full max-w-2xl rounded-[3rem] overflow-hidden relative"
            >
              <button 
                onClick={() => setSelectedProgram(null)}
                className="absolute top-6 right-6 p-2 bg-slate-100 rounded-full hover:bg-red-50 hover:text-red-600 transition-colors"
              >
                <IoCloseOutline size={24} />
              </button>
              
              <div className={`h-40 ${selectedProgram.color} flex items-end p-10`}>
                <div className="text-white">
                  <span className="text-xs font-bold uppercase tracking-widest opacity-80">{selectedProgram.category}</span>
                  <h3 className="text-3xl font-black">{selectedProgram.title}</h3>
                </div>
              </div>
              
              <div className="p-10">
                <h4 className="font-black text-slate-900 uppercase text-xs tracking-widest mb-4">Detailed Overview</h4>
                <p className="text-slate-600 leading-relaxed text-lg mb-8">{selectedProgram.details}</p>
                
                <div className="bg-slate-50 rounded-2xl p-6 flex justify-between items-center mb-10">
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase">Current Status</p>
                    <p className="text-blue-600 font-bold">{selectedProgram.stats}</p>
                  </div>
                  <button className="px-6 py-3 bg-slate-900 text-white rounded-xl font-black text-[10px] uppercase tracking-widest">
                    Request Syllabus
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

export default Trainings;