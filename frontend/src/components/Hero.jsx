import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, EffectFade } from 'swiper/modules';
import { motion, useMotionValue, useTransform, useSpring, AnimatePresence } from 'framer-motion';
import {
  IoArrowForward, IoShieldCheckmark, IoSearchOutline,
  IoFlashOutline, IoHeartOutline, IoMedicalOutline, IoPulseOutline,
  IoChevronBack, IoChevronForward,
} from 'react-icons/io5';
import 'swiper/css';
import 'swiper/css/effect-fade';
import { useSiteTheme } from '../context/ThemeContext';

import Img1 from '../assets/hero-carousel/image1.jpg';
import Img2 from '../assets/hero-carousel/image2.jpg';
import Img3 from '../assets/hero-carousel/image3.jpg';
import Img4 from '../assets/hero-carousel/image4.jpg';
import Img5 from '../assets/hero-carousel/image5.jpg';
import Img6 from '../assets/hero-carousel/image6.jpg';

const images = [Img1, Img2, Img3, Img4, Img5, Img6];
const quickSearches = ['Maternity', 'Surgery', 'Emergency', 'Laboratory'];

const HERO_THEMES = {
  white: {
    key: 'white',
    bg: ['#f8fafc', '#f1f5f9', '#e2e8f0'],
    nebula: ['rgba(59,130,246,0.06)', 'rgba(99,102,241,0.04)'],
    stars: [148, 163, 184],
    planets: ['#3b82f6', '#6366f1', '#60a5fa', '#4f46e5', '#93c5fd'],
    rings: 'rgba(147,197,253,0.4)',
    accent: '#2563eb',
    accentDark: '#1e3a8a',
    glow: 'rgba(37,99,235,0.25)',
    splitBg: '#0f172a',
    accentStrip: '#2563eb',
    leftBg: '#ffffff',
    headlineColor: '#0f172a',
    headlineAccent: 'linear-gradient(135deg, #2563eb 0%, #0ea5e9 100%)',
    subText: '#3d5068',
    quoteColor: '#2563eb',
    inputBg: '#f8fafc',
    inputBorder: '#e2e8f0',
    btnPrimary: { bg: '#0f172a', color: '#ffffff' },
    btnSecondary: { bg: 'transparent', color: '#3d5068', border: '#cbd5e1' },
    badgeBg: '#ffffff',
    badgeIcon: '#2563eb',
    badgeText: '#0f172a',
    statsBg: '#0f172a',
    statsText: '#f8fafc',
    statsMuted: '#94a3b8',
    isLight: true,
  },
  gold: {
    key: 'gold',
    bg: ['#0a0700', '#120c00', '#050300'],
    nebula: ['rgba(212,160,23,0.15)', 'rgba(180,100,0,0.1)'],
    stars: [245, 230, 180],
    planets: ['#d4a017', '#b8922a', '#f5c842', '#8b6914', '#e8b84b'],
    rings: 'rgba(245,200,66,0.3)',
    accent: '#d4a017',
    accentDark: '#3d2800',
    glow: 'rgba(212,160,23,0.4)',
    splitBg: '#1a0f00',
    accentStrip: '#d4a017',
    leftBg: '#fef9e7',
    headlineColor: '#1a0f00',
    headlineAccent: 'linear-gradient(135deg, #d4a017 0%, #f5c842 100%)',
    subText: '#6b4f10',
    quoteColor: '#b8820f',
    inputBg: '#fffbf0',
    inputBorder: '#f0d080',
    btnPrimary: { bg: '#1a0f00', color: '#f5c842' },
    btnSecondary: { bg: 'transparent', color: '#b8820f', border: '#d4a017' },
    badgeBg: '#fff8e0',
    badgeIcon: '#d4a017',
    badgeText: '#1a0f00',
    statsBg: '#0a0700',
    statsText: '#f5e6c0',
    statsMuted: '#c9971a',
    isLight: false,
  },
  blue: {
    key: 'blue',
    bg: ['#00080f', '#000d1a', '#000510'],
    nebula: ['rgba(56,189,248,0.15)', 'rgba(14,165,233,0.1)'],
    stars: [224, 242, 254],
    planets: ['#38bdf8', '#0ea5e9', '#7dd3fc', '#0284c7', '#bae6fd'],
    rings: 'rgba(186,230,253,0.3)',
    accent: '#0ea5e9',
    accentDark: '#082f49',
    glow: 'rgba(14,165,233,0.4)',
    splitBg: '#00090f',
    accentStrip: '#0ea5e9',
    leftBg: '#f0f9ff',
    headlineColor: '#0c1a2e',
    headlineAccent: 'linear-gradient(135deg, #2563eb 0%, #0ea5e9 100%)',
    subText: '#334e6b',
    quoteColor: '#0ea5e9',
    inputBg: '#f0f9ff',
    inputBorder: '#bae6fd',
    btnPrimary: { bg: '#0c1a2e', color: '#fff' },
    btnSecondary: { bg: 'transparent', color: '#334e6b', border: '#93c5fd' },
    badgeBg: '#e8f4ff',
    badgeIcon: '#0ea5e9',
    badgeText: '#0c1a2e',
    statsBg: '#000814',
    statsText: '#e0f2fe',
    statsMuted: '#38bdf8',
    isLight: false,
  },
};

