import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { IoNotificationsOutline, IoEllipse } from 'react-icons/io5';

const NotificationBell = () => {
    const [notifications, setNotifications] = useState([]);
    const [showDropdown, setShowDropdown] = useState(false);

    const fetchNotifs = async () => {
        try {
            const { data } = await axios.get('http://localhost:5001/api/notifications', { withCredentials: true });
            setNotifications(data.notifications);
        } catch (err) { console.log(err); }
    };

    useEffect(() => {
        fetchNotifs();
        const interval = setInterval(fetchNotifs, 30000); // Poll every 30 seconds
        return () => clearInterval(interval);
    }, []);

    const unreadCount = notifications.filter(n => !n.isRead).length;

    return (
        <div className="relative">
            <button onClick={() => setShowDropdown(!showDropdown)} className="relative p-2 text-slate-600 hover:text-blue-600 transition-colors">
                <IoNotificationsOutline size={24} />
                {unreadCount > 0 && (
                    <span className="absolute top-2 right-2 flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                    </span>
                )}
            </button>

            {showDropdown && (
                <div className="absolute right-0 mt-3 w-80 bg-white rounded-2xl shadow-2xl border border-slate-100 z-50 overflow-hidden">
                    <div className="p-4 border-b border-slate-50 flex justify-between items-center">
                        <h4 className="font-black text-[10px] uppercase tracking-widest text-slate-400">Notifications</h4>
                        {unreadCount > 0 && <span className="text-[10px] font-bold text-blue-600">{unreadCount} New</span>}
                    </div>
                    <div className="max-h-64 overflow-y-auto">
                        {notifications.length > 0 ? notifications.map(n => (
                            <div key={n._id} className={`p-4 border-b border-slate-50 hover:bg-slate-50 transition-colors ${!n.isRead ? 'bg-blue-50/30' : ''}`}>
                                <p className="text-xs font-bold text-slate-800">{n.message}</p>
                                <p className="text-[9px] text-slate-400 mt-1 uppercase font-black">{new Date(n.createdAt).toLocaleString()}</p>
                            </div>
                        )) : (
                            <div className="p-8 text-center text-slate-400 text-xs font-bold uppercase tracking-widest">No alerts</div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default NotificationBell;