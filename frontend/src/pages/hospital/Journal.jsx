import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  IoCalendarOutline, IoSearchOutline, IoArrowForwardOutline,
  IoTimeOutline, IoPersonOutline, IoBookmarkOutline, IoBookmark,
  IoShareSocialOutline, IoGridOutline, IoListOutline,
} from 'react-icons/io5';
import API from '../../api/axiosConfig';

/* ── FONT & GLOBAL STYLES ──────────────────────────────────────── */
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
      padding: 4px 14px;
      border-radius: 999px;
      font-size: 10px; font-weight: 700;
      text-transform: uppercase; letter-spacing: 0.2em;
    }

    .pill-blue   { background: var(--pale);  color: var(--blue); border: 1px solid var(--border); }
    .pill-solid  { background: var(--blue);  color: #fff; }
    .pill-ink    { background: var(--navy);  color: #fff; }

    .cat-btn {
      padding: 8px 20px;
      border-radius: 999px;
      font-family: 'Cabinet Grotesk', sans-serif;
      font-size: 11px; font-weight: 700;
      text-transform: uppercase; letter-spacing: 0.15em;
      border: 1.5px solid var(--border);
      cursor: pointer; transition: all 0.2s;
      background: var(--white); color: var(--muted);
    }
    .cat-btn:hover   { border-color: var(--sky); color: var(--blue); }
    .cat-btn.active  { background: var(--navy); color: #fff; border-color: var(--navy); }

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
      font-size: 14px; color: var(--ink); width: 200px;
    }
    .search-box input::placeholder { color: #93a9c8; }

    /* ── FEATURED CARD ── */
    .featured-card {
      display: grid; grid-template-columns: 1fr 1fr;
      background: var(--white);
      border-radius: 32px;
      overflow: hidden;
      border: 1px solid var(--border);
      box-shadow: var(--card-shadow);
      cursor: pointer;
      transition: box-shadow 0.3s, transform 0.3s;
    }
    .featured-card:hover {
      box-shadow: var(--card-shadow-hover);
      transform: translateY(-4px);
    }
    .featured-card:hover .featured-img { transform: scale(1.04); }
    .featured-img { width:100%; height:100%; object-fit:cover; transition: transform 0.6s ease; }

    /* ── BLOG CARD ── */
    .blog-card {
      background: var(--white);
      border-radius: 24px;
      overflow: hidden;
      border: 1px solid var(--border);
      box-shadow: var(--card-shadow);
      cursor: pointer;
      transition: box-shadow 0.3s, transform 0.3s;
      display: flex; flex-direction: column;
    }
    .blog-card:hover {
      box-shadow: var(--card-shadow-hover);
      transform: translateY(-6px);
    }
    .blog-card:hover .blog-img { transform: scale(1.06); }
    .blog-img { width:100%; height:100%; object-fit:cover; transition: transform 0.55s ease; }

    /* ── LIST CARD ── */
    .list-card {
      display: flex; gap: 24px; align-items: center;
      background: var(--white);
      border-radius: 20px;
      overflow: hidden;
      border: 1px solid var(--border);
      box-shadow: var(--card-shadow);
      cursor: pointer;
      transition: box-shadow 0.25s, transform 0.25s;
      padding: 0;
    }
    .list-card:hover {
      box-shadow: var(--card-shadow-hover);
      transform: translateX(4px);
    }
    .list-card:hover .list-img { transform: scale(1.06); }
    .list-img { width:100%; height:100%; object-fit:cover; transition: transform 0.5s; }

    .read-link {
      display: inline-flex; align-items: center; gap: 6px;
      font-size: 11px; font-weight: 700;
      text-transform: uppercase; letter-spacing: 0.18em;
      color: var(--blue); transition: gap 0.2s;
    }
    .read-link:hover { gap: 10px; }

    .divider { height: 1px; background: var(--border); }

    @keyframes spin { to { transform: rotate(360deg); } }
    @keyframes fadeUp { from { opacity:0; transform:translateY(24px); } to { opacity:1; transform:translateY(0); } }

    @media (max-width: 860px) {
      .featured-card { grid-template-columns: 1fr; }
      .featured-img-wrap { aspect-ratio: 16/9; height: auto !important; }
    }
    @media (max-width: 600px) {
      .grid-3 { grid-template-columns: 1fr !important; }
      .list-card { flex-direction: column; }
      .list-img-wrap { width: 100% !important; height: 180px !important; }
    }
  `}</style>
);

/* ── READING TIME ─────────────────────────────────────────────── */
const readTime = (text = '') => `${Math.max(1, Math.ceil(text.split(' ').length / 200))} min read`;

/* ── BOOKMARK BUTTON ──────────────────────────────────────────── */
const BookmarkBtn = ({ id }) => {
  const [saved, setSaved] = useState(false);
  return (
    <button
      onClick={(e) => { e.stopPropagation(); setSaved(s => !s); }}
      style={{ background: 'none', border: 'none', cursor: 'pointer', color: saved ? 'var(--blue)' : 'var(--muted)', padding: 4, display: 'flex', transition: 'color 0.2s' }}
      title={saved ? 'Remove bookmark' : 'Bookmark'}
    >
      {saved ? <IoBookmark size={16} /> : <IoBookmarkOutline size={16} />}
    </button>
  );
};

/* ── FEATURED CARD ────────────────────────────────────────────── */
const FeaturedCard = ({ blog, onClick }) => (
  <motion.div
    className="featured-card"
    initial={{ opacity: 0, y: 32 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6 }}
    onClick={onClick}
  >
    {/* Image */}
    <div className="featured-img-wrap" style={{ overflow: 'hidden', height: 440 }}>
      <img className="featured-img" src={blog.coverImg} alt={blog.title} />
    </div>

    {/* Content */}
    <div style={{ padding: '48px 44px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 28 }}>
          <span className="pill pill-ink">Featured</span>
          <span className="pill pill-blue">{blog.category || 'Clinical'}</span>
        </div>

        <h2 className="serif" style={{ fontSize: 'clamp(1.8rem, 3vw, 2.6rem)', fontWeight: 700, color: 'var(--navy)', lineHeight: 1.2, letterSpacing: '-0.01em', marginBottom: 18 }}>
          {blog.title}
        </h2>

        <p style={{ fontSize: 15, color: 'var(--muted)', lineHeight: 1.75, marginBottom: 32, display: '-webkit-box', WebkitLineClamp: 4, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
          {blog.description}
        </p>
      </div>

      <div>
        <div className="divider" style={{ marginBottom: 24 }} />
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            {/* Author avatar */}
            <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'var(--pale)', border: '2px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--blue)', flexShrink: 0 }}>
              <IoPersonOutline size={18} />
            </div>
            <div>
              <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--ink)' }}>Dr. {blog.author?.name || 'Medical Staff'}</div>
              <div style={{ fontSize: 11, color: 'var(--muted)', display: 'flex', alignItems: 'center', gap: 6 }}>
                <IoCalendarOutline size={11} />
                {new Date(blog.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                <span>·</span>
                <IoTimeOutline size={11} />
                {readTime(blog.description)}
              </div>
            </div>
          </div>
          <span className="read-link">
            Read Article <IoArrowForwardOutline size={14} />
          </span>
        </div>
      </div>
    </div>
  </motion.div>
);

/* ── GRID CARD ────────────────────────────────────────────────── */
const GridCard = ({ blog, idx, onClick }) => (
  <motion.article
    className="blog-card"
    initial={{ opacity: 0, y: 24 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: idx * 0.06 }}
    onClick={onClick}
  >
    {/* Image */}
    <div style={{ overflow: 'hidden', aspectRatio: '3/2', flexShrink: 0 }}>
      <img className="blog-img" src={blog.coverImg} alt={blog.title} />
    </div>

    {/* Body */}
    <div style={{ padding: '24px 26px 26px', display: 'flex', flexDirection: 'column', flex: 1 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
        <span className="pill pill-blue">{blog.category || 'Clinical'}</span>
        <BookmarkBtn id={blog._id} />
      </div>

      <h3 className="serif" style={{ fontSize: '1.35rem', fontWeight: 700, color: 'var(--navy)', lineHeight: 1.3, letterSpacing: '-0.01em', marginBottom: 10, flex: 1 }}>
        {blog.title}
      </h3>

      <p style={{ fontSize: 13, color: 'var(--muted)', lineHeight: 1.7, marginBottom: 20, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
        {blog.description}
      </p>

      <div className="divider" style={{ marginBottom: 16 }} />

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ fontSize: 11, color: 'var(--muted)', display: 'flex', alignItems: 'center', gap: 6 }}>
          <IoTimeOutline size={11} />
          {readTime(blog.description)}
          <span style={{ opacity: 0.4 }}>·</span>
          <IoCalendarOutline size={11} />
          {new Date(blog.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
        </div>
        <span className="read-link">
          Read <IoArrowForwardOutline size={12} />
        </span>
      </div>
    </div>
  </motion.article>
);

/* ── LIST CARD ────────────────────────────────────────────────── */
const ListCard = ({ blog, idx, onClick }) => (
  <motion.article
    className="list-card"
    initial={{ opacity: 0, x: -20 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ delay: idx * 0.05 }}
    onClick={onClick}
  >
    <div className="list-img-wrap" style={{ width: 200, height: 140, overflow: 'hidden', flexShrink: 0 }}>
      <img className="list-img" src={blog.coverImg} alt={blog.title} />
    </div>
    <div style={{ padding: '20px 24px 20px 0', flex: 1, minWidth: 0 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
        <span className="pill pill-blue">{blog.category || 'Clinical'}</span>
        <span style={{ fontSize: 11, color: 'var(--muted)', display: 'flex', alignItems: 'center', gap: 4 }}>
          <IoTimeOutline size={11} /> {readTime(blog.description)}
        </span>
      </div>
      <h3 className="serif" style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--navy)', lineHeight: 1.3, marginBottom: 8, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
        {blog.title}
      </h3>
      <p style={{ fontSize: 13, color: 'var(--muted)', lineHeight: 1.6, display: '-webkit-box', WebkitLineClamp: 1, WebkitBoxOrient: 'vertical', overflow: 'hidden', marginBottom: 12 }}>
        {blog.description}
      </p>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ fontSize: 11, color: 'var(--muted)' }}>
          Dr. {blog.author?.name || 'Medical Staff'} · {new Date(blog.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
        </span>
        <div style={{ display: 'flex', gap: 8 }}>
          <BookmarkBtn id={blog._id} />
          <button onClick={(e) => e.stopPropagation()} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--muted)', padding: 4, display: 'flex', transition: 'color 0.2s' }}>
            <IoShareSocialOutline size={16} />
          </button>
        </div>
      </div>
    </div>
  </motion.article>
);

/* ── SKELETON LOADER ──────────────────────────────────────────── */
const Skeleton = () => (
  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 28 }}>
    {[1,2,3,4,5,6].map(i => (
      <div key={i} style={{ background: 'var(--white)', borderRadius: 24, overflow: 'hidden', border: '1px solid var(--border)' }}>
        <div style={{ aspectRatio: '3/2', background: 'linear-gradient(90deg, var(--pale) 0%, var(--border) 50%, var(--pale) 100%)', backgroundSize: '200% 100%', animation: 'shimmer 1.6s infinite' }} />
        <div style={{ padding: '24px 26px' }}>
          <div style={{ height: 14, width: '40%', background: 'var(--pale)', borderRadius: 8, marginBottom: 16 }} />
          <div style={{ height: 20, width: '90%', background: 'var(--pale)', borderRadius: 8, marginBottom: 8 }} />
          <div style={{ height: 20, width: '70%', background: 'var(--pale)', borderRadius: 8, marginBottom: 20 }} />
          <div style={{ height: 12, width: '60%', background: 'var(--pale)', borderRadius: 8 }} />
        </div>
      </div>
    ))}
    <style>{`@keyframes shimmer { 0%{background-position:200% 0} 100%{background-position:-200% 0} }`}</style>
  </div>
);

/* ── CATEGORIES ───────────────────────────────────────────────── */
const CATS = ['All', 'General Health', 'Maternity', 'Surgery', 'Cardiology', 'Pediatrics', 'Neurology'];

/* ── MAIN ─────────────────────────────────────────────────────── */
const Journal = () => {
  const navigate = useNavigate();
  const [blogs, setBlogs] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [activeCategory, setActiveCategory] = useState('All');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'list'

  useEffect(() => {
    const fetch = async () => {
      try {
        const { data } = await API.get('/blogs');
        if (data.success && Array.isArray(data.posts)) {
          setBlogs(data.posts);
          setFiltered(data.posts);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetch();
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
    <div className="journal-root" style={{ minHeight: '100vh' }}>
      <GlobalStyles />

      {/* ── TOP MASTHEAD ── */}
      <div style={{ background: 'var(--white)', borderBottom: '1px solid var(--border)' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 32px' }}>

          {/* Eyebrow */}
          <div style={{ borderBottom: '1px solid var(--border)', padding: '14px 0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span className="pill pill-blue">St. Joseph's Catholic Hospital</span>
            <div style={{ fontSize: 11, color: 'var(--muted)', fontWeight: 500 }}>
              {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
            </div>
          </div>

          {/* Masthead */}
          <div style={{ padding: '48px 0 36px', textAlign: 'center' }}>
            {/* Decorative rule above */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24, justifyContent: 'center' }}>
              <div style={{ width: 48, height: 1, background: 'var(--border)' }} />
              <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--sky)' }} />
              <div style={{ width: 48, height: 1, background: 'var(--border)' }} />
            </div>
            <h1 className="serif" style={{ fontSize: 'clamp(3rem, 8vw, 6rem)', fontWeight: 700, color: 'var(--navy)', letterSpacing: '-0.03em', lineHeight: 1, margin: '0 auto' }}>
              The Medical{' '}
              <em style={{ color: 'var(--blue)', fontStyle: 'italic' }}>Journal</em>
            </h1>
            {/* Decorative rule below */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginTop: 24, justifyContent: 'center' }}>
              <div style={{ width: 48, height: 1, background: 'var(--border)' }} />
              <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--sky)' }} />
              <div style={{ width: 48, height: 1, background: 'var(--border)' }} />
            </div>
          </div>

          {/* Sub-tagline */}
          <div style={{ textAlign: 'center', paddingBottom: 32, borderBottom: '2px solid var(--navy)' }}>
            <p style={{ fontSize: 13, color: 'var(--muted)', letterSpacing: '0.25em', textTransform: 'uppercase', fontWeight: 600 }}>
              Evidence-Based Clinical Insights · Patient Education · Medical Research
            </p>
          </div>

          {/* Controls bar */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px 0', flexWrap: 'wrap', gap: 12 }}>
            {/* Category pills */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, justifyContent: 'center' }}>
              {CATS.map(cat => (
                <button
                  key={cat}
                  className={`cat-btn ${activeCategory === cat ? 'active' : ''}`}
                  onClick={() => setActiveCategory(cat)}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Divider */}
            <div style={{ width: 1, height: 28, background: 'var(--border)', margin: '0 4px', flexShrink: 0 }} />

            {/* Right: search + view toggle */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div className="search-box">
                <IoSearchOutline size={16} style={{ color: 'var(--muted)', flexShrink: 0 }} />
                <input
                  type="text"
                  placeholder="Search articles…"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                />
              </div>
              <div style={{ display: 'flex', background: 'var(--pale)', borderRadius: 10, padding: 4, gap: 2 }}>
                <button onClick={() => setViewMode('grid')} style={{ padding: '6px 10px', borderRadius: 8, border: 'none', cursor: 'pointer', background: viewMode === 'grid' ? 'var(--white)' : 'transparent', color: viewMode === 'grid' ? 'var(--blue)' : 'var(--muted)', transition: 'all 0.2s', boxShadow: viewMode === 'grid' ? 'var(--card-shadow)' : 'none' }}>
                  <IoGridOutline size={16} />
                </button>
                <button onClick={() => setViewMode('list')} style={{ padding: '6px 10px', borderRadius: 8, border: 'none', cursor: 'pointer', background: viewMode === 'list' ? 'var(--white)' : 'transparent', color: viewMode === 'list' ? 'var(--blue)' : 'var(--muted)', transition: 'all 0.2s', boxShadow: viewMode === 'list' ? 'var(--card-shadow)' : 'none' }}>
                  <IoListOutline size={16} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── MAIN CONTENT ── */}
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '56px 32px 96px' }}>

        {loading ? <Skeleton /> : (
          <>
            {/* Results count */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 36 }}>
              <p style={{ fontSize: 13, color: 'var(--muted)', fontWeight: 500 }}>
                Showing <strong style={{ color: 'var(--ink)' }}>{filtered.length}</strong> article{filtered.length !== 1 ? 's' : ''}
                {activeCategory !== 'All' && <> in <strong style={{ color: 'var(--blue)' }}>{activeCategory}</strong></>}
                {search && <> matching <strong style={{ color: 'var(--blue)' }}>"{search}"</strong></>}
              </p>
              {(activeCategory !== 'All' || search) && (
                <button
                  onClick={() => { setActiveCategory('All'); setSearch(''); }}
                  style={{ fontSize: 11, fontWeight: 700, color: 'var(--blue)', background: 'none', border: 'none', cursor: 'pointer', textTransform: 'uppercase', letterSpacing: '0.15em' }}
                >
                  Clear filters
                </button>
              )}
            </div>

            {filtered.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '80px 0' }}>
                <p className="serif" style={{ fontSize: '2rem', color: 'var(--muted)', fontStyle: 'italic' }}>No articles found.</p>
                <p style={{ fontSize: 14, color: 'var(--muted)', marginTop: 8 }}>Try a different category or search term.</p>
              </div>
            ) : (
              <>
                {/* FEATURED — only show when not filtering */}
                {activeCategory === 'All' && !search && filtered.length > 0 && (
                  <div style={{ marginBottom: 60 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24 }}>
                      <span className="pill pill-ink">Editor's Pick</span>
                      <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
                    </div>
                    <FeaturedCard blog={filtered[0]} onClick={() => navigate(`/blog/${filtered[0]._id}`)} />
                  </div>
                )}

                {/* Section label */}
                {activeCategory === 'All' && !search && filtered.length > 1 && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 32 }}>
                    <span className="pill pill-blue">Latest Articles</span>
                    <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
                    <span style={{ fontSize: 11, color: 'var(--muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.15em' }}>
                      {filtered.length - 1} more
                    </span>
                  </div>
                )}

                {/* GRID or LIST */}
                <AnimatePresence mode="popLayout">
                  {viewMode === 'grid' ? (
                    <div className="grid-3" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 28 }}>
                      {(activeCategory === 'All' && !search ? filtered.slice(1) : filtered).map((blog, idx) => (
                        <GridCard key={blog._id} blog={blog} idx={idx} onClick={() => navigate(`/blog/${blog._id}`)} />
                      ))}
                    </div>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                      {(activeCategory === 'All' && !search ? filtered.slice(1) : filtered).map((blog, idx) => (
                        <ListCard key={blog._id} blog={blog} idx={idx} onClick={() => navigate(`/blog/${blog._id}`)} />
                      ))}
                    </div>
                  )}
                </AnimatePresence>
              </>
            )}
          </>
        )}

        {/* ── NEWSLETTER STRIP ── */}
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          style={{ marginTop: 80, background: 'var(--navy)', borderRadius: 32, padding: '52px 56px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 32, flexWrap: 'wrap' }}
        >
          <div>
            <p style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.22em', color: 'var(--powder)', marginBottom: 10 }}>Stay Informed</p>
            <h3 className="serif" style={{ fontSize: 'clamp(1.6rem, 3vw, 2.2rem)', fontWeight: 700, color: 'var(--white)', letterSpacing: '-0.02em', lineHeight: 1.2 }}>
              Get the latest clinical<br />
              <em style={{ color: 'var(--powder)', fontStyle: 'italic' }}>insights delivered weekly.</em>
            </h3>
          </div>
          <div style={{ display: 'flex', gap: 10, flexShrink: 0, flexWrap: 'wrap' }}>
            <input
              type="email"
              placeholder="Your email address"
              style={{ padding: '14px 20px', borderRadius: 14, border: '1.5px solid rgba(191,219,254,0.25)', background: 'rgba(255,255,255,0.08)', color: 'var(--white)', fontSize: 14, outline: 'none', width: 240, fontFamily: 'Cabinet Grotesk, sans-serif' }}
            />
            <button style={{ padding: '14px 28px', borderRadius: 14, background: 'var(--sky)', color: 'var(--white)', border: 'none', fontFamily: 'Cabinet Grotesk, sans-serif', fontWeight: 700, fontSize: 13, cursor: 'pointer', whiteSpace: 'nowrap', display: 'flex', alignItems: 'center', gap: 8, transition: 'background 0.2s' }}>
              Subscribe <IoArrowForwardOutline size={14} />
            </button>
          </div>
        </motion.div>

        {/* Footer note */}
        <p style={{ textAlign: 'center', fontSize: 11, color: '#93a9c8', marginTop: 48, lineHeight: 1.7 }}>
          Medical content is reviewed by board-certified physicians. For emergencies call 911 immediately. <br />
          © {new Date().getFullYear()} St. Joseph's Catholic Hospital · All rights reserved.
        </p>
      </div>
    </div>
  );
};

export default Journal;