import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import { motion } from 'framer-motion';
import { 
  IoArrowForward, 
  IoShieldCheckmark, 
  IoSearchOutline, 
  IoFlashOutline 
} from 'react-icons/io5';

import 'swiper/css';
import 'swiper/css/pagination';

import Img1 from '../assets/hero-carousel/image1.jpg';
import Img2 from '../assets/hero-carousel/image2.jpg';
import Img3 from '../assets/hero-carousel/image3.jpg';
import Img4 from '../assets/hero-carousel/image4.jpg';
import Img5 from '../assets/hero-carousel/image5.jpg';
import Img6 from '../assets/hero-carousel/image6.jpg';

const images = [Img1, Img2, Img3, Img4, Img5, Img6];

const Hero = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [query, setQuery] = useState('');
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth) || {};

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      navigate('/services', { state: { initialSearch: query } });
    }
  };

  const quickSearches = ["Maternity", "Surgery", "Emergency", "Laboratory"];

  return (
    <section className="relative min-h-screen pt-28 pb-16 bg-white overflow-hidden">
      {/* Visual background accent */}
      <div className="absolute top-0 right-0 w-1/4 h-full bg-slate-50 -z-10 hidden lg:block" />
      
      <div className="container mx-auto px-6 lg:px-8 flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
        
        {/* --- Content Column --- */}
        <div className="w-full lg:w-1/2 text-left z-10">
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-3 py-1 mb-6 rounded-full bg-blue-50 border border-blue-100"
          >
            <IoShieldCheckmark className="text-blue-600 text-sm" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-blue-600">
              Serving Liberia since 1963
            </span>
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-2xl md:text-3xl lg:text-4xl font-black text-slate-900 leading-tight mb-6"
          >
            Expert Care at <br />
            <span className="text-blue-600 uppercase tracking-tighter">
              Saint Joseph's Catholic Hospital
            </span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-base lg:text-lg text-slate-600 font-medium leading-relaxed mb-8 max-w-xl"
          >
            Our mission is to provide holistic, affordable, quality health services to all people in Liberia and the world at large. <br />
            <span className="font-bold text-slate-900 mt-2 block italic text-blue-600">Your Life is Precious to Us!</span>
          </motion.p>

          {/* --- SEARCH BAR --- */}
          <motion.form 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            onSubmit={handleSearch}
            className="relative max-w-xl group mb-4"
          >
            <div className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors">
              <IoSearchOutline size={22} />
            </div>
            <input 
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search for services or departments..."
              className="w-full pl-14 pr-36 py-5 bg-slate-50 border border-slate-100 rounded-[2rem] font-bold text-slate-700 outline-none focus:ring-4 focus:ring-blue-100 focus:bg-white transition-all shadow-sm"
            />
            <button 
              type="submit"
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-slate-900 text-white px-6 py-3.5 rounded-[1.5rem] font-black text-[10px] uppercase tracking-widest hover:bg-blue-600 transition-all flex items-center gap-2"
            >
              Find Now <IoArrowForward />
            </button>
          </motion.form>

          {/* --- POPULAR TAGS --- */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="flex flex-wrap items-center gap-2 mb-10"
          >
            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest mr-2 flex items-center gap-1">
              <IoFlashOutline className="text-orange-500" /> Popular:
            </span>
            {quickSearches.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => navigate('/services', { state: { initialSearch: item } })}
                className="text-[10px] font-bold text-slate-500 bg-slate-100 px-3 py-1 rounded-full hover:bg-blue-600 hover:text-white transition-all"
              >
                {item}
              </button>
            ))}
          </motion.div>

          <div className="flex flex-wrap gap-4">
            <Link 
              to={user ? "/dashboard" : "/register"} 
              className="px-10 py-5 bg-slate-900 text-white font-black text-[10px] uppercase tracking-widest rounded-2xl hover:bg-blue-600 transition-all duration-300 shadow-xl shadow-slate-200 flex items-center gap-3"
            >
              {user ? "Enter Patient Portal" : "Register as Patient"} <IoArrowForward />
            </Link>
          </div>
        </div>

        {/* --- Sliding Carousel --- */}
        <div className="w-full lg:w-1/2 relative h-[450px] lg:h-[600px]">
          <div className="relative h-full w-full p-2 bg-white rounded-[3rem] shadow-2xl border border-slate-100 overflow-hidden">
            <Swiper
              modules={[Autoplay, Pagination]}
              spaceBetween={0} 
              slidesPerView={1}
              speed={1000}
              loop={true}
              autoplay={{ delay: 5000, disableOnInteraction: false }}
              onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)}
              className="h-full w-full rounded-[2.5rem] overflow-hidden"
            >
              {images.map((img, index) => (
                <SwiperSlide key={index}>
                  <img src={img} className="w-full h-full object-cover" alt="Saint Joseph's Catholic Hospital Clinical Facility" />
                </SwiperSlide>
              ))}
            </Swiper>
            
            <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 flex gap-2 px-5 py-3 bg-white/10 backdrop-blur-xl rounded-full border border-white/20">
              {images.map((_, index) => (
                <div key={index} className="relative w-8 h-1.5 bg-white/20 rounded-full">
                  {activeIndex === index && (
                    <motion.div
                      layoutId="active-pill"
                      className="absolute inset-0 bg-white rounded-full shadow-lg"
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;