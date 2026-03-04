import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { 
  IoCallOutline, IoMailOutline, IoLocationOutline, 
  IoLogoWhatsapp, IoSend, IoPulseOutline, IoShieldCheckmarkOutline,
  IoCheckmarkCircle
} from 'react-icons/io5';

const Contact = () => {
  const formRef = useRef();
  const [status, setStatus] = useState('idle');

  // Configuration
  const API_URL = "http://localhost:5001/api/inquiries"; // Adjust to match your backend route
  const HERO_IMAGE_URL = "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=2000";
  const INSTITUTION_EMAIL = "paulmikimensah@gmail.com";
  const MAP_EMBED_URL = "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3972.186348637775!2d-10.758414524269158!3d6.265532593723145!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x10d1000624f28525%3A0x7707e059f3376f9d!2sSt.%20Joseph's%20Catholic%20Hospital!5e0!3m2!1sen!2slr!4v1700000000000";

 const handleSubmit = async (e) => {
  e.preventDefault();
  setStatus('sending');

  const formData = {
    name: formRef.current.user_name.value,
    email: formRef.current.user_email.value,
    subject: formRef.current.subject.value,
    message: formRef.current.message.value,
  };

  try {
    // 🚀 Points to http://localhost:5001/api/contact/send-inquiry
    const response = await axios.post(`${API_URL}/send-inquiry`, formData);
    
    // We check response.data.success because your backend returns { success: true }
    if (response.data.success) { 
      setStatus('success');
      toast.success("Inquiry saved in our clinical records!");
      formRef.current.reset();
      setTimeout(() => setStatus('idle'), 4000);
    }
  } catch (error) {
    console.error("Submission Error Details:", error.response);
    setStatus('error');
    toast.error(error.response?.data?.message || "Server connection failed.");
    setTimeout(() => setStatus('idle'), 4000);
  }
};

  return (
    <div className="min-h-screen bg-[#FDFDFD]">
      {/* Hero Section */}
      <section className="relative h-[40vh] w-full overflow-hidden">
        <img src={HERO_IMAGE_URL} alt="SJCH" className="w-full h-full object-cover brightness-75" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#FDFDFD] via-transparent to-black/20" />
        <div className="absolute bottom-10 left-0 w-full px-6">
          <div className="max-w-7xl mx-auto">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white/95 backdrop-blur-md p-8 rounded-[2.5rem] shadow-xl inline-block border border-white/50">
              <h1 className="text-4xl font-black text-slate-900 tracking-tight uppercase">Contact <span className="text-blue-600">SJCH</span></h1>
              <p className="text-slate-500 font-bold mt-2 flex items-center gap-2 italic text-sm">
                <IoPulseOutline className="text-blue-500 animate-pulse" /> Monrovia's Clinical Gateway
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto py-16 px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Quick Info Sidebar */}
          <div className="lg:col-span-4 space-y-4">
            <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-600 mb-4 ml-2">Direct Contact</h3>
            <ContactInfoCard icon={<IoCallOutline />} title="Emergency Line" value="+231 770 000 000" />
            <ContactInfoCard icon={<IoMailOutline />} title="Email Desk" value={INSTITUTION_EMAIL} />
            <ContactInfoCard icon={<IoLogoWhatsapp className="text-emerald-500" />} title="WhatsApp" value="Immediate Response" />
            
            <div className="p-6 bg-slate-900 rounded-[2.5rem] text-white mt-8 shadow-xl">
                <IoShieldCheckmarkOutline size={28} className="mb-3 text-blue-400" />
                <h4 className="font-black text-xs uppercase tracking-widest mb-1">Data Privacy</h4>
                <p className="text-[11px] font-bold text-slate-400 leading-relaxed">
                  Your clinical inquiry is saved to our secure hospital database and encrypted for your protection.
                </p>
            </div>
          </div>

          {/* Secure Form */}
          <div className="lg:col-span-8">
            <div className="bg-white rounded-[3.5rem] p-10 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.05)] border border-slate-50">
              <div className="mb-8 ml-2">
                <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tighter">Clinical Inquiry Form</h2>
                <p className="text-slate-400 font-bold text-sm">Fill out the details below to reach our administrative office.</p>
              </div>

              <form ref={formRef} onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FloatingInput name="user_name" label="Patient/User Full Name" type="text" required />
                <FloatingInput name="user_email" label="Contact Email Address" type="email" required />
                
                <div className="md:col-span-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase ml-2 mb-2 block tracking-widest">Clinical Unit</label>
                  <select name="subject" className="w-full bg-slate-50 rounded-2xl py-4 px-5 font-bold text-sm outline-none focus:ring-2 ring-blue-100 transition-all cursor-pointer">
                    <option value="General Support">General Support</option>
                    <option value="Appointments">Appointments</option>
                    <option value="Laboratory">Laboratory & Diagnostics</option>
                    <option value="Billing">Billing & Insurance</option>
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase ml-2 mb-2 block tracking-widest">Message</label>
                  <textarea name="message" rows="4" required className="w-full bg-slate-50 rounded-[2rem] py-4 px-5 font-medium text-sm outline-none focus:ring-2 ring-blue-100 resize-none transition-all" placeholder="Tell us how we can help..."></textarea>
                </div>

                <div className="md:col-span-2 mt-2">
                  <button 
                    disabled={status !== 'idle'}
                    className={`w-full py-5 rounded-2xl font-black uppercase tracking-widest transition-all flex items-center justify-center gap-3 shadow-lg active:scale-95 ${
                        status === 'success' ? 'bg-emerald-500 text-white' : 
                        status === 'error' ? 'bg-red-500 text-white' :
                        'bg-slate-900 text-white hover:bg-blue-600 shadow-blue-100'
                    }`}
                  >
                    {status === 'idle' && <><IoSend /> Send to Hospital Database</>}
                    {status === 'sending' && <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />}
                    {status === 'success' && <><IoCheckmarkCircle size={20}/> Message Recorded</>}
                    {status === 'error' && "System Error - Try Again"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- Helper Components ---
const ContactInfoCard = ({ icon, title, value }) => (
  <div className="flex items-center gap-4 p-5 bg-white rounded-[1.5rem] border border-slate-100 shadow-sm transition-hover hover:shadow-md">
    <div className="w-11 h-11 bg-slate-50 text-blue-600 rounded-xl flex items-center justify-center text-xl shadow-inner">{icon}</div>
    <div>
      <p className="text-[8px] font-black text-slate-300 uppercase tracking-widest">{title}</p>
      <p className="text-sm font-bold text-slate-800">{value}</p>
    </div>
  </div>
);

const FloatingInput = ({ label, ...props }) => (
  <div>
    <label className="text-[10px] font-black text-slate-400 uppercase ml-2 mb-2 block tracking-widest">{label}</label>
    <input className="w-full bg-slate-50 rounded-2xl py-4 px-5 font-bold text-sm outline-none focus:ring-2 ring-blue-100 transition-all" {...props} />
  </div>
);

export default Contact;