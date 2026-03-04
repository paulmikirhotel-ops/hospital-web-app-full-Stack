import React, { useEffect, useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { 
  IoAddOutline, IoTrashOutline, IoCloudUploadOutline, 
  IoCheckmarkCircle, IoCloseOutline, IoCreateOutline 
} from 'react-icons/io5';

const AdminServices = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState(null); // Tracks if we are editing
  const [file, setFile] = useState(null);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    isAvailable: true
  });

  // --- 1. FETCH (READ) ---
  const fetchServices = async () => {
    try {
      const { data } = await axios.get('http://localhost:5001/api/services/list');
      if (data.success) setServices(data.services);
    } catch (err) {
      toast.error("Failed to load services");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchServices(); }, []);

  // --- 2. CREATE & UPDATE (SAVE) ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const data = new FormData();
    data.append('title', formData.title);
    data.append('description', formData.description);
    data.append('isAvailable', formData.isAvailable);
    if (file) data.append('image', file);

    try {
      let res;
      if (editId) {
        // UPDATE Logic
        res = await axios.put(`http://localhost:5001/api/services/update/${editId}`, data, {
          headers: { 'Content-Type': 'multipart/form-data' },
          withCredentials: true 
        });
      } else {
        // CREATE Logic
        if (!file) return toast.error("Please upload an icon");
        res = await axios.post('http://localhost:5001/api/services/add', data, {
          headers: { 'Content-Type': 'multipart/form-data' },
          withCredentials: true 
        });
      }

      if (res.data.success) {
        toast.success(editId ? "Service updated!" : "Service added!");
        closeModal();
        fetchServices();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Operation failed");
    }
  };

  // --- 3. DELETE ---
  const handleDelete = async (id) => {
    if (window.confirm("Permanently delete this department?")) {
      try {
        const { data } = await axios.delete(`http://localhost:5001/api/services/delete/${id}`, {
          withCredentials: true
        });
        if (data.success) {
          toast.success("Service removed");
          fetchServices();
        }
      } catch (err) {
        toast.error("Delete failed");
      }
    }
  };

  // --- 4. TOGGLE STATUS (PATCH) ---
  const handleToggleStatus = async (id) => {
    try {
      const { data } = await axios.patch(`http://localhost:5001/api/services/toggle-status/${id}`, {}, { withCredentials: true });
      if (data.success) {
        toast.success(`Service is now ${data.isAvailable ? 'Active' : 'Hidden'}`);
        fetchServices();
      }
    } catch (err) { toast.error("Update failed"); }
  };

  // --- HELPERS ---
  const openEditModal = (service) => {
    setEditId(service._id);
    setFormData({
      title: service.title,
      description: service.description,
      isAvailable: service.isAvailable
    });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditId(null);
    setFormData({ title: '', description: '', isAvailable: true });
    setFile(null);
  };

  if (loading) return <div className="p-20 text-center font-black text-blue-600 animate-pulse">SYNCING DEPARTMENTS...</div>;

  return (
    <div className="p-4 md:p-8 bg-white rounded-[3rem] shadow-sm border border-slate-100 min-h-screen">
      
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight italic uppercase">Clinical Services</h2>
          <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] mt-2 italic">Infrastructure Management</p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-blue-600 text-white px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-900 transition-all shadow-xl shadow-blue-100"
        >
          <IoAddOutline size={20} /> Add New Department
        </button>
      </div>

      {/* LISTING */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.map((service) => (
          <div key={service._id} className="bg-slate-50/50 rounded-[2.5rem] p-8 border border-transparent hover:border-blue-100 hover:bg-white transition-all group relative">
            <div className="flex justify-between items-start mb-6">
              <div className="w-16 h-16 rounded-2xl bg-white shadow-sm flex items-center justify-center p-3">
                <img src={service.image} className="w-full h-full object-contain" alt="" />
              </div>
              <div className="flex gap-2">
                <button onClick={() => openEditModal(service)} className="p-2 bg-white rounded-lg text-slate-400 hover:text-blue-600 border border-slate-100 shadow-sm"><IoCreateOutline size={16}/></button>
                <button onClick={() => handleDelete(service._id)} className="p-2 bg-white rounded-lg text-slate-400 hover:text-red-600 border border-slate-100 shadow-sm"><IoTrashOutline size={16}/></button>
              </div>
            </div>

            <h3 className="text-xl font-black text-slate-900 mb-2">{service.title}</h3>
            <p className="text-xs text-slate-500 font-medium leading-relaxed mb-6 line-clamp-3 italic">"{service.description}"</p>

            <button 
              onClick={() => handleToggleStatus(service._id)}
              className={`w-full py-3 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${service.isAvailable ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-amber-50 text-amber-600 border border-amber-100'}`}
            >
              {service.isAvailable ? 'Status: Active' : 'Status: Hidden'}
            </button>
          </div>
        ))}
      </div>

      {/* DUAL PURPOSE MODAL (CREATE/UPDATE) */}
      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 backdrop-blur-md p-4">
          <div className="bg-white w-full max-w-xl rounded-[3.5rem] p-10 shadow-2xl relative">
            <button onClick={closeModal} className="absolute top-8 right-8 text-slate-400 hover:text-slate-900"><IoCloseOutline size={30} /></button>

            <h3 className="text-3xl font-black text-slate-900 mb-2 tracking-tight">{editId ? 'Edit Dept' : 'New Dept'}</h3>
            <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-10">Department Configuration</p>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="group relative">
                <input type="file" accept="image/*" id="fileInput" className="hidden" onChange={(e) => setFile(e.target.files[0])} />
                <label htmlFor="fileInput" className="w-full flex flex-col items-center justify-center py-8 border-2 border-dashed border-slate-200 rounded-[2rem] cursor-pointer hover:border-blue-400 hover:bg-blue-50/30 transition-all">
                  {file ? <span className="text-xs font-black text-emerald-600 uppercase">{file.name}</span> : <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Update Department Icon</span>}
                </label>
              </div>

              <div>
                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Title</label>
                <input type="text" required value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} className="w-full mt-2 p-5 bg-slate-50 rounded-2xl border-none font-bold text-slate-700 focus:ring-2 focus:ring-blue-100 outline-none" />
              </div>

              <div>
                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Description</label>
                <textarea rows="3" required value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} className="w-full mt-2 p-5 bg-slate-50 rounded-2xl border-none font-bold text-slate-700 focus:ring-2 focus:ring-blue-100 outline-none" />
              </div>

              <button type="submit" className="w-full py-6 bg-slate-900 text-white rounded-[2rem] font-black text-[10px] uppercase tracking-[0.2em] shadow-xl hover:bg-blue-600 transition-all">
                {editId ? 'Save Changes' : 'Initialize Department'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminServices;