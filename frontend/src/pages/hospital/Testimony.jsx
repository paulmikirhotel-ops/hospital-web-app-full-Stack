import React from 'react';
import { motion } from 'framer-motion';
// Fixed: Using RiDoubleQuotesR from Remix Icons for the big quote
import { RiDoubleQuotesR } from 'react-icons/ri'; 
import { IoStar, IoHeart, IoPersonCircleOutline, IoChatbubbleEllipsesOutline } from 'react-icons/io5';

const testimonies = [
  {
    id: 1,
    name: "Emmanuel Flomo",
    role: "Maternity Ward Patient",
    text: "The care I received at Saint Joseph's during the birth of my son was exceptional. The midwives were patient and professional.",
    rating: 5,
    date: "Jan 2026"
  },
  {
    id: 2,
    name: "Sarah Kamara",
    role: "Surgical Recovery",
    text: "I was nervous about my procedure, but the doctors explained everything clearly. The recovery facilities are clean and attentive.",
    rating: 5,
    date: "Feb 2026"
  },
  {
    id: 3,
    name: "Jefferson Doe",
    role: "Outpatient Clinic",
    text: "Affordable and fast. The new digital portal made booking my follow-up appointment so easy. Truly modern care for Liberia.",
    rating: 5,
    date: "Dec 2025"
  }
];

const Testimony = () => {
  return (
    <div className="pt-32 pb-20 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        
        {/* Header Section */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 mb-6 rounded-full bg-blue-100 border border-blue-200"
          >
            <IoHeart className="text-blue-600" />
            <span className="text-[10px] font-black uppercase tracking-widest text-blue-700">Patient Voices</span>
          </motion.div>
          <h1 className="text-4xl lg:text-5xl font-black text-slate-900 mb-6">
            Real Stories, <span className="text-blue-600 uppercase">Real Healing.</span>
          </h1>
          <p className="text-lg text-slate-500 font-medium">
            Join the thousands of Liberians who have trusted Saint Joseph's Catholic Hospital for over 60 years.
          </p>
        </div>

        {/* Featured Quote with Fixed Icon */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative bg-blue-600 rounded-[3rem] p-8 lg:p-16 text-white mb-20 overflow-hidden shadow-2xl shadow-blue-200"
        >
          {/* Using RiDoubleQuotesR - very stable export */}
          <RiDoubleQuotesR className="absolute top-0 right-0 text-white/10 text-[15rem] -translate-y-12 translate-x-12" />
          
          <div className="relative z-10 max-w-4xl">
            <p className="text-2xl lg:text-3xl font-medium leading-relaxed mb-8">
              "Saint Joseph's isn't just a hospital; it's a sanctuary. The Brothers and the staff treat you with a dignity that heals the soul as much as the body."
            </p>
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-blue-400 border-2 border-white/20 flex items-center justify-center">
                <IoPersonCircleOutline size={40} />
              </div>
              <div>
                <h4 className="font-black text-lg">Marie Taylor</h4>
                <p className="text-blue-200 text-sm font-bold uppercase tracking-wider">Patient since 2018</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Testimony Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonies.map((item, idx) => (
            <motion.div 
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-500"
            >
              <div className="flex gap-1 mb-6">
                {[...Array(item.rating)].map((_, i) => (
                  <IoStar key={i} className="text-yellow-400" />
                ))}
              </div>
              <p className="text-slate-600 font-medium leading-relaxed mb-8 italic">
                "{item.text}"
              </p>
              <div className="flex items-center gap-4 border-t border-slate-50 pt-6">
                <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 font-black text-xs">
                  {item.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div className="flex-grow">
                  <h5 className="font-black text-slate-900 text-sm">{item.name}</h5>
                  <p className="text-[10px] font-bold text-blue-500 uppercase">{item.role}</p>
                </div>
                <IoChatbubbleEllipsesOutline className="text-slate-200" size={20} />
              </div>
            </motion.div>
          ))}
        </div>

        {/* Action Card */}
        <div className="mt-20 bg-blue-900 rounded-[3rem] p-12 text-center text-white relative overflow-hidden">
          <div className="relative z-10">
            <h3 className="text-2xl font-black mb-4 uppercase tracking-tight">Your health is our pride</h3>
            <p className="text-blue-200 mb-8 max-w-md mx-auto">Help us inspire others by sharing your journey of recovery at Saint Joseph's.</p>
            <button className="px-10 py-4 bg-white text-blue-900 font-black rounded-2xl hover:bg-blue-50 transition-all uppercase text-sm tracking-widest shadow-xl">
              Submit Testimony
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Testimony;