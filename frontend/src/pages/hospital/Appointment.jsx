import React, { useEffect, useState, useCallback, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import { 
  IoCalendarOutline, IoTimeOutline, 
  IoLocationOutline, IoWalletOutline,
  IoArrowBackOutline
} from 'react-icons/io5';

import API from '../../api/axiosConfig';

const Appointment = () => {
  const { docId } = useParams();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  
  const dateSection = useRef(null);
  const timeSection = useRef(null);
  const reviewSection = useRef(null);

  const [docInfo, setDocInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [docSlots, setDocSlots] = useState([]);
  const [slotIndex, setSlotIndex] = useState(0); 
  const [slotTime, setSlotTime] = useState(''); 
  const [activeStep, setActiveStep] = useState(1);

  const daysOfWeek = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

  const handleStepClick = (ref, stepNumber) => {
    ref.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    setActiveStep(stepNumber);
  };

  const getAvailableSlots = useCallback(async () => {
    let today = new Date();
    let allSlots = [];

    for (let i = 0; i < 7; i++) {
      let currentDate = new Date(today);
      currentDate.setDate(today.getDate() + i);

      let endTime = new Date(currentDate);
      endTime.setHours(21, 0, 0, 0); 

      if (i === 0) {
        let startHour = Math.max(today.getHours() + 1, 10);
        currentDate.setHours(startHour);
        currentDate.setMinutes(today.getMinutes() > 30 ? 0 : 30);
        if (today.getMinutes() > 30) currentDate.setHours(currentDate.getHours() + 1);
      } else {
        currentDate.setHours(10);
        currentDate.setMinutes(0);
      }

      let timeSlots = [];
      while (currentDate < endTime) {
        timeSlots.push({
          datetime: new Date(currentDate),
          time: currentDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })
        });
        currentDate.setMinutes(currentDate.getMinutes() + 30);
      }
      if (timeSlots.length > 0) allSlots.push(timeSlots);
    }
    setDocSlots(allSlots);
  }, []);

  const fetchDocInfo = useCallback(async () => {
    try {
      setLoading(true);
      const { data } = await API.get(`/doctors/get-doctor/${docId}`);
      
      // Inside fetchDocInfo in Appointment.jsx
if (data.success && data.doctor) {
  const doctorData = data.doctor;
  
  // Use the fee from DB, OR 50 if it's missing for some reason
  const finalFee = doctorData.fee ?? 50; 

  setDocInfo({
    ...doctorData,
    fee: finalFee
  });
}
      
      if (data.success && data.doctor) {
        // 🚀 DATA NORMALIZATION: Ensure 'fee' is at the top level of docInfo
        const normalizedDoctor = {
            ...data.doctor,
            fee: data.doctor.fee || data.doctor.consultationFee || 0
        };
        setDocInfo(normalizedDoctor);
        await getAvailableSlots();
      } else {
        toast.error("Specialist profile is currently offline.");
        navigate('/doctors');
      }
    } catch (e) {
      console.error("Fetch Error:", e);
      toast.error("Could not load specialist details.");
      navigate('/doctors');
    } finally {
      setLoading(false);
    }
  }, [docId, navigate, getAvailableSlots]);

  useEffect(() => {
    if (docId) fetchDocInfo();
  }, [docId, fetchDocInfo]);

  const handleBooking = async () => {
    if (!user) {
      toast.error("Please login to book");
      return navigate('/login');
    }

    // 🚀 THE FIX: Use the normalized fee
    const bookingAmount = docInfo?.fee;

    if (!bookingAmount || bookingAmount === 0) {
      toast.error("Pricing error: Consultation fee not recognized. Please refresh.");
      return;
    }

    if (!slotTime) return toast.error("Please select a time");

    const loadingToast = toast.loading("Processing Appointment...");
    
    try {
      const dateObj = docSlots[slotIndex][0].datetime;
      const readableDate = dateObj.toLocaleDateString('en-US', { 
          weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' 
      });

      const { data } = await API.post('/appointments/book', {
        doctorId: docId,
        date: readableDate,
        slot: slotTime,
        amount: Number(bookingAmount) 
      });
      
      if (data.success) {
        toast.success("Appointment Confirmed!", { id: loadingToast });
        navigate('/my-appointments');
      }
    } catch (e) {
      toast.error(e.response?.data?.message || "Booking failed", { id: loadingToast });
    }
  };

  if (loading) return (
    <div className="h-screen flex flex-col items-center justify-center bg-white">
        <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="font-black text-[10px] uppercase tracking-widest text-slate-400">Loading Clinical Profile...</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F9FBFF] py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-slate-400 font-bold text-[10px] uppercase tracking-widest hover:text-blue-600 mb-8 transition-all">
            <IoArrowBackOutline /> Return to Specialists
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2 space-y-6">
            
            <div className="bg-white p-8 rounded-[3rem] shadow-sm border border-slate-100 flex flex-col md:flex-row gap-8 items-center">
              <img 
                src={docInfo?.userId?.image || '/default-avatar.png'} 
                className="w-32 h-32 rounded-[2.5rem] object-cover bg-slate-50 border-4 border-white shadow-md" 
                alt="Doctor" 
              />
              <div className="flex-1 text-center md:text-left">
                <h1 className="text-3xl font-black text-slate-900 mb-1">
                  Dr. {docInfo?.userId?.name || 'Medical Specialist'}
                </h1>
                <p className="text-blue-600 font-black text-[10px] uppercase tracking-widest mb-4">
                  {docInfo?.specialization}
                </p>
                <div className="flex flex-wrap justify-center md:justify-start gap-3">
                  <span className="px-4 py-2 bg-slate-50 rounded-full text-slate-400 text-[9px] font-black uppercase flex items-center gap-2">
                    <IoWalletOutline /> ${docInfo?.fee} Consultation
                  </span>
                  <span className="px-4 py-2 bg-slate-50 rounded-full text-slate-400 text-[9px] font-black uppercase flex items-center gap-2">
                    <IoLocationOutline /> Hospital Main Wing
                  </span>
                </div>
              </div>
            </div>

            {/* Date Selection */}
            <div ref={dateSection} className={`bg-white p-10 rounded-[3rem] border transition-all ${activeStep === 1 ? 'border-blue-500 ring-4 ring-blue-50' : 'border-slate-100 opacity-60'}`}>
                <h3 className="text-[10px] font-black text-slate-900 uppercase tracking-widest mb-8">01. Choose Date</h3>
                <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
                  {docSlots.map((item, index) => (
                    <button key={index} onClick={() => { setSlotIndex(index); setSlotTime(''); handleStepClick(timeSection, 2); }}
                      className={`flex-shrink-0 w-20 py-6 rounded-[2rem] border-2 transition-all ${slotIndex === index ? 'bg-blue-600 text-white border-blue-600 shadow-lg' : 'bg-white text-slate-300 border-slate-50 hover:border-slate-200'}`}>
                      <p className="text-[8px] font-black mb-1">{item[0] && daysOfWeek[item[0].datetime.getDay()]}</p>
                      <p className="text-2xl font-black">{item[0] && item[0].datetime.getDate()}</p>
                    </button>
                  ))}
                </div>
            </div>

            {/* Time Selection */}
            <div ref={timeSection} className={`bg-white p-10 rounded-[3rem] border transition-all ${activeStep === 2 ? 'border-blue-500 ring-4 ring-blue-50' : 'border-slate-100 opacity-60'}`}>
                <h3 className="text-[10px] font-black text-slate-900 uppercase tracking-widest mb-8">02. Choose Time</h3>
                <div className="grid grid-cols-3 md:grid-cols-5 gap-3">
                  {docSlots[slotIndex]?.map((item) => (
                    <button key={item.time} onClick={() => { setSlotTime(item.time); handleStepClick(reviewSection, 3); }}
                      className={`py-4 rounded-xl text-[10px] font-black transition-all ${slotTime === item.time ? 'bg-slate-900 text-white scale-105 shadow-md' : 'bg-slate-50 text-slate-400 hover:bg-slate-100'}`}>
                      {item.time}
                    </button>
                  ))}
                </div>
            </div>
          </div>

          {/* Sidebar Review */}
          <div ref={reviewSection} className="lg:col-span-1">
            <div className={`bg-white p-8 rounded-[3rem] shadow-2xl border sticky top-10 transition-all ${activeStep === 3 ? 'border-blue-600' : 'border-slate-100'}`}>
              <h3 className="text-xl font-black text-slate-900 mb-8">Summary</h3>
              
              <div className="space-y-4 mb-8">
                <div className="p-5 bg-slate-50 rounded-[2rem] flex justify-between items-center">
                  <div>
                    <p className="text-[8px] font-black text-slate-400 uppercase">Date</p>
                    <span className="text-xs font-black">{docSlots[slotIndex]?.[0]?.datetime.toDateString() || 'Pending...'}</span>
                  </div>
                  <IoCalendarOutline className="text-blue-600" />
                </div>

                <div className="p-5 bg-slate-50 rounded-[2rem] flex justify-between items-center">
                  <div>
                    <p className="text-[8px] font-black text-slate-400 uppercase">Time</p>
                    <span className="text-xs font-black text-blue-600">{slotTime || 'Not Set'}</span>
                  </div>
                  <IoTimeOutline className="text-blue-600" />
                </div>

                <div className="pt-6 border-t border-slate-100 flex justify-between items-end">
                  <span className="text-[10px] font-black text-slate-400 uppercase">Amount Due</span>
                  <span className="text-3xl font-black text-slate-900 tracking-tighter">${docInfo?.fee || 0}</span>
                </div>
              </div>

              <button 
                disabled={!slotTime} 
                onClick={handleBooking} 
                className="w-full py-6 bg-blue-600 text-white font-black rounded-[2rem] text-[10px] uppercase tracking-[0.2em] shadow-xl disabled:opacity-20 transition-all hover:bg-slate-900 active:scale-95"
              >
                Book Appointment
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Appointment;