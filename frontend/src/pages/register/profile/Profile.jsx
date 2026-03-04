import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux'; // 🚀 Added
import { setUser } from '../../../redux/features/auth/authSlice'; // 🚀 Added
import { IoPencil, IoCallOutline, IoMailOutline, IoPersonOutline, IoCalendarOutline } from 'react-icons/io5';

const Profile = () => {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const dispatch = useDispatch(); // 🚀 Initialize dispatch

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await axios.get('http://localhost:5001/api/auth/me', {
                    withCredentials: true 
                });
                
                if (res.data.success) {
                    setProfile(res.data.user);
                    // 🚀 Sync with Redux so the rest of the app knows who we are
                    dispatch(setUser(res.data.user)); 
                }
            } catch (err) {
                console.error("Profile Fetch Error:", err);
                // If 401/403, we should probably clear the profile
                setProfile(null);
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, [dispatch]);

    if (loading) return (
        <div className="flex justify-center items-center min-h-[60vh]">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
        </div>
    );

    if (!profile) return (
        <div className="p-10 text-center">
            <p className="text-red-500 mb-4">Session expired or not found. Please login again.</p>
            <button onClick={() => navigate('/login')} className="bg-blue-600 text-white px-6 py-2 rounded-lg font-bold">Login</button>
        </div>
    );

    return (
        <div className="min-h-screen bg-slate-50 p-4 md:p-8 flex justify-center">
            <div className="max-w-2xl w-full bg-white rounded-[3rem] shadow-xl shadow-blue-900/5 overflow-hidden border border-slate-100">
                {/* Visual Header */}
                <div className="h-40 bg-gradient-to-br from-blue-700 via-blue-600 to-indigo-500"></div>

                <div className="px-8 pb-10">
                    <div className="relative flex justify-between items-end -mt-16 mb-8">
                        {/* Avatar Logic */}
                        <div className="w-32 h-32 rounded-[2.5rem] border-8 border-white bg-blue-50 overflow-hidden shadow-2xl">
                            {profile.image ? (
                                <img src={profile.image} alt="Profile" className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-4xl font-black text-blue-600">
                                    {profile.name?.charAt(0)}
                                </div>
                            )}
                        </div>

                        <button 
                            onClick={() => navigate('/edit-profile')}
                            className="flex items-center gap-2 px-8 py-3 bg-slate-900 text-white text-[10px] uppercase tracking-widest font-black rounded-2xl hover:bg-blue-600 hover:-translate-y-1 transition-all shadow-lg shadow-slate-900/20"
                        >
                            <IoPencil size={14} /> Edit Profile
                        </button>
                    </div>

                    <div className="mb-10">
                        <h1 className="text-4xl font-black text-slate-900 tracking-tight">{profile.name}</h1>
                        <div className="flex gap-2 mt-3">
                            <span className="px-4 py-1.5 bg-blue-50 text-blue-600 text-[9px] font-black uppercase tracking-widest rounded-full border border-blue-100">
                                {profile.role}
                            </span>
                            {profile.isProfileComplete && (
                                <span className="px-4 py-1.5 bg-emerald-50 text-emerald-600 text-[9px] font-black uppercase tracking-widest rounded-full border border-emerald-100">
                                    Verified
                                </span>
                            )}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-50/50 p-8 rounded-[2.5rem] border border-slate-100">
                        <InfoCard icon={<IoMailOutline size={20}/>} label="Email Address" value={profile.email} />
                        <InfoCard icon={<IoCallOutline size={20}/>} label="Phone Number" value={profile.phone || "Not provided"} />
                        <InfoCard icon={<IoPersonOutline size={20}/>} label="Gender" value={profile.gender || "Not specified"} />
                        <InfoCard icon={<IoCalendarOutline size={20}/>} label="Date of Birth" value={profile.dob ? new Date(profile.dob).toLocaleDateString() : "Not set"} />
                    </div>
                </div>
            </div>
        </div>
    );
};

const InfoCard = ({ icon, label, value }) => (
    <div className="flex items-center gap-5 p-2">
        <div className="w-12 h-12 flex items-center justify-center bg-white text-blue-600 rounded-2xl shadow-sm border border-slate-100">
            {icon}
        </div>
        <div>
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-0.5">{label}</p>
            <p className="text-slate-800 font-bold text-sm">{value}</p>
        </div>
    </div>
);

export default Profile;