import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
// 🚀 IMPORT your customized API and the Redux action
import { registerUser } from '../../redux/features/auth/authSlice'; 

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'patient' 
  });

  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  // Get loading and error states from Redux
  const { loading, error } = useSelector((state) => state.auth);

  const handleRegister = async (e) => {
    e.preventDefault();
    
    // 🛡️ Trigger the Redux Thunk
    const result = await dispatch(registerUser(formData));
    
    // If registration is successful (fulfilled), move to login
    if (result.meta.requestStatus === 'fulfilled') {
      navigate('/login');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6">
      <div className="max-w-md w-full bg-white p-10 rounded-[2rem] shadow-xl border border-slate-100">
        <h2 className="text-3xl font-black text-slate-900 mb-2">Join SJCH</h2>
        <p className="text-slate-400 mb-8 text-sm">Create your medical portal account.</p>

        {/* 🚀 Display Redux Error Message if it exists */}
        {error && (
          <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg text-sm font-medium border border-red-100">
            {error}
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-4">
          <input 
            type="text" placeholder="Full Name" required
            className="w-full p-4 bg-slate-50 rounded-xl border-none outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            onChange={(e) => setFormData({...formData, name: e.target.value})}
          />
          <input 
            type="email" placeholder="Email Address" required
            className="w-full p-4 bg-slate-50 rounded-xl border-none outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            onChange={(e) => setFormData({...formData, email: e.target.value})}
          />
          <input 
            type="password" placeholder="Password" required
            className="w-full p-4 bg-slate-50 rounded-xl border-none outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            onChange={(e) => setFormData({...formData, password: e.target.value})}
          />
          
          <button 
            disabled={loading}
            className={`w-full py-4 text-white rounded-xl font-bold transition-all shadow-lg 
            ${loading ? 'bg-slate-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-slate-900 shadow-blue-100'}`}
          >
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-500">
          Already have an account? <Link to="/login" className="text-blue-600 font-bold">Login</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;