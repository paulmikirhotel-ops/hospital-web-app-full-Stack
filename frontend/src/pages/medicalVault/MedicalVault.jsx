import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  IoCloudUploadOutline, IoDocumentTextOutline,
  IoTrashOutline, IoEyeOutline, IoFileTrayOutline,
  IoImageOutline, IoSearchOutline, IoCloseCircleOutline
} from 'react-icons/io5';
import { toast } from 'react-hot-toast';
import API from '../../api/axiosConfig';

const categories = ['All', 'Lab Result', 'Prescription', 'X-Ray', 'Vaccination', 'Other'];

const MedicalVault = () => {
  const [records, setRecords]           = useState([]);
  const [file, setFile]                 = useState(null);
  const [title, setTitle]               = useState('');
  const [category, setCategory]         = useState('Lab Result');
  const [loading, setLoading]           = useState(false);
  const [fetching, setFetching]         = useState(true);
  const [searchQuery, setSearchQuery]   = useState('');
  const [activeFilter, setActiveFilter] = useState('All');
  const fileInputRef                    = useRef(null);

  const fetchVault = async () => {
    try {
      setFetching(true);
      const { data } = await API.get('/medical-vault/my-vault');
      setRecords(data.records || []);
    } catch (err) {
      toast.error('Could not load your medical vault');
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => { fetchVault(); }, []);

  const filteredRecords = useMemo(() => {
    return records.filter(doc => {
      const matchesSearch =
        doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.category.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = activeFilter === 'All' || doc.category === activeFilter;
      return matchesSearch && matchesCategory;
    });
  }, [records, searchQuery, activeFilter]);

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file || !title) return toast.error('Please fill all fields');

    const formData = new FormData();
    formData.append('document', file);
    formData.append('title', title);
    formData.append('category', category);

    setLoading(true);
    try {
      await API.post('/medical-vault/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      toast.success('Document added to vault!');
      setFile(null);
      setTitle('');
      if (fileInputRef.current) fileInputRef.current.value = '';
      fetchVault();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Upload failed');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this record?')) return;
    try {
      await API.delete(`/medical-vault/${id}`);
      toast.success('Record deleted');
      setRecords(prev => prev.filter(r => r._id !== id));
    } catch (err) {
      toast.error('Failed to delete');
    }
  };

  if (fetching) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
          Loading Medical Vault...
        </p>
      </div>
    </div>
  );

  return (
    <div className="p-8 max-w-7xl mx-auto bg-slate-50 min-h-screen">

      {/* HEADER */}
      <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tighter">
            Medical Vault
          </h2>
          <p className="text-blue-600 font-bold italic text-sm mt-1">
            Secure clinical document management.
          </p>
        </div>

        {/* SEARCH */}
        <div className="relative w-full md:w-96 group">
          <IoSearchOutline
            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors"
            size={20}
          />
          <input
            type="text"
            placeholder="Search records by name or type..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-10 py-4 bg-white border border-slate-200 rounded-2xl shadow-sm outline-none focus:ring-4 focus:ring-blue-50 focus:border-blue-400 transition-all font-bold text-slate-700"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 hover:text-slate-600"
            >
              <IoCloseCircleOutline size={18} />
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* UPLOAD SECTION */}
        <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-200 h-fit lg:sticky lg:top-24">
          <h3 className="text-sm font-black uppercase tracking-widest text-blue-600 mb-6">
            Upload New Record
          </h3>
          <form onSubmit={handleUpload} className="space-y-4">

            {/* TITLE */}
            <div>
              <label className="block text-[10px] font-black uppercase text-slate-400 mb-2">
                Document Title
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Blood Test May 2026"
                required
                className="w-full px-4 py-3 rounded-xl border border-slate-100 bg-slate-50 focus:ring-2 focus:ring-blue-100 outline-none transition-all font-bold text-slate-700"
              />
            </div>

            {/* CATEGORY */}
            <div>
              <label className="block text-[10px] font-black uppercase text-slate-400 mb-2">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-100 bg-slate-50 outline-none font-bold text-slate-700 cursor-pointer"
              >
                {categories.filter(c => c !== 'All').map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            {/* FILE UPLOAD */}
            <div>
              <label className="block text-[10px] font-black uppercase text-slate-400 mb-2">
                File
              </label>
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={(e) => setFile(e.target.files[0])}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current.click()}
                className={`w-full border-2 border-dashed rounded-2xl p-6 text-center transition-all ${
                  file
                    ? 'border-emerald-400 bg-emerald-50'
                    : 'border-slate-200 hover:border-blue-400 hover:bg-blue-50/30'
                }`}
              >
                <IoCloudUploadOutline
                  size={30}
                  className={`mx-auto mb-2 ${file ? 'text-emerald-500' : 'text-slate-300'}`}
                />
                <p className="text-[10px] font-bold text-slate-500 uppercase px-2 break-all">
                  {file ? file.name : 'Select File (PDF / Image)'}
                </p>
                {file && (
                  <p className="text-[9px] text-emerald-500 font-black mt-1 uppercase tracking-widest">
                    ✓ Ready to upload
                  </p>
                )}
              </button>
            </div>

            {/* SUBMIT */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-lg hover:bg-blue-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Processing...' : 'Save to Vault'}
            </button>

          </form>
        </div>

        {/* DOCUMENT LIST */}
        <div className="lg:col-span-2 space-y-6">

          {/* CATEGORY PILLS */}
          <div className="flex flex-wrap items-center gap-2 pb-2">
            {categories.map(cat => (
              <button
                key={cat}
                type="button"
                onClick={() => setActiveFilter(cat)}
                className={`px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${
                  activeFilter === cat
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-100'
                    : 'bg-white text-slate-400 border border-slate-200 hover:border-blue-300'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* STATS ROW */}
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-white rounded-2xl p-5 border border-slate-100 text-center">
              <p className="text-3xl font-black text-slate-900">{records.length}</p>
              <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 mt-1">
                Total Records
              </p>
            </div>
            <div className="bg-white rounded-2xl p-5 border border-slate-100 text-center">
              <p className="text-3xl font-black text-blue-600">
                {records.filter(r => r.fileType?.includes('pdf')).length}
              </p>
              <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 mt-1">
                PDFs
              </p>
            </div>
            <div className="bg-white rounded-2xl p-5 border border-slate-100 text-center">
              <p className="text-3xl font-black text-emerald-600">
                {records.filter(r => !r.fileType?.includes('pdf')).length}
              </p>
              <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 mt-1">
                Images
              </p>
            </div>
          </div>

          {/* RECORDS */}
          <div className="space-y-4">
            {filteredRecords.length > 0 ? (
              filteredRecords.map((doc) => (
                <div
                  key={doc._id}
                  className="bg-white p-5 rounded-3xl border border-slate-100 flex items-center justify-between group hover:border-blue-200 hover:shadow-xl hover:shadow-blue-50/50 transition-all"
                >
                  <div className="flex items-center gap-5">
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 ${
                      doc.fileType?.includes('pdf')
                        ? 'bg-rose-50 text-rose-500'
                        : 'bg-blue-50 text-blue-500'
                    }`}>
                      {doc.fileType?.includes('pdf')
                        ? <IoDocumentTextOutline size={28} />
                        : <IoImageOutline size={28} />
                      }
                    </div>
                    <div>
                      <h4 className="font-black text-slate-800 text-sm">{doc.title}</h4>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="px-2 py-0.5 bg-slate-100 rounded text-[9px] font-black text-slate-500 uppercase">
                          {doc.category}
                        </span>
                        <span className="text-[10px] font-bold text-slate-400">
                          {new Date(doc.createdAt).toLocaleDateString('en-US', {
                            month: 'short', day: 'numeric', year: 'numeric'
                          })}
                        </span>
                        {doc.fileSize && (
                          <span className="text-[10px] font-bold text-slate-300">
                            {doc.fileSize}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* ACTIONS */}
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => window.open(doc.documentUrl, '_blank')}
                      className="p-3 bg-slate-50 text-slate-600 rounded-xl hover:bg-blue-600 hover:text-white transition-all shadow-sm"
                      title="View document"
                    >
                      <IoEyeOutline size={18} />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(doc._id)}
                      className="p-3 bg-slate-50 text-rose-400 rounded-xl hover:bg-rose-600 hover:text-white transition-all shadow-sm"
                      title="Delete record"
                    >
                      <IoTrashOutline size={18} />
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center py-24 bg-white rounded-[3rem] border-2 border-dashed border-slate-100">
                <IoFileTrayOutline size={60} className="text-slate-200 mb-4" />
                <p className="font-black uppercase text-[10px] tracking-[0.2em] text-slate-400">
                  {searchQuery || activeFilter !== 'All'
                    ? 'No matching records found'
                    : 'Vault Currently Empty'}
                </p>
                {(searchQuery || activeFilter !== 'All') && (
                  <button
                    type="button"
                    onClick={() => { setSearchQuery(''); setActiveFilter('All'); }}
                    className="mt-4 text-[10px] font-black uppercase tracking-widest text-blue-600 hover:underline"
                  >
                    Clear Filters
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MedicalVault;