const StarField = ({ theme }) => {
  const canvasRef = useRef(null);
  const animRef = useRef(null);
  const starsRef = useRef([]);
  const planetsRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const resize = () => { canvas.width = canvas.offsetWidth; canvas.height = canvas.offsetHeight; };
    resize();
    window.addEventListener('resize', resize);

    if (starsRef.current.length === 0) {
      for (let i = 0; i < 160; i++) {
        starsRef.current.push({
          x: Math.random(), y: Math.random(),
          r: Math.random() * 1.2 + 0.2,
          twinkle: Math.random() * Math.PI * 2,
          twinkleSpeed: Math.random() * 0.025 + 0.008,
        });
      }
    }
    if (!planetsRef.current) {
      planetsRef.current = [
        { orbitX:0.1,  orbitY:0.2,  orbitRx:0.06,  orbitRy:0.025, r:14, colorIdx:0, hasRing:true,  angle:0,   speed:0.0003  },
        { orbitX:0.9,  orbitY:0.25, orbitRx:0.07,  orbitRy:0.03,  r:22, colorIdx:1, hasRing:false, angle:1.5, speed:0.00018 },
        { orbitX:0.78, orbitY:0.82, orbitRx:0.05,  orbitRy:0.02,  r:11, colorIdx:2, hasRing:true,  angle:2.8, speed:0.00038 },
        { orbitX:0.06, orbitY:0.72, orbitRx:0.04,  orbitRy:0.018, r:8,  colorIdx:3, hasRing:false, angle:4,   speed:0.00048 },
        { orbitX:0.52, orbitY:0.94, orbitRx:0.035, orbitRy:0.014, r:6,  colorIdx:4, hasRing:false, angle:5.2, speed:0.00058 },
      ];
    }
    const [sr, sg, sb] = theme.stars;

    const draw = () => {
      const w = canvas.width, h = canvas.height;
      ctx.clearRect(0, 0, w, h);
      const grad = ctx.createRadialGradient(w*0.5, h*0.4, 0, w*0.5, h*0.4, Math.max(w,h)*0.85);
      grad.addColorStop(0, theme.bg[1]); grad.addColorStop(0.5, theme.bg[0]); grad.addColorStop(1, theme.bg[2]);
      ctx.fillStyle = grad; ctx.fillRect(0, 0, w, h);
      const n1 = ctx.createRadialGradient(w*0.25, h*0.28, 0, w*0.25, h*0.28, w*0.36);
      n1.addColorStop(0, theme.nebula[0]); n1.addColorStop(1, 'transparent');
      ctx.fillStyle = n1; ctx.fillRect(0, 0, w, h);
      const n2 = ctx.createRadialGradient(w*0.8, h*0.65, 0, w*0.8, h*0.65, w*0.3);
      n2.addColorStop(0, theme.nebula[1]); n2.addColorStop(1, 'transparent');
      ctx.fillStyle = n2; ctx.fillRect(0, 0, w, h);
      starsRef.current.forEach(star => {
        star.twinkle += star.twinkleSpeed;
        const alpha = theme.isLight
          ? (0.06 + 0.1 * Math.abs(Math.sin(star.twinkle)))
          : (0.3 + 0.7 * Math.abs(Math.sin(star.twinkle)));
        ctx.beginPath(); ctx.arc(star.x*w, star.y*h, star.r, 0, Math.PI*2);
        ctx.fillStyle = `rgba(${sr},${sg},${sb},${alpha})`; ctx.fill();
      });
      planetsRef.current.forEach(p => {
        p.angle += p.speed;
        const px = (p.orbitX + Math.cos(p.angle)*p.orbitRx)*w;
        const py = (p.orbitY + Math.sin(p.angle)*p.orbitRy)*h;
        const color = theme.planets[p.colorIdx % theme.planets.length];
        const haloAlpha = theme.isLight ? '0.06' : '0.2';
        const halo = ctx.createRadialGradient(px, py, 0, px, py, p.r*3);
        halo.addColorStop(0, theme.glow.replace('0.25', haloAlpha).replace('0.4', haloAlpha));
        halo.addColorStop(1, 'transparent');
        ctx.fillStyle = halo; ctx.beginPath(); ctx.arc(px, py, p.r*3, 0, Math.PI*2); ctx.fill();
        if (p.hasRing) {
          ctx.save(); ctx.translate(px, py); ctx.scale(1, 0.28);
          ctx.beginPath(); ctx.arc(0, 0, p.r*2.3, Math.PI, Math.PI*2);
          ctx.strokeStyle = theme.rings; ctx.lineWidth = 4; ctx.stroke(); ctx.restore();
        }
        const pg = ctx.createRadialGradient(px-p.r*0.3, py-p.r*0.3, p.r*0.05, px, py, p.r);
        pg.addColorStop(0, color); pg.addColorStop(1, theme.accentDark);
        ctx.globalAlpha = theme.isLight ? 0.3 : 1;
        ctx.beginPath(); ctx.arc(px, py, p.r, 0, Math.PI*2); ctx.fillStyle = pg; ctx.fill();
        ctx.globalAlpha = 1;
        if (p.hasRing) {
          ctx.save(); ctx.translate(px, py); ctx.scale(1, 0.28);
          ctx.beginPath(); ctx.arc(0, 0, p.r*2.3, 0, Math.PI);
          ctx.strokeStyle = theme.rings; ctx.lineWidth = 4; ctx.stroke(); ctx.restore();
        }
        ctx.beginPath(); ctx.arc(px-p.r*0.28, py-p.r*0.28, p.r*0.3, 0, Math.PI*2);
        ctx.fillStyle = 'rgba(255,255,255,0.15)'; ctx.fill();
      });
      animRef.current = requestAnimationFrame(draw);
    };
    draw();
    return () => { cancelAnimationFrame(animRef.current); window.removeEventListener('resize', resize); };
  }, [theme]);

  return <canvas ref={canvasRef} style={{ position:'absolute', inset:0, width:'100%', height:'100%', zIndex:0, display:'block' }}/>;
};

