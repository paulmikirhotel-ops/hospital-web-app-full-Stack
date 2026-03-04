import React, { useEffect, useState, useCallback } from 'react';
import { IoPencilOutline, IoTrashOutline, IoEyeOutline } from 'react-icons/io5';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import API from '../../../api/axiosConfig'; // Use your centralized API config

const ManageBlogs = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // --- FETCH DATA ---
  const fetchBlogs = useCallback(async () => {
    try {
      setLoading(true);
      const { data } = await API.get('/blogs');
      
      // 🚀 THE FIX: Ensure we extract the array correctly 
      // Handles both [{}, {}] and { success: true, blogs: [] } structures
      const blogData = Array.isArray(data) ? data : data.blogs || [];
      setBlogs(blogData);
    } catch (err) {
      console.error("Error fetching blogs:", err);
      toast.error("Failed to load journal archive.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBlogs();
  }, [fetchBlogs]);

  // --- DELETE LOGIC ---
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this clinical record?")) {
      const loadingToast = toast.loading("Deleting record...");
      try {
        await API.delete(`/blogs/${id}`);
        setBlogs(prev => prev.filter(blog => blog._id !== id));
        toast.success("Record deleted successfully", { id: loadingToast });
      } catch (err) {
        toast.error("Deletion failed. Check admin permissions.", { id: loadingToast });
      }
    }
  };

  if (loading) return (
    <div className="p-20 text-center bg-white rounded-[2.5rem] border border-slate-100">
      <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
      <p className="text-slate-400 font-black text-[10px] uppercase tracking-widest">Syncing Archives...</p>
    </div>
  );

  return (
    <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
      <div className="p-8 border-b border-slate-50 flex justify-between items-center">
        <div>
          <h3 className="text-xl font-black text-slate-900 tracking-tighter uppercase">Journal Archive</h3>
          <p className="text-xs text-slate-400 font-medium">Manage public health articles and clinical news.</p>
        </div>
        <span className="bg-blue-600 text-white px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider">
          {blogs?.length || 0} Total Posts
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-slate-50/50">
            <tr>
              <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Article Details</th>
              <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Category</th>
              <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Release Date</th>
              <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {blogs.length > 0 ? (
              blogs.map((blog) => (
                <tr key={blog._id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-4">
                      <div className="relative w-12 h-12 flex-shrink-0">
                        <img 
                          src={blog.coverImg || 'https://via.placeholder.com/150'} 
                          className="w-full h-full rounded-xl object-cover border border-slate-100 shadow-sm" 
                          alt="Thumbnail" 
                        />
                      </div>
                      <div className="max-w-[200px] md:max-w-xs">
                        {/* 🚀 SAFETY: Optional chaining on title */}
                        <p className="font-bold text-slate-900 truncate" title={blog.title}>
                          {blog.title || "Untitled Post"}
                        </p>
                        <p className="text-[10px] text-blue-600 font-black uppercase tracking-tight">
                          By Dr. {blog.author?.name || "Staff Physician"}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <span className="text-xs font-bold text-slate-600 bg-slate-100 px-3 py-1 rounded-lg">
                      {blog.category || "General"}
                    </span>
                  </td>
                  <td className="px-8 py-5">
                    <span className="text-xs text-slate-400 font-medium">
                      {blog.createdAt ? new Date(blog.createdAt).toLocaleDateString() : "N/A"}
                    </span>
                  </td>
                  <td className="px-8 py-5">
                    <div className="flex justify-end gap-2">
                      <button 
                        onClick={() => navigate(`/blog/${blog._id}`)}
                        className="p-2.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all"
                        title="View Publicly"
                      >
                        <IoEyeOutline size={18} />
                      </button>
                      <button 
                        onClick={() => navigate(`/admin/edit-blog/${blog._id}`)}
                        className="p-2.5 text-slate-400 hover:text-green-600 hover:bg-green-50 rounded-xl transition-all"
                        title="Edit"
                      >
                        <IoPencilOutline size={18} />
                      </button>
                      <button 
                        onClick={() => handleDelete(blog._id)}
                        className="p-2.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
                        title="Delete"
                      >
                        <IoTrashOutline size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="px-8 py-20 text-center text-slate-400 font-medium italic">
                  No records found in the archive.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageBlogs;