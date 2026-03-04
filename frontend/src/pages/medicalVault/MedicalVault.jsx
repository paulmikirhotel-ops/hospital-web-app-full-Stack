import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { 
  IoCloudUploadOutline, IoDocumentTextOutline, 
  IoTrashOutline, IoEyeOutline, IoFileTrayOutline,
  IoImageOutline, IoSearchOutline, IoFilterOutline
} from 'react-icons/io5';
import { toast } from 'react-hot-toast';

const MedicalVault = () => {
  const [records, setRecords] = useState([]);
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Lab Result');
  const [loading, setLoading] = useState(false);
  
  // New Search & Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');

  const API_URL = 'http://localhost:5001/api/medical-records';
  const categories = ['All', 'Lab Result', 'Prescription', 'X-Ray', 'Vaccination', 'Other'];

  const fetchVault = async () => {
    try {
      const { data } = await axios.get(`${API_URL}/my-vault`, { withCredentials: true });
      setRecords(data.records);
    } catch (err) {
      toast.error("Could not load your medical vault");
    }
  };

  useEffect(() => { fetchVault(); }, []);

  // --- Optimized Search & Filter Logic ---
  const filteredRecords = useMemo(() => {
    return records.filter(doc => {
      const matchesSearch = doc.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            doc.category.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = activeFilter === 'All' || doc.category === activeFilter;
      return matchesSearch && matchesCategory;
    });
  }, [records, searchQuery, activeFilter]);

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file || !title) return toast.error("Please fill all fields");

    const formData = new FormData();
    formData.append('document', file); 
    formData.append('title', title);
    formData.append('category', category);

    setLoading(true);
    try {
      await axios.post(`${API_URL}/upload`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        withCredentials: true
      });
      toast.success("Document added to vault!");
      setFile(null);
      setTitle('');
      fetchVault(); 
    } catch (err) {
      toast.error(err.response?.data?.message || "Upload failed");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if(!window.confirm("Are you sure?")) return;
    try {
      await axios.delete(`${API_URL}/${id}`, { withCredentials: true });
      toast.success("Record deleted");
      setRecords(records.filter(r => r._id !== id));
    } catch (err) {
      toast.error("Failed to delete");
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto bg-slate-50 min-h-screen">
      <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tighter">Medical Vault</h2>
          <p className="text-slate-500 font-bold italic text-blue-600">Secure clinical document management.</p>
        </div>

        {/* --- SEARCH BAR --- */}
        <div className="relative w-full md:w-96 group">
          <IoSearchOutline className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors" size={20} />
          <input 
            type="text"
            placeholder="Search records by name or type..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-4 bg-white border border-slate-200 rounded-2xl shadow-sm outline-none focus:ring-4 focus:ring-blue-50/50 focus:border-blue-400 transition-all font-bold text-slate-700"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* --- UPLOAD SECTION --- */}
        <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-200 h-fit lg:sticky lg:top-24">
          <h3 className="text-sm font-black uppercase tracking-widest text-blue-600 mb-6">Upload New Record</h3>
          <form onSubmit={handleUpload} className="space-y-4">
            {/* ... (Upload fields remain same as previous version) ... */}
            <div>
              <label className="block text-[10px] font-black uppercase text-slate-400 mb-2 text-left">Document Title</label>
              <input 
                type="text" value={title} onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Blood Test May 2026" required
                className="w-full px-4 py-3 rounded-xl border border-slate-100 bg-slate-50 focus:ring-2 focus:ring-blue-500 outline-none transition-all font-bold"
              />
            </div>
            <div>
              <label className="block text-[10px] font-black uppercase text-slate-400 mb-2 text-left">Category</label>
              <select 
                value={category} onChange={(e) => setCategory(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-100 bg-slate-50 outline-none font-bold text-slate-700"
              >
                {categories.filter(c => c !== 'All').map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
            <div className={`border-2 border-dashed rounded-2xl p-6 text-center transition-all relative ${file ? 'border-emerald-400 bg-emerald-50' : 'border-slate-200 hover:border-blue-400'}`}>
              <input type="file" accept=".pdf,.jpg,.jpeg,.png" onChange={(e) => setFile(e.target.files[0])} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
              <IoCloudUploadOutline size={30} className={`mx-auto mb-2 ${file ? 'text-emerald-500' : 'text-slate-300'}`} />
              <p className="text-[10px] font-bold text-slate-500 uppercase px-2 break-all">{file ? file.name : "Select File (PDF/Image)"}</p>
            </div>
            <button disabled={loading} className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-lg hover:bg-blue-600 transition-all disabled:opacity-50">
              {loading ? "Processing..." : "Save to Vault"}
            </button>
          </form>
        </div>

        {/* --- DOCUMENT LIST --- */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* --- CATEGORY PILLS --- */}
          <div className="flex flex-wrap items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {categories.map(cat => (
              <button
                key={cat}
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

          <div className="space-y-4">
            {filteredRecords.length > 0 ? (
              filteredRecords.map((doc) => (
                <div key={doc._id} className="bg-white p-5 rounded-3xl border border-slate-100 flex items-center justify-between group hover:border-blue-200 hover:shadow-xl hover:shadow-blue-50/50 transition-all">
                  <div className="flex items-center gap-5">
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${doc.fileType?.includes('pdf') ? 'bg-rose-50 text-rose-500' : 'bg-blue-50 text-blue-500'}`}>
                      {doc.fileType?.includes('pdf') ? <IoDocumentTextOutline size={28} /> : <IoImageOutline size={28} />}
                    </div>
                    <div className="text-left">
                      <h4 className="font-black text-slate-800 text-sm">{doc.title}</h4>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="px-2 py-0.5 bg-slate-100 rounded text-[9px] font-black text-slate-500 uppercase">{doc.category}</span>
                        <span className="text-[10px] font-bold text-slate-400 uppercase">{new Date(doc.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <a href={doc.documentUrl} target="_blank" rel="noreferrer" className="p-3 bg-slate-50 text-slate-600 rounded-xl hover:bg-blue-600 hover:text-white transition-all shadow-sm"><IoEyeOutline size={18} /></a>
                    <button onClick={() => handleDelete(doc._id)} className="p-3 bg-slate-50 text-rose-400 rounded-xl hover:bg-rose-600 hover:text-white transition-all shadow-sm"><IoTrashOutline size={18} /></button>
                  </div>
                </div>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center py-24 bg-white rounded-[3rem] border-2 border-dashed border-slate-100 text-slate-300">
                <IoFileTrayOutline size={60} className="mb-4 opacity-20" />
                <p className="font-black uppercase text-[10px] tracking-[0.2em] text-slate-400">
                  {searchQuery || activeFilter !== 'All' ? "No matching records found" : "Vault Currently Empty"}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MedicalVault;