const FloatingBadge = ({ icon, label, value, style, delay, theme }) => (
  <motion.div
    initial={{ opacity:0, scale:0.8, y:20 }} animate={{ opacity:1, scale:1, y:0 }}
    transition={{ delay, type:'spring', stiffness:100 }}
    style={{
      ...style, position:'absolute', zIndex:30,
      display:'flex', alignItems:'center', gap:12, padding:'10px 16px',
      borderRadius:18, background: theme.badgeBg,
      backdropFilter:'blur(16px)', border:'1px solid rgba(0,0,0,0.08)',
      boxShadow:'0 8px 32px rgba(0,0,0,0.18)',
    }}
  >
    <div style={{ width:36, height:36, borderRadius:10, background: theme.badgeIcon, display:'flex', alignItems:'center', justifyContent:'center', color:'#fff', fontSize:18, flexShrink:0 }}>
      {icon}
    </div>
    <div>
      <p style={{ fontSize:9, fontWeight:900, textTransform:'uppercase', letterSpacing:'0.2em', color: theme.badgeText, opacity:0.55, margin:0 }}>{label}</p>
      <p style={{ fontSize:13, fontWeight:900, color: theme.badgeText, margin:0, lineHeight:1.2 }}>{value}</p>
    </div>
  </motion.div>
);

const TiltCard = ({ children }) => {
  const ref = useRef(null);
  const x = useMotionValue(0), y = useMotionValue(0);
  const rotateX = useSpring(useTransform(y, [-0.5,0.5], [8,-8]), { stiffness:200, damping:30 });
  const rotateY = useSpring(useTransform(x, [-0.5,0.5], [-8,8]), { stiffness:200, damping:30 });
  const handleMouseMove = (e) => {
    const rect = ref.current.getBoundingClientRect();
    x.set((e.clientX - rect.left) / rect.width - 0.5);
    y.set((e.clientY - rect.top) / rect.height - 0.5);
  };
  return (
    <motion.div ref={ref} onMouseMove={handleMouseMove} onMouseLeave={() => { x.set(0); y.set(0); }}
      style={{ rotateX, rotateY, transformStyle:'preserve-3d', perspective:1000, position:'relative', width:'100%', height:'100%' }}>
      {children}
    </motion.div>
  );
};

const ProgressRing = ({ radius, stroke, progress, color }) => {
  const normalizedRadius = radius - stroke / 2;
  const circumference = 2 * Math.PI * normalizedRadius;
  const strokeDashoffset = circumference - (progress / 100) * circumference;
  return (
    <svg height={radius * 2} width={radius * 2} style={{ position:'absolute', top:0, left:0, transform:'rotate(-90deg)' }}>
      <circle stroke="rgba(255,255,255,0.15)" fill="transparent" strokeWidth={stroke} r={normalizedRadius} cx={radius} cy={radius} />
      <motion.circle stroke={color} fill="transparent" strokeWidth={stroke} strokeDasharray={`${circumference} ${circumference}`} strokeLinecap="round" r={normalizedRadius} cx={radius} cy={radius} animate={{ strokeDashoffset }} transition={{ duration:0.4, ease:'easeOut' }} />
    </svg>
  );
};

