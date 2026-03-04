import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import VideoCall from '../../components/VideoCall';
import { IoArrowBackOutline } from 'react-icons/io5';

const VideoPage = () => {
    const { roomId } = useParams();
    const navigate = useNavigate();
    const { user } = useSelector((state) => state.auth);

    return (
        <div className="min-h-screen bg-slate-950 p-4 lg:p-8 flex flex-col">
            <div className="max-w-7xl mx-auto w-full flex-1 flex flex-col">
                <div className="flex justify-between items-center mb-6">
                    <div className="flex items-center gap-4">
                        <button 
                            onClick={() => navigate('/my-appointments')}
                            className="p-3 bg-slate-800 text-white rounded-2xl hover:bg-red-600 transition-colors"
                        >
                            <IoArrowBackOutline size={20} />
                        </button>
                        <div>
                            <h2 className="text-white text-2xl font-black uppercase tracking-tighter">
                                Live Consultation
                            </h2>
                            <p className="text-blue-400 font-bold text-[10px] uppercase tracking-widest flex items-center gap-2">
                                <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
                                End-to-End Encrypted
                            </p>
                        </div>
                    </div>
                    
                    <div className="hidden md:block px-6 py-3 bg-slate-900 rounded-2xl text-slate-400 text-[10px] font-black uppercase border border-slate-800 tracking-widest">
                        Meeting ID: <span className="text-white ml-2">{roomId}</span>
                    </div>
                </div>

                {/* THE VIDEO ENGINE CONTAINER */}
                <div className="flex-1 bg-slate-900 rounded-[3rem] overflow-hidden border border-slate-800 shadow-2xl relative min-h-[600px]">
                    <VideoCall roomName={roomId} userName={user?.name || "Patient"} />
                </div>
                
                <p className="mt-6 text-center text-slate-600 text-[10px] font-black uppercase tracking-[0.2em]">
                    Privacy Warning: Clinical sessions are strictly confidential. No recording permitted.
                </p>
            </div>
        </div>
    );
};

export default VideoPage;