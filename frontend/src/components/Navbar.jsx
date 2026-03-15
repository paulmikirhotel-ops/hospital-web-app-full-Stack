import { NavLink, Link, useNavigate, useLocation } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
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
    name: 'Dark Gold', key: 'gold',
    navBg: 'rgba(10,7,0,0.92)', border: 'rgba(212,160,23,0.25)',
    text: '#f5e6c0', muted: '#b8922a', accent: '#d4a017',
    dropdownBg: 'rgba(18,12,0,0.97)', dropdownBorder: 'rgba(212,160,23,0.2)',
    profileBg: 'rgba(18,12,0,0.97)', badgeBg: '#d4a017', badgeText: '#0a0700',
    mobileBg: 'rgba(10,7,0,0.98)', glow: '0 0 30px rgba(212,160,23,0.15)',
    adminBg: 'rgba(212,160,23,0.12)', adminText: '#d4a017', dotColor: '#d4a017',
  },
  {
    name: 'Deep Blue', key: 'blue',
    navBg: 'rgba(0,8,20,0.92)', border: 'rgba(14,165,233,0.25)',
    text: '#e0f2fe', muted: '#38bdf8', accent: '#0ea5e9',
    dropdownBg: 'rgba(0,8,20,0.97)', dropdownBorder: 'rgba(14,165,233,0.2)',
    profileBg: 'rgba(0,8,20,0.97)', badgeBg: '#0ea5e9', badgeText: '#fff',
    mobileBg: 'rgba(0,8,20,0.98)', glow: '0 0 30px rgba(14,165,233,0.15)',
    adminBg: 'rgba(14,165,233,0.12)', adminText: '#38bdf8', dotColor: '#0ea5e9',
  },
  {
    name: 'Classic White', key: 'white',
    navBg: 'rgba(255,255,255,0.96)', border: 'rgba(59,130,246,0.15)',
    text: '#0f172a', muted: '#64748b', accent: '#2563eb',
    dropdownBg: '#ffffff', dropdownBorder: 'rgba(59,130,246,0.1)',
    profileBg: '#ffffff', badgeBg: '#2563eb', badgeText: '#fff',
    mobileBg: '#ffffff', glow: '0 2px 20px rgba(59,130,246,0.08)',
    adminBg: 'rgba(16,185,129,0.08)', adminText: '#059669', dotColor: '#2563eb',
  },
];

