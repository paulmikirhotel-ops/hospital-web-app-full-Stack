import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  IoMedkitOutline, IoPeopleOutline, IoTimerOutline,
  IoPulseOutline, IoArrowForwardOutline, IoCalendarOutline,
  IoCallOutline, IoLocationOutline, IoTimeOutline,
  IoHeartOutline, IoShieldCheckmarkOutline, IoRibbonOutline,
  IoBookOutline, IoArrowForward, IoStarOutline,
  IoCheckmarkCircleOutline, IoFlashOutline, IoEarthOutline,
  IoLeafOutline, IoHandLeftOutline, IoWifiOutline,
  IoBedOutline, IoFitnessOutline, IoNutritionOutline,
} from 'react-icons/io5';
import Hero from '../components/Hero';
import API from '../api/axiosConfig';

const SPACE_THEMES = [
  {
    name: 'Classic White', key: 'white',
    bg: ['#f8fafc','#f1f5f9','#e2e8f0'], nebula: ['rgba(59,130,246,0.06)','rgba(99,102,241,0.04)'],
    stars: [148,163,184], planets: ['#3b82f6','#6366f1','#60a5fa','#4f46e5','#93c5fd'],
    rings: 'rgba(147,197,253,0.4)', accent: '#2563eb', accentDark: '#1e3a8a',
    card3d: '#93c5fd', card3dHover: '#2563eb', cardBg: 'rgba(255,255,255,0.85)',
    cardBorder: 'rgba(59,130,246,0.18)', text: '#0f172a', muted: '#475569',
    glow: 'rgba(37,99,235,0.25)', glowBox: '0 0 80px rgba(37,99,235,0.08)',
    orb1: 'rgba(59,130,246,0.08)', orb2: 'rgba(99,102,241,0.05)',
    innerCard: 'rgba(239,246,255,0.8)', btnPrimary: { bg:'#0f172a', color:'#ffffff' },
    btnSecondary: { bg:'rgba(37,99,235,0.08)', color:'#1d4ed8', border:'rgba(37,99,235,0.25)' },
    contactBg: 'rgba(248,250,252,0.95)', sectionLabel: '#2563eb', statNum: '#0f172a',
    filterBg: '#eff6ff', footerBorder: 'rgba(37,99,235,0.12)', isLight: true,
  },
  {
    name: 'Deep Cosmos', key: 'cosmos',
    bg: ['#0a0015','#0d0030','#050010'], nebula: ['rgba(120,40,200,0.18)','rgba(60,0,120,0.12)'],
    stars: [255,255,255], planets: ['#c084fc','#7c3aed','#a855f7','#6d28d9','#8b5cf6'],
    rings: 'rgba(196,181,253,0.3)', accent: '#a855f7', accentDark: '#3b0764',
    card3d: '#c084fc', card3dHover: '#a855f7', cardBg: 'rgba(15,0,40,0.65)',
    cardBorder: 'rgba(168,85,247,0.3)', text: '#f5f3ff', muted: '#a78bfa',
    glow: 'rgba(168,85,247,0.4)', glowBox: '0 0 80px rgba(168,85,247,0.2)',
    orb1: 'rgba(120,40,200,0.12)', orb2: 'rgba(90,0,160,0.08)',
    innerCard: 'rgba(80,0,160,0.3)', btnPrimary: { bg:'#a855f7', color:'#fff' },
    btnSecondary: { bg:'rgba(168,85,247,0.15)', color:'#d8b4fe', border:'rgba(168,85,247,0.3)' },
    contactBg: 'rgba(10,0,30,0.8)', sectionLabel: '#c084fc', statNum: '#f5f3ff',
    filterBg: '#1e0a3c', footerBorder: 'rgba(168,85,247,0.2)', isLight: false,
  },
  {
    name: 'Solar Flare', key: 'solar',
    bg: ['#0f0500','#1a0800','#0a0200'], nebula: ['rgba(251,146,60,0.18)','rgba(220,38,38,0.12)'],
    stars: [254,243,199], planets: ['#fb923c','#ef4444','#f59e0b','#dc2626','#f97316'],
    rings: 'rgba(251,191,36,0.3)', accent: '#f97316', accentDark: '#431407',
    card3d: '#fb923c', card3dHover: '#f97316', cardBg: 'rgba(20,5,0,0.7)',
    cardBorder: 'rgba(249,115,22,0.3)', text: '#fff7ed', muted: '#fdba74',
    glow: 'rgba(249,115,22,0.4)', glowBox: '0 0 80px rgba(249,115,22,0.2)',
    orb1: 'rgba(251,146,60,0.12)', orb2: 'rgba(220,38,38,0.08)',
    innerCard: 'rgba(120,40,0,0.3)', btnPrimary: { bg:'#f97316', color:'#fff' },
    btnSecondary: { bg:'rgba(249,115,22,0.15)', color:'#fed7aa', border:'rgba(249,115,22,0.3)' },
    contactBg: 'rgba(15,5,0,0.85)', sectionLabel: '#fb923c', statNum: '#fff7ed',
    filterBg: '#431407', footerBorder: 'rgba(249,115,22,0.2)', isLight: false,
  },
  {
    name: 'Ice Nebula', key: 'ice',
    bg: ['#00080f','#000d1a','#000510'], nebula: ['rgba(56,189,248,0.15)','rgba(14,165,233,0.1)'],
    stars: [224,242,254], planets: ['#38bdf8','#0ea5e9','#7dd3fc','#0284c7','#bae6fd'],
    rings: 'rgba(186,230,253,0.3)', accent: '#0ea5e9', accentDark: '#082f49',
    card3d: '#38bdf8', card3dHover: '#0ea5e9', cardBg: 'rgba(0,10,25,0.7)',
    cardBorder: 'rgba(14,165,233,0.3)', text: '#f0f9ff', muted: '#7dd3fc',
    glow: 'rgba(14,165,233,0.4)', glowBox: '0 0 80px rgba(14,165,233,0.2)',
    orb1: 'rgba(56,189,248,0.12)', orb2: 'rgba(14,165,233,0.08)',
    innerCard: 'rgba(0,60,100,0.3)', btnPrimary: { bg:'#0ea5e9', color:'#fff' },
    btnSecondary: { bg:'rgba(14,165,233,0.15)', color:'#bae6fd', border:'rgba(14,165,233,0.3)' },
    contactBg: 'rgba(0,8,20,0.85)', sectionLabel: '#38bdf8', statNum: '#f0f9ff',
    filterBg: '#082f49', footerBorder: 'rgba(14,165,233,0.2)', isLight: false,
  },
  {
    name: 'Aurora', key: 'aurora',
    bg: ['#001a0a','#00120a','#000f05'], nebula: ['rgba(34,197,94,0.15)','rgba(16,185,129,0.1)'],
    stars: [220,252,231], planets: ['#4ade80','#22c55e','#86efac','#16a34a','#bbf7d0'],
    rings: 'rgba(187,247,208,0.3)', accent: '#22c55e', accentDark: '#052e16',
    card3d: '#4ade80', card3dHover: '#22c55e', cardBg: 'rgba(0,15,5,0.7)',
    cardBorder: 'rgba(34,197,94,0.3)', text: '#f0fdf4', muted: '#86efac',
    glow: 'rgba(34,197,94,0.4)', glowBox: '0 0 80px rgba(34,197,94,0.2)',
    orb1: 'rgba(34,197,94,0.12)', orb2: 'rgba(16,185,129,0.08)',
    innerCard: 'rgba(0,60,20,0.3)', btnPrimary: { bg:'#22c55e', color:'#fff' },
    btnSecondary: { bg:'rgba(34,197,94,0.15)', color:'#bbf7d0', border:'rgba(34,197,94,0.3)' },
    contactBg: 'rgba(0,15,5,0.85)', sectionLabel: '#4ade80', statNum: '#f0fdf4',
    filterBg: '#052e16', footerBorder: 'rgba(34,197,94,0.2)', isLight: false,
  },
  {
    name: 'Rose Galaxy', key: 'rose',
    bg: ['#0f0008','#160010','#0a0005'], nebula: ['rgba(244,114,182,0.18)','rgba(236,72,153,0.12)'],
    stars: [253,242,248], planets: ['#f472b6','#ec4899','#fb7185','#db2777','#fbcfe8'],
    rings: 'rgba(251,207,232,0.3)', accent: '#ec4899', accentDark: '#500724',
    card3d: '#f472b6', card3dHover: '#ec4899', cardBg: 'rgba(15,0,10,0.7)',
    cardBorder: 'rgba(236,72,153,0.3)', text: '#fdf2f8', muted: '#f9a8d4',
    glow: 'rgba(236,72,153,0.4)', glowBox: '0 0 80px rgba(236,72,153,0.2)',
    orb1: 'rgba(244,114,182,0.12)', orb2: 'rgba(236,72,153,0.08)',
    innerCard: 'rgba(100,0,50,0.3)', btnPrimary: { bg:'#ec4899', color:'#fff' },
    btnSecondary: { bg:'rgba(236,72,153,0.15)', color:'#fbcfe8', border:'rgba(236,72,153,0.3)' },
    contactBg: 'rgba(15,0,10,0.85)', sectionLabel: '#f472b6', statNum: '#fdf2f8',
    filterBg: '#500724', footerBorder: 'rgba(236,72,153,0.2)', isLight: false,
  },
];

/* ── Star canvas ── */
const StarField = ({ theme }) => {
  const canvasRef  = useRef(null);
  const animRef    = useRef(null);
  const starsRef   = useRef([]);
  const planetsRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const resize = () => { canvas.width = canvas.offsetWidth; canvas.height = canvas.offsetHeight; };
    resize();
    window.addEventListener('resize', resize);
    if (starsRef.current.length === 0) {
      for (let i = 0; i < 220; i++) starsRef.current.push({ x:Math.random(), y:Math.random(), r:Math.random()*1.5+0.2, twinkle:Math.random()*Math.PI*2, twinkleSpeed:Math.random()*0.03+0.01 });
    }
    if (!planetsRef.current) {
      planetsRef.current = [
        { orbitX:0.12, orbitY:0.18, orbitRx:0.07, orbitRy:0.03,  r:18, colorIdx:0, hasRing:true,  angle:0,   speed:0.0003 },
        { orbitX:0.88, orbitY:0.22, orbitRx:0.08, orbitRy:0.03,  r:26, colorIdx:1, hasRing:false, angle:1.2, speed:0.0002 },
        { orbitX:0.76, orbitY:0.80, orbitRx:0.06, orbitRy:0.025, r:13, colorIdx:2, hasRing:true,  angle:2.5, speed:0.0004 },
        { orbitX:0.05, orbitY:0.70, orbitRx:0.05, orbitRy:0.02,  r:10, colorIdx:3, hasRing:false, angle:3.8, speed:0.0005 },
        { orbitX:0.50, orbitY:0.93, orbitRx:0.04, orbitRy:0.015, r:7,  colorIdx:4, hasRing:false, angle:5.0, speed:0.0006 },
      ];
    }
    const [sr, sg, sb] = theme.stars;
    const draw = () => {
      const w = canvas.width, h = canvas.height;
      ctx.clearRect(0,0,w,h);
      const grad = ctx.createRadialGradient(w*.5,h*.4,0,w*.5,h*.4,Math.max(w,h)*.85);
      grad.addColorStop(0,theme.bg[1]); grad.addColorStop(.5,theme.bg[0]); grad.addColorStop(1,theme.bg[2]);
      ctx.fillStyle=grad; ctx.fillRect(0,0,w,h);
      const n1=ctx.createRadialGradient(w*.28,h*.3,0,w*.28,h*.3,w*.38); n1.addColorStop(0,theme.nebula[0]); n1.addColorStop(1,'transparent'); ctx.fillStyle=n1; ctx.fillRect(0,0,w,h);
      const n2=ctx.createRadialGradient(w*.78,h*.62,0,w*.78,h*.62,w*.32); n2.addColorStop(0,theme.nebula[1]); n2.addColorStop(1,'transparent'); ctx.fillStyle=n2; ctx.fillRect(0,0,w,h);
      starsRef.current.forEach(star => {
        star.twinkle+=star.twinkleSpeed;
        const alpha=theme.isLight?(0.08+0.12*Math.abs(Math.sin(star.twinkle))):(0.35+0.65*Math.abs(Math.sin(star.twinkle)));
        ctx.beginPath(); ctx.arc(star.x*w,star.y*h,star.r,0,Math.PI*2); ctx.fillStyle=`rgba(${sr},${sg},${sb},${alpha})`; ctx.fill();
      });
      planetsRef.current.forEach(p => {
        p.angle+=p.speed;
        const px=(p.orbitX+Math.cos(p.angle)*p.orbitRx)*w, py=(p.orbitY+Math.sin(p.angle)*p.orbitRy)*h;
        const color=theme.planets[p.colorIdx%theme.planets.length];
        const haloAlpha=theme.isLight?'0.08':'0.25';
        const halo=ctx.createRadialGradient(px,py,0,px,py,p.r*3); halo.addColorStop(0,theme.glow.replace('0.25',haloAlpha).replace('0.4',haloAlpha)); halo.addColorStop(1,'transparent');
        ctx.fillStyle=halo; ctx.beginPath(); ctx.arc(px,py,p.r*3,0,Math.PI*2); ctx.fill();
        if(p.hasRing){ctx.save();ctx.translate(px,py);ctx.scale(1,0.28);ctx.beginPath();ctx.arc(0,0,p.r*2.3,Math.PI,Math.PI*2);ctx.strokeStyle=theme.rings;ctx.lineWidth=5;ctx.stroke();ctx.restore();}
        const pg=ctx.createRadialGradient(px-p.r*.3,py-p.r*.3,p.r*.05,px,py,p.r); pg.addColorStop(0,color); pg.addColorStop(1,theme.accentDark);
        ctx.globalAlpha=theme.isLight?0.35:1; ctx.beginPath(); ctx.arc(px,py,p.r,0,Math.PI*2); ctx.fillStyle=pg; ctx.fill(); ctx.globalAlpha=1;
        if(p.hasRing){ctx.save();ctx.translate(px,py);ctx.scale(1,0.28);ctx.beginPath();ctx.arc(0,0,p.r*2.3,0,Math.PI);ctx.strokeStyle=theme.rings;ctx.lineWidth=5;ctx.stroke();ctx.restore();}
        ctx.beginPath(); ctx.arc(px-p.r*.28,py-p.r*.28,p.r*.32,0,Math.PI*2); ctx.fillStyle='rgba(255,255,255,0.14)'; ctx.fill();
      });
      animRef.current=requestAnimationFrame(draw);
    };
    draw();
    return () => { cancelAnimationFrame(animRef.current); window.removeEventListener('resize',resize); };
  }, [theme]);

  return <canvas ref={canvasRef} style={{ position:'fixed', top:0, left:0, width:'100%', height:'100%', zIndex:0, display:'block' }}/>;
};

const ThemeSwitcher = ({ themeIdx, theme, onCycle }) => (
  <motion.button onClick={onCycle} whileTap={{ scale:0.95 }}
    style={{ display:'flex', alignItems:'center', gap:8, padding:'7px 14px', background:theme.isLight?'rgba(0,0,0,0.06)':'rgba(255,255,255,0.07)', backdropFilter:'blur(14px)', color:theme.text, border:`1px solid ${theme.isLight?'rgba(0,0,0,0.12)':theme.cardBorder}`, borderRadius:999, cursor:'pointer', fontSize:9, fontWeight:900, letterSpacing:'0.14em', textTransform:'uppercase', boxShadow:`0 0 16px ${theme.glow}`, transition:'all 0.3s ease', whiteSpace:'nowrap' }}>
    <span style={{ display:'flex', gap:4, alignItems:'center' }}>
      {SPACE_THEMES.map((t,i) => (
        <span key={i} style={{ width:i===themeIdx?10:6, height:i===themeIdx?10:6, borderRadius:'50%', background:t.accent, border:i===themeIdx?`2px solid ${theme.isLight?'#0f172a':theme.text}`:'2px solid transparent', boxShadow:i===themeIdx?`0 0 6px ${t.accent}`:'none', transition:'all 0.3s ease', display:'inline-block', flexShrink:0 }} />
      ))}
    </span>
    <span className="theme-name-label">{theme.name}</span>
  </motion.button>
);

const StatCard = ({ stat, idx, theme }) => {
  const [hovered, setHovered] = useState(false);
  const [tilt, setTilt] = useState({ x:0, y:0 });
  const ref = useRef(null);
  const handleMouseMove = (e) => {
    const rect = ref.current.getBoundingClientRect();
    setTilt({ x:((e.clientX-rect.left)/rect.width-0.5)*20, y:((e.clientY-rect.top)/rect.height-0.5)*-20 });
  };
  return (
    <motion.div ref={ref} initial={{ opacity:0, y:30 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }}
      transition={{ delay:idx*0.1, type:'spring', stiffness:100 }}
      onMouseMove={handleMouseMove} onMouseEnter={()=>setHovered(true)}
      onMouseLeave={()=>{setHovered(false);setTilt({x:0,y:0});}} animate={{ rotateX:tilt.y, rotateY:tilt.x }}
      style={{ transformStyle:'preserve-3d', perspective:600, display:'flex', flexDirection:'column', alignItems:'center', textAlign:'center', padding:'1.5rem', borderRadius:'1.5rem', background:hovered?(theme.isLight?'rgba(239,246,255,0.95)':theme.innerCard.replace('0.3','0.5')):theme.innerCard, border:`1px solid ${hovered?theme.accent:theme.cardBorder}`, transition:'border 0.3s ease, background 0.3s ease', cursor:'default', boxShadow:hovered?`0 0 30px ${theme.glow}`:'none', backdropFilter:'blur(10px)' }}>
      <motion.div animate={{ scale:hovered?1.2:1 }} transition={{ duration:0.3 }} style={{ fontSize:24, marginBottom:12, color:theme.accent, filter:hovered?`drop-shadow(0 0 8px ${theme.accent})`:'none' }}>{stat.icon}</motion.div>
      <h3 style={{ fontSize:'clamp(1.5rem,4vw,2.25rem)', fontWeight:900, marginBottom:6, letterSpacing:'-0.04em', color:theme.statNum }}>{stat.value}</h3>
      <p style={{ fontSize:9, fontWeight:900, textTransform:'uppercase', letterSpacing:'0.2em', color:theme.muted, margin:0 }}>{stat.label}</p>
    </motion.div>
  );
};

const ServiceCard = ({ service, idx, theme, onClick }) => {
  const [tilt, setTilt] = useState({ x:0, y:0 });
  const [hovered, setHovered] = useState(false);
  const ref = useRef(null);
  return (
    <motion.div ref={ref} initial={{ opacity:0, scale:0.9, y:20 }} whileInView={{ opacity:1, scale:1, y:0 }} viewport={{ once:true }}
      transition={{ delay:idx*0.1, type:'spring', stiffness:80 }}
      onMouseMove={e=>{const r=ref.current.getBoundingClientRect();setTilt({x:((e.clientX-r.left)/r.width-0.5)*15,y:((e.clientY-r.top)/r.height-0.5)*-15});}}
      onMouseEnter={()=>setHovered(true)} onMouseLeave={()=>{setTilt({x:0,y:0});setHovered(false);}}
      animate={{ rotateX:tilt.y, rotateY:tilt.x, y:hovered?-8:0 }} onClick={onClick}
      style={{ transformStyle:'preserve-3d', perspective:800, padding:'1.5rem', borderRadius:'2rem', cursor:'pointer', background:theme.cardBg, backdropFilter:'blur(16px)', border:`1.5px solid ${hovered?theme.accent:theme.cardBorder}`, display:'flex', flexDirection:'column', transition:'border 0.3s ease', boxShadow:hovered?`0 30px 60px ${theme.glow}, 6px 6px 0 ${theme.card3dHover}`:`3px 3px 0 ${theme.card3d}` }}>
      <div style={{ width:48, height:48, borderRadius:12, display:'flex', alignItems:'center', justifyContent:'center', padding:8, marginBottom:20, background:hovered?theme.accent:theme.innerCard, transition:'background 0.3s ease', transform:'translateZ(20px)', boxShadow:hovered?`0 0 20px ${theme.glow}`:'none' }}>
        <img src={service.image} style={{ width:'100%', height:'100%', objectFit:'contain', filter:hovered?'brightness(0) invert(1)':(theme.isLight?'brightness(0.6) saturate(0)':'brightness(0.8) saturate(0)') }} alt=""/>
      </div>
      <div style={{ flexGrow:1, transform:'translateZ(10px)' }}>
        <h4 style={{ fontSize:'1rem', fontWeight:900, marginBottom:8, color:hovered?theme.accent:theme.text, transition:'color 0.3s ease' }}>{service.title}</h4>
        <p style={{ fontSize:12, lineHeight:1.7, color:theme.muted, fontStyle:'italic', display:'-webkit-box', WebkitLineClamp:3, WebkitBoxOrient:'vertical', overflow:'hidden', margin:0 }}>"{service.description}"</p>
      </div>
      <div style={{ marginTop:14, display:'flex', alignItems:'center', gap:6, transform:'translateZ(10px)' }}>
        <span style={{ fontSize:10, fontWeight:900, textTransform:'uppercase', letterSpacing:'0.18em', color:theme.accent, opacity:hovered?1:0.55, transition:'opacity 0.3s ease' }}>Read more</span>
        <motion.span animate={{ x:hovered?4:0 }} transition={{ duration:0.2 }} style={{ color:theme.accent, fontSize:13, opacity:hovered?1:0.55 }}>→</motion.span>
      </div>
    </motion.div>
  );
};

const BlogCard = ({ blog, idx, theme, onClick }) => {
  const [hovered, setHovered] = useState(false);
  return (
    <motion.article initial={{ opacity:0, y:30 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }}
      transition={{ delay:idx*0.1, type:'spring' }} animate={{ y:hovered?-6:0, scale:hovered?1.02:1 }}
      onClick={onClick} onMouseEnter={()=>setHovered(true)} onMouseLeave={()=>setHovered(false)}
      style={{ borderRadius:'2rem', padding:12, cursor:'pointer', background:theme.cardBg, backdropFilter:'blur(16px)', border:`1.5px solid ${hovered?theme.accent:theme.cardBorder}`, transition:'border 0.3s ease', boxShadow:hovered?`0 20px 40px ${theme.glow}, 4px 4px 0 ${theme.card3dHover}`:`2px 2px 0 ${theme.card3d}` }}>
      <div style={{ position:'relative', aspectRatio:'16/9', borderRadius:'1.5rem', overflow:'hidden', marginBottom:16, background:'#000' }}>
        <img src={blog.coverImg} style={{ width:'100%', height:'100%', objectFit:'cover', transition:'transform 0.7s ease, opacity 0.3s ease', transform:hovered?'scale(1.1)':'scale(1)', opacity:hovered?0.85:0.75 }} alt={blog.title}/>
      </div>
      <div style={{ padding:'0 6px 6px' }}>
        <div style={{ display:'flex', alignItems:'center', gap:8, fontSize:9, fontWeight:900, textTransform:'uppercase', letterSpacing:'0.18em', marginBottom:8 }}>
          <span style={{ color:theme.accent }}>{blog.category}</span>
          <span style={{ color:theme.cardBorder }}>•</span>
          <span style={{ color:theme.muted, display:'flex', alignItems:'center', gap:3 }}>
            <IoCalendarOutline style={{ width:11, height:11 }}/>{new Date(blog.createdAt).toLocaleDateString()}
          </span>
        </div>
        <h4 style={{ fontSize:'1rem', fontWeight:900, lineHeight:1.3, color:hovered?theme.accent:theme.text, transition:'color 0.3s ease', display:'-webkit-box', WebkitLineClamp:2, WebkitBoxOrient:'vertical', overflow:'hidden', margin:0 }}>{blog.title}</h4>
      </div>
    </motion.article>
  );
};

const ContactInfo = ({ icon, label, value, theme }) => (
  <div style={{ display:'flex', alignItems:'center', gap:12 }}>
    <div style={{ width:36, height:36, borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', background:`${theme.accent}22`, color:theme.accent, fontSize:17, flexShrink:0 }}>{icon}</div>
    <div>
      <p style={{ fontSize:9, textTransform:'uppercase', fontWeight:900, letterSpacing:'0.2em', color:theme.muted, margin:0 }}>{label}</p>
      <p style={{ fontSize:13, fontWeight:700, color:theme.text, margin:0 }}>{value}</p>
    </div>
  </div>
);

/* ─────────────────────────────────────────────
   OUR STORY SECTION
───────────────────────────────────────────── */
const OurStorySection = ({ theme, navigate }) => {
  const milestones = [
    { year:'1956', title:'The Vision',    desc:'President Tubman requested Pope Pius XII to establish a hospital for Liberia\'s sick and needy during a historic visit to Rome.', icon:<IoBookOutline size={20}/>,            color:'#3b82f6' },
    { year:'1963', title:'Doors Open',    desc:'On August 23rd, SJCH welcomed its first patients — a citadel waging war against death, built on donated land in Monrovia.',        icon:<IoHeartOutline size={20}/>,            color:'#ec4899' },
    { year:'1990s', title:'Tested by War', desc:'Through Liberia\'s devastating civil war, the hospital stood firm — offering refuge to massacre survivors under Archbishop Francis.', icon:<IoShieldCheckmarkOutline size={20}/>,  color:'#f97316' },
    { year:'2014', title:'Ebola Heroes',  desc:'Nine brave staffers gave their lives fighting Ebola. Their sacrifice across five nationalities is forever woven into our identity.',    icon:<IoRibbonOutline size={20}/>,           color:'#ef4444' },
  ];

  return (
    <section style={{ padding:'clamp(3rem,6vw,6rem) clamp(1rem,4vw,3rem)', position:'relative', overflow:'hidden', borderTop:`1px solid ${theme.cardBorder}` }}>
      <div style={{ position:'absolute', top:'-10%', right:'-5%', width:'clamp(200px,35vw,500px)', height:'clamp(200px,35vw,500px)', borderRadius:'50%', background:theme.orb1, filter:'blur(80px)', pointerEvents:'none', zIndex:0 }}/>
      <div style={{ position:'absolute', bottom:'-5%', left:'-5%', width:'clamp(150px,25vw,350px)', height:'clamp(150px,25vw,350px)', borderRadius:'50%', background:theme.orb2, filter:'blur(60px)', pointerEvents:'none', zIndex:0 }}/>

      <div style={{ position:'relative', zIndex:1 }}>
        <div style={{ display:'flex', flexWrap:'wrap', alignItems:'flex-end', justifyContent:'space-between', gap:20, marginBottom:'clamp(2rem,5vw,4rem)' }}>
          <div>
            <motion.p initial={{ opacity:0, x:-20 }} whileInView={{ opacity:1, x:0 }} viewport={{ once:true }}
              style={{ fontSize:11, fontWeight:900, textTransform:'uppercase', letterSpacing:'0.3em', color:theme.sectionLabel, marginBottom:12 }}>
              Since 1963
            </motion.p>
            <motion.h2 initial={{ opacity:0, x:-20 }} whileInView={{ opacity:1, x:0 }} viewport={{ once:true }} transition={{ delay:0.1 }}
              style={{ fontSize:'clamp(1.8rem,4vw,3.2rem)', fontWeight:900, color:theme.text, letterSpacing:'-0.035em', lineHeight:1.1, margin:0 }}>
              Six Decades of<br/>
              <span style={{ background:`linear-gradient(135deg,${theme.accent},${theme.card3dHover})`, WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text' }}>
                Compassionate Care
              </span>
            </motion.h2>
          </div>
          {/* ✅ FIX: Our Story button → /blog */}
          <motion.button whileHover={{ scale:1.05 }} whileTap={{ scale:0.97 }}
            onClick={() => navigate('/blog')}
            style={{ display:'flex', alignItems:'center', gap:8, padding:'12px 22px', borderRadius:14, fontSize:10, fontWeight:900, textTransform:'uppercase', letterSpacing:'0.18em', background:theme.accent, color:'#fff', border:'none', cursor:'pointer', boxShadow:`0 8px 24px ${theme.glow}`, whiteSpace:'nowrap' }}>
            Our Story <IoArrowForwardOutline size={13}/>
          </motion.button>
        </div>

        <motion.div initial={{ opacity:0, y:20 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }}
          style={{ background:theme.innerCard, backdropFilter:'blur(16px)', border:`1px solid ${theme.cardBorder}`, borderRadius:'clamp(16px,3vw,28px)', padding:'clamp(20px,4vw,36px)', marginBottom:'clamp(2rem,4vw,3rem)', position:'relative', overflow:'hidden' }}>
          <div style={{ position:'absolute', top:-20, left:'clamp(16px,3vw,32px)', fontSize:'clamp(80px,12vw,140px)', color:theme.accent, opacity:0.08, fontFamily:'Georgia,serif', lineHeight:1, userSelect:'none', fontWeight:900 }}>"</div>
          <p style={{ fontSize:'clamp(14px,2vw,18px)', color:theme.text, lineHeight:1.8, fontStyle:'italic', fontWeight:500, margin:'0 0 16px', position:'relative', zIndex:1, fontFamily:'Georgia,serif' }}>
            This hospital should be a citadel waging war against the enemy of our commonality — Death.
          </p>
          <p style={{ fontSize:11, fontWeight:900, textTransform:'uppercase', letterSpacing:'0.2em', color:theme.accent, margin:0 }}>— President William V.S. Tubman, 1963</p>
        </motion.div>

        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(220px,1fr))', gap:'clamp(12px,2vw,20px)', marginBottom:'clamp(2rem,4vw,3rem)' }}>
          {milestones.map((m, i) => (
            <motion.div key={i}
              initial={{ opacity:0, y:24 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }}
              transition={{ delay:i*0.1, type:'spring', stiffness:80 }}
              whileHover={{ y:-6, boxShadow:`0 20px 40px ${theme.glow}` }}
              style={{ background:theme.cardBg, backdropFilter:'blur(16px)', border:`1px solid ${theme.cardBorder}`, borderRadius:'clamp(16px,3vw,24px)', padding:'clamp(18px,3vw,28px)', transition:'all 0.3s ease' }}>
              <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:14 }}>
                <div style={{ width:42, height:42, borderRadius:14, background:`${m.color}20`, display:'flex', alignItems:'center', justifyContent:'center', color:m.color, flexShrink:0 }}>{m.icon}</div>
                <span style={{ fontSize:'clamp(1.1rem,2.5vw,1.4rem)', fontWeight:900, color:theme.accent }}>{m.year}</span>
              </div>
              <h4 style={{ fontSize:'clamp(0.95rem,1.8vw,1.1rem)', fontWeight:900, color:theme.text, margin:'0 0 8px' }}>{m.title}</h4>
              <p style={{ fontSize:'clamp(11px,1.5vw,13px)', color:theme.muted, lineHeight:1.7, margin:0 }}>{m.desc}</p>
            </motion.div>
          ))}
        </div>

        <motion.div initial={{ opacity:0, y:20 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }}
          style={{ background:`linear-gradient(135deg,${theme.accent}18,${theme.card3d}12)`, border:`1px solid ${theme.accent}30`, borderRadius:'clamp(16px,3vw,28px)', padding:'clamp(20px,4vw,32px)', display:'flex', flexWrap:'wrap', gap:'clamp(16px,3vw,32px)', alignItems:'center', justifyContent:'space-between' }}>
          <div style={{ flex:1, minWidth:220 }}>
            <p style={{ fontSize:11, fontWeight:900, textTransform:'uppercase', letterSpacing:'0.25em', color:theme.sectionLabel, margin:'0 0 8px' }}>Our Mission</p>
            <p style={{ fontSize:'clamp(13px,1.8vw,16px)', color:theme.text, fontWeight:600, lineHeight:1.7, margin:0 }}>
              Providing holistic, affordable, quality health services to all people in Liberia — guided by faith, compassion and excellence.
            </p>
          </div>
          <div style={{ display:'flex', flexWrap:'wrap', gap:10 }}>
            {['Compassion','Excellence','Faith','Community'].map((v,i) => (
              <span key={i} style={{ padding:'6px 16px', borderRadius:999, background:theme.innerCard, border:`1px solid ${theme.cardBorder}`, fontSize:10, fontWeight:900, textTransform:'uppercase', letterSpacing:'0.15em', color:theme.accent }}>{v}</span>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

/* ─────────────────────────────────────────────
   ✨ BEAUTIFUL FEATURES SECTION (new)
───────────────────────────────────────────── */
const FeaturesSection = ({ theme, navigate }) => {
  const features = [
    {
      icon: <IoBedOutline size={28} />,
      title: '150+ Hospital Beds',
      desc: 'Modern inpatient facilities across specialized wards including ICU, maternity, pediatrics, and surgical recovery.',
      badge: 'Infrastructure',
      color: '#3b82f6',
    },
    {
      icon: <IoFlashOutline size={28} />,
      title: '24/7 Emergency Care',
      desc: 'Round-the-clock emergency response with trained trauma specialists and fully equipped resuscitation units.',
      badge: 'Emergency',
      color: '#ef4444',
    },
    {
      icon: <IoFitnessOutline size={28} />,
      title: 'Advanced Diagnostics',
      desc: 'State-of-the-art imaging, laboratory, and pathology services enabling fast, accurate clinical decisions.',
      badge: 'Technology',
      color: '#8b5cf6',
    },
    {
      icon: <IoHeartOutline size={28} />,
      title: 'Maternity & Neonatal',
      desc: 'Dedicated maternity wing with expert midwives, obstetricians, and a neonatal intensive care unit for newborns.',
      badge: 'Maternity',
      color: '#ec4899',
    },
    {
      icon: <IoLeafOutline size={28} />,
      title: 'Holistic Wellness',
      desc: 'Integrating physical, mental and spiritual wellbeing into every patient journey — body, mind and soul.',
      badge: 'Wellness',
      color: '#22c55e',
    },
    {
      icon: <IoEarthOutline size={28} />,
      title: 'Community Outreach',
      desc: 'Free mobile clinics, vaccination drives, and health education programs reaching underserved communities across Liberia.',
      badge: 'Outreach',
      color: '#f97316',
    },
    {
      icon: <IoHandLeftOutline size={28} />,
      title: 'Faith-Based Care',
      desc: 'Rooted in Catholic values, every patient receives compassionate, dignified, non-discriminatory care regardless of background.',
      badge: 'Values',
      color: '#d4a017',
    },
    {
      icon: <IoWifiOutline size={28} />,
      title: 'Telemedicine Ready',
      desc: 'Virtual consultations and digital health records enabling seamless specialist access from anywhere in Liberia.',
      badge: 'Digital',
      color: '#0ea5e9',
    },
  ];

  const highlights = [
    { label: 'Accredited',       value: 'JCI Standards',   icon: <IoCheckmarkCircleOutline size={18}/> },
    { label: 'Patient Rating',   value: '4.8 / 5.0',       icon: <IoStarOutline size={18}/> },
    { label: 'Staff Members',    value: '300+ Heroes',      icon: <IoPeopleOutline size={18}/> },
    { label: 'Nationalities',    value: '5 Nations',        icon: <IoEarthOutline size={18}/> },
  ];

  return (
    <section style={{ padding:'clamp(3rem,6vw,6rem) clamp(1rem,4vw,3rem)', position:'relative', overflow:'hidden', borderTop:`1px solid ${theme.cardBorder}` }}>

      {/* Background orbs */}
      <div style={{ position:'absolute', top:'20%', left:'-8%',  width:'clamp(200px,30vw,450px)', height:'clamp(200px,30vw,450px)', borderRadius:'50%', background:theme.orb1, filter:'blur(90px)', pointerEvents:'none', zIndex:0 }}/>
      <div style={{ position:'absolute', bottom:'10%', right:'-5%', width:'clamp(180px,25vw,380px)', height:'clamp(180px,25vw,380px)', borderRadius:'50%', background:theme.orb2, filter:'blur(70px)', pointerEvents:'none', zIndex:0 }}/>

      <div style={{ position:'relative', zIndex:1 }}>

        {/* Section header */}
        <div style={{ textAlign:'center', marginBottom:'clamp(2.5rem,5vw,4rem)' }}>
          <motion.div initial={{ opacity:0, y:16 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }}
            style={{ display:'inline-flex', alignItems:'center', gap:8, padding:'6px 18px', borderRadius:999, background:`${theme.accent}18`, border:`1px solid ${theme.accent}44`, marginBottom:16 }}>
            <IoStarOutline style={{ color:theme.accent, fontSize:13 }}/>
            <span style={{ fontSize:10, fontWeight:900, textTransform:'uppercase', letterSpacing:'0.25em', color:theme.accent }}>Why Choose SJCH</span>
          </motion.div>
          <motion.h2 initial={{ opacity:0, y:20 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }} transition={{ delay:0.1 }}
            style={{ fontSize:'clamp(1.8rem,4vw,3.2rem)', fontWeight:900, color:theme.text, letterSpacing:'-0.035em', lineHeight:1.1, margin:'0 0 16px' }}>
            World-Class Care,<br/>
            <span style={{ background:`linear-gradient(135deg,${theme.accent},${theme.card3dHover})`, WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text' }}>
              Right Here in Liberia
            </span>
          </motion.h2>
          <motion.p initial={{ opacity:0 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }} transition={{ delay:0.2 }}
            style={{ fontSize:'clamp(13px,1.8vw,16px)', color:theme.muted, maxWidth:560, margin:'0 auto', lineHeight:1.8, fontWeight:500 }}>
            For over 60 years, Saint Joseph's Catholic Hospital has been Liberia's most trusted name in healthcare — combining clinical excellence with heartfelt compassion.
          </motion.p>
        </div>

        {/* Highlights strip */}
        <motion.div initial={{ opacity:0, y:20 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }}
          style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(140px,1fr))', gap:'clamp(10px,2vw,16px)', marginBottom:'clamp(2rem,4vw,3.5rem)' }}>
          {highlights.map((h, i) => (
            <motion.div key={i}
              initial={{ opacity:0, scale:0.9 }} whileInView={{ opacity:1, scale:1 }} viewport={{ once:true }}
              transition={{ delay:i*0.08, type:'spring' }}
              whileHover={{ y:-4, boxShadow:`0 16px 32px ${theme.glow}` }}
              style={{ background:theme.innerCard, backdropFilter:'blur(16px)', border:`1px solid ${theme.cardBorder}`, borderRadius:'clamp(14px,2vw,20px)', padding:'clamp(16px,3vw,24px)', textAlign:'center', transition:'all 0.3s ease' }}>
              <div style={{ width:40, height:40, borderRadius:12, background:`${theme.accent}22`, display:'flex', alignItems:'center', justifyContent:'center', color:theme.accent, margin:'0 auto 12px' }}>
                {h.icon}
              </div>
              <p style={{ fontSize:'clamp(1rem,2vw,1.3rem)', fontWeight:900, color:theme.text, margin:'0 0 4px', letterSpacing:'-0.02em' }}>{h.value}</p>
              <p style={{ fontSize:9, fontWeight:900, textTransform:'uppercase', letterSpacing:'0.18em', color:theme.muted, margin:0 }}>{h.label}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Feature cards grid */}
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(240px,1fr))', gap:'clamp(12px,2vw,20px)', marginBottom:'clamp(2rem,4vw,3rem)' }}>
          {features.map((f, i) => (
            <motion.div key={i}
              initial={{ opacity:0, y:28 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }}
              transition={{ delay:i*0.07, type:'spring', stiffness:80 }}
              whileHover={{ y:-8, boxShadow:`0 24px 48px ${theme.glow}` }}
              style={{ background:theme.cardBg, backdropFilter:'blur(16px)', border:`1px solid ${theme.cardBorder}`, borderRadius:'clamp(16px,3vw,24px)', padding:'clamp(20px,3vw,28px)', transition:'all 0.3s ease', cursor:'default', position:'relative', overflow:'hidden' }}>

              {/* Subtle background accent glow */}
              <div style={{ position:'absolute', top:-20, right:-20, width:80, height:80, borderRadius:'50%', background:`${f.color}18`, filter:'blur(20px)', pointerEvents:'none' }}/>

              {/* Badge */}
              <div style={{ display:'inline-flex', alignItems:'center', padding:'3px 10px', borderRadius:999, background:`${f.color}18`, border:`1px solid ${f.color}40`, marginBottom:16 }}>
                <span style={{ fontSize:8, fontWeight:900, textTransform:'uppercase', letterSpacing:'0.2em', color:f.color }}>{f.badge}</span>
              </div>

              {/* Icon */}
              <div style={{ width:52, height:52, borderRadius:16, background:`${f.color}18`, display:'flex', alignItems:'center', justifyContent:'center', color:f.color, marginBottom:16, boxShadow:`0 8px 20px ${f.color}22` }}>
                {f.icon}
              </div>

              <h4 style={{ fontSize:'clamp(0.95rem,1.8vw,1.05rem)', fontWeight:900, color:theme.text, margin:'0 0 10px', letterSpacing:'-0.01em' }}>{f.title}</h4>
              <p style={{ fontSize:'clamp(11px,1.4vw,13px)', color:theme.muted, lineHeight:1.75, margin:0 }}>{f.desc}</p>
            </motion.div>
          ))}
        </div>

        {/* CTA banner */}
        <motion.div initial={{ opacity:0, y:24 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }}
          style={{ background:`linear-gradient(135deg,${theme.accent}22,${theme.card3d}14)`, border:`1.5px solid ${theme.accent}35`, borderRadius:'clamp(20px,3vw,32px)', padding:'clamp(24px,4vw,48px)', display:'flex', flexWrap:'wrap', alignItems:'center', justifyContent:'space-between', gap:'clamp(20px,3vw,32px)', position:'relative', overflow:'hidden' }}>

          {/* Decorative blobs */}
          <div style={{ position:'absolute', top:'-30%', right:'-5%', width:220, height:220, borderRadius:'50%', background:`${theme.accent}14`, filter:'blur(50px)', pointerEvents:'none' }}/>
          <div style={{ position:'absolute', bottom:'-40%', left:'5%', width:160, height:160, borderRadius:'50%', background:`${theme.card3d}18`, filter:'blur(40px)', pointerEvents:'none' }}/>

          <div style={{ position:'relative', zIndex:1, flex:1, minWidth:240 }}>
            <p style={{ fontSize:11, fontWeight:900, textTransform:'uppercase', letterSpacing:'0.3em', color:theme.sectionLabel, margin:'0 0 10px' }}>
              Ready to Experience the Difference?
            </p>
            <h3 style={{ fontSize:'clamp(1.4rem,3vw,2.2rem)', fontWeight:900, color:theme.text, letterSpacing:'-0.03em', lineHeight:1.15, margin:'0 0 12px' }}>
              Book Your Appointment Today
            </h3>
            <p style={{ fontSize:'clamp(12px,1.6vw,15px)', color:theme.muted, lineHeight:1.7, margin:0, maxWidth:440 }}>
              Join thousands of patients who trust Saint Joseph's Catholic Hospital for their healthcare journey.
            </p>
          </div>

          <div style={{ position:'relative', zIndex:1, display:'flex', flexWrap:'wrap', gap:12 }}>
            <motion.button whileHover={{ scale:1.05 }} whileTap={{ scale:0.97 }}
              onClick={() => navigate('/appointment')}
              style={{ display:'flex', alignItems:'center', gap:8, padding:'14px 28px', borderRadius:16, fontSize:10, fontWeight:900, textTransform:'uppercase', letterSpacing:'0.18em', background:theme.accent, color:'#fff', border:'none', cursor:'pointer', boxShadow:`0 10px 28px ${theme.glow}`, whiteSpace:'nowrap' }}>
              <IoCalendarOutline size={16}/> Book Appointment
            </motion.button>
            <motion.button whileHover={{ scale:1.05 }} whileTap={{ scale:0.97 }}
              onClick={() => navigate('/blog')}
              style={{ display:'flex', alignItems:'center', gap:8, padding:'14px 28px', borderRadius:16, fontSize:10, fontWeight:900, textTransform:'uppercase', letterSpacing:'0.18em', background:theme.btnSecondary.bg, color:theme.btnSecondary.color, border:`1.5px solid ${theme.btnSecondary.border}`, cursor:'pointer', backdropFilter:'blur(8px)', whiteSpace:'nowrap' }}>
              <IoBookOutline size={16}/> Read Our Journal
            </motion.button>
          </div>
        </motion.div>

      </div>
    </section>
  );
};

/* ─────────────────────────────────────────────
   MAIN HOME
───────────────────────────────────────────── */
const Home = () => {
  const navigate = useNavigate();
  const [themeIdx, setThemeIdx]         = useState(0);
  const [latestBlogs, setLatestBlogs]   = useState([]);
  const [liveServices, setLiveServices] = useState([]);
  const [loading, setLoading]           = useState(true);
  const { scrollY } = useScroll();
  const heroY = useTransform(scrollY, [0,400], [0,-60]);
  const theme = SPACE_THEMES[themeIdx];
  const cycleTheme = () => setThemeIdx(prev => (prev+1) % SPACE_THEMES.length);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [blogRes, serviceRes] = await Promise.all([API.get('/blogs'), API.get('/services/list')]);
        if (blogRes.data?.posts) setLatestBlogs(blogRes.data.posts.slice(0,3));
        else if (Array.isArray(blogRes.data)) setLatestBlogs(blogRes.data.slice(0,3));
        if (serviceRes.data?.success) setLiveServices((serviceRes.data.services||[]).filter(s=>s.isAvailable!==false).slice(0,4));
      } catch (err) { console.error('Home Data Fetch Error:', err); }
      finally { setLoading(false); }
    };
    fetchData();
  }, []);

  const stats = [
    { label:'Years of Service',      value:'60+',  icon:<IoTimerOutline /> },
    { label:'Specialized Doctors',   value:'45+',  icon:<IoPeopleOutline /> },
    { label:'Successful Procedures', value:'12k+', icon:<IoMedkitOutline /> },
    { label:'Hospital Beds',         value:'150+', icon:<IoPulseOutline /> },
  ];

  if (loading) return (
    <div style={{ minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', background:theme.bg[0] }}>
      <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:16 }}>
        <div style={{ width:48, height:48, borderRadius:'50%', border:`3px solid ${theme.accent}`, borderTopColor:'transparent', animation:'spin 0.8s linear infinite' }}/>
        <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
        <p style={{ fontSize:10, fontWeight:900, textTransform:'uppercase', letterSpacing:'0.2em', color:theme.muted }}>Synchronizing Clinical Systems...</p>
      </div>
    </div>
  );

  return (
    <div style={{ minHeight:'100vh', position:'relative' }}>
      <style>{`
        .theme-name-label  { display: inline; }
        .home-section-pad  { padding: clamp(3rem,6vw,6rem) clamp(1rem,4vw,3rem); }
        .home-services-grid{ display: grid; grid-template-columns: repeat(auto-fill,minmax(220px,1fr)); gap: 20px; }
        .home-blog-grid    { display: grid; grid-template-columns: repeat(auto-fill,minmax(260px,1fr)); gap: 20px; }
        .home-stats-grid   { display: grid; grid-template-columns: repeat(auto-fit,minmax(160px,1fr)); gap: 14px; }
        .home-contact-bar  { display: flex; flex-wrap: wrap; justify-content: space-between; align-items: center; gap: 20px; }
        .home-section-hdr  { display: flex; flex-wrap: wrap; justify-content: space-between; align-items: flex-end; margin-bottom: 3rem; gap: 20px; }
        .home-top-bar      { display: flex; justify-content: flex-end; padding: clamp(0.75rem,2vw,1rem) clamp(1rem,4vw,1.5rem); }
        @media (max-width: 600px) {
          .theme-name-label   { display: none !important; }
          .home-contact-bar   { justify-content: flex-start; gap: 16px; }
          .home-contact-divider { display: none !important; }
        }
      `}</style>

      <StarField theme={theme} />

      <AnimatePresence mode="wait">
        <motion.div key={themeIdx} initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ duration:0.5 }}
          style={{ position:'relative', zIndex:1, paddingTop:'4.5rem', paddingBottom:'3rem' }}>
          <div style={{ maxWidth:1440, margin:'0 auto', padding:'0 clamp(8px,2vw,24px)' }}>
            <div style={{ borderRadius:'clamp(1rem,3vw,3rem)', overflow:'hidden', border:`1px solid ${theme.cardBorder}`, background:theme.cardBg, backdropFilter:'blur(20px)', WebkitBackdropFilter:'blur(20px)', boxShadow:theme.glowBox }}>

              {/* Top bar */}
              <div className="home-top-bar" style={{ borderBottom:`1px solid ${theme.cardBorder}`, background:theme.contactBg }}>
                <ThemeSwitcher themeIdx={themeIdx} theme={theme} onCycle={cycleTheme} />
              </div>

              {/* Hero */}
              <motion.div style={{ y:heroY }}>
                <Hero />
              </motion.div>

              {/* Contact bar */}
              <motion.section initial={{ opacity:0, y:40 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.4, type:'spring', stiffness:80, damping:18 }}
                style={{ padding:'clamp(1rem,3vw,1.5rem) clamp(1rem,4vw,3rem)', borderBottom:`1px solid ${theme.cardBorder}`, background:theme.contactBg, backdropFilter:'blur(10px)' }}>
                <div className="home-contact-bar">
                  <ContactInfo theme={theme} icon={<IoCallOutline />}     label="Emergency Line" value="+231 770 000 000"/>
                  <div className="home-contact-divider" style={{ width:1, height:30, background:theme.cardBorder }}/>
                  <ContactInfo theme={theme} icon={<IoTimeOutline />}     label="Opening Hours"  value="Open 24/7 (Emergency)"/>
                  <div className="home-contact-divider" style={{ width:1, height:30, background:theme.cardBorder }}/>
                  <ContactInfo theme={theme} icon={<IoLocationOutline />} label="Location"       value="Old Road, Congo Town"/>
                </div>
              </motion.section>

              {/* Stats */}
              <section style={{ padding:'0 clamp(0.75rem,3vw,1.5rem)', marginTop:'-2rem' }}>
                <div className="home-stats-grid" style={{ padding:'1.5rem', borderRadius:'2rem', background:theme.cardBg, backdropFilter:'blur(16px)', border:`1px solid ${theme.cardBorder}`, boxShadow:'0 25px 50px rgba(0,0,0,0.1)', perspective:'1200px' }}>
                  {stats.map((stat,idx) => <StatCard key={idx} stat={stat} idx={idx} theme={theme}/>)}
                </div>
              </section>

              {/* Services */}
              <section className="home-section-pad">
                <div className="home-section-hdr">
                  <div style={{ maxWidth:480 }}>
                    <motion.p initial={{ opacity:0, x:-20 }} whileInView={{ opacity:1, x:0 }} viewport={{ once:true }}
                      style={{ fontSize:11, fontWeight:900, textTransform:'uppercase', letterSpacing:'0.3em', marginBottom:12, color:theme.sectionLabel }}>
                      Core Units
                    </motion.p>
                    <motion.h3 initial={{ opacity:0, x:-20 }} whileInView={{ opacity:1, x:0 }} viewport={{ once:true }} transition={{ delay:0.1 }}
                      style={{ fontSize:'clamp(1.6rem,4vw,3rem)', fontWeight:900, lineHeight:1.1, letterSpacing:'-0.03em', color:theme.text, margin:0 }}>
                      Specialized Medical<br/>Departments
                    </motion.h3>
                  </div>
                  <motion.button whileHover={{ scale:1.05 }} whileTap={{ scale:0.97 }} onClick={()=>navigate('/services')}
                    style={{ display:'flex', alignItems:'center', gap:8, padding:'12px 22px', borderRadius:14, fontSize:10, fontWeight:900, textTransform:'uppercase', letterSpacing:'0.18em', background:theme.btnPrimary.bg, color:theme.btnPrimary.color, border:'none', cursor:'pointer', whiteSpace:'nowrap' }}>
                    All Departments <IoArrowForwardOutline/>
                  </motion.button>
                </div>
                <div className="home-services-grid">
                  {liveServices.length > 0 ? liveServices.map((service,idx) => (
                    <ServiceCard key={service._id} service={service} idx={idx} theme={theme} onClick={()=>navigate(`/services/${service._id}`)}/>
                  )) : (
                    <div style={{ gridColumn:'1/-1', padding:'3rem', textAlign:'center', fontSize:11, fontWeight:900, textTransform:'uppercase', letterSpacing:'0.2em', color:theme.muted }}>No Active Departments Currently Listed</div>
                  )}
                </div>
              </section>

              {/* Our Story */}
              <OurStorySection theme={theme} navigate={navigate} />

              {/* ✨ NEW: Features Section — before footer */}
              <FeaturesSection theme={theme} navigate={navigate} />

              {/* Journal / Blog */}
              <section style={{ padding:'clamp(3rem,6vw,6rem) clamp(1rem,4vw,3rem)', borderRadius:'3rem 3rem 0 0', background:theme.isLight?'rgba(241,245,249,0.8)':'rgba(0,0,0,0.3)', backdropFilter:'blur(16px)', position:'relative', overflow:'hidden', borderTop:`1px solid ${theme.cardBorder}` }}>
                <div style={{ position:'absolute', top:0, right:0, width:'clamp(150px,30vw,400px)', height:'clamp(150px,30vw,400px)', borderRadius:'50%', background:theme.orb1, filter:'blur(60px)', pointerEvents:'none', marginRight:'-3rem', marginTop:'-3rem' }}/>
                <div style={{ position:'absolute', bottom:0, left:0, width:'clamp(120px,25vw,300px)', height:'clamp(120px,25vw,300px)', borderRadius:'50%', background:theme.orb2, filter:'blur(60px)', pointerEvents:'none', marginLeft:'-3rem', marginBottom:'-3rem' }}/>

                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'2.5rem', position:'relative', zIndex:1, flexWrap:'wrap', gap:14 }}>
                  <div>
                    <p style={{ fontSize:11, fontWeight:900, textTransform:'uppercase', letterSpacing:'0.3em', marginBottom:10, color:theme.sectionLabel }}>Medical Journal</p>
                    {/* ✅ FIX: "Our Story" heading in journal section → /blog */}
                    <motion.h3
                      onClick={() => navigate('/blog')}
                      whileHover={{ opacity:0.75 }}
                      style={{ fontSize:'clamp(1.4rem,3.5vw,2.5rem)', fontWeight:900, letterSpacing:'-0.03em', fontStyle:'italic', color:theme.accent, margin:0, cursor:'pointer', display:'flex', alignItems:'center', gap:8 }}>
                      Our Story <span style={{ fontSize:'clamp(0.9rem,2vw,1.4rem)', opacity:0.7 }}>↗</span>
                    </motion.h3>
                  </div>
                  <motion.button whileHover={{ scale:1.05 }} whileTap={{ scale:0.97 }}
                    onClick={() => navigate('/blog')}
                    style={{ padding:'10px 18px', borderRadius:12, fontSize:10, fontWeight:900, textTransform:'uppercase', letterSpacing:'0.18em', background:theme.btnSecondary.bg, color:theme.btnSecondary.color, border:`1px solid ${theme.btnSecondary.border}`, cursor:'pointer', backdropFilter:'blur(8px)', whiteSpace:'nowrap' }}>
                    Read All Posts
                  </motion.button>
                </div>

                <div className="home-blog-grid" style={{ position:'relative', zIndex:1 }}>
                  {latestBlogs.length > 0 ? latestBlogs.map((blog,idx) => (
                    <BlogCard key={blog._id} blog={blog} idx={idx} theme={theme} onClick={()=>navigate(`/blog/${blog._id}`)}/>
                  )) : (
                    <div style={{ gridColumn:'1/-1', padding:'3rem', textAlign:'center', fontSize:11, fontWeight:900, textTransform:'uppercase', letterSpacing:'0.2em', opacity:0.4, color:theme.text }}>Loading Journal Entries...</div>
                  )}
                </div>
              </section>

              {/* Footer */}
              <footer style={{ padding:'1.5rem', textAlign:'center', borderTop:`1px solid ${theme.footerBorder}`, background:theme.isLight?'rgba(248,250,252,0.9)':'rgba(0,0,0,0.2)' }}>
                <p style={{ fontSize:10, fontWeight:900, textTransform:'uppercase', letterSpacing:'0.4em', color:theme.muted, margin:0 }}>Saint Joseph's Catholic Hospital Portal © 2026</p>
              </footer>

            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default Home;