import { NavLink, Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux'; 
import { logout } from '../redux/features/auth/authSlice'; 
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import toast from 'react-hot-toast';
import NotificationBell from '../pages/medicalVault/NotificationBell/NotificationBell'; 

import { 
  IoChevronDown, IoMenu, IoClose, 
  IoTimeOutline, IoLibraryOutline, IoSchoolOutline, IoPeopleOutline,
  IoCalendarOutline, IoLogOutOutline, IoPersonOutline, 
  IoSettingsOutline, IoShieldCheckmarkOutline, IoGridOutline,
  IoStatsChartOutline, IoFileTrayFullOutline 
} from 'react-icons/io5';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isAboutOpen, setIsAboutOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  
  const navigate = useNavigate();
  const dispatch = useDispatch(); 
  const { user } = useSelector((state) => state.auth);

  const handleLogout = async () => {
    const logoutPromise = axios.post('http://localhost:5001/api/auth/logout', {}, { withCredentials: true });
    
    toast.promise(logoutPromise, {
      loading: 'Disconnecting session...',
      success: () => {
        dispatch(logout()); 
        navigate('/login');
        return <b>Logged out!</b>;
      },
      error: (err) => <b>Logout failed: {err.response?.data?.message || "Server Error"}</b>,
    });
  };

  const aboutLinks = [
    { name: 'Brief History', path: '/about/history', icon: <IoTimeOutline /> },
    { name: 'Programs', path: '/about/programs', icon: <IoLibraryOutline /> },
    { name: 'Training', path: '/about/training', icon: <IoSchoolOutline /> },
    { name: 'The Order', path: '/about/the-order', icon: <IoPeopleOutline /> },
  ];

  const navLinkClass = ({ isActive }) => 
    `px-3 py-2 text-sm font-bold transition-all duration-300 ${
      isActive ? 'text-blue-600' : 'text-slate-500 hover:text-blue-600'
    }`;

  return (
    <>
      <nav className="fixed top-0 w-full z-[100] bg-white border-b border-blue-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          <div className="flex justify-between h-20 items-center">
            
            {/* --- BRAND SECTION --- */}
            <Link to="/" className="flex items-center group">
              <div className="relative flex items-center">
                <img 
                  src="/logo.jpeg" 
                  alt="Hospital Logo" 
                  className="h-14 w-auto object-contain transition-all duration-500 group-hover:scale-105 drop-shadow-md"
                />
                <span className="absolute -right-1.5 -top-0.5 flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-blue-600 border-2 border-white shadow-sm"></span>
                </span>
              </div>
            </Link>

            {/* --- DESKTOP NAVIGATION --- */}
            <div className="hidden lg:flex items-center space-x-1">
              <NavLink to="/" className={navLinkClass}>Home</NavLink>
              
              <div className="relative" onMouseEnter={() => setIsAboutOpen(true)} onMouseLeave={() => setIsAboutOpen(false)}>
                <button className={`flex items-center gap-1 px-3 py-2 text-sm font-bold transition-colors ${isAboutOpen ? 'text-blue-600' : 'text-slate-500'}`}>
                  About <IoChevronDown className={`transition-transform ${isAboutOpen ? 'rotate-180' : ''}`} />
                </button>
                <AnimatePresence>
                  {isAboutOpen && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }} 
                      animate={{ opacity: 1, y: 0 }} 
                      exit={{ opacity: 0, y: 10 }} 
                      className="absolute top-full left-0 w-52 bg-white border border-blue-50 shadow-xl rounded-2xl p-2 mt-1"
                    >
                      {aboutLinks.map((link) => (
                        <Link key={link.name} to={link.path} className="flex items-center gap-3 px-4 py-3 text-sm font-semibold text-slate-600 hover:bg-blue-50 hover:text-blue-600 rounded-xl transition-all">
                          <span className="text-blue-500">{link.icon}</span> {link.name}
                        </Link>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <NavLink to="/services" className={navLinkClass}>Services</NavLink>
              <NavLink to="/doctors" className={navLinkClass}>Doctors</NavLink>
              
              {user?.role === 'admin' && (
                <NavLink to="/admin/dashboard" className={navLinkClass}>
                  <span className="flex items-center gap-1.5 text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100">
                    <IoStatsChartOutline size={16} /> Admin Hub
                  </span>
                </NavLink>
              )}

              <NavLink to="/journal" className={navLinkClass}>Journal</NavLink>
              <NavLink to="/new-cru-clinic" className={navLinkClass}>New Cru Clinic</NavLink>
              <NavLink to="/contact" className={navLinkClass}>Contact Us</NavLink>
            </div>

            {/* --- USER PROFILE / AUTH SECTION --- */}
            <div className="flex items-center gap-3">
              {!user ? (
                <>
                  <Link to="/login" className="hidden sm:block text-sm font-bold text-slate-500 hover:text-blue-600">
                    Login
                  </Link>
                  <Link to="/doctors" className="hidden md:flex items-center gap-2 px-6 py-3 bg-blue-600 text-white text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-slate-900 transition-all shadow-lg shadow-blue-100">
                    <IoCalendarOutline size={16} /> Book Now
                  </Link>
                </>
              ) : (
                <div className="flex items-center gap-4">
                  <NotificationBell />

                  <div className="relative" onMouseEnter={() => setIsProfileOpen(true)} onMouseLeave={() => setIsProfileOpen(false)}>
                    <button className="flex items-center gap-3 pl-3 pr-1 py-1 rounded-full border border-slate-100 hover:bg-slate-50 transition-all">
                      <div className="hidden sm:flex flex-col items-end mr-1">
                        <span className="text-[10px] font-black text-slate-800 leading-none uppercase">{user.name}</span>
                        <span className="text-[8px] font-bold text-blue-500 uppercase tracking-tighter">{user.role}</span>
                      </div>
                      <div className={`w-10 h-10 rounded-full overflow-hidden flex items-center justify-center text-white font-bold shadow-inner ${user.role === 'admin' ? 'bg-slate-900' : 'bg-blue-600'}`}>
                        {user.image ? (
                          <img src={user.image} alt="Profile" className="w-full h-full object-cover" />
                        ) : (
                          user.role === 'admin' ? <IoShieldCheckmarkOutline size={20} /> : user.name?.charAt(0)
                        )}
                      </div>
                    </button>

                    <AnimatePresence>
                      {isProfileOpen && (
                        <motion.div 
                          initial={{ opacity: 0, y: 10, scale: 0.95 }} 
                          animate={{ opacity: 1, y: 0, scale: 1 }} 
                          exit={{ opacity: 0, y: 10, scale: 0.95 }} 
                          className="absolute top-full right-0 w-64 bg-white border border-slate-100 shadow-2xl rounded-[2rem] p-3 mt-2"
                        >
                          <div className="p-4 bg-slate-50 rounded-2xl mb-2">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Account Info</p>
                            <p className="text-sm font-bold text-slate-800 truncate">{user.email}</p>
                          </div>
                          <div className="space-y-1">
                            <Link to="/profile" className="flex items-center gap-3 px-4 py-3 text-sm font-semibold text-slate-600 hover:bg-blue-50 hover:text-blue-600 rounded-xl transition-all">
                              <IoPersonOutline size={18} /> My Profile
                            </Link>
                            
                            <Link to="/my-appointments" className="flex items-center gap-3 px-4 py-3 text-sm font-semibold text-slate-600 hover:bg-blue-50 hover:text-blue-600 rounded-xl transition-all">
                              <IoCalendarOutline size={18} /> My Appointments
                            </Link>

                            <Link to="/medical-vault" className="flex items-center gap-3 px-4 py-3 text-sm font-semibold text-slate-600 hover:bg-blue-50 hover:text-blue-600 rounded-xl transition-all">
                              <IoFileTrayFullOutline size={18} /> Medical Vault
                            </Link>
                            
                            {user.role === 'admin' && (
                              <Link to="/admin/dashboard" className="flex items-center gap-3 px-4 py-3 text-sm font-semibold text-emerald-600 hover:bg-emerald-50 rounded-xl transition-all">
                                <IoGridOutline size={18} /> Admin Dashboard
                              </Link>
                            )}
                            
                            <Link to="/edit-profile" className="flex items-center gap-3 px-4 py-3 text-sm font-semibold text-slate-600 hover:bg-blue-50 hover:text-blue-600 rounded-xl transition-all">
                              <IoSettingsOutline size={18} /> Settings
                            </Link>
                            <button 
                              onClick={handleLogout}
                              className="w-full flex items-center gap-3 px-4 py-3 text-sm font-semibold text-rose-600 hover:bg-rose-50 rounded-xl transition-all mt-2 pt-3 border-t border-slate-50"
                            >
                              <IoLogOutOutline size={18} /> Sign Out
                            </button>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              )}

              <button onClick={() => setIsOpen(!isOpen)} className="lg:hidden p-2 text-blue-900 hover:bg-blue-50 rounded-xl">
                {isOpen ? <IoClose size={28} /> : <IoMenu size={28} />}
              </button>
            </div>
          </div>
        </div>

        {/* --- MOBILE MENU --- */}
        <AnimatePresence>
          {isOpen && (
            <motion.div 
              initial={{ height: 0 }} 
              animate={{ height: 'auto' }} 
              exit={{ height: 0 }} 
              className="lg:hidden bg-white border-b border-blue-50 overflow-hidden"
            >
              <div className="px-6 py-8 space-y-4 text-center font-bold">
                <Link to="/" onClick={() => setIsOpen(false)} className="block py-2 text-slate-600">Home</Link>
                {user?.role === 'admin' && (
                  <Link to="/admin/dashboard" onClick={() => setIsOpen(false)} className="block py-2 text-emerald-600 font-black">Admin Dashboard</Link>
                )}
                <Link to="/services" onClick={() => setIsOpen(false)} className="block py-2 text-slate-600">Services</Link>
                <Link to="/doctors" onClick={() => setIsOpen(false)} className="block py-2 text-slate-600">Doctors</Link>
                
                {user && (
                  <>
                    <Link to="/my-appointments" onClick={() => setIsOpen(false)} className="block py-2 text-blue-600">My Appointments</Link>
                    <Link to="/medical-vault" onClick={() => setIsOpen(false)} className="block py-2 text-blue-600">Medical Vault</Link>
                  </>
                )}
                
                <Link to="/new-cru-clinic" onClick={() => setIsOpen(false)} className="block py-2 text-slate-600">New Cru Clinic</Link>
                <Link to="/contact" onClick={() => setIsOpen(false)} className="block py-2 text-slate-600">Contact Us</Link>
                
                {user ? (
                   <Link to="/profile" onClick={() => setIsOpen(false)} className="block py-2 text-blue-600">My Profile</Link>
                ) : (
                  <Link to="/login" onClick={() => setIsOpen(false)} className="block py-2 text-blue-600">Sign In</Link>
                )}
                
                <Link to="/doctors" onClick={() => setIsOpen(false)} className="block py-4 text-blue-600 border-t border-slate-50">Book Now</Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
      <div className="h-20"></div>
    </>
  );
};

export default Navbar;