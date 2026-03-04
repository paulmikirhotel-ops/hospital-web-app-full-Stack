import React, { useState } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  IoMedicalOutline, IoSend, IoWarningOutline, 
  IoNavigateCircleOutline, IoShieldCheckmarkOutline 
} from 'react-icons/io5';
import toast from 'react-hot-toast';

const SymptomChecker = () => {
    const [symptoms, setSymptoms] = useState('');
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleTriage = async (e) => {
        e.preventDefault();
        if (symptoms.length < 10) return toast.error("Please provide a more detailed description.");

        setLoading(true);
        setResult(null);

        try {
            const { data } = await axios.post(
                'http://localhost:5001/api/ai/triage', 
                { symptoms }, 
                { withCredentials: true }
            );
            setResult(data.triage);
        } catch (err) {
            toast.error("The AI assistant is resting. Please try again later.");
        } finally {
            setLoading(false);
        }
    };

    const getUrgencyColor = (urgency) => {
        switch (urgency?.toLowerCase()) {
            case 'emergency': return 'bg-rose-50 text-rose-600 border-rose-100';
            case 'urgent': return 'bg-amber-50 text-amber-600 border-amber-100';
            default: return 'bg-emerald-50 text-emerald-600 border-emerald-100';
        }
    };

    return (
        <div className="max-w-4xl mx-auto p-6 min-h-[80vh] flex flex-col justify-center">
            <div className="text-center mb-10">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-full text-[10px] font-black uppercase tracking-widest mb-4">
                    <IoShieldCheckmarkOutline /> AI-Powered Triage
                </div>
                <h1 className="text-4xl font-black text-slate-900 tracking-tighter uppercase mb-2">
                    Symptom Checker
                </h1>
                <p className="text-slate-500 font-bold italic">Describe how you feel, and our AI will guide you to the right care.</p>
            </div>

            <div className="bg-white rounded-[3rem] shadow-2xl shadow-blue-100 border border-slate-100 overflow-hidden">
                <form onSubmit={handleTriage} className="p-8 border-b border-slate-50">
                    <label className="block text-[10px] font-black uppercase text-slate-400 mb-4 tracking-widest">
                        Describe your symptoms in detail
                    </label>
                    <div className="relative">
                        <textarea 
                            value={symptoms}
                            onChange={(e) => setSymptoms(e.target.value)}
                            placeholder="e.g., I've had a persistent cough for 3 days and a mild fever..."
                            className="w-full h-40 p-6 rounded-[2rem] bg-slate-50 border-none focus:ring-2 focus:ring-blue-500 transition-all text-slate-700 font-medium resize-none"
                        />
                        <button 
                            disabled={loading}
                            className="absolute bottom-4 right-4 p-4 bg-blue-600 text-white rounded-2xl hover:bg-slate-900 transition-all shadow-lg disabled:bg-slate-300"
                        >
                            {loading ? <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full" /> : <IoSend size={20} />}
                        </button>
                    </div>
                </form>

                <AnimatePresence>
                    {result && (
                        <motion.div 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="p-8 bg-slate-50/50"
                        >
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* URGENCY CARD */}
                                <div className={`p-6 rounded-3xl border ${getUrgencyColor(result.urgency)}`}>
                                    <span className="text-[10px] font-black uppercase tracking-widest opacity-70">Urgency Level</span>
                                    <h3 className="text-2xl font-black uppercase mt-1">{result.urgency}</h3>
                                </div>

                                {/* DEPARTMENT CARD */}
                                <div className="p-6 rounded-3xl border border-blue-100 bg-white text-blue-600">
                                    <span className="text-[10px] font-black uppercase tracking-widest opacity-70 text-slate-400">Recommended Department</span>
                                    <h3 className="text-2xl font-black uppercase mt-1 flex items-center gap-2">
                                        <IoNavigateCircleOutline /> {result.department}
                                    </h3>
                                </div>
                            </div>

                            <div className="mt-6 p-6 bg-white rounded-3xl border border-slate-100">
                                <h4 className="text-[10px] font-black uppercase text-slate-400 mb-2 tracking-widest">AI Guidance</h4>
                                <p className="text-slate-700 font-bold leading-relaxed">{result.advice}</p>
                            </div>

                            <div className="mt-6 flex items-start gap-3 p-4 bg-amber-50 rounded-2xl border border-amber-100">
                                <IoWarningOutline className="text-amber-500 shrink-0" size={20} />
                                <p className="text-[10px] text-amber-700 font-bold italic">{result.disclaimer}</p>
                            </div>

                            <div className="mt-8 flex justify-center">
                                <button 
                                    onClick={() => window.location.href = '/doctors'}
                                    className="px-8 py-4 bg-slate-900 text-white rounded-2xl font-black uppercase text-[10px] tracking-[0.2em] hover:bg-blue-600 transition-all"
                                >
                                    Find {result.department} Specialist
                                </button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default SymptomChecker;