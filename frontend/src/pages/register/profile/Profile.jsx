import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setUser } from '../../../redux/features/auth/authSlice';
import API from '../../../api/axiosConfig'; // ← uses your shared axios instance (baseURL from env)
import {
  IoPencil, IoCallOutline, IoMailOutline,
  IoPersonOutline, IoCalendarOutline, IoShieldCheckmarkOutline,
  IoLocationOutline, IoDocumentTextOutline,
} from 'react-icons/io5';

const Profile = () => {
  const navigate  = useNavigate();
  const dispatch  = useDispatch();

  // ── Read what we already have in Redux ──────────────────────────────────────
  // If the user is logged in, we show their data immediately from the store
  // and only refresh in the background. This prevents the "session expired"
  // flash when data is already available.
  const reduxUser = useSelector(state => state.auth.user);

  const [profile, setProfile] = useState(reduxUser || null);
  const [loading, setLoading] = useState(!reduxUser); // skip spinner if we have data
  const [fetchError, setFetchError] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        // Use your shared API instance so baseURL comes from VITE_API_URL env var
        // NOT hardcoded localhost — that's what caused the production failure
        const res = await API.get('/auth/me');

        if (res.data.success) {
          setProfile(res.data.user);
          setFetchError(null);
          // Keep Redux in sync so the navbar avatar / name stays current
          dispatch(setUser(res.data.user));
        }
      } catch (err) {
        console.error('Profile fetch error:', err);
        const status = err.response?.status;

        if (status === 401 || status === 403) {
          // Only show the error if we have no cached data to fall back on
          if (!reduxUser) {
            setFetchError('Session expired. Please log in again.');
          }
          // If we DO have reduxUser, just silently keep showing that data
        } else {
          // Network error / 500 — show a soft warning but keep existing data
          if (!reduxUser) {
            setFetchError('Could not load profile. Please try again.');
          }
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [dispatch]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Loading spinner (only shown when we have no cached data yet) ────────────
  if (loading) return (
    <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14 }}>
        <div style={{ width: 44, height: 44, border: '3px solid #dbeafe', borderTopColor: '#2563eb', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
        <p style={{ fontSize: 10, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.3em', color: '#94a3b8' }}>Loading Profile...</p>
      </div>
    </div>
  );

  // ── Hard error (no data at all) ─────────────────────────────────────────────
  if (fetchError && !profile) return (
    <div style={{ minHeight: '60vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16, padding: '0 24px', textAlign: 'center' }}>
      <div style={{ width: 56, height: 56, borderRadius: 18, background: '#fef2f2', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24 }}>⚠️</div>
      <p style={{ fontSize: 14, color: '#dc2626', fontWeight: 600, margin: 0 }}>{fetchError}</p>
      <button
        onClick={() => navigate('/login')}
        style={{ padding: '12px 28px', background: '#2563eb', color: '#fff', border: 'none', borderRadius: 14, fontWeight: 900, fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.18em', cursor: 'pointer' }}
      >
        Log In
      </button>
    </div>
  );

  // ── Absolute fallback — should not happen, but just in case ─────────────────
  if (!profile) return null;

  const initial = profile.name?.charAt(0)?.toUpperCase() || '?';

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc', padding: 'clamp(16px,4vw,32px)', display: 'flex', justifyContent: 'center' }}>
      <style>{`
        .profile-card  { max-width: 680px; width: 100%; background: #fff; border-radius: clamp(24px,4vw,48px); box-shadow: 0 20px 60px rgba(15,23,42,0.08); border: 1px solid #f1f5f9; overflow: hidden; }
        .profile-banner{ height: clamp(100px,14vw,160px); background: linear-gradient(135deg,#1e3a8a 0%,#2563eb 60%,#0ea5e9 100%); position: relative; }
        .profile-body  { padding: 0 clamp(20px,5vw,40px) clamp(28px,5vw,40px); }
        .profile-avatar-row { display: flex; justify-content: space-between; align-items: flex-end; margin-top: clamp(-48px,-8vw,-64px); margin-bottom: clamp(16px,3vw,28px); }
        .profile-avatar { width: clamp(88px,14vw,128px); height: clamp(88px,14vw,128px); border-radius: clamp(18px,3vw,32px); border: 5px solid #fff; background: #eff6ff; overflow: hidden; box-shadow: 0 8px 32px rgba(0,0,0,0.12); flex-shrink: 0; }
        .profile-edit-btn { display: flex; align-items: center; gap: 7px; padding: clamp(9px,1.5vw,12px) clamp(16px,2.5vw,24px); background: #0f172a; color: #fff; border: none; border-radius: 14px; font-size: 10px; font-weight: 900; text-transform: uppercase; letter-spacing: 0.16em; cursor: pointer; transition: all 0.2s; white-space: nowrap; }
        .profile-edit-btn:hover { background: #2563eb; transform: translateY(-1px); }
        .profile-info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: clamp(10px,2vw,16px); background: #f8fafc; border-radius: clamp(16px,3vw,28px); padding: clamp(16px,3vw,28px); border: 1px solid #f1f5f9; }
        @media (max-width: 480px) { .profile-info-grid { grid-template-columns: 1fr; } }
      `}</style>

      <div className="profile-card">
        {/* Banner */}
        <div className="profile-banner">
          <div style={{ position: 'absolute', bottom: 0, right: 0, width: '40%', height: '100%', background: 'rgba(255,255,255,0.04)', clipPath: 'polygon(30% 0,100% 0,100% 100%)' }} />
        </div>

        <div className="profile-body">
          {/* Avatar row */}
          <div className="profile-avatar-row">
            <div className="profile-avatar">
              {profile.image ? (
                <img src={profile.image} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 'clamp(28px,6vw,48px)', fontWeight: 900, color: '#2563eb' }}>
                  {initial}
                </div>
              )}
            </div>

            <button className="profile-edit-btn" onClick={() => navigate('/edit-profile')}>
              <IoPencil size={13} /> Edit Profile
            </button>
          </div>

          {/* Name + badges */}
          <div style={{ marginBottom: 'clamp(20px,3vw,32px)' }}>
            <h1 style={{ fontSize: 'clamp(1.5rem,4vw,2.5rem)', fontWeight: 900, color: '#0f172a', letterSpacing: '-0.03em', margin: '0 0 10px' }}>
              {profile.name}
            </h1>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              <span style={{ padding: '4px 14px', background: '#eff6ff', color: '#2563eb', fontSize: 9, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.2em', borderRadius: 999, border: '1px solid #bfdbfe' }}>
                {profile.role}
              </span>
              {profile.isProfileComplete && (
                <span style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '4px 14px', background: '#f0fdf4', color: '#16a34a', fontSize: 9, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.2em', borderRadius: 999, border: '1px solid #bbf7d0' }}>
                  <IoShieldCheckmarkOutline size={11} /> Verified
                </span>
              )}
            </div>
          </div>

          {/* Info grid */}
          <div className="profile-info-grid">
            <InfoCard icon={<IoMailOutline size={19}/>}        label="Email"         value={profile.email} />
            <InfoCard icon={<IoCallOutline size={19}/>}        label="Phone"         value={profile.phone || 'Not provided'} />
            <InfoCard icon={<IoPersonOutline size={19}/>}      label="Gender"        value={profile.gender || 'Not specified'} />
            <InfoCard icon={<IoCalendarOutline size={19}/>}    label="Date of Birth" value={profile.dob ? new Date(profile.dob).toLocaleDateString('en-US', { year:'numeric', month:'long', day:'numeric' }) : 'Not set'} />
            {profile.address && (
              <InfoCard icon={<IoLocationOutline size={19}/>}  label="Address"       value={profile.address} />
            )}
            {profile.bio && (
              <div style={{ gridColumn: '1 / -1' }}>
                <InfoCard icon={<IoDocumentTextOutline size={19}/>} label="Bio" value={profile.bio} />
              </div>
            )}
          </div>

          {/* Soft fetch-error notice (when we DID have data but refresh failed) */}
          {fetchError && profile && (
            <p style={{ fontSize: 11, color: '#f59e0b', fontWeight: 700, textAlign: 'center', marginTop: 16 }}>
              ⚠️ Showing cached data — refresh failed. Check your connection.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

const InfoCard = ({ icon, label, value }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '8px 4px' }}>
    <div style={{ width: 42, height: 42, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#fff', color: '#2563eb', borderRadius: 14, boxShadow: '0 1px 4px rgba(0,0,0,0.06)', border: '1px solid #f1f5f9' }}>
      {icon}
    </div>
    <div style={{ minWidth: 0 }}>
      <p style={{ fontSize: 9, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.2em', color: '#94a3b8', margin: '0 0 3px' }}>{label}</p>
      <p style={{ fontSize: 13, fontWeight: 700, color: '#1e293b', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{value}</p>
    </div>
  </div>
);

export default Profile;