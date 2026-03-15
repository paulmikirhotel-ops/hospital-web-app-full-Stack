import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  IoArrowBack, IoTimeOutline, IoPersonOutline,
  IoShareSocialOutline, IoPrintOutline, IoBookmarkOutline,
  IoBookmark, IoHeartOutline, IoHeart, IoListOutline,
  IoCloseOutline, IoChevronUpOutline, IoLinkOutline,
  IoCheckmarkOutline, IoEyeOutline,
} from 'react-icons/io5';
import API from '../../../api/axiosConfig';

/* ─── Helpers ─── */
const estimateReadTime = (blocks = []) => {
  const text = blocks.map(b => b.data?.text || b.data?.code || '').join(' ');
  const words = text.replace(/<[^>]+>/g, '').trim().split(/\s+/).length;
  return Math.max(1, Math.round(words / 200));
};

const extractHeadings = (blocks = []) =>
  blocks
    .filter(b => b.type === 'header' && b.data?.text)
    .map((b, i) => ({
      id: `heading-${i}`,
      text: b.data.text.replace(/<[^>]+>/g, ''),
      level: b.data.level || 2,
    }));

/* ─── Block renderer ─── */
const renderBlock = (block, index) => {
  switch (block.type) {
    case 'header': {
      const level = block.data.level || 2;
      const sizes = {
        1: 'clamp(1.9rem,5vw,3.2rem)', 2: 'clamp(1.5rem,4vw,2.4rem)',
        3: 'clamp(1.25rem,3.5vw,1.9rem)', 4: 'clamp(1.1rem,3vw,1.5rem)',
        5: 'clamp(1rem,2.5vw,1.25rem)', 6: 'clamp(0.95rem,2vw,1.1rem)',
      };
      const Tag = `h${level}`;
      return (
        <Tag key={index} id={`heading-${index}`}
          style={{ fontSize:sizes[level], fontWeight:900, color:'#0a0f1e', margin:'clamp(36px,6vw,56px) 0 clamp(12px,2vw,20px)', letterSpacing:'-0.03em', lineHeight:1.12, fontFamily:'Georgia,"Times New Roman",serif' }}
          dangerouslySetInnerHTML={{ __html: block.data.text }}/>
      );
    }
    case 'paragraph':
      if (!block.data.text) return null;
      return (
        <p key={index}
          style={{ color:'#2d3748', fontSize:'clamp(16px,2vw,19px)', lineHeight:1.9, marginBottom:'clamp(22px,3vw,32px)', fontWeight:400, fontFamily:'Georgia,"Times New Roman",serif', letterSpacing:'0.01em' }}
          dangerouslySetInnerHTML={{ __html: block.data.text }}/>
      );
    case 'list': {
      const ListTag = block.data.style === 'ordered' ? 'ol' : 'ul';
      return (
        <ListTag key={index} style={{ paddingLeft:'clamp(20px,4vw,32px)', marginBottom:'clamp(22px,3vw,32px)', display:'flex', flexDirection:'column', gap:10, listStyleType:block.data.style==='ordered'?'decimal':'disc' }}>
          {(block.data.items||[]).map((item,i) => {
            const text = typeof item==='string' ? item : item?.content||item?.text||'';
            return <li key={i} style={{ color:'#2d3748', fontSize:'clamp(15px,2vw,18px)', lineHeight:1.8, fontFamily:'Georgia,"Times New Roman",serif' }} dangerouslySetInnerHTML={{ __html:text }}/>;
          })}
        </ListTag>
      );
    }
    case 'quote':
      return (
        <blockquote key={index} style={{ margin:'clamp(32px,5vw,56px) clamp(-8px,-2vw,-24px)', padding:'clamp(24px,4vw,40px) clamp(24px,5vw,48px)', borderLeft:'5px solid #1a56db', background:'linear-gradient(135deg,#eff6ff,#f8faff)', borderRadius:'0 clamp(16px,3vw,24px) clamp(16px,3vw,24px) 0', position:'relative' }}>
          <span style={{ position:'absolute', top:-10, left:'clamp(16px,3vw,32px)', fontSize:'clamp(60px,8vw,96px)', color:'#1a56db', opacity:0.12, fontFamily:'Georgia,serif', lineHeight:1, userSelect:'none' }}>"</span>
          <p style={{ fontSize:'clamp(1.1rem,2.5vw,1.5rem)', fontWeight:700, color:'#1e293b', fontStyle:'italic', marginBottom:block.data.caption?14:0, lineHeight:1.55, fontFamily:'Georgia,"Times New Roman",serif', position:'relative', zIndex:1 }} dangerouslySetInnerHTML={{ __html:`"${block.data.text}"` }}/>
          {block.data.caption && <cite style={{ fontSize:11, fontWeight:900, textTransform:'uppercase', color:'#1a56db', letterSpacing:'0.2em', fontStyle:'normal' }}>— {block.data.caption}</cite>}
        </blockquote>
      );
    case 'image': {
      const imgUrl = block.data.file?.url || block.data.url || '';
      if (!imgUrl) return null;
      return (
        <figure key={index} style={{ margin:'clamp(32px,5vw,56px) clamp(-14px,-3vw,-40px)' }}>
          <div style={{ borderRadius:'clamp(12px,3vw,24px)', overflow:'hidden', boxShadow:'0 20px 60px rgba(0,0,0,0.15)' }}>
            <img src={imgUrl} alt={block.data.caption||''} style={{ width:'100%', display:'block', objectFit:'cover' }}/>
          </div>
          {block.data.caption && <figcaption style={{ textAlign:'center', fontSize:11, color:'#94a3b8', fontWeight:700, marginTop:14, textTransform:'uppercase', letterSpacing:'0.18em' }}>{block.data.caption}</figcaption>}
        </figure>
      );
    }
    case 'delimiter':
      return (
        <div key={index} style={{ display:'flex', alignItems:'center', justifyContent:'center', margin:'clamp(32px,5vw,56px) 0', gap:16 }}>
          {[0,1,2].map(i => <div key={i} style={{ width:i===1?32:8, height:i===1?2:8, borderRadius:999, background:i===1?'#1a56db':'#e2e8f0' }}/>)}
        </div>
      );
    case 'code':
      return (
        <div key={index} style={{ margin:'clamp(24px,4vw,40px) 0' }}>
          <div style={{ display:'flex', alignItems:'center', gap:6, padding:'10px 16px', background:'#1e293b', borderRadius:'clamp(10px,2vw,16px) clamp(10px,2vw,16px) 0 0' }}>
            {['#ef4444','#f59e0b','#22c55e'].map((c,i)=><div key={i} style={{ width:10, height:10, borderRadius:'50%', background:c }}/>)}
            <span style={{ marginLeft:8, fontSize:10, fontWeight:700, color:'#94a3b8', textTransform:'uppercase', letterSpacing:'0.15em' }}>Code</span>
          </div>
          <pre style={{ background:'#0f172a', color:'#4ade80', padding:'clamp(16px,4vw,28px)', borderRadius:`0 0 clamp(10px,2vw,16px) clamp(10px,2vw,16px)`, overflowX:'auto', fontSize:'clamp(12px,1.5vw,14px)', fontFamily:'"Fira Code","Cascadia Code",monospace', lineHeight:1.7, margin:0 }}>
            <code>{block.data.code}</code>
          </pre>
        </div>
      );
    case 'warning':
      return (
        <div key={index} style={{ background:'#fffbeb', borderLeft:'4px solid #f59e0b', padding:'clamp(16px,3vw,24px) clamp(20px,4vw,32px)', borderRadius:`0 clamp(12px,3vw,20px) clamp(12px,3vw,20px) 0`, margin:'clamp(24px,4vw,40px) 0', display:'flex', gap:14, alignItems:'flex-start' }}>
          <span style={{ fontSize:22, flexShrink:0 }}>⚠️</span>
          <div>
            {block.data.title && <p style={{ fontSize:11, fontWeight:900, color:'#92400e', textTransform:'uppercase', letterSpacing:'0.2em', marginBottom:6, marginTop:0 }}>{block.data.title}</p>}
            <p style={{ color:'#92400e', fontWeight:500, margin:0, lineHeight:1.65, fontSize:'clamp(13px,1.5vw,15px)' }} dangerouslySetInnerHTML={{ __html:block.data.message }}/>
          </div>
        </div>
      );
    default: return null;
  }
};

