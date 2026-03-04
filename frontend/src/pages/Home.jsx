import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { 
  IoMedkitOutline, IoPeopleOutline, IoTimerOutline, 
  IoPulseOutline, IoArrowForwardOutline, IoCalendarOutline,
  IoCallOutline, IoLocationOutline, IoTimeOutline
} from 'react-icons/io5';
import Hero from '../components/Hero';

const Home = () => {
  const navigate = useNavigate();
  const [latestBlogs, setLatestBlogs] = useState([]);
  const [liveServices, setLiveServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [blogRes, serviceRes] = await Promise.all([
          axios.get('http://localhost:5001/api/blogs'),
          axios.get('http://localhost:5001/api/services/list')
        ]);

        if (blogRes.data && blogRes.data.posts) {
          setLatestBlogs(blogRes.data.posts.slice(0, 3));
        } else if (Array.isArray(blogRes.data)) {
          setLatestBlogs(blogRes.data.slice(0, 3));
        }

        if (serviceRes.data && serviceRes.data.success) {
          const services = serviceRes.data.services || [];
          const active = services.filter(s => s.isAvailable !== false).slice(0, 4);
          setLiveServices(active);
        }
      } catch (err) {
        console.error("Home Data Fetch Error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const stats = [
    { label: 'Years of Service', value: '60+', icon: <IoTimerOutline /> },
    { label: 'Specialized Doctors', value: '45+', icon: <IoPeopleOutline /> },
    { label: 'Successful Procedures', value: '12k+', icon: <IoMedkitOutline /> },
    { label: 'Hospital Beds', value: '150+', icon: <IoPulseOutline /> },
  ];

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 animate-pulse">Synchronizing Clinical Systems...</p>
      </div>
    </div>
  );

  return (
    <div className="bg-slate-50 min-h-screen pt-24 pb-12 font-sans">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-12">
        <div className="bg-white rounded-[3rem] shadow-sm overflow-hidden border border-slate-200/60">
          
          {/* HERO SECTION */}
          <div className="relative overflow-hidden">
            <Hero />
          </div>

          {/* CONTACT STRIP */}
          <section className="bg-slate-900 text-white py-6 px-12 flex flex-wrap justify-center lg:justify-between gap-8 items-center border-b border-white/5">
            <ContactInfo icon={<IoCallOutline />} label="Emergency Line" value="+231 770 000 000" />
            <div className="hidden lg:block w-px h-8 bg-white/10" />
            <ContactInfo icon={<IoTimeOutline />} label="Opening Hours" value="Open 24/7 (Emergency)" />
            <div className="hidden lg:block w-px h-8 bg-white/10" />
            <ContactInfo icon={<IoLocationOutline />} label="Location" value="Old Road, Congo Town" />
          </section>

          {/* STATS SECTION */}
          <section className="relative z-20 -mt-10 px-6 lg:px-12">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-8 bg-white p-10 rounded-[2.5rem] shadow-2xl shadow-blue-900/10 border border-blue-50/50">
              {stats.map((stat, idx) => (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }} 
                  whileInView={{ opacity: 1, y: 0 }} 
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  key={idx} 
                  className="flex flex-col items-center text-center"
                >
                  <div className="text-2xl text-blue-600 mb-2">{stat.icon}</div>
                  <h3 className="text-3xl font-black text-slate-900">{stat.value}</h3>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">{stat.label}</p>
                </motion.div>
              ))}
            </div>
          </section>

          {/* DEPARTMENTS SECTION */}
          <section className="py-24 px-6 lg:px-16">
            <div className="flex flex-col lg:flex-row justify-between items-end mb-16 gap-6">
              <div className="max-w-xl text-center lg:text-left">
                <h2 className="text-xs font-black text-blue-600 uppercase tracking-[0.3em] mb-4">Core Units</h2>
                <h3 className="text-4xl lg:text-5xl font-black text-slate-900 leading-tight tracking-tighter">
                  Specialized Medical <br /> Departments
                </h3>
              </div>
              <button onClick={() => navigate('/services')} className="group flex items-center gap-3 px-8 py-4 bg-slate-900 text-white rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-blue-600 transition-all">
                All Departments <IoArrowForwardOutline className="group-hover:translate-x-1 transition-transform"/>
              </button>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <AnimatePresence>
                {liveServices.length > 0 ? liveServices.map((service, idx) => (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    whileHover={{ y: -10 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.1 }}
                    key={service._id} 
                    className="p-8 rounded-[3rem] bg-slate-50/40 border border-slate-100 hover:border-blue-200 hover:bg-white hover:shadow-2xl hover:shadow-blue-200/20 transition-all group cursor-pointer flex flex-col h-full"
                    onClick={() => navigate(`/services/${service._id}`)}
                  >
                    <div className="w-16 h-16 rounded-2xl bg-white shadow-md flex items-center justify-center p-3 mb-8 group-hover:bg-blue-600 transition-all duration-500">
                      <img src={service.image} className="w-full h-full object-contain group-hover:brightness-0 group-hover:invert transition-all" alt=""/>
                    </div>
                    <div className="flex-grow">
                        <h4 className="text-xl font-black text-slate-900 mb-3 group-hover:text-blue-600 transition-colors">{service.title}</h4>
                        <p className="text-sm text-slate-500 font-medium leading-relaxed line-clamp-3 italic">"{service.description}"</p>
                    </div>
                  </motion.div>
                )) : (
                  <div className="col-span-full py-12 text-center text-slate-300 font-bold uppercase text-xs tracking-widest">
                    No Active Departments Currently Listed
                  </div>
                )}
              </AnimatePresence>
            </div>
          </section>

          {/* MEDICAL JOURNAL SECTION */}
          <section className="bg-blue-600 py-24 px-6 lg:px-16 rounded-t-[4rem] relative overflow-hidden">
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-white/5 rounded-full -mr-32 -mt-32 blur-3xl" />
            
            <div className="flex items-center justify-between mb-12 relative z-10">
              <div>
                <h2 className="text-xs font-black text-blue-100 uppercase tracking-[0.3em] mb-4">Medical Journal</h2>
                <h3 className="text-4xl font-black text-white tracking-tighter italic">Clinical Insights</h3>
              </div>
              <button onClick={() => navigate('/blog')} className="px-6 py-3 bg-white/10 hover:bg-white text-white hover:text-blue-600 rounded-xl border border-white/20 text-[10px] font-black uppercase tracking-widest transition-all">
                Read All Posts
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
              {latestBlogs.length > 0 ? latestBlogs.map((blog, idx) => (
                <motion.article 
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  key={blog._id} 
                  className="group bg-white rounded-[2.5rem] p-4 cursor-pointer hover:shadow-2xl transition-all" 
                  onClick={() => navigate(`/blog/${blog._id}`)}
                >
                  <div className="relative aspect-video rounded-[2rem] overflow-hidden mb-6 bg-slate-100">
                    <img src={blog.coverImg} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt={blog.title}/>
                  </div>
                  <div className="px-4 pb-4">
                    <div className="flex items-center gap-3 text-[9px] font-black text-slate-400 uppercase tracking-widest mb-3">
                      <span className="text-blue-600">{blog.category}</span>
                      <span>•</span>
                      <span className="flex items-center gap-1"><IoCalendarOutline /> {new Date(blog.createdAt).toLocaleDateString()}</span>
                    </div>
                    <h4 className="text-xl font-black text-slate-900 group-hover:text-blue-600 transition-colors leading-tight line-clamp-2">
                      {blog.title}
                    </h4>
                  </div>
                </motion.article>
              )) : (
                <div className="col-span-full py-12 text-center text-blue-100/50 font-bold uppercase text-xs tracking-widest">
                  Loading Journal Entries...
                </div>
              )}
            </div>
          </section>

          {/* FOOTER STRIP */}
          <footer className="py-8 text-center border-t border-slate-100 bg-white">
            <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.4em]">
              Saint Joseph's Catholic Hospital Portal © 2026
            </p>
          </footer>
        </div>
      </div>
    </div>
  );
};

const ContactInfo = ({ icon, label, value }) => (
  <div className="flex items-center gap-3">
    <div className="w-10 h-10 rounded-full bg-blue-600/20 flex items-center justify-center text-blue-400">
      {icon}
    </div>
    <div>
      <p className="text-[9px] uppercase font-black tracking-widest text-slate-500">{label}</p>
      <p className="text-sm font-bold">{value}</p>
    </div>
  </div>
);

export default Home;