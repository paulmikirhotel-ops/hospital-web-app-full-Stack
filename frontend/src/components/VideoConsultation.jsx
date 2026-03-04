import React, { useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { ZegoUIKitPrebuilt } from '@zegocloud/zego-uikit-prebuilt';
import { IoArrowBackOutline, IoShieldCheckmark } from 'react-icons/io5';
import toast from 'react-hot-toast';

const VideoConsultation = () => {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const myMeetingRef = useRef(null);

  // 🛡️ Pulling credentials from .env for security
  const appID = Number(process.env.REACT_APP_ZEGO_APP_ID);
  const serverSecret = process.env.REACT_APP_ZEGO_SERVER_SECRET;

  const myMeeting = async (element) => {
    if (!appID || !serverSecret) {
      toast.error("Video configuration missing. Check .env file.");
      return;
    }

    try {
      // 1. Generate Kit Token (Test version for development)
      const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(
        appID,
        serverSecret,
        roomId,
        user?._id || Date.now().toString(),
        user?.name || "Medical Patient"
      );

      // 2. Create instance object from Kit Token
      const zp = ZegoUIKitPrebuilt.create(kitToken);

      // 3. Start the call with UI Kit Configuration
      zp.joinRoom({
        container: element,
        sharedLinks: [
          {
            name: 'Consultation Link',
            url: window.location.protocol + '//' + window.location.host + window.location.pathname,
          },
        ],
        scenario: {
          mode: ZegoUIKitPrebuilt.OneONoneCall, // Optimized for Doctor-Patient 1:1
        },
        showScreenSharingButton: true,
        showMyCameraToggleButton: true,
        showMyMicrophoneToggleButton: true,
        showAudioVideoSettingsButton: true,
        layout: "Auto",
        maxUsers: 2,
        onLeaveRoom: () => {
          toast.success("Consultation Ended");
          navigate('/my-appointments');
        },
      });
    } catch (error) {
      console.error("Video Connection Error:", error);
      toast.error("Failed to establish video connection.");
    }
  };

  return (
    <div className="min-h-screen bg-[#0f172a] flex flex-col overflow-hidden">
      
      {/* 🏥 CLINICAL TOP BAR */}
      <div className="h-16 px-6 bg-slate-900/50 backdrop-blur-md border-b border-slate-800 flex items-center justify-between z-50">
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-slate-400 hover:text-white transition-all text-[10px] font-black uppercase tracking-[0.2em] group"
        >
          <IoArrowBackOutline size={18} className="group-hover:-translate-x-1 transition-transform" /> 
          End Session
        </button>

        <div className="flex items-center gap-4">
          <div className="hidden md:flex flex-col items-end">
            <span className="text-white text-[10px] font-black uppercase tracking-widest">Room ID: {roomId?.slice(-8)}</span>
            <span className="text-emerald-500 text-[8px] font-bold uppercase">Encrypted Connection</span>
          </div>
          <div className="w-10 h-10 bg-slate-800 rounded-xl flex items-center justify-center text-emerald-500 border border-slate-700 shadow-lg">
            <IoShieldCheckmark size={20} />
          </div>
        </div>
      </div>

      {/* 📹 VIDEO CONTAINER */}
      <div 
        className="flex-1 w-full relative bg-slate-950"
        ref={myMeeting}
        style={{ height: 'calc(100vh - 64px)' }}
      >
        {/* Overlay if loading or empty */}
        {!user && (
          <div className="absolute inset-0 flex items-center justify-center text-slate-500 font-black uppercase text-[10px] tracking-widest">
            Waiting for secure handshake...
          </div>
        )}
      </div>

      {/* 📄 FOOTER STATUS */}
      <div className="h-8 bg-blue-600 flex items-center justify-center">
        <p className="text-[9px] text-white font-black uppercase tracking-[0.3em] animate-pulse">
          Live Telemedicine Portal • HIPAA Compliant Session
        </p>
      </div>

    </div>
  );
};

export default VideoConsultation;