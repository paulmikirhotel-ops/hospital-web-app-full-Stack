import { useState, useEffect } from 'react';
import API from '../../../api/axiosConfig'; // ✅ Use your existing axios instance

const API_URL = '/settings'; // ✅ Base path, axiosConfig handles the rest
const tabs = ['Profile', 'Hospital', 'Users', 'Notifications'];

export default function AdminSettings() {
  const [activeTab, setActiveTab] = useState('Profile');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });

  const [profile, setProfile] = useState({ name: '', email: '' });
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState('');
  const [passwords, setPasswords] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });

  const [site, setSite] = useState({ hospitalName: '', email: '', phone: '', address: '', website: '' });
  const [logoFile, setLogoFile] = useState(null);
  const [logoPreview, setLogoPreview] = useState('');

  const [users, setUsers] = useState([]);

  const [notifications, setNotifications] = useState({
    emailOnAppointment: true,
    emailOnNewUser: true,
    emailOnPayment: true,
    smsAlerts: false,
    pushAlerts: false,
  });

  const notify = (text, type = 'success') => {
    setMessage({ text, type });
    setTimeout(() => setMessage({ text: '', type: '' }), 4000);
  };

  useEffect(() => {
    if (activeTab === 'Profile')       fetchProfile();
    if (activeTab === 'Hospital')      fetchSite();
    if (activeTab === 'Users')         fetchUsers();
    if (activeTab === 'Notifications') fetchNotifications();
  }, [activeTab]);

  // ✅ All requests use API (axiosConfig) — cookie sent automatically, no manual token needed
  const fetchProfile = async () => {
    try {
      const { data } = await API.get(API_URL + '/profile');
      if (data.success) {
        setProfile({ name: data.user.name, email: data.user.email });
        setAvatarPreview(data.user.avatar || '');
      }
    } catch (err) { notify(err.response?.data?.message || 'Failed to load profile', 'error'); }
  };

  const fetchSite = async () => {
    try {
      const { data } = await API.get(API_URL + '/site');
      if (data.success) {
        setSite(data.settings);
        setLogoPreview(data.settings.logo || '');
      }
    } catch (err) { notify(err.response?.data?.message || 'Failed to load site settings', 'error'); }
  };

  const fetchUsers = async () => {
    try {
      const { data } = await API.get(API_URL + '/users');
      if (data.success) setUsers(data.users);
    } catch (err) { notify(err.response?.data?.message || 'Failed to load users', 'error'); }
  };

  const fetchNotifications = async () => {
    try {
      const { data } = await API.get(API_URL + '/notifications');
      if (data.success) setNotifications(data.notifications);
    } catch (err) { notify(err.response?.data?.message || 'Failed to load notifications', 'error'); }
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) { setAvatarFile(file); setAvatarPreview(URL.createObjectURL(file)); }
  };

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) { setLogoFile(file); setLogoPreview(URL.createObjectURL(file)); }
  };

  const saveProfile = async () => {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('name', profile.name);
      formData.append('email', profile.email);
      if (avatarFile) formData.append('avatar', avatarFile);
      const { data } = await API.put(API_URL + '/profile', formData);
      if (data.success) notify('Profile updated successfully');
    } catch (err) { notify(err.response?.data?.message || 'Failed to update profile', 'error'); }
    setLoading(false);
  };

  const changePassword = async () => {
    if (passwords.newPassword !== passwords.confirmPassword)
      return notify('New passwords do not match', 'error');
    setLoading(true);
    try {
      const { data } = await API.put(API_URL + '/change-password', {
        currentPassword: passwords.currentPassword,
        newPassword: passwords.newPassword,
      });
      if (data.success) {
        notify('Password changed successfully');
        setPasswords({ currentPassword: '', newPassword: '', confirmPassword: '' });
      }
    } catch (err) { notify(err.response?.data?.message || 'Failed to change password', 'error'); }
    setLoading(false);
  };

  const saveSite = async () => {
    setLoading(true);
    try {
      const formData = new FormData();
      Object.entries(site).forEach(([k, v]) => { if (v) formData.append(k, v); });
      if (logoFile) formData.append('logo', logoFile);
      const { data } = await API.put(API_URL + '/site', formData);
      if (data.success) notify('Hospital settings updated');
    } catch (err) { notify(err.response?.data?.message || 'Failed to update settings', 'error'); }
    setLoading(false);
  };

  const changeRole = async (userId, role) => {
    try {
      const { data } = await API.put(`${API_URL}/users/${userId}/role`, { role });
      if (data.success) { notify('Role updated'); fetchUsers(); }
    } catch (err) { notify(err.response?.data?.message || 'Failed to update role', 'error'); }
  };

  const deleteUser = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    try {
      const { data } = await API.delete(`${API_URL}/users/${userId}`);
      if (data.success) { notify('User deleted'); fetchUsers(); }
    } catch (err) { notify(err.response?.data?.message || 'Failed to delete user', 'error'); }
  };

  const saveNotifications = async () => {
    setLoading(true);
    try {
      const { data } = await API.put(API_URL + '/notifications', notifications);
      if (data.success) notify('Notification preferences saved');
    } catch (err) { notify(err.response?.data?.message || 'Failed to save notifications', 'error'); }
    setLoading(false);
  };

  const roleBadge = (role) => {
    const colors = { admin: '#ef4444', doctor: '#3b82f6', patient: '#10b981', user: '#f59e0b' };
    return (
      <span style={{ background: colors[role] || '#6b7280', color: '#fff', padding: '2px 10px', borderRadius: 20, fontSize: 12, fontWeight: 600, textTransform: 'capitalize' }}>
        {role}
      </span>
    );
  };

  const Input = ({ label, value, onChange, type = 'text' }) => (
    <div style={{ marginBottom: 18 }}>
      <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 6 }}>{label}</label>
      <input
        type={type} value={value} onChange={e => onChange(e.target.value)}
        style={{ width: '100%', padding: '10px 14px', borderRadius: 8, border: '1.5px solid #e5e7eb', fontSize: 14, outline: 'none', boxSizing: 'border-box', background: '#fafafa' }}
        onFocus={e => e.target.style.borderColor = '#6366f1'}
        onBlur={e => e.target.style.borderColor = '#e5e7eb'}
      />
    </div>
  );

  const SaveBtn = ({ onClick, label = 'Save Changes' }) => (
    <button onClick={onClick} disabled={loading} style={{ background: loading ? '#a5b4fc' : '#6366f1', color: '#fff', border: 'none', borderRadius: 8, padding: '10px 24px', fontWeight: 700, fontSize: 14, cursor: loading ? 'not-allowed' : 'pointer' }}>
      {loading ? 'Saving...' : label}
    </button>
  );

  const Toggle = ({ label, checked, onChange }) => (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 0', borderBottom: '1px solid #f3f4f6' }}>
      <span style={{ fontSize: 14, color: '#374151' }}>{label}</span>
      <div onClick={() => onChange(!checked)} style={{ width: 44, height: 24, borderRadius: 12, cursor: 'pointer', background: checked ? '#6366f1' : '#d1d5db', position: 'relative', transition: 'background 0.2s' }}>
        <div style={{ width: 18, height: 18, borderRadius: '50%', background: '#fff', position: 'absolute', top: 3, left: checked ? 23 : 3, transition: 'left 0.2s', boxShadow: '0 1px 4px rgba(0,0,0,0.2)' }} />
      </div>
    </div>
  );

  return (
    <div style={{ fontFamily: "'Segoe UI', sans-serif", padding: 32, maxWidth: 900, margin: '0 auto' }}>
      <h1 style={{ fontSize: 26, fontWeight: 800, color: '#111827', margin: '0 0 6px' }}>Admin Settings</h1>
      <p style={{ color: '#6b7280', fontSize: 14, margin: '0 0 28px' }}>Manage your hospital system preferences</p>

      {message.text && (
        <div style={{ padding: '12px 18px', borderRadius: 8, marginBottom: 20, fontSize: 14, fontWeight: 500, background: message.type === 'error' ? '#fef2f2' : '#f0fdf4', color: message.type === 'error' ? '#dc2626' : '#16a34a', border: `1px solid ${message.type === 'error' ? '#fecaca' : '#bbf7d0'}` }}>
          {message.text}
        </div>
      )}

      <div style={{ display: 'flex', gap: 4, marginBottom: 28, borderBottom: '2px solid #e5e7eb' }}>
        {tabs.map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)} style={{ padding: '10px 20px', border: 'none', background: 'none', cursor: 'pointer', fontWeight: 600, fontSize: 14, color: activeTab === tab ? '#6366f1' : '#6b7280', borderBottom: activeTab === tab ? '2px solid #6366f1' : '2px solid transparent', marginBottom: -2, transition: 'all 0.2s' }}>
            {tab}
          </button>
        ))}
      </div>

      {/* PROFILE */}
      {activeTab === 'Profile' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
          <div style={{ background: '#fff', borderRadius: 12, padding: 24, boxShadow: '0 1px 4px rgba(0,0,0,0.07)' }}>
            <h2 style={{ fontSize: 16, fontWeight: 700, marginBottom: 20, color: '#111827' }}>Profile Information</h2>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24 }}>
              <img src={avatarPreview || `https://ui-avatars.com/api/?name=${profile.name}&background=6366f1&color=fff&size=80`} alt="avatar" style={{ width: 72, height: 72, borderRadius: '50%', objectFit: 'cover', border: '3px solid #e0e7ff' }} />
              <label style={{ cursor: 'pointer', background: '#f3f4f6', padding: '8px 14px', borderRadius: 8, fontSize: 13, fontWeight: 600, color: '#374151' }}>
                Change Photo
                <input type="file" accept="image/*" onChange={handleAvatarChange} style={{ display: 'none' }} />
              </label>
            </div>
            <Input label="Full Name" value={profile.name} onChange={v => setProfile(p => ({ ...p, name: v }))} />
            <Input label="Email Address" value={profile.email} onChange={v => setProfile(p => ({ ...p, email: v }))} type="email" />
            <SaveBtn onClick={saveProfile} />
          </div>

          <div style={{ background: '#fff', borderRadius: 12, padding: 24, boxShadow: '0 1px 4px rgba(0,0,0,0.07)' }}>
            <h2 style={{ fontSize: 16, fontWeight: 700, marginBottom: 20, color: '#111827' }}>Change Password</h2>
            <Input label="Current Password" value={passwords.currentPassword} onChange={v => setPasswords(p => ({ ...p, currentPassword: v }))} type="password" />
            <Input label="New Password" value={passwords.newPassword} onChange={v => setPasswords(p => ({ ...p, newPassword: v }))} type="password" />
            <Input label="Confirm New Password" value={passwords.confirmPassword} onChange={v => setPasswords(p => ({ ...p, confirmPassword: v }))} type="password" />
            <SaveBtn onClick={changePassword} label="Update Password" />
          </div>
        </div>
      )}

      {/* HOSPITAL */}
      {activeTab === 'Hospital' && (
        <div style={{ background: '#fff', borderRadius: 12, padding: 24, boxShadow: '0 1px 4px rgba(0,0,0,0.07)' }}>
          <h2 style={{ fontSize: 16, fontWeight: 700, marginBottom: 20, color: '#111827' }}>Hospital Information</h2>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24 }}>
            {logoPreview
              ? <img src={logoPreview} alt="logo" style={{ width: 80, height: 80, objectFit: 'contain', borderRadius: 8, border: '1px solid #e5e7eb' }} />
              : <div style={{ width: 80, height: 80, borderRadius: 8, background: '#f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#9ca3af', fontSize: 12 }}>No Logo</div>
            }
            <label style={{ cursor: 'pointer', background: '#f3f4f6', padding: '8px 14px', borderRadius: 8, fontSize: 13, fontWeight: 600, color: '#374151' }}>
              Upload Logo
              <input type="file" accept="image/*" onChange={handleLogoChange} style={{ display: 'none' }} />
            </label>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 20px' }}>
            <Input label="Hospital Name" value={site.hospitalName || ''} onChange={v => setSite(s => ({ ...s, hospitalName: v }))} />
            <Input label="Contact Email" value={site.email || ''} onChange={v => setSite(s => ({ ...s, email: v }))} type="email" />
            <Input label="Phone Number" value={site.phone || ''} onChange={v => setSite(s => ({ ...s, phone: v }))} />
            <Input label="Website" value={site.website || ''} onChange={v => setSite(s => ({ ...s, website: v }))} />
          </div>
          <Input label="Address" value={site.address || ''} onChange={v => setSite(s => ({ ...s, address: v }))} />
          <SaveBtn onClick={saveSite} />
        </div>
      )}

      {/* USERS */}
      {activeTab === 'Users' && (
        <div style={{ background: '#fff', borderRadius: 12, padding: 24, boxShadow: '0 1px 4px rgba(0,0,0,0.07)' }}>
          <h2 style={{ fontSize: 16, fontWeight: 700, marginBottom: 20, color: '#111827' }}>User Management</h2>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
              <thead>
                <tr style={{ background: '#f9fafb' }}>
                  {['Name', 'Email', 'Role', 'Joined', 'Actions'].map(h => (
                    <th key={h} style={{ padding: '10px 14px', textAlign: 'left', fontWeight: 700, color: '#374151', borderBottom: '1px solid #e5e7eb' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {users.map(user => (
                  <tr key={user._id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                    <td style={{ padding: '12px 14px', fontWeight: 600, color: '#111827' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <img src={user.avatar || user.image || `https://ui-avatars.com/api/?name=${user.name}&background=6366f1&color=fff&size=32`} alt="" style={{ width: 32, height: 32, borderRadius: '50%', objectFit: 'cover' }} />
                        {user.name}
                      </div>
                    </td>
                    <td style={{ padding: '12px 14px', color: '#6b7280' }}>{user.email}</td>
                    <td style={{ padding: '12px 14px' }}>{roleBadge(user.role)}</td>
                    <td style={{ padding: '12px 14px', color: '#6b7280' }}>{new Date(user.createdAt).toLocaleDateString()}</td>
                    <td style={{ padding: '12px 14px' }}>
                      <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                        <select value={user.role} onChange={e => changeRole(user._id, e.target.value)} style={{ padding: '5px 8px', borderRadius: 6, border: '1px solid #e5e7eb', fontSize: 13, cursor: 'pointer' }}>
                          <option value="user">User</option>
                          <option value="patient">Patient</option>
                          <option value="doctor">Doctor</option>
                          <option value="admin">Admin</option>
                        </select>
                        <button onClick={() => deleteUser(user._id)} style={{ background: '#fef2f2', color: '#dc2626', border: 'none', borderRadius: 6, padding: '5px 10px', cursor: 'pointer', fontWeight: 600, fontSize: 13 }}>
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {users.length === 0 && <p style={{ textAlign: 'center', color: '#9ca3af', padding: 32 }}>No users found</p>}
          </div>
        </div>
      )}

      {/* NOTIFICATIONS */}
      {activeTab === 'Notifications' && (
        <div style={{ background: '#fff', borderRadius: 12, padding: 24, boxShadow: '0 1px 4px rgba(0,0,0,0.07)', maxWidth: 520 }}>
          <h2 style={{ fontSize: 16, fontWeight: 700, marginBottom: 4, color: '#111827' }}>Notification Preferences</h2>
          <p style={{ fontSize: 13, color: '#9ca3af', marginBottom: 20 }}>Control which alerts the system sends out</p>
          <Toggle label="Email on new appointment"       checked={!!notifications.emailOnAppointment} onChange={v => setNotifications(n => ({ ...n, emailOnAppointment: v }))} />
          <Toggle label="Email when new user registers"  checked={!!notifications.emailOnNewUser}     onChange={v => setNotifications(n => ({ ...n, emailOnNewUser: v }))} />
          <Toggle label="Email on payment received"      checked={!!notifications.emailOnPayment}     onChange={v => setNotifications(n => ({ ...n, emailOnPayment: v }))} />
          <Toggle label="SMS alerts"                     checked={!!notifications.smsAlerts}          onChange={v => setNotifications(n => ({ ...n, smsAlerts: v }))} />
          <Toggle label="Push notifications"             checked={!!notifications.pushAlerts}         onChange={v => setNotifications(n => ({ ...n, pushAlerts: v }))} />
          <div style={{ marginTop: 24 }}>
            <SaveBtn onClick={saveNotifications} />
          </div>
        </div>
      )}
    </div>
  );
}