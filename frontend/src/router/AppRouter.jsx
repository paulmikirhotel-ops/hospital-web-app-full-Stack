import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from '../components/ProtectedRoute';

// --- PAGE IMPORTS ---
import Home from '../pages/Home';
import Login from '../pages/login/Login';
import Register from '../pages/register/Register';
import About from '../pages/hospital/About';
import Appointment from '../pages/hospital/Appointment';
import Services from '../pages/hospital/Services';
import Testimony from '../pages/hospital/Testimony';
import Doctors from '../pages/hospital/Doctors';
import Contact from '../pages/hospital/Contact';
import DoctorProfile from '../pages/hospital/DoctorProfile';
import MyAppointments from '../pages/hospital/MyAppointment';
import BlogDetails from '../pages/hospital/blogs/BlogDetails';
import Profile from '../pages/register/profile/Profile';
import EditProfile from '../pages/register/profile/EditProfile';
import ServiceDetails from '../pages/hospital/ServiceDetails';
import Journal from '../pages/hospital/Journal';
import NewCruClinic from '../pages/hospital/NewCruClinic';
import History from '../pages/about/History';
import Trainings from '../pages/about/Trainings';
import Programs from '../pages/about/Programs';
import TheOrder from '../pages/about/TheOrder';
import SymptomChecker from '../pages/SymptomChecker/SymptomChecker';
import VideoPage from '../pages/VideoPage/VideoPage';
import DoctorDashboard from '../pages/DoctorDashboard/DoctorDashboard';
import AddDoctor from '../pages/hospital/admin/AddDoctor';
import MedicalVault from '../pages/medicalVault/MedicalVault';
import Triage from '../pages/Triage/';

// --- ADMIN IMPORTS ---
import AdminLayout from '../pages/hospital/admin/AdminLayout';
import AdminDashboard from '../pages/hospital/admin/AdminDashboard';
import ManageBlogs from '../pages/hospital/admin/ManageBlogs';
import PostBlog from '../pages/hospital/admin/PostBlog';
import EditBlog from '../pages/hospital/admin/EditBlog';
import AddAdmin from '../pages/hospital/admin/AddAdmin';
import AdminServices from '../pages/hospital/admin/AdminServices';
import AdminInquiries from '../pages/hospital/admin/AdminInquiries';
import AdminSettings from '../pages/hospital/admin/AdminSettings';
import ManageDoctors from '../pages/hospital/admin/MAnageDoctors';

const AppRouter = () => {
  return (
    <Routes>

      {/* ==========================================
          1. PUBLIC ROUTES
          ========================================== */}
      <Route path="/"               element={<Home />} />
      <Route path="/login"          element={<Login />} />
      <Route path="/register"       element={<Register />} />

      <Route path="/blog"           element={<Journal />} />
      <Route path="/journal"        element={<Journal />} />
      <Route path="/blog/:id"       element={<BlogDetails />} />
      <Route path="/journal/:id"    element={<BlogDetails />} />

      <Route path="/services"       element={<Services />} />
      <Route path="/services/:id"   element={<ServiceDetails />} />
      <Route path="/doctors"        element={<Doctors />} />
      <Route path="/contact"        element={<Contact />} />
      <Route path="/testimony"      element={<Testimony />} />
      <Route path="/new-cru-clinic" element={<NewCruClinic />} />
      <Route path="/doctor/:docId"  element={<DoctorProfile />} />

      {/* AI Triage — public so anyone can check symptoms before logging in */}
      <Route path="/triage"         element={<Triage />} />
      <Route path="/symptom-checker" element={<SymptomChecker />} />

      {/* --- ABOUT SUB-ROUTES --- */}
      <Route path="/about">
        <Route index          element={<About />} />
        <Route path="history"   element={<History />} />
        <Route path="programs"  element={<Programs />} />
        <Route path="training"  element={<Trainings />} />
        <Route path="the-order" element={<TheOrder />} />
      </Route>

      {/* ==========================================
          2. SHARED AUTHENTICATED ROUTES
          ========================================== */}
      <Route element={<ProtectedRoute allowedRoles={['user', 'patient', 'admin', 'doctor']} />}>
        <Route path="/profile"                        element={<Profile />} />
        <Route path="/edit-profile"                   element={<EditProfile />} />
        <Route path="/my-appointments"                element={<MyAppointments />} />
        <Route path="/appointment"                    element={<Appointment />} />
        <Route path="/appointment/:docId"             element={<Appointment />} />
        <Route path="/medical-vault"                  element={<MedicalVault />} />
        <Route path="/video-consultation/:roomId"     element={<VideoPage />} />
      </Route>

      {/* ==========================================
          3. DOCTOR SPECIFIC ROUTES
          ========================================== */}
      <Route element={<ProtectedRoute allowedRoles={['doctor']} />}>
        <Route path="/doctor/dashboard" element={<DoctorDashboard />} />
      </Route>

      {/* ==========================================
          4. ADMIN SPECIFIC ROUTES
          ========================================== */}
      <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
        <Route path="/admin" element={<AdminLayout />}>
          <Route index                        element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard"             element={<AdminDashboard />} />
          <Route path="manage-blogs"          element={<ManageBlogs />} />
          <Route path="post-blog"             element={<PostBlog />} />
          <Route path="edit-blog/:id"         element={<EditBlog />} />
          <Route path="add-admin"             element={<AddAdmin />} />
          <Route path="services"              element={<AdminServices />} />
          <Route path="inquiries"             element={<AdminInquiries />} />
          <Route path="add-doctor"            element={<AddDoctor />} />
          <Route path="settings"              element={<AdminSettings />} />
          <Route path="manage-doctors"        element={<ManageDoctors />} />
        </Route>
      </Route>

      {/* ==========================================
          5. 404 CATCH-ALL
          ========================================== */}
      <Route path="*" element={<NotFoundPage />} />

    </Routes>
  );
};

const NotFoundPage = () => (
  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '70vh', textAlign: 'center', padding: '0 24px', background: '#fff', position: 'relative' }}>
    <h1 style={{ fontSize: '10rem', fontWeight: 900, color: '#f1f5f9', margin: 0, lineHeight: 1 }}>404</h1>
    <div style={{ position: 'absolute', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <p style={{ fontSize: 18, fontWeight: 700, color: '#1e293b', textTransform: 'uppercase', letterSpacing: '0.15em' }}>
        Page Not Found
      </p>
      <p style={{ fontSize: 14, color: '#64748b', marginTop: 8, marginBottom: 24 }}>
        The page you're looking for doesn't exist or has been moved.
      </p>
      <button
        onClick={() => window.location.href = '/'}
        style={{ padding: '12px 32px', background: '#2563eb', color: '#fff', border: 'none', borderRadius: 999, fontWeight: 900, fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.18em', cursor: 'pointer' }}
      >
        Back to Home
      </button>
    </div>
  </div>
);


export default AppRouter;