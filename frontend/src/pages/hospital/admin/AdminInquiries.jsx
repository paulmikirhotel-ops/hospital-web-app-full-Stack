import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  IoMailOpenOutline, IoTimeOutline, IoPersonOutline, 
  IoChevronForward, IoTrashOutline, IoMailUnreadOutline 
} from 'react-icons/io5';
import { toast } from 'react-hot-toast';

const AdminInquiries = () => {
  // 🚀 Initializing as an empty array is vital for .map() safety
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedInquiry, setSelectedInquiry] = useState(null);

  useEffect(() => {
    fetchInquiries();
  }, []);

  const fetchInquiries = async () => {
    try {
      setLoading(true);
      // Ensure URL matches server.js mounting: /api/inquiries/all
      const { data } = await axios.get('http://localhost:5001/api/inquiries/all', { withCredentials: true });
      
      // 🚀 THE FIX: Extract the inquiries array specifically
      if (data.success && Array.isArray(data.inquiries)) {
        setInquiries(data.inquiries);
      } else if (Array.isArray(data)) {
        setInquiries(data); // Fallback if direct array is sent
      } else {
        setInquiries([]); // Fallback to empty array to prevent crash
      }
    } catch (error) {
      console.error("Fetch Error:", error);
      toast.error("Failed to load clinical inquiries.");
      setInquiries([]); 
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Permanent deletion from SJCH records?")) return;
    
    try {
      // Matches the router.delete('/delete/:id') path
      const { data } = await axios.delete(`http://localhost:5001/api/inquiries/delete/${id}`, { withCredentials: true });
      
      if (data.success) {
        toast.success("Inquiry removed.");
        setInquiries(prev => prev.filter(item => item._id !== id));
        if (selectedInquiry?._id === id) setSelectedInquiry(null);
      }
    } catch (error) {
      toast.error("Could not delete inquiry.");
    }
  };

  if (loading) return (
    <div className="flex flex-col justify-center items-center h-96 gap-4">
      <div className="w-12 h-12 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin" />
      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Accessing Secure Database...</p>
    </div>
  );

  return (
    <div className="p-8 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <header className="mb-10 flex justify-between items-end">
          <div>
            <h1 className="text-4xl font-black text-slate-900 uppercase tracking-tighter flex items-center gap-3">
              Clinical Inbox <IoMailUnreadOutline className="text-blue-600" />
            </h1>
            <p className="text-slate-500 font-bold text-sm">Patient inquiries stored in the SJCH secure database.</p>
          </div>
          <div className="bg-white px-6 py-3 rounded-2xl border border-slate-100 shadow-sm">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Unresolved</span>
            <span className="text-2xl font-black text-blue-600">{inquiries.length}</span>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* --- Sidebar: Message List --- */}
          <div className="lg:col-span-5 space-y-4 max-h-[75vh] overflow-y-auto pr-2 custom-scrollbar">
            {/* 🚀 Safety Check: Ensure inquiries is an array before .length */}
            {Array.isArray(inquiries) && inquiries.length === 0 ? (
              <div className="bg-white p-20 rounded-[3rem] text-center border-2 border-dashed border-slate-100">
                 <IoMailOpenOutline size={50} className="mx-auto text-slate-200 mb-4" />
                 <p className="text-slate-400 italic font-bold">No clinical inquiries found.</p>
              </div>
            ) : (
              Array.isArray(inquiries) && inquiries.map((item) => (
                <motion.div 
                  key={item._id}
                  layoutId={item._id}
                  onClick={() => setSelectedInquiry(item)}
                  className={`p-6 rounded-[2rem] cursor-pointer transition-all border-2 ${
                    selectedInquiry?._id === item._id 
                      ? 'bg-blue-600 border-blue-600 shadow-xl shadow-blue-100' 
                      : 'bg-white border-transparent hover:border-blue-100'
                  }`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <h4 className={`font-black text-sm uppercase tracking-tight ${selectedInquiry?._id === item._id ? 'text-white' : 'text-slate-800'}`}>
                      {item.name}
                    </h4>
                    <span className={`text-[9px] font-black px-3 py-1 rounded-full uppercase ${selectedInquiry?._id === item._id ? 'bg-blue-500 text-white' : 'bg-blue-50 text-blue-500'}`}>
                      {item.subject}
                    </span>
                  </div>
                  <p className={`text-xs line-clamp-1 font-medium ${selectedInquiry?._id === item._id ? 'text-blue-100' : 'text-slate-400'}`}>
                    {item.message}
                  </p>
                </motion.div>
              ))
            )}
          </div>

          {/* --- Detail View: Reading Pane --- */}
          <div className="lg:col-span-7">
            <AnimatePresence mode="wait">
              {selectedInquiry ? (
                <motion.div 
                  key={selectedInquiry._id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="bg-white rounded-[3.5rem] p-12 shadow-2xl border border-slate-100 h-full relative overflow-hidden flex flex-col"
                >
                  <IoMailOpenOutline className="absolute -top-20 -right-20 text-slate-50 text-[20rem] rotate-12 pointer-events-none" />

                  <div className="relative z-10 flex flex-col h-full">
                    <div className="flex items-center gap-5 mb-10">
                      <div className="w-16 h-16 bg-slate-900 rounded-[1.5rem] flex items-center justify-center text-white text-2xl shadow-lg">
                        <IoPersonOutline />
                      </div>
                      <div>
                        <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest mb-1">Patient Details</p>
                        <h2 className="text-2xl font-black text-slate-900">{selectedInquiry.name}</h2>
                        <p className="text-sm font-bold text-slate-400">{selectedInquiry.email}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-8">
                      <div className="bg-slate-50 p-5 rounded-3xl">
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Timestamp</p>
                        <div className="flex items-center gap-2 text-slate-700 font-black text-xs">
                          <IoTimeOutline className="text-blue-600" /> {new Date(selectedInquiry.createdAt).toLocaleString()}
                        </div>
                      </div>
                      <div className="bg-slate-50 p-5 rounded-3xl">
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Dept. Routing</p>
                        <div className="flex items-center gap-2 text-slate-700 font-black text-xs uppercase">
                          <IoChevronForward className="text-blue-600" /> {selectedInquiry.subject}
                        </div>
                      </div>
                    </div>

                    <div className="bg-blue-50/30 p-10 rounded-[2.5rem] border border-blue-50/50 flex-grow mb-8 overflow-y-auto">
                      <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-4">Patient Message</p>
                      <p className="text-slate-700 leading-loose font-medium text-lg whitespace-pre-wrap italic">
                        "{selectedInquiry.message}"
                      </p>
                    </div>

                    <div className="flex gap-4">
                      <button 
                        onClick={() => window.location.href = `mailto:${selectedInquiry.email}`}
                        className="flex-grow py-5 bg-slate-900 text-white rounded-[2rem] font-black uppercase text-[10px] tracking-[0.2em] hover:bg-blue-600 transition-all shadow-xl shadow-slate-200 active:scale-95"
                      >
                        Send Email Reply
                      </button>
                      <button 
                        onClick={() => handleDelete(selectedInquiry._id)}
                        className="w-20 bg-red-50 text-red-500 rounded-[2rem] flex items-center justify-center hover:bg-red-500 hover:text-white transition-all active:scale-95"
                      >
                        <IoTrashOutline size={24} />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center border-4 border-dashed border-slate-100 rounded-[4rem] p-20 text-center bg-white/50">
                  <IoMailOpenOutline size={60} className="text-slate-200 mb-4" />
                  <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Select a record to begin review.</p>
                </div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminInquiries;