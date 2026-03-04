import { motion } from 'framer-motion';
import { 
  IoLogoFacebook, IoLogoTwitter, IoLogoInstagram, IoLogoLinkedin,
  IoMailOutline, IoCallOutline, IoLocationOutline, IoSparkles,
  IoShieldCheckmarkOutline, IoGlobeOutline, IoArrowForward
} from 'react-icons/io5';
import { Link } from 'react-router-dom';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerSections = [
    {
      title: "Healthcare Hub",
      links: [
        { name: "Our Services", path: "/services" },
        { name: "Medical Doctors", path: "/doctors" },
        { name: "New Kru Clinic", path: "/new-cru-clinic" },
        { name: "Journal & News", path: "/journal" },
      ]
    },
    {
      title: "The Institution",
      links: [
        { name: "Our History", path: "/about/history" },
        { name: "The Order", path: "/about/the-order" },
        { name: "Training Programs", path: "/about/training" },
        { name: "Contact Support", path: "/contact" },
      ]
    }
  ];

  return (
    <footer className="relative bg-[#0a0f1a] text-slate-400 pt-24 pb-12 overflow-hidden">
      {/* --- AI AMBIENT GLOW BACKGROUND --- */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px] -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-indigo-600/5 rounded-full blur-[100px]" />

      <div className="max-w-7xl mx-auto px-4 lg:px-8 relative z-10">
        
        {/* --- TOP SECTION: NEWSLETTER AI --- */}
        <div className="grid lg:grid-cols-2 gap-12 pb-20 border-b border-white/5 items-center">
          <div>
            <h2 className="text-3xl lg:text-4xl font-black text-white tracking-tighter mb-4">
              Stay Synced with <br />
              <span className="text-blue-500">SJCH Intelligence</span>
            </h2>
            <p className="max-w-md text-slate-500 font-medium">
              Join 5,000+ patients receiving real-time health updates and clinic news directly to their encrypted portal.
            </p>
          </div>
          <div className="relative">
            <div className="flex p-2 bg-white/5 backdrop-blur-xl border border-white/10 rounded-[2rem] focus-within:border-blue-500/50 transition-all">
              <input 
                type="email" 
                placeholder="Enter your email for AI updates..." 
                className="bg-transparent border-none outline-none flex-1 px-6 text-white text-sm placeholder:text-slate-600"
              />
              <button className="bg-blue-600 hover:bg-blue-500 text-white p-4 rounded-[1.5rem] transition-all flex items-center gap-2 group">
                <span className="text-[10px] font-black uppercase tracking-widest hidden sm:block">Join Network</span>
                <IoArrowForward className="group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
            <div className="absolute -bottom-8 left-6 flex items-center gap-2">
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
              <span className="text-[10px] font-bold uppercase tracking-tighter text-slate-600">AI Personalization Active</span>
            </div>
          </div>
        </div>

        {/* --- MAIN LINKS SECTION --- */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-12 py-20">
          
          {/* Brand Column */}
          <div className="col-span-2 lg:col-span-2">
            <Link to="/" className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-blue-600/20">
                <IoSparkles size={20} />
              </div>
              <span className="text-2xl font-black text-white tracking-tighter uppercase">SJCH <span className="text-blue-500">2026</span></span>
            </Link>
            <p className="text-sm leading-relaxed mb-8 max-w-sm">
              Saint John Catholic Hospital is a leading medical institution in Monrovia, merging spiritual compassion with the world's most advanced medical AI and diagnostics.
            </p>
            <div className="flex gap-4">
              {[<IoLogoFacebook />, <IoLogoTwitter />, <IoLogoInstagram />, <IoLogoLinkedin />].map((icon, i) => (
                <a key={i} href="#" className="w-10 h-10 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center text-white hover:bg-blue-600 hover:border-blue-600 transition-all">
                  {icon}
                </a>
              ))}
            </div>
          </div>

          {/* Nav Columns */}
          {footerSections.map((section, i) => (
            <div key={i}>
              <h4 className="text-white font-black uppercase text-[11px] tracking-[0.2em] mb-8">{section.title}</h4>
              <ul className="space-y-4">
                {section.links.map((link, j) => (
                  <li key={j}>
                    <Link to={link.path} className="text-sm hover:text-blue-500 hover:translate-x-2 flex items-center transition-all">
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Contact Column */}
          <div>
            <h4 className="text-white font-black uppercase text-[11px] tracking-[0.2em] mb-8">Global Reach</h4>
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <IoLocationOutline className="text-blue-500 shrink-0" size={20} />
                <p className="text-xs leading-tight">Old Road, Sinkor <br /> Monrovia, Liberia</p>
              </div>
              <div className="flex items-center gap-4">
                <IoCallOutline className="text-blue-500 shrink-0" size={20} />
                <p className="text-xs font-bold text-white">+231 888785931</p>
              </div>
              <div className="p-4 bg-blue-600/10 border border-blue-600/20 rounded-2xl">
                <p className="text-[9px] font-black text-blue-400 uppercase mb-1">Emergency 24/7</p>
                <p className="text-xs text-white font-bold">Dial 911 (Local Sync)</p>
              </div>
            </div>
          </div>
        </div>

        {/* --- BOTTOM LEGAL & TECH BAR --- */}
        <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-6">
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-600">
              © {currentYear} SJCH  All Rights Reserved.
            </p>
            <div className="hidden sm:flex items-center gap-4 border-l border-white/10 pl-6">
              <div className="flex items-center gap-2">
                <IoShieldCheckmarkOutline className="text-emerald-500" />
                <span className="text-[9px] font-bold text-slate-500 uppercase tracking-tighter">HIPAA AI-Compliant</span>
              </div>
              <div className="flex items-center gap-2">
                <IoGlobeOutline className="text-blue-500" />
                <span className="text-[9px] font-bold text-slate-500 uppercase tracking-tighter">Global Health Sync</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-8">
            <Link to="/privacy" className="text-[10px] font-black uppercase tracking-widest hover:text-white transition-colors">Privacy Policy</Link>
            <Link to="/terms" className="text-[10px] font-black uppercase tracking-widest hover:text-white transition-colors">Terms of Service</Link>
            
            {/* Scroll to Top Trigger (Visual Only) */}
            <button 
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center text-white hover:bg-white/10 transition-all"
            >
              <motion.div animate={{ y: [0, -4, 0] }} transition={{ repeat: Infinity, duration: 2 }}>
                ↑
              </motion.div>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;