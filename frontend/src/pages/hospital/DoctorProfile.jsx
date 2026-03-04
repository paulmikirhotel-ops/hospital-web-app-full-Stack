import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { 
  IoShieldCheckmark, IoRibbonOutline, IoArrowBackOutline, 
  IoChevronForwardOutline, IoEllipse 
} from 'react-icons/io5';

// 🚀 Use your centralized API instance
import API from '../../api/axiosConfig';

const DoctorProfile = () => {
  const { docId } = useParams(); 
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  
  const [doctor, setDoctor] = useState(null);
  const [doctorBlogs, setDoctorBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDoctorAndBlogs = async () => {
      try {
        setLoading(true);
        
        // 1. Fetch Doctor Data
        const docRes = await API.get(`/doctors/${docId}`);
        const doctorData = docRes.data;
        setDoctor(doctorData);

        // 2. Fetch Blogs 
        const blogRes = await API.get('/blogs');
        const allBlogs = blogRes.data;
        
        // Match blog author with the doctor's linked User ID
        const filteredBlogs = allBlogs.filter(blog => {
            const authorId = blog.author?._id || blog.author;
            // Use .toString() to ensure ID matching works regardless of type
            return authorId?.toString() === doctorData.userId?.toString();
        });
        
        setDoctorBlogs(filteredBlogs.slice(0, 2));

      } catch (err) {
        console.error("Profile Fetch Error:", err);
      } finally {
        setTimeout(() => setLoading(false), 500);
      }
    };

    if (docId) fetchDoctorAndBlogs();
  }, [docId]);

  const handleBooking = () => {
    if (!user) {
      // If not logged in, send to login but remember this doctor's page
      navigate('/login', { state: { from: `/doctor/${docId}` } });
    } else {
      navigate(`/appointment/${docId}`);
    }
  };

  if (loading) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white">
      <div className="relative flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-blue-50 border-t-blue-600 rounded-full animate-spin"></div>
        <div className="absolute text-blue-600 animate-pulse text-xl">✚</div>
      </div>
      <p className="mt-4 font-black text-slate-400 tracking-[0.3em] uppercase text-[10px]">Synchronizing Records...</p>
    </div>
  );

  if (!doctor) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 p-6">
      <div className="max-w-md w-full bg-white p-12 rounded-[3rem] shadow-xl text-center border border-slate-100">
        <div className="w-20 h-20 bg-red-50 text-red-500 rounded-3xl flex items-center justify-center mx-auto mb-6">
            <IoShieldCheckmark size={32} />
        </div>
        <h2 className="text-xl font-black text-slate-900 mb-2">Profile Not Found</h2>
        <p className="text-slate-400 font-medium mb-8">The medical specialist record you are looking for does not exist or has been moved.</p>
        <button onClick={() => navigate('/doctors')} className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-blue-600 transition-all">
          Return to Directory
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 md:px-8">
      <div className="max-w-6xl mx-auto">
        
        {/* Navigation */}
        <button 
          onClick={() => navigate('/doctors')}
          className="flex items-center gap-2 text-slate-400 font-black text-[10px] uppercase tracking-widest hover:text-blue-600 transition-all mb-10 group"
        >
          <IoArrowBackOutline size={16} className="group-hover:-translate-x-1 transition-transform" /> Back to Specialists
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          
          {/* --- LEFT SIDEBAR --- */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }}
            className="lg:col-span-1"
          >
            <div className="bg-white p-4 rounded-[3.5rem] shadow-2xl shadow-blue-100/20 sticky top-28 border border-slate-100">
              <div className="relative overflow-hidden rounded-[2.8rem] bg-slate-100 mb-6">
                <img 
                  src={doctor.image || 'https://via.placeholder.com/400x500'} 
                  alt={doctor.name} 
                  className="w-full h-[480px] object-cover"
                />
              </div>
              
              <div className="px-4 pb-4 space-y-4">
                <div className="flex items-center justify-between py-4 border-b border-slate-50">
                  <span className="text-slate-400 font-black text-[10px] uppercase tracking-widest">Consultation Fee</span>
                  <span className="text-blue-600 font-black text-2xl">${doctor.fee}</span>
                </div>
                
                <div className={`flex items-center gap-4 p-5 rounded-[2rem] transition-all ${doctor.available ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-50 text-slate-400'}`}>
                  <div className={`w-3 h-3 rounded-full ${doctor.available ? 'bg-emerald-500 animate-pulse' : 'bg-slate-300'}`} />
                  <div>
                    <p className="text-[11px] font-black uppercase tracking-tight leading-none">
                        {doctor.available ? 'Available Today' : 'At Capacity'}
                    </p>
                    <p className="text-[9px] font-bold uppercase opacity-60 mt-1">Status: {doctor.available ? 'Online' : 'Offline'}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 p-5 bg-blue-50 rounded-[2rem] border border-blue-100/50">
                  <div className="w-10 h-10 bg-white rounded-2xl flex items-center justify-center text-blue-600 shadow-sm">
                    <IoShieldCheckmark size={20} />
                  </div>
                  <div>
                    <p className="text-[11px] font-black text-blue-900 uppercase leading-none">Verified Specialist</p>
                    <p className="text-[9px] text-blue-600/60 font-black uppercase mt-1">Board Certified</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* --- RIGHT CONTENT --- */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }} 
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-2 space-y-8"
          >
            {/* Header Card */}
            <div className="bg-white p-12 rounded-[4rem] border border-slate-100 shadow-sm relative overflow-hidden">
               <div className="absolute -top-10 -right-10 w-40 h-40 bg-blue-50 rounded-full opacity-50 blur-3xl" />
              <div className="flex flex-wrap items-center gap-3 mb-6">
                <span className="bg-blue-600 text-white px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-widest">
                  {doctor.specialization}
                </span>
                <span className="text-slate-300 font-black text-[10px] uppercase tracking-widest border-l border-slate-100 pl-4">
                   {doctor.experience} Years Experience
                </span>
              </div>
              <h1 className="text-5xl md:text-6xl font-black text-slate-900 mb-3 tracking-tighter">Dr. {doctor.name}</h1>
              <p className="text-xl font-bold text-blue-600/50 italic">{doctor.qualification}</p>
            </div>

            {/* Clinical Bio */}
            <div className="bg-white p-12 rounded-[4rem] shadow-sm border border-slate-100">
              <h3 className="text-[11px] font-black text-slate-900 uppercase tracking-[0.4em] mb-8 flex items-center gap-4">
                <div className="w-10 h-[2px] bg-blue-600"></div> Clinical Background
              </h3>
              <p className="text-slate-500 leading-relaxed font-medium text-lg">
                {doctor.about || "Dedicated to providing comprehensive medical excellence and personalized patient-centered care."}
              </p>
            </div>

            {/* Publication Grid */}
            <div className="bg-white p-12 rounded-[4rem] shadow-sm border border-slate-100">
              <div className="flex justify-between items-end mb-10">
                <h3 className="text-[11px] font-black text-slate-900 uppercase tracking-[0.4em] flex items-center gap-4">
                   <div className="w-10 h-[2px] bg-blue-600"></div> Research & Insights
                </h3>
                <button onClick={() => navigate('/blogs')} className="text-[10px] font-black text-blue-600 uppercase tracking-widest hover:text-slate-900 transition-all">View All Articles</button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {doctorBlogs.length > 0 ? doctorBlogs.map((blog) => (
                  <div 
                    key={blog._id} 
                    onClick={() => navigate(`/blog/${blog._id}`)}
                    className="group cursor-pointer p-8 rounded-[3rem] bg-slate-50 border border-slate-100 hover:bg-slate-900 transition-all duration-500 hover:-translate-y-2"
                  >
                    <p className="text-[10px] font-black text-blue-600 group-hover:text-blue-400 uppercase tracking-widest mb-3">{blog.category}</p>
                    <h4 className="text-xl font-black text-slate-900 group-hover:text-white leading-tight">
                      {blog.title}
                    </h4>
                    <div className="flex items-center gap-2 mt-6 text-slate-300 group-hover:text-white transition-all">
                       <span className="text-[9px] font-black uppercase tracking-widest">Read Article</span>
                       <IoChevronForwardOutline size={14} className="group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                )) : (
                  <div className="col-span-2 py-12 text-center bg-slate-50 rounded-[3rem] border-2 border-dashed border-slate-200">
                    <IoMedkitOutline size={32} className="text-slate-200 mx-auto mb-4" />
                    <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest">No Recent Publications</p>
                  </div>
                )}
              </div>
            </div>

            {/* Booking CTA */}
            <div className="bg-slate-900 p-12 rounded-[4rem] text-white shadow-2xl shadow-blue-900/20 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/10 rounded-full -mr-20 -mt-20 blur-3xl" />
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-10 relative z-10">
                <div className="space-y-2">
                  <h3 className="text-3xl font-black uppercase tracking-tighter">Ready to Consult?</h3>
                  <p className="text-slate-400 text-sm font-medium max-w-sm">Secure your priority slot for a clinical evaluation with Dr. {doctor.name.split(' ').pop()}.</p>
                </div>
                
                <button 
                  onClick={handleBooking}
                  className="px-12 py-6 bg-blue-600 text-white font-black rounded-[2rem] hover:bg-white hover:text-slate-900 transition-all uppercase tracking-widest text-[11px] shadow-xl group active:scale-95"
                >
                  <span className="flex items-center gap-2">
                    {user ? "Confirm Booking" : "Login to Book"}
                    <IoChevronForwardOutline className="group-hover:translate-x-1 transition-transform" />
                  </span>
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default DoctorProfile;