import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { loginUser } from '../../redux/features/auth/authSlice';
import { toast } from 'react-hot-toast';
import {
  IoMailOutline, IoLockClosedOutline,
  IoEyeOutline, IoEyeOffOutline, IoMedicalOutline,
} from 'react-icons/io5';

const Login = () => {
  const [email,    setEmail]    = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading } = useSelector(state => state.auth);

  const handleLogin = async (e) => {
    e.preventDefault();
    const result = await dispatch(loginUser({ email, password }));
    if (loginUser.fulfilled.match(result)) {
      const user = result.payload.user;
      toast.success(`Welcome back, ${user.name}`);
      if (user.role === 'admin')  return navigate('/admin/dashboard');
      if (user.role === 'doctor') return navigate('/doctor/dashboard');
      navigate('/');
    } else {
      toast.error(result.payload || 'Login failed');
    }
  };

  return (
    <>
      <style>{`
        .login-root {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, #0f172a 0%, #1e3a8a 60%, #0ea5e9 100%);
          padding: clamp(16px, 4vw, 32px);
        }
        .login-card {
          width: 100%;
          max-width: 440px;
          background: #fff;
          border-radius: clamp(20px, 4vw, 32px);
          padding: clamp(28px, 6vw, 48px) clamp(24px, 5vw, 44px);
          box-shadow: 0 40px 80px rgba(0,0,0,0.3);
        }
        .login-input-wrap {
          position: relative;
          width: 100%;
        }
        .login-input-wrap svg.icon {
          position: absolute; left: 16px; top: 50%;
          transform: translateY(-50%);
          color: #94a3b8; pointer-events: none;
        }
        .login-input {
          width: 100%;
          padding: 14px 16px 14px 46px;
          background: #f8fafc;
          border: 1.5px solid #e2e8f0;
          border-radius: 14px;
          font-size: 16px;
          font-weight: 600;
          color: #0f172a;
          outline: none;
          transition: border-color 0.25s, box-shadow 0.25s;
          box-sizing: border-box;
          font-family: inherit;
        }
        .login-input:focus {
          border-color: #3b82f6;
          box-shadow: 0 0 0 4px rgba(59,130,246,0.12);
        }
        .login-toggle-pass {
          position: absolute; right: 14px; top: 50%;
          transform: translateY(-50%);
          background: none; border: none;
          cursor: pointer; color: #94a3b8;
          padding: 4px; display: flex;
          transition: color 0.2s;
        }
        .login-toggle-pass:hover { color: #475569; }
        .login-submit {
          width: 100%;
          padding: 15px;
          background: #0f172a;
          color: #fff;
          border: none;
          border-radius: 14px;
          font-size: 14px;
          font-weight: 800;
          letter-spacing: 0.06em;
          cursor: pointer;
          transition: background 0.25s, transform 0.15s;
          font-family: inherit;
        }
        .login-submit:hover:not(:disabled)  { background: #2563eb; }
        .login-submit:active:not(:disabled) { transform: scale(0.98); }
        .login-submit:disabled { background: #94a3b8; cursor: not-allowed; }

        @media (max-width: 400px) {
          .login-card { border-radius: 20px; }
        }
      `}</style>

      <div className="login-root">
        <div className="login-card">

          {/* Logo mark */}
          <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:28 }}>
            <div style={{ width:44, height:44, borderRadius:14, background:'linear-gradient(135deg,#1e3a8a,#0ea5e9)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
              <IoMedicalOutline size={22} style={{ color:'#fff' }} />
            </div>
            <div>
              <p style={{ fontSize:9, fontWeight:900, textTransform:'uppercase', letterSpacing:'0.22em', color:'#94a3b8', margin:0 }}>SJCH</p>
              <p style={{ fontSize:12, fontWeight:700, color:'#0f172a', margin:0 }}>Saint Joseph's Catholic Hospital</p>
            </div>
          </div>

          <h2 style={{ fontSize:'clamp(1.6rem,4vw,2rem)', fontWeight:900, color:'#0f172a', letterSpacing:'-0.03em', margin:'0 0 6px' }}>
            Portal Login
          </h2>
          <p style={{ fontSize:13, color:'#64748b', margin:'0 0 28px' }}>
            Welcome back. Sign in to your account.
          </p>

          <form onSubmit={handleLogin} style={{ display:'flex', flexDirection:'column', gap:14 }}>

            {/* Email */}
            <div className="login-input-wrap">
              <IoMailOutline size={18} className="icon" />
              <input
                type="email"
                placeholder="Email address"
                required
                className="login-input"
                value={email}
                onChange={e => setEmail(e.target.value)}
              />
            </div>

            {/* Password */}
            <div className="login-input-wrap">
              <IoLockClosedOutline size={18} className="icon" />
              <input
                type={showPass ? 'text' : 'password'}
                placeholder="Password"
                required
                className="login-input"
                style={{ paddingRight:46 }}
                value={password}
                onChange={e => setPassword(e.target.value)}
              />
              <button type="button" className="login-toggle-pass" onClick={() => setShowPass(s => !s)}>
                {showPass ? <IoEyeOffOutline size={18}/> : <IoEyeOutline size={18}/>}
              </button>
            </div>

            {/* ── Forgot password link ── */}
            <div style={{ textAlign:'right', marginTop:-4 }}>
              <Link to="/forgot-password"
                style={{ fontSize:12, fontWeight:700, color:'#2563eb', textDecoration:'none' }}
                onMouseEnter={e => e.target.style.textDecoration='underline'}
                onMouseLeave={e => e.target.style.textDecoration='none'}>
                Forgot password?
              </Link>
            </div>

            <button type="submit" disabled={loading} className="login-submit">
              {loading ? 'Authenticating…' : 'Sign In to Portal'}
            </button>
          </form>

          {/* Divider */}
          <div style={{ display:'flex', alignItems:'center', gap:12, margin:'24px 0' }}>
            <div style={{ flex:1, height:1, background:'#e2e8f0' }} />
            <span style={{ fontSize:11, color:'#94a3b8', fontWeight:600 }}>New to SJCH?</span>
            <div style={{ flex:1, height:1, background:'#e2e8f0' }} />
          </div>

          <Link to="/register" style={{
            display:'block', width:'100%', padding:'13px',
            background:'#f8fafc', border:'1.5px solid #e2e8f0',
            borderRadius:14, textAlign:'center',
            fontSize:13, fontWeight:800, color:'#0f172a',
            textDecoration:'none', transition:'all 0.2s',
            boxSizing:'border-box',
          }}>
            Create an Account
          </Link>

        </div>
      </div>
    </>
  );
};

export default Login;