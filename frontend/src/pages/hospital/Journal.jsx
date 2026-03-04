import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { IoCalendarOutline } from 'react-icons/io5';

const Journal = () => {
  const navigate = useNavigate();
  const [blogs, setBlogs] = useState([]); 
  const [filteredBlogs, setFilteredBlogs] = useState([]); 
  const [activeCategory, setActiveCategory] = useState('All');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAllBlogs = async () => {
      try {
        const res = await axios.get('http://localhost:5001/api/blogs');
        
        // 🚀 THE FIX: Access 'posts' from the response object
        if (res.data.success && Array.isArray(res.data.posts)) {
          setBlogs(res.data.posts);
          setFilteredBlogs(res.data.posts);
        } else {
          console.error("Data format mismatch:", res.data);
        }
      } catch (err) {
        console.error("Fetch Error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAllBlogs();
  }, []);

  const handleFilter = (category) => {
    setActiveCategory(category);
    if (category === 'All') {
      setFilteredBlogs(blogs);
    } else {
      setFilteredBlogs(blogs.filter(blog => blog.category === category));
    }
  };

  if (loading) return (
    <div className="h-screen flex items-center justify-center font-black text-blue-600 animate-pulse">
      SYNCING JOURNAL...
    </div>
  );

  return (
    <div className="bg-white min-h-screen pt-32 pb-20">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        
        {/* HEADER */}
        <div className="mb-16">
          <div className="flex items-center gap-3 mb-4">
            <span className="px-3 py-1 bg-blue-600 text-white text-[9px] font-black rounded-full uppercase tracking-widest">
              {filteredBlogs.length} Articles
            </span>
          </div>
          <h1 className="text-5xl lg:text-7xl font-black text-slate-900 tracking-tighter">
            The Medical <span className="text-blue-600">Journal.</span>
          </h1>
        </div>

        {/* CATEGORY BAR */}
        <div className="flex flex-wrap gap-2 mb-12 border-b border-slate-100 pb-8">
          {['All', 'Medical Research', 'Wellness', 'Hospital News'].map((cat) => (
            <button
              key={cat}
              onClick={() => handleFilter(cat)}
              className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                activeCategory === cat ? 'bg-slate-900 text-white' : 'bg-slate-50 text-slate-400 hover:bg-slate-100'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* BLOG GRID */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
          <AnimatePresence mode='popLayout'>
            {filteredBlogs.map((blog) => (
              <motion.article
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                key={blog._id}
                onClick={() => navigate(`/blog/${blog._id}`)}
                className="group cursor-pointer"
              >
                <div className="aspect-video rounded-[2rem] overflow-hidden mb-6 bg-slate-100 border border-slate-100">
                  <img 
                    src={blog.coverImg} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                    alt={blog.title} 
                  />
                </div>
                <div className="flex items-center gap-3 text-[9px] font-black text-blue-600 uppercase tracking-widest mb-3">
                  {blog.category} • <IoCalendarOutline /> {new Date(blog.createdAt).toLocaleDateString()}
                </div>
                <h3 className="text-xl font-black text-slate-900 leading-tight group-hover:text-blue-600 transition-colors">
                  {blog.title}
                </h3>
              </motion.article>
            ))}
          </AnimatePresence>
        </div>

        {filteredBlogs.length === 0 && (
          <div className="py-20 text-center text-slate-400 font-bold italic">
            No articles found in this category.
          </div>
        )}

      </div>
    </div>
  );
};

export default Journal;