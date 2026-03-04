import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  IoSearchOutline, IoArrowForwardOutline, 
  IoCalendarOutline, IoPersonOutline 
} from 'react-icons/io5';

const Blog = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const res = await axios.get('http://localhost:5001/api/blogs');
        // SAFE CHECK: Ensure we are setting an array even if the backend response is unexpected
        const data = Array.isArray(res.data) ? res.data : (res.data.blogs || []);
        setBlogs(data);
      } catch (err) {
        console.error("Error fetching journal entries:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchBlogs();
  }, []);

  // Robust Filter Logic: Check for existence of properties before calling toLowerCase()
  const filteredBlogs = blogs.filter(blog => {
    const title = blog.title ? blog.title.toLowerCase() : "";
    const category = blog.category ? blog.category.toLowerCase() : "";
    const query = searchQuery.toLowerCase();
    return title.includes(query) || category.includes(query);
  });

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-white pb-20">
      <section className="bg-slate-50 pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
            <div className="max-w-2xl">
              <h1 className="text-6xl font-black text-slate-900 tracking-tighter mb-4">
                Medical <span className="text-blue-600">Journal.</span>
              </h1>
              <p className="text-lg text-slate-500 font-medium">
                Clinical insights, health tips, and hospital updates from the specialists at Saint Joseph's.
              </p>
            </div>
            
            <div className="relative w-full md:w-80">
              <IoSearchOutline className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
              <input 
                type="text" 
                placeholder="Search topics..."
                className="w-full pl-12 pr-4 py-4 bg-white border border-slate-200 rounded-2xl outline-none focus:border-blue-600 transition-all shadow-sm"
                value={searchQuery} // Added controlled input
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          {/* Use filteredBlogs here */}
          {filteredBlogs.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
              {filteredBlogs.map((post) => (
                <motion.article 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  key={post._id}
                  className="group cursor-pointer"
                  onClick={() => navigate(`/blog/${post._id}`)}
                >
                  <div className="relative aspect-[16/10] overflow-hidden rounded-[2.5rem] mb-6 bg-slate-100 shadow-lg shadow-slate-200/50">
                    <img 
                      src={post.coverImg} 
                      alt={post.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute top-6 left-6">
                      <span className="bg-white/90 backdrop-blur-md px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest text-blue-600 border border-white">
                        {post.category}
                      </span>
                    </div>
                  </div>

                  <div className="px-2">
                    <div className="flex items-center gap-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">
                      <span className="flex items-center gap-1.5">
                        <IoCalendarOutline /> {new Date(post.createdAt).toLocaleDateString()}
                      </span>
                      <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                      <span className="flex items-center gap-1.5">
                        <IoPersonOutline /> Dr. {post.author?.username || post.author?.name || "Specialist"}
                      </span>
                    </div>
                    
                    <h2 className="text-2xl font-black text-slate-900 leading-tight mb-4 group-hover:text-blue-600 transition-colors">
                      {post.title}
                    </h2>
                    
                    <p className="text-slate-500 text-sm leading-relaxed mb-6 line-clamp-2 italic">
                      {post.description}
                    </p>

                    <div className="flex items-center gap-2 text-slate-900 font-black text-[10px] uppercase tracking-[0.2em] group-hover:gap-4 transition-all duration-300">
                      Read Full Article <IoArrowForwardOutline className="text-blue-600" size={16} />
                    </div>
                  </div>
                </motion.article>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-slate-50 rounded-[2rem] border-2 border-dashed border-slate-200">
              <h3 className="text-xl font-bold text-slate-400 uppercase tracking-widest">No articles found</h3>
              <p className="text-slate-400 text-sm mt-2">Try adjusting your search or check your database.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Blog;