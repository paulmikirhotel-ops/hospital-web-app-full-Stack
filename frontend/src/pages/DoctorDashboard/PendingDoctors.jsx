import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { IoAlertCircle, IoArrowForward, IoHourglassOutline } from 'react-icons/io5';

// 🚀 Use your centralized API instance
import API from '../../api/axiosConfig';

const PendingDoctors = () => {
    const [pending, setPending] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchPending = async () => {
            try {
                setLoading(true);
                // Endpoint fetches users with role: 'doctor' who don't have a linked Doctor model
                const { data } = await API.get('/admin/pending-doctors');
                if (data.success) {
                    setPending(data.users);
                }
            } catch (err) {
                console.error("Fetch Error:", err);
                // Silently fail if not admin, or show error
                if(err.response?.status === 403) toast.error("Admin access denied");
            } finally {
                setLoading(false);
            }
        };
        fetchPending();
    }, []);

    if (loading) return (
        <div className="bg-slate-50 p-8 rounded-[3rem] animate-pulse border border-slate-100 h-64 flex flex-col items-center justify-center">
            <IoHourglassOutline className="text-slate-300 mb-2 animate-spin" size={24} />
            <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Scanning Registry...</p>
        </div>
    );

    if (pending.length === 0) return (
        <div className="bg-emerald-50 p-8 rounded-[3rem] border border-emerald-100 text-center">
            <p className="text-emerald-700 font-black uppercase text-[10px] tracking-widest">
                ✔ All Specialist Profiles are Up-to-Date
            </p>
        </div>
    );

    return (
        <div className="bg-rose-50 p-8 rounded-[3rem] border border-rose-100 shadow-sm">
            <h3 className="text-rose-900 font-black uppercase text-xs tracking-widest mb-6 flex items-center gap-2">
                <IoAlertCircle size={18} className="text-rose-500" /> 
                Onboarding: Incomplete Doctor Profiles
            </h3>
            
            <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 scrollbar-hide">
                {pending.map(user => (
                    <div 
                        key={user._id} 
                        className="bg-white p-5 rounded-[2rem] flex items-center justify-between shadow-sm border border-rose-100/50 hover:border-rose-200 transition-all group"
                    >
                        <div className="space-y-1">
                            <p className="font-black text-slate-900 leading-none">{user.name}</p>
                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">{user.email}</p>
                        </div>
                        
                        <button 
                            onClick={() => navigate('/admin/add-doctor', { 
                                state: { 
                                    userId: user._id, 
                                    email: user.email, 
                                    name: user.name 
                                } 
                            })}
                            className="w-12 h-12 bg-slate-900 text-white rounded-2xl flex items-center justify-center hover:bg-rose-600 transition-all shadow-lg shadow-slate-200 group-hover:-translate-x-1"
                            title="Complete Medical Profile"
                        >
                            <IoArrowForward size={18} />
                        </button>
                    </div>
                ))}
            </div>
            
            <p className="mt-6 text-[9px] font-bold text-rose-400 uppercase tracking-widest text-center">
                Found {pending.length} account{pending.length > 1 ? 's' : ''} awaiting clinical verification
            </p>
        </div>
    );
};

export default PendingDoctors;