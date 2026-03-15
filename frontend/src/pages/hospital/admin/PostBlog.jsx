import React, { useEffect, useRef, useState } from 'react';
import EditorJS from '@editorjs/editorjs';
import Header from '@editorjs/header';
import List from '@editorjs/list';
import Quote from '@editorjs/quote';
import { useNavigate } from 'react-router-dom';
import {
  IoCloudUploadOutline, IoSaveOutline, IoImageOutline,
  IoCloseCircleOutline, IoVideocamOutline, IoLinkOutline,
  IoAddOutline, IoTrashOutline,
} from 'react-icons/io5';
import { toast } from 'react-hot-toast';
import API from '../../../api/axiosConfig';

const MAX_IMAGES = 8;

const PostBlog = () => {
  const navigate = useNavigate();
  const ejInstance  = useRef(null);
  const editorReady = useRef(false);
  const coverRef    = useRef(null);
  const imagesRef   = useRef(null);
  const videoRef    = useRef(null);

  const [title, setTitle]               = useState('');
  const [category, setCategory]         = useState('General Health');
  const [description, setDescription]   = useState('');
  const [isSaving, setIsSaving]         = useState(false);

  // Cover image
  const [coverFile, setCoverFile]       = useState(null);
  const [coverPreview, setCoverPreview] = useState('');

  // Gallery images (up to 8)
  const [galleryFiles, setGalleryFiles]       = useState([]);   // File[]
  const [galleryPreviews, setGalleryPreviews] = useState([]);   // string[]
  const [galleryPage, setGalleryPage]         = useState(0);    // pagination: 4 per page

  // Video
  const [videoMode, setVideoMode]   = useState('url');   // 'url' | 'file'
  const [videoUrl, setVideoUrl]     = useState('');
  const [videoFile, setVideoFile]   = useState(null);
  const [videoPreview, setVideoPreview] = useState('');

  // ── Editor init ───────────────────────────────────────
  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      const holder = document.getElementById('editorjs');
      if (!holder || editorReady.current) return;
      editorReady.current = true;
      ejInstance.current = new EditorJS({
        holder: 'editorjs',
        autofocus: true,
        placeholder: 'Start writing your clinical article here...',
        data: {},
        tools: {
          header: { class: Header, config: { levels: [1, 2, 3], defaultLevel: 2 } },
          list:   { class: List,   inlineToolbar: true },
          quote:  { class: Quote,  inlineToolbar: true },
        },
      });
    });
    return () => {
      cancelAnimationFrame(frame);
      if (ejInstance.current?.destroy) { ejInstance.current.destroy(); ejInstance.current = null; editorReady.current = false; }
    };
  }, []);

  // ── Cover image ───────────────────────────────────────
  const handleCover = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) return toast.error('Image must be under 5MB');
    setCoverFile(file);
    setCoverPreview(URL.createObjectURL(file));
  };

  // ── Gallery images ────────────────────────────────────
  const handleGalleryAdd = (e) => {
    const files = Array.from(e.target.files);
    const remaining = MAX_IMAGES - galleryFiles.length;
    if (remaining <= 0) return toast.error(`Maximum ${MAX_IMAGES} gallery images allowed`);

    const toAdd = files.slice(0, remaining);
    const oversized = toAdd.filter(f => f.size > 5 * 1024 * 1024);
    if (oversized.length) return toast.error('Each image must be under 5MB');

    const newPreviews = toAdd.map(f => URL.createObjectURL(f));
    setGalleryFiles(prev  => [...prev, ...toAdd]);
    setGalleryPreviews(prev => [...prev, ...newPreviews]);
    // jump to last page
    const newTotal = galleryFiles.length + toAdd.length;
    setGalleryPage(Math.floor((newTotal - 1) / 4));
    imagesRef.current.value = '';
  };

  const removeGalleryImage = (idx) => {
    setGalleryFiles(prev    => prev.filter((_, i) => i !== idx));
    setGalleryPreviews(prev => prev.filter((_, i) => i !== idx));
    const newTotal = galleryFiles.length - 1;
    if (galleryPage > 0 && galleryPage * 4 >= newTotal) setGalleryPage(galleryPage - 1);
  };

  // ── Video ─────────────────────────────────────────────
  const handleVideoFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 100 * 1024 * 1024) return toast.error('Video must be under 100MB');
    setVideoFile(file);
    setVideoPreview(URL.createObjectURL(file));
  };

  // ── Save ──────────────────────────────────────────────
  const handleSave = async () => {
    if (!title.trim())       return toast.error('Please enter a title');
    if (!description.trim()) return toast.error('Please enter a description');
    if (!coverFile)          return toast.error('Please upload a cover image');

    let content = {};
    try { content = await ejInstance.current.save(); }
    catch { return toast.error('Editor not ready — please wait and try again'); }

    setIsSaving(true);
    try {
      const fd = new FormData();
      fd.append('title',       title);
      fd.append('description', description);
      fd.append('category',    category);
      fd.append('content',     JSON.stringify(content));
      fd.append('coverImg',    coverFile);

      galleryFiles.forEach(f => fd.append('images', f));

      if (videoMode === 'file' && videoFile) {
        fd.append('videoFile', videoFile);
      } else if (videoMode === 'url' && videoUrl.trim()) {
        fd.append('videoUrl', videoUrl.trim());
      }

      const { data } = await API.post('/blogs', fd, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (data.success) {
        toast.success('Article Published Successfully!');
        navigate('/admin/manage-blogs');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error publishing article.');
    } finally {
      setIsSaving(false);
    }
  };

  // Gallery pagination
  const totalPages   = Math.ceil(galleryPreviews.length / 4);
  const visibleImgs  = galleryPreviews.slice(galleryPage * 4, galleryPage * 4 + 4);
  const visibleFiles = galleryFiles.slice(galleryPage * 4, galleryPage * 4 + 4);

  return (
    <div className="max-w-5xl mx-auto pb-20">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-10">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tighter">New Publication</h2>
          <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mt-1">Create a new clinical article</p>
        </div>
        <div className="flex gap-4">
          <button onClick={() => navigate('/admin/manage-blogs')} className="px-6 py-3 text-slate-400 font-bold hover:text-slate-900 transition-all">Cancel</button>
          <button onClick={handleSave} disabled={isSaving}
            className="flex items-center gap-2 px-8 py-3 bg-blue-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-blue-100 disabled:opacity-50 hover:bg-slate-900 transition-all">
            <IoSaveOutline size={18} />
            {isSaving ? 'Publishing...' : 'Publish Article'}
          </button>
        </div>
      </div>

      <div className="grid lg:grid-cols-[1fr_350px] gap-10">

        {/* EDITOR */}
        <div className="space-y-6">
          <input type="text" value={title} placeholder="Enter Article Title..."
            className="w-full text-5xl font-black text-slate-900 placeholder:text-slate-200 outline-none bg-transparent tracking-tighter"
            onChange={e => setTitle(e.target.value)} />
          <div className="bg-white border border-slate-100 rounded-[2.5rem] p-10 min-h-[500px] shadow-sm">
            <div id="editorjs" className="prose prose-slate max-w-none min-h-[400px]" />
          </div>
        </div>

        {/* SIDEBAR */}
        <aside className="space-y-6">
          <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm space-y-6">

            {/* ── COVER IMAGE ── */}
            <div>
              <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest block mb-3">Cover Image</label>
              <input ref={coverRef} type="file" accept="image/*" className="hidden" onChange={handleCover} />
              {coverPreview ? (
                <div className="relative group">
                  <img src={coverPreview} className="w-full aspect-video object-cover rounded-2xl border border-slate-100" alt="Cover" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-all rounded-2xl flex items-center justify-center gap-3">
                    <button type="button" onClick={() => coverRef.current.click()} className="p-2 bg-white rounded-xl hover:bg-blue-600 hover:text-white transition-all"><IoImageOutline size={18} /></button>
                    <button type="button" onClick={() => { setCoverFile(null); setCoverPreview(''); }} className="p-2 bg-white rounded-xl hover:bg-red-500 hover:text-white transition-all"><IoCloseCircleOutline size={18} /></button>
                  </div>
                  <p className="text-[9px] text-emerald-500 font-black uppercase tracking-widest mt-2 truncate">✓ {coverFile?.name}</p>
                </div>
              ) : (
                <button type="button" onClick={() => coverRef.current.click()}
                  className="w-full flex flex-col items-center justify-center gap-3 py-10 border-2 border-dashed border-slate-200 rounded-2xl hover:border-blue-400 hover:bg-blue-50/30 transition-all group">
                  <div className="w-12 h-12 rounded-xl bg-slate-100 group-hover:bg-blue-100 flex items-center justify-center transition-all">
                    <IoCloudUploadOutline size={22} className="text-slate-400 group-hover:text-blue-600" />
                  </div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Click to upload cover</p>
                  <p className="text-[9px] text-slate-300">JPG, PNG, WEBP — max 5MB</p>
                </button>
              )}
            </div>

            {/* ── GALLERY IMAGES ── */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">
                  Gallery Images <span className="text-blue-500">({galleryFiles.length}/{MAX_IMAGES})</span>
                </label>
                {galleryFiles.length < MAX_IMAGES && (
                  <button type="button" onClick={() => imagesRef.current.click()}
                    className="flex items-center gap-1 text-[9px] font-black text-blue-600 hover:text-blue-800 uppercase tracking-widest">
                    <IoAddOutline size={14} /> Add
                  </button>
                )}
              </div>
              <input ref={imagesRef} type="file" accept="image/*" multiple className="hidden" onChange={handleGalleryAdd} />

              {galleryPreviews.length > 0 ? (
                <div>
                  {/* Grid: 2x2 */}
                  <div className="grid grid-cols-2 gap-2 mb-3">
                    {visibleImgs.map((src, i) => {
                      const realIdx = galleryPage * 4 + i;
                      return (
                        <div key={realIdx} className="relative group aspect-square">
                          <img src={src} className="w-full h-full object-cover rounded-xl border border-slate-100" alt={`Gallery ${realIdx + 1}`} />
                          <button type="button" onClick={() => removeGalleryImage(realIdx)}
                            className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-all">
                            <IoTrashOutline size={12} />
                          </button>
                          <span className="absolute bottom-1 left-1 bg-black/50 text-white text-[8px] font-black px-1.5 py-0.5 rounded-md">{realIdx + 1}</span>
                        </div>
                      );
                    })}
                    {/* Empty slots */}
                    {visibleImgs.length < 4 && galleryFiles.length < MAX_IMAGES && (
                      <button type="button" onClick={() => imagesRef.current.click()}
                        className="aspect-square border-2 border-dashed border-slate-200 rounded-xl flex flex-col items-center justify-center gap-1 hover:border-blue-400 hover:bg-blue-50/30 transition-all">
                        <IoAddOutline size={20} className="text-slate-300" />
                        <span className="text-[8px] text-slate-300 font-black uppercase">Add</span>
                      </button>
                    )}
                  </div>
                  {/* Pagination dots */}
                  {totalPages > 1 && (
                    <div className="flex items-center justify-center gap-2">
                      {Array.from({ length: totalPages }).map((_, i) => (
                        <button key={i} type="button" onClick={() => setGalleryPage(i)}
                          className={`w-2 h-2 rounded-full transition-all ${i === galleryPage ? 'bg-blue-600 w-4' : 'bg-slate-200'}`} />
                      ))}
                    </div>
                  )}
                  <p className="text-[9px] text-slate-400 text-center mt-1">
                    {galleryPage * 4 + 1}–{Math.min(galleryPage * 4 + 4, galleryPreviews.length)} of {galleryPreviews.length} images
                  </p>
                </div>
              ) : (
                <button type="button" onClick={() => imagesRef.current.click()}
                  className="w-full flex flex-col items-center justify-center gap-3 py-8 border-2 border-dashed border-slate-200 rounded-2xl hover:border-blue-400 hover:bg-blue-50/30 transition-all group">
                  <IoImageOutline size={22} className="text-slate-300 group-hover:text-blue-500" />
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Add up to 8 images</p>
                </button>
              )}
            </div>

            {/* ── VIDEO ── */}
            <div>
              <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest block mb-3">Video (Optional)</label>
              {/* Toggle */}
              <div className="flex gap-2 mb-4">
                {['url', 'file'].map(m => (
                  <button key={m} type="button" onClick={() => setVideoMode(m)}
                    className={`flex-1 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${videoMode === m ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-400 hover:bg-slate-200'}`}>
                    {m === 'url' ? '🔗 Paste URL' : '📁 Upload File'}
                  </button>
                ))}
              </div>

              {videoMode === 'url' ? (
                <div className="relative">
                  <IoLinkOutline className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                  <input type="url" value={videoUrl} onChange={e => setVideoUrl(e.target.value)}
                    placeholder="YouTube, Vimeo, or direct URL..."
                    className="w-full pl-9 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-xs outline-none focus:border-blue-600 transition-all" />
                </div>
              ) : (
                <>
                  <input ref={videoRef} type="file" accept="video/*" className="hidden" onChange={handleVideoFile} />
                  {videoPreview ? (
                    <div className="relative group">
                      <video src={videoPreview} className="w-full rounded-2xl border border-slate-100" controls style={{ maxHeight: 160 }} />
                      <button type="button" onClick={() => { setVideoFile(null); setVideoPreview(''); videoRef.current.value = ''; }}
                        className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-all">
                        <IoCloseCircleOutline size={14} />
                      </button>
                      <p className="text-[9px] text-emerald-500 font-black uppercase tracking-widest mt-2 truncate">✓ {videoFile?.name}</p>
                    </div>
                  ) : (
                    <button type="button" onClick={() => videoRef.current.click()}
                      className="w-full flex flex-col items-center justify-center gap-3 py-8 border-2 border-dashed border-slate-200 rounded-2xl hover:border-blue-400 hover:bg-blue-50/30 transition-all group">
                      <IoVideocamOutline size={22} className="text-slate-300 group-hover:text-blue-500" />
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Upload MP4, MOV, WEBM</p>
                      <p className="text-[9px] text-slate-300">Max 100MB</p>
                    </button>
                  )}
                </>
              )}
            </div>

            {/* ── CATEGORY ── */}
            <div>
              <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest block mb-3">Category</label>
              <select value={category} onChange={e => setCategory(e.target.value)}
                className="w-full p-4 bg-slate-50 border border-slate-100 rounded-xl text-xs font-bold outline-none appearance-none cursor-pointer focus:border-blue-600 transition-all">
                <option>General Health</option>
                <option>Maternity</option>
                <option>Surgery</option>
                <option>Cardiology</option>
                <option>Pediatrics</option>
              </select>
            </div>

            {/* ── SUMMARY ── */}
            <div>
              <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest block mb-3">Short Summary</label>
              <textarea rows="5" value={description} onChange={e => setDescription(e.target.value)}
                className="w-full p-4 bg-slate-50 border border-slate-100 rounded-xl text-xs outline-none focus:border-blue-600 transition-all resize-none font-medium text-slate-700"
                placeholder="Brief clinical overview of this article..." />
            </div>

            {/* ── CHECKLIST ── */}
            <div className="border-t border-slate-100 pt-6 space-y-3">
              <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-4">Pre-publish Checklist</p>
              <CheckItem done={title.trim().length > 0}        label="Title added" />
              <CheckItem done={description.trim().length > 0}  label="Summary added" />
              <CheckItem done={!!coverFile}                    label="Cover image uploaded" />
              <CheckItem done={galleryFiles.length > 0}        label={`Gallery images (${galleryFiles.length}/${MAX_IMAGES})`} />
              <CheckItem done={!!(videoFile || videoUrl.trim())} label="Video added (optional)" optional />
            </div>

          </div>
        </aside>
      </div>
    </div>
  );
};

const CheckItem = ({ done, label, optional }) => (
  <div className={`flex items-center gap-3 text-[10px] font-black uppercase tracking-widest ${done ? 'text-emerald-500' : optional ? 'text-slate-300' : 'text-slate-300'}`}>
    <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${done ? 'border-emerald-500 bg-emerald-500' : optional ? 'border-slate-200 border-dashed' : 'border-slate-200'}`}>
      {done && <span className="text-white text-[8px]">✓</span>}
    </div>
    {label} {optional && <span className="text-slate-300 font-normal normal-case">(optional)</span>}
  </div>
);

export default PostBlog;