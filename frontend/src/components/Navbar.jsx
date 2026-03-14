import { NavLink, Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../redux/features/auth/authSlice';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import toast from 'react-hot-toast';
import NotificationBell from '../pages/medicalVault/NotificationBell/NotificationBell';
import { useSiteTheme } from '../context/ThemeContext';
import {
  IoChevronDown, IoMenu, IoClose,
  IoTimeOutline, IoLibraryOutline, IoSchoolOutline, IoPeopleOutline,
  IoCalendarOutline, IoLogOutOutline, IoPersonOutline,
  IoSettingsOutline, IoShieldCheckmarkOutline, IoGridOutline,
  IoStatsChartOutline, IoFileTrayFullOutline, IoMedicalOutline,
} from 'react-icons/io5';

const NAV_THEMES = [
  {
    name: 'Dark Gold',
    key: 'gold',
    navBg: 'rgba(10,7,0,0.92)',
    border: 'rgba(212,160,23,0.25)',
    text: '#f5e6c0',
    muted: '#b8922a',
    accent: '#d4a017',
    accentHover: '#f5c842',
    dropdownBg: 'rgba(18,12,0,0.97)',
    dropdownBorder: 'rgba(212,160,23,0.2)',
    linkHover: '#d4a017',
    profileBg: 'rgba(18,12,0,0.97)',
    badgeBg: '#d4a017',
    badgeText: '#0a0700',
    mobileBg: 'rgba(10,7,0,0.98)',
    glow: '0 0 30px rgba(212,160,23,0.15)',
    adminBg: 'rgba(212,160,23,0.12)',
    adminText: '#d4a017',
    dotColor: '#d4a017',
  },
  {
    name: 'Deep Blue',
    key: 'blue',
    navBg: 'rgba(0,8,20,0.92)',
    border: 'rgba(14,165,233,0.25)',
    text: '#e0f2fe',
    muted: '#38bdf8',
    accent: '#0ea5e9',
    accentHover: '#38bdf8',
    dropdownBg: 'rgba(0,8,20,0.97)',
    dropdownBorder: 'rgba(14,165,233,0.2)',
    linkHover: '#38bdf8',
    profileBg: 'rgba(0,8,20,0.97)',
    badgeBg: '#0ea5e9',
    badgeText: '#fff',
    mobileBg: 'rgba(0,8,20,0.98)',
    glow: '0 0 30px rgba(14,165,233,0.15)',
    adminBg: 'rgba(14,165,233,0.12)',
    adminText: '#38bdf8',
    dotColor: '#0ea5e9',
  },
  {
    name: 'Classic White',
    key: 'white',
    navBg: 'rgba(255,255,255,0.96)',
    border: 'rgba(59,130,246,0.15)',
    text: '#0f172a',
    muted: '#64748b',
    accent: '#2563eb',
    accentHover: '#1d4ed8',
    dropdownBg: '#ffffff',
    dropdownBorder: 'rgba(59,130,246,0.1)',
    linkHover: '#2563eb',
    profileBg: '#ffffff',
    badgeBg: '#2563eb',
    badgeText: '#fff',
    mobileBg: '#ffffff',
    glow: '0 2px 20px rgba(59,130,246,0.08)',
    adminBg: 'rgba(16,185,129,0.08)',
    adminText: '#059669',
    dotColor: '#2563eb',
  },
];

const Navbar = () => {
  const [isOpen, setIsOpen]           = useState(false);
  const [isAboutOpen, setIsAboutOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const { themeIdx, cycleTheme } = useSiteTheme();
  const navigate  = useNavigate();
  const dispatch  = useDispatch();
  const { user }  = useSelector((state) => state.auth);
  const theme     = NAV_THEMES[themeIdx];

  const handleLogout = async () => {
         const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001';
         axios.post(`${BASE_URL}/api/auth/logout`, {}, { withCredentials: true })
    toast.promise(logoutPromise, {
      loading: 'Disconnecting session...',
      success: () => { dispatch(logout()); navigate('/login'); return <b>Logged out!</b>; },
      error:   (err) => <b>Logout failed: {err.response?.data?.message || 'Server Error'}</b>,
    });
  };

  const aboutLinks = [
    { name: 'Brief History', path: '/about/history',   icon: <IoTimeOutline /> },
    { name: 'Programs',      path: '/about/programs',  icon: <IoLibraryOutline /> },
    { name: 'Training',      path: '/about/training',  icon: <IoSchoolOutline /> },
    { name: 'The Order',     path: '/about/the-order', icon: <IoPeopleOutline /> },
  ];

  const linkStyle = (isActive) => ({
    padding: '6px 12px',
    fontSize: 13,
    fontWeight: 700,
    color: isActive ? theme.accent : theme.muted,
    textDecoration: 'none',
    transition: 'color 0.2s ease',
    borderRadius: 8,
  });

  const dropdownItemStyle = {
    display: 'flex', alignItems: 'center', gap: 12,
    padding: '10px 16px', fontSize: 13, fontWeight: 600,
    color: theme.muted, textDecoration: 'none',
    borderRadius: 12, transition: 'all 0.2s ease',
  };

  return (
    <>
      <style>{`
        @keyframes ping { 75%, 100% { transform: scale(2); opacity: 0; } }
        .nav-link-hover:hover { color: var(--accent) !important; }
      `}</style>

      <nav style={{
        position: 'fixed', top: 0, width: '100%', zIndex: 100,
        background: theme.navBg,
        borderBottom: `1px solid ${theme.border}`,
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        boxShadow: theme.glow,
        transition: 'all 0.4s ease',
      }}>
        <div style={{
          width: '100%',
          paddingLeft:  'clamp(16px, 4vw, 48px)',
          paddingRight: 'clamp(16px, 4vw, 48px)',
          boxSizing: 'border-box',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', height: 72, alignItems: 'center', gap: 16 }}>

            {/* ── BRAND ── */}
            <Link to="/" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none', flexShrink: 0 }}>
              <div style={{ position: 'relative' }}>
                <img src="/logo.jpeg" alt="Hospital Logo" style={{ height: 52, width: 'auto', objectFit: 'contain' }} />
                <span style={{ position: 'absolute', top: -2, right: -6, width: 12, height: 12 }}>
                  <span style={{ position: 'absolute', inset: 0, borderRadius: '50%', background: theme.dotColor, opacity: 0.75, animation: 'ping 1.5s cubic-bezier(0,0,0.2,1) infinite' }} />
                  <span style={{ position: 'relative', display: 'flex', width: 12, height: 12, borderRadius: '50%', background: theme.dotColor, border: '2px solid rgba(255,255,255,0.3)' }} />
                </span>
              </div>
            </Link>

            {/* ── DESKTOP NAV LINKS ── */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'nowrap' }}>

              <NavLink to="/" style={({ isActive }) => linkStyle(isActive)}>Home</NavLink>

              {/* About dropdown */}
              <div
                style={{ position: 'relative' }}
                onMouseEnter={() => setIsAboutOpen(true)}
                onMouseLeave={() => setIsAboutOpen(false)}
              >
                <button style={{
                  display: 'flex', alignItems: 'center', gap: 4,
                  padding: '6px 12px', fontSize: 13, fontWeight: 700,
                  color: isAboutOpen ? theme.accent : theme.muted,
                  background: 'none', border: 'none', cursor: 'pointer',
                  transition: 'color 0.2s ease', borderRadius: 8,
                }}>
                  About
                  <IoChevronDown style={{ transition: 'transform 0.2s', transform: isAboutOpen ? 'rotate(180deg)' : 'none' }} />
                </button>
                <AnimatePresence>
                  {isAboutOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}
                      style={{
                        position: 'absolute', top: '100%', left: 0, width: 210,
                        background: theme.dropdownBg,
                        border: `1px solid ${theme.dropdownBorder}`,
                        boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
                        borderRadius: 20, padding: 8, marginTop: 4,
                        backdropFilter: 'blur(20px)',
                      }}
                    >
                      {aboutLinks.map(link => (
                        <Link key={link.name} to={link.path}
                          style={dropdownItemStyle}
                          onMouseEnter={e => { e.currentTarget.style.color = theme.accent; e.currentTarget.style.background = `${theme.accent}14`; }}
                          onMouseLeave={e => { e.currentTarget.style.color = theme.muted; e.currentTarget.style.background = 'transparent'; }}
                        >
                          <span style={{ color: theme.accent }}>{link.icon}</span> {link.name}
                        </Link>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <NavLink to="/services"        style={({ isActive }) => linkStyle(isActive)}>Services</NavLink>
              <NavLink to="/doctors"         style={({ isActive }) => linkStyle(isActive)}>Doctors</NavLink>
              <NavLink to="/journal"         style={({ isActive }) => linkStyle(isActive)}>Journal</NavLink>
              <NavLink to="/new-cru-clinic"  style={({ isActive }) => linkStyle(isActive)}>New Cru</NavLink>
              <NavLink to="/contact"         style={({ isActive }) => linkStyle(isActive)}>Contact</NavLink>

              {/* AI Triage — highlighted link */}
              <NavLink to="/triage" style={({ isActive }) => ({
                display: 'flex', alignItems: 'center', gap: 6,
                padding: '5px 12px', fontSize: 12, fontWeight: 900,
                color: isActive ? theme.badgeText : theme.accent,
                background: isActive ? theme.accent : `${theme.accent}18`,
                borderRadius: 999, textDecoration: 'none',
                border: `1px solid ${theme.accent}44`,
                transition: 'all 0.2s',
              })}>
                <IoMedicalOutline size={13} /> AI Triage
              </NavLink>

              {/* Admin Hub badge */}
              {user?.role === 'admin' && (
                <NavLink to="/admin/dashboard" style={() => ({
                  display: 'flex', alignItems: 'center', gap: 6,
                  padding: '4px 12px', fontSize: 12, fontWeight: 900,
                  color: theme.adminText, background: theme.adminBg,
                  borderRadius: 999, textDecoration: 'none',
                  border: `1px solid ${theme.adminText}33`,
                })}>
                  <IoStatsChartOutline size={14} /> Admin Hub
                </NavLink>
              )}
            </div>

            {/* ── RIGHT: THEME + AUTH ── */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>

              {/* Theme switcher */}
              <motion.button
                onClick={cycleTheme}
                whileTap={{ scale: 0.95 }}
                style={{
                  display: 'flex', alignItems: 'center', gap: 6,
                  padding: '6px 12px', borderRadius: 999,
                  background: 'rgba(255,255,255,0.07)',
                  border: `1px solid ${theme.border}`,
                  cursor: 'pointer', color: theme.text,
                  fontSize: 10, fontWeight: 900, letterSpacing: '0.12em', textTransform: 'uppercase',
                  backdropFilter: 'blur(8px)',
                  transition: 'all 0.3s ease',
                }}
              >
                {NAV_THEMES.map((t, i) => (
                  <span key={i} style={{
                    width: i === themeIdx ? 10 : 6,
                    height: i === themeIdx ? 10 : 6,
                    borderRadius: '50%', background: t.accent,
                    border: i === themeIdx ? `2px solid ${theme.text}` : '2px solid transparent',
                    boxShadow: i === themeIdx ? `0 0 6px ${t.accent}` : 'none',
                    transition: 'all 0.3s ease', display: 'inline-block',
                  }} />
                ))}
                {theme.name}
              </motion.button>

              {/* Logged out */}
              {!user ? (
                <>
                  <Link to="/login" style={{ fontSize: 13, fontWeight: 700, color: theme.muted, textDecoration: 'none' }}>
                    Login
                  </Link>
                  <Link to="/doctors" style={{
                    display: 'flex', alignItems: 'center', gap: 6,
                    padding: '10px 18px',
                    background: theme.badgeBg, color: theme.badgeText,
                    fontSize: 9, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.18em',
                    borderRadius: 12, textDecoration: 'none', transition: 'all 0.3s ease',
                    boxShadow: `0 0 16px ${theme.accent}44`,
                  }}>
                    <IoCalendarOutline size={14} /> Book Now
                  </Link>
                </>
              ) : (
                /* Logged in */
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <NotificationBell />

                  {/* Profile dropdown */}
                  <div
                    style={{ position: 'relative' }}
                    onMouseEnter={() => setIsProfileOpen(true)}
                    onMouseLeave={() => setIsProfileOpen(false)}
                  >
                    <button style={{
                      display: 'flex', alignItems: 'center', gap: 10,
                      padding: '4px 4px 4px 12px',
                      borderRadius: 999, border: `1px solid ${theme.border}`,
                      background: 'rgba(255,255,255,0.05)', cursor: 'pointer',
                      transition: 'all 0.3s ease',
                    }}>
                      <div style={{ textAlign: 'right' }}>
                        <span style={{ display: 'block', fontSize: 10, fontWeight: 900, color: theme.text, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{user.name}</span>
                        <span style={{ display: 'block', fontSize: 8, fontWeight: 700, color: theme.accent, textTransform: 'uppercase', letterSpacing: '0.1em' }}>{user.role}</span>
                      </div>
                      <div style={{
                        width: 38, height: 38, borderRadius: '50%', overflow: 'hidden',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        background: user.role === 'admin' ? theme.accent : theme.badgeBg,
                        color: theme.badgeText, fontWeight: 700, fontSize: 15,
                        flexShrink: 0,
                      }}>
                        {user.image
                          ? <img src={user.image} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                          : user.role === 'admin'
                            ? <IoShieldCheckmarkOutline size={18} />
                            : user.name?.charAt(0)
                        }
                      </div>
                    </button>

                    <AnimatePresence>
                      {isProfileOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: 10, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 10, scale: 0.95 }}
                          style={{
                            position: 'absolute', top: '100%', right: 0, width: 260,
                            background: theme.profileBg,
                            border: `1px solid ${theme.dropdownBorder}`,
                            boxShadow: '0 30px 60px rgba(0,0,0,0.4)',
                            borderRadius: 28, padding: 12, marginTop: 8,
                            backdropFilter: 'blur(24px)',
                          }}
                        >
                          {/* Account info */}
                          <div style={{ padding: '12px 16px', background: `${theme.accent}14`, borderRadius: 16, marginBottom: 8 }}>
                            <p style={{ fontSize: 9, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.2em', color: theme.muted, marginBottom: 4 }}>Account</p>
                            <p style={{ fontSize: 13, fontWeight: 700, color: theme.text, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', margin: 0 }}>{user.email}</p>
                          </div>

                          {/* Menu items */}
                          {[
                            { to: '/profile',         icon: <IoPersonOutline size={17} />,       label: 'My Profile' },
                            { to: '/my-appointments', icon: <IoCalendarOutline size={17} />,     label: 'My Appointments' },
                            { to: '/medical-vault',   icon: <IoFileTrayFullOutline size={17} />, label: 'Medical Vault' },
                            { to: '/triage',          icon: <IoMedicalOutline size={17} />,      label: 'AI Symptom Triage' },
                            { to: '/edit-profile',    icon: <IoSettingsOutline size={17} />,     label: 'Settings' },
                          ].map(item => (
                            <Link key={item.to} to={item.to}
                              style={dropdownItemStyle}
                              onMouseEnter={e => { e.currentTarget.style.color = theme.accent; e.currentTarget.style.background = `${theme.accent}14`; }}
                              onMouseLeave={e => { e.currentTarget.style.color = theme.muted; e.currentTarget.style.background = 'transparent'; }}
                            >
                              <span style={{ color: theme.accent }}>{item.icon}</span> {item.label}
                            </Link>
                          ))}

                          {/* Admin dashboard link */}
                          {user.role === 'admin' && (
                            <Link to="/admin/dashboard"
                              style={{ ...dropdownItemStyle, color: theme.adminText }}
                              onMouseEnter={e => { e.currentTarget.style.background = `${theme.adminText}14`; }}
                              onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}
                            >
                              <IoGridOutline size={17} /> Admin Dashboard
                            </Link>
                          )}

                          {/* Doctor dashboard link */}
                          {user.role === 'doctor' && (
                            <Link to="/doctor/dashboard"
                              style={{ ...dropdownItemStyle }}
                              onMouseEnter={e => { e.currentTarget.style.color = theme.accent; e.currentTarget.style.background = `${theme.accent}14`; }}
                              onMouseLeave={e => { e.currentTarget.style.color = theme.muted; e.currentTarget.style.background = 'transparent'; }}
                            >
                              <IoStatsChartOutline size={17} /> Doctor Dashboard
                            </Link>
                          )}

                          {/* Sign out */}
                          <button onClick={handleLogout} style={{
                            width: '100%', display: 'flex', alignItems: 'center', gap: 12,
                            padding: '10px 16px', fontSize: 13, fontWeight: 600,
                            color: '#f87171', background: 'none', border: 'none', cursor: 'pointer',
                            borderRadius: 12, transition: 'all 0.2s ease',
                            borderTop: `1px solid ${theme.border}`, marginTop: 8,
                          }}
                            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(248,113,113,0.1)'; }}
                            onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}
                          >
                            <IoLogOutOutline size={17} /> Sign Out
                          </button>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              )}

              {/* Hamburger */}
              <button
                onClick={() => setIsOpen(!isOpen)}
                style={{ padding: 8, color: theme.accent, background: 'none', border: 'none', cursor: 'pointer', borderRadius: 10, display: 'none' }}
                className="mobile-menu-btn"
              >
                {isOpen ? <IoClose size={26} /> : <IoMenu size={26} />}
              </button>
            </div>
          </div>
        </div>

        {/* ── MOBILE MENU ── */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }}
              style={{
                background: theme.mobileBg,
                borderBottom: `1px solid ${theme.border}`,
                overflow: 'hidden',
                backdropFilter: 'blur(20px)',
              }}
            >
              <div style={{
                padding: '24px clamp(16px, 6vw, 48px)',
                display: 'flex', flexDirection: 'column', gap: 4, textAlign: 'center',
              }}>
                {[
                  { to: '/',             label: 'Home' },
                  { to: '/services',     label: 'Services' },
                  { to: '/doctors',      label: 'Doctors' },
                  { to: '/journal',      label: 'Journal' },
                  { to: '/new-cru-clinic', label: 'New Cru Clinic' },
                  { to: '/contact',      label: 'Contact Us' },
                  { to: '/triage',       label: '🩺 AI Symptom Triage' },
                ].map(item => (
                  <Link key={item.to} to={item.to} onClick={() => setIsOpen(false)} style={{
                    display: 'block', padding: '10px 0', fontSize: 15, fontWeight: 700,
                    color: theme.muted, textDecoration: 'none', borderRadius: 10,
                    transition: 'color 0.2s ease',
                  }}>
                    {item.label}
                  </Link>
                ))}

                {user?.role === 'admin' && (
                  <Link to="/admin/dashboard" onClick={() => setIsOpen(false)} style={{ display: 'block', padding: '10px 0', fontWeight: 900, color: theme.adminText, textDecoration: 'none' }}>
                    Admin Dashboard
                  </Link>
                )}

                {user?.role === 'doctor' && (
                  <Link to="/doctor/dashboard" onClick={() => setIsOpen(false)} style={{ display: 'block', padding: '10px 0', fontWeight: 900, color: theme.accent, textDecoration: 'none' }}>
                    Doctor Dashboard
                  </Link>
                )}

                {user ? (
                  <>
                    <Link to="/my-appointments" onClick={() => setIsOpen(false)} style={{ display: 'block', padding: '10px 0', fontWeight: 700, color: theme.accent, textDecoration: 'none' }}>My Appointments</Link>
                    <Link to="/medical-vault"   onClick={() => setIsOpen(false)} style={{ display: 'block', padding: '10px 0', fontWeight: 700, color: theme.accent, textDecoration: 'none' }}>Medical Vault</Link>
                    <Link to="/profile"         onClick={() => setIsOpen(false)} style={{ display: 'block', padding: '10px 0', fontWeight: 700, color: theme.accent, textDecoration: 'none' }}>My Profile</Link>
                    <button onClick={() => { setIsOpen(false); handleLogout(); }} style={{ display: 'block', width: '100%', padding: '10px 0', fontWeight: 700, color: '#f87171', background: 'none', border: 'none', cursor: 'pointer', fontSize: 15, borderTop: `1px solid ${theme.border}`, marginTop: 8 }}>
                      Sign Out
                    </button>
                  </>
                ) : (
                  <Link to="/login" onClick={() => setIsOpen(false)} style={{ display: 'block', padding: '10px 0', fontWeight: 700, color: theme.accent, textDecoration: 'none' }}>Sign In</Link>
                )}

                <Link to="/doctors" onClick={() => setIsOpen(false)} style={{
                  display: 'block', padding: '12px 0', fontWeight: 900, color: theme.accent,
                  textDecoration: 'none', borderTop: `1px solid ${theme.border}`, marginTop: 8,
                }}>
                  Book Appointment
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Spacer so content isn't hidden under fixed navbar */}
      <div style={{ height: 72 }} />
    </>
  );
};

export default Navbar;