/* ─── TOC Panel ─── */
const TOCPanel = ({ headings, activeId, onClose }) => (
  <motion.div initial={{ opacity:0, x:24 }} animate={{ opacity:1, x:0 }} exit={{ opacity:0, x:24 }}
    style={{ position:'fixed', top:72, right:'clamp(12px,3vw,32px)', width:'clamp(200px,22vw,260px)', background:'rgba(255,255,255,0.97)', backdropFilter:'blur(20px)', borderRadius:20, border:'1px solid #e2e8f0', boxShadow:'0 20px 60px rgba(0,0,0,0.12)', padding:'20px 0', zIndex:50, maxHeight:'calc(100vh - 100px)', overflowY:'auto' }}>
    <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'0 20px 14px', borderBottom:'1px solid #f1f5f9' }}>
      <span style={{ fontSize:10, fontWeight:900, textTransform:'uppercase', letterSpacing:'0.2em', color:'#94a3b8' }}>Contents</span>
      <button onClick={onClose} style={{ background:'none', border:'none', cursor:'pointer', color:'#94a3b8', fontSize:18, display:'flex', padding:0 }}><IoCloseOutline/></button>
    </div>
    <nav style={{ padding:'10px 0' }}>
      {headings.map(h => (
        <a key={h.id} href={`#${h.id}`}
          onClick={e=>{ e.preventDefault(); document.getElementById(h.id)?.scrollIntoView({ behavior:'smooth', block:'start' }); }}
          style={{ display:'block', padding:`7px ${h.level<=2?20:32}px`, fontSize:h.level<=2?12:11, fontWeight:activeId===h.id?900:600, color:activeId===h.id?'#1a56db':'#475569', textDecoration:'none', borderLeft:`2px solid ${activeId===h.id?'#1a56db':'transparent'}`, marginLeft:h.level>2?12:0, transition:'all 0.15s', lineHeight:1.4 }}>
          {h.text.length>42 ? h.text.slice(0,42)+'…' : h.text}
        </a>
      ))}
    </nav>
  </motion.div>
);

