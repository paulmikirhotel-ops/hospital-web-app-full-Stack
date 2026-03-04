import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import { 
  IoArrowBack, IoTimeOutline, IoPersonOutline, 
  IoShareSocialOutline, IoBookmarkOutline, IoPrintOutline 
} from 'react-icons/io5';

const BlogDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const res = await axios.get(`http://localhost:5001/api/blogs/${id}`);
        
        // 🚀 THE FIX: Extract the 'post' object from the response
        let blogData = res.data.post || res.data;

        // 🛡️ Safety Parse for Editor.js Content
        if (typeof blogData.content === 'string') {
          try {
            blogData.content = JSON.parse(blogData.content);
          } catch (e) {
            console.error("Content parsing failed", e);
          }
        }

        setBlog(blogData);
        document.title = `${blogData.title} | SJCH Journal`;
      } catch (err) {
        console.error("Error fetching blog:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchBlog();

    return () => { document.title = "Saint Joseph's Hospital"; };
  }, [id]);

  // --- EDITOR.JS RENDERER ---
  const renderContent = (content) => {
    if (!content || !content.blocks) return null;

    return content.blocks.map((block, index) => {
      switch (block.type) {
        case 'header':
          const Tag = `h${block.data.level || 2}`;
          return (
            <Tag key={index} className="text-3xl font-black text-slate-900 mt-12 mb-6 tracking-tight">
              {block.data.text}
            </Tag>
          );

        case 'paragraph':
          return (
            <p key={index} className="text-slate-600 text-lg leading-[1.8] mb-8 font-medium"
              dangerouslySetInnerHTML={{ __html: block.data.text }}
            />
          );

        case 'list':
          const ListTag = block.data.style === 'ordered' ? 'ol' : 'ul';
          return (
            <ListTag key={index} className={`${block.data.style === 'ordered' ? 'list-decimal' : 'list-disc'} pl-6 mb-8 space-y-4`}>
              {block.data.items.map((item, i) => (
                <li key={i} className="text-slate-600 text-lg leading-relaxed" dangerouslySetInnerHTML={{ __html: item }} />
              ))}
            </ListTag>
          );

        case 'quote':
          return (
            <blockquote key={index} className="border-l-4 border-blue-600 pl-8 py-4 my-12 bg-blue-50/50 rounded-r-[2rem]">
              <p className="text-2xl font-black text-slate-800 italic mb-3">"{block.data.text}"</p>
              {block.data.caption && <cite className="text-xs font-black uppercase text-blue-600">— {block.data.caption}</cite>}
            </blockquote>
          );

        default:
          return null;
      }
    });
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  if (!blog) return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <h2 className="text-2xl font-black text-slate-900 mb-4">Clinical Record Not Found</h2>
      <button onClick={() => navigate('/blog')} className="text-blue-600 font-bold underline">Return to Archive</button>
    </div>
  );

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="min-h-screen bg-white pb-32">
      {/* NAVIGATION */}
      <nav className="sticky top-0 bg-white/80 backdrop-blur-md z-40 border-b border-slate-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <button onClick={() => navigate('/blog')} className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-blue-600 transition-all">
            <IoArrowBack size={16} /> Back to Journal
          </button>
          <div className="flex gap-4 text-slate-400">
            <IoShareSocialOutline className="cursor-pointer hover:text-blue-600" size={20} />
            <IoPrintOutline className="cursor-pointer hover:text-blue-600" size={20} onClick={() => window.print()} />
          </div>
        </div>
      </nav>

      <main className="max-w-5xl mx-auto px-6 pt-16 lg:pt-24">
        <header className="mb-12">
          <span className="bg-blue-600 text-white px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest">
            {blog.category}
          </span>
          <h1 className="text-5xl md:text-7xl font-black text-slate-900 tracking-tighter leading-[0.95] my-10">
            {blog.title}
          </h1>
          <div className="flex gap-8 py-8 border-y border-slate-100">
             <div className="flex items-center gap-3">
                <IoPersonOutline className="text-blue-600" />
                <span className="text-sm font-bold">Dr. {blog.author?.name || "Medical Staff"}</span>
             </div>
             <div className="flex items-center gap-3">
                <IoTimeOutline className="text-blue-600" />
                <span className="text-sm font-bold">{new Date(blog.createdAt).toLocaleDateString()}</span>
             </div>
          </div>
        </header>

        <img src={blog.coverImg} alt="" className="w-full aspect-video object-cover rounded-[3.5rem] shadow-2xl mb-16" />

        <div className="max-w-3xl mx-auto">
          {renderContent(blog.content)}
        </div>
      </main>
    </motion.div>
  );
};

export default BlogDetails;