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

// --- ADMIN IMPORTS ---
import AdminLayout from '../pages/hospital/admin/AdminLayout';
import AdminDashboard from '../pages/hospital/admin/AdminDashboard';
import ManageBlogs from '../pages/hospital/admin/ManageBlogs';
import PostBlog from '../pages/hospital/admin/PostBlog';
import AddAdmin from '../pages/hospital/admin/AddAdmin';
import AdminServices from '../pages/hospital/admin/AdminServices';
import AdminInquiries from '../pages/hospital/admin/AdminInquiries';

const AppRouter = () => {
  return (
    <Routes>
      {/* ==========================================
          1. PUBLIC ROUTES
          ========================================== */}
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/blog/:id" element={<BlogDetails />} />
      <Route path="/journal" element={<Journal />} />
      <Route path="/services" element={<Services />} />
      <Route path="/services/:id" element={<ServiceDetails />} />
      <Route path="/doctors" element={<Doctors />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/testimony" element={<Testimony />} />
      <Route path="/new-cru-clinic" element={<NewCruClinic />} />
      <Route path="/doctor/:docId" element={<DoctorProfile />} />
      <Route path="/symptom-checker" element={<SymptomChecker />} />

      {/* --- ABOUT SUB-ROUTES --- */}
      <Route path="/about">
        <Route index element={<About />} />
        <Route path="history" element={<History />} />
        <Route path="programs" element={<Programs />} /> 
        <Route path="training" element={<Trainings />} /> 
        <Route path="the-order" element={<TheOrder />} />
      </Route>

      {/* ==========================================
          2. SHARED AUTHENTICATED ROUTES 
          (Accessible by Patients, Users, Admins, Doctors)
          ========================================== */}
      <Route element={<ProtectedRoute allowedRoles={['user', 'patient', 'admin', 'doctor']} />}>
        <Route path="/profile" element={<Profile />} />
        <Route path="/edit-profile" element={<EditProfile />} />
        <Route path="/my-appointments" element={<MyAppointments />} />
        <Route path="/appointment" element={<Appointment />} /> 
        <Route path="/appointment/:docId" element={<Appointment />} />
        <Route path="/medical-vault" element={<MedicalVault />} />
        <Route path="/video-consultation/:roomId" element={<VideoPage />} />
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
          {/* Default to Dashboard */}
          <Route index element={<Navigate to="dashboard" replace />} /> 
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="manage-blogs" element={<ManageBlogs />} />
          <Route path="post-blog" element={<PostBlog />} />
          <Route path="add-admin" element={<AddAdmin />} />
          <Route path="services" element={<AdminServices />} />
          <Route path="inquiries" element={<AdminInquiries />} /> 
          <Route path="add-doctor" element={<AddDoctor />} />
        </Route>
      </Route>

      {/* ==========================================
          5. 404 CATCH-ALL
          ========================================== */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

// --- HELPER COMPONENT: 404 PAGE ---
const NotFoundPage = () => (
  <div className="flex flex-col items-center justify-center min-h-[70vh] text-center px-4 bg-white relative">
    <h1 className="text-9xl font-black text-slate-100">404</h1>
    <div className="absolute inset-0 flex flex-col items-center justify-center">
      <p className="text-xl font-bold text-slate-800 mt-4 uppercase tracking-widest">Page Not Found</p>
      <button 
        onClick={() => window.location.href = '/'} 
        className="mt-6 px-8 py-3 bg-blue-600 text-white rounded-full font-black text-xs uppercase tracking-widest hover:bg-slate-900 transition-all shadow-lg"
      >
        Back to Home
      </button>
    </div>
  </div>
);

export default AppRouter;