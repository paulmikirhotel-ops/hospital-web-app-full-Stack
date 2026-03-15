import React, { useEffect, useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  IoStatsChartOutline, IoDocumentTextOutline,
  IoPeopleOutline, IoSettingsOutline, IoLogOutOutline,
  IoAddCircleOutline, IoMailOutline, IoMedicalOutline,
  IoMenuOutline, IoCloseOutline, IoChevronForwardOutline,
} from 'react-icons/io5';
import { MdOutlinePersonPin } from 'react-icons/md';
import { AnimatePresence, motion } from 'framer-motion';

const AdminLayout = () => {
  const navigate    = useNavigate();
  const [unreadCount, setUnreadCount] = useState(0);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const fetchCount = async () => {
      try {
        const { data } = await axios.get(
          'https://hospital-web-app-full-stack-1.onrender.com/api/auth/inquiries',
          { withCredentials: true }
        );
        setUnreadCount(data.length);
      } catch { /* silent */ }
    };
    fetchCount();
    const iv = setInterval(fetchCount, 120000);
    return () => clearInterval(iv);
  }, []);

  const menuItems = [
    { name: 'Analytics',         path: '/admin/dashboard',       icon: <IoStatsChartOutline /> },
    { name: 'Clinical Inquiries', path: '/admin/inquiries',       icon: <IoMailOutline />, badge: unreadCount },
    { name: 'Manage Services',   path: '/admin/services',         icon: <IoMedicalOutline /> },
    { name: 'Manage Doctors',    path: '/admin/manage-doctors',   icon: <MdOutlinePersonPin /> },
    { name: 'Manage Journal',    path: '/admin/manage-blogs',     icon: <IoDocumentTextOutline /> },
    { name: 'Add Member',        path: '/admin/add-admin',        icon: <IoPeopleOutline /> },
    { name: 'Settings',          path: '/admin/settings',         icon: <IoSettingsOutline /> },
  ];

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="p-6 lg:p-8 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-3 h-8 bg-blue-500 rounded-full" />
          <span className="font-black text-lg lg:text-xl tracking-tighter uppercase text-white">SJCH ADMIN</span>
        </div>
        {/* Close btn — mobile only */}
        <button
          className="lg:hidden text-slate-400 hover:text-white p-1"
          onClick={() => setSidebarOpen(false)}
        >
          <IoCloseOutline size={24} />
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-4 space-y-1 overflow-y-auto">
        {menuItems.map(item => (
          <NavLink
            key={item.name}
            to={item.path}
            onClick={() => setSidebarOpen(false)}
            className={({ isActive }) =>
              `flex items-center justify-between px-4 py-3.5 rounded-xl transition-all font-bold text-sm ${
                isActive
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/50'
                  : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`
            }
          >
            <div className="flex items-center gap-3">
              <span className="text-xl flex-shrink-0">{item.icon}</span>
              <span className="truncate">{item.name}</span>
            </div>
            {item.badge > 0 && (
              <span className="bg-red-500 text-white text-[10px] font-black px-2 py-0.5 rounded-full min-w-[20px] text-center animate-pulse flex-shrink-0">
                {item.badge}
              </span>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Logout */}
      <div className="p-6 border-t border-slate-800">
        <button className="flex items-center gap-3 text-slate-400 hover:text-red-400 font-bold text-sm transition-colors w-full px-4 py-3">
          <IoLogOutOutline size={20} /> Logout
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-slate-50">

      {/* ── DESKTOP SIDEBAR (fixed, always visible ≥ lg) ── */}
      <aside className="hidden lg:flex flex-col w-72 bg-slate-900 text-white fixed h-full z-50">
        <SidebarContent />
      </aside>

      {/* ── MOBILE SIDEBAR (slide-in drawer) ── */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 z-40 lg:hidden"
              onClick={() => setSidebarOpen(false)}
            />
            {/* Drawer */}
            <motion.aside
              key="drawer"
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="fixed top-0 left-0 h-full w-72 bg-slate-900 text-white z-50 lg:hidden shadow-2xl"
            >
              <SidebarContent />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* ── MAIN CONTENT ── */}
      <main className="flex-1 lg:ml-72 min-w-0">

        {/* ── TOP HEADER ── */}
        <header className="sticky top-0 z-30 bg-white/90 backdrop-blur border-b border-slate-100 px-4 lg:px-10 py-4 flex items-center justify-between gap-4">

          {/* Left: hamburger (mobile) + title */}
          <div className="flex items-center gap-3 min-w-0">
            <button
              className="lg:hidden flex-shrink-0 w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center text-slate-600 hover:bg-slate-200 transition-all"
              onClick={() => setSidebarOpen(true)}
            >
              <IoMenuOutline size={22} />
            </button>
            <div className="min-w-0">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest hidden sm:block">Administrator Portal</p>
              <p className="text-slate-900 font-black text-base lg:text-xl truncate">Hospital Command Center</p>
            </div>
          </div>

          {/* Right: action buttons */}
          <div className="flex items-center gap-2 lg:gap-4 flex-shrink-0">
            <button
              onClick={() => navigate('/admin/inquiries')}
              className="relative flex items-center gap-2 px-3 lg:px-6 py-2.5 lg:py-3 bg-white text-slate-900 border border-slate-200 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-50 transition-all shadow-sm"
            >
              <IoMailOutline size={18} />
              <span className="hidden sm:inline">View Inbox</span>
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white" />
              )}
            </button>
            <button
              onClick={() => navigate('/admin/post-blog')}
              className="flex items-center gap-2 px-3 lg:px-6 py-2.5 lg:py-3 bg-blue-600 text-white rounded-xl font-black text-[10px] uppercase tracking-widest shadow-lg shadow-blue-200 hover:bg-blue-700 transition-all"
            >
              <IoAddCircleOutline size={18} />
              <span className="hidden sm:inline">New Publication</span>
            </button>
          </div>
        </header>

        {/* ── PAGE CONTENT ── */}
        <div className="p-4 lg:p-8">
          <div className="bg-white rounded-[2rem] lg:rounded-[2.5rem] min-h-[75vh] shadow-sm border border-slate-100 overflow-hidden">
            <Outlet />
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;