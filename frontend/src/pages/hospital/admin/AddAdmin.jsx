import React, { useState } from 'react';
import axios from 'axios';
import { IoPersonAddOutline, IoShieldCheckmarkOutline, IoMailOutline, IoKeyOutline } from 'react-icons/io5';

const AddAdmin = () => {
  const [formData, setFormData] = useState({
    name: '',     // CHANGED: 'username' to 'name' to match your Mongoose Model
    email: '',
    password: '',
    role: 'admin' 
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    // GET THE TOKEN: Accessing the token you saved during login
    const token = localStorage.getItem('token');

    try {
      await axios.post('http://localhost:5001/api/auth/register', formData, {
        headers: { 
          token: token // MUST match what verifyToken.js expects (req.headers.token)
        }
      });
      
      setMessage({ type: 'success', text: 'New member authorized successfully!' });
      setFormData({ name: '', email: '', password: '', role: 'admin' });
    } catch (err) {
      setMessage({ 
        type: 'error', 
        text: err.response?.data?.message || 'Authorization failed. Check Admin privileges.' 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
        {/* Header Section */}
        <div className="p-10 border-b border-slate-50 bg-slate-50/50">
          <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center text-white mb-6 shadow-lg shadow-blue-100">
            <IoPersonAddOutline size={30} />
          </div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tighter">Add Staff Member</h2>
          <p className="text-slate-500 font-medium mt-2 text-sm italic">"Authorized personnel only. New accounts are logged."</p>
        </div>

        <form onSubmit={handleSubmit} className="p-10 space-y-6">
          {message.text && (
            <div className={`p-4 rounded-xl text-[10px] font-black uppercase tracking-widest ${message.type === 'success' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
              {message.text}
            </div>
          )}

          <div className="grid md:grid-cols-2 gap-6">
            {/* Full Name */}
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Full Name</label>
              <div className="relative">
                <input 
                  type="text" required
                  className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:border-blue-600 transition-all text-sm font-bold"
                  placeholder="Dr. John Doe"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                />
                <IoPersonAddOutline className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
              </div>
            </div>

            {/* Role Selection */}
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">System Role</label>
              <select 
                className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:border-blue-600 transition-all text-sm font-bold appearance-none cursor-pointer"
                value={formData.role}
                onChange={(e) => setFormData({...formData, role: e.target.value})}
              >
                <option value="admin">Administrator</option>
                <option value="doctor">Medical Staff</option>
                <option value="patient">Patient (Manual)</option>
              </select>
            </div>
          </div>

          {/* Email */}
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Email Address</label>
            <div className="relative">
              <input 
                type="email" required
                className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:border-blue-600 transition-all text-sm font-bold"
                placeholder="staff@sjch.com"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
              />
              <IoMailOutline className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            </div>
          </div>

          {/* Password */}
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Temporary Password</label>
            <div className="relative">
              <input 
                type="password" required
                className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:border-blue-600 transition-all text-sm font-bold"
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
              />
              <IoKeyOutline className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            </div>
          </div>

          <button 
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-blue-600 transition-all shadow-xl disabled:opacity-50 flex items-center justify-center gap-2 group"
          >
            <IoShieldCheckmarkOutline size={18} className="group-hover:scale-110 transition-transform" />
            {loading ? 'Processing...' : 'Authorize New Member'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddAdmin;