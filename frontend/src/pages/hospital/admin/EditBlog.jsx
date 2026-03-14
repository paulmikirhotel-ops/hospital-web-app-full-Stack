import React, { useEffect, useRef, useState } from 'react';
import EditorJS from '@editorjs/editorjs';
import Header from '@editorjs/header';
import List from '@editorjs/list';
import Quote from '@editorjs/quote';
import { useNavigate, useParams } from 'react-router-dom';
import { IoSaveOutline, IoCloudUploadOutline, IoImageOutline, IoCloseCircleOutline } from 'react-icons/io5';
import { toast } from 'react-hot-toast';
import API from '../../../api/axiosConfig';

const EditBlog = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const ejInstance = useRef(null);
  const editorReady = useRef(false);
  const fileInputRef = useRef(null);

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('General Health');
  const [description, setDescription] = useState('');
  const [coverImgFile, setCoverImgFile] = useState(null);
  const [coverImgPreview, setCoverImgPreview] = useState('');
  const [existingCoverImg, setExistingCoverImg] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const parsedContentRef = useRef({});

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const { data } = await API.get(`/blogs/${id}`);
        const blog = data.post || data;

        setTitle(blog.title || '');
        setCategory(blog.category || 'General Health');
        setDescription(blog.description || '');
        setExistingCoverImg(blog.coverImg || '');
        setCoverImgPreview(blog.coverImg || '');

        // Parse and store content in ref so editor can use it after DOM renders
        if (blog.content) {
          try {
            parsedContentRef.current = typeof blog.content === 'string'
              ? JSON.parse(blog.content)
              : blog.content;
          } catch (e) {
            console.error('Content parse error:', e);
            parsedContentRef.current = {};
          }
        }
      } catch (err) {
        console.error('Fetch error:', err);
        toast.error('Failed to load article');
      } finally {
        setLoading(false);
      }
    };

    fetchBlog();

    return () => {
      if (ejInstance.current && typeof ejInstance.current.destroy === 'function') {
        ejInstance.current.destroy();
        ejInstance.current = null;
        editorReady.current = false;
      }
    };
  }, [id]);

  // Initialize EditorJS only after loading is false and DOM is painted
  useEffect(() => {
    if (loading) return;

    const frame = requestAnimationFrame(() => {
      const holder = document.getElementById('editorjs');
      if (!holder || editorReady.current) return;

      editorReady.current = true;
      ejInstance.current = new EditorJS({
        holder: 'editorjs',
        autofocus: false,
        placeholder: 'Start writing your clinical article here...',
        data: parsedContentRef.current,
        tools: {
          header: { class: Header, config: { levels: [1, 2, 3], defaultLevel: 2 } },
          list: { class: List, inlineToolbar: true },
          quote: { class: Quote, inlineToolbar: true },
        },
      });
    });

    return () => {
      cancelAnimationFrame(frame);
    };
  }, [loading]); // ← runs when loading becomes false

  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
    if (!allowed.includes(file.type)) return toast.error('Only JPG, PNG or WEBP allowed');
    if (file.size > 5 * 1024 * 1024) return toast.error('Image must be under 5MB');

    setCoverImgFile(file);
    setCoverImgPreview(URL.createObjectURL(file));
  };

  const removeImage = () => {
    setCoverImgFile(null);
    setCoverImgPreview(existingCoverImg);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSave = async () => {
    if (!title.trim()) return toast.error('Please enter a title');
    if (!description.trim()) return toast.error('Please enter a description');

    let content = {};
    try {
      content = await ejInstance.current.save();
    } catch (e) {
      console.error('Editor save error:', e);
      return toast.error('Editor is not ready. Please wait and try again.');
    }

    setIsSaving(true);
    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('description', description);
      formData.append('category', category);
      formData.append('content', JSON.stringify(content));

      if (coverImgFile) {
        formData.append('coverImg', coverImgFile);
      } else {
        formData.append('coverImg', existingCoverImg);
      }

      const { data } = await API.put(`/blogs/${id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      if (data.success) {
        toast.success('Article updated successfully!');
        navigate('/admin/manage-blogs');
      }
    } catch (err) {
      console.error('Update error:', err.response?.data || err.message);
      toast.error(err.response?.data?.message || 'Error updating post');
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) return (
    <div className="p-20 text-center">
      <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
      <p className="text-slate-400 font-black text-[10px] uppercase tracking-widest">Loading Article...</p>
    </div>
  );

  return (
    <div className="max-w-5xl mx-auto pb-20">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-10">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tighter">Edit Article</h2>
          <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mt-1">
            Updating existing publication
          </p>
        </div>
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
            className="flex items-center gap-2 px-8 py-3 bg-blue-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-blue-100 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-900 transition-all"
          >
            <IoSaveOutline size={18} />
            {isSaving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>

      <div className="grid lg:grid-cols-[1fr_350px] gap-10">

        {/* EDITOR — always in DOM after loading */}
        <div className="space-y-6">
          <input
            type="text"
            value={title}
            placeholder="Enter Article Title..."
            className="w-full text-5xl font-black text-slate-900 placeholder:text-slate-200 outline-none bg-transparent tracking-tighter"
            onChange={(e) => setTitle(e.target.value)}
          />
          <div className="bg-white border border-slate-100 rounded-[2.5rem] p-10 min-h-[500px] shadow-sm">
            <div id="editorjs" className="prose prose-slate max-w-none min-h-[400px]" />
          </div>
        </div>

        {/* SIDEBAR */}
        <aside className="space-y-6">
          <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm space-y-6">

            {/* COVER IMAGE */}
            <div>
              <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest block mb-3">
                Cover Image
              </label>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageSelect}
              />
              {coverImgPreview ? (
                <div className="relative group">
                  <img
                    src={coverImgPreview}
                    className="w-full aspect-video object-cover rounded-2xl border border-slate-100"
                    alt="Cover Preview"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-all rounded-2xl flex items-center justify-center gap-3">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current.click()}
                      className="p-2 bg-white rounded-xl text-slate-700 hover:bg-blue-600 hover:text-white transition-all"
                      title="Change image"
                    >
                      <IoImageOutline size={18} />
                    </button>
                    <button
                      type="button"
                      onClick={removeImage}
                      className="p-2 bg-white rounded-xl text-slate-700 hover:bg-red-500 hover:text-white transition-all"
                      title="Revert to original"
                    >
                      <IoCloseCircleOutline size={18} />
                    </button>
                  </div>
                  {coverImgFile ? (
                    <p className="text-[9px] text-emerald-500 font-black uppercase tracking-widest mt-2">
                      ✓ New image selected
                    </p>
                  ) : (
                    <p className="text-[9px] text-slate-400 font-black uppercase tracking-widest mt-2">
                      Hover to change image
                    </p>
                  )}
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => fileInputRef.current.click()}
                  className="w-full flex flex-col items-center justify-center gap-3 py-10 border-2 border-dashed border-slate-200 rounded-2xl hover:border-blue-400 hover:bg-blue-50/30 transition-all group"
                >
                  <div className="w-12 h-12 rounded-xl bg-slate-100 group-hover:bg-blue-100 flex items-center justify-center transition-all">
                    <IoCloudUploadOutline size={22} className="text-slate-400 group-hover:text-blue-600" />
                  </div>
                  <div className="text-center">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                      Click to upload from PC
                    </p>
                    <p className="text-[9px] text-slate-300 mt-1">JPG, PNG, WEBP — max 5MB</p>
                  </div>
                </button>
              )}
            </div>

            {/* CATEGORY */}
            <div>
              <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest block mb-3">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full p-4 bg-slate-50 border border-slate-100 rounded-xl text-xs font-bold outline-none appearance-none cursor-pointer focus:border-blue-600 transition-all"
              >
                <option>General Health</option>
                <option>Maternity</option>
                <option>Surgery</option>
                <option>Cardiology</option>
                <option>Pediatrics</option>
              </select>
            </div>

            {/* DESCRIPTION */}
            <div>
              <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest block mb-3">
                Short Summary
              </label>
              <textarea
                rows="5"
                value={description}
                className="w-full p-4 bg-slate-50 border border-slate-100 rounded-xl text-xs outline-none focus:border-blue-600 transition-all resize-none font-medium text-slate-700"
                placeholder="Brief clinical overview of this article..."
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            {/* CHECKLIST */}
            <div className="border-t border-slate-100 pt-6 space-y-3">
              <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-4">
                Update Checklist
              </p>
              <CheckItem done={title.trim().length > 0} label="Title added" />
              <CheckItem done={description.trim().length > 0} label="Summary added" />
              <CheckItem done={!!coverImgPreview} label="Cover image set" />
            </div>

          </div>
        </aside>
      </div>
    </div>
  );
};

const CheckItem = ({ done, label }) => (
  <div className={`flex items-center gap-3 text-[10px] font-black uppercase tracking-widest ${done ? 'text-emerald-500' : 'text-slate-300'}`}>
    <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${done ? 'border-emerald-500 bg-emerald-500' : 'border-slate-200'}`}>
      {done && <span className="text-white text-[8px]">✓</span>}
    </div>
    {label}
  </div>
);

export default EditBlog;