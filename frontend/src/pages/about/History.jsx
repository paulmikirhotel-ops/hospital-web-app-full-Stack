import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  IoMedkitOutline, IoShieldCheckmarkOutline, IoGlobeOutline, 
  IoRibbonOutline, IoFitnessOutline, IoHeartOutline,
  IoChevronDownOutline, IoReaderOutline, IoOpenOutline
} from 'react-icons/io5';

const History = () => {
  const [isExpanded, setIsExpanded] = useState(false);

  const timelineData = [
    {
      year: "1956",
      title: "The Visionary Request",
      content: "During a state visit to Rome, President William V.S. Tubman requested Pope Pius XII for the Catholic Church to establish a hospital and medical teaching school in Liberia for the benefit of the sick and needy.",
      icon: <IoGlobeOutline />,
    },
    {
      year: "1963",
      title: "The Citadel Opening",
      content: "Opened on August 23rd, 1963. President Tubman dedicated it as a 'Citadel waging war against the enemy of our commonality—Death.' Built on land donated by Mrs. M. Eva McGill Hilton.",
      icon: <IoMedkitOutline />,
    },
    {
      year: "1990s",
      title: "The Civil War Test",
      content: "At the peak of the war, the hospital relocated to Gbarnga for safety. It famously served as a place of refuge for victims of the Lutheran Church Massacre under the support of Archbishop Michael K. Francis.",
      icon: <IoShieldCheckmarkOutline />,
    },
    {
      year: "2014",
      title: "The Ebola Sacrifice",
      content: "Nine staffers lost their lives serving humanity during the outbreak. These brothers and sisters from Liberia, Ghana, Cameroon, Equatorial Guinea, and Spain are remembered as heroes.",
      icon: <IoRibbonOutline />,
    },
    {
      year: "2019",
      title: "Defeating COVID-19",
      content: "Unlike 2014, a prepared staff stood firm. Through a robust triaging system and partners like CRS, the hospital defeated the virus with no lives lost.",
      icon: <IoFitnessOutline />,
    }
  ];

  return (
    <div className="bg-white min-h-screen pb-20 overflow-hidden">
      
      {/* --- PREMIUM HERO SECTION --- */}
      <section className="relative h-[90vh] flex items-center justify-center overflow-hidden">
        <motion.div 
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 10, repeat: Infinity, repeatType: "reverse" }}
          className="absolute inset-0 z-0"
        >
          <img 
            src="https://images.ctfassets.net/jwk3944w4k64/3GLL9aLkmNoL49nOF2H1M4/d5f5abb6ec19845a5e125719d85fdfd7/About_Us.jpg" 
            alt="SJCH Building" 
            className="w-full h-full object-cover shadow-inner"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-slate-900/80 via-slate-900/40 to-white" />
        </motion.div>

        <div className="container mx-auto px-6 relative z-10 text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-6xl lg:text-[10rem] font-black text-white tracking-tighter leading-[0.8] mb-8"
          >
            HISTORY OF <br />
            <span className="text-blue-400">EXCELLENCE</span>
          </motion.h1>

          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="flex flex-col items-center gap-4"
          >
            <p className="text-white/80 font-bold uppercase tracking-[0.5em] text-xs">Monrovia, Liberia • Est. 1963</p>
            <div className="h-20 w-px bg-gradient-to-b from-blue-500 to-transparent" />
          </motion.div>
        </div>
      </section>

      {/* --- THE FULL STORY (READ MORE SECTION) --- */}
      <section className="container mx-auto px-6 -mt-32 relative z-20">
        <div className="max-w-5xl mx-auto bg-white rounded-[3rem] shadow-2xl shadow-blue-900/10 border border-slate-100 p-8 lg:p-16">
          <div className="flex justify-between items-start mb-10">
            <div>
              <h2 className="text-4xl font-black text-slate-900 mb-2">Brief History & Background</h2>
              <div className="h-1.5 w-20 bg-blue-600 rounded-full" />
            </div>
            {/* CLICKABLE SOURCE LINK */}
            <a 
              href="https://www.sjchmonrovialiberia.com/about" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 bg-slate-50 text-slate-500 rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-blue-50 hover:text-blue-600 transition-all border border-slate-100"
            >
              Verified Source <IoOpenOutline size={14}/>
            </a>
          </div>

          <div className="prose prose-slate max-w-none">
            <p className="text-xl text-slate-600 leading-relaxed font-medium mb-6">
              The St. Joseph’s Catholic Hospital has provided high-quality and compassionate healthcare services to the people of Liberia for 60 years now as it opened its doors to the public on the 23rd August, 1963...
            </p>

            <AnimatePresence>
              {isExpanded && (
                <motion.div 
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden space-y-6 text-slate-600 leading-loose"
                >
                  <p>In 1956, during a state visit to Rome, the late President William V.S. Tubman, made a request that the Holy Father Pope Pius XII, grant permission for the Catholic Church to establish a hospital and medical teaching school in the country...</p>
                  
                  <p>The Hospital was dedicated to humanity as Late President Tubman made an appeal: <span className="text-blue-600 font-bold italic">"this hospital should be citadel waging war against the enemy of our commonality-Death."</span></p>
                  
                  <p>The Liberian Civil War was a test to his words. At the peak of the war, the hospital had to relocate all patients and some staffers to Phebe Hospital in Gbarnga at Bong County for safety. In the midst of the fierce battle, the Late Archbishop Michael K. Francis supported the hospital to care for all victims of the Lutheran Church Massacre.</p>
                  
                  <div className="grid md:grid-cols-2 gap-8 my-10">
                    <div className="p-8 bg-red-50 rounded-3xl border border-red-100">
                      <h4 className="text-red-600 font-black uppercase text-xs mb-3">2014 Ebola Outbreak</h4>
                      <p className="text-sm">Took away the lives of nine (9) able staffers while seven (7) others were contaminated but gracefully recovered. These nine staffers were Liberian, Ghanaian, Cameroonian, Equatorial Guinean and Spanish Nationals.</p>
                    </div>
                    <div className="p-8 bg-green-50 rounded-3xl border border-green-100">
                      <h4 className="text-green-600 font-black uppercase text-xs mb-3">2019 Covid-19</h4>
                      <p className="text-sm">Met a well prepared staff who solidly stood to their feet and defeated it. Through the resilience of the staffers and support of partners like CRS, NCHC, and God's grace, no life was lost.</p>
                    </div>
                  </div>

                  <p>Over the years, the hospital has encountered many challenges that could have crippled her operations but through the hardworking effort of staffers, donors, the Government, and the Catholic Church of Liberia, it has always remained opened in serving humanity.</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <button 
            onClick={() => setIsExpanded(!isExpanded)}
            className="mt-8 flex items-center gap-2 px-8 py-4 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:bg-blue-600 transition-all shadow-xl shadow-slate-200"
          >
            <IoReaderOutline size={18}/>
            {isExpanded ? "Show Less" : "Read Full Background"}
          </button>
        </div>
      </section>

      {/* --- TIMELINE SECTION --- */}
      <section className="py-32 container mx-auto px-6 relative">
        <div className="absolute left-1/2 top-0 bottom-0 w-px bg-slate-100 hidden lg:block" />
        <div className="space-y-32">
          {timelineData.map((item, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className={`flex flex-col lg:flex-row items-center gap-12 ${idx % 2 !== 0 ? 'lg:flex-row-reverse' : ''}`}
            >
              <div className="flex-1 text-center lg:text-left">
                <div className="inline-block px-6 py-2 rounded-full bg-blue-50 text-blue-600 font-black text-sm mb-6">
                  {item.year}
                </div>
                <h3 className="text-3xl font-black text-slate-900 mb-4 tracking-tight">{item.title}</h3>
                <p className="text-slate-500 font-medium leading-relaxed">{item.content}</p>
              </div>

              <div className="relative z-10 w-24 h-24 rounded-[2.5rem] bg-white border-4 border-slate-50 flex items-center justify-center text-4xl text-blue-600 shadow-xl">
                {item.icon}
              </div>

              <div className="flex-1 hidden lg:block" />
            </motion.div>
          ))}
        </div>
      </section>

      {/* --- FOOTER CTA --- */}
      <section className="container mx-auto px-6 mb-20">
        <div className="bg-blue-600 rounded-[4rem] p-12 lg:p-24 text-center text-white relative overflow-hidden shadow-2xl shadow-blue-200">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-20 -mt-20 blur-3xl" />
          <h2 className="text-3xl lg:text-5xl font-black mb-8">Continuing the warfare <br/> against death.</h2>
          <button 
             onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})}
             className="px-10 py-4 bg-white text-blue-600 rounded-full font-black text-xs uppercase tracking-widest hover:bg-slate-900 hover:text-white transition-all"
          >
            Back to Top
          </button>
        </div>
      </section>
    </div>
  );
};

export default History;