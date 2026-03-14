import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  IoCalendarOutline, IoSearchOutline, IoArrowForwardOutline,
  IoTimeOutline, IoPersonOutline, IoBookmarkOutline, IoBookmark,
  IoShareSocialOutline, IoGridOutline, IoListOutline,
} from 'react-icons/io5';
import API from '../../api/axiosConfig';

const GlobalStyles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400;1,600&family=Cabinet+Grotesk:wght@300;400;500;700;800&display=swap');

    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

    :root {
      --navy:    #06122a;
      --blue:    #1240ab;
      --mid:     #1d5ed8;
      --sky:     #3b82f6;
      --powder:  #bfdbfe;
      --pale:    #eff6ff;
      --offwhite:#f7f9ff;
      --white:   #ffffff;
      --ink:     #0c1b3a;
      --muted:   #5b7199;
      --border:  #dde6f5;
      --card-shadow: 0 2px 20px rgba(18,64,171,0.07);
      --card-shadow-hover: 0 20px 60px rgba(18,64,171,0.15), 0 4px 20px rgba(18,64,171,0.10);
    }

    .journal-root { font-family: 'Cabinet Grotesk', sans-serif; background: var(--offwhite); color: var(--ink); }
    .serif { font-family: 'Cormorant Garamond', serif; }

    .pill {
      display: inline-flex; align-items: center;
      padding: 4px 14px; border-radius: 999px;
      font-size: 10px; font-weight: 700;
      text-transform: uppercase; letter-spacing: 0.2em;
    }
    .pill-blue  { background: var(--pale);  color: var(--blue);  border: 1px solid var(--border); }
    .pill-solid { background: var(--blue);  color: #fff; }
    .pill-ink   { background: var(--navy);  color: #fff; }

    .cat-btn {
      padding: 7px 16px; border-radius: 999px;
      font-family: 'Cabinet Grotesk', sans-serif;
      font-size: 11px; font-weight: 700;
      text-transform: uppercase; letter-spacing: 0.15em;
      border: 1.5px solid var(--border);
      cursor: pointer; transition: all 0.2s;
      background: var(--white); color: var(--muted);
      white-space: nowrap; flex-shrink: 0;
    }
    .cat-btn:hover  { border-color: var(--sky); color: var(--blue); }
    .cat-btn.active { background: var(--navy); color: #fff; border-color: var(--navy); }

    .search-box {
      display: flex; align-items: center; gap: 10px;
      background: var(--white);
      border: 1.5px solid var(--border);
      border-radius: 999px;
      padding: 10px 20px;
      transition: border-color 0.2s, box-shadow 0.2s;
    }
    .search-box:focus-within {
      border-color: var(--sky);
      box-shadow: 0 0 0 4px rgba(59,130,246,0.10);
    }
    .search-box input {
      border: none; outline: none; background: transparent;
      font-family: 'Cabinet Grotesk', sans-serif;
      font-size: 16px; color: var(--ink);
      width: 100%; min-width: 0;
    }
    .search-box input::placeholder { color: #93a9c8; }

    /* Featured card */
    .featured-card {
      display: grid; grid-template-columns: 1fr 1fr;
      background: var(--white); border-radius: 32px;
      overflow: hidden; border: 1px solid var(--border);
      box-shadow: var(--card-shadow); cursor: pointer;
      transition: box-shadow 0.3s, transform 0.3s;
    }
    .featured-card:hover { box-shadow: var(--card-shadow-hover); transform: translateY(-4px); }
    .featured-card:hover .featured-img { transform: scale(1.04); }
    .featured-img { width:100%; height:100%; object-fit:cover; transition: transform 0.6s ease; }

    /* Blog card */
    .blog-card {
      background: var(--white); border-radius: 24px;
      overflow: hidden; border: 1px solid var(--border);
      box-shadow: var(--card-shadow); cursor: pointer;
      transition: box-shadow 0.3s, transform 0.3s;
      display: flex; flex-direction: column;
    }
    .blog-card:hover { box-shadow: var(--card-shadow-hover); transform: translateY(-6px); }
    .blog-card:hover .blog-img { transform: scale(1.06); }
    .blog-img { width:100%; height:100%; object-fit:cover; transition: transform 0.55s ease; }

    /* List card */
    .list-card {
      display: flex; gap: 24px; align-items: center;
      background: var(--white); border-radius: 20px;
      overflow: hidden; border: 1px solid var(--border);
      box-shadow: var(--card-shadow); cursor: pointer;
      transition: box-shadow 0.25s, transform 0.25s;
    }
    .list-card:hover { box-shadow: var(--card-shadow-hover); transform: translateX(4px); }
    .list-card:hover .list-img { transform: scale(1.06); }
    .list-img { width:100%; height:100%; object-fit:cover; transition: transform 0.5s; }

    .read-link {
      display: inline-flex; align-items: center; gap: 6px;
      font-size: 11px; font-weight: 700;
      text-transform: uppercase; letter-spacing: 0.18em;
      color: var(--blue); transition: gap 0.2s; white-space: nowrap;
    }
    .read-link:hover { gap: 10px; }

    .divider { height: 1px; background: var(--border); }

    /* Controls bar layout */
    .controls-bar {
      display: flex; align-items: center;
      justify-content: center;
      padding: 20px 0;
      flex-wrap: wrap; gap: 12px;
    }
    .cats-row {
      display: flex; flex-wrap: wrap; gap: 8px;
      justify-content: center; width: 100%;
    }
    .search-row {
      display: flex; align-items: center;
      gap: 10px; flex-wrap: wrap; justify-content: center;
    }
    .masthead-pad { padding: 0 clamp(16px, 4vw, 32px); }
    .masthead-inner { padding: 48px 0 36px; text-align: center; }
    .main-content  { padding: clamp(32px, 5vw, 56px) clamp(16px, 4vw, 32px) clamp(60px, 8vw, 96px); }
    .newsletter-strip {
      margin-top: 80px;
      background: var(--navy);
      border-radius: 32px;
      padding: clamp(28px, 5vw, 52px) clamp(24px, 5vw, 56px);
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 32px;
      flex-wrap: wrap;
    }
    .newsletter-form {
      display: flex; gap: 10px; flex-shrink: 0; flex-wrap: wrap;
    }
    .newsletter-form input {
      padding: 14px 20px; border-radius: 14px;
      border: 1.5px solid rgba(191,219,254,0.25);
      background: rgba(255,255,255,0.08); color: var(--white);
      font-size: 16px; outline: none;
      font-family: 'Cabinet Grotesk, sans-serif';
      width: clamp(180px, 40vw, 240px);
    }
    .grid-cols { 
      display: grid; 
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); 
      gap: 28px; 
    }
    .vert-divider { width:1px; height:28px; background:var(--border); margin:0 4px; flex-shrink:0; }

    @keyframes spin    { to { transform: rotate(360deg); } }
    @keyframes shimmer { 0%{background-position:200% 0} 100%{background-position:-200% 0} }

    /* ── RESPONSIVE ── */
    @media (max-width: 860px) {
      .featured-card { grid-template-columns: 1fr !important; }
      .featured-img-wrap { aspect-ratio: 16/9; height: auto !important; }
    }

    @media (max-width: 680px) {
      .vert-divider { display: none; }
      .search-box input { width: 100%; }
      .search-row { width: 100%; }
      .search-box { flex: 1; }
    }

    @media (max-width: 600px) {
      .grid-cols  { grid-template-columns: 1fr !important; gap: 16px !important; }
      .list-card  { flex-direction: column !important; }
      .list-img-wrap { width: 100% !important; height: 180px !important; flex-shrink: 0; }
      .list-card > div:last-child { padding: 16px !important; }
      .masthead-inner { padding: 32px 0 24px; }
      .newsletter-strip { border-radius: 20px; }
      .newsletter-form  { width: 100%; }
      .newsletter-form input { width: 100%; }
    }

    @media (max-width: 480px) {
      .cat-btn { padding: 5px 12px; font-size: 10px; }
      .blog-card { border-radius: 18px; }
      .featured-card { border-radius: 20px; }
    }
  `}</style>
);

const readTime = (text = '') => `${Math.max(1, Math.ceil(text.split(' ').length / 200))} min read`;

const BookmarkBtn = ({ id }) => {
  const [saved, setSaved] = useState(false);
  return (
    <button onClick={e => { e.stopPropagation(); setSaved(s => !s); }}
      style={{ background:'none', border:'none', cursor:'pointer', color:saved?'var(--blue)':'var(--muted)', padding:4, display:'flex', transition:'color 0.2s', flexShrink:0 }}>
      {saved ? <IoBookmark size={16} /> : <IoBookmarkOutline size={16} />}
    </button>
  );
};

const FeaturedCard = ({ blog, onClick }) => (
  <motion.div className="featured-card" initial={{ opacity:0, y:32 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.6 }} onClick={onClick}>
    <div className="featured-img-wrap" style={{ overflow:'hidden', height:440 }}>
      <img className="featured-img" src={blog.coverImg} alt={blog.title} />
    </div>
    <div style={{ padding:'clamp(24px,4vw,48px) clamp(20px,4vw,44px)', display:'flex', flexDirection:'column', justifyContent:'space-between' }}>
      <div>
        <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:24 }}>
          <span className="pill pill-ink">Featured</span>
          <span className="pill pill-blue">{blog.category||'Clinical'}</span>
        </div>
        <h2 className="serif" style={{ fontSize:'clamp(1.5rem,3.5vw,2.6rem)', fontWeight:700, color:'var(--navy)', lineHeight:1.2, letterSpacing:'-0.01em', marginBottom:16 }}>
          {blog.title}
        </h2>
        <p style={{ fontSize:15, color:'var(--muted)', lineHeight:1.75, marginBottom:28, display:'-webkit-box', WebkitLineClamp:4, WebkitBoxOrient:'vertical', overflow:'hidden' }}>
          {blog.description}
        </p>
      </div>
      <div>
        <div className="divider" style={{ marginBottom:20 }} />
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:12 }}>
          <div style={{ display:'flex', alignItems:'center', gap:12 }}>
            <div style={{ width:38, height:38, borderRadius:'50%', background:'var(--pale)', border:'2px solid var(--border)', display:'flex', alignItems:'center', justifyContent:'center', color:'var(--blue)', flexShrink:0 }}>
              <IoPersonOutline size={17} />
            </div>
            <div>
              <div style={{ fontSize:13, fontWeight:700, color:'var(--ink)' }}>Dr. {blog.author?.name||'Medical Staff'}</div>
              <div style={{ fontSize:11, color:'var(--muted)', display:'flex', alignItems:'center', gap:5, flexWrap:'wrap' }}>
                <IoCalendarOutline size={11} />
                {new Date(blog.createdAt).toLocaleDateString('en-US',{ month:'long', day:'numeric', year:'numeric' })}
                <span>·</span>
                <IoTimeOutline size={11} />{readTime(blog.description)}
              </div>
            </div>
          </div>
          <span className="read-link">Read Article <IoArrowForwardOutline size={14} /></span>
        </div>
      </div>
    </div>
  </motion.div>
);

const GridCard = ({ blog, idx, onClick }) => (
  <motion.article className="blog-card" initial={{ opacity:0, y:24 }} animate={{ opacity:1, y:0 }} transition={{ delay:idx*0.06 }} onClick={onClick}>
    <div style={{ overflow:'hidden', aspectRatio:'3/2', flexShrink:0 }}>
      <img className="blog-img" src={blog.coverImg} alt={blog.title} />
    </div>
    <div style={{ padding:'clamp(16px,3vw,24px) clamp(16px,3vw,26px) clamp(18px,3vw,26px)', display:'flex', flexDirection:'column', flex:1 }}>
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:12 }}>
        <span className="pill pill-blue">{blog.category||'Clinical'}</span>
        <BookmarkBtn id={blog._id} />
      </div>
      <h3 className="serif" style={{ fontSize:'clamp(1.1rem,2.5vw,1.35rem)', fontWeight:700, color:'var(--navy)', lineHeight:1.3, letterSpacing:'-0.01em', marginBottom:8, flex:1 }}>
        {blog.title}
      </h3>
      <p style={{ fontSize:13, color:'var(--muted)', lineHeight:1.7, marginBottom:18, display:'-webkit-box', WebkitLineClamp:2, WebkitBoxOrient:'vertical', overflow:'hidden' }}>
        {blog.description}
      </p>
      <div className="divider" style={{ marginBottom:14 }} />
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
        <div style={{ fontSize:11, color:'var(--muted)', display:'flex', alignItems:'center', gap:5 }}>
          <IoTimeOutline size={11} />{readTime(blog.description)}
          <span style={{ opacity:0.4 }}>·</span>
          <IoCalendarOutline size={11} />
          {new Date(blog.createdAt).toLocaleDateString('en-US',{ month:'short', day:'numeric' })}
        </div>
        <span className="read-link">Read <IoArrowForwardOutline size={12} /></span>
      </div>
    </div>
  </motion.article>
);

const ListCard = ({ blog, idx, onClick }) => (
  <motion.article className="list-card" initial={{ opacity:0, x:-20 }} animate={{ opacity:1, x:0 }} transition={{ delay:idx*0.05 }} onClick={onClick}>
    <div className="list-img-wrap" style={{ width:200, height:140, overflow:'hidden', flexShrink:0 }}>
      <img className="list-img" src={blog.coverImg} alt={blog.title} />
    </div>
    <div style={{ padding:'clamp(14px,2vw,20px) clamp(14px,2vw,24px) clamp(14px,2vw,20px) 0', flex:1, minWidth:0 }}>
      <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:10, flexWrap:'wrap' }}>
        <span className="pill pill-blue">{blog.category||'Clinical'}</span>
        <span style={{ fontSize:11, color:'var(--muted)', display:'flex', alignItems:'center', gap:4 }}>
          <IoTimeOutline size={11} /> {readTime(blog.description)}
        </span>
      </div>
      <h3 className="serif" style={{ fontSize:'clamp(1rem,2vw,1.2rem)', fontWeight:700, color:'var(--navy)', lineHeight:1.3, marginBottom:6, display:'-webkit-box', WebkitLineClamp:2, WebkitBoxOrient:'vertical', overflow:'hidden' }}>
        {blog.title}
      </h3>
      <p style={{ fontSize:13, color:'var(--muted)', lineHeight:1.6, display:'-webkit-box', WebkitLineClamp:1, WebkitBoxOrient:'vertical', overflow:'hidden', marginBottom:10 }}>
        {blog.description}
      </p>
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:8 }}>
        <span style={{ fontSize:11, color:'var(--muted)' }}>
          Dr. {blog.author?.name||'Medical Staff'} · {new Date(blog.createdAt).toLocaleDateString('en-US',{ month:'short', day:'numeric', year:'numeric' })}
        </span>
        <div style={{ display:'flex', gap:8 }}>
          <BookmarkBtn id={blog._id} />
          <button onClick={e=>e.stopPropagation()} style={{ background:'none', border:'none', cursor:'pointer', color:'var(--muted)', padding:4, display:'flex', transition:'color 0.2s' }}>
            <IoShareSocialOutline size={16} />
          </button>
        </div>
      </div>
    </div>
  </motion.article>
);

const Skeleton = () => (
  <div className="grid-cols">
    {[1,2,3,4,5,6].map(i => (
      <div key={i} style={{ background:'var(--white)', borderRadius:24, overflow:'hidden', border:'1px solid var(--border)' }}>
        <div style={{ aspectRatio:'3/2', background:'linear-gradient(90deg,var(--pale) 0%,var(--border) 50%,var(--pale) 100%)', backgroundSize:'200% 100%', animation:'shimmer 1.6s infinite' }} />
        <div style={{ padding:'24px 26px' }}>
          <div style={{ height:14, width:'40%', background:'var(--pale)', borderRadius:8, marginBottom:16 }} />
          <div style={{ height:20, width:'90%', background:'var(--pale)', borderRadius:8, marginBottom:8 }} />
          <div style={{ height:20, width:'70%', background:'var(--pale)', borderRadius:8, marginBottom:20 }} />
          <div style={{ height:12, width:'60%', background:'var(--pale)', borderRadius:8 }} />
        </div>
      </div>
    ))}
  </div>
);

const CATS = ['All','General Health','Maternity','Surgery','Cardiology','Pediatrics','Neurology'];

const Journal = () => {
  const navigate = useNavigate();
  const [blogs, setBlogs]                   = useState([]);
  const [filtered, setFiltered]             = useState([]);
  const [activeCategory, setActiveCategory] = useState('All');
  const [search, setSearch]                 = useState('');
  const [loading, setLoading]               = useState(true);
  const [viewMode, setViewMode]             = useState('grid');

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const { data } = await API.get('/blogs');
        if (data.success && Array.isArray(data.posts)) {
          setBlogs(data.posts);
          setFiltered(data.posts);
        }
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    };
    fetchBlogs();
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    let result = blogs;
    if (activeCategory !== 'All') result = result.filter(b => b.category === activeCategory);
    if (search.trim()) result = result.filter(b =>
      b.title.toLowerCase().includes(search.toLowerCase()) ||
      b.description?.toLowerCase().includes(search.toLowerCase())
    );
    setFiltered(result);
  }, [activeCategory, search, blogs]);

  return (
    <div className="journal-root" style={{ minHeight:'100vh' }}>
      <GlobalStyles />

      {/* Masthead */}
      <div style={{ background:'var(--white)', borderBottom:'1px solid var(--border)' }}>
        <div className="masthead-pad" style={{ maxWidth:1200, margin:'0 auto' }}>

          {/* Eyebrow */}
          <div style={{ borderBottom:'1px solid var(--border)', padding:'12px 0', display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:8 }}>
            <span className="pill pill-blue">St. Joseph's Catholic Hospital</span>
            <div style={{ fontSize:11, color:'var(--muted)', fontWeight:500 }}>
              {new Date().toLocaleDateString('en-US',{ weekday:'long', month:'long', day:'numeric', year:'numeric' })}
            </div>
          </div>

          {/* Title */}
          <div className="masthead-inner">
            <div style={{ display:'flex', alignItems:'center', gap:16, marginBottom:20, justifyContent:'center' }}>
              <div style={{ width:48, height:1, background:'var(--border)' }} />
              <div style={{ width:6, height:6, borderRadius:'50%', background:'var(--sky)' }} />
              <div style={{ width:48, height:1, background:'var(--border)' }} />
            </div>
            <h1 className="serif" style={{ fontSize:'clamp(2.4rem,8vw,6rem)', fontWeight:700, color:'var(--navy)', letterSpacing:'-0.03em', lineHeight:1, margin:'0 auto' }}>
              The Medical{' '}
              <em style={{ color:'var(--blue)', fontStyle:'italic' }}>Journal</em>
            </h1>
            <div style={{ display:'flex', alignItems:'center', gap:16, marginTop:20, justifyContent:'center' }}>
              <div style={{ width:48, height:1, background:'var(--border)' }} />
              <div style={{ width:6, height:6, borderRadius:'50%', background:'var(--sky)' }} />
              <div style={{ width:48, height:1, background:'var(--border)' }} />
            </div>
          </div>

          {/* Tagline */}
          <div style={{ textAlign:'center', paddingBottom:28, borderBottom:'2px solid var(--navy)' }}>
            <p style={{ fontSize:'clamp(9px,1.5vw,13px)', color:'var(--muted)', letterSpacing:'0.2em', textTransform:'uppercase', fontWeight:600 }}>
              Evidence-Based Clinical Insights · Patient Education · Medical Research
            </p>
          </div>

          {/* Controls */}
          <div className="controls-bar">
            {/* Category pills — scrollable on mobile */}
            <div style={{ width:'100%', overflowX:'auto', paddingBottom:4, WebkitOverflowScrolling:'touch' }}>
              <div className="cats-row" style={{ flexWrap:'nowrap', justifyContent:'flex-start' }}>
                {CATS.map(cat => (
                  <button key={cat} className={`cat-btn ${activeCategory===cat?'active':''}`} onClick={()=>setActiveCategory(cat)}>
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            <div className="search-row">
              <div className="search-box" style={{ flex:1, minWidth:0 }}>
                <IoSearchOutline size={16} style={{ color:'var(--muted)', flexShrink:0 }} />
                <input type="text" placeholder="Search articles…" value={search} onChange={e=>setSearch(e.target.value)} />
              </div>
              <div className="vert-divider" />
              <div style={{ display:'flex', background:'var(--pale)', borderRadius:10, padding:4, gap:2, flexShrink:0 }}>
                <button onClick={()=>setViewMode('grid')} style={{ padding:'6px 10px', borderRadius:8, border:'none', cursor:'pointer', background:viewMode==='grid'?'var(--white)':'transparent', color:viewMode==='grid'?'var(--blue)':'var(--muted)', transition:'all 0.2s', boxShadow:viewMode==='grid'?'var(--card-shadow)':'none' }}>
                  <IoGridOutline size={16} />
                </button>
                <button onClick={()=>setViewMode('list')} style={{ padding:'6px 10px', borderRadius:8, border:'none', cursor:'pointer', background:viewMode==='list'?'var(--white)':'transparent', color:viewMode==='list'?'var(--blue)':'var(--muted)', transition:'all 0.2s', boxShadow:viewMode==='list'?'var(--card-shadow)':'none' }}>
                  <IoListOutline size={16} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="main-content" style={{ maxWidth:1200, margin:'0 auto' }}>
        {loading ? <Skeleton /> : (
          <>
            {/* Results bar */}
            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:32, flexWrap:'wrap', gap:10 }}>
              <p style={{ fontSize:13, color:'var(--muted)', fontWeight:500 }}>
                Showing <strong style={{ color:'var(--ink)' }}>{filtered.length}</strong> article{filtered.length!==1?'s':''}
                {activeCategory!=='All' && <> in <strong style={{ color:'var(--blue)' }}>{activeCategory}</strong></>}
                {search && <> matching <strong style={{ color:'var(--blue)' }}>"{search}"</strong></>}
              </p>
              {(activeCategory!=='All'||search) && (
                <button onClick={()=>{ setActiveCategory('All'); setSearch(''); }}
                  style={{ fontSize:11, fontWeight:700, color:'var(--blue)', background:'none', border:'none', cursor:'pointer', textTransform:'uppercase', letterSpacing:'0.15em' }}>
                  Clear filters
                </button>
              )}
            </div>

            {filtered.length===0 ? (
              <div style={{ textAlign:'center', padding:'60px 0' }}>
                <p className="serif" style={{ fontSize:'clamp(1.4rem,3vw,2rem)', color:'var(--muted)', fontStyle:'italic' }}>No articles found.</p>
                <p style={{ fontSize:14, color:'var(--muted)', marginTop:8 }}>Try a different category or search term.</p>
              </div>
            ) : (
              <>
                {/* Featured */}
                {activeCategory==='All' && !search && filtered.length>0 && (
                  <div style={{ marginBottom:56 }}>
                    <div style={{ display:'flex', alignItems:'center', gap:16, marginBottom:22 }}>
                      <span className="pill pill-ink">Editor's Pick</span>
                      <div style={{ flex:1, height:1, background:'var(--border)' }} />
                    </div>
                    <FeaturedCard blog={filtered[0]} onClick={()=>navigate(`/blog/${filtered[0]._id}`)} />
                  </div>
                )}

                {activeCategory==='All' && !search && filtered.length>1 && (
                  <div style={{ display:'flex', alignItems:'center', gap:16, marginBottom:28 }}>
                    <span className="pill pill-blue">Latest Articles</span>
                    <div style={{ flex:1, height:1, background:'var(--border)' }} />
                    <span style={{ fontSize:11, color:'var(--muted)', fontWeight:600, textTransform:'uppercase', letterSpacing:'0.15em' }}>
                      {filtered.length-1} more
                    </span>
                  </div>
                )}

                <AnimatePresence mode="popLayout">
                  {viewMode==='grid' ? (
                    <div className="grid-cols">
                      {(activeCategory==='All'&&!search?filtered.slice(1):filtered).map((blog,idx)=>(
                        <GridCard key={blog._id} blog={blog} idx={idx} onClick={()=>navigate(`/blog/${blog._id}`)} />
                      ))}
                    </div>
                  ) : (
                    <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
                      {(activeCategory==='All'&&!search?filtered.slice(1):filtered).map((blog,idx)=>(
                        <ListCard key={blog._id} blog={blog} idx={idx} onClick={()=>navigate(`/blog/${blog._id}`)} />
                      ))}
                    </div>
                  )}
                </AnimatePresence>
              </>
            )}
          </>
        )}

        {/* Newsletter */}
        <motion.div className="newsletter-strip" initial={{ opacity:0, y:32 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.4 }}>
          <div>
            <p style={{ fontSize:11, fontWeight:700, textTransform:'uppercase', letterSpacing:'0.22em', color:'var(--powder)', marginBottom:10 }}>Stay Informed</p>
            <h3 className="serif" style={{ fontSize:'clamp(1.4rem,3vw,2.2rem)', fontWeight:700, color:'var(--white)', letterSpacing:'-0.02em', lineHeight:1.2 }}>
              Get the latest clinical<br />
              <em style={{ color:'var(--powder)', fontStyle:'italic' }}>insights delivered weekly.</em>
            </h3>
          </div>
          <div className="newsletter-form">
            <input type="email" placeholder="Your email address"
              style={{ padding:'13px 18px', borderRadius:14, border:'1.5px solid rgba(191,219,254,0.25)', background:'rgba(255,255,255,0.08)', color:'var(--white)', fontSize:16, outline:'none', fontFamily:'Cabinet Grotesk,sans-serif' }}
            />
            <button style={{ padding:'13px 24px', borderRadius:14, background:'var(--sky)', color:'var(--white)', border:'none', fontFamily:'Cabinet Grotesk,sans-serif', fontWeight:700, fontSize:13, cursor:'pointer', whiteSpace:'nowrap', display:'flex', alignItems:'center', gap:8, transition:'background 0.2s', width:'100%', justifyContent:'center' }}>
              Subscribe <IoArrowForwardOutline size={14} />
            </button>
          </div>
        </motion.div>

        <p style={{ textAlign:'center', fontSize:11, color:'#93a9c8', marginTop:44, lineHeight:1.7 }}>
          Medical content is reviewed by board-certified physicians. For emergencies call 911 immediately.<br />
          © {new Date().getFullYear()} St. Joseph's Catholic Hospital · All rights reserved.
        </p>
      </div>
    </div>
  );
};

export default Journal;