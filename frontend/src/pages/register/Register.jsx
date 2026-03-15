import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { registerUser } from '../../redux/features/auth/authSlice';
import {
  IoPersonOutline, IoMailOutline, IoLockClosedOutline,
  IoEyeOutline, IoEyeOffOutline, IoMedicalOutline,
  IoCheckmarkCircleOutline, IoAlertCircleOutline,
} from 'react-icons/io5';

const Register = () => {
  // role is always 'patient' — never shown to the user
  const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'patient' });
  const [showPass, setShowPass] = useState(false);
  const [agree, setAgree]       = useState(false);

  const navigate  = useNavigate();
  const dispatch  = useDispatch();
  const { loading, error } = useSelector(state => state.auth);

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!agree) return;
    const result = await dispatch(registerUser(formData));
    if (result.meta.requestStatus === 'fulfilled') {
      navigate('/login');
    }
  };

  const passwordStrength = (p) => {
    if (!p) return null;
    if (p.length < 6)  return { label: 'Too short', color: '#ef4444', width: '20%' };
    if (p.length < 8)  return { label: 'Weak',      color: '#f59e0b', width: '45%' };
    if (!/[A-Z]/.test(p) || !/[0-9]/.test(p)) return { label: 'Fair', color: '#3b82f6', width: '70%' };
    return { label: 'Strong', color: '#22c55e', width: '100%' };
  };
  const strength = passwordStrength(formData.password);

  return (
    <>
      <style>{`
        .reg-root {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, #0f172a 0%, #1e3a8a 60%, #0ea5e9 100%);
          padding: clamp(16px, 4vw, 32px);
        }
        .reg-card {
          width: 100%;
          max-width: 480px;
          background: #fff;
          border-radius: clamp(20px, 4vw, 32px);
          padding: clamp(28px, 6vw, 48px) clamp(24px, 5vw, 44px);
          box-shadow: 0 40px 80px rgba(0,0,0,0.3);
        }
        .reg-input-wrap { position: relative; width: 100%; }
        .reg-input-wrap svg.icon {
          position: absolute; left: 16px; top: 50%;
          transform: translateY(-50%);
          color: #94a3b8; pointer-events: none;
        }
        .reg-input {
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
        .reg-input:focus {
          border-color: #3b82f6;
          box-shadow: 0 0 0 4px rgba(59,130,246,0.12);
        }
        .reg-toggle-pass {
          position: absolute; right: 14px; top: 50%;
          transform: translateY(-50%);
          background: none; border: none;
          cursor: pointer; color: #94a3b8; padding: 4px;
          display: flex; transition: color 0.2s;
        }
        .reg-toggle-pass:hover { color: #475569; }
        .reg-submit {
          width: 100%; padding: 15px;
          background: #2563eb; color: #fff;
          border: none; border-radius: 14px;
          font-size: 14px; font-weight: 800;
          letter-spacing: 0.06em; cursor: pointer;
          transition: background 0.25s, transform 0.15s;
          font-family: inherit;
        }
        .reg-submit:hover:not(:disabled)  { background: #0f172a; }
        .reg-submit:active:not(:disabled) { transform: scale(0.98); }
        .reg-submit:disabled { background: #94a3b8; cursor: not-allowed; }

        @media (max-width: 400px) {
          .reg-card { border-radius: 20px; }
        }
      `}</style>

      <div className="reg-root">
        <div className="reg-card">

          {/* Logo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 28 }}>
            <div style={{ width: 44, height: 44, borderRadius: 14, background: 'linear-gradient(135deg,#1e3a8a,#0ea5e9)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <IoMedicalOutline size={22} style={{ color: '#fff' }} />
            </div>
            <div>
              <p style={{ fontSize: 9, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.22em', color: '#94a3b8', margin: 0 }}>SJCH</p>
              <p style={{ fontSize: 12, fontWeight: 700, color: '#0f172a', margin: 0 }}>Saint Joseph's Catholic Hospital</p>
            </div>
          </div>

          <h2 style={{ fontSize: 'clamp(1.6rem,4vw,2rem)', fontWeight: 900, color: '#0f172a', letterSpacing: '-0.03em', margin: '0 0 6px' }}>Create Account</h2>
          <p style={{ fontSize: 13, color: '#64748b', margin: '0 0 24px' }}>Join the SJCH patient portal today.</p>

          {/* Error banner */}
          {error && (
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 12, padding: '12px 14px', marginBottom: 18 }}>
              <IoAlertCircleOutline size={17} style={{ color: '#ef4444', flexShrink: 0, marginTop: 1 }} />
              <p style={{ fontSize: 13, color: '#dc2626', fontWeight: 600, margin: 0 }}>{error}</p>
            </div>
          )}

          <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>

            {/* Full Name */}
            <div className="reg-input-wrap">
              <IoPersonOutline size={18} className="icon" />
              <input
                type="text"
                placeholder="Full name"
                required
                className="reg-input"
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
              />
            </div>

            {/* Email */}
            <div className="reg-input-wrap">
              <IoMailOutline size={18} className="icon" />
              <input
                type="email"
                placeholder="Email address"
                required
                className="reg-input"
                value={formData.email}
                onChange={e => setFormData({ ...formData, email: e.target.value })}
              />
            </div>

            {/* Password + strength */}
            <div>
              <div className="reg-input-wrap">
                <IoLockClosedOutline size={18} className="icon" />
                <input
                  type={showPass ? 'text' : 'password'}
                  placeholder="Create a password"
                  required
                  className="reg-input"
                  style={{ paddingRight: 46 }}
                  value={formData.password}
                  onChange={e => setFormData({ ...formData, password: e.target.value })}
                />
                <button type="button" className="reg-toggle-pass" onClick={() => setShowPass(s => !s)}>
                  {showPass ? <IoEyeOffOutline size={18} /> : <IoEyeOutline size={18} />}
                </button>
              </div>
              {strength && (
                <div style={{ marginTop: 8 }}>
                  <div style={{ height: 4, borderRadius: 999, background: '#e2e8f0', overflow: 'hidden' }}>
                    <div style={{ height: '100%', borderRadius: 999, background: strength.color, width: strength.width, transition: 'width 0.3s, background 0.3s' }} />
                  </div>
                  <p style={{ fontSize: 11, fontWeight: 700, color: strength.color, marginTop: 5 }}>{strength.label} password</p>
                </div>
              )}
            </div>

            {/* ── Role selector REMOVED ──
                role is always sent as 'patient' via formData initial state.
                Admins can promote users to doctor/admin from the admin panel. */}

            {/* Terms checkbox */}
            <label style={{ display: 'flex', alignItems: 'flex-start', gap: 10, cursor: 'pointer', marginTop: 4 }}>
              <div
                onClick={() => setAgree(a => !a)}
                style={{ width: 20, height: 20, borderRadius: 6, border: `2px solid ${agree ? '#2563eb' : '#e2e8f0'}`, background: agree ? '#2563eb' : '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 1, transition: 'all 0.2s', cursor: 'pointer' }}
              >
                {agree && <IoCheckmarkCircleOutline size={14} style={{ color: '#fff' }} />}
              </div>
              <span style={{ fontSize: 12, color: '#64748b', lineHeight: 1.6 }}>
                I agree to the{' '}
                <Link to="/terms"   style={{ color: '#2563eb', fontWeight: 700, textDecoration: 'none' }}>Terms of Service</Link>
                {' '}and{' '}
                <Link to="/privacy" style={{ color: '#2563eb', fontWeight: 700, textDecoration: 'none' }}>Privacy Policy</Link>
              </span>
            </label>

            <button type="submit" disabled={loading || !agree} className="reg-submit">
              {loading ? 'Creating Account…' : 'Create Account'}
            </button>
          </form>

          <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '22px 0' }}>
            <div style={{ flex: 1, height: 1, background: '#e2e8f0' }} />
            <span style={{ fontSize: 11, color: '#94a3b8', fontWeight: 600 }}>Already a member?</span>
            <div style={{ flex: 1, height: 1, background: '#e2e8f0' }} />
          </div>

          <Link to="/login" style={{ display: 'block', width: '100%', padding: '13px', background: '#f8fafc', border: '1.5px solid #e2e8f0', borderRadius: 14, textAlign: 'center', fontSize: 13, fontWeight: 800, color: '#0f172a', textDecoration: 'none', transition: 'all 0.2s', boxSizing: 'border-box' }}>
            Sign In Instead
          </Link>

        </div>
      </div>
    </>
  );
};

export default Register;