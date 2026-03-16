import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  IoLockClosedOutline, IoEyeOutline, IoEyeOffOutline,
  IoCheckmarkCircleOutline, IoAlertCircleOutline,
} from 'react-icons/io5';
import API from '../../api/axiosConfig';

const ResetPassword = () => {
  const { token }   = useParams();
  const navigate    = useNavigate();
  const [password,  setPassword]  = useState('');
  const [confirm,   setConfirm]   = useState('');
  const [showPw,    setShowPw]    = useState(false);
  const [loading,   setLoading]   = useState(false);
  const [verifying, setVerifying] = useState(true);
  const [valid,     setValid]     = useState(false);
  const [done,      setDone]      = useState(false);
  const [error,     setError]     = useState('');
  const [email,     setEmail]     = useState('');

  // Verify token on mount
  useEffect(() => {
    const verify = async () => {
      try {
        const { data } = await API.get(`/auth/verify-reset-token/${token}`);
        if (data.success) { setValid(true); setEmail(data.email); }
        else setError(data.message);
      } catch {
        setError('This reset link is invalid or has expired.');
      } finally {
        setVerifying(false);
      }
    };
    verify();
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (password.length < 6) return setError('Password must be at least 6 characters.');
    if (password !== confirm)  return setError('Passwords do not match.');
    setLoading(true);
    try {
      const { data } = await API.post(`/auth/reset-password/${token}`, { password });
      if (data.success) setDone(true);
      else setError(data.message);
    } catch (err) {
      setError(err.response?.data?.message || 'Error resetting password.');
    } finally {
      setLoading(false);
    }
  };

  const strength = password.length === 0 ? 0 : password.length < 6 ? 1 : password.length < 10 ? 2 : 3;
  const strengthLabel = ['', 'Weak', 'Good', 'Strong'];
  const strengthColor = ['', '#ef4444', '#f59e0b', '#22c55e'];

  if (verifying) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-10 h-10 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin"/>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/30 flex items-center justify-center px-4 py-16">
      <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-[2.5rem] shadow-xl border border-slate-100 w-full max-w-md p-8 lg:p-10">

        {!valid ? (
          /* Invalid token */
          <div className="text-center">
            <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <IoAlertCircleOutline size={28} className="text-red-500"/>
            </div>
            <h2 className="text-xl font-black text-slate-900 mb-3">Link Expired</h2>
            <p className="text-slate-500 text-sm mb-6">{error}</p>
            <Link to="/forgot-password"
              className="inline-block px-6 py-3 bg-blue-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-900 transition-all">
              Request New Link
            </Link>
          </div>
        ) : !done ? (
          <>
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <IoLockClosedOutline size={28} className="text-blue-600"/>
              </div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tighter mb-2">Set New Password</h1>
              <p className="text-slate-500 text-sm">For <strong>{email}</strong></p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* New password */}
              <div>
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-2">New Password</label>
                <div className="relative">
                  <IoLockClosedOutline className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18}/>
                  <input
                    type={showPw ? 'text' : 'password'}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="Min. 6 characters"
                    className="w-full pl-11 pr-12 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-50 transition-all"
                  />
                  <button type="button" onClick={() => setShowPw(s => !s)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                    {showPw ? <IoEyeOffOutline size={18}/> : <IoEyeOutline size={18}/>}
                  </button>
                </div>
                {/* Strength bar */}
                {password.length > 0 && (
                  <div className="mt-2 flex items-center gap-2">
                    <div className="flex-1 flex gap-1">
                      {[1,2,3].map(i => (
                        <div key={i} className="flex-1 h-1.5 rounded-full transition-all"
                          style={{ background: i <= strength ? strengthColor[strength] : '#e2e8f0' }}/>
                      ))}
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-widest"
                      style={{ color: strengthColor[strength] }}>
                      {strengthLabel[strength]}
                    </span>
                  </div>
                )}
              </div>

              {/* Confirm password */}
              <div>
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-2">Confirm Password</label>
                <div className="relative">
                  <IoLockClosedOutline className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18}/>
                  <input
                    type={showPw ? 'text' : 'password'}
                    value={confirm}
                    onChange={e => setConfirm(e.target.value)}
                    placeholder="Repeat password"
                    className={`w-full pl-11 pr-4 py-3.5 bg-slate-50 border rounded-2xl text-sm outline-none transition-all ${
                      confirm && password !== confirm
                        ? 'border-red-300 focus:ring-4 focus:ring-red-50'
                        : 'border-slate-100 focus:border-blue-500 focus:ring-4 focus:ring-blue-50'
                    }`}
                  />
                </div>
                {confirm && password !== confirm && (
                  <p className="text-red-500 text-[11px] font-bold mt-1">Passwords do not match</p>
                )}
              </div>

              {error && (
                <div className="bg-red-50 border border-red-100 rounded-2xl p-4">
                  <p className="text-red-600 text-sm font-medium">{error}</p>
                </div>
              )}

              <button type="submit" disabled={loading || password !== confirm || password.length < 6}
                className="w-full py-4 bg-blue-600 text-white rounded-2xl font-black text-[11px] uppercase tracking-widest hover:bg-slate-900 transition-all disabled:opacity-50 flex items-center justify-center gap-2 shadow-xl shadow-blue-100">
                {loading
                  ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"/> Resetting...</>
                  : 'Reset Password'
                }
              </button>
            </form>
          </>
        ) : (
          /* Success */
          <div className="text-center">
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 200 }}
              className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <IoCheckmarkCircleOutline size={40} className="text-emerald-500"/>
            </motion.div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tighter mb-3">Password Reset!</h2>
            <p className="text-slate-500 text-sm mb-8">Your password has been updated. You can now log in.</p>
            <button onClick={() => navigate('/login')}
              className="w-full py-4 bg-blue-600 text-white rounded-2xl font-black text-[11px] uppercase tracking-widest hover:bg-slate-900 transition-all shadow-xl shadow-blue-100">
              Go to Login
            </button>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default ResetPassword;