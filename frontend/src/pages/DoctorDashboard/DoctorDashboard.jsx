import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { 
    IoPlayCircle, IoPeople, IoTimeOutline, 
    IoCheckmarkDoneCircle, IoPulseOutline, IoAlertCircleOutline 
} from 'react-icons/io5';
import { useNavigate } from 'react-router-dom';
import API from '../../api/axiosConfig';

const DoctorDashboard = () => {
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const fetchDoctorAppointments = async () => {
        try {
            setLoading(true);
            const { data } = await API.get('/appointments/doctor-appointments');
            if (data.success) {
                setAppointments(data.appointments);
            }
        } catch (err) {
            toast.error("Could not load your clinical schedule.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDoctorAppointments();
    }, []);

    const startConsultation = async (appointmentId, patientId) => {
        const loadingToast = toast.loading("Initializing secure clinical room...");
        try {
            const { data } = await API.post('/meetings/create', { 
                appointmentId, 
                patientId 
            });

            if (data.success) {
                toast.success("Room Securely Established", { id: loadingToast });
                // Doctor enters the room, triggering the 'active' state for the patient
                navigate(`/video-consultation/${data.roomId}`);
            }
        } catch (err) {
            toast.error("Failed to initialize session.", { id: loadingToast });
        }
    };

    if (loading) return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-white">
            <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Loading Specialist Portal...</p>
        </div>
    );

    return (
        <div className="min-h-screen bg-[#F8FAFC] p-4 lg:p-12">
            <div className="max-w-6xl mx-auto">
                
                {/* Dashboard Header */}
                <header className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-10 h-10 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-blue-200">
                                <IoPulseOutline size={20} />
                            </div>
                            <h1 className="text-4xl font-black text-slate-900 uppercase tracking-tighter">Specialist <span className="text-blue-600">Portal</span></h1>
                        </div>
                        <p className="text-slate-400 font-bold text-[10px] uppercase tracking-[0.3em] ml-1">Central Consultation Management</p>
                    </div>

                    <div className="flex gap-4">
                        <div className="bg-white px-6 py-4 rounded-[1.5rem] border border-slate-100 shadow-sm text-center">
                            <p className="text-[8px] font-black text-slate-400 uppercase mb-1">Total Patients</p>
                            <p className="text-xl font-black text-slate-900">{appointments.length}</p>
                        </div>
                        <div className="bg-blue-600 px-6 py-4 rounded-[1.5rem] shadow-xl shadow-blue-100 text-center">
                            <p className="text-[8px] font-black text-blue-100 uppercase mb-1">Pending Paid</p>
                            <p className="text-xl font-black text-white">
                                {appointments.filter(a => a.payment && a.status === 'Confirmed').length}
                            </p>
                        </div>
                    </div>
                </header>

                {/* Queue List */}
                <div className="space-y-4">
                    <h2 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
                        <IoTimeOutline size={16} /> Incoming Session Queue
                    </h2>

                    {appointments.length > 0 ? appointments.map((appt) => (
                        <div key={appt._id} className={`group bg-white p-6 md:p-8 rounded-[2.5rem] shadow-sm border transition-all flex flex-col md:flex-row items-center justify-between gap-6 ${appt.status === 'Cancelled' ? 'opacity-40 grayscale' : 'hover:border-blue-200 hover:shadow-xl hover:shadow-blue-900/5'}`}>
                            
                            <div className="flex items-center gap-6 w-full md:w-auto">
                                <div className={`w-20 h-20 rounded-[2rem] flex items-center justify-center transition-colors ${appt.payment ? 'bg-blue-50 text-blue-600' : 'bg-slate-50 text-slate-300'}`}>
                                    <IoPeople size={32} />
                                </div>
                                
                                <div className="space-y-1">
                                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Appointment ID: {appt._id.slice(-6).toUpperCase()}</span>
                                    <h3 className="text-2xl font-black text-slate-800 tracking-tight">{appt.patientId?.name || "Private Patient"}</h3>
                                    
                                    <div className="flex flex-wrap gap-3 mt-2">
                                        <div className="flex items-center gap-1.5 px-3 py-1 bg-slate-50 rounded-lg text-[9px] font-black text-slate-500 uppercase">
                                            <IoTimeOutline className="text-blue-600" /> {appt.date} | {appt.slot}
                                        </div>
                                        <div className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase ${appt.payment ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-500'}`}>
                                            {appt.payment ? '✔ Payment Verified' : '✘ Payment Pending'}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-4 w-full md:w-auto">
                                {appt.status === 'Completed' ? (
                                    <div className="flex items-center gap-2 text-emerald-500 font-black text-[10px] uppercase tracking-widest px-6">
                                        <IoCheckmarkDoneCircle size={20} /> Session Concluded
                                    </div>
                                ) : (
                                    <button 
                                        onClick={() => startConsultation(appt._id, appt.patientId?._id)}
                                        disabled={!appt.payment || appt.status === 'Cancelled'}
                                        className={`flex-1 md:flex-none flex items-center justify-center gap-3 px-10 py-5 rounded-2xl font-black uppercase text-[10px] tracking-widest transition-all ${
                                            appt.payment 
                                            ? 'bg-slate-900 text-white hover:bg-blue-600 shadow-xl shadow-slate-200 active:scale-95' 
                                            : 'bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200'
                                        }`}
                                    >
                                        <IoPlayCircle size={20} /> {appt.payment ? 'Initialize Room' : 'Awaiting Payment'}
                                    </button>
                                )}
                            </div>
                        </div>
                    )) : (
                        <div className="bg-white rounded-[3rem] p-20 border-2 border-dashed border-slate-200 text-center">
                            <IoAlertCircleOutline className="mx-auto text-slate-200 mb-4" size={48} />
                            <p className="text-slate-400 font-black uppercase tracking-widest text-xs">Your queue is currently empty</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default DoctorDashboard;