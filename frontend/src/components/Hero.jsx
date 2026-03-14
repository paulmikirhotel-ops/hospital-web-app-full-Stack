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
    accent: '#2563eb', accentDark: '#1e3a8a',
    glow: 'rgba(37,99,235,0.25)', splitBg: '#0f172a', accentStrip: '#2563eb',
    leftBg: '#ffffff', headlineColor: '#0f172a',
    headlineAccent: 'linear-gradient(135deg, #2563eb 0%, #0ea5e9 100%)',
    subText: '#3d5068', quoteColor: '#2563eb',
    inputBg: '#f8fafc', inputBorder: '#e2e8f0',
    btnPrimary: { bg: '#0f172a', color: '#ffffff' },
    btnSecondary: { bg: 'transparent', color: '#3d5068', border: '#cbd5e1' },
    badgeBg: '#ffffff', badgeIcon: '#2563eb', badgeText: '#0f172a',
    statsBg: '#0f172a', statsText: '#f8fafc', statsMuted: '#94a3b8', isLight: true,
  },
  gold: {
    key: 'gold',
    bg: ['#0a0700', '#120c00', '#050300'],
    nebula: ['rgba(212,160,23,0.15)', 'rgba(180,100,0,0.1)'],
    stars: [245, 230, 180],
    planets: ['#d4a017', '#b8922a', '#f5c842', '#8b6914', '#e8b84b'],
    rings: 'rgba(245,200,66,0.3)',
    accent: '#d4a017', accentDark: '#3d2800',
    glow: 'rgba(212,160,23,0.4)', splitBg: '#1a0f00', accentStrip: '#d4a017',
    leftBg: '#fef9e7', headlineColor: '#1a0f00',
    headlineAccent: 'linear-gradient(135deg, #d4a017 0%, #f5c842 100%)',
    subText: '#6b4f10', quoteColor: '#b8820f',
    inputBg: '#fffbf0', inputBorder: '#f0d080',
    btnPrimary: { bg: '#1a0f00', color: '#f5c842' },
    btnSecondary: { bg: 'transparent', color: '#b8820f', border: '#d4a017' },
    badgeBg: '#fff8e0', badgeIcon: '#d4a017', badgeText: '#1a0f00',
    statsBg: '#0a0700', statsText: '#f5e6c0', statsMuted: '#c9971a', isLight: false,
  },
  blue: {
    key: 'blue',
    bg: ['#00080f', '#000d1a', '#000510'],
    nebula: ['rgba(56,189,248,0.15)', 'rgba(14,165,233,0.1)'],
    stars: [224, 242, 254],
    planets: ['#38bdf8', '#0ea5e9', '#7dd3fc', '#0284c7', '#bae6fd'],
    rings: 'rgba(186,230,253,0.3)',
    accent: '#0ea5e9', accentDark: '#082f49',
    glow: 'rgba(14,165,233,0.4)', splitBg: '#00090f', accentStrip: '#0ea5e9',
    leftBg: '#f0f9ff', headlineColor: '#0c1a2e',
    headlineAccent: 'linear-gradient(135deg, #2563eb 0%, #0ea5e9 100%)',
    subText: '#334e6b', quoteColor: '#0ea5e9',
    inputBg: '#f0f9ff', inputBorder: '#bae6fd',
    btnPrimary: { bg: '#0c1a2e', color: '#fff' },
    btnSecondary: { bg: 'transparent', color: '#334e6b', border: '#93c5fd' },
    badgeBg: '#e8f4ff', badgeIcon: '#0ea5e9', badgeText: '#0c1a2e',
    statsBg: '#000814', statsText: '#e0f2fe', statsMuted: '#38bdf8', isLight: false,
  },
};