const Navbar = () => {
  const [isOpen,        setIsOpen]        = useState(false);
  const [isAboutOpen,   setIsAboutOpen]   = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const aboutRef    = useRef(null);
  const profileRef  = useRef(null);
  const aboutTimer  = useRef(null);
  const profileTimer = useRef(null);

  const { themeIdx, cycleTheme } = useSiteTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const theme    = NAV_THEMES[themeIdx];

  // ── Scroll to top on every page change ─────────────────────────────────────
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [location.pathname]);

  // ── Close everything on route change ───────────────────────────────────────
  useEffect(() => {
    setIsOpen(false);
    setIsAboutOpen(false);
    setIsProfileOpen(false);
  }, [location.pathname]);

  // ── Click-outside listener ──────────────────────────────────────────────────
  useEffect(() => {
    const handler = (e) => {
      if (aboutRef.current   && !aboutRef.current.contains(e.target))   setIsAboutOpen(false);
      if (profileRef.current && !profileRef.current.contains(e.target)) setIsProfileOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // ── Cleanup timers ──────────────────────────────────────────────────────────
  useEffect(() => {
    return () => {
      clearTimeout(aboutTimer.current);
      clearTimeout(profileTimer.current);
    };
  }, []);

  // Delayed-close helpers stop accidental close when mouse crosses the gap
  const openAbout    = () => { clearTimeout(aboutTimer.current);   setIsAboutOpen(true);  };
  const closeAbout   = () => { aboutTimer.current   = setTimeout(() => setIsAboutOpen(false),  150); };
  const openProfile  = () => { clearTimeout(profileTimer.current); setIsProfileOpen(true); };
  const closeProfile = () => { profileTimer.current = setTimeout(() => setIsProfileOpen(false), 150); };

  // Close ALL menus instantly (used on every navigation click)
  const closeAll = () => {
    clearTimeout(aboutTimer.current);
    clearTimeout(profileTimer.current);
    setIsAboutOpen(false);
    setIsProfileOpen(false);
    setIsOpen(false);
  };

  const handleLogout = async () => {
    closeAll();
    const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001';
    const logoutPromise = axios.post(`${BASE_URL}/api/auth/logout`, {}, { withCredentials: true });
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

  const profileLinks = [
    { to: '/profile',         icon: <IoPersonOutline size={17}/>,       label: 'My Profile' },
    { to: '/my-appointments', icon: <IoCalendarOutline size={17}/>,     label: 'My Appointments' },
    { to: '/medical-vault',   icon: <IoFileTrayFullOutline size={17}/>, label: 'Medical Vault' },
    { to: '/triage',          icon: <IoMedicalOutline size={17}/>,      label: 'AI Symptom Triage' },
    { to: '/edit-profile',    icon: <IoSettingsOutline size={17}/>,     label: 'Settings' },
  ];

  const linkStyle = (isActive) => ({
    padding: '6px 10px', fontSize: 13, fontWeight: 700,
    color: isActive ? theme.accent : theme.muted,
    textDecoration: 'none', transition: 'color 0.2s ease',
    borderRadius: 8, whiteSpace: 'nowrap',
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
        @keyframes ping { 75%,100%{ transform:scale(2); opacity:0; } }

        .nav-desktop     { display: flex; }
        .mobile-menu-btn { display: none !important; }

        .theme-btn-dots-all   { display: flex; }
        .theme-btn-dot-single { display: none; }
        .theme-btn-label      { display: inline; }

        /* Invisible 12px bridge between nav button and dropdown panel —
           prevents the tiny gap from triggering onMouseLeave */
        .nav-bridge {
          position: absolute; top: 100%; left: 0; right: 0;
          height: 12px; background: transparent; z-index: 299;
        }
        .nav-bridge-right {
          position: absolute; top: 100%; left: 0; right: 0;
          height: 12px; background: transparent; z-index: 299;
        }

        @media (max-width: 900px) {
          .nav-desktop          { display: none !important; }
          .mobile-menu-btn      { display: flex !important; }
          .theme-btn-dots-all   { display: none !important; }
          .theme-btn-dot-single { display: block !important; }
          .theme-btn-label      { display: none !important; }
        }
        @media (max-width: 480px) {
          .nav-login-link    { display: none !important; }
          .nav-book-btn span { display: none; }
        }
      `}</style>

      <nav style={{
        position: 'fixed', top: 0, width: '100%', zIndex: 100,
        background: theme.navBg, borderBottom: `1px solid ${theme.border}`,
        backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)',
        boxShadow: theme.glow, transition: 'all 0.4s ease',
      }}>
        <div style={{ width: '100%', paddingLeft: 'clamp(16px,4vw,48px)', paddingRight: 'clamp(16px,4vw,48px)', boxSizing: 'border-box' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', height: 68, alignItems: 'center', gap: 12 }}>

            {/* BRAND */}
            <Link to="/" onClick={closeAll} style={{ display: 'flex', alignItems: 'center', textDecoration: 'none', flexShrink: 0 }}>
              <div style={{ position: 'relative' }}>
                <img src="/logo.jpeg" alt="Hospital Logo" style={{ height: 'clamp(36px,5vw,52px)', width: 'auto', objectFit: 'contain' }} />
                <span style={{ position: 'absolute', top: -2, right: -6, width: 12, height: 12 }}>
                  <span style={{ position: 'absolute', inset: 0, borderRadius: '50%', background: theme.dotColor, opacity: 0.75, animation: 'ping 1.5s cubic-bezier(0,0,0.2,1) infinite' }} />
                  <span style={{ position: 'relative', display: 'flex', width: 12, height: 12, borderRadius: '50%', background: theme.dotColor, border: '2px solid rgba(255,255,255,0.3)' }} />
                </span>
              </div>
            </Link>

            {/* DESKTOP NAV */}
            <div className="nav-desktop" style={{ alignItems: 'center', gap: 2, flexWrap: 'nowrap', flex: 1, justifyContent: 'center', overflow: 'visible' }}>
              <NavLink to="/" onClick={closeAll} style={({ isActive }) => linkStyle(isActive)}>Home</NavLink>

              {/* ABOUT DROPDOWN */}
              <div
                ref={aboutRef}
                style={{ position: 'relative' }}
                onMouseEnter={openAbout}
                onMouseLeave={closeAbout}
              >
                <button style={{
                  display: 'flex', alignItems: 'center', gap: 4,
                  padding: '6px 10px', fontSize: 13, fontWeight: 700,
                  color: isAboutOpen ? theme.accent : theme.muted,
                  background: 'none', border: 'none', cursor: 'pointer',
                  transition: 'color 0.2s ease', borderRadius: 8, whiteSpace: 'nowrap',
                }}>
                  About
                  <IoChevronDown style={{ transition: 'transform 0.25s', transform: isAboutOpen ? 'rotate(180deg)' : 'none' }} />
                </button>

                {/* Bridge gap */}
                {isAboutOpen && <div className="nav-bridge" />}

                <AnimatePresence>
                  {isAboutOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 6 }}
                      transition={{ duration: 0.14 }}
                      onMouseEnter={() => clearTimeout(aboutTimer.current)}
                      onMouseLeave={closeAbout}
                      style={{
                        position: 'absolute', top: 'calc(100% + 10px)', left: 0,
                        width: 220,
                        background: theme.dropdownBg,
                        border: `1px solid ${theme.dropdownBorder}`,
                        boxShadow: '0 20px 48px rgba(0,0,0,0.28)',
                        borderRadius: 20, padding: 8,
                        backdropFilter: 'blur(20px)',
                        zIndex: 300,
                      }}
                    >
                      {aboutLinks.map(link => (
                        <Link
                          key={link.name}
                          to={link.path}
                          onClick={closeAll}
                          style={dropdownItemStyle}
                          onMouseEnter={e => { e.currentTarget.style.color = theme.accent; e.currentTarget.style.background = `${theme.accent}14`; }}
                          onMouseLeave={e => { e.currentTarget.style.color = theme.muted;  e.currentTarget.style.background = 'transparent'; }}
                        >
                          <span style={{ color: theme.accent }}>{link.icon}</span>
                          {link.name}
                        </Link>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <NavLink to="/services"       onClick={closeAll} style={({ isActive }) => linkStyle(isActive)}>Services</NavLink>
              <NavLink to="/doctors"        onClick={closeAll} style={({ isActive }) => linkStyle(isActive)}>Doctors</NavLink>
              <NavLink to="/journal"        onClick={closeAll} style={({ isActive }) => linkStyle(isActive)}>Journal</NavLink>
              <NavLink to="/new-cru-clinic" onClick={closeAll} style={({ isActive }) => linkStyle(isActive)}>New Cru</NavLink>
              <NavLink to="/contact"        onClick={closeAll} style={({ isActive }) => linkStyle(isActive)}>Contact</NavLink>

              <NavLink to="/triage" onClick={closeAll} style={({ isActive }) => ({
                display: 'flex', alignItems: 'center', gap: 6, padding: '5px 10px', fontSize: 12, fontWeight: 900,
                color: isActive ? theme.badgeText : theme.accent,
                background: isActive ? theme.accent : `${theme.accent}18`,
                borderRadius: 999, textDecoration: 'none',
                border: `1px solid ${theme.accent}44`, transition: 'all 0.2s', whiteSpace: 'nowrap',
              })}>
                <IoMedicalOutline size={13} /> AI Triage
              </NavLink>

              {user?.role === 'admin' && (
                <NavLink to="/admin/dashboard" onClick={closeAll} style={() => ({
                  display: 'flex', alignItems: 'center', gap: 6, padding: '4px 10px',
                  fontSize: 12, fontWeight: 900, color: theme.adminText,
                  background: theme.adminBg, borderRadius: 999, textDecoration: 'none',
                  border: `1px solid ${theme.adminText}33`, whiteSpace: 'nowrap',
                })}>
                  <IoStatsChartOutline size={14} /> Admin Hub
                </NavLink>
              )}
            </div>

            {/* RIGHT SIDE */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>

              {/* Theme switcher */}
              <motion.button onClick={cycleTheme} whileTap={{ scale: 0.92 }} title={`Theme: ${theme.name}`}
                style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 10px', borderRadius: 999, background: 'rgba(255,255,255,0.07)', border: `1px solid ${theme.border}`, cursor: 'pointer', color: theme.text, fontSize: 10, fontWeight: 900, letterSpacing: '0.1em', textTransform: 'uppercase', backdropFilter: 'blur(8px)', transition: 'all 0.3s ease' }}>
                <span className="theme-btn-dots-all" style={{ gap: 5, alignItems: 'center' }}>
                  {NAV_THEMES.map((t, i) => (
                    <span key={i} style={{ width: i === themeIdx ? 10 : 6, height: i === themeIdx ? 10 : 6, borderRadius: '50%', background: t.accent, border: i === themeIdx ? `2px solid ${theme.text}` : '2px solid transparent', boxShadow: i === themeIdx ? `0 0 6px ${t.accent}` : 'none', transition: 'all 0.3s ease', display: 'inline-block', flexShrink: 0 }} />
                  ))}
                </span>
                <span className="theme-btn-dot-single" style={{ width: 10, height: 10, borderRadius: '50%', background: theme.accent, boxShadow: `0 0 8px ${theme.accent}`, flexShrink: 0 }} />
                <span className="theme-btn-label">{theme.name}</span>
              </motion.button>

              {/* NOT LOGGED IN */}
              {!user ? (
                <>
                  <Link to="/login" className="nav-login-link" style={{ fontSize: 13, fontWeight: 700, color: theme.muted, textDecoration: 'none', whiteSpace: 'nowrap' }}>Login</Link>
                  <Link to="/doctors" className="nav-book-btn" style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '9px 16px', background: theme.badgeBg, color: theme.badgeText, fontSize: 9, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.16em', borderRadius: 12, textDecoration: 'none', transition: 'all 0.3s ease', boxShadow: `0 0 16px ${theme.accent}44`, whiteSpace: 'nowrap' }}>
                    <IoCalendarOutline size={14} /> <span>Book Now</span>
                  </Link>
                </>
              ) : (
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <NotificationBell />

                  {/* PROFILE DROPDOWN */}
                  <div
                    ref={profileRef}
                    style={{ position: 'relative' }}
                    onMouseEnter={openProfile}
                    onMouseLeave={closeProfile}
                  >
                    <button
                      onClick={() => setIsProfileOpen(o => !o)}
                      style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '4px 4px 4px 10px', borderRadius: 999, border: `1px solid ${theme.border}`, background: 'rgba(255,255,255,0.05)', cursor: 'pointer', transition: 'all 0.3s ease' }}
                    >
                      <div style={{ textAlign: 'right' }}>
                        <span style={{ display: 'block', fontSize: 10, fontWeight: 900, color: theme.text, textTransform: 'uppercase', letterSpacing: '0.05em', maxWidth: 80, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user.name}</span>
                        <span style={{ display: 'block', fontSize: 8, fontWeight: 700, color: theme.accent, textTransform: 'uppercase', letterSpacing: '0.1em' }}>{user.role}</span>
                      </div>
                      <div style={{ width: 36, height: 36, borderRadius: '50%', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', background: user.role === 'admin' ? theme.accent : theme.badgeBg, color: theme.badgeText, fontWeight: 700, fontSize: 14, flexShrink: 0 }}>
                        {user.image ? <img src={user.image} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : user.role === 'admin' ? <IoShieldCheckmarkOutline size={16} /> : user.name?.charAt(0)}
                      </div>
                    </button>

                    {/* Bridge gap */}
                    {isProfileOpen && <div className="nav-bridge-right" />}

                    <AnimatePresence>
                      {isProfileOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: 6, scale: 0.97 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 6, scale: 0.97 }}
                          transition={{ duration: 0.14 }}
                          onMouseEnter={() => clearTimeout(profileTimer.current)}
                          onMouseLeave={closeProfile}
                          style={{ position: 'absolute', top: 'calc(100% + 10px)', right: 0, width: 260, background: theme.profileBg, border: `1px solid ${theme.dropdownBorder}`, boxShadow: '0 30px 60px rgba(0,0,0,0.4)', borderRadius: 28, padding: 12, backdropFilter: 'blur(24px)', zIndex: 300 }}
                        >
                          <div style={{ padding: '12px 16px', background: `${theme.accent}14`, borderRadius: 16, marginBottom: 8 }}>
                            <p style={{ fontSize: 9, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.2em', color: theme.muted, marginBottom: 4 }}>Account</p>
                            <p style={{ fontSize: 13, fontWeight: 700, color: theme.text, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', margin: 0 }}>{user.email}</p>
                          </div>

                          {profileLinks.map(item => (
                            <Link key={item.to} to={item.to} onClick={closeAll} style={dropdownItemStyle}
                              onMouseEnter={e => { e.currentTarget.style.color = theme.accent; e.currentTarget.style.background = `${theme.accent}14`; }}
                              onMouseLeave={e => { e.currentTarget.style.color = theme.muted;  e.currentTarget.style.background = 'transparent'; }}>
                              <span style={{ color: theme.accent }}>{item.icon}</span> {item.label}
                            </Link>
                          ))}

                          {user.role === 'admin' && (
                            <Link to="/admin/dashboard" onClick={closeAll} style={{ ...dropdownItemStyle, color: theme.adminText }}
                              onMouseEnter={e => { e.currentTarget.style.background = `${theme.adminText}14`; }}
                              onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}>
                              <IoGridOutline size={17} /> Admin Dashboard
                            </Link>
                          )}

                          {user.role === 'doctor' && (
                            <Link to="/doctor/dashboard" onClick={closeAll} style={dropdownItemStyle}
                              onMouseEnter={e => { e.currentTarget.style.color = theme.accent; e.currentTarget.style.background = `${theme.accent}14`; }}
                              onMouseLeave={e => { e.currentTarget.style.color = theme.muted;  e.currentTarget.style.background = 'transparent'; }}>
                              <IoStatsChartOutline size={17} /> Doctor Dashboard
                            </Link>
                          )}

                          <button onClick={handleLogout}
                            style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 12, padding: '10px 16px', fontSize: 13, fontWeight: 600, color: '#f87171', background: 'none', border: 'none', cursor: 'pointer', borderRadius: 12, transition: 'all 0.2s ease', borderTop: `1px solid ${theme.border}`, marginTop: 8 }}
                            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(248,113,113,0.1)'; }}
                            onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}>
                            <IoLogOutOutline size={17} /> Sign Out
                          </button>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              )}

              {/* Hamburger */}
              <button onClick={() => setIsOpen(o => !o)} className="mobile-menu-btn"
                style={{ padding: 8, color: theme.accent, background: 'none', border: 'none', cursor: 'pointer', borderRadius: 10 }}>
                {isOpen ? <IoClose size={26} /> : <IoMenu size={26} />}
              </button>
            </div>
          </div>
        </div>

        {/* MOBILE MENU */}
        <AnimatePresence>
          {isOpen && (
            <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }}
              style={{ background: theme.mobileBg, borderBottom: `1px solid ${theme.border}`, overflow: 'hidden', backdropFilter: 'blur(20px)' }}>
              <div style={{ padding: '20px clamp(16px,6vw,48px) 28px', display: 'flex', flexDirection: 'column', gap: 2 }}>

                {[
                  { to: '/',               label: 'Home' },
                  { to: '/services',       label: 'Services' },
                  { to: '/doctors',        label: 'Doctors' },
                  { to: '/journal',        label: 'Journal' },
                  { to: '/new-cru-clinic', label: 'New Cru Clinic' },
                  { to: '/contact',        label: 'Contact Us' },
                  { to: '/triage',         label: '🩺 AI Symptom Triage' },
                ].map(item => (
                  <Link key={item.to} to={item.to} onClick={closeAll}
                    style={{ display: 'block', padding: '12px 16px', fontSize: 15, fontWeight: 700, color: theme.muted, textDecoration: 'none', borderRadius: 12 }}>
                    {item.label}
                  </Link>
                ))}

                <div style={{ borderTop: `1px solid ${theme.border}`, marginTop: 6, paddingTop: 6 }}>
                  <p style={{ fontSize: 9, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.2em', color: theme.muted, opacity: 0.6, padding: '6px 16px', margin: 0 }}>About</p>
                  {aboutLinks.map(link => (
                    <Link key={link.path} to={link.path} onClick={closeAll}
                      style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 16px', fontSize: 14, fontWeight: 600, color: theme.muted, textDecoration: 'none', borderRadius: 12 }}>
                      <span style={{ color: theme.accent }}>{link.icon}</span>{link.name}
                    </Link>
                  ))}
                </div>

                {user?.role === 'admin' && (
                  <Link to="/admin/dashboard" onClick={closeAll} style={{ display: 'block', padding: '12px 16px', fontWeight: 900, color: theme.adminText, textDecoration: 'none', borderRadius: 12 }}>Admin Dashboard</Link>
                )}
                {user?.role === 'doctor' && (
                  <Link to="/doctor/dashboard" onClick={closeAll} style={{ display: 'block', padding: '12px 16px', fontWeight: 900, color: theme.accent, textDecoration: 'none', borderRadius: 12 }}>Doctor Dashboard</Link>
                )}

                <div style={{ borderTop: `1px solid ${theme.border}`, marginTop: 8, paddingTop: 8, display: 'flex', flexDirection: 'column', gap: 2 }}>
                  {user ? (
                    <>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px', background: `${theme.accent}14`, borderRadius: 16, marginBottom: 4 }}>
                        <div style={{ width: 40, height: 40, borderRadius: '50%', background: theme.badgeBg, display: 'flex', alignItems: 'center', justifyContent: 'center', color: theme.badgeText, fontWeight: 700, fontSize: 16, flexShrink: 0, overflow: 'hidden' }}>
                          {user.image ? <img src={user.image} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : user.name?.charAt(0)}
                        </div>
                        <div>
                          <p style={{ fontSize: 13, fontWeight: 800, color: theme.text, margin: 0 }}>{user.name}</p>
                          <p style={{ fontSize: 10, color: theme.accent, margin: 0, textTransform: 'uppercase', letterSpacing: '0.1em' }}>{user.role}</p>
                        </div>
                      </div>
                      <Link to="/my-appointments" onClick={closeAll} style={{ display: 'block', padding: '11px 16px', fontWeight: 700, color: theme.accent, textDecoration: 'none', borderRadius: 12 }}>My Appointments</Link>
                      <Link to="/medical-vault"   onClick={closeAll} style={{ display: 'block', padding: '11px 16px', fontWeight: 700, color: theme.accent, textDecoration: 'none', borderRadius: 12 }}>Medical Vault</Link>
                      <Link to="/profile"         onClick={closeAll} style={{ display: 'block', padding: '11px 16px', fontWeight: 700, color: theme.accent, textDecoration: 'none', borderRadius: 12 }}>My Profile</Link>
                      <button onClick={() => { closeAll(); handleLogout(); }}
                        style={{ display: 'block', width: '100%', padding: '12px 16px', textAlign: 'left', fontWeight: 700, color: '#f87171', background: 'none', border: 'none', cursor: 'pointer', fontSize: 15, borderRadius: 12 }}>
                        Sign Out
                      </button>
                    </>
                  ) : (
                    <>
                      <Link to="/login"    onClick={closeAll} style={{ display: 'block', padding: '12px 16px', fontWeight: 700, color: theme.accent, textDecoration: 'none', borderRadius: 12 }}>Sign In</Link>
                      <Link to="/register" onClick={closeAll} style={{ display: 'block', padding: '12px 16px', fontWeight: 700, color: theme.muted,  textDecoration: 'none', borderRadius: 12 }}>Create Account</Link>
                    </>
                  )}
                  <Link to="/doctors" onClick={closeAll}
                    style={{ display: 'block', padding: '14px 16px', fontWeight: 900, color: theme.badgeText, background: theme.badgeBg, textDecoration: 'none', borderRadius: 14, textAlign: 'center', marginTop: 6, fontSize: 12, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                    Book Appointment
                  </Link>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      <div style={{ height: 68 }} />
    </>
  );
};

export default Navbar;