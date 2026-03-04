import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  IoSearchOutline, IoChevronForward, 
  IoTimeOutline, IoMedkitOutline, IoFilterOutline 
} from 'react-icons/io5';
import API from '../../api/axiosConfig';

const Doctors = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchName, setSearchName] = useState('');
  const [specialty, setSpecialty] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [direction, setDirection] = useState(0); 
  const doctorsPerPage = 6;

  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

// frontend/src/pages/Doctors.jsx

const fetchDoctors = async () => {
    setLoading(true);
    try {
        const params = {};
        if (searchName) params.name = searchName;
        if (specialty) params.specialization = specialty;

        // 1. Fixed the URL to include '/list'
        const response = await API.get('/doctors/list', { params });

        // 2. Fixed Data Extraction: Pointing to response.data.doctors
        if (response.data.success) {
            setDoctors(response.data.doctors);
        } else {
            setDoctors([]);
        }

        setCurrentPage(1); 
    } catch (err) {
        console.error("Fetch Error:", err);
        setDoctors([]); 
    } finally {
        setTimeout(() => setLoading(false), 400);
    }
};

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchDoctors();
    }, 400);
    return () => clearTimeout(delayDebounceFn);
  }, [searchName, specialty]);

  // --- PAGINATION LOGIC ---
  const indexOfLastDoctor = currentPage * doctorsPerPage;
  const indexOfFirstDoctor = indexOfLastDoctor - doctorsPerPage;
  // 🚀 Fix: Added optional chaining to prevent crash if doctors is null
  const currentDoctors = doctors?.slice(indexOfFirstDoctor, indexOfLastDoctor) || [];
  const totalPages = Math.ceil(doctors.length / doctorsPerPage);

  const slideVariants = {
    enter: (dir) => ({ x: dir > 0 ? 50 : -50, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (dir) => ({ x: dir < 0 ? 50 : -50, opacity: 0 }),
  };

  return (
    <div className="min-h-screen bg-[#FDFDFD] py-12 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        
        <header className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-12">
          <div className="space-y-2">
            <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight">
              Our <span className="text-blue-600">Specialists</span>
            </h1>
            <p className="text-slate-400 font-medium max-w-md italic">
              {user ? `Welcome, ${user.name.split(' ')[0]}. Select a specialist below.` : "Access world-class healthcare providers."}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="relative group flex-grow md:flex-grow-0">
              <IoSearchOutline className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input 
                type="text" 
                placeholder="Search by name..." 
                value={searchName}
                onChange={(e) => setSearchName(e.target.value)}
                className="pl-12 pr-6 py-4 bg-white border border-slate-200 rounded-2xl outline-none w-full md:w-72 text-sm font-bold shadow-sm focus:border-blue-500 transition-all"
              />
            </div>

            <div className="relative flex-grow md:flex-grow-0">
              <IoFilterOutline className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              <select 
                value={specialty} 
                onChange={(e) => setSpecialty(e.target.value)}
                className="pl-12 pr-10 py-4 bg-white border border-slate-200 rounded-2xl outline-none text-[10px] font-black text-slate-600 uppercase tracking-widest cursor-pointer shadow-sm appearance-none hover:border-blue-400 transition-all"
              >
                <option value="">All Specialties</option>
                <option value="General Physician">General Physician</option>
                <option value="Gynecologist">Gynecologist</option>
                <option value="Dermatologist">Dermatologist</option>
                <option value="Pediatrician">Pediatrician</option>
                <option value="Neurologist">Neurologist</option>
                <option value="Cardiologist">Cardiologist</option>
              </select>
            </div>
          </div>
        </header>

        <div className="min-h-[500px]">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-[400px] bg-slate-100 animate-pulse rounded-[3rem]"></div>
              ))}
            </div>
          ) : currentDoctors.length > 0 ? (
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={currentPage + specialty}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.4, ease: "anticipate" }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
              >
                {currentDoctors.map((doctor) => (
                  <div 
                    key={doctor._id} 
                    className="bg-white rounded-[2.5rem] border border-slate-100 p-4 hover:shadow-2xl hover:shadow-blue-900/5 transition-all group cursor-pointer"
                    onClick={() => navigate(`/appointment/${doctor._id}`)}
                  >
                    <div className="relative aspect-square rounded-[2rem] overflow-hidden bg-slate-100 mb-6">
                      <img 
                        src={doctor.image} 
                        alt={doctor.name} 
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                      />
                      <div className="absolute bottom-4 left-4">
                        <span className="bg-blue-600 text-white px-4 py-2 rounded-xl text-[8px] font-black uppercase tracking-widest">
                          {doctor.specialization}
                        </span>
                      </div>
                    </div>

                    <div className="px-4 pb-4">
                      <div className="flex items-center gap-2 mb-1">
                        <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Available Now</span>
                      </div>
                      <h3 className="text-2xl font-black text-slate-900">Dr. {doctor.name}</h3>
                      <p className="text-slate-400 text-xs font-bold mt-1">{doctor.qualification}</p>
                      
                      <div className="flex items-center justify-between mt-6 pt-6 border-t border-slate-50">
                        <span className="text-lg font-black text-slate-900">${doctor.fee}<span className="text-[10px] text-slate-400">/visit</span></span>
                        <div className="w-10 h-10 rounded-full bg-slate-900 text-white flex items-center justify-center group-hover:bg-blue-600 transition-colors">
                            <IoChevronForward />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </motion.div>
            </AnimatePresence>
          ) : (
            <div className="flex flex-col items-center justify-center py-40 bg-slate-50 rounded-[4rem] border-2 border-dashed border-slate-200">
              <IoMedkitOutline size={40} className="text-slate-300 mb-4" />
              <h3 className="text-xl font-black text-slate-900 uppercase tracking-tighter">No results found</h3>
              <p className="text-slate-400 text-sm font-medium">Try checking your spelling or changing the specialty.</p>
              <button 
                onClick={() => {setSearchName(''); setSpecialty('')}} 
                className="mt-6 px-8 py-3 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-600 transition-all"
              >
                Reset All Filters
              </button>
            </div>
          )}
        </div>

        {/* PAGINATION */}
        {totalPages > 1 && !loading && (
          <div className="flex justify-center items-center gap-3 mt-16">
            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i}
                onClick={() => {
                  setDirection(i + 1 > currentPage ? 1 : -1);
                  setCurrentPage(i + 1);
                }}
                className={`w-12 h-12 rounded-2xl font-black text-xs transition-all ${
                  currentPage === i + 1 
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-200 scale-110' 
                  : 'bg-white text-slate-400 border border-slate-100 hover:border-blue-200'
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Doctors;