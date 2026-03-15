import React, { useEffect, useState, useRef, useCallback } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  IoSearchOutline, IoArrowForwardOutline,
  IoCalendarOutline, IoPersonOutline,
  IoImagesOutline, IoVideocamOutline,
} from 'react-icons/io5';

/* ─────────────────────────────────────────────
   CARD CAROUSEL
   Auto-slides through coverImg + images[]
───────────────────────────────────────────── */
const CardCarousel = ({ post, onClick }) => {
  // Build full slide list: cover first, then gallery images
  const slides = [
    post.coverImg,
    ...(Array.isArray(post.images) ? post.images : []),
  ].filter(Boolean);

  const [current, setCurrent]   = useState(0);
  const [dir, setDir]           = useState(1);   // 1 = forward, -1 = backward
  const [paused, setPaused]     = useState(false);
  const timerRef                = useRef(null);

  const goTo = useCallback((idx, direction = 1) => {
    setDir(direction);
    setCurrent(idx);
  }, []);

  // Auto-advance every 3 s
  useEffect(() => {
    if (slides.length <= 1 || paused) return;
    timerRef.current = setInterval(() => {
      setCurrent(prev => {
        setDir(1);
        return (prev + 1) % slides.length;
      });
    }, 3000);
    return () => clearInterval(timerRef.current);
  }, [slides.length, paused]);

  const variants = {
    enter:  (d) => ({ x: d > 0 ? '100%' : '-100%', opacity: 0   }),
    center:         ({ x: 0,            opacity: 1   }),
    exit:   (d) => ({ x: d > 0 ? '-100%' : '100%', opacity: 0   }),
  };

  return (
    <div
      className="relative aspect-[16/10] overflow-hidden rounded-[2.5rem] mb-6 bg-slate-100 shadow-lg shadow-slate-200/50 cursor-pointer"
      onClick={onClick}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Slides */}
      <AnimatePresence initial={false} custom={dir}>
        <motion.img
          key={current}
          src={slides[current]}
          alt={post.title}
          custom={dir}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.55, ease: [0.32, 0.72, 0, 1] }}
          className="absolute inset-0 w-full h-full object-cover"
        />
      </AnimatePresence>

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none rounded-[2.5rem]" />

      {/* Category badge */}
      <div className="absolute top-5 left-5 z-10">
        <span className="bg-white/90 backdrop-blur-md px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest text-blue-600 border border-white/60 shadow-sm">
          {post.category}
        </span>
      </div>

      {/* Media badges (top-right) */}
      <div className="absolute top-5 right-5 z-10 flex gap-2">
        {slides.length > 1 && (
          <span className="flex items-center gap-1 bg-black/50 backdrop-blur-md text-white text-[9px] font-black px-2.5 py-1.5 rounded-xl border border-white/10">
            <IoImagesOutline size={11} /> {slides.length}
          </span>
        )}
        {post.video && (
          <span className="flex items-center gap-1 bg-black/50 backdrop-blur-md text-white text-[9px] font-black px-2.5 py-1.5 rounded-xl border border-white/10">
            <IoVideocamOutline size={11} />
          </span>
        )}
      </div>

      {/* Dot indicators (only if >1 slide) */}
      {slides.length > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 flex items-center gap-1.5">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={e => { e.stopPropagation(); goTo(i, i > current ? 1 : -1); }}
              className="transition-all duration-300 rounded-full bg-white/90 border-none outline-none cursor-pointer p-0"
              style={{
                width:  i === current ? 20 : 6,
                height: 6,
                opacity: i === current ? 1 : 0.45,
                transform: i === current ? 'scale(1)' : 'scale(0.85)',
              }}
            />
          ))}
        </div>
      )}

      {/* Slide counter */}
      {slides.length > 1 && (
        <div className="absolute bottom-4 right-5 z-10">
          <span className="text-[9px] font-black text-white/70 tracking-widest uppercase">
            {current + 1}/{slides.length}
          </span>
        </div>
      )}

      {/* Hover shimmer */}
      <motion.div
        className="absolute inset-0 rounded-[2.5rem] pointer-events-none"
        initial={{ opacity: 0 }}
        whileHover={{ opacity: 1 }}
        style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.06) 0%, transparent 60%)' }}
      />
    </div>
  );
};

/* ─────────────────────────────────────────────
   MAIN COMPONENT
───────────────────────────────────────────── */
const Blog = () => {
  const [blogs, setBlogs]           = useState([]);
  const [loading, setLoading]       = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const res  = await axios.get('http://localhost:5001/api/blogs');
        const data = Array.isArray(res.data) ? res.data : (res.data.posts || res.data.blogs || []);
        setBlogs(data);
      } catch (err) {
        console.error('Error fetching journal entries:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchBlogs();
  }, []);

  // Collect unique categories
  const categories = ['All', ...Array.from(new Set(blogs.map(b => b.category).filter(Boolean)))];

  // Filter by search + category
  const filteredBlogs = blogs.filter(blog => {
    const title    = blog.title    ? blog.title.toLowerCase()    : '';
    const category = blog.category ? blog.category.toLowerCase() : '';
    const query    = searchQuery.toLowerCase();
    const matchSearch   = title.includes(query) || category.includes(query);
    const matchCategory = activeCategory === 'All' || blog.category === activeCategory;
    return matchSearch && matchCategory;
  });

  /* ── Loading ── */
  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20 }}>
        <div style={{ position: 'relative', width: 56, height: 56 }}>
          <div style={{ width: 56, height: 56, border: '3px solid #e2e8f0', borderTopColor: '#1a56db', borderRadius: '50%', animation: 'spin 0.9s linear infinite' }} />
          <div style={{ position: 'absolute', inset: 6, border: '3px solid #e2e8f0', borderTopColor: '#60a5fa', borderRadius: '50%', animation: 'spin 0.6s linear infinite reverse' }} />
        </div>
        <p style={{ fontSize: 10, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.3em', color: '#94a3b8' }}>
          Loading Journal...
        </p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-white pb-20">

      {/* ── HERO HEADER ── */}
      <section className="relative bg-slate-50 pt-32 pb-16 px-6 overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute -top-32 -right-32 w-[600px] h-[600px] rounded-full"
            style={{ background: 'radial-gradient(circle, rgba(26,86,219,0.04) 0%, transparent 70%)' }} />
          <div className="absolute -bottom-20 -left-20 w-[400px] h-[400px] rounded-full"
            style={{ background: 'radial-gradient(circle, rgba(14,165,233,0.05) 0%, transparent 70%)' }} />
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col md:flex-row md:items-end justify-between gap-8"
          >
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-100 px-4 py-2 rounded-full mb-5">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-pulse" />
                <span className="text-[10px] font-black uppercase tracking-widest text-blue-600">
                  Saint Joseph's Catholic Hospital
                </span>
              </div>
              <h1 className="text-6xl font-black text-slate-900 tracking-tighter mb-4 leading-none">
                Medical <span className="text-blue-600">Journal.</span>
              </h1>
              <p className="text-lg text-slate-500 font-medium leading-relaxed">
                Clinical insights, health tips, and hospital updates from our specialists.
              </p>
              {/* Stats row */}
              <div className="flex items-center gap-6 mt-6">
                <div>
                  <p className="text-2xl font-black text-slate-900">{blogs.length}</p>
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Articles</p>
                </div>
                <div className="w-px h-8 bg-slate-200" />
                <div>
                  <p className="text-2xl font-black text-slate-900">{categories.length - 1}</p>
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Topics</p>
                </div>
                <div className="w-px h-8 bg-slate-200" />
                <div>
                  <p className="text-2xl font-black text-slate-900">
                    {blogs.filter(b => b.images?.length > 0 || b.video).length}
                  </p>
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Rich Media</p>
                </div>
              </div>
            </div>

            {/* Search */}
            <div className="relative w-full md:w-80">
              <IoSearchOutline className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
              <input
                type="text"
                placeholder="Search topics..."
                className="w-full pl-12 pr-4 py-4 bg-white border border-slate-200 rounded-2xl outline-none focus:border-blue-600 transition-all shadow-sm text-sm"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
              />
            </div>
          </motion.div>

          {/* Category filter pills */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="flex flex-wrap gap-2 mt-10"
          >
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className="transition-all duration-200 font-black text-[10px] uppercase tracking-widest px-4 py-2 rounded-full border"
                style={{
                  background:   activeCategory === cat ? '#1a56db' : '#fff',
                  color:        activeCategory === cat ? '#fff'    : '#64748b',
                  borderColor:  activeCategory === cat ? '#1a56db' : '#e2e8f0',
                  boxShadow:    activeCategory === cat ? '0 4px 14px rgba(26,86,219,0.25)' : 'none',
                }}
              >
                {cat}
              </button>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── GRID ── */}
      <section className="py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <AnimatePresence mode="wait">
            {filteredBlogs.length > 0 ? (
              <motion.div
                key="grid"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10"
              >
                {filteredBlogs.map((post, idx) => (
                  <motion.article
                    key={post._id}
                    initial={{ opacity: 0, y: 28 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-60px' }}
                    transition={{ delay: idx * 0.05, duration: 0.5 }}
                    className="group cursor-pointer"
                  >
                    {/* Carousel image */}
                    <CardCarousel post={post} onClick={() => navigate(`/blog/${post._id}`)} />

                    {/* Card text */}
                    <div className="px-2" onClick={() => navigate(`/blog/${post._id}`)}>
                      <div className="flex items-center gap-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">
                        <span className="flex items-center gap-1.5">
                          <IoCalendarOutline size={11} />
                          {new Date(post.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </span>
                        <span className="w-1 h-1 bg-slate-300 rounded-full" />
                        <span className="flex items-center gap-1.5">
                          <IoPersonOutline size={11} />
                          Dr. {post.author?.name || post.author?.username || 'Specialist'}
                        </span>
                      </div>

                      <h2 className="text-xl font-black text-slate-900 leading-tight mb-3 group-hover:text-blue-600 transition-colors duration-200 line-clamp-2">
                        {post.title}
                      </h2>

                      <p className="text-slate-400 text-sm leading-relaxed mb-5 line-clamp-2">
                        {post.description}
                      </p>

                      {/* Media indicators */}
                      {(post.images?.length > 0 || post.video) && (
                        <div className="flex items-center gap-3 mb-4">
                          {post.images?.length > 0 && (
                            <span className="flex items-center gap-1.5 text-[10px] font-black text-slate-400 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100">
                              <IoImagesOutline size={12} className="text-blue-500" />
                              {post.images.length + 1} photos
                            </span>
                          )}
                          {post.video && (
                            <span className="flex items-center gap-1.5 text-[10px] font-black text-slate-400 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100">
                              <IoVideocamOutline size={12} className="text-blue-500" />
                              Video
                            </span>
                          )}
                        </div>
                      )}

                      <div className="flex items-center gap-2 text-slate-800 font-black text-[10px] uppercase tracking-[0.2em] group-hover:gap-4 transition-all duration-300">
                        Read Full Article
                        <IoArrowForwardOutline className="text-blue-600" size={15} />
                      </div>
                    </div>
                  </motion.article>
                ))}
              </motion.div>
            ) : (
              <motion.div
                key="empty"
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="text-center py-24 bg-slate-50 rounded-[2rem] border-2 border-dashed border-slate-200"
              >
                <div className="w-16 h-16 rounded-2xl bg-white border border-slate-100 flex items-center justify-center mx-auto mb-5 shadow-sm text-2xl">
                  🔍
                </div>
                <h3 className="text-xl font-black text-slate-400 uppercase tracking-widest mb-2">No articles found</h3>
                <p className="text-slate-400 text-sm">Try adjusting your search or category filter.</p>
                <button
                  onClick={() => { setSearchQuery(''); setActiveCategory('All'); }}
                  className="mt-6 px-6 py-3 bg-blue-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-900 transition-all"
                >
                  Clear Filters
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>
    </div>
  );
};

export default Blog;