/* ─── Main ─── */
const BlogDetails = () => {
  const { id }   = useParams();
  const navigate = useNavigate();

  const [blog, setBlog]         = useState(null);
  const [loading, setLoading]   = useState(true);
  const [copied, setCopied]     = useState(false);
  const [liked, setLiked]       = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [bookmarked, setBookmarked] = useState(false);
  const [showTOC, setShowTOC]   = useState(false);
  const [activeHeading, setActiveHeading] = useState('');
  const [readProgress, setReadProgress]   = useState(0);
  const [showTop, setShowTop]   = useState(false);
  const [views] = useState(() => Math.floor(Math.random()*900)+200);

  /* Progress + scroll-top */
  useEffect(() => {
    const fn = () => {
      const doc   = document.documentElement;
      const total = doc.scrollHeight - doc.clientHeight;
      setReadProgress(total > 0 ? Math.min(100, (window.scrollY / total) * 100) : 0);
      setShowTop(window.scrollY > 400);
    };
    window.addEventListener('scroll', fn, { passive:true });
    return () => window.removeEventListener('scroll', fn);
  }, []);

  /* Active heading */
  useEffect(() => {
    if (!blog) return;
    const els = document.querySelectorAll('[id^="heading-"]');
    const obs = new IntersectionObserver(
      entries => entries.forEach(e => { if (e.isIntersecting) setActiveHeading(e.target.id); }),
      { rootMargin:'-20% 0px -70% 0px' }
    );
    els.forEach(el => obs.observe(el));
    return () => obs.disconnect();
  }, [blog]);

  useEffect(() => {
    const fetch_ = async () => {
      if (!id || id==='undefined' || id.length!==24) { setLoading(false); return; }
      try {
        const { data } = await API.get(`/blogs/${id}`);
        let blogData = data.post || data;
        if (typeof blogData.content==='string') {
          try { blogData.content = JSON.parse(blogData.content); } catch { blogData.content = null; }
        }
        setBlog(blogData);
        setLikeCount(blogData.likes || Math.floor(Math.random()*80)+12);
        document.title = `${blogData.title} | SJCH Journal`;
      } catch { setBlog(null); }
      finally { setLoading(false); }
    };
    fetch_();
    window.scrollTo(0,0);
    return () => { document.title = "Saint Joseph's Hospital"; };
  }, [id]);

  const handleShare = useCallback(() => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true); setTimeout(()=>setCopied(false), 2500);
  }, []);

  const handleLike = useCallback(() => {
    setLiked(l => { setLikeCount(c => l ? c-1 : c+1); return !l; });
  }, []);

  /* Loading */
  if (loading) return (
    <div style={{ minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', background:'#fff' }}>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:20 }}>
        <div style={{ position:'relative', width:64, height:64 }}>
          <div style={{ width:64, height:64, border:'3px solid #e2e8f0', borderTopColor:'#1a56db', borderRadius:'50%', animation:'spin 0.9s linear infinite' }}/>
          <div style={{ position:'absolute', inset:6, border:'3px solid #e2e8f0', borderTopColor:'#60a5fa', borderRadius:'50%', animation:'spin 0.6s linear infinite reverse' }}/>
        </div>
        <p style={{ fontSize:10, fontWeight:900, textTransform:'uppercase', letterSpacing:'0.35em', color:'#94a3b8' }}>Loading Article...</p>
      </div>
    </div>
  );

  if (!blog) return (
    <div style={{ minHeight:'100vh', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:20, padding:24, background:'#fff' }}>
      <div style={{ width:64, height:64, borderRadius:20, background:'#eff6ff', display:'flex', alignItems:'center', justifyContent:'center', fontSize:28 }}>📋</div>
      <h2 style={{ fontSize:'clamp(1.3rem,3vw,2rem)', fontWeight:900, color:'#0f172a', margin:0 }}>Article Not Found</h2>
      <button onClick={()=>navigate('/blog')} style={{ padding:'13px 28px', background:'#1a56db', color:'#fff', borderRadius:14, fontWeight:900, fontSize:10, textTransform:'uppercase', letterSpacing:'0.2em', border:'none', cursor:'pointer' }}>Return to Journal</button>
    </div>
  );

  const readTime   = estimateReadTime(blog.content?.blocks||[]);
  const headings   = extractHeadings(blog.content?.blocks||[]);
  const pubDate    = new Date(blog.createdAt).toLocaleDateString('en-US',{ year:'numeric', month:'long', day:'numeric' });
  const authorInit = (blog.author?.name||'M')[0].toUpperCase();

  return (
    <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} style={{ minHeight:'100vh', background:'#fff' }}>
      <style>{`
        @keyframes spin      { to { transform:rotate(360deg); } }
        @keyframes heartPop  { 0%{transform:scale(1)} 50%{transform:scale(1.45)} 100%{transform:scale(1)} }

        .bd-progress {
          position:fixed; top:0; left:0; height:3px;
          background:linear-gradient(to right,#1a56db,#0ea5e9,#60a5fa);
          z-index:1000; transition:width 0.08s linear;
          box-shadow:0 0 14px rgba(26,86,219,0.55);
        }

        .bd-nav {
          position:sticky; top:0; z-index:100;
          background:rgba(255,255,255,0.92);
          backdrop-filter:blur(20px); -webkit-backdrop-filter:blur(20px);
          border-bottom:1px solid rgba(241,245,249,0.9);
        }

        .bd-fab {
          position:fixed; bottom:clamp(16px,3vw,28px); right:clamp(14px,3vw,28px);
          display:flex; flex-direction:column; gap:9px; z-index:60;
        }
        .bd-fab-btn {
          width:clamp(40px,6vw,48px); height:clamp(40px,6vw,48px);
          border-radius:50%; border:1px solid #e2e8f0; cursor:pointer;
          display:flex; align-items:center; justify-content:center;
          font-size:clamp(16px,2.5vw,19px); background:#fff;
          box-shadow:0 4px 16px rgba(0,0,0,0.1); transition:all 0.2s;
        }
        .bd-fab-btn:hover { transform:scale(1.1); }
        .bd-fab-btn:active { transform:scale(0.92); }

        /* Drop-cap */
        .bd-body > p:first-of-type::first-letter {
          float:left; font-size:clamp(3.2rem,6vw,5rem);
          font-weight:900; line-height:0.75;
          padding-right:12px; padding-top:6px;
          color:#1a56db; font-family:Georgia,serif;
        }

        .bd-body a { color:#1a56db; text-decoration:underline; text-decoration-thickness:1px; text-underline-offset:3px; }
        .bd-body a:hover { color:#1e40af; }

        .bd-share-strip {
          display:flex; flex-wrap:wrap; align-items:center;
          gap:clamp(8px,2vw,16px);
          padding:clamp(18px,3vw,28px) 0;
          border-top:1px solid #f1f5f9; border-bottom:1px solid #f1f5f9;
          margin-bottom:clamp(28px,5vw,48px);
        }
        .bd-share-btn {
          display:flex; align-items:center; gap:7px;
          padding:clamp(7px,1.5vw,10px) clamp(12px,2vw,18px);
          border-radius:999px; cursor:pointer;
          font-size:clamp(11px,1.5vw,13px); font-weight:800;
          transition:all 0.2s;
        }

        .bd-author-card {
          display:flex; align-items:center;
          gap:clamp(14px,3vw,24px);
          padding:clamp(20px,4vw,32px);
          background:linear-gradient(135deg,#f0f9ff,#f8fafc);
          border-radius:clamp(16px,3vw,28px);
          border:1px solid #e0f2fe;
          margin:clamp(32px,5vw,56px) 0;
        }

        @media (max-width:1100px) { .toc-desktop { display:none !important; } }
      `}</style>

      {/* Progress bar */}
      <div className="bd-progress" style={{ width:`${readProgress}%` }}/>

      {/* Nav */}
      <nav className="bd-nav">
        <div style={{ maxWidth:1100, margin:'0 auto', padding:'0 clamp(14px,4vw,32px)', height:56, display:'flex', alignItems:'center', justifyContent:'space-between', gap:12 }}>
          <button onClick={()=>navigate('/blog')}
            style={{ display:'flex', alignItems:'center', gap:7, fontSize:10, fontWeight:900, textTransform:'uppercase', letterSpacing:'0.2em', color:'#94a3b8', background:'none', border:'none', cursor:'pointer', padding:0, transition:'color 0.2s', flexShrink:0 }}
            onMouseEnter={e=>e.currentTarget.style.color='#1a56db'}
            onMouseLeave={e=>e.currentTarget.style.color='#94a3b8'}>
            <IoArrowBack size={14}/> Back
          </button>

          {/* Title pill */}
          <p style={{ fontSize:11, fontWeight:700, color:'#94a3b8', margin:0, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap', flex:1, textAlign:'center', maxWidth:360 }}>
            {blog.title}
          </p>

          <div style={{ display:'flex', gap:8, alignItems:'center', flexShrink:0 }}>
            {/* Progress pill */}
            <div style={{ display:'flex', alignItems:'center', gap:6, padding:'4px 11px', background:'#f1f5f9', borderRadius:999 }}>
              <div style={{ width:22, height:3, background:'#e2e8f0', borderRadius:999, overflow:'hidden' }}>
                <div style={{ height:'100%', background:'#1a56db', width:`${readProgress}%`, borderRadius:999, transition:'width 0.08s' }}/>
              </div>
              <span style={{ fontSize:9, fontWeight:900, color:'#94a3b8', letterSpacing:'0.1em' }}>{Math.round(readProgress)}%</span>
            </div>

            {headings.length > 0 && (
              <button onClick={()=>setShowTOC(!showTOC)}
                style={{ width:34, height:34, borderRadius:10, background:showTOC?'#eff6ff':'#f8fafc', border:`1px solid ${showTOC?'#bfdbfe':'#e2e8f0'}`, color:showTOC?'#1a56db':'#64748b', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', fontSize:17, transition:'all 0.2s' }}>
                <IoListOutline/>
              </button>
            )}

            <button onClick={()=>window.print()}
              style={{ width:34, height:34, borderRadius:10, background:'#f8fafc', border:'1px solid #e2e8f0', color:'#64748b', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', fontSize:16, transition:'all 0.2s' }}
              onMouseEnter={e=>{e.currentTarget.style.background='#eff6ff';e.currentTarget.style.color='#1a56db';e.currentTarget.style.borderColor='#bfdbfe';}}
              onMouseLeave={e=>{e.currentTarget.style.background='#f8fafc';e.currentTarget.style.color='#64748b';e.currentTarget.style.borderColor='#e2e8f0';}}>
              <IoPrintOutline/>
            </button>
          </div>
        </div>
      </nav>

      {/* TOC */}
      <AnimatePresence>
        {showTOC && headings.length > 0 && (
          <div className="toc-desktop">
            <TOCPanel headings={headings} activeId={activeHeading} onClose={()=>setShowTOC(false)}/>
          </div>
        )}
      </AnimatePresence>

      {/* ── HERO ── */}
      <header style={{ position:'relative', overflow:'hidden', background:'#0a0f1e', paddingBottom:0 }}>
        {blog.coverImg && (
          <div style={{ position:'absolute', inset:0 }}>
            <img src={blog.coverImg} alt="" style={{ width:'100%', height:'100%', objectFit:'cover', filter:'blur(48px)', transform:'scale(1.1)', opacity:0.28 }}/>
            <div style={{ position:'absolute', inset:0, background:'linear-gradient(to bottom,rgba(10,15,30,0.55) 0%,rgba(10,15,30,0.92) 100%)' }}/>
          </div>
        )}
        <div style={{ position:'relative', zIndex:1, maxWidth:900, margin:'0 auto', padding:'clamp(48px,8vw,96px) clamp(16px,4vw,32px) clamp(56px,8vw,96px)' }}>
          {/* Category + meta */}
          <motion.div initial={{ opacity:0, y:14 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.1 }}
            style={{ display:'flex', flexWrap:'wrap', alignItems:'center', gap:10, marginBottom:'clamp(20px,4vw,32px)' }}>
            <span style={{ background:'#1a56db', color:'#fff', padding:'5px 14px', borderRadius:999, fontSize:9, fontWeight:900, textTransform:'uppercase', letterSpacing:'0.25em' }}>{blog.category}</span>
            <span style={{ fontSize:10, color:'rgba(255,255,255,0.45)', fontWeight:600, display:'flex', alignItems:'center', gap:5 }}><IoTimeOutline size={12}/>{readTime} min read</span>
            <span style={{ fontSize:10, color:'rgba(255,255,255,0.45)', fontWeight:600, display:'flex', alignItems:'center', gap:5 }}><IoEyeOutline size={12}/>{views.toLocaleString()} views</span>
            <span style={{ fontSize:10, color:'rgba(255,255,255,0.45)', fontWeight:600, display:'flex', alignItems:'center', gap:5 }}><IoHeartOutline size={12}/>{likeCount} likes</span>
          </motion.div>

          {/* Title */}
          <motion.h1 initial={{ opacity:0, y:24 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.15 }}
            style={{ fontSize:'clamp(2rem,6.5vw,5rem)', fontWeight:900, color:'#fff', letterSpacing:'-0.04em', lineHeight:1.04, margin:'0 0 clamp(16px,3vw,28px)', fontFamily:'Georgia,"Times New Roman",serif' }}>
            {blog.title}
          </motion.h1>

          {blog.description && (
            <motion.p initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:0.2 }}
              style={{ fontSize:'clamp(14px,2vw,19px)', color:'rgba(255,255,255,0.62)', lineHeight:1.72, marginBottom:'clamp(24px,4vw,40px)', maxWidth:640, fontFamily:'Georgia,serif' }}>
              {blog.description}
            </motion.p>
          )}

          {/* Author row */}
          <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:0.25 }}
            style={{ display:'flex', flexWrap:'wrap', alignItems:'center', gap:'clamp(14px,3vw,28px)', paddingTop:'clamp(20px,3vw,28px)', borderTop:'1px solid rgba(255,255,255,0.1)' }}>
            <div style={{ display:'flex', alignItems:'center', gap:12 }}>
              <div style={{ width:44, height:44, borderRadius:'50%', background:'linear-gradient(135deg,#1a56db,#0ea5e9)', display:'flex', alignItems:'center', justifyContent:'center', color:'#fff', fontSize:18, fontWeight:700, flexShrink:0 }}>{authorInit}</div>
              <div>
                <p style={{ fontSize:13, fontWeight:800, color:'#fff', margin:0 }}>Dr. {blog.author?.name||'Medical Staff'}</p>
                <p style={{ fontSize:10, color:'rgba(255,255,255,0.4)', margin:0, textTransform:'uppercase', letterSpacing:'0.15em' }}>Author</p>
              </div>
            </div>
            <div style={{ width:1, height:32, background:'rgba(255,255,255,0.15)' }}/>
            <div>
              <p style={{ fontSize:13, fontWeight:700, color:'rgba(255,255,255,0.8)', margin:0 }}>{pubDate}</p>
              <p style={{ fontSize:10, color:'rgba(255,255,255,0.35)', margin:0, textTransform:'uppercase', letterSpacing:'0.15em' }}>Published</p>
            </div>
          </motion.div>
        </div>
      </header>

      {/* ── COVER IMAGE ── */}
      {blog.coverImg && (
        <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.3 }}
          style={{ maxWidth:1000, margin:'-clamp(20px,3vw,40px) auto 0', padding:'0 clamp(16px,4vw,32px)', position:'relative', zIndex:2 }}>
          <div style={{ borderRadius:'clamp(16px,3vw,32px)', overflow:'hidden', boxShadow:'0 32px 80px rgba(0,0,0,0.25)' }}>
            <img src={blog.coverImg} alt={blog.title} style={{ width:'100%', aspectRatio:'21/9', objectFit:'cover', display:'block' }}/>
          </div>
        </motion.div>
      )}

      {/* ── CONTENT ── */}
      <div style={{ maxWidth:900, margin:'0 auto', padding:'clamp(40px,6vw,80px) clamp(16px,4vw,32px)' }}>
        <div style={{ maxWidth:720, margin:'0 auto' }}>

          {/* Share strip */}
          <div className="bd-share-strip">
            <span style={{ fontSize:10, fontWeight:900, textTransform:'uppercase', letterSpacing:'0.2em', color:'#94a3b8', marginRight:4 }}>Share</span>

            <button className="bd-share-btn"
              style={{ background:liked?'#fef2f2':'#f8fafc', border:`1px solid ${liked?'#fecaca':'#e2e8f0'}`, color:liked?'#dc2626':'#64748b', animation:liked?'heartPop 0.35s ease':'none' }}
              onClick={handleLike}>
              {liked ? <IoHeart style={{ color:'#dc2626' }}/> : <IoHeartOutline/>} {likeCount}
            </button>

            <button className="bd-share-btn"
              style={{ background:bookmarked?'#eff6ff':'#f8fafc', border:`1px solid ${bookmarked?'#bfdbfe':'#e2e8f0'}`, color:bookmarked?'#1a56db':'#64748b' }}
              onClick={()=>setBookmarked(b=>!b)}>
              {bookmarked ? <IoBookmark style={{ color:'#1a56db' }}/> : <IoBookmarkOutline/>}
              {bookmarked ? 'Saved' : 'Save'}
            </button>

            <button className="bd-share-btn"
              style={{ background:copied?'#f0fdf4':'#f8fafc', border:`1px solid ${copied?'#bbf7d0':'#e2e8f0'}`, color:copied?'#16a34a':'#64748b' }}
              onClick={handleShare}>
              {copied ? <IoCheckmarkOutline style={{ color:'#16a34a' }}/> : <IoLinkOutline/>}
              {copied ? 'Copied!' : 'Copy link'}
            </button>
          </div>

          {/* Body */}
          <div className="bd-body">
            {blog.content?.blocks?.length
              ? blog.content.blocks.map(renderBlock)
              : <p style={{ color:'#94a3b8', fontStyle:'italic', fontSize:17, fontFamily:'Georgia,serif' }}>No content available.</p>
            }
          </div>

          {/* Author card */}
          <div className="bd-author-card">
            <div style={{ width:'clamp(52px,10vw,68px)', height:'clamp(52px,10vw,68px)', borderRadius:'50%', background:'linear-gradient(135deg,#1a56db,#0ea5e9)', display:'flex', alignItems:'center', justifyContent:'center', color:'#fff', fontSize:'clamp(20px,3vw,26px)', fontWeight:700, flexShrink:0 }}>{authorInit}</div>
            <div style={{ flex:1, minWidth:0 }}>
              <p style={{ fontSize:9, fontWeight:900, textTransform:'uppercase', letterSpacing:'0.2em', color:'#1a56db', margin:'0 0 4px' }}>Article Author</p>
              <p style={{ fontSize:'clamp(14px,2vw,18px)', fontWeight:900, color:'#0f172a', margin:'0 0 3px', letterSpacing:'-0.01em' }}>Dr. {blog.author?.name||'Medical Staff'}</p>
              <p style={{ fontSize:'clamp(11px,1.5vw,13px)', color:'#64748b', margin:0 }}>Saint Joseph's Catholic Hospital</p>
            </div>
          </div>

          {/* Bottom row */}
          <div style={{ display:'flex', flexWrap:'wrap', alignItems:'center', justifyContent:'space-between', gap:14, paddingTop:'clamp(24px,4vw,40px)', borderTop:'1px solid #f1f5f9' }}>
            <button onClick={()=>navigate('/blog')}
              style={{ display:'flex', alignItems:'center', gap:9, fontSize:10, fontWeight:900, textTransform:'uppercase', letterSpacing:'0.2em', color:'#64748b', background:'#f8fafc', border:'1px solid #e2e8f0', padding:'11px 20px', borderRadius:14, cursor:'pointer', transition:'all 0.2s' }}
              onMouseEnter={e=>{e.currentTarget.style.background='#eff6ff';e.currentTarget.style.color='#1a56db';e.currentTarget.style.borderColor='#bfdbfe';}}
              onMouseLeave={e=>{e.currentTarget.style.background='#f8fafc';e.currentTarget.style.color='#64748b';e.currentTarget.style.borderColor='#e2e8f0';}}>
              <IoArrowBack size={13}/> Back to Journal
            </button>
            <div style={{ display:'flex', gap:10 }}>
              <button onClick={handleLike} style={{ display:'flex', alignItems:'center', gap:6, padding:'10px 16px', borderRadius:14, background:liked?'#fef2f2':'#f8fafc', border:`1px solid ${liked?'#fecaca':'#e2e8f0'}`, color:liked?'#dc2626':'#64748b', cursor:'pointer', fontSize:13, fontWeight:800, transition:'all 0.2s' }}>
                {liked ? <IoHeart/> : <IoHeartOutline/>} {likeCount}
              </button>
              <button onClick={handleShare} style={{ display:'flex', alignItems:'center', gap:6, padding:'10px 16px', borderRadius:14, background:copied?'#f0fdf4':'#f8fafc', border:`1px solid ${copied?'#bbf7d0':'#e2e8f0'}`, color:copied?'#16a34a':'#64748b', cursor:'pointer', fontSize:13, fontWeight:800, transition:'all 0.2s' }}>
                {copied ? <IoCheckmarkOutline/> : <IoShareSocialOutline/>} {copied?'Copied':'Share'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ── FABs ── */}
      <div className="bd-fab">
        <AnimatePresence>
          {showTop && (
            <motion.button className="bd-fab-btn" initial={{ opacity:0, scale:0.7 }} animate={{ opacity:1, scale:1 }} exit={{ opacity:0, scale:0.7 }}
              style={{ background:'#0f172a', color:'#fff', border:'none' }}
              onClick={()=>window.scrollTo({top:0,behavior:'smooth'})}>
              <IoChevronUpOutline/>
            </motion.button>
          )}
        </AnimatePresence>

        <motion.button className="bd-fab-btn" whileTap={{ scale:0.85 }}
          style={{ background:liked?'#fef2f2':'#fff', color:liked?'#dc2626':'#64748b', border:`1px solid ${liked?'#fecaca':'#e2e8f0'}` }}
          onClick={handleLike}>
          {liked ? <IoHeart/> : <IoHeartOutline/>}
        </motion.button>

        <motion.button className="bd-fab-btn" whileTap={{ scale:0.85 }}
          style={{ background:bookmarked?'#eff6ff':'#fff', color:bookmarked?'#1a56db':'#64748b', border:`1px solid ${bookmarked?'#bfdbfe':'#e2e8f0'}` }}
          onClick={()=>setBookmarked(b=>!b)}>
          {bookmarked ? <IoBookmark/> : <IoBookmarkOutline/>}
        </motion.button>

        <motion.button className="bd-fab-btn" whileTap={{ scale:0.85 }}
          style={{ background:copied?'#f0fdf4':'#fff', color:copied?'#16a34a':'#64748b', border:`1px solid ${copied?'#bbf7d0':'#e2e8f0'}` }}
          onClick={handleShare}>
          {copied ? <IoCheckmarkOutline/> : <IoShareSocialOutline/>}
        </motion.button>
      </div>
    </motion.div>
  );
};

export default BlogDetails;