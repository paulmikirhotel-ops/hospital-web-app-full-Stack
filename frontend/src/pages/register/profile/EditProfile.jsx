import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateUser, clearError } from '../../../redux/features/auth/authSlice';
import { toast } from 'react-hot-toast';

const EditProfile = () => {
    const dispatch = useDispatch();
    const { user, loading, error } = useSelector((state) => state.auth);

    // Initial State pre-filled with existing user data
    const [formData, setFormData] = useState({
        name: user?.name || '',
        email: user?.email || '',
        bio: user?.bio || '',
        phone: user?.phone || ''
    });

    // Clear errors when component unmounts
    useEffect(() => {
        return () => dispatch(clearError());
    }, [dispatch]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Trigger the thunk we just added to authSlice
        const result = await dispatch(updateUser(formData));

        if (updateUser.fulfilled.match(result)) {
            toast.success("Profile updated successfully!");
        } else {
            toast.error(result.payload || "Failed to update profile");
        }
    };

    return (
        <div className="max-w-2xl mx-auto mt-10 p-8 bg-white rounded-3xl shadow-sm border border-slate-100">
            <h2 className="text-2xl font-black text-slate-900 mb-6">Edit Your Profile</h2>
            
            <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Full Name</label>
                    <input 
                        type="text" name="name" value={formData.name} onChange={handleChange}
                        className="w-full p-4 bg-slate-50 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                    />
                </div>

                <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Email Address</label>
                    <input 
                        type="email" name="email" value={formData.email} onChange={handleChange}
                        className="w-full p-4 bg-slate-50 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                    />
                </div>

                <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Phone Number</label>
                    <input 
                        type="text" name="phone" value={formData.phone} onChange={handleChange}
                        className="w-full p-4 bg-slate-50 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                    />
                </div>

                <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Bio / Professional Summary</label>
                    <textarea 
                        name="bio" value={formData.bio} onChange={handleChange} rows="4"
                        className="w-full p-4 bg-slate-50 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                    />
                </div>

                <button 
                    disabled={loading}
                    className="w-full py-4 bg-blue-600 text-white rounded-xl font-bold hover:bg-slate-900 transition-all shadow-lg disabled:bg-slate-300"
                >
                    {loading ? 'Saving Changes...' : 'Update Profile'}
                </button>
            </form>
        </div>
    );
};

export default EditProfile;