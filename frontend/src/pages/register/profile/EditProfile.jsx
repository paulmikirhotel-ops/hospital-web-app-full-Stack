import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateUser, clearError } from '../../../redux/features/auth/authSlice';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import {
  IoPersonOutline, IoCloudUploadOutline, IoSaveOutline,
  IoArrowBack, IoCloseCircleOutline, IoImageOutline,
} from 'react-icons/io5';

const EditProfile = () => {
  const dispatch  = useDispatch();
  const navigate  = useNavigate();
  const { user, loading } = useSelector(state => state.auth);
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    name:    user?.name    || '',
    email:   user?.email   || '',
    bio:     user?.bio     || '',
    phone:   user?.phone   || '',
    address: user?.address || '',
    gender:  user?.gender  || '',
    dob:     user?.dob ? user.dob.substring(0, 10) : '',
  });

  const [imageFile,    setImageFile]    = useState(null);
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
      toast.success('Profile updated!');
      navigate('/profile');
    } else {
      toast.error(result.payload || 'Failed to update profile');
    }
  };

  const inputStyle = {
    width: '100%', padding: '14px 16px',
    background: '#f8fafc', border: '1.5px solid #e2e8f0',
    borderRadius: 16, outline: 'none',
    fontSize: 15, fontWeight: 600, color: '#0f172a',
    fontFamily: 'inherit', boxSizing: 'border-box',
    transition: 'border-color 0.2s, box-shadow 0.2s',
  };
  const labelStyle = {
    display: 'block', fontSize: 10, fontWeight: 900,
    textTransform: 'uppercase', letterSpacing: '0.18em',
    color: '#94a3b8', marginBottom: 8,
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc', paddingTop: 'clamp(88px,12vw,120px)', paddingBottom: 'clamp(40px,6vw,80px)', padding: 'clamp(88px,12vw,120px) clamp(14px,4vw,24px) clamp(40px,6vw,80px)' }}>
      <style>{`
        .ep-input:focus { border-color: #3b82f6 !important; box-shadow: 0 0 0 4px rgba(59,130,246,0.1) !important; }
        .ep-input:disabled { background: #f1f5f9 !important; color: #94a3b8 !important; cursor: not-allowed !important; }
        .ep-select { appearance: none; cursor: pointer; }
        .ep-card { max-width: 640px; margin: 0 auto; background: #fff; border-radius: clamp(24px,4vw,48px); padding: clamp(24px,5vw,40px); box-shadow: 0 4px 20px rgba(0,0,0,0.06); border: 1px solid #f1f5f9; }
        .ep-photo-overlay { position: absolute; inset: 0; background: rgba(0,0,0,0.45); opacity: 0; transition: opacity 0.2s; border-radius: clamp(16px,3vw,28px); display: flex; align-items: center; justify-content: center; gap: 8px; }
        .ep-photo-wrap:hover .ep-photo-overlay { opacity: 1; }
        .ep-overlay-btn { padding: 8px; background: #fff; border: none; border-radius: 10px; cursor: pointer; display: flex; align-items: center; color: #0f172a; transition: all 0.2s; }
        .ep-overlay-btn:hover { background: #2563eb; color: #fff; }
        .ep-submit { width: 100%; padding: 15px; background: #2563eb; color: #fff; border: none; border-radius: 16px; font-size: 13px; font-weight: 900; text-transform: uppercase; letter-spacing: 0.15em; cursor: pointer; transition: all 0.2s; display: flex; align-items: center; justify-content: center; gap: 10px; font-family: inherit; }
        .ep-submit:hover:not(:disabled) { background: #0f172a; }
        .ep-submit:disabled { opacity: 0.55; cursor: not-allowed; }
      `}</style>

      {/* Header */}
      <div style={{ maxWidth: 640, margin: '0 auto clamp(20px,3vw,32px)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <button
            onClick={() => navigate('/profile')}
            style={{ width: 42, height: 42, borderRadius: 14, background: '#fff', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#475569', flexShrink: 0, transition: 'all 0.2s', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}
            onMouseEnter={e => { e.currentTarget.style.background = '#2563eb'; e.currentTarget.style.color = '#fff'; e.currentTarget.style.borderColor = '#2563eb'; }}
            onMouseLeave={e => { e.currentTarget.style.background = '#fff'; e.currentTarget.style.color = '#475569'; e.currentTarget.style.borderColor = '#e2e8f0'; }}
          >
            <IoArrowBack size={18} />
          </button>
          <div>
            <h2 style={{ fontSize: 'clamp(1.4rem,3.5vw,2rem)', fontWeight: 900, color: '#0f172a', letterSpacing: '-0.03em', margin: 0 }}>Edit Profile</h2>
            <p style={{ fontSize: 10, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.2em', color: '#94a3b8', marginTop: 4, marginBottom: 0 }}>Update your personal information</p>
          </div>
        </div>
      </div>

      <div className="ep-card">

        {/* Photo uploader */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 'clamp(24px,4vw,36px)' }}>
          <div className="ep-photo-wrap" style={{ position: 'relative', marginBottom: 14 }}>
            <div style={{ width: 'clamp(88px,14vw,112px)', height: 'clamp(88px,14vw,112px)', borderRadius: 'clamp(16px,3vw,28px)', overflow: 'hidden', border: '4px solid #f1f5f9', boxShadow: '0 8px 28px rgba(0,0,0,0.1)' }}>
              {imagePreview ? (
                <img src={imagePreview} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                <div style={{ width: '100%', height: '100%', background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <IoPersonOutline size={36} style={{ color: '#cbd5e1' }} />
                </div>
              )}
            </div>
            <div className="ep-photo-overlay">
              <button type="button" className="ep-overlay-btn" onClick={() => fileInputRef.current.click()}>
                <IoImageOutline size={16} />
              </button>
              {imageFile && (
                <button type="button" className="ep-overlay-btn" onClick={removeImage}
                  style={{ color: '#ef4444' }}
                  onMouseEnter={e => { e.currentTarget.style.background = '#ef4444'; e.currentTarget.style.color = '#fff'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = '#fff'; e.currentTarget.style.color = '#ef4444'; }}>
                  <IoCloseCircleOutline size={16} />
                </button>
              )}
            </div>
          </div>

          <input ref={fileInputRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleImageSelect} />

          <button type="button" onClick={() => fileInputRef.current.click()}
            style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '9px 20px', background: '#f8fafc', border: '1.5px solid #e2e8f0', borderRadius: 14, fontSize: 10, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.15em', color: '#64748b', cursor: 'pointer', transition: 'all 0.2s' }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = '#2563eb'; e.currentTarget.style.color = '#2563eb'; e.currentTarget.style.background = '#eff6ff'; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = '#e2e8f0'; e.currentTarget.style.color = '#64748b'; e.currentTarget.style.background = '#f8fafc'; }}>
            <IoCloudUploadOutline size={15} />
            {imageFile ? 'Change Photo' : 'Upload Photo'}
          </button>

          {imageFile && (
            <p style={{ fontSize: 10, color: '#16a34a', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.15em', marginTop: 8 }}>✓ New photo selected</p>
          )}
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>

          {/* Full Name */}
          <div>
            <label style={labelStyle}>Full Name</label>
            <input type="text" name="name" value={formData.name} onChange={handleChange}
              className="ep-input" style={inputStyle} />
          </div>

          {/* Email — read only */}
          <div>
            <label style={labelStyle}>
              Email Address <span style={{ fontWeight: 500, textTransform: 'none', color: '#cbd5e1' }}>(cannot be changed)</span>
            </label>
            <input type="email" value={formData.email} disabled
              className="ep-input" style={{ ...inputStyle, background: '#f1f5f9', color: '#94a3b8' }} />
          </div>

          {/* Phone */}
          <div>
            <label style={labelStyle}>Phone Number</label>
            <input type="text" name="phone" value={formData.phone} onChange={handleChange}
              className="ep-input" style={inputStyle} placeholder="+231 000 000 000" />
          </div>

          {/* Gender */}
          <div>
            <label style={labelStyle}>Gender</label>
            <select name="gender" value={formData.gender} onChange={handleChange}
              className="ep-input ep-select" style={inputStyle}>
              <option value="">Select gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
              <option value="Prefer not to say">Prefer not to say</option>
            </select>
          </div>

          {/* Date of Birth */}
          <div>
            <label style={labelStyle}>Date of Birth</label>
            <input type="date" name="dob" value={formData.dob} onChange={handleChange}
              className="ep-input" style={inputStyle} />
          </div>

          {/* Address */}
          <div>
            <label style={labelStyle}>Address</label>
            <input type="text" name="address" value={formData.address} onChange={handleChange}
              className="ep-input" style={inputStyle} placeholder="Your address" />
          </div>

          {/* Bio */}
          <div>
            <label style={labelStyle}>Bio / Professional Summary</label>
            <textarea name="bio" value={formData.bio} onChange={handleChange} rows={4}
              placeholder="Tell us about yourself..."
              className="ep-input"
              style={{ ...inputStyle, resize: 'none', lineHeight: 1.65 }} />
          </div>

          {/* Submit */}
          <button type="submit" disabled={loading} className="ep-submit">
            <IoSaveOutline size={17} />
            {loading ? 'Saving Changes…' : 'Update Profile'}
          </button>

        </form>
      </div>
    </div>
  );
};

export default EditProfile;