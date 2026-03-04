import React, { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { 
  IoWalletOutline, IoPeopleOutline, IoCalendarOutline, 
  IoMedicalOutline, IoDocumentTextOutline, IoLayersOutline,
  IoChatbubblesOutline, IoSearchOutline, IoCheckmarkCircle,
  IoArrowForwardOutline, IoTimeOutline, IoAddCircleOutline
} from 'react-icons/io5';

const AdminDashboard = () => {
  // 🚀 CRITICAL: Structured state initialization to prevent "map of undefined" crashes
  const [data, setData] = useState({
    stats: { 
      revenue: 0, totalAppointments: 0, patients: 0, 
      doctors: 0, services: 0, blogs: 0, comments: 0 
    },
    recentActivity: [],
    recentBlogs: []
  });
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchAnalysis = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:5001/api/admin/stats', { withCredentials: true });
      
      if (response.data && response.data.success) {
        setData({
          stats: response.data.stats || {},
          recentActivity: Array.isArray(response.data.recentActivity) ? response.data.recentActivity : [],
          recentBlogs: Array.isArray(response.data.recentBlogs) ? response.data.recentBlogs : []
        });
      }
    } catch (err) { 
      console.error("Dashboard Fetch Error:", err);
      toast.error("Analytics sync failed.");
    } finally { 
      setLoading(false); 
    }
  }, []);

  useEffect(() => { fetchAnalysis(); }, [fetchAnalysis]);

  const confirmPayment = async (id) => {
    try {
      const { data: res } = await axios.post(
        'http://localhost:5001/api/appointments/mark-as-paid', 
        { appointmentId: id }, 
        { withCredentials: true }
      );
      if (res.success) {
        toast.success("Transaction Verified");
        fetchAnalysis(); 
      }
    } catch (err) { toast.error("Payment update failed"); }
  };

  const filteredActivity = (data?.recentActivity || []).filter(app => 
    app.userId?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    app.doctorId?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return (
    <div className="p-20 text-center flex flex-col items-center justify-center gap-6">
      <div className="w-16 h-16 border-4 border-blue-50 border-t-blue-600 rounded-full animate-spin" />
      <p className="font-black text-[10px] tracking-[0.3em] text-slate-400 uppercase italic">Parsing Medical Intelligence...</p>
    </div>
  );

  return (
    <div className="p-4 lg:p-8 space-y-10 bg-[#FBFDFF] min-h-screen">
      
      {/* 🚀 NEW: QUICK ACTIONS BAR */}
      <div className="flex flex-wrap gap-4">
        <Link 
          to="/admin/add-doctor" 
          className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-900 transition-all shadow-lg shadow-blue-200"
        >
          <IoAddCircleOutline size={18} /> Add New Doctor
        </Link>
        <Link 
          to="/admin/post-blog" 
          className="flex items-center gap-2 px-6 py-3 bg-white text-slate-900 border border-slate-100 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-50 transition-all shadow-sm"
        >
          <IoDocumentTextOutline size={18} /> Write Blog Post
        </Link>
      </div>

      {/* TIER 1: HIGH-LEVEL ANALYTICS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard label="Total Revenue" value={`$${data.stats?.revenue || 0}`} icon={<IoWalletOutline />} color="bg-blue-600" isLive />
        <StatCard label="Live Bookings" value={data.stats?.totalAppointments || 0} icon={<IoCalendarOutline />} color="bg-slate-900" />
        <StatCard label="Total Patients" value={data.stats?.patients || 0} icon={<IoPeopleOutline />} color="bg-emerald-500" />
      </div>

      {/* TIER 2: INFRASTRUCTURE & BLOG COUNT */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <MiniCard label="Doctors" value={data.stats?.doctors || 0} icon={<IoMedicalOutline />} />
        <MiniCard label="Services" value={data.stats?.services || 0} icon={<IoLayersOutline />} />
        <MiniCard label="Blog Posts" value={data.stats?.blogs || 0} icon={<IoDocumentTextOutline />} highlight />
        <MiniCard label="Comments" value={data.stats?.comments || 0} icon={<IoChatbubblesOutline />} />
      </div>

      {/* TIER 3: OPERATIONS & CONTENT FEED */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* --- LEFT: LIVE APPOINTMENT FEED --- */}
        <div className="lg:col-span-8 bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
          <div className="p-8 border-b border-slate-50 flex flex-col md:flex-row justify-between items-center gap-4">
            <h3 className="font-black text-slate-900 uppercase text-xs tracking-widest italic">Live Operations Feed</h3>
            <div className="relative w-full md:w-64">
              <IoSearchOutline className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input 
                type="text" placeholder="Search logs..."
                className="w-full pl-10 pr-4 py-2 bg-slate-50 rounded-xl text-[10px] font-bold uppercase tracking-widest outline-none focus:ring-2 focus:ring-blue-500/10"
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <div className="divide-y divide-slate-50 max-h-[500px] overflow-y-auto custom-scrollbar">
            <AnimatePresence>
              {filteredActivity.length > 0 ? (
                filteredActivity.map((app) => (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} key={app._id} className="px-8 py-5 flex items-center justify-between hover:bg-slate-50/50 transition-all">
                    <div className="flex items-center gap-4">
                      <div className={`w-2.5 h-2.5 rounded-full ${app.payment ? 'bg-emerald-500 shadow-md shadow-emerald-100' : 'bg-amber-400 animate-pulse'}`} />
                      <div>
                        <p className="text-sm font-black text-slate-800 uppercase tracking-tighter">
                          {app.userId?.name || 'Guest'} <span className="text-slate-300 mx-1">→</span> {app.doctorId?.name || 'General'}
                        </p>
                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">{app.date} @ {app.slot}</p>
                      </div>
                    </div>
                    {!app.payment && (
                      <button onClick={() => confirmPayment(app._id)} className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl hover:bg-emerald-600 hover:text-white transition-all active:scale-90">
                        <IoCheckmarkCircle size={20} />
                      </button>
                    )}
                  </motion.div>
                ))
              ) : (
                <div className="p-20 text-center text-slate-300 italic text-xs uppercase font-bold">No operations records found.</div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* --- RIGHT: RECENT BLOG PREVIEW --- */}
        <div className="lg:col-span-4 bg-slate-900 rounded-[2.5rem] p-8 text-white shadow-xl flex flex-col">
          <div className="flex justify-between items-center mb-10">
            <h3 className="font-black uppercase text-xs tracking-widest">Recent Content</h3>
            <IoDocumentTextOutline className="text-blue-400 text-2xl" />
          </div>
          <div className="space-y-8 flex-grow">
            {Array.isArray(data?.recentBlogs) && data.recentBlogs.length > 0 ? (
              data.recentBlogs.map((blog) => (
                <div key={blog._id} className="group cursor-pointer">
                  <p className="text-[9px] font-black text-blue-400 uppercase mb-2 flex items-center gap-2">
                    <IoTimeOutline size={12} /> {new Date(blog.createdAt).toLocaleDateString()}
                  </p>
                  <h4 className="text-sm font-bold group-hover:text-blue-300 transition-colors line-clamp-2 uppercase tracking-tight leading-tight">
                    {blog.title}
                  </h4>
                  <div className="w-full h-[1px] bg-white/5 mt-4" />
                </div>
              ))
            ) : (
              <p className="text-slate-600 text-[10px] uppercase font-bold italic">No recent posts published.</p>
            )}
          </div>
          <Link 
            to="/admin/manage-blogs"
            className="w-full mt-10 py-4 bg-white/10 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-blue-600 transition-all flex items-center justify-center gap-2"
          >
            Manage All Content <IoArrowForwardOutline />
          </Link>
        </div>

      </div>
    </div>
  );
};

// --- HELPER COMPONENTS ---

const StatCard = ({ label, value, icon, color, isLive }) => (
  <div className={`${color} p-8 rounded-[2.5rem] text-white shadow-xl shadow-blue-900/10 transition-all hover:-translate-y-1 relative overflow-hidden group`}>
    {isLive && (
      <div className="absolute top-4 right-4 flex items-center gap-1.5 px-2 py-1 bg-white/10 rounded-full">
        <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-ping" />
        <span className="text-[8px] font-black uppercase tracking-widest">Live System</span>
      </div>
    )}
    <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center text-2xl mb-6 group-hover:rotate-12 transition-transform">
      {icon}
    </div>
    <p className="text-[10px] font-black uppercase tracking-widest opacity-60 mb-1">{label}</p>
    <h3 className="text-4xl font-black tracking-tighter">{value}</h3>
  </div>
);

const MiniCard = ({ label, value, icon, highlight }) => (
  <div className={`bg-white p-6 rounded-[2rem] border ${highlight ? 'border-blue-100 bg-blue-50/10' : 'border-slate-50'} flex items-center gap-4 transition-all hover:shadow-lg`}>
    <div className={`w-11 h-11 ${highlight ? 'bg-blue-600 text-white' : 'bg-slate-50 text-blue-600'} rounded-2xl flex items-center justify-center text-xl shadow-sm`}>
      {icon}
    </div>
    <div>
      <p className="text-[9px] font-black text-slate-400 uppercase leading-none mb-1.5 tracking-widest">{label}</p>
      <h4 className="text-2xl font-black text-slate-900 tracking-tighter">{value}</h4>
    </div>
  </div>
);

export default AdminDashboard;