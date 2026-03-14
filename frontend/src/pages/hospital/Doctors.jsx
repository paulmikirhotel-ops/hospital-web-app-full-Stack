import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import {
  IoSearchOutline, IoChevronForward, IoMedkitOutline,
  IoFilterOutline, IoStarOutline, IoStar,
  IoTimeOutline, IoPersonOutline, IoCallOutline,
} from 'react-icons/io5';
import API from '../../api/axiosConfig';
import { useSiteTheme } from '../../context/ThemeContext';

// ─── Specialty accent colors ──────────────────────────────────────────────────
const SPECIALTY_COLORS = {
  'General Physician': { bg: '#e0f2fe', text: '#0369a1', dot: '#0ea5e9' },
  'Gynecologist':      { bg: '#fce7f3', text: '#9d174d', dot: '#ec4899' },
  'Dermatologist':     { bg: '#fef3c7', text: '#92400e', dot: '#f59e0b' },
  'Pediatrician':      { bg: '#dcfce7', text: '#166534', dot: '#22c55e' },
  'Neurologist':       { bg: '#ede9fe', text: '#5b21b6', dot: '#8b5cf6' },
  'Cardiologist':      { bg: '#fee2e2', text: '#991b1b', dot: '#ef4444' },
};
const defaultColor = { bg: '#f1f5f9', text: '#475569', dot: '#94a3b8' };

// ─── Doctor Card ──────────────────────────────────────────────────────────────
const DoctorCard = ({ doctor, theme, onClick, idx }) => {
  const [hovered, setHovered] = useState(false);
  const sc = SPECIALTY_COLORS[doctor.specialization] || defaultColor;
  const rating = (4.5 + (doctor._id?.charCodeAt(0) % 5) * 0.1).toFixed(1);
  const reviews = 80 + (doctor._id?.charCodeAt(1) % 120);

  return (
    <motion.div
      initial={{ opacity: 0, y: 32 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: idx * 0.07, type: 'spring', stiffness: 100, damping: 18 }}
      whileHover={{ y: -8 }}
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: theme.siteCard,
        borderRadius: 28,
        border: `1.5px solid ${hovered ? sc.dot : theme.siteBorder}`,
        overflow: 'hidden',
        cursor: 'pointer',
        transition: 'border-color 0.3s ease, box-shadow 0.35s ease',
        boxShadow: hovered
          ? `0 20px 60px ${sc.dot}28, 0 4px 16px rgba(0,0,0,0.06)`
          : '0 2px 12px rgba(0,0,0,0.05)',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Image area */}
      <div style={{ position: 'relative', height: 240, overflow: 'hidden', background: theme.siteAltBg, flexShrink: 0 }}>
        <motion.img
          animate={{ scale: hovered ? 1.07 : 1 }}
          transition={{ duration: 0.55, ease: 'easeOut' }}
          src={doctor.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(doctor.name)}&background=1e3a8a&color=fff&size=400&bold=true`}
          alt={doctor.name}
          style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
        />

        {/* Gradient overlay */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(to top, rgba(15,23,42,0.55) 0%, rgba(15,23,42,0.1) 50%, transparent 100%)',
        }} />

        {/* Specialty badge — top left */}
        <div style={{
          position: 'absolute', top: 14, left: 14,
          display: 'flex', alignItems: 'center', gap: 6,
          padding: '5px 12px', borderRadius: 999,
          background: 'rgba(255,255,255,0.92)',
          backdropFilter: 'blur(8px)',
          border: `1px solid ${sc.dot}33`,
          boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
        }}>
          <div style={{ width: 7, height: 7, borderRadius: '50%', background: sc.dot, boxShadow: `0 0 6px ${sc.dot}` }} />
          <span style={{ fontSize: 9, fontWeight: 900, color: sc.text, textTransform: 'uppercase', letterSpacing: '0.14em' }}>
            {doctor.specialization}
          </span>
        </div>

        {/* Available badge — top right */}
        <div style={{
          position: 'absolute', top: 14, right: 14,
          padding: '5px 11px', borderRadius: 999,
          background: 'rgba(16,185,129,0.14)',
          border: '1px solid rgba(16,185,129,0.3)',
          backdropFilter: 'blur(8px)',
        }}>
          <span style={{ fontSize: 9, fontWeight: 900, color: '#10b981', textTransform: 'uppercase', letterSpacing: '0.12em' }}>
            Available
          </span>
        </div>

        {/* Rating — bottom left over image */}
        <div style={{
          position: 'absolute', bottom: 14, left: 14,
          display: 'flex', alignItems: 'center', gap: 5,
        }}>
          <div style={{ display: 'flex', gap: 2 }}>
            {[1,2,3,4,5].map(i => (
              <span key={i} style={{ color: i <= Math.floor(rating) ? '#fbbf24' : 'rgba(255,255,255,0.4)', fontSize: 11, display: 'flex' }}>
                {i <= Math.floor(rating) ? <IoStar /> : <IoStarOutline />}
              </span>
            ))}
          </div>
          <span style={{ fontSize: 11, fontWeight: 800, color: '#fff' }}>{rating}</span>
          <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.55)' }}>({reviews})</span>
        </div>
      </div>

      {/* Content */}
      <div style={{ padding: '20px 22px 22px', display: 'flex', flexDirection: 'column', flex: 1 }}>
        <div style={{ marginBottom: 14 }}>
          <p style={{ fontSize: 10, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.2em', color: theme.siteMuted, margin: '0 0 5px' }}>
            {doctor.qualification}
          </p>
          <h3 style={{
            fontSize: '1.25rem', fontWeight: 900, color: theme.siteText,
            margin: 0, letterSpacing: '-0.025em', lineHeight: 1.25,
          }}>
            Dr. {doctor.name}
          </h3>
        </div>

        {/* Meta row */}
        <div style={{ display: 'flex', gap: 14, marginBottom: 18 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
            <IoTimeOutline style={{ color: theme.siteMuted, fontSize: 13 }} />
            <span style={{ fontSize: 10, fontWeight: 700, color: theme.siteMuted }}>Mon – Sat</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
            <IoPersonOutline style={{ color: theme.siteMuted, fontSize: 13 }} />
            <span style={{ fontSize: 10, fontWeight: 700, color: theme.siteMuted }}>
              {200 + (doctor._id?.charCodeAt(2) % 300)}+ patients
            </span>
          </div>
        </div>

        {/* Divider */}
        <div style={{ height: 1, background: theme.siteBorder, marginBottom: 18 }} />

        {/* Fee + CTA */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 'auto' }}>
          <div>
            <p style={{ fontSize: 8, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.2em', color: theme.siteMuted, margin: '0 0 2px' }}>Consultation</p>
            <p style={{ fontSize: '1.3rem', fontWeight: 900, color: theme.siteText, margin: 0, letterSpacing: '-0.02em' }}>
              ${doctor.fee}
              <span style={{ fontSize: 10, fontWeight: 700, color: theme.siteMuted }}> /visit</span>
            </p>
          </div>

          <motion.div
            animate={{
              background: hovered ? sc.dot : theme.siteBtnBg,
              scale: hovered ? 1.08 : 1,
            }}
            transition={{ duration: 0.2 }}
            style={{
              width: 44, height: 44, borderRadius: 14,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: '#fff', fontSize: 18,
              boxShadow: hovered ? `0 6px 20px ${sc.dot}50` : 'none',
            }}
          >
            <IoChevronForward />
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

// ─── Skeleton card ────────────────────────────────────────────────────────────
const SkeletonCard = ({ theme }) => (
  <div style={{ background: theme.siteCard, borderRadius: 28, overflow: 'hidden', border: `1px solid ${theme.siteBorder}` }}>
    <div style={{ height: 240, background: theme.siteAltBg, animation: 'pulse 1.5s ease-in-out infinite' }} />
    <div style={{ padding: '20px 22px 22px' }}>
      <div style={{ height: 10, width: '40%', borderRadius: 6, background: theme.siteAltBg, marginBottom: 10, animation: 'pulse 1.5s ease-in-out infinite' }} />
      <div style={{ height: 22, width: '70%', borderRadius: 8, background: theme.siteAltBg, marginBottom: 16, animation: 'pulse 1.5s ease-in-out infinite 0.1s' }} />
      <div style={{ height: 1, background: theme.siteBorder, marginBottom: 16 }} />
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ height: 28, width: '30%', borderRadius: 8, background: theme.siteAltBg, animation: 'pulse 1.5s ease-in-out infinite 0.2s' }} />
        <div style={{ width: 44, height: 44, borderRadius: 14, background: theme.siteAltBg, animation: 'pulse 1.5s ease-in-out infinite 0.3s' }} />
      </div>
    </div>
  </div>
);

// ─── Main Component ───────────────────────────────────────────────────────────
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
  const { siteTheme } = useSiteTheme();

  const fetchDoctors = async () => {
    setLoading(true);
    try {
      const params = {};
      if (searchName) params.name = searchName;
      if (specialty) params.specialization = specialty;
      const response = await API.get('/doctors/list', { params });
      if (response.data.success) setDoctors(response.data.doctors);
      else setDoctors([]);
      setCurrentPage(1);
    } catch {
      setDoctors([]);
    } finally {
      setTimeout(() => setLoading(false), 350);
    }
  };

  useEffect(() => {
    const t = setTimeout(fetchDoctors, 400);
    return () => clearTimeout(t);
  }, [searchName, specialty]);

  const indexOfLast  = currentPage * doctorsPerPage;
  const indexOfFirst = indexOfLast - doctorsPerPage;
  const currentDoctors = doctors?.slice(indexOfFirst, indexOfLast) || [];
  const totalPages = Math.ceil(doctors.length / doctorsPerPage);

  const specialties = ['General Physician', 'Gynecologist', 'Dermatologist', 'Pediatrician', 'Neurologist', 'Cardiologist'];

  const inputBase = {
    background: siteTheme.siteInputBg,
    border: `1.5px solid ${siteTheme.siteInputBorder}`,
    color: siteTheme.siteText,
    borderRadius: 14,
    padding: '13px 16px 13px 44px',
    fontSize: 13,
    fontWeight: 700,
    outline: 'none',
    transition: 'border-color 0.25s ease',
    fontFamily: 'inherit',
    width: '100%',
  };

  return (
    <div style={{ minHeight: '100vh', background: siteTheme.siteBg, transition: 'background 0.5s ease' }}>
      <style>{`
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.45} }
        .doc-input:focus { border-color: ${siteTheme.siteAccent} !important; }
        .spec-btn:hover { background: ${siteTheme.siteAccent} !important; color: #fff !important; border-color: ${siteTheme.siteAccent} !important; }
        .page-btn:hover { background: ${siteTheme.siteAccent} !important; color: #fff !important; }
        .reset-btn:hover { opacity: 0.8; }
      `}</style>

      {/* ── Page header ── */}
      <div style={{
        background: `linear-gradient(135deg, #0f172a 0%, #1e3a8a 65%, #0ea5e9 100%)`,
        padding: '80px 32px 60px',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Decorative circles */}
        <div style={{ position: 'absolute', top: -80, right: -80, width: 320, height: 320, borderRadius: '50%', background: 'rgba(255,255,255,0.04)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: -120, left: '30%', width: 400, height: 400, borderRadius: '50%', background: 'rgba(255,255,255,0.03)', pointerEvents: 'none' }} />

        <div style={{ maxWidth: 1280, margin: '0 auto', position: 'relative', zIndex: 1 }}>
          {/* Eyebrow */}
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
            style={{ display: 'inline-flex', alignItems: 'center', gap: 8, marginBottom: 20, padding: '5px 16px', borderRadius: 999, background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.15)' }}>
            <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#4ade80', boxShadow: '0 0 8px #4ade80' }} />
            <span style={{ fontSize: 9, fontWeight: 900, color: 'rgba(255,255,255,0.75)', textTransform: 'uppercase', letterSpacing: '0.2em' }}>
              Saint Joseph's Catholic Hospital
            </span>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}
            style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'flex-end', justifyContent: 'space-between', gap: 24 }}>
            <div>
              <h1 style={{ fontSize: 'clamp(2.2rem, 5vw, 3.8rem)', fontWeight: 900, color: '#fff', letterSpacing: '-0.04em', margin: '0 0 10px', lineHeight: 1.05 }}>
                Our Medical<br />
                <span style={{ WebkitTextFillColor: 'transparent', background: 'linear-gradient(90deg, #7dd3fc, #a5b4fc)', WebkitBackgroundClip: 'text', backgroundClip: 'text' }}>
                  Specialists
                </span>
              </h1>
              <p style={{ color: 'rgba(255,255,255,0.55)', fontWeight: 500, margin: 0, fontSize: 14, fontStyle: 'italic' }}>
                {user
                  ? `Welcome back, ${user.name.split(' ')[0]}. Find the right specialist for your care.`
                  : 'Expert physicians dedicated to your health and wellbeing.'}
              </p>
            </div>

            {/* Stats row */}
            <div style={{ display: 'flex', gap: 32 }}>
              {[{ label: 'Specialists', value: `${doctors.length || '45'}+` }, { label: 'Specialties', value: '12' }, { label: 'Years Service', value: '60+' }].map(stat => (
                <div key={stat.label} style={{ textAlign: 'center' }}>
                  <p style={{ fontSize: '1.8rem', fontWeight: 900, color: '#fff', margin: 0, letterSpacing: '-0.03em' }}>{stat.value}</p>
                  <p style={{ fontSize: 9, fontWeight: 900, color: 'rgba(255,255,255,0.45)', margin: 0, textTransform: 'uppercase', letterSpacing: '0.2em' }}>{stat.label}</p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* ── Search + Filter bar ── */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.12 }}
            style={{ marginTop: 36, display: 'flex', flexWrap: 'wrap', gap: 12, alignItems: 'center' }}>
            {/* Search input */}
            <div style={{ position: 'relative', flex: '1 1 260px', minWidth: 200 }}>
              <IoSearchOutline style={{ position: 'absolute', left: 15, top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.4)', pointerEvents: 'none', fontSize: 17 }} />
              <input
                type="text"
                placeholder="Search by name..."
                value={searchName}
                onChange={e => setSearchName(e.target.value)}
                className="doc-input"
                style={{ ...inputBase, background: 'rgba(255,255,255,0.08)', border: '1.5px solid rgba(255,255,255,0.15)', color: '#fff', borderRadius: 14 }}
              />
            </div>

            {/* Specialty select */}
            <div style={{ position: 'relative', flex: '0 1 220px', minWidth: 180 }}>
              <IoFilterOutline style={{ position: 'absolute', left: 15, top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.4)', pointerEvents: 'none', fontSize: 16 }} />
              <select
                value={specialty}
                onChange={e => setSpecialty(e.target.value)}
                className="doc-input"
                style={{ ...inputBase, background: 'rgba(255,255,255,0.08)', border: '1.5px solid rgba(255,255,255,0.15)', color: specialty ? '#fff' : 'rgba(255,255,255,0.5)', appearance: 'none', paddingRight: 40, cursor: 'pointer', borderRadius: 14 }}
              >
                <option value="">All Specialties</option>
                {specialties.map(s => <option key={s} value={s} style={{ color: '#0f172a', background: '#fff' }}>{s}</option>)}
              </select>
            </div>
          </motion.div>

          {/* ── Specialty pill filters ── */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.18 }}
            style={{ marginTop: 16, display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            <button
              className="spec-btn"
              onClick={() => setSpecialty('')}
              style={{ padding: '6px 16px', borderRadius: 999, fontSize: 10, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.14em', cursor: 'pointer', transition: 'all 0.2s ease', border: '1px solid rgba(255,255,255,0.2)', background: specialty === '' ? siteTheme.siteAccent : 'rgba(255,255,255,0.08)', color: specialty === '' ? '#fff' : 'rgba(255,255,255,0.65)' }}>
              All
            </button>
            {specialties.map(s => {
              const sc = SPECIALTY_COLORS[s] || defaultColor;
              return (
                <button key={s} className="spec-btn" onClick={() => setSpecialty(specialty === s ? '' : s)}
                  style={{ padding: '6px 16px', borderRadius: 999, fontSize: 10, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.12em', cursor: 'pointer', transition: 'all 0.2s ease', border: `1px solid ${specialty === s ? sc.dot : 'rgba(255,255,255,0.15)'}`, background: specialty === s ? sc.dot : 'rgba(255,255,255,0.07)', color: specialty === s ? '#fff' : 'rgba(255,255,255,0.6)' }}>
                  {s}
                </button>
              );
            })}
          </motion.div>
        </div>
      </div>

      {/* ── Content area ── */}
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '40px 32px 80px' }}>

        {/* Results count */}
        {!loading && doctors.length > 0 && (
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            style={{ fontSize: 11, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.2em', color: siteTheme.siteMuted, marginBottom: 28 }}>
            {doctors.length} specialist{doctors.length !== 1 ? 's' : ''} found
            {specialty ? ` · ${specialty}` : ''}
            {searchName ? ` · "${searchName}"` : ''}
          </motion.p>
        )}

        {/* Grid */}
        <div style={{ minHeight: 480 }}>
          {loading ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(290px, 1fr))', gap: 28 }}>
              {[...Array(6)].map((_, i) => <SkeletonCard key={i} theme={siteTheme} />)}
            </div>
          ) : currentDoctors.length > 0 ? (
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={`${currentPage}-${specialty}-${searchName}`}
                custom={direction}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
                style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(290px, 1fr))', gap: 28 }}
              >
                {currentDoctors.map((doctor, idx) => (
                  <DoctorCard
                    key={doctor._id}
                    doctor={doctor}
                    theme={siteTheme}
                    idx={idx}
                    onClick={() => navigate(`/doctor/${doctor._id}`)}
                  />
                ))}
              </motion.div>
            </AnimatePresence>
          ) : (
            <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }}
              style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '7rem 2rem', background: siteTheme.siteAltBg, borderRadius: 32, border: `2px dashed ${siteTheme.siteBorder}`, textAlign: 'center' }}>
              <div style={{ width: 64, height: 64, borderRadius: 20, background: siteTheme.siteBg, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20, border: `1px solid ${siteTheme.siteBorder}` }}>
                <IoMedkitOutline size={28} style={{ color: siteTheme.siteMuted }} />
              </div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 900, color: siteTheme.siteText, textTransform: 'uppercase', letterSpacing: '-0.02em', margin: '0 0 8px' }}>
                No Specialists Found
              </h3>
              <p style={{ color: siteTheme.siteMuted, fontSize: 13, margin: '0 0 28px' }}>
                Try adjusting your search or clearing the filters.
              </p>
              <button className="reset-btn" onClick={() => { setSearchName(''); setSpecialty(''); }}
                style={{ padding: '12px 32px', background: siteTheme.siteAccent, color: '#fff', borderRadius: 14, fontSize: 10, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.2em', border: 'none', cursor: 'pointer', transition: 'opacity 0.2s' }}>
                Reset All Filters
              </button>
            </motion.div>
          )}
        </div>

        {/* ── Pagination ── */}
        {totalPages > 1 && !loading && (
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
            style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 8, marginTop: 56 }}>

            {/* Prev */}
            <button
              className="page-btn"
              disabled={currentPage === 1}
              onClick={() => { setDirection(-1); setCurrentPage(p => Math.max(1, p - 1)); }}
              style={{ padding: '10px 20px', borderRadius: 12, fontWeight: 900, fontSize: 11, border: `1px solid ${siteTheme.siteBorder}`, cursor: currentPage === 1 ? 'default' : 'pointer', transition: 'all 0.2s ease', background: siteTheme.siteCard, color: currentPage === 1 ? siteTheme.siteMuted : siteTheme.siteText, opacity: currentPage === 1 ? 0.4 : 1, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
              ← Prev
            </button>

            {/* Page numbers */}
            {[...Array(totalPages)].map((_, i) => (
              <button key={i} className="page-btn"
                onClick={() => { setDirection(i + 1 > currentPage ? 1 : -1); setCurrentPage(i + 1); }}
                style={{ width: 44, height: 44, borderRadius: 12, fontWeight: 900, fontSize: 13, border: `1px solid ${currentPage === i + 1 ? siteTheme.siteAccent : siteTheme.siteBorder}`, cursor: 'pointer', transition: 'all 0.2s ease', background: currentPage === i + 1 ? siteTheme.siteAccent : siteTheme.siteCard, color: currentPage === i + 1 ? '#fff' : siteTheme.siteMuted, transform: currentPage === i + 1 ? 'scale(1.1)' : 'scale(1)', boxShadow: currentPage === i + 1 ? `0 4px 14px ${siteTheme.siteAccent}44` : 'none' }}>
                {i + 1}
              </button>
            ))}

            {/* Next */}
            <button
              className="page-btn"
              disabled={currentPage === totalPages}
              onClick={() => { setDirection(1); setCurrentPage(p => Math.min(totalPages, p + 1)); }}
              style={{ padding: '10px 20px', borderRadius: 12, fontWeight: 900, fontSize: 11, border: `1px solid ${siteTheme.siteBorder}`, cursor: currentPage === totalPages ? 'default' : 'pointer', transition: 'all 0.2s ease', background: siteTheme.siteCard, color: currentPage === totalPages ? siteTheme.siteMuted : siteTheme.siteText, opacity: currentPage === totalPages ? 0.4 : 1, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
              Next →
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Doctors;