import React, { useEffect, useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { 
  IoStatsChartOutline, IoDocumentTextOutline, 
  IoPeopleOutline, IoSettingsOutline, IoLogOutOutline,
  IoAddCircleOutline, IoMailOutline, IoMedicalOutline
} from 'react-icons/io5';

const AdminLayout = () => {
  const navigate = useNavigate();
  const [unreadCount, setUnreadCount] = useState(0);

  // Fetch inquiry count from backend
  useEffect(() => {
    const fetchCount = async () => {
      try {
        const { data } = await axios.get('http://localhost:5001/api/auth/inquiries', { withCredentials: true });
        // For now, we show total count. If you add a 'status' field later, 
        // you can filter by 'unread'.
        setUnreadCount(data.length);
      } catch (error) {
        console.error("Error fetching inquiry count");
      }
    };

    fetchCount();
    // Refresh count every 2 minutes
    const interval = setInterval(fetchCount, 120000);
    return () => clearInterval(interval);
  }, []);

  const menuItems = [
    { name: 'Analytics', path: '/admin/dashboard', icon: <IoStatsChartOutline /> },
    { 
      name: 'Clinical Inquiries', 
      path: '/admin/inquiries', 
      icon: <IoMailOutline />,
      badge: unreadCount 
    },
    { name: 'Manage Services', path: '/admin/services', icon: <IoMedicalOutline /> }, 
    { name: 'Manage Journal', path: '/admin/manage-blogs', icon: <IoDocumentTextOutline /> },
    { name: 'Add Member', path: '/admin/add-admin', icon: <IoPeopleOutline /> },
    { name: 'Settings', path: '/admin/settings', icon: <IoSettingsOutline /> },
  ];

  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* SIDEBAR */}
      <aside className="w-72 bg-slate-900 text-white fixed h-full z-50">
        <div className="p-8">
          <div className="flex items-center gap-3 mb-10">
            <div className="w-3 h-8 bg-blue-500 rounded-full"></div>
            <span className="font-black text-xl tracking-tighter uppercase">SJCH ADMIN</span>
          </div>

          <nav className="space-y-2">
            {menuItems.map((item) => (
              <NavLink
                key={item.name}
                to={item.path}
                className={({ isActive }) => 
                  `flex items-center justify-between px-4 py-3.5 rounded-xl transition-all font-bold text-sm ${
                    isActive ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/50' : 'text-slate-400 hover:bg-slate-800'
                  }`
                }
              >
                <div className="flex items-center gap-4">
                  <span className="text-xl">{item.icon}</span>
                  {item.name}
                </div>
                
                {/* NOTIFICATION BADGE */}
                {item.badge > 0 && (
                  <span className="bg-red-500 text-white text-[10px] font-black px-2 py-0.5 rounded-full min-w-[20px] text-center animate-pulse">
                    {item.badge}
                  </span>
                )}
              </NavLink>
            ))}
          </nav>
        </div>

        <div className="absolute bottom-8 w-full px-8">
          <button className="flex items-center gap-4 text-slate-400 hover:text-red-400 font-bold text-sm transition-colors w-full px-4 py-3 border-t border-slate-800 pt-8">
            <IoLogOutOutline size={20} /> Logout
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 ml-72 p-10">
        <header className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-sm font-black text-slate-400 uppercase tracking-widest">Administrator Portal</h1>
            <p className="text-slate-900 font-bold text-xl">Hospital Command Center</p>
          </div>
          <div className="flex gap-4">
             <button 
              onClick={() => navigate('/admin/inquiries')}
              className="relative flex items-center gap-2 px-6 py-3 bg-white text-slate-900 border border-slate-200 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-50 transition-all shadow-sm"
            >
              <IoMailOutline size={18} /> View Inbox
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white"></span>
              )}
            </button>
            <button 
              onClick={() => navigate('/admin/post-blog')}
              className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl font-black text-[10px] uppercase tracking-widest shadow-lg shadow-blue-200 hover:bg-blue-700 transition-all"
            >
              <IoAddCircleOutline size={18} /> New Publication
            </button>
          </div>
        </header>

        <div className="bg-white rounded-[2.5rem] min-h-[75vh] shadow-sm border border-slate-100 overflow-hidden">
             <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;