const ModernPagination = ({ total, active, onDotClick, onPrev, onNext, theme, images }) => {
  const slideLabels = ['Emergency Care', 'Maternity Unit', 'Surgical Suite', 'Diagnostics Lab', 'Patient Wards', 'Outpatient Wing'];
  const progress = ((active + 1) / total) * 100;
  const RING_R = 26;
  return (
    <div style={{ position:'absolute', bottom:0, left:0, right:0, zIndex:20, padding:'0 20px 20px', display:'flex', alignItems:'flex-end', justifyContent:'space-between', gap:12 }}>
      <div style={{ background:'rgba(0,0,0,0.35)', backdropFilter:'blur(14px)', border:'1px solid rgba(255,255,255,0.12)', borderRadius:16, padding:'10px 16px', display:'flex', alignItems:'center', gap:12, minWidth:0 }}>
        <div style={{ display:'flex', flexDirection:'column', gap:3 }}>
          {Array.from({ length: total }).map((_, i) => (
            <motion.div key={i} onClick={() => onDotClick(i)} animate={{ height: active===i ? 20 : 4, backgroundColor: active===i ? '#fff' : 'rgba(255,255,255,0.3)', opacity: active===i ? 1 : 0.6 }} transition={{ type:'spring', stiffness:300, damping:28 }} style={{ width:3, borderRadius:99, cursor:'pointer', overflow:'hidden', position:'relative' }}>
              {active===i && <motion.div key={`fill-${active}`} initial={{ height:'0%' }} animate={{ height:'100%' }} transition={{ duration:4.5, ease:'linear' }} style={{ position:'absolute', top:0, left:0, right:0, background:theme.accent, borderRadius:99 }}/>}
            </motion.div>
          ))}
        </div>
        <div>
          <div style={{ display:'flex', alignItems:'baseline', gap:3, marginBottom:2 }}>
            <AnimatePresence mode="wait">
              <motion.span key={active} initial={{ opacity:0, y:-8 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0, y:8 }} transition={{ duration:0.22 }} style={{ fontSize:22, fontWeight:900, color:'#fff', lineHeight:1, letterSpacing:'-0.04em' }}>
                {String(active+1).padStart(2,'0')}
              </motion.span>
            </AnimatePresence>
            <span style={{ fontSize:11, fontWeight:600, color:'rgba(255,255,255,0.4)' }}>/{String(total).padStart(2,'0')}</span>
          </div>
          <AnimatePresence mode="wait">
            <motion.p key={active} initial={{ opacity:0, x:-6 }} animate={{ opacity:1, x:0 }} exit={{ opacity:0, x:6 }} transition={{ duration:0.2 }} style={{ fontSize:9, fontWeight:800, color:'rgba(255,255,255,0.55)', textTransform:'uppercase', letterSpacing:'0.18em', margin:0, whiteSpace:'nowrap' }}>
              {slideLabels[active] || 'SJCH Facility'}
            </motion.p>
          </AnimatePresence>
        </div>
      </div>
      <div style={{ display:'flex', alignItems:'center', gap:6, background:'rgba(0,0,0,0.35)', backdropFilter:'blur(14px)', border:'1px solid rgba(255,255,255,0.12)', borderRadius:16, padding:'8px 10px', flex:1, overflow:'hidden', justifyContent:'center' }}>
        {images.map((img, i) => (
          <motion.button key={i} onClick={() => onDotClick(i)} whileHover={{ scale:1.06 }} whileTap={{ scale:0.95 }} animate={{ opacity: active===i ? 1 : 0.45, scale: active===i ? 1 : 0.92 }} transition={{ type:'spring', stiffness:300, damping:25 }} style={{ all:'unset', cursor:'pointer', position:'relative', width: active===i ? 52 : 36, height:36, borderRadius:10, overflow:'hidden', flexShrink:0, border: active===i ? `2px solid ${theme.accent}` : '2px solid transparent', boxSizing:'border-box', transition:'width 0.35s cubic-bezier(.4,0,.2,1)', boxShadow: active===i ? `0 0 12px ${theme.glow}` : 'none' }}>
            <img src={img} alt={`slide ${i+1}`} style={{ width:'100%', height:'100%', objectFit:'cover', display:'block', pointerEvents:'none' }}/>
            {active===i && <motion.div key={`thumb-progress-${active}`} initial={{ scaleX:0 }} animate={{ scaleX:1 }} transition={{ duration:4.5, ease:'linear' }} style={{ position:'absolute', bottom:0, left:0, right:0, height:2, background:theme.accent, transformOrigin:'left', borderRadius:99 }}/>}
          </motion.button>
        ))}
      </div>
      <div style={{ display:'flex', alignItems:'center', gap:8, background:'rgba(0,0,0,0.35)', backdropFilter:'blur(14px)', border:'1px solid rgba(255,255,255,0.12)', borderRadius:16, padding:'8px 12px' }}>
        <motion.button whileHover={{ scale:1.1 }} whileTap={{ scale:0.9 }} onClick={onPrev} style={{ width:34, height:34, borderRadius:'50%', background:'rgba(255,255,255,0.1)', border:'1px solid rgba(255,255,255,0.18)', display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer', color:'#fff', fontSize:15 }}>
          <IoChevronBack/>
        </motion.button>
        <motion.button whileHover={{ scale:1.06 }} whileTap={{ scale:0.92 }} onClick={onNext} style={{ position:'relative', width:RING_R*2, height:RING_R*2, borderRadius:'50%', background:'rgba(255,255,255,0.08)', border:'none', display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer', color:'#fff', fontSize:15 }}>
          <ProgressRing radius={RING_R} stroke={2.5} progress={progress} color={theme.accent}/>
          <IoChevronForward style={{ position:'relative', zIndex:1 }}/>
        </motion.button>
      </div>
    </div>
  );
};

const Hero = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [query, setQuery] = useState('');
  const swiperRef = useRef(null);
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth) || {};

  const { themeKey } = useSiteTheme();
  const theme = HERO_THEMES[themeKey] || HERO_THEMES.white;

  const handleSearch = (e) => { e.preventDefault(); if (query.trim()) navigate('/services', { state: { initialSearch: query } }); };
  const handlePrev = () => { if (swiperRef.current) swiperRef.current.slidePrev(); };
  const handleNext = () => { if (swiperRef.current) swiperRef.current.slideNext(); };
  const handleDotClick = (i) => { if (swiperRef.current) swiperRef.current.slideToLoop(i); };

  return (
    <section style={{ position:'relative', minHeight:'100vh', background: theme.leftBg, overflow:'hidden', transition:'background 0.5s ease' }}>
      <StarField theme={theme} />

      {theme.isLight && (
        <div style={{ position:'absolute', inset:0, pointerEvents:'none', overflow:'hidden', zIndex:1 }}>
          <div style={{ position:'absolute', top:0, right:0, width:'55%', height:'100%', background: theme.splitBg, clipPath:'polygon(12% 0,100% 0,100% 100%,0% 100%)' }}/>
          <div style={{ position:'absolute', top:0, right:0, width:'55%', height:'100%', background: theme.accentStrip, opacity:0.9, clipPath:'polygon(12% 0,16% 0,4% 100%,0% 100%)' }}/>
          <motion.div animate={{ scale:[1,1.15,1], opacity:[0.12,0.2,0.12] }} transition={{ duration:6, repeat:Infinity, ease:'easeInOut' }} style={{ position:'absolute', top:'25%', right:'10%', width:400, height:400, borderRadius:'50%', background:'#3b82f6', filter:'blur(120px)' }}/>
        </div>
      )}

      {!theme.isLight && (
        <div style={{ position:'absolute', inset:0, pointerEvents:'none', zIndex:1 }}>
          <div style={{ position:'absolute', top:0, right:0, width:'55%', height:'100%', background: theme.splitBg, opacity:0.6, clipPath:'polygon(12% 0,100% 0,100% 100%,0% 100%)' }}/>
          <div style={{ position:'absolute', top:0, right:0, width:'55%', height:'100%', background: theme.accentStrip, opacity:0.85, clipPath:'polygon(12% 0,16% 0,4% 100%,0% 100%)' }}/>
        </div>
      )}

      <div style={{ position:'relative', zIndex:2, maxWidth:1440, margin:'0 auto', padding:'7rem 4rem 5rem', display:'flex', flexDirection:'row', alignItems:'center', gap:40, minHeight:'100vh' }}>
        <div style={{ width:'50%', paddingRight:'4rem' }}>

          {/* ── Badge ── */}
          <motion.div initial={{ opacity:0, x:-20 }} animate={{ opacity:1, x:0 }} transition={{ delay:0.1 }} style={{ display:'inline-flex', alignItems:'center', gap:8, padding:'6px 16px', marginBottom:28, borderRadius:999, background:`${theme.accent}18`, border:`1px solid ${theme.accent}44` }}>
            <IoShieldCheckmark style={{ color: theme.accent, fontSize:14 }}/>
            <span style={{ fontSize:10, fontWeight:900, textTransform:'uppercase', letterSpacing:'0.2em', color: theme.accent }}>Serving Liberia since 1963</span>
          </motion.div>

          {/* ── UPDATED HEADING ── */}
          <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.2 }} style={{ marginBottom:20 }}>

            {/* Line 1: ST. JOSEPH'S CATHOLIC — all on one line, plain color */}
            <h1 style={{
              fontSize: 'clamp(1.6rem, 3.2vw, 2.8rem)',
              fontWeight: 900,
              letterSpacing: '-0.03em',
              lineHeight: 1.05,
              color: theme.headlineColor,
              margin: '0 0 4px',
              whiteSpace: 'nowrap',
            }}>
              ST. JOSEPH'S CATHOLIC
            </h1>

            {/* Line 2: HOSPITAL — gradient accent */}
            <h1 style={{
              fontSize: 'clamp(2.2rem, 4.5vw, 4rem)',
              fontWeight: 900,
              letterSpacing: '-0.04em',
              lineHeight: 1.0,
              margin: 0,
            }}>
              <span style={{
                background: theme.headlineAccent,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}>
                HOSPITAL
              </span>
            </h1>

          </motion.div>

          <motion.p initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:0.3 }} style={{ fontSize:15, color: theme.subText, fontWeight:500, lineHeight:1.7, marginBottom:10, maxWidth:460 }}>
            Providing holistic, affordable, quality health services to all people in Liberia and the world at large.
          </motion.p>
          <motion.p initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:0.35 }} style={{ fontSize:13, fontWeight:900, color: theme.quoteColor, fontStyle:'italic', marginBottom:28 }}>
            "Your Life is Precious to Us!"
          </motion.p>

          <motion.form initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.4 }} onSubmit={handleSearch} style={{ position:'relative', maxWidth:460, marginBottom:14 }}>
            <div style={{ position:'absolute', left:18, top:'50%', transform:'translateY(-50%)', color: theme.subText, zIndex:10 }}>
              <IoSearchOutline size={20}/>
            </div>
            <input
              type="text" value={query} onChange={e => setQuery(e.target.value)}
              placeholder="Search services or departments..."
              style={{ width:'100%', paddingLeft:52, paddingRight:140, paddingTop:18, paddingBottom:18, background: theme.inputBg, border:`2px solid ${theme.inputBorder}`, borderRadius:18, fontSize:14, fontWeight:600, color: theme.headlineColor, caretColor: theme.accent, outline:'none', boxSizing:'border-box', transition:'all 0.3s ease' }}
            />
            <button type="submit" style={{ position:'absolute', right:8, top:'50%', transform:'translateY(-50%)', background: theme.btnPrimary.bg, color: theme.btnPrimary.color, padding:'10px 18px', borderRadius:12, border:'none', cursor:'pointer', fontSize:10, fontWeight:900, textTransform:'uppercase', letterSpacing:'0.18em', display:'flex', alignItems:'center', gap:6 }}>
              Find <IoArrowForward size={11}/>
            </button>
          </motion.form>

          <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:0.45 }} style={{ display:'flex', flexWrap:'wrap', alignItems:'center', gap:8, marginBottom:36 }}>
            <span style={{ fontSize:9, fontWeight:900, color: theme.subText, textTransform:'uppercase', letterSpacing:'0.2em', display:'flex', alignItems:'center', gap:4 }}>
              <IoFlashOutline style={{ color:'#f97316', fontSize:12 }}/> Popular:
            </span>
            {quickSearches.map(item => (
              <button
                key={item}
                onClick={() => navigate('/services', { state: { initialSearch: item } })}
                style={{ fontSize:10, fontWeight:700, color: theme.subText, background:`${theme.accent}14`, padding:'6px 14px', borderRadius:999, border:`1px solid ${theme.accent}33`, cursor:'pointer', transition:'all 0.2s ease' }}
                onMouseEnter={e => { e.currentTarget.style.background = theme.accent; e.currentTarget.style.color = '#fff'; }}
                onMouseLeave={e => { e.currentTarget.style.background = `${theme.accent}14`; e.currentTarget.style.color = theme.subText; }}
              >
                {item}
              </button>
            ))}
          </motion.div>

          <motion.div initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.5 }} style={{ display:'flex', flexWrap:'wrap', gap:14 }}>
            <Link to={user ? '/dashboard' : '/register'} style={{ display:'flex', alignItems:'center', gap:10, padding:'14px 28px', background: theme.btnPrimary.bg, color: theme.btnPrimary.color, fontSize:10, fontWeight:900, textTransform:'uppercase', letterSpacing:'0.18em', borderRadius:16, textDecoration:'none', transition:'all 0.3s ease', boxShadow: theme.isLight ? '0 4px 16px rgba(0,0,0,0.15)' : `0 8px 24px ${theme.accent}33` }}>
              {user ? 'Enter Patient Portal' : 'Register as Patient'} <IoArrowForward size={13}/>
            </Link>
            <Link to="/services" style={{ display:'flex', alignItems:'center', gap:10, padding:'14px 28px', background: theme.btnSecondary.bg, color: theme.btnSecondary.color, fontSize:10, fontWeight:900, textTransform:'uppercase', letterSpacing:'0.18em', borderRadius:16, border:`2px solid ${theme.btnSecondary.border}`, textDecoration:'none', transition:'all 0.3s ease' }}>
              Our Services
            </Link>
          </motion.div>
        </div>

        {/* ── Right: Image carousel ── */}
        <div style={{ width:'50%', height:620, position:'relative' }}>
          <TiltCard>
            <motion.div initial={{ opacity:0, x:60, rotateY:-10 }} animate={{ opacity:1, x:0, rotateY:0 }} transition={{ delay:0.3, duration:0.8, type:'spring', stiffness:60 }} style={{ position:'relative', height:'100%', width:'100%', borderRadius:48, overflow:'hidden', boxShadow:'0 40px 100px rgba(0,0,0,0.3)', border:'3px solid rgba(255,255,255,0.15)', transformStyle:'preserve-3d' }}>
              <Swiper modules={[Autoplay, EffectFade]} effect="fade" spaceBetween={0} slidesPerView={1} speed={1200} loop autoplay={{ delay:4500, disableOnInteraction:false }} onSwiper={(swiper) => { swiperRef.current = swiper; }} onSlideChange={swiper => setActiveIndex(swiper.realIndex)} style={{ height:'100%', width:'100%' }}>
                {images.map((img, index) => (
                  <SwiperSlide key={index}>
                    <div style={{ position:'relative', height:'100%', width:'100%' }}>
                      <img src={img} style={{ width:'100%', height:'100%', objectFit:'cover' }} alt="SJCH"/>
                      <div style={{ position:'absolute', inset:0, background:'linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.2) 50%, transparent 100%)' }}/>
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
              <div style={{ position:'absolute', top:20, right:20, zIndex:20, padding:'6px 14px', borderRadius:999, background:'rgba(255,255,255,0.1)', backdropFilter:'blur(10px)', border:'1px solid rgba(255,255,255,0.2)' }}>
                <p style={{ color:'#fff', fontSize:9, fontWeight:900, textTransform:'uppercase', letterSpacing:'0.18em', margin:0 }}>SJCH Facilities</p>
              </div>
              <ModernPagination total={images.length} active={activeIndex} onDotClick={handleDotClick} onPrev={handlePrev} onNext={handleNext} theme={theme} images={images}/>
            </motion.div>
            <FloatingBadge icon={<IoHeartOutline size={17}/>}   label="Emergency"  value="Open 24/7"    delay={0.8}  theme={theme} style={{ bottom:'14%', left:'-6%', transform:'translateZ(40px)' }}/>
            <FloatingBadge icon={<IoPulseOutline size={17}/>}   label="Procedures" value="12,000+"      delay={1.0}  theme={theme} style={{ top:'12%',   left:'-4%', transform:'translateZ(40px)' }}/>
            <FloatingBadge icon={<IoMedicalOutline size={17}/>} label="Specialists" value="45+ Doctors" delay={1.2}  theme={theme} style={{ top:'42%',   right:'-4%', transform:'translateZ(40px)' }}/>
          </TiltCard>
        </div>
      </div>

      {/* ── Stats bar ── */}
      <motion.div initial={{ opacity:0, y:30 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.9 }} style={{ position:'absolute', bottom:0, left:0, right:0, zIndex:10, background: theme.statsBg, backdropFilter:'blur(16px)', borderTop:'1px solid rgba(255,255,255,0.06)', transition:'background 0.5s ease' }}>
        <div style={{ maxWidth:1440, margin:'0 auto', padding:'18px 4rem', display:'flex', flexWrap:'wrap', justifyContent:'space-between', alignItems:'center', gap:20 }}>
          {[
            { label:'Founded',      value:'1963' },
            { label:'Hospital Beds', value:'150+' },
            { label:'Years of Care', value:'60+'  },
            { label:'Specialists',   value:'45+'  },
          ].map((item, i) => (
            <div key={i} style={{ display:'flex', alignItems:'center', gap:16 }}>
              {i > 0 && <div style={{ width:1, height:24, background:'rgba(255,255,255,0.12)' }}/>}
              <div>
                <p style={{ fontSize:9, fontWeight:900, textTransform:'uppercase', letterSpacing:'0.25em', color: theme.statsMuted, margin:0 }}>{item.label}</p>
                <p style={{ fontSize:20, fontWeight:900, color: theme.statsText, letterSpacing:'-0.03em', margin:0 }}>{item.value}</p>
              </div>
            </div>
          ))}
          <Link to="/about" style={{ display:'flex', alignItems:'center', gap:8, padding:'10px 22px', background: theme.accent, color: theme.key === 'gold' ? '#0a0700' : '#fff', borderRadius:12, fontSize:10, fontWeight:900, textTransform:'uppercase', letterSpacing:'0.18em', textDecoration:'none', transition:'all 0.3s ease' }}>
            Our Story <IoArrowForward size={11}/>
          </Link>
        </div>
      </motion.div>
    </section>
  );
};

export default Hero;