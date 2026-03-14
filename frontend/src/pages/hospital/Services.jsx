import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  IoChevronForwardOutline,
  IoSearchOutline,
  IoCallOutline,
  IoTimeOutline,
  IoStarOutline,
  IoStar,
  IoCheckmarkCircle,
  IoLocationOutline,
  IoFilterOutline,
  IoGridOutline,
  IoListOutline,
  IoHeartOutline,
  IoShieldCheckmarkOutline,
  IoMedicalOutline,
  IoAlertCircleOutline,
  IoCloseOutline,
} from 'react-icons/io5';
import API from '../../api/axiosConfig';

/* ─── ACCREDITATION BANNER ─────────────────────────────────────── */
const AccreditationBanner = () => (
  <div className="bg-blue-900 text-white py-2 px-4 text-center text-xs font-semibold tracking-widest uppercase">
    <span className="opacity-70 mr-2">✦</span>
    JCI Accredited &nbsp;·&nbsp; ISO 9001:2015 Certified &nbsp;·&nbsp; NABH Accredited
    <span className="opacity-70 ml-2">✦</span>
  </div>
);

/* ─── EMERGENCY BAR ─────────────────────────────────────────────── */
const EmergencyBar = () => (
  <motion.div
    initial={{ opacity: 0, y: -10 }}
    animate={{ opacity: 1, y: 0 }}
    className="bg-blue-700 text-white py-2 px-6 flex items-center justify-center gap-3 text-xs font-bold uppercase tracking-widest"
  >
    <span className="inline-block w-2 h-2 rounded-full bg-white animate-pulse" />
    Emergency Hotline: &nbsp;
    <a href="tel:+11800911000" className="underline underline-offset-2 hover:no-underline">
      1-800-911-000
    </a>
    &nbsp;·&nbsp; Open 24 / 7 &nbsp;·&nbsp; Average ER Wait:&nbsp;
    <span className="text-blue-200">12 min</span>
  </motion.div>
);

/* ─── STATS STRIP ────────────────────────────────────────────────── */
const stats = [
  { value: '98.6%', label: 'Patient Satisfaction' },
  { value: '1,200+', label: 'Board-Certified Specialists' },
  { value: '50+', label: 'Clinical Departments' },
  { value: '40 yrs', label: 'Of Excellence' },
];

const StatsStrip = () => (
  <div className="bg-white border-b border-slate-100 py-6 px-4">
    <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
      {stats.map((s) => (
        <div key={s.label}>
          <p className="text-2xl font-black text-blue-700 tracking-tight">{s.value}</p>
          <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mt-1">
            {s.label}
          </p>
        </div>
      ))}
    </div>
  </div>
);

/* ─── CATEGORY FILTERS ───────────────────────────────────────────── */
const CATEGORIES = [
  'All',
  'Cardiology',
  'Neurology',
  'Oncology',
  'Orthopedics',
  'Pediatrics',
  'Radiology',
  'Surgery',
  'Emergency',
];

/* ─── APPOINTMENT MODAL ──────────────────────────────────────────── */
const AppointmentModal = ({ service, onClose }) => {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({ name: '', phone: '', date: '', time: '' });
  const [submitted, setSubmitted] = useState(false);

  const times = ['08:00', '09:30', '11:00', '14:00', '15:30', '17:00'];

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div
      className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="bg-white rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden"
      >
        {/* Header */}
        <div className="bg-blue-700 px-8 py-6 flex items-start justify-between">
          <div>
            <p className="text-blue-200 text-[10px] font-bold uppercase tracking-widest mb-1">
              Book Appointment
            </p>
            <h3 className="text-white text-2xl font-black tracking-tight">
              {service?.title ?? 'Select Department'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-white/60 hover:text-white transition-colors mt-1"
          >
            <IoCloseOutline size={24} />
          </button>
        </div>

        <div className="p-8">
          {submitted ? (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-6"
            >
              <IoCheckmarkCircle className="text-blue-500 mx-auto mb-4" size={56} />
              <h4 className="text-slate-900 font-black text-2xl mb-2">Appointment Confirmed</h4>
              <p className="text-slate-400 text-sm mb-1">
                A confirmation SMS has been sent to <strong>{form.phone}</strong>
              </p>
              <p className="text-slate-400 text-sm">
                Ref # <span className="font-bold text-blue-700">APT-{Math.floor(Math.random() * 90000) + 10000}</span>
              </p>
              <button
                onClick={onClose}
                className="mt-6 bg-blue-700 text-white px-8 py-3 rounded-full font-bold text-sm hover:bg-blue-800 transition-colors"
              >
                Done
              </button>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1 block">
                    Full Name
                  </label>
                  <input
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="Jane Smith"
                    className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1 block">
                    Phone Number
                  </label>
                  <input
                    required
                    type="tel"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    placeholder="+1 (555) 000-0000"
                    className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1 block">
                  Preferred Date
                </label>
                <input
                  required
                  type="date"
                  value={form.date}
                  onChange={(e) => setForm({ ...form, date: e.target.value })}
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2 block">
                  Preferred Time Slot
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {times.map((t) => (
                    <button
                      type="button"
                      key={t}
                      onClick={() => setForm({ ...form, time: t })}
                      className={`py-2 rounded-xl text-sm font-bold border transition-all ${
                        form.time === t
                          ? 'bg-blue-700 text-white border-blue-700'
                          : 'border-slate-200 text-slate-500 hover:border-blue-300 hover:text-blue-600'
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              {/* Insurance note */}
              <div className="flex items-start gap-3 bg-blue-50 rounded-2xl p-4 mt-2">
                <IoShieldCheckmarkOutline className="text-blue-600 flex-shrink-0 mt-0.5" size={18} />
                <p className="text-xs text-blue-700 leading-relaxed">
                  We accept Medicare, Medicaid, and 200+ private insurance plans.
                  Bring your insurance card to your appointment.
                </p>
              </div>

              <button
                type="submit"
                className="w-full bg-blue-700 hover:bg-blue-800 text-white font-black py-4 rounded-2xl transition-all active:scale-[0.98] tracking-wide text-sm"
              >
                Confirm Appointment
              </button>
            </form>
          )}
        </div>
      </motion.div>
    </div>
  );
};

/* ─── RATING STARS ───────────────────────────────────────────────── */
const Stars = ({ rating = 4.8 }) => {
  const full = Math.floor(rating);
  return (
    <span className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <span key={i} className={i < full ? 'text-blue-500' : 'text-slate-200'}>
          {i < full ? <IoStar size={11} /> : <IoStarOutline size={11} />}
        </span>
      ))}
      <span className="text-[10px] text-slate-400 ml-1 font-semibold">{rating}</span>
    </span>
  );
};

/* ─── SERVICE CARD ───────────────────────────────────────────────── */
const ServiceCard = ({ service, index, view, onBook }) => {
  const navigate = useNavigate();

  // Derived mock data
  const rating = (4.5 + (index % 5) * 0.1).toFixed(1);
  const reviewCount = 120 + index * 17;
  const waitTime = `${8 + (index % 5) * 3} min`;
  const specialists = 5 + (index % 10);

  if (view === 'list') {
    return (
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: index * 0.05 }}
        className="bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md hover:border-blue-100 transition-all flex gap-6 p-6 group"
      >
        {/* Icon */}
        <div className="w-16 h-16 rounded-xl bg-slate-50 flex items-center justify-center p-3 flex-shrink-0 group-hover:bg-blue-50 transition-all">
          <img src={service.image} alt={service.title} className="w-full h-full object-contain" />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-4">
            <div>
              <span className="text-[9px] font-black uppercase tracking-widest text-blue-600">
                {service.category || 'Clinical Unit'}
              </span>
              <h3 className="text-lg font-black text-slate-900 mt-0.5 tracking-tight">
                {service.title}
              </h3>
            </div>
            <span className={`flex-shrink-0 text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-full ${
              service.isAvailable
                ? 'bg-blue-50 text-blue-600'
                : 'bg-blue-50 text-blue-400'
            }`}>
              {service.isAvailable ? 'Available' : 'Unavailable'}
            </span>
          </div>

          <p className="text-sm text-slate-400 leading-relaxed line-clamp-2 mt-1 mb-3">
            {service.description}
          </p>

          <div className="flex items-center gap-5 flex-wrap">
            <Stars rating={parseFloat(rating)} />
            <span className="text-[10px] text-slate-400">
              <span className="font-bold text-slate-600">{reviewCount}</span> reviews
            </span>
            <span className="flex items-center gap-1 text-[10px] text-slate-400">
              <IoTimeOutline size={11} />
              Avg wait <span className="font-bold text-slate-600 ml-0.5">{waitTime}</span>
            </span>
            <span className="flex items-center gap-1 text-[10px] text-slate-400">
              <IoMedicalOutline size={11} />
              <span className="font-bold text-slate-600">{specialists}</span> specialists
            </span>
          </div>
        </div>

        <div className="flex flex-col gap-2 flex-shrink-0 justify-center">
          <button
            onClick={() => onBook(service)}
            className="bg-blue-700 hover:bg-blue-800 text-white text-xs font-black px-4 py-2 rounded-xl transition-colors whitespace-nowrap"
          >
            Book Now
          </button>
          <button
            onClick={() => navigate(`/services/${service._id}`)}
            className="border border-slate-200 text-slate-500 text-xs font-bold px-4 py-2 rounded-xl hover:border-blue-300 hover:text-blue-600 transition-colors whitespace-nowrap"
          >
            Learn More
          </button>
        </div>
      </motion.div>
    );
  }

  // Grid view
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08 }}
      className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm hover:shadow-xl hover:border-blue-100 transition-all cursor-pointer group flex flex-col"
    >
      {/* Top row: icon + status */}
      <div className="flex items-start justify-between mb-6">
        <div className="w-16 h-16 rounded-2xl bg-slate-50 flex items-center justify-center p-3 group-hover:bg-blue-50 transition-all">
          <img src={service.image} alt={service.title} className="w-full h-full object-contain" />
        </div>
        <span className={`text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-full ${
          service.isAvailable
            ? 'bg-blue-50 text-blue-600'
            : 'bg-blue-50 text-blue-400'
        }`}>
          {service.isAvailable ? 'Available' : 'Unavailable'}
        </span>
      </div>

      {/* Category */}
      <span className="text-[9px] font-black uppercase tracking-[0.2em] text-blue-600">
        {service.category || 'Clinical Unit'}
      </span>

      {/* Title */}
      <h3 className="text-xl font-black text-slate-900 mt-1 mb-2 tracking-tight leading-tight">
        {service.title}
      </h3>

      {/* Description */}
      <p className="text-sm text-slate-400 leading-relaxed line-clamp-2 mb-4 flex-1">
        {service.description}
      </p>

      {/* Rating + reviews */}
      <div className="flex items-center gap-3 mb-3 pb-3 border-b border-slate-100">
        <Stars rating={parseFloat(rating)} />
        <span className="text-[10px] text-slate-400">
          ({reviewCount} reviews)
        </span>
      </div>

      {/* Meta */}
      <div className="flex items-center gap-4 mb-5 text-[10px] text-slate-400">
        <span className="flex items-center gap-1">
          <IoTimeOutline size={11} />
          Wait: <span className="font-bold text-slate-600 ml-0.5">{waitTime}</span>
        </span>
        <span className="flex items-center gap-1">
          <IoMedicalOutline size={11} />
          <span className="font-bold text-slate-600">{specialists}</span> Specialists
        </span>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3">
        <button
          onClick={(e) => { e.stopPropagation(); onBook(service); }}
          className="flex-1 bg-blue-700 hover:bg-blue-800 text-white text-xs font-black py-2.5 rounded-2xl transition-colors"
        >
          Book Appointment
        </button>
        <button
          onClick={() => navigate(`/services/${service._id}`)}
          className="w-10 h-10 rounded-full bg-slate-100 group-hover:bg-blue-600 group-hover:text-white flex items-center justify-center transition-all flex-shrink-0"
        >
          <IoChevronForwardOutline size={16} />
        </button>
      </div>
    </motion.div>
  );
};

/* ─── TRUST BADGES ───────────────────────────────────────────────── */
const TrustBadges = () => (
  <div className="max-w-7xl mx-auto mt-20 grid grid-cols-2 md:grid-cols-4 gap-6">
    {[
      { icon: <IoShieldCheckmarkOutline size={28} />, label: 'HIPAA Compliant', sub: 'Patient privacy protected' },
      { icon: <IoMedicalOutline size={28} />, label: '24/7 Telehealth', sub: 'Virtual visits available' },
      { icon: <IoLocationOutline size={28} />, label: '5 Locations', sub: 'Across the metro area' },
      { icon: <IoHeartOutline size={28} />, label: 'Patient-First Care', sub: 'Compassionate & evidence-based' },
    ].map((b) => (
      <div
        key={b.label}
        className="bg-white rounded-2xl border border-slate-100 p-5 flex items-start gap-4"
      >
        <div className="text-blue-600 flex-shrink-0 mt-0.5">{b.icon}</div>
        <div>
          <p className="text-sm font-black text-slate-900">{b.label}</p>
          <p className="text-[10px] text-slate-400 mt-0.5">{b.sub}</p>
        </div>
      </div>
    ))}
  </div>
);

/* ─── CTA BANNER ─────────────────────────────────────────────────── */
const CTABanner = () => (
  <div className="max-w-7xl mx-auto mt-16 bg-blue-700 rounded-[2.5rem] p-10 md:p-14 flex flex-col md:flex-row items-center justify-between gap-8">
    <div>
      <p className="text-blue-200 text-[10px] font-black uppercase tracking-widest mb-2">
        Need Guidance?
      </p>
      <h3 className="text-white text-3xl font-black tracking-tight mb-2">
        Not sure which department?
      </h3>
      <p className="text-blue-200 text-sm max-w-md">
        Our patient navigators are available 24/7 to help route you to the right specialist.
      </p>
    </div>
    <div className="flex flex-col sm:flex-row gap-3 flex-shrink-0">
      <a
        href="tel:+11800911000"
        className="flex items-center gap-2 bg-white text-blue-700 font-black px-6 py-3 rounded-2xl text-sm hover:bg-blue-50 transition-colors"
      >
        <IoCallOutline size={18} />
        Call Us
      </a>
      <button className="flex items-center gap-2 bg-blue-600 text-white font-black px-6 py-3 rounded-2xl text-sm border border-blue-500 hover:bg-blue-500 transition-colors">
        <IoMedicalOutline size={18} />
        Online Symptom Check
      </button>
    </div>
  </div>
);

/* ─── MAIN COMPONENT ─────────────────────────────────────────────── */
const Services = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [view, setView] = useState('grid'); // 'grid' | 'list'
  const [filterAvailable, setFilterAvailable] = useState(false);
  const [bookingService, setBookingService] = useState(null);
  const [sortBy, setSortBy] = useState('default'); // 'default' | 'rating' | 'name'

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const { data } = await API.get('/services/list');
        if (data.success) setServices(data.services);
      } catch (err) {
        console.error('Fetch error:', err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchServices();
    window.scrollTo(0, 0);
  }, []);

  // Filtered + sorted services
  const filtered = services
    .filter((s) => {
      const matchesSearch =
        s.title.toLowerCase().includes(search.toLowerCase()) ||
        s.description?.toLowerCase().includes(search.toLowerCase());
      const matchesCategory =
        activeCategory === 'All' || s.category === activeCategory;
      const matchesAvailable = !filterAvailable || s.isAvailable;
      return matchesSearch && matchesCategory && matchesAvailable;
    })
    .sort((a, b) => {
      if (sortBy === 'name') return a.title.localeCompare(b.title);
      return 0;
    });

  if (loading) return (
    <div className="h-screen flex items-center justify-center bg-slate-50">
      <div className="flex flex-col items-center gap-4">
        <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
          Loading Departments…
        </p>
      </div>
    </div>
  );

  return (
    <>
      {/* Top trust strips */}
      <AccreditationBanner />
      <EmergencyBar />

      <div className="min-h-screen bg-slate-50">
        <StatsStrip />

        <div className="pt-16 pb-24 px-4 md:px-12">
          <div className="max-w-7xl mx-auto">

            {/* HEADER */}
            <div className="mb-12 text-center">
              <div className="inline-flex items-center gap-2 bg-blue-50 rounded-full px-4 py-1.5 mb-4">
                <IoCheckmarkCircle className="text-blue-600" size={14} />
                <span className="text-[10px] font-black uppercase tracking-widest text-blue-600">
                  Clinical Infrastructure
                </span>
              </div>
              <h1 className="text-6xl font-black text-slate-900 tracking-tighter mb-4">
                Our Services
              </h1>
              <p className="text-slate-400 max-w-xl mx-auto text-sm leading-relaxed">
                World-class medical departments staffed by board-certified specialists
                using cutting-edge technology. All departments are JCI-accredited.
              </p>
            </div>

            {/* SEARCH + FILTERS BAR */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 mb-6 flex flex-col md:flex-row gap-3 items-center">
              {/* Search */}
              <div className="relative flex-1 w-full">
                <IoSearchOutline
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  size={18}
                />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search departments or treatments…"
                  className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-800 placeholder-slate-300 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                />
              </div>

              {/* Available toggle */}
              <button
                onClick={() => setFilterAvailable(!filterAvailable)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-xs font-bold transition-all ${
                  filterAvailable
                    ? 'bg-blue-50 border-blue-200 text-blue-700'
                    : 'border-slate-200 text-slate-500 hover:border-slate-300'
                }`}
              >
                <IoAlertCircleOutline size={14} />
                Available Only
              </button>

              {/* Sort */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 focus:outline-none focus:border-blue-400 bg-white"
              >
                <option value="default">Sort: Default</option>
                <option value="name">Sort: A–Z</option>
              </select>

              {/* View toggle */}
              <div className="flex items-center gap-1 bg-slate-100 rounded-xl p-1">
                <button
                  onClick={() => setView('grid')}
                  className={`p-2 rounded-lg transition-all ${view === 'grid' ? 'bg-white shadow-sm text-blue-600' : 'text-slate-400 hover:text-slate-600'}`}
                >
                  <IoGridOutline size={16} />
                </button>
                <button
                  onClick={() => setView('list')}
                  className={`p-2 rounded-lg transition-all ${view === 'list' ? 'bg-white shadow-sm text-blue-600' : 'text-slate-400 hover:text-slate-600'}`}
                >
                  <IoListOutline size={16} />
                </button>
              </div>
            </div>

            {/* CATEGORY PILLS */}
            <div className="flex gap-2 overflow-x-auto pb-2 mb-8 scrollbar-hide">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`flex-shrink-0 px-4 py-2 rounded-full text-[11px] font-black uppercase tracking-widest transition-all ${
                    activeCategory === cat
                      ? 'bg-blue-700 text-white'
                      : 'bg-white border border-slate-200 text-slate-500 hover:border-blue-300 hover:text-blue-600'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* RESULTS COUNT */}
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-6">
              {filtered.length} department{filtered.length !== 1 ? 's' : ''} found
            </p>

            {/* SERVICES */}
            {filtered.length === 0 ? (
              <div className="text-center py-24">
                <IoAlertCircleOutline className="text-slate-300 mx-auto mb-4" size={48} />
                <p className="text-slate-400 font-black uppercase tracking-widest text-sm">
                  No services match your search.
                </p>
                <button
                  onClick={() => { setSearch(''); setActiveCategory('All'); setFilterAvailable(false); }}
                  className="mt-4 text-blue-600 text-sm font-bold hover:underline"
                >
                  Clear filters
                </button>
              </div>
            ) : view === 'grid' ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filtered.map((service, index) => (
                  <ServiceCard
                    key={service._id}
                    service={service}
                    index={index}
                    view="grid"
                    onBook={setBookingService}
                  />
                ))}
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                {filtered.map((service, index) => (
                  <ServiceCard
                    key={service._id}
                    service={service}
                    index={index}
                    view="list"
                    onBook={setBookingService}
                  />
                ))}
              </div>
            )}

            {/* TRUST + CTA */}
            <TrustBadges />
            <CTABanner />

            {/* DISCLAIMER */}
            <p className="text-center text-[10px] text-slate-300 mt-12 leading-relaxed max-w-2xl mx-auto">
              All information provided is for general informational purposes only and does not constitute
              medical advice. In a life-threatening emergency, call 911 immediately.
              © {new Date().getFullYear()} City General Hospital. All rights reserved.
            </p>
          </div>
        </div>
      </div>

      {/* BOOKING MODAL */}
      <AnimatePresence>
        {bookingService && (
          <AppointmentModal
            service={bookingService}
            onClose={() => setBookingService(null)}
          />
        )}
      </AnimatePresence>
    </>
  );
};

export default Services;