import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateUser, clearError } from '../../../redux/features/auth/authSlice';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import {
  IoPersonOutline, IoCloudUploadOutline, IoSaveOutline,
  IoArrowBack, IoCloseCircleOutline, IoImageOutline
} from 'react-icons/io5';

const EditProfile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, loading } = useSelector((state) => state.auth);
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    name:    user?.name    || '',
    email:   user?.email   || '',
    bio:     user?.bio     || '',
    phone:   user?.phone   || '',
    address: user?.address || '',
    gender:  user?.gender  || '',
    dob:     user?.dob     ? user.dob.substring(0, 10) : '',
  });

  const [imageFile, setImageFile]       = useState(null);
  const [imagePreview, setImagePreview] = useState(user?.image || '');

  useEffect(() => {
    return () => dispatch(clearError());
  }, [dispatch]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
    if (!allowed.includes(file.type)) return toast.error('Only JPG, PNG or WEBP allowed');
    if (file.size > 5 * 1024 * 1024) return toast.error('Image must be under 5MB');

    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview(user?.image || '');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Build FormData so image file can be sent
    const data = new FormData();
    data.append('name',    formData.name);
    data.append('phone',   formData.phone);
    data.append('bio',     formData.bio);
    data.append('address', formData.address);
    data.append('gender',  formData.gender);
    data.append('dob',     formData.dob);
    if (imageFile) data.append('image', imageFile);

    const result = await dispatch(updateUser(data));

    if (updateUser.fulfilled.match(result)) {
      toast.success('Profile updated successfully!');
      navigate('/profile');
    } else {
      toast.error(result.payload || 'Failed to update profile');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 pt-32 pb-20 px-4">
      <div className="max-w-2xl mx-auto">

        {/* HEADER */}
        <div className="flex items-center gap-4 mb-10">
          <button
            onClick={() => navigate('/profile')}
            className="group p-3 rounded-2xl bg-white border border-slate-100 shadow-sm hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-all"
          >
            <IoArrowBack size={18} />
          </button>
          <div>
            <h2 className="text-3xl font-black text-slate-900 tracking-tighter">Edit Profile</h2>
            <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mt-1">
              Update your personal information
            </p>
          </div>
        </div>

        <div className="bg-white rounded-[3rem] p-10 shadow-sm border border-slate-100">

          {/* PROFILE IMAGE */}
          <div className="flex flex-col items-center mb-10">
            <div className="relative group mb-4">
              <div className="w-28 h-28 rounded-[2rem] overflow-hidden border-4 border-slate-100 shadow-lg">
                {imagePreview ? (
                  <img
                    src={imagePreview}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-slate-100 flex items-center justify-center">
                    <IoPersonOutline size={40} className="text-slate-300" />
                  </div>
                )}
              </div>

              {/* Overlay buttons */}
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-all rounded-[2rem] flex items-center justify-center gap-2">
                <button
                  type="button"
                  onClick={() => fileInputRef.current.click()}
                  className="p-2 bg-white rounded-xl hover:bg-blue-600 hover:text-white transition-all"
                >
                  <IoImageOutline size={16} />
                </button>
                {imageFile && (
                  <button
                    type="button"
                    onClick={removeImage}
                    className="p-2 bg-white rounded-xl hover:bg-red-500 hover:text-white transition-all"
                  >
                    <IoCloseCircleOutline size={16} />
                  </button>
                )}
              </div>
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageSelect}
            />

            <button
              type="button"
              onClick={() => fileInputRef.current.click()}
              className="flex items-center gap-2 px-5 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-500 hover:border-blue-400 hover:text-blue-600 hover:bg-blue-50 transition-all"
            >
              <IoCloudUploadOutline size={16} />
              {imageFile ? 'Change Photo' : 'Upload Photo'}
            </button>

            {imageFile && (
              <p className="text-[9px] text-emerald-500 font-black uppercase tracking-widest mt-2">
                ✓ New photo selected
              </p>
            )}
          </div>

          {/* FORM */}
          <form onSubmit={handleSubmit} className="space-y-5">

            {/* NAME */}
            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">
                Full Name
              </label>
              <input
                type="text" name="name" value={formData.name}
                onChange={handleChange}
                className="w-full p-4 bg-slate-50 rounded-2xl outline-none focus:ring-2 focus:ring-blue-100 font-bold text-slate-700 transition-all"
              />
            </div>

            {/* EMAIL — read only, no backend update for security */}
            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">
                Email Address <span className="text-slate-300 normal-case">(cannot be changed)</span>
              </label>
              <input
                type="email" value={formData.email} disabled
                className="w-full p-4 bg-slate-100 rounded-2xl outline-none font-bold text-slate-400 cursor-not-allowed"
              />
            </div>

            {/* PHONE */}
            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">
                Phone Number
              </label>
              <input
                type="text" name="phone" value={formData.phone}
                onChange={handleChange}
                className="w-full p-4 bg-slate-50 rounded-2xl outline-none focus:ring-2 focus:ring-blue-100 font-bold text-slate-700 transition-all"
              />
            </div>

            {/* GENDER */}
            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">
                Gender
              </label>
              <select
                name="gender" value={formData.gender}
                onChange={handleChange}
                className="w-full p-4 bg-slate-50 rounded-2xl outline-none focus:ring-2 focus:ring-blue-100 font-bold text-slate-700 transition-all appearance-none cursor-pointer"
              >
                <option value="">Select gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
                <option value="Prefer not to say">Prefer not to say</option>
              </select>
            </div>

            {/* DATE OF BIRTH */}
            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">
                Date of Birth
              </label>
              <input
                type="date" name="dob" value={formData.dob}
                onChange={handleChange}
                className="w-full p-4 bg-slate-50 rounded-2xl outline-none focus:ring-2 focus:ring-blue-100 font-bold text-slate-700 transition-all"
              />
            </div>

            {/* ADDRESS */}
            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">
                Address
              </label>
              <input
                type="text" name="address" value={formData.address}
                onChange={handleChange}
                className="w-full p-4 bg-slate-50 rounded-2xl outline-none focus:ring-2 focus:ring-blue-100 font-bold text-slate-700 transition-all"
              />
            </div>

            {/* BIO */}
            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">
                Bio / Professional Summary
              </label>
              <textarea
                name="bio" value={formData.bio}
                onChange={handleChange} rows="4"
                placeholder="Tell us about yourself..."
                className="w-full p-4 bg-slate-50 rounded-2xl outline-none focus:ring-2 focus:ring-blue-100 font-bold text-slate-700 transition-all resize-none"
              />
            </div>

            {/* SUBMIT */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-5 bg-blue-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-900 transition-all shadow-xl shadow-blue-100 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
            >
              <IoSaveOutline size={18} />
              {loading ? 'Saving Changes...' : 'Update Profile'}
            </button>

          </form>
        </div>
      </div>
    </div>
  );
};

export default EditProfile;