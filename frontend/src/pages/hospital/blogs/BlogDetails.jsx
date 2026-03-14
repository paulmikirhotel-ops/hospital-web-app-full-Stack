import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  IoArrowBack, IoTimeOutline, IoPersonOutline,
  IoShareSocialOutline, IoPrintOutline
} from 'react-icons/io5';
import API from '../../../api/axiosConfig';

const BlogDetails = () => {
  const { id }     = useParams();
  const navigate   = useNavigate();
  const [blog, setBlog]       = useState(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied]   = useState(false);

  useEffect(() => {
    const fetchBlog = async () => {
      if (!id || id === 'undefined' || id.length !== 24) { setLoading(false); return; }
      try {
        const { data } = await API.get(`/blogs/${id}`);
        let blogData = data.post || data;
        if (typeof blogData.content === 'string') {
          try { blogData.content = JSON.parse(blogData.content); }
          catch (e) { blogData.content = null; }
        }
        setBlog(blogData);
        document.title = `${blogData.title} | SJCH Journal`;
      } catch { setBlog(null); }
      finally { setLoading(false); }
    };
    fetchBlog();
    window.scrollTo(0, 0);
    return () => { document.title = "Saint Joseph's Hospital"; };
  }, [id]);

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const renderContent = (content) => {
    if (!content?.blocks?.length) return <p style={{ color:'#94a3b8', fontStyle:'italic', fontSize:17 }}>No content available.</p>;
    return content.blocks.map((block, index) => {
      switch (block.type) {
        case 'header': {
          const level = block.data.level || 2;
          const sizes = { 1:'clamp(1.8rem,5vw,3rem)', 2:'clamp(1.5rem,4vw,2.5rem)', 3:'clamp(1.3rem,3.5vw,2rem)', 4:'clamp(1.1rem,3vw,1.5rem)', 5:'clamp(1rem,2.5vw,1.25rem)', 6:'clamp(0.95rem,2vw,1.1rem)' };
          const Tag = `h${level}`;
          return <Tag key={index} style={{ fontSize:sizes[level], fontWeight:900, color:'#0f172a', margin:'clamp(28px,5vw,48px) 0 clamp(12px,2vw,24px)', letterSpacing:'-0.025em', lineHeight:1.15 }} dangerouslySetInnerHTML={{ __html: block.data.text }}/>;
        }
        case 'paragraph': {
          if (!block.data.text) return null;
          return <p key={index} style={{ color:'#475569', fontSize:'clamp(15px,2vw,18px)', lineHeight:1.85, marginBottom:'clamp(20px,4vw,32px)', fontWeight:500 }} dangerouslySetInnerHTML={{ __html: block.data.text }}/>;
        }
        case 'list': {
          const ListTag = block.data.style === 'ordered' ? 'ol' : 'ul';
          const items   = block.data.items || [];
          return (
            <ListTag key={index} style={{ paddingLeft:24, marginBottom:'clamp(20px,4vw,32px)', display:'flex', flexDirection:'column', gap:12, listStyleType:block.data.style==='ordered'?'decimal':'disc' }}>
              {items.map((item, i) => {
                const text = typeof item === 'string' ? item : item?.content || item?.text || '';
                return <li key={i} style={{ color:'#475569', fontSize:'clamp(14px,2vw,17px)', lineHeight:1.7, fontWeight:500 }} dangerouslySetInnerHTML={{ __html: text }}/>;
              })}
            </ListTag>
          );
        }
        case 'quote':
          return (
            <blockquote key={index} style={{ borderLeft:'4px solid #2563eb', paddingLeft:'clamp(16px,4vw,32px)', paddingTop:'clamp(14px,2vw,24px)', paddingBottom:'clamp(14px,2vw,24px)', margin:'clamp(24px,5vw,48px) 0', background:'rgba(37,99,235,0.04)', borderRadius:'0 clamp(12px,3vw,32px) clamp(12px,3vw,32px) 0' }}>
              <p style={{ fontSize:'clamp(1.1rem,2.5vw,1.5rem)', fontWeight:900, color:'#1e293b', fontStyle:'italic', marginBottom:10, lineHeight:1.5 }} dangerouslySetInnerHTML={{ __html:`"${block.data.text}"` }}/>
              {block.data.caption && <cite style={{ fontSize:11, fontWeight:900, textTransform:'uppercase', color:'#2563eb', letterSpacing:'0.15em', fontStyle:'normal' }}>— {block.data.caption}</cite>}
            </blockquote>
          );
        case 'image': {
          const imgUrl = block.data.file?.url || block.data.url || '';
          if (!imgUrl) return null;
          return (
            <figure key={index} style={{ margin:'clamp(24px,5vw,48px) 0' }}>
              <img src={imgUrl} alt={block.data.caption||''} style={{ width:'100%', borderRadius:'clamp(14px,3vw,32px)', boxShadow:'0 8px 40px rgba(0,0,0,0.12)', objectFit:'cover' }}/>
              {block.data.caption && <figcaption style={{ textAlign:'center', fontSize:10, color:'#94a3b8', fontWeight:700, marginTop:12, textTransform:'uppercase', letterSpacing:'0.15em' }}>{block.data.caption}</figcaption>}
            </figure>
          );
        }
        case 'delimiter':
          return (
            <div key={index} style={{ display:'flex', alignItems:'center', justifyContent:'center', margin:'clamp(24px,5vw,48px) 0' }}>
              <div style={{ display:'flex', gap:10 }}>
                {[0,1,2].map(i => <span key={i} style={{ width:8, height:8, borderRadius:'50%', background:'#e2e8f0', display:'block' }}/>)}
              </div>
            </div>
          );
        case 'code':
          return (
            <pre key={index} style={{ background:'#0f172a', color:'#4ade80', padding:'clamp(16px,4vw,32px)', borderRadius:'clamp(12px,3vw,24px)', margin:'clamp(16px,3vw,32px) 0', overflowX:'auto', fontSize:'clamp(12px,1.5vw,14px)', fontFamily:'monospace', lineHeight:1.7 }}>
              <code>{block.data.code}</code>
            </pre>
          );
        case 'warning':
          return (
            <div key={index} style={{ background:'#fffbeb', borderLeft:'4px solid #f59e0b', padding:'clamp(16px,3vw,24px) clamp(16px,4vw,32px)', borderRadius:'0 clamp(12px,3vw,24px) clamp(12px,3vw,24px) 0', margin:'clamp(16px,3vw,32px) 0' }}>
              {block.data.title && <p style={{ fontSize:10, fontWeight:900, color:'#92400e', textTransform:'uppercase', letterSpacing:'0.2em', marginBottom:6 }}>{block.data.title}</p>}
              <p style={{ color:'#92400e', fontWeight:500, margin:0 }} dangerouslySetInnerHTML={{ __html: block.data.message }}/>
            </div>
          );
        default: return null;
      }
    });
  };

  if (loading) return (
    <div style={{ minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', background:'#fff' }}>
      <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:16 }}>
        <div style={{ width:52, height:52, border:'4px solid #2563eb', borderTopColor:'transparent', borderRadius:'50%', animation:'spin 0.8s linear infinite' }}/>
        <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
        <p style={{ fontSize:10, fontWeight:900, textTransform:'uppercase', letterSpacing:'0.3em', color:'#94a3b8' }}>Loading Article...</p>
      </div>
    </div>
  );

  if (!blog) return (
    <div style={{ minHeight:'100vh', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:20, padding:24 }}>
      <h2 style={{ fontSize:'1.5rem', fontWeight:900, color:'#0f172a', margin:0 }}>Clinical Record Not Found</h2>
      <button onClick={()=>navigate('/blog')} style={{ padding:'14px 32px', background:'#2563eb', color:'#fff', borderRadius:16, fontWeight:900, fontSize:10, textTransform:'uppercase', letterSpacing:'0.2em', border:'none', cursor:'pointer' }}>Return to Journal</button>
    </div>
  );

  return (
    <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} style={{ minHeight:'100vh', background:'#fff', paddingBottom:'clamp(64px,10vw,128px)' }}>

      {/* Sticky nav */}
      <nav style={{ position:'sticky', top:0, background:'rgba(255,255,255,0.85)', backdropFilter:'blur(16px)', WebkitBackdropFilter:'blur(16px)', zIndex:40, borderBottom:'1px solid #f8fafc' }}>
        <div style={{ maxWidth:1280, margin:'0 auto', padding:'0 clamp(14px,4vw,24px)', height:56, display:'flex', alignItems:'center', justifyContent:'space-between' }}>
          <button onClick={()=>navigate('/blog')} style={{ display:'flex', alignItems:'center', gap:7, fontSize:10, fontWeight:900, textTransform:'uppercase', letterSpacing:'0.2em', color:'#94a3b8', background:'none', border:'none', cursor:'pointer', transition:'color 0.2s', padding:0 }}
            onMouseEnter={e=>e.currentTarget.style.color='#2563eb'}
            onMouseLeave={e=>e.currentTarget.style.color='#94a3b8'}>
            <IoArrowBack size={15}/> Back to Journal
          </button>
          <div style={{ display:'flex', gap:16, alignItems:'center' }}>
            <button onClick={handleShare} title={copied?'Copied!':'Copy link'}
              style={{ color:copied?'#2563eb':'#94a3b8', background:'none', border:'none', cursor:'pointer', fontSize:19, transition:'color 0.2s', display:'flex', alignItems:'center' }}>
              <IoShareSocialOutline/>
            </button>
            <button onClick={()=>window.print()} title="Print"
              style={{ color:'#94a3b8', background:'none', border:'none', cursor:'pointer', fontSize:19, transition:'color 0.2s', display:'flex', alignItems:'center' }}
              onMouseEnter={e=>e.currentTarget.style.color='#2563eb'}
              onMouseLeave={e=>e.currentTarget.style.color='#94a3b8'}>
              <IoPrintOutline/>
            </button>
          </div>
        </div>
      </nav>

      <main style={{ maxWidth:900, margin:'0 auto', padding:'clamp(32px,6vw,80px) clamp(14px,4vw,24px) 0' }}>

        {/* Article header */}
        <header style={{ marginBottom:'clamp(28px,5vw,48px)' }}>
          <span style={{ background:'#2563eb', color:'#fff', padding:'5px 14px', borderRadius:999, fontSize:9, fontWeight:900, textTransform:'uppercase', letterSpacing:'0.2em' }}>
            {blog.category}
          </span>
          <h1 style={{ fontSize:'clamp(2rem,7vw,5rem)', fontWeight:900, color:'#0f172a', letterSpacing:'-0.045em', lineHeight:0.97, margin:'clamp(20px,4vw,40px) 0 clamp(14px,3vw,24px)' }}>
            {blog.title}
          </h1>
          {blog.description && (
            <p style={{ fontSize:'clamp(14px,2vw,18px)', color:'#94a3b8', lineHeight:1.65, marginBottom:'clamp(20px,4vw,32px)', maxWidth:680 }}>
              {blog.description}
            </p>
          )}
          <div style={{ display:'flex', flexWrap:'wrap', gap:'clamp(14px,3vw,32px)', padding:'clamp(16px,3vw,28px) 0', borderTop:'1px solid #f1f5f9', borderBottom:'1px solid #f1f5f9' }}>
            <div style={{ display:'flex', alignItems:'center', gap:10 }}>
              <div style={{ width:32, height:32, borderRadius:'50%', background:'#dbeafe', display:'flex', alignItems:'center', justifyContent:'center' }}>
                <IoPersonOutline style={{ color:'#2563eb' }} size={14}/>
              </div>
              <span style={{ fontSize:'clamp(12px,1.8vw,14px)', fontWeight:700, color:'#334155' }}>Dr. {blog.author?.name||'Medical Staff'}</span>
            </div>
            <div style={{ display:'flex', alignItems:'center', gap:10 }}>
              <div style={{ width:32, height:32, borderRadius:'50%', background:'#dbeafe', display:'flex', alignItems:'center', justifyContent:'center' }}>
                <IoTimeOutline style={{ color:'#2563eb' }} size={14}/>
              </div>
              <span style={{ fontSize:'clamp(12px,1.8vw,14px)', fontWeight:700, color:'#334155' }}>
                {new Date(blog.createdAt).toLocaleDateString('en-US', { year:'numeric', month:'long', day:'numeric' })}
              </span>
            </div>
          </div>
        </header>

        {/* Cover image */}
        {blog.coverImg && (
          <img src={blog.coverImg} alt={blog.title}
            style={{ width:'100%', aspectRatio:'16/9', objectFit:'cover', borderRadius:'clamp(16px,4vw,48px)', boxShadow:'0 16px 60px rgba(0,0,0,0.15)', marginBottom:'clamp(28px,6vw,64px)', display:'block' }}/>
        )}

        {/* Article body */}
        <div style={{ maxWidth:720, margin:'0 auto' }}>
          {renderContent(blog.content)}
        </div>

        {/* Back button */}
        <div style={{ maxWidth:720, margin:'clamp(40px,8vw,80px) auto 0', paddingTop:'clamp(24px,4vw,40px)', borderTop:'1px solid #f1f5f9' }}>
          <button onClick={()=>navigate('/blog')}
            style={{ display:'flex', alignItems:'center', gap:10, fontSize:10, fontWeight:900, textTransform:'uppercase', letterSpacing:'0.2em', color:'#94a3b8', background:'none', border:'none', cursor:'pointer', padding:0, transition:'color 0.2s' }}
            onMouseEnter={e=>e.currentTarget.style.color='#2563eb'}
            onMouseLeave={e=>e.currentTarget.style.color='#94a3b8'}>
            <div style={{ padding:8, borderRadius:'50%', background:'#f1f5f9', display:'flex', transition:'all 0.2s' }}>
              <IoArrowBack size={13}/>
            </div>
            Back to Journal
          </button>
        </div>
      </main>
    </motion.div>
  );
};

export default BlogDetails;