/* ── STAR CANVAS ── */
const StarField = ({ theme }) => {
  const canvasRef = useRef(null);
  const animRef   = useRef(null);
  const starsRef  = useRef([]);
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
        starsRef.current.push({ x:Math.random(), y:Math.random(), r:Math.random()*1.2+0.2, twinkle:Math.random()*Math.PI*2, twinkleSpeed:Math.random()*0.025+0.008 });
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
      ctx.clearRect(0,0,w,h);
      const grad = ctx.createRadialGradient(w*.5,h*.4,0,w*.5,h*.4,Math.max(w,h)*.85);
      grad.addColorStop(0,theme.bg[1]); grad.addColorStop(.5,theme.bg[0]); grad.addColorStop(1,theme.bg[2]);
      ctx.fillStyle=grad; ctx.fillRect(0,0,w,h);
      const n1 = ctx.createRadialGradient(w*.25,h*.28,0,w*.25,h*.28,w*.36);
      n1.addColorStop(0,theme.nebula[0]); n1.addColorStop(1,'transparent');
      ctx.fillStyle=n1; ctx.fillRect(0,0,w,h);
      const n2 = ctx.createRadialGradient(w*.8,h*.65,0,w*.8,h*.65,w*.3);
      n2.addColorStop(0,theme.nebula[1]); n2.addColorStop(1,'transparent');
      ctx.fillStyle=n2; ctx.fillRect(0,0,w,h);
      starsRef.current.forEach(star => {
        star.twinkle+=star.twinkleSpeed;
        const alpha = theme.isLight?(0.06+0.1*Math.abs(Math.sin(star.twinkle))):(0.3+0.7*Math.abs(Math.sin(star.twinkle)));
        ctx.beginPath(); ctx.arc(star.x*w,star.y*h,star.r,0,Math.PI*2);
        ctx.fillStyle=`rgba(${sr},${sg},${sb},${alpha})`; ctx.fill();
      });
      planetsRef.current.forEach(p => {
        p.angle+=p.speed;
        const px=(p.orbitX+Math.cos(p.angle)*p.orbitRx)*w;
        const py=(p.orbitY+Math.sin(p.angle)*p.orbitRy)*h;
        const color=theme.planets[p.colorIdx%theme.planets.length];
        const haloAlpha=theme.isLight?'0.06':'0.2';
        const halo=ctx.createRadialGradient(px,py,0,px,py,p.r*3);
        halo.addColorStop(0,theme.glow.replace('0.25',haloAlpha).replace('0.4',haloAlpha));
        halo.addColorStop(1,'transparent');
        ctx.fillStyle=halo; ctx.beginPath(); ctx.arc(px,py,p.r*3,0,Math.PI*2); ctx.fill();
        if(p.hasRing){ctx.save();ctx.translate(px,py);ctx.scale(1,0.28);ctx.beginPath();ctx.arc(0,0,p.r*2.3,Math.PI,Math.PI*2);ctx.strokeStyle=theme.rings;ctx.lineWidth=4;ctx.stroke();ctx.restore();}
        const pg=ctx.createRadialGradient(px-p.r*.3,py-p.r*.3,p.r*.05,px,py,p.r);
        pg.addColorStop(0,color); pg.addColorStop(1,theme.accentDark);
        ctx.globalAlpha=theme.isLight?0.3:1;
        ctx.beginPath(); ctx.arc(px,py,p.r,0,Math.PI*2); ctx.fillStyle=pg; ctx.fill();
        ctx.globalAlpha=1;
        if(p.hasRing){ctx.save();ctx.translate(px,py);ctx.scale(1,0.28);ctx.beginPath();ctx.arc(0,0,p.r*2.3,0,Math.PI);ctx.strokeStyle=theme.rings;ctx.lineWidth=4;ctx.stroke();ctx.restore();}
        ctx.beginPath(); ctx.arc(px-p.r*.28,py-p.r*.28,p.r*.3,0,Math.PI*2);
        ctx.fillStyle='rgba(255,255,255,0.15)'; ctx.fill();
      });
      animRef.current = requestAnimationFrame(draw);
    };
    draw();
    return () => { cancelAnimationFrame(animRef.current); window.removeEventListener('resize',resize); };
  }, [theme]);

  return <canvas ref={canvasRef} style={{ position:'absolute', inset:0, width:'100%', height:'100%', zIndex:0, display:'block' }}/>;
};

/* ── FLOATING BADGE ── */
const FloatingBadge = ({ icon, label, value, style, delay, theme }) => (
  <motion.div
    initial={{ opacity:0, scale:0.8, y:20 }} animate={{ opacity:1, scale:1, y:0 }}
    transition={{ delay, type:'spring', stiffness:100 }}
    style={{ ...style, position:'absolute', zIndex:30, display:'flex', alignItems:'center', gap:10, padding:'9px 14px', borderRadius:16, background:theme.badgeBg, backdropFilter:'blur(16px)', border:'1px solid rgba(0,0,0,0.08)', boxShadow:'0 8px 32px rgba(0,0,0,0.18)' }}>
    <div style={{ width:34, height:34, borderRadius:10, background:theme.badgeIcon, display:'flex', alignItems:'center', justifyContent:'center', color:'#fff', fontSize:16, flexShrink:0 }}>{icon}</div>
    <div>
      <p style={{ fontSize:8, fontWeight:900, textTransform:'uppercase', letterSpacing:'0.18em', color:theme.badgeText, opacity:0.55, margin:0 }}>{label}</p>
      <p style={{ fontSize:12, fontWeight:900, color:theme.badgeText, margin:0, lineHeight:1.2 }}>{value}</p>
    </div>
  </motion.div>
);

/* ── TILT CARD (disabled on touch devices) ── */
const TiltCard = ({ children }) => {
  const ref  = useRef(null);
  const x    = useMotionValue(0), y = useMotionValue(0);
  const rotateX = useSpring(useTransform(y,[-0.5,0.5],[8,-8]),{ stiffness:200, damping:30 });
  const rotateY = useSpring(useTransform(x,[-0.5,0.5],[-8,8]),{ stiffness:200, damping:30 });
  const handleMouseMove = (e) => {
    const rect = ref.current.getBoundingClientRect();
    x.set((e.clientX-rect.left)/rect.width-0.5);
    y.set((e.clientY-rect.top)/rect.height-0.5);
  };
  return (
    <motion.div ref={ref} onMouseMove={handleMouseMove} onMouseLeave={()=>{x.set(0);y.set(0);}}
      style={{ rotateX, rotateY, transformStyle:'preserve-3d', perspective:1000, position:'relative', width:'100%', height:'100%' }}>
      {children}
    </motion.div>
  );
};

/* ── PROGRESS RING ── */
const ProgressRing = ({ radius, stroke, progress, color }) => {
  const nr = radius-stroke/2;
  const circ = 2*Math.PI*nr;
  const offset = circ-(progress/100)*circ;
  return (
    <svg height={radius*2} width={radius*2} style={{ position:'absolute', top:0, left:0, transform:'rotate(-90deg)' }}>
      <circle stroke="rgba(255,255,255,0.15)" fill="transparent" strokeWidth={stroke} r={nr} cx={radius} cy={radius}/>
      <motion.circle stroke={color} fill="transparent" strokeWidth={stroke} strokeDasharray={`${circ} ${circ}`} strokeLinecap="round" r={nr} cx={radius} cy={radius} animate={{ strokeDashoffset:offset }} transition={{ duration:0.4, ease:'easeOut' }}/>
    </svg>
  );
};

/* ── PAGINATION ── */
const ModernPagination = ({ total, active, onDotClick, onPrev, onNext, theme, images }) => {
  const slideLabels = ['Emergency Care','Maternity Unit','Surgical Suite','Diagnostics Lab','Patient Wards','Outpatient Wing'];
  const progress = ((active+1)/total)*100;
  const RING_R = 24;
  return (
    <div style={{ position:'absolute', bottom:0, left:0, right:0, zIndex:20, padding:'0 16px 16px', display:'flex', alignItems:'flex-end', justifyContent:'space-between', gap:8, flexWrap:'wrap' }}>
      {/* Left: counter */}
      <div style={{ background:'rgba(0,0,0,0.35)', backdropFilter:'blur(14px)', border:'1px solid rgba(255,255,255,0.12)', borderRadius:14, padding:'8px 14px', display:'flex', alignItems:'center', gap:10 }}>
        <div style={{ display:'flex', flexDirection:'column', gap:3 }}>
          {Array.from({length:total}).map((_,i)=>(
            <motion.div key={i} onClick={()=>onDotClick(i)} animate={{ height:active===i?18:4, backgroundColor:active===i?'#fff':'rgba(255,255,255,0.3)', opacity:active===i?1:0.6 }} transition={{ type:'spring', stiffness:300, damping:28 }} style={{ width:3, borderRadius:99, cursor:'pointer', overflow:'hidden', position:'relative' }}>
              {active===i && <motion.div key={`fill-${active}`} initial={{ height:'0%' }} animate={{ height:'100%' }} transition={{ duration:4.5, ease:'linear' }} style={{ position:'absolute', top:0, left:0, right:0, background:theme.accent, borderRadius:99 }}/>}
            </motion.div>
          ))}
        </div>
        <div>
          <div style={{ display:'flex', alignItems:'baseline', gap:3, marginBottom:2 }}>
            <AnimatePresence mode="wait">
              <motion.span key={active} initial={{ opacity:0, y:-8 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0, y:8 }} transition={{ duration:0.22 }} style={{ fontSize:20, fontWeight:900, color:'#fff', lineHeight:1, letterSpacing:'-0.04em' }}>
                {String(active+1).padStart(2,'0')}
              </motion.span>
            </AnimatePresence>
            <span style={{ fontSize:11, fontWeight:600, color:'rgba(255,255,255,0.4)' }}>/{String(total).padStart(2,'0')}</span>
          </div>
          <AnimatePresence mode="wait">
            <motion.p key={active} initial={{ opacity:0, x:-6 }} animate={{ opacity:1, x:0 }} exit={{ opacity:0, x:6 }} transition={{ duration:0.2 }} style={{ fontSize:8, fontWeight:800, color:'rgba(255,255,255,0.55)', textTransform:'uppercase', letterSpacing:'0.16em', margin:0, whiteSpace:'nowrap' }}>
              {slideLabels[active]||'SJCH Facility'}
            </motion.p>
          </AnimatePresence>
        </div>
      </div>

      {/* Middle: thumbnails — hidden on very small screens */}
      <div className="hero-thumbs" style={{ display:'flex', alignItems:'center', gap:5, background:'rgba(0,0,0,0.35)', backdropFilter:'blur(14px)', border:'1px solid rgba(255,255,255,0.12)', borderRadius:14, padding:'6px 8px', flex:1, overflow:'hidden', justifyContent:'center' }}>
        {images.map((img,i)=>(
          <motion.button key={i} onClick={()=>onDotClick(i)} whileHover={{ scale:1.06 }} whileTap={{ scale:0.95 }} animate={{ opacity:active===i?1:0.45, scale:active===i?1:0.92 }} transition={{ type:'spring', stiffness:300, damping:25 }} style={{ all:'unset', cursor:'pointer', position:'relative', width:active===i?48:32, height:32, borderRadius:9, overflow:'hidden', flexShrink:0, border:active===i?`2px solid ${theme.accent}`:'2px solid transparent', boxSizing:'border-box', transition:'width 0.35s cubic-bezier(.4,0,.2,1)', boxShadow:active===i?`0 0 10px ${theme.glow}`:'none' }}>
            <img src={img} alt={`slide ${i+1}`} style={{ width:'100%', height:'100%', objectFit:'cover', display:'block', pointerEvents:'none' }}/>
            {active===i&&<motion.div key={`thumb-p-${active}`} initial={{ scaleX:0 }} animate={{ scaleX:1 }} transition={{ duration:4.5, ease:'linear' }} style={{ position:'absolute', bottom:0, left:0, right:0, height:2, background:theme.accent, transformOrigin:'left', borderRadius:99 }}/>}
          </motion.button>
        ))}
      </div>

      {/* Right: prev/next */}
      <div style={{ display:'flex', alignItems:'center', gap:6, background:'rgba(0,0,0,0.35)', backdropFilter:'blur(14px)', border:'1px solid rgba(255,255,255,0.12)', borderRadius:14, padding:'7px 10px' }}>
        <motion.button whileHover={{ scale:1.1 }} whileTap={{ scale:0.9 }} onClick={onPrev} style={{ width:32, height:32, borderRadius:'50%', background:'rgba(255,255,255,0.1)', border:'1px solid rgba(255,255,255,0.18)', display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer', color:'#fff', fontSize:14 }}>
          <IoChevronBack/>
        </motion.button>
        <motion.button whileHover={{ scale:1.06 }} whileTap={{ scale:0.92 }} onClick={onNext} style={{ position:'relative', width:RING_R*2, height:RING_R*2, borderRadius:'50%', background:'rgba(255,255,255,0.08)', border:'none', display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer', color:'#fff', fontSize:14 }}>
          <ProgressRing radius={RING_R} stroke={2.5} progress={progress} color={theme.accent}/>
          <IoChevronForward style={{ position:'relative', zIndex:1 }}/>
        </motion.button>
      </div>
    </div>
  );
};

/* ── HERO MAIN ── */
const Hero = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [query, setQuery]             = useState('');
  const swiperRef = useRef(null);
  const navigate  = useNavigate();
  const { user }  = useSelector((state) => state.auth) || {};
  const { themeKey } = useSiteTheme();
  const theme = HERO_THEMES[themeKey] || HERO_THEMES.white;

  const handleSearch   = (e) => { e.preventDefault(); if(query.trim()) navigate('/services',{state:{initialSearch:query}}); };
  const handlePrev     = () => { if(swiperRef.current) swiperRef.current.slidePrev(); };
  const handleNext     = () => { if(swiperRef.current) swiperRef.current.slideNext(); };
  const handleDotClick = (i) => { if(swiperRef.current) swiperRef.current.slideToLoop(i); };

  return (
    <>
      <style>{`
        .hero-section { position:relative; min-height:100vh; overflow:hidden; transition:background 0.5s ease; }

        /* Two-column layout on desktop */
        .hero-inner {
          position:relative; z-index:2;
          max-width:1440px; margin:0 auto;
          padding:clamp(80px,10vw,112px) clamp(20px,4vw,64px) clamp(80px,10vw,100px);
          display:flex; flex-direction:row;
          align-items:center; gap:clamp(24px,4vw,40px);
          min-height:100vh; box-sizing:border-box;
        }
        .hero-left  { width:50%; padding-right:clamp(0px,2vw,4rem); }
        .hero-right { width:50%; height:clamp(360px,50vw,620px); position:relative; }

        /* Floating badges — hidden on small screens */
        .hero-badge { display:flex !important; }

        /* Stats bar */
        .hero-stats-bar {
          position:absolute; bottom:0; left:0; right:0; z-index:10;
          backdrop-filter:blur(16px); border-top:1px solid rgba(255,255,255,0.06);
          transition:background 0.5s ease;
        }
        .hero-stats-inner {
          max-width:1440px; margin:0 auto;
          padding:clamp(12px,2vw,18px) clamp(20px,4vw,64px);
          display:flex; flex-wrap:wrap;
          justify-content:space-between; align-items:center; gap:16px;
        }
        .hero-stats-item { display:flex; align-items:center; gap:14px; }
        .hero-stat-divider { width:1px; height:24px; background:rgba(255,255,255,0.12); }

        /* Diagonal split overlay */
        .hero-split {
          position:absolute; inset:0; pointer-events:none; overflow:hidden; z-index:1;
        }
        .hero-split-bg {
          position:absolute; top:0; right:0; width:55%; height:100%;
          clip-path:polygon(12% 0,100% 0,100% 100%,0% 100%);
        }
        .hero-split-strip {
          position:absolute; top:0; right:0; width:55%; height:100%;
          clip-path:polygon(12% 0,16% 0,4% 100%,0% 100%);
        }

        /* Search bar */
        .hero-search-input {
          width:100%; box-sizing:border-box;
          padding-left:52px; padding-right:clamp(100px,15vw,140px);
          padding-top:16px; padding-bottom:16px;
          border-radius:18px; font-size:16px; font-weight:600;
          outline:none; transition:all 0.3s ease;
        }

        /* Thumbnails — hide on very small to save space */
        @media (max-width:480px) {
          .hero-thumbs { display:none !important; }
        }

        /* ── TABLET: stack layout ── */
        @media (max-width:900px) {
          .hero-inner {
            flex-direction:column !important;
            padding-top:clamp(60px,8vw,90px);
            padding-bottom:clamp(100px,15vw,140px);
            gap:32px;
            align-items:stretch;
          }
          .hero-left  { width:100% !important; padding-right:0 !important; }
          .hero-right { width:100% !important; height:clamp(260px,55vw,420px); }
          .hero-badge { display:none !important; }
          .hero-stats-inner { justify-content:center; gap:12px; }
          .hero-stat-divider { display:none; }
        }

        /* ── MOBILE ── */
        @media (max-width:600px) {
          .hero-inner { gap:24px; }
          .hero-right { height:clamp(220px,60vw,320px); }
          .hero-stats-inner { padding:12px 16px; }
          .hero-stats-link  { display:none; }
        }

        @media (max-width:400px) {
          .hero-right { height:220px; }
        }
      `}</style>

      <section className="hero-section" style={{ background:theme.leftBg }}>
        <StarField theme={theme}/>

        {/* Split overlay */}
        <div className="hero-split">
          <div className="hero-split-bg" style={{ background:theme.splitBg, opacity:theme.isLight?1:0.6 }}/>
          <div className="hero-split-strip" style={{ background:theme.accentStrip, opacity:theme.isLight?0.9:0.85 }}/>
          {theme.isLight && (
            <motion.div animate={{ scale:[1,1.15,1], opacity:[0.12,0.2,0.12] }} transition={{ duration:6, repeat:Infinity, ease:'easeInOut' }}
              style={{ position:'absolute', top:'25%', right:'10%', width:'clamp(200px,30vw,400px)', height:'clamp(200px,30vw,400px)', borderRadius:'50%', background:'#3b82f6', filter:'blur(120px)' }}/>
          )}
        </div>

        <div className="hero-inner">
          {/* ── LEFT: Content ── */}
          <div className="hero-left">
            {/* Badge */}
            <motion.div initial={{ opacity:0, x:-20 }} animate={{ opacity:1, x:0 }} transition={{ delay:0.1 }}
              style={{ display:'inline-flex', alignItems:'center', gap:8, padding:'6px 16px', marginBottom:'clamp(16px,3vw,28px)', borderRadius:999, background:`${theme.accent}18`, border:`1px solid ${theme.accent}44` }}>
              <IoShieldCheckmark style={{ color:theme.accent, fontSize:13 }}/>
              <span style={{ fontSize:10, fontWeight:900, textTransform:'uppercase', letterSpacing:'0.18em', color:theme.accent }}>Serving Liberia since 1963</span>
            </motion.div>

            {/* Headline */}
            <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.2 }} style={{ marginBottom:'clamp(12px,2vw,20px)' }}>
              <h1 style={{ fontSize:'clamp(1.3rem,3vw,2.8rem)', fontWeight:900, letterSpacing:'-0.03em', lineHeight:1.05, color:theme.headlineColor, margin:'0 0 4px', whiteSpace:'nowrap' }}>
                ST. JOSEPH'S CATHOLIC
              </h1>
              <h1 style={{ fontSize:'clamp(1.8rem,4.5vw,4rem)', fontWeight:900, letterSpacing:'-0.04em', lineHeight:1.0, margin:0 }}>
                <span style={{ background:theme.headlineAccent, WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text' }}>
                  HOSPITAL
                </span>
              </h1>
            </motion.div>

            <motion.p initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:0.3 }}
              style={{ fontSize:'clamp(13px,1.5vw,15px)', color:theme.subText, fontWeight:500, lineHeight:1.7, marginBottom:8, maxWidth:460 }}>
              Providing holistic, affordable, quality health services to all people in Liberia and the world at large.
            </motion.p>
            <motion.p initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:0.35 }}
              style={{ fontSize:13, fontWeight:900, color:theme.quoteColor, fontStyle:'italic', marginBottom:'clamp(18px,3vw,28px)' }}>
              "Your Life is Precious to Us!"
            </motion.p>

            {/* Search */}
            <motion.form initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.4 }} onSubmit={handleSearch}
              style={{ position:'relative', maxWidth:460, marginBottom:12, width:'100%' }}>
              <div style={{ position:'absolute', left:16, top:'50%', transform:'translateY(-50%)', color:theme.subText, zIndex:10 }}>
                <IoSearchOutline size={19}/>
              </div>
              <input type="text" value={query} onChange={e=>setQuery(e.target.value)}
                placeholder="Search services or departments..."
                className="hero-search-input"
                style={{ background:theme.inputBg, border:`2px solid ${theme.inputBorder}`, color:theme.headlineColor, caretColor:theme.accent }}
              />
              <button type="submit" style={{ position:'absolute', right:8, top:'50%', transform:'translateY(-50%)', background:theme.btnPrimary.bg, color:theme.btnPrimary.color, padding:'9px 16px', borderRadius:12, border:'none', cursor:'pointer', fontSize:10, fontWeight:900, textTransform:'uppercase', letterSpacing:'0.16em', display:'flex', alignItems:'center', gap:5, whiteSpace:'nowrap' }}>
                Find <IoArrowForward size={11}/>
              </button>
            </motion.form>

            {/* Quick searches */}
            <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:0.45 }}
              style={{ display:'flex', flexWrap:'wrap', alignItems:'center', gap:8, marginBottom:'clamp(20px,3vw,36px)' }}>
              <span style={{ fontSize:9, fontWeight:900, color:theme.subText, textTransform:'uppercase', letterSpacing:'0.2em', display:'flex', alignItems:'center', gap:4 }}>
                <IoFlashOutline style={{ color:'#f97316', fontSize:12 }}/> Popular:
              </span>
              {quickSearches.map(item=>(
                <button key={item} onClick={()=>navigate('/services',{state:{initialSearch:item}})}
                  style={{ fontSize:10, fontWeight:700, color:theme.subText, background:`${theme.accent}14`, padding:'5px 13px', borderRadius:999, border:`1px solid ${theme.accent}33`, cursor:'pointer', transition:'all 0.2s ease' }}
                  onMouseEnter={e=>{e.currentTarget.style.background=theme.accent;e.currentTarget.style.color='#fff';}}
                  onMouseLeave={e=>{e.currentTarget.style.background=`${theme.accent}14`;e.currentTarget.style.color=theme.subText;}}>
                  {item}
                </button>
              ))}
            </motion.div>

            {/* CTAs */}
            <motion.div initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.5 }}
              style={{ display:'flex', flexWrap:'wrap', gap:12 }}>
              <Link to={user?'/dashboard':'/register'}
                style={{ display:'flex', alignItems:'center', gap:10, padding:'13px clamp(18px,2.5vw,28px)', background:theme.btnPrimary.bg, color:theme.btnPrimary.color, fontSize:10, fontWeight:900, textTransform:'uppercase', letterSpacing:'0.16em', borderRadius:16, textDecoration:'none', transition:'all 0.3s ease', boxShadow:theme.isLight?'0 4px 16px rgba(0,0,0,0.15)':`0 8px 24px ${theme.accent}33`, whiteSpace:'nowrap' }}>
                {user?'Enter Patient Portal':'Register as Patient'} <IoArrowForward size={13}/>
              </Link>
              <Link to="/services"
                style={{ display:'flex', alignItems:'center', gap:10, padding:'13px clamp(18px,2.5vw,28px)', background:theme.btnSecondary.bg, color:theme.btnSecondary.color, fontSize:10, fontWeight:900, textTransform:'uppercase', letterSpacing:'0.16em', borderRadius:16, border:`2px solid ${theme.btnSecondary.border}`, textDecoration:'none', transition:'all 0.3s ease', whiteSpace:'nowrap' }}>
                Our Services
              </Link>
            </motion.div>
          </div>

          {/* ── RIGHT: Carousel ── */}
          <div className="hero-right">
            <TiltCard>
              <motion.div initial={{ opacity:0, x:60, rotateY:-10 }} animate={{ opacity:1, x:0, rotateY:0 }} transition={{ delay:0.3, duration:0.8, type:'spring', stiffness:60 }}
                style={{ position:'relative', height:'100%', width:'100%', borderRadius:'clamp(24px,4vw,48px)', overflow:'hidden', boxShadow:'0 40px 100px rgba(0,0,0,0.3)', border:'3px solid rgba(255,255,255,0.15)', transformStyle:'preserve-3d' }}>
                <Swiper modules={[Autoplay,EffectFade]} effect="fade" spaceBetween={0} slidesPerView={1} speed={1200} loop
                  autoplay={{ delay:4500, disableOnInteraction:false }}
                  onSwiper={(swiper)=>{swiperRef.current=swiper;}}
                  onSlideChange={swiper=>setActiveIndex(swiper.realIndex)}
                  style={{ height:'100%', width:'100%' }}>
                  {images.map((img,i)=>(
                    <SwiperSlide key={i}>
                      <div style={{ position:'relative', height:'100%', width:'100%' }}>
                        <img src={img} style={{ width:'100%', height:'100%', objectFit:'cover' }} alt="SJCH"/>
                        <div style={{ position:'absolute', inset:0, background:'linear-gradient(to top,rgba(0,0,0,0.7) 0%,rgba(0,0,0,0.2) 50%,transparent 100%)' }}/>
                      </div>
                    </SwiperSlide>
                  ))}
                </Swiper>
                <div style={{ position:'absolute', top:16, right:16, zIndex:20, padding:'5px 13px', borderRadius:999, background:'rgba(255,255,255,0.1)', backdropFilter:'blur(10px)', border:'1px solid rgba(255,255,255,0.2)' }}>
                  <p style={{ color:'#fff', fontSize:8, fontWeight:900, textTransform:'uppercase', letterSpacing:'0.18em', margin:0 }}>SJCH Facilities</p>
                </div>
                <ModernPagination total={images.length} active={activeIndex} onDotClick={handleDotClick} onPrev={handlePrev} onNext={handleNext} theme={theme} images={images}/>
              </motion.div>

              {/* Floating badges — hidden on mobile via CSS */}
              <FloatingBadge className="hero-badge" icon={<IoHeartOutline size={16}/>}   label="Emergency"   value="Open 24/7"    delay={0.8}  theme={theme} style={{ bottom:'14%', left:'-6%', transform:'translateZ(40px)' }}/>
              <FloatingBadge className="hero-badge" icon={<IoPulseOutline size={16}/>}   label="Procedures"  value="12,000+"      delay={1.0}  theme={theme} style={{ top:'12%',   left:'-4%', transform:'translateZ(40px)' }}/>
              <FloatingBadge className="hero-badge" icon={<IoMedicalOutline size={16}/>} label="Specialists" value="45+ Doctors"  delay={1.2}  theme={theme} style={{ top:'42%',   right:'-4%', transform:'translateZ(40px)' }}/>
            </TiltCard>
          </div>
        </div>

        {/* ── STATS BAR ── */}
        <motion.div className="hero-stats-bar" initial={{ opacity:0, y:30 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.9 }}
          style={{ background:theme.statsBg }}>
          <div className="hero-stats-inner">
            {[{ label:'Founded', value:'1963' },{ label:'Hospital Beds', value:'150+' },{ label:'Years of Care', value:'60+' },{ label:'Specialists', value:'45+' }].map((item,i)=>(
              <div key={i} className="hero-stats-item">
                {i>0 && <div className="hero-stat-divider"/>}
                <div>
                  <p style={{ fontSize:9, fontWeight:900, textTransform:'uppercase', letterSpacing:'0.22em', color:theme.statsMuted, margin:0 }}>{item.label}</p>
                  <p style={{ fontSize:'clamp(16px,2.5vw,20px)', fontWeight:900, color:theme.statsText, letterSpacing:'-0.03em', margin:0 }}>{item.value}</p>
                </div>
              </div>
            ))}
            <Link to="/about" className="hero-stats-link" style={{ display:'flex', alignItems:'center', gap:8, padding:'9px 20px', background:theme.accent, color:theme.key==='gold'?'#0a0700':'#fff', borderRadius:12, fontSize:10, fontWeight:900, textTransform:'uppercase', letterSpacing:'0.16em', textDecoration:'none', transition:'all 0.3s ease', whiteSpace:'nowrap' }}>
              Our Story <IoArrowForward size={11}/>
            </Link>
          </div>
        </motion.div>
      </section>
    </>
  );
};

export default Hero;