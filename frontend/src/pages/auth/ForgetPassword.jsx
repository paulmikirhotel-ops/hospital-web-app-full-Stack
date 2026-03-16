import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { IoMailOutline, IoArrowBackOutline, IoCheckmarkCircleOutline } from 'react-icons/io5';
import API from '../../api/axiosConfig';

const ForgotPassword = () => {
  const [email,     setEmail]     = useState('');
  const [loading,   setLoading]   = useState(false);
  const [sent,      setSent]      = useState(false);
  const [error,     setError]     = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!email.trim()) return setError('Please enter your email address.');
    setLoading(true);
    try {
      const { data } = await API.post('/auth/forgot-password', { email });
      if (data.success) setSent(true);
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/30 flex items-center justify-center px-4 py-16">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-[2.5rem] shadow-xl shadow-slate-100 border border-slate-100 w-full max-w-md p-8 lg:p-10"
      >
        {!sent ? (
          <>
            {/* Header */}
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <IoMailOutline size={28} className="text-blue-600"/>
              </div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tighter mb-2">Forgot Password?</h1>
              <p className="text-slate-500 text-sm leading-relaxed">
                No worries. Enter your email and we'll send you a reset link.
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <IoMailOutline className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18}/>
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-50 transition-all"
                  />
                </div>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-100 rounded-2xl p-4">
                  <p className="text-red-600 text-sm font-medium">{error}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 bg-blue-600 text-white rounded-2xl font-black text-[11px] uppercase tracking-widest hover:bg-slate-900 transition-all disabled:opacity-50 flex items-center justify-center gap-2 shadow-xl shadow-blue-100"
              >
                {loading ? (
                  <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"/> Sending...</>
                ) : (
                  'Send Reset Link'
                )}
              </button>
            </form>

            <div className="text-center mt-6">
              <Link to="/login" className="flex items-center justify-center gap-2 text-[11px] font-black uppercase tracking-widest text-slate-400 hover:text-blue-600 transition-colors">
                <IoArrowBackOutline size={14}/> Back to Login
              </Link>
            </div>
          </>
        ) : (
          /* Success state */
          <div className="text-center">
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 200 }}
              className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <IoCheckmarkCircleOutline size={40} className="text-emerald-500"/>
            </motion.div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tighter mb-3">Check Your Email</h2>
            <p className="text-slate-500 text-sm leading-relaxed mb-2">
              We sent a password reset link to:
            </p>
            <p className="font-black text-slate-900 mb-6">{email}</p>
            <p className="text-slate-400 text-xs mb-8">
              Didn't receive it? Check your spam folder or try again.
            </p>
            <button
              onClick={() => { setSent(false); setEmail(''); }}
              className="w-full py-3.5 border border-slate-200 rounded-2xl font-black text-[11px] uppercase tracking-widest text-slate-500 hover:bg-slate-50 transition-all mb-4"
            >
              Try Again
            </button>
            <Link to="/login" className="flex items-center justify-center gap-2 text-[11px] font-black uppercase tracking-widest text-slate-400 hover:text-blue-600 transition-colors">
              <IoArrowBackOutline size={14}/> Back to Login
            </Link>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default ForgotPassword;