import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  IoArrowBack, IoTimeOutline, IoPersonOutline,
  IoShareSocialOutline, IoPrintOutline
} from 'react-icons/io5';
import API from '../../../api/axiosConfig';

const BlogDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlog = async () => {
      if (!id || id === 'undefined' || id.length !== 24) {
        setLoading(false);
        return;
      }
      try {
        const { data } = await API.get(`/blogs/${id}`);
        let blogData = data.post || data;

        // Parse Editor.js content if stored as string
        if (typeof blogData.content === 'string') {
          try {
            blogData.content = JSON.parse(blogData.content);
          } catch (e) {
            console.error('Content parsing failed', e);
            blogData.content = null;
          }
        }

        setBlog(blogData);
        document.title = `${blogData.title} | SJCH Journal`;
      } catch (err) {
        console.error('Error fetching blog:', err);
        setBlog(null);
      } finally {
        setLoading(false);
      }
    };

    fetchBlog();
    window.scrollTo(0, 0);
    return () => { document.title = "Saint Joseph's Hospital"; };
  }, [id]);

  const renderContent = (content) => {
    if (!content || !content.blocks || content.blocks.length === 0) {
      return (
        <p className="text-slate-400 italic text-lg">No content available.</p>
      );
    }

    return content.blocks.map((block, index) => {
      switch (block.type) {

        case 'header': {
          const level = block.data.level || 2;
          const sizes = {
            1: 'text-5xl',
            2: 'text-4xl',
            3: 'text-3xl',
            4: 'text-2xl',
            5: 'text-xl',
            6: 'text-lg',
          };
          const Tag = `h${level}`;
          return (
            <Tag
              key={index}
              className={`${sizes[level]} font-black text-slate-900 mt-12 mb-6 tracking-tight leading-tight`}
              dangerouslySetInnerHTML={{ __html: block.data.text }}
            />
          );
        }

        case 'paragraph': {
          if (!block.data.text) return null;
          return (
            <p
              key={index}
              className="text-slate-600 text-lg leading-[1.8] mb-8 font-medium"
              dangerouslySetInnerHTML={{ __html: block.data.text }}
            />
          );
        }

        case 'list': {
          const ListTag = block.data.style === 'ordered' ? 'ol' : 'ul';
          const listClass = block.data.style === 'ordered'
            ? 'list-decimal'
            : 'list-disc';

          // Handle both old format (string[]) and new format ({content, items}[])
          const items = block.data.items || [];

          return (
            <ListTag
              key={index}
              className={`${listClass} pl-6 mb-8 space-y-4`}
            >
              {items.map((item, i) => {
                // New EditorJS list format stores items as objects
                const itemText = typeof item === 'string'
                  ? item
                  : item?.content || item?.text || '';

                return (
                  <li
                    key={i}
                    className="text-slate-600 text-lg leading-relaxed font-medium"
                    dangerouslySetInnerHTML={{ __html: itemText }}
                  />
                );
              })}
            </ListTag>
          );
        }

        case 'quote': {
          return (
            <blockquote
              key={index}
              className="border-l-4 border-blue-600 pl-8 py-6 my-12 bg-blue-50/50 rounded-r-[2rem]"
            >
              <p
                className="text-2xl font-black text-slate-800 italic mb-3 leading-relaxed"
                dangerouslySetInnerHTML={{ __html: `"${block.data.text}"` }}
              />
              {block.data.caption && (
                <cite className="text-xs font-black uppercase text-blue-600 not-italic">
                  — {block.data.caption}
                </cite>
              )}
            </blockquote>
          );
        }

        case 'image': {
          const imgUrl = block.data.file?.url || block.data.url || '';
          if (!imgUrl) return null;
          return (
            <figure key={index} className="my-12">
              <img
                src={imgUrl}
                alt={block.data.caption || ''}
                className="w-full rounded-[2rem] shadow-lg object-cover"
              />
              {block.data.caption && (
                <figcaption className="text-center text-xs text-slate-400 font-bold mt-4 uppercase tracking-widest">
                  {block.data.caption}
                </figcaption>
              )}
            </figure>
          );
        }

        case 'delimiter': {
          return (
            <div key={index} className="flex items-center justify-center my-12">
              <div className="flex gap-3">
                <span className="w-2 h-2 rounded-full bg-slate-300" />
                <span className="w-2 h-2 rounded-full bg-slate-300" />
                <span className="w-2 h-2 rounded-full bg-slate-300" />
              </div>
            </div>
          );
        }

        case 'code': {
          return (
            <pre
              key={index}
              className="bg-slate-900 text-emerald-400 p-8 rounded-[2rem] my-8 overflow-x-auto text-sm font-mono leading-relaxed"
            >
              <code>{block.data.code}</code>
            </pre>
          );
        }

        case 'warning': {
          return (
            <div
              key={index}
              className="bg-amber-50 border-l-4 border-amber-400 px-8 py-6 rounded-r-[2rem] my-8"
            >
              {block.data.title && (
                <p className="font-black text-amber-700 uppercase tracking-widest text-xs mb-2">
                  {block.data.title}
                </p>
              )}
              <p
                className="text-amber-700 font-medium"
                dangerouslySetInnerHTML={{ __html: block.data.message }}
              />
            </div>
          );
        }

        default:
          return null;
      }
    });
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="flex flex-col items-center gap-4">
        <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 animate-pulse">
          Loading Article...
        </p>
      </div>
    </div>
  );

  if (!blog) return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-6">
      <h2 className="text-2xl font-black text-slate-900">Clinical Record Not Found</h2>
      <button
        onClick={() => navigate('/blog')}
        className="px-8 py-4 bg-blue-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest"
      >
        Return to Journal
      </button>
    </div>
  );

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="min-h-screen bg-white pb-32">

      {/* STICKY NAV */}
      <nav className="sticky top-0 bg-white/80 backdrop-blur-md z-40 border-b border-slate-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <button
            onClick={() => navigate('/blog')}
            className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-blue-600 transition-all"
          >
            <IoArrowBack size={16} /> Back to Journal
          </button>
          <div className="flex gap-4 text-slate-400">
            <IoShareSocialOutline
              className="cursor-pointer hover:text-blue-600 transition-colors"
              size={20}
              onClick={() => navigator.clipboard.writeText(window.location.href)}
            />
            <IoPrintOutline
              className="cursor-pointer hover:text-blue-600 transition-colors"
              size={20}
              onClick={() => window.print()}
            />
          </div>
        </div>
      </nav>

      <main className="max-w-5xl mx-auto px-6 pt-16 lg:pt-24">

        {/* ARTICLE HEADER */}
        <header className="mb-12">
          <span className="bg-blue-600 text-white px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest">
            {blog.category}
          </span>
          <h1 className="text-5xl md:text-7xl font-black text-slate-900 tracking-tighter leading-[0.95] my-10">
            {blog.title}
          </h1>
          {blog.description && (
            <p className="text-xl text-slate-400 leading-relaxed mb-8 max-w-3xl">
              {blog.description}
            </p>
          )}
          <div className="flex flex-wrap gap-8 py-8 border-y border-slate-100">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                <IoPersonOutline className="text-blue-600" size={14} />
              </div>
              <span className="text-sm font-bold text-slate-700">
                Dr. {blog.author?.name || 'Medical Staff'}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                <IoTimeOutline className="text-blue-600" size={14} />
              </div>
              <span className="text-sm font-bold text-slate-700">
                {new Date(blog.createdAt).toLocaleDateString('en-US', {
                  year: 'numeric', month: 'long', day: 'numeric'
                })}
              </span>
            </div>
          </div>
        </header>

        {/* COVER IMAGE */}
        {blog.coverImg && (
          <img
            src={blog.coverImg}
            alt={blog.title}
            className="w-full aspect-video object-cover rounded-[3.5rem] shadow-2xl mb-16"
          />
        )}

        {/* ARTICLE BODY */}
        <div className="max-w-3xl mx-auto">
          {renderContent(blog.content)}
        </div>

        {/* BACK BUTTON */}
        <div className="max-w-3xl mx-auto mt-20 pt-10 border-t border-slate-100">
          <button
            onClick={() => navigate('/blog')}
            className="group flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-blue-600 transition-all"
          >
            <div className="p-2 rounded-full bg-slate-100 group-hover:bg-blue-600 group-hover:text-white transition-all">
              <IoArrowBack size={14} />
            </div>
            Back to Journal
          </button>
        </div>

      </main>
    </motion.div>
  );
};

export default BlogDetails;