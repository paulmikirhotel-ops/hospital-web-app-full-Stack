import { motion } from 'framer-motion';
import { 
  IoLogoFacebook, IoLogoTwitter, IoLogoInstagram, IoLogoLinkedin,
  IoCallOutline, IoLocationOutline, IoSparkles,
  IoShieldCheckmarkOutline, IoGlobeOutline, IoArrowForward
} from 'react-icons/io5';
import { Link, useNavigate } from 'react-router-dom';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const navigate    = useNavigate();

  const footerSections = [
    {
      title: 'Healthcare Hub',
      links: [
        { name: 'Our Services',    path: '/services' },
        { name: 'Medical Doctors', path: '/doctors' },
        { name: 'New Kru Clinic',  path: '/new-cru-clinic' },
        { name: 'Journal & News',  path: '/journal' },
      ],
    },
    {
      title: 'The Institution',
      links: [
        { name: 'Our History',       path: '/about/history' },
        { name: 'The Order',         path: '/about/the-order' },
        { name: 'Training Programs', path: '/about/training' },
        { name: 'Contact Support',   path: '/contact' },
      ],
    },
  ];

  return (
    <footer style={{ position:'relative', background:'#0a0f1a', color:'#94a3b8', paddingTop:'clamp(48px,8vw,96px)', paddingBottom:'clamp(32px,5vw,48px)', overflow:'hidden' }}>
      <style>{`
        .ft-orb1 { position:absolute; top:0; left:25%; width:clamp(200px,35vw,500px); height:clamp(200px,35vw,500px); background:rgba(37,99,235,0.1); border-radius:50%; filter:blur(120px); transform:translateY(-50%); pointer-events:none; }
        .ft-orb2 { position:absolute; bottom:0; right:0; width:clamp(160px,28vw,400px); height:clamp(160px,28vw,400px); background:rgba(99,102,241,0.05); border-radius:50%; filter:blur(100px); pointer-events:none; }

        .ft-nl-row  { display:grid; gap:clamp(24px,5vw,48px); padding-bottom:clamp(40px,7vw,80px); border-bottom:1px solid rgba(255,255,255,0.05); align-items:center; }
        .ft-nl-form { display:flex; padding:7px; background:rgba(255,255,255,0.05); border:1px solid rgba(255,255,255,0.1); border-radius:clamp(16px,3vw,32px); transition:border-color 0.3s; }
        .ft-nl-form:focus-within { border-color:rgba(37,99,235,0.5); }
        .ft-nl-input { background:transparent; border:none; outline:none; flex:1; color:#fff; font-size:clamp(12px,1.5vw,14px); min-width:0; }
        .ft-nl-btn   { background:#2563eb; color:#fff; border:none; border-radius:clamp(12px,2vw,24px); cursor:pointer; display:flex; align-items:center; gap:7px; padding:clamp(10px,2vw,16px) clamp(14px,2vw,20px); font-size:10px; font-weight:900; text-transform:uppercase; letter-spacing:0.15em; transition:background 0.2s; white-space:nowrap; flex-shrink:0; text-decoration:none; }
        .ft-nl-btn:hover { background:#1d4ed8; }
        .ft-nl-btn-label { display:none; }
        .ft-nl-note { display:flex; align-items:center; gap:7px; margin-top:12px; }

        .ft-links-grid { display:grid; grid-template-columns:1fr 1fr; gap:clamp(28px,5vw,48px); padding:clamp(32px,6vw,80px) 0; }
        .ft-brand-col  { grid-column:1/-1; }

        .ft-bottom    { padding-top:clamp(24px,4vw,48px); border-top:1px solid rgba(255,255,255,0.05); display:flex; flex-direction:column; gap:16px; align-items:center; }
        .ft-legal     { display:flex; flex-direction:column; align-items:center; gap:12px; }
        .ft-badges    { display:flex; gap:12px; flex-wrap:wrap; justify-content:center; }
        .ft-links-row { display:flex; align-items:center; gap:clamp(16px,3vw,32px); flex-wrap:wrap; justify-content:center; }

        .ft-social a { width:38px; height:38px; border-radius:10px; background:rgba(255,255,255,0.05); border:1px solid rgba(255,255,255,0.05); display:flex; align-items:center; justify-content:center; color:#fff; transition:all 0.2s; text-decoration:none; }
        .ft-social a:hover { background:#2563eb; border-color:#2563eb; }

        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.5} }

        @media (min-width: 640px) {
          .ft-nl-row       { grid-template-columns:1fr 1fr; }
          .ft-nl-btn-label { display:inline !important; }
          .ft-bottom       { flex-direction:row; justify-content:space-between; }
          .ft-legal        { flex-direction:row; }
        }
        @media (min-width: 900px) {
          .ft-links-grid { grid-template-columns:2fr 1fr 1fr 1fr; }
          .ft-brand-col  { grid-column:auto; }
        }
      `}</style>

      <div className="ft-orb1"/>
      <div className="ft-orb2"/>

      <div style={{ maxWidth:1280, margin:'0 auto', padding:'0 clamp(14px,4vw,32px)', position:'relative', zIndex:1 }}>

        {/* ── Newsletter / Contact CTA ── */}
        <div className="ft-nl-row">
          <div>
            <h2 style={{ fontSize:'clamp(1.5rem,4vw,2.5rem)', fontWeight:900, color:'#fff', letterSpacing:'-0.03em', lineHeight:1.15, marginBottom:14 }}>
              Stay Synced with <br/>
              <span style={{ color:'#3b82f6' }}>SJCH Intelligence</span>
            </h2>
            <p style={{ fontSize:'clamp(13px,1.5vw,15px)', color:'#64748b', fontWeight:500, maxWidth:400, lineHeight:1.65 }}>
              Join 5,000+ patients receiving real-time health updates and clinic news directly to their encrypted portal.
            </p>
          </div>
          <div>
            <div className="ft-nl-form">
              <input
                type="email"
                placeholder="Enter your email for AI updates..."
                className="ft-nl-input"
                style={{ padding:'0 clamp(10px,2vw,20px)' }}
              />
              {/* FIX: was a <button> with no action — now a Link to /contact */}
              <Link to="/contact" className="ft-nl-btn">
                <span className="ft-nl-btn-label">Join Network</span>
                <IoArrowForward size={15}/>
              </Link>
            </div>
            <div className="ft-nl-note">
              <div style={{ width:7, height:7, background:'#10b981', borderRadius:'50%', animation:'pulse 2s ease-in-out infinite', flexShrink:0 }}/>
              <span style={{ fontSize:9, fontWeight:700, textTransform:'uppercase', letterSpacing:'0.12em', color:'#475569' }}>
                AI Personalization Active
              </span>
            </div>
          </div>
        </div>

        {/* ── Main links ── */}
        <div className="ft-links-grid">

          {/* Brand */}
          <div className="ft-brand-col">
            <Link to="/" style={{ display:'inline-flex', alignItems:'center', gap:10, marginBottom:20, textDecoration:'none' }}>
              <div style={{ width:38, height:38, background:'#2563eb', borderRadius:14, display:'flex', alignItems:'center', justifyContent:'center', color:'#fff', boxShadow:'0 4px 16px rgba(37,99,235,0.25)', flexShrink:0 }}>
                <IoSparkles size={18}/>
              </div>
              <span style={{ fontSize:'clamp(1.1rem,2.5vw,1.6rem)', fontWeight:900, color:'#fff', letterSpacing:'-0.03em', textTransform:'uppercase' }}>
                SJCH <span style={{ color:'#3b82f6' }}>2026</span>
              </span>
            </Link>
            <p style={{ fontSize:'clamp(12px,1.5vw,14px)', lineHeight:1.7, marginBottom:20, maxWidth:320, color:'#64748b' }}>
              Saint Joseph's Catholic Hospital is a leading medical institution in Monrovia, merging spiritual compassion with advanced medical diagnostics.
            </p>
            <div className="ft-social" style={{ display:'flex', gap:10 }}>
              {[<IoLogoFacebook/>, <IoLogoTwitter/>, <IoLogoInstagram/>, <IoLogoLinkedin/>].map((icon, i) => (
                <a key={i} href="#" aria-label={`Social ${i}`}>{icon}</a>
              ))}
            </div>
          </div>

          {/* Nav columns */}
          {footerSections.map((section, i) => (
            <div key={i}>
              <h4 style={{ color:'#fff', fontWeight:900, textTransform:'uppercase', fontSize:10, letterSpacing:'0.2em', marginBottom:'clamp(16px,3vw,32px)' }}>
                {section.title}
              </h4>
              <ul style={{ listStyle:'none', padding:0, margin:0, display:'flex', flexDirection:'column', gap:14 }}>
                {section.links.map((link, j) => (
                  <li key={j}>
                    <Link to={link.path}
                      style={{ fontSize:'clamp(12px,1.5vw,14px)', color:'#64748b', textDecoration:'none', display:'inline-flex', alignItems:'center', transition:'color 0.2s, transform 0.2s' }}
                      onMouseEnter={e=>{ e.currentTarget.style.color='#3b82f6'; e.currentTarget.style.transform='translateX(4px)'; }}
                      onMouseLeave={e=>{ e.currentTarget.style.color='#64748b'; e.currentTarget.style.transform='translateX(0)'; }}>
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Contact column */}
          <div>
            <h4 style={{ color:'#fff', fontWeight:900, textTransform:'uppercase', fontSize:10, letterSpacing:'0.2em', marginBottom:'clamp(16px,3vw,32px)' }}>
              Global Reach
            </h4>
            <div style={{ display:'flex', flexDirection:'column', gap:18 }}>
              <div style={{ display:'flex', alignItems:'flex-start', gap:12 }}>
                <IoLocationOutline style={{ color:'#3b82f6', flexShrink:0, marginTop:1 }} size={18}/>
                <p style={{ fontSize:12, lineHeight:1.5, margin:0 }}>Old Road, Sinkor<br/>Monrovia, Liberia</p>
              </div>
              <div style={{ display:'flex', alignItems:'center', gap:12 }}>
                <IoCallOutline style={{ color:'#3b82f6', flexShrink:0 }} size={18}/>
                <p style={{ fontSize:12, fontWeight:700, color:'#fff', margin:0 }}>+231 888 785 931</p>
              </div>
              <div style={{ padding:'12px 16px', background:'rgba(37,99,235,0.1)', border:'1px solid rgba(37,99,235,0.2)', borderRadius:16 }}>
                <p style={{ fontSize:9, fontWeight:900, color:'#60a5fa', textTransform:'uppercase', letterSpacing:'0.15em', margin:'0 0 4px' }}>Emergency 24/7</p>
                <p style={{ fontSize:12, color:'#fff', fontWeight:700, margin:0 }}>Dial 911 (Local Sync)</p>
              </div>
            </div>
          </div>
        </div>

        {/* ── Bottom bar ── */}
        <div className="ft-bottom">
          <div className="ft-legal">
            <p style={{ fontSize:10, fontWeight:700, textTransform:'uppercase', letterSpacing:'0.15em', color:'#475569', margin:0, whiteSpace:'nowrap' }}>
              © {currentYear} SJCH · All Rights Reserved.
            </p>
            <div className="ft-badges">
              <div style={{ display:'flex', alignItems:'center', gap:7 }}>
                <IoShieldCheckmarkOutline style={{ color:'#10b981' }} size={14}/>
                <span style={{ fontSize:9, fontWeight:700, color:'#475569', textTransform:'uppercase', letterSpacing:'0.1em' }}>HIPAA Compliant</span>
              </div>
              <div style={{ display:'flex', alignItems:'center', gap:7 }}>
                <IoGlobeOutline style={{ color:'#3b82f6' }} size={14}/>
                <span style={{ fontSize:9, fontWeight:700, color:'#475569', textTransform:'uppercase', letterSpacing:'0.1em' }}>Global Health Sync</span>
              </div>
            </div>
          </div>

          <div className="ft-links-row">
            <Link to="/privacy"
              style={{ fontSize:10, fontWeight:900, textTransform:'uppercase', letterSpacing:'0.15em', color:'#475569', textDecoration:'none', transition:'color 0.2s', whiteSpace:'nowrap' }}
              onMouseEnter={e=>e.currentTarget.style.color='#fff'}
              onMouseLeave={e=>e.currentTarget.style.color='#475569'}>
              Privacy Policy
            </Link>
            <Link to="/terms"
              style={{ fontSize:10, fontWeight:900, textTransform:'uppercase', letterSpacing:'0.15em', color:'#475569', textDecoration:'none', transition:'color 0.2s', whiteSpace:'nowrap' }}
              onMouseEnter={e=>e.currentTarget.style.color='#fff'}
              onMouseLeave={e=>e.currentTarget.style.color='#475569'}>
              Terms of Service
            </Link>
            <button
              onClick={() => window.scrollTo({ top:0, behavior:'smooth' })}
              style={{ width:42, height:42, borderRadius:'50%', border:'1px solid rgba(255,255,255,0.1)', background:'none', color:'#fff', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', transition:'background 0.2s', flexShrink:0 }}
              onMouseEnter={e=>e.currentTarget.style.background='rgba(255,255,255,0.08)'}
              onMouseLeave={e=>e.currentTarget.style.background='none'}
              title="Scroll to top">
              <motion.span animate={{ y:[0,-4,0] }} transition={{ repeat:Infinity, duration:2 }} style={{ fontSize:16, lineHeight:1 }}>↑</motion.span>
            </button>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;