import React, { useEffect, useRef, useState } from 'react';
import EditorJS from '@editorjs/editorjs';
import Header from '@editorjs/header';
import List from '@editorjs/list';
import Quote from '@editorjs/quote';
import ImageTool from '@editorjs/image';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { IoCloudUploadOutline, IoSaveOutline, IoCloseCircleOutline } from 'react-icons/io5';

const PostBlog = () => {
  const ejInstance = useRef();
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('General Health');
  const [description, setDescription] = useState('');
  const [coverImg, setCoverImg] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  // Initialize EditorJS
  useEffect(() => {
    if (!ejInstance.current) {
      initEditor();
    }
    return () => {
      ejInstance.current?.destroy();
      ejInstance.current = null;
    };
  }, []);

  const initEditor = () => {
    const editor = new EditorJS({
      holder: 'editorjs',
      onReady: () => { ejInstance.current = editor; },
      autofocus: true,
      data: {},
      tools: {
        header: Header,
        list: List,
        quote: Quote,
        image: {
          class: ImageTool,
          config: {
            endpoints: {
              byFile: 'http://localhost:5001/api/blogs/upload', // Your backend upload endpoint
            }
          }
        },
      },
    });
  };

  const handleSave = async () => {
    const content = await ejInstance.current.save();
    if (!title || !description) return alert("Please fill in the title and description.");

    setIsSaving(true);
    try {
      const blogData = {
        title,
        description,
        category,
        coverImg,
        content: JSON.stringify(content), // Save as string to MongoDB
      };

      await axios.post('http://localhost:5001/api/blogs', blogData);
      alert("Article Published Successfully!");
      navigate('/admin/manage-blogs');
    } catch (err) {
      console.error("Save Error:", err);
      alert("Error saving post.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto pb-20">
      {/* HEADER ACTIONS */}
      <div className="flex justify-between items-center mb-10">
        <h2 className="text-3xl font-black text-slate-900 tracking-tighter">New Publication</h2>
        <div className="flex gap-4">
          <button 
            onClick={() => navigate('/admin/manage-blogs')}
            className="px-6 py-3 text-slate-400 font-bold hover:text-slate-900 transition-all"
          >
            Cancel
          </button>
          <button 
            onClick={handleSave}
            disabled={isSaving}
            className="flex items-center gap-2 px-8 py-3 bg-blue-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-blue-100 disabled:opacity-50"
          >
            <IoSaveOutline size={18} /> {isSaving ? 'Publishing...' : 'Publish Article'}
          </button>
        </div>
      </div>

      <div className="grid lg:grid-cols-[1fr_350px] gap-10">
        {/* MAIN EDITOR AREA */}
        <div className="space-y-6">
          <input 
            type="text" 
            placeholder="Enter Article Title..." 
            className="w-full text-5xl font-black text-slate-900 placeholder:text-slate-200 outline-none bg-transparent tracking-tighter"
            onChange={(e) => setTitle(e.target.value)}
          />
          
          {/* Editor Container */}
          <div className="bg-white border border-slate-100 rounded-[2.5rem] p-10 min-h-[500px] shadow-sm">
            <div id="editorjs" className="prose prose-slate max-w-none"></div>
          </div>
        </div>

        {/* SIDEBAR SETTINGS */}
        <aside className="space-y-6">
          <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm space-y-6">
            <div>
              <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest block mb-3">Cover Image URL</label>
              <div className="relative group">
                <input 
                  type="text" 
                  value={coverImg}
                  placeholder="https://images.unsplash.com/..." 
                  className="w-full p-4 bg-slate-50 border border-slate-100 rounded-xl text-xs outline-none focus:border-blue-600 transition-all"
                  onChange={(e) => setCoverImg(e.target.value)}
                />
                <IoCloudUploadOutline className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300" />
              </div>
              {coverImg && <img src={coverImg} className="mt-4 rounded-2xl aspect-video object-cover border border-slate-100" alt="Preview" />}
            </div>

            <div>
              <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest block mb-3">Category</label>
              <select 
                className="w-full p-4 bg-slate-50 border border-slate-100 rounded-xl text-xs font-bold outline-none appearance-none"
                onChange={(e) => setCategory(e.target.value)}
              >
                <option>General Health</option>
                <option>Maternity</option>
                <option>Surgery</option>
                <option>Cardiology</option>
                <option>Pediatrics</option>
              </select>
            </div>

            <div>
              <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest block mb-3">Short Summary</label>
              <textarea 
                rows="4"
                className="w-full p-4 bg-slate-50 border border-slate-100 rounded-xl text-xs outline-none focus:border-blue-600 transition-all resize-none"
                placeholder="Brief clinical overview..."
                onChange={(e) => setDescription(e.target.value)}
              ></textarea>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default PostBlog;