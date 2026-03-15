import React, { useEffect, useState, useCallback, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import {
  IoCalendarOutline, IoTimeOutline,
  IoLocationOutline, IoWalletOutline,
  IoArrowBackOutline, IoPersonOutline,
  IoMedicalOutline, IoCheckmarkCircleOutline,
} from 'react-icons/io5';
import API from '../../api/axiosConfig';

const Appointment = () => {
  const { docId }  = useParams();
  const navigate   = useNavigate();
  const { user }   = useSelector(state => state.auth) || {};

  const dateSection   = useRef(null);
  const timeSection   = useRef(null);
  const reviewSection = useRef(null);

  const [docInfo,     setDocInfo]     = useState(null);
  const [loading,     setLoading]     = useState(true);
  const [docSlots,    setDocSlots]    = useState([]);
  const [slotIndex,   setSlotIndex]   = useState(0);
  const [slotTime,    setSlotTime]    = useState('');
  const [activeStep,  setActiveStep]  = useState(1);
  const [booking,     setBooking]     = useState(false);

  const daysOfWeek = ['SUN','MON','TUE','WED','THU','FRI','SAT'];

  const handleStepClick = (ref, stepNumber) => {
    ref.current?.scrollIntoView({ behavior:'smooth', block:'center' });
    setActiveStep(stepNumber);
  };

  /* ── Generate available slots ── */
  const getAvailableSlots = useCallback(async () => {
    const today   = new Date();
    const allSlots = [];
    for (let i = 0; i < 7; i++) {
      const currentDate = new Date(today);
      currentDate.setDate(today.getDate() + i);
      const endTime = new Date(currentDate);
      endTime.setHours(21, 0, 0, 0);

      if (i === 0) {
        const startHour = Math.max(today.getHours() + 1, 10);
        currentDate.setHours(startHour);
        currentDate.setMinutes(today.getMinutes() > 30 ? 0 : 30);
        if (today.getMinutes() > 30) currentDate.setHours(currentDate.getHours() + 1);
      } else {
        currentDate.setHours(10, 0, 0, 0);
      }

      const timeSlots = [];
      while (currentDate < endTime) {
        timeSlots.push({
          datetime: new Date(currentDate),
          time: currentDate.toLocaleTimeString([], { hour:'2-digit', minute:'2-digit', hour12:true }),
        });
        currentDate.setMinutes(currentDate.getMinutes() + 30);
      }
      if (timeSlots.length > 0) allSlots.push(timeSlots);
    }
    setDocSlots(allSlots);
  }, []);

  /* ── Fetch doctor info ── */
  const fetchDocInfo = useCallback(async () => {
    try {
      setLoading(true);
      const { data } = await API.get(`/doctors/get-doctor/${docId}`);
      if (data.success && data.doctor) {
        const doc = data.doctor;
        // image and name are directly on Doctor model now
        setDocInfo({
          ...doc,
          fee: doc.fee ?? 50,
          // fallback: also check userId in case old data
          displayName:  doc.name  || doc.userId?.name  || 'Medical Specialist',
          displayImage: doc.image || doc.userId?.image || '',
        });
        await getAvailableSlots();
      } else {
        toast.error('Specialist profile is currently offline.');
        navigate('/doctors');
      }
    } catch (e) {
      console.error('Fetch Error:', e);
      toast.error('Could not load specialist details.');
      navigate('/doctors');
    } finally {
      setLoading(false);
    }
  }, [docId, navigate, getAvailableSlots]);

  useEffect(() => {
    if (docId) fetchDocInfo();
  }, [docId, fetchDocInfo]);

  /* ── Book appointment ── */
  const handleBooking = async () => {
    if (!user) {
      toast.error('Please login to book an appointment');
      return navigate('/login');
    }
    if (!slotTime) return toast.error('Please select a time slot');

    const loadingToast = toast.loading('Processing Appointment...');
    setBooking(true);
    try {
      const dateObj      = docSlots[slotIndex][0].datetime;
      const readableDate = dateObj.toLocaleDateString('en-US', {
        weekday:'long', year:'numeric', month:'long', day:'numeric',
      });

      const { data } = await API.post('/appointments/book', {
        doctorId: docId,
        date:     readableDate,
        slot:     slotTime,
        amount:   Number(docInfo?.fee || 0),
      });

      if (data.success) {
        toast.success('Appointment Booked!', { id: loadingToast });
        navigate('/my-appointments');
      }
    } catch (e) {
      toast.error(e.response?.data?.message || 'Booking failed. Please try again.', { id: loadingToast });
    } finally {
      setBooking(false);
    }
  };

  /* ── Loading ── */
  if (loading) return (
    <div className="h-screen flex flex-col items-center justify-center bg-white gap-4">
      <div className="relative w-14 h-14">
        <div className="w-14 h-14 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin"/>
        <div className="absolute inset-2 border-4 border-blue-100 border-t-blue-400 rounded-full animate-spin" style={{ animationDirection:'reverse', animationDuration:'0.6s' }}/>
      </div>
      <p className="font-black text-[10px] uppercase tracking-widest text-slate-400">Loading Clinical Profile...</p>
    </div>
  );

  const selectedDate = docSlots[slotIndex]?.[0]?.datetime;

  return (
    <div className="min-h-screen bg-[#F9FBFF] py-12 px-4">
      <div className="max-w-6xl mx-auto">

        {/* Back button */}
        <button onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-slate-400 font-bold text-[10px] uppercase tracking-widest hover:text-blue-600 mb-8 transition-all">
          <IoArrowBackOutline/> Return to Specialists
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-10">

          {/* ── LEFT: Doctor info + date + time ── */}
          <div className="lg:col-span-2 space-y-6">

            {/* Doctor card */}
            <div className="bg-white p-6 lg:p-8 rounded-[3rem] shadow-sm border border-slate-100 flex flex-col sm:flex-row gap-6 lg:gap-8 items-center sm:items-start">
              {/* Doctor image — now uses displayImage (from Doctor model directly) */}
              {docInfo?.displayImage ? (
                <img
                  src={docInfo.displayImage}
                  className="w-28 h-28 lg:w-32 lg:h-32 rounded-[2.5rem] object-cover bg-slate-50 border-4 border-white shadow-md flex-shrink-0"
                  alt={docInfo.displayName}
                />
              ) : (
                <div className="w-28 h-28 lg:w-32 lg:h-32 rounded-[2.5rem] bg-gradient-to-br from-blue-50 to-slate-100 flex items-center justify-center flex-shrink-0 border-4 border-white shadow-md">
                  <IoPersonOutline size={48} className="text-slate-300"/>
                </div>
              )}

              <div className="flex-1 text-center sm:text-left">
                <div className="flex items-center justify-center sm:justify-start gap-2 mb-1">
                  <h1 className="text-2xl lg:text-3xl font-black text-slate-900">
                    Dr. {docInfo?.displayName}
                  </h1>
                  {docInfo?.isApproved === 'approved' && (
                    <IoCheckmarkCircleOutline size={22} className="text-emerald-500 flex-shrink-0" title="Verified Doctor"/>
                  )}
                </div>
                <p className="text-blue-600 font-black text-[10px] uppercase tracking-widest mb-1">{docInfo?.specialization}</p>
                <p className="text-slate-400 text-sm mb-4">{docInfo?.qualification} · {docInfo?.experience}</p>

                <div className="flex flex-wrap justify-center sm:justify-start gap-3">
                  <span className="px-4 py-2 bg-slate-50 rounded-full text-slate-500 text-[9px] font-black uppercase flex items-center gap-2 border border-slate-100">
                    <IoWalletOutline className="text-blue-500"/> ${docInfo?.fee} Consultation Fee
                  </span>
                  <span className="px-4 py-2 bg-slate-50 rounded-full text-slate-500 text-[9px] font-black uppercase flex items-center gap-2 border border-slate-100">
                    <IoLocationOutline className="text-blue-500"/> Hospital Main Wing
                  </span>
                  <span className="px-4 py-2 bg-slate-50 rounded-full text-slate-500 text-[9px] font-black uppercase flex items-center gap-2 border border-slate-100">
                    <IoMedicalOutline className="text-blue-500"/> {docInfo?.specialization}
                  </span>
                </div>

                {/* About */}
                {docInfo?.about && (
                  <p className="text-slate-400 text-sm mt-4 leading-relaxed line-clamp-3 italic">
                    "{docInfo.about}"
                  </p>
                )}
              </div>
            </div>

            {/* Step indicator */}
            <div className="flex items-center gap-3 px-2">
              {[
                { n:1, label:'Choose Date' },
                { n:2, label:'Choose Time' },
                { n:3, label:'Confirm'     },
              ].map((s, i) => (
                <React.Fragment key={s.n}>
                  <div className={`flex items-center gap-2 ${activeStep >= s.n ? 'text-blue-600' : 'text-slate-300'}`}>
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-black border-2 transition-all ${activeStep >= s.n ? 'border-blue-600 bg-blue-600 text-white' : 'border-slate-200 text-slate-300'}`}>
                      {activeStep > s.n ? '✓' : s.n}
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-widest hidden sm:block">{s.label}</span>
                  </div>
                  {i < 2 && <div className={`flex-1 h-0.5 rounded-full transition-all ${activeStep > s.n ? 'bg-blue-600' : 'bg-slate-100'}`}/>}
                </React.Fragment>
              ))}
            </div>

            {/* Date Selection */}
            <div ref={dateSection}
              className={`bg-white p-8 lg:p-10 rounded-[3rem] border-2 transition-all ${activeStep===1?'border-blue-500 ring-4 ring-blue-50/50':'border-slate-100 opacity-70'}`}>
              <h3 className="text-[10px] font-black text-slate-900 uppercase tracking-widest mb-6 flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-blue-600 text-white text-[9px] font-black flex items-center justify-center">1</div>
                Choose Your Date
              </h3>
              <div className="flex gap-3 overflow-x-auto pb-3 scrollbar-hide">
                {docSlots.map((item, index) => (
                  <button key={index}
                    onClick={() => { setSlotIndex(index); setSlotTime(''); handleStepClick(timeSection, 2); }}
                    className={`flex-shrink-0 w-20 py-5 rounded-[2rem] border-2 transition-all ${slotIndex===index?'bg-blue-600 text-white border-blue-600 shadow-lg shadow-blue-200':'bg-white text-slate-400 border-slate-100 hover:border-blue-200 hover:text-slate-600'}`}>
                    <p className="text-[8px] font-black mb-1 uppercase">{item[0] && daysOfWeek[item[0].datetime.getDay()]}</p>
                    <p className="text-2xl font-black">{item[0] && item[0].datetime.getDate()}</p>
                    <p className="text-[8px] font-bold opacity-60 mt-1">{item[0] && item[0].datetime.toLocaleDateString('en-US',{month:'short'})}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Time Selection */}
            <div ref={timeSection}
              className={`bg-white p-8 lg:p-10 rounded-[3rem] border-2 transition-all ${activeStep===2?'border-blue-500 ring-4 ring-blue-50/50':'border-slate-100 opacity-70'}`}>
              <h3 className="text-[10px] font-black text-slate-900 uppercase tracking-widest mb-6 flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-blue-600 text-white text-[9px] font-black flex items-center justify-center">2</div>
                Choose Your Time
              </h3>
              {docSlots[slotIndex]?.length > 0 ? (
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
                  {docSlots[slotIndex].map(item => (
                    <button key={item.time}
                      onClick={() => { setSlotTime(item.time); handleStepClick(reviewSection, 3); }}
                      className={`py-3.5 rounded-xl text-[10px] font-black transition-all ${slotTime===item.time?'bg-slate-900 text-white scale-105 shadow-md':'bg-slate-50 text-slate-500 hover:bg-slate-100 border border-slate-100'}`}>
                      {item.time}
                    </button>
                  ))}
                </div>
              ) : (
                <p className="text-slate-400 text-sm italic text-center py-8">No slots available for this day.</p>
              )}
            </div>
          </div>

          {/* ── RIGHT: Summary card ── */}
          <div ref={reviewSection} className="lg:col-span-1">
            <div className={`bg-white p-6 lg:p-8 rounded-[3rem] shadow-xl border-2 sticky top-6 transition-all ${activeStep===3?'border-blue-600 ring-4 ring-blue-50/50':'border-slate-100'}`}>

              <h3 className="text-xl font-black text-slate-900 mb-2 tracking-tighter">Booking Summary</h3>
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-6">Step 3 · Confirm & Book</p>

              {/* Doctor mini */}
              <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl mb-4 border border-slate-100">
                {docInfo?.displayImage ? (
                  <img src={docInfo.displayImage} className="w-12 h-12 rounded-2xl object-cover flex-shrink-0" alt=""/>
                ) : (
                  <div className="w-12 h-12 rounded-2xl bg-blue-100 flex items-center justify-center flex-shrink-0">
                    <IoPersonOutline size={20} className="text-blue-500"/>
                  </div>
                )}
                <div className="min-w-0">
                  <p className="font-black text-slate-900 text-sm truncate">Dr. {docInfo?.displayName}</p>
                  <p className="text-[10px] text-blue-600 font-bold uppercase tracking-widest truncate">{docInfo?.specialization}</p>
                </div>
              </div>

              <div className="space-y-3 mb-6">
                {/* Date */}
                <div className="p-4 bg-slate-50 rounded-2xl flex justify-between items-center border border-slate-100">
                  <div>
                    <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Date</p>
                    <p className="text-xs font-black text-slate-900">
                      {selectedDate ? selectedDate.toLocaleDateString('en-US',{ weekday:'short', month:'short', day:'numeric' }) : 'Not selected'}
                    </p>
                  </div>
                  <IoCalendarOutline className="text-blue-600" size={18}/>
                </div>

                {/* Time */}
                <div className="p-4 bg-slate-50 rounded-2xl flex justify-between items-center border border-slate-100">
                  <div>
                    <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Time</p>
                    <p className={`text-xs font-black ${slotTime?'text-blue-600':'text-slate-400'}`}>{slotTime||'Not selected'}</p>
                  </div>
                  <IoTimeOutline className="text-blue-600" size={18}/>
                </div>

                {/* Location */}
                <div className="p-4 bg-slate-50 rounded-2xl flex justify-between items-center border border-slate-100">
                  <div>
                    <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Location</p>
                    <p className="text-xs font-black text-slate-900">Hospital Main Wing</p>
                  </div>
                  <IoLocationOutline className="text-blue-600" size={18}/>
                </div>

                {/* Fee */}
                <div className="pt-4 border-t border-slate-100 flex justify-between items-center">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Consultation Fee</span>
                  <span className="text-3xl font-black text-slate-900 tracking-tighter">${docInfo?.fee||0}</span>
                </div>
              </div>

              {/* Checklist */}
              <div className="space-y-2 mb-6">
                {[
                  { done: slotIndex !== null, label:'Date selected'   },
                  { done: !!slotTime,         label:'Time selected'   },
                  { done: !!user,             label:'Logged in'       },
                ].map((item,i) => (
                  <div key={i} className={`flex items-center gap-2 text-[10px] font-black uppercase tracking-widest ${item.done?'text-emerald-500':'text-slate-300'}`}>
                    <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${item.done?'border-emerald-500 bg-emerald-500':'border-slate-200'}`}>
                      {item.done && <span className="text-white text-[8px]">✓</span>}
                    </div>
                    {item.label}
                  </div>
                ))}
              </div>

              <button
                disabled={!slotTime || booking}
                onClick={handleBooking}
                className="w-full py-5 bg-blue-600 text-white font-black rounded-[2rem] text-[10px] uppercase tracking-[0.2em] shadow-xl shadow-blue-200 disabled:opacity-30 disabled:cursor-not-allowed transition-all hover:bg-slate-900 active:scale-95 flex items-center justify-center gap-2">
                {booking
                  ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"/> Booking...</>
                  : <><IoCalendarOutline size={16}/> Confirm Appointment</>
                }
              </button>

              {!user && (
                <p className="text-center text-[10px] text-slate-400 font-bold mt-3">
                  You need to{' '}
                  <button onClick={() => navigate('/login')} className="text-blue-600 font-black hover:underline">login</button>
                  {' '}to book
                </p>
              )}

              <p className="text-center text-[9px] text-slate-300 font-bold uppercase tracking-widest mt-3">
                Walk-ins also welcome
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Appointment;