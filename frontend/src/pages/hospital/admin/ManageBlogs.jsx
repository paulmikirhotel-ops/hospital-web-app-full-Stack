import React, { useEffect, useState, useCallback } from 'react';
import { IoPencilOutline, IoTrashOutline, IoEyeOutline, IoDocumentTextOutline, IoCheckmarkCircleOutline, IoTimeOutline } from 'react-icons/io5';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import API from '../../../api/axiosConfig';

const ManageBlogs = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchBlogs = useCallback(async () => {
    try {
      setLoading(true);
      const { data } = await API.get('/blogs');
      const blogData = Array.isArray(data) ? data : data.posts || [];
      setBlogs(blogData);
    } catch (err) {
      console.error('Error fetching blogs:', err);
      toast.error('Failed to load journal archive.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchBlogs(); }, [fetchBlogs]);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this article?')) {
      const loadingToast = toast.loading('Deleting record...');
      try {
        await API.delete(`/blogs/${id}`);
        setBlogs(prev => prev.filter(blog => blog._id !== id));
        toast.success('Record deleted successfully', { id: loadingToast });
      } catch (err) {
        toast.error('Deletion failed. Check admin permissions.', { id: loadingToast });
      }
    }
  };

  // --- STATS ---
  const totalPosts = blogs.length;
  const thisMonth = blogs.filter(b => {
    const postDate = new Date(b.createdAt);
    const now = new Date();
    return postDate.getMonth() === now.getMonth() &&
           postDate.getFullYear() === now.getFullYear();
  }).length;
  const latestPost = blogs[0];

  if (loading) return (
    <div className="p-20 text-center bg-white rounded-[2.5rem] border border-slate-100">
      <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
      <p className="text-slate-400 font-black text-[10px] uppercase tracking-widest">Syncing Archives...</p>
    </div>
  );

  return (
    <div className="space-y-8">

      {/* STATS CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">

        {/* Total Posts */}
        <div className="bg-white rounded-[2rem] p-8 border border-slate-100 shadow-sm flex items-center gap-6">
          <div className="w-14 h-14 rounded-2xl bg-blue-50 flex items-center justify-center flex-shrink-0">
            <IoDocumentTextOutline size={24} className="text-blue-600" />
          </div>
          <div>
            <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-1">Total Articles</p>
            <p className="text-4xl font-black text-slate-900">{totalPosts}</p>
          </div>
        </div>

        {/* This Month */}
        <div className="bg-white rounded-[2rem] p-8 border border-slate-100 shadow-sm flex items-center gap-6">
          <div className="w-14 h-14 rounded-2xl bg-emerald-50 flex items-center justify-center flex-shrink-0">
            <IoCheckmarkCircleOutline size={24} className="text-emerald-600" />
          </div>
          <div>
            <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-1">Published This Month</p>
            <p className="text-4xl font-black text-slate-900">{thisMonth}</p>
          </div>
        </div>

        {/* Latest Post */}
        <div className="bg-white rounded-[2rem] p-8 border border-slate-100 shadow-sm flex items-center gap-6">
          <div className="w-14 h-14 rounded-2xl bg-amber-50 flex items-center justify-center flex-shrink-0">
            <IoTimeOutline size={24} className="text-amber-500" />
          </div>
          <div className="overflow-hidden">
            <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-1">Latest Article</p>
            <p className="text-sm font-black text-slate-900 truncate">
              {latestPost?.title || 'No posts yet'}
            </p>
            {latestPost && (
              <p className="text-[9px] text-slate-400 mt-1">
                {new Date(latestPost.createdAt).toLocaleDateString('en-US', {
                  month: 'short', day: 'numeric', year: 'numeric'
                })}
              </p>
            )}
          </div>
        </div>

      </div>

      {/* TABLE */}
      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-8 border-b border-slate-50 flex justify-between items-center">
          <div>
            <h3 className="text-xl font-black text-slate-900 tracking-tighter uppercase">Journal Archive</h3>
            <p className="text-xs text-slate-400 font-medium mt-1">Manage public health articles and clinical news.</p>
          </div>
          <button
            onClick={() => navigate('/admin/post-blog')}
            className="px-6 py-3 bg-blue-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-900 transition-all"
          >
            + New Article
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50/50">
              <tr>
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Article</th>
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Category</th>
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Published</th>
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {blogs.length > 0 ? blogs.map((blog) => (
                <tr key={blog._id} className="hover:bg-slate-50/50 transition-colors group">

                  {/* ARTICLE */}
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 flex-shrink-0 rounded-xl overflow-hidden bg-slate-100 border border-slate-100">
                        <img
                          src={blog.coverImg || 'https://via.placeholder.com/150'}
                          className="w-full h-full object-cover"
                          alt="Thumbnail"
                        />
                      </div>
                      <div className="max-w-[220px]">
                        <p className="font-black text-slate-900 truncate text-sm" title={blog.title}>
                          {blog.title || 'Untitled Post'}
                        </p>
                        <p className="text-[10px] text-blue-600 font-black uppercase tracking-tight mt-1">
                          Dr. {blog.author?.name || 'Medical Staff'}
                        </p>
                        {blog.description && (
                          <p className="text-[10px] text-slate-400 mt-1 line-clamp-1 italic">
                            {blog.description}
                          </p>
                        )}
                      </div>
                    </div>
                  </td>

                  {/* CATEGORY */}
                  <td className="px-8 py-5">
                    <span className="text-[10px] font-black text-slate-600 bg-slate-100 px-3 py-1.5 rounded-lg uppercase tracking-wide">
                      {blog.category || 'General'}
                    </span>
                  </td>

                  {/* DATE */}
                  <td className="px-8 py-5">
                    <span className="text-xs text-slate-400 font-bold">
                      {blog.createdAt
                        ? new Date(blog.createdAt).toLocaleDateString('en-US', {
                            month: 'short', day: 'numeric', year: 'numeric'
                          })
                        : 'N/A'}
                    </span>
                  </td>

                  {/* ACTIONS */}
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
                        className="p-2.5 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-xl transition-all"
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
              )) : (
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
    </div>
  );
};

export default ManageBlogs;