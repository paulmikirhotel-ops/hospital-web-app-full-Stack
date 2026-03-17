import React, { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from '../components/ProtectedRoute';

// ── Lazy load all pages for speed ──
const Home           = lazy(() => import('../pages/Home'));
const Login          = lazy(() => import('../pages/login/Login'));
const Register       = lazy(() => import('../pages/register/Register'));
const About          = lazy(() => import('../pages/hospital/About'));
const Appointment    = lazy(() => import('../pages/hospital/Appointment'));
const Services       = lazy(() => import('../pages/hospital/Services'));
const Testimony      = lazy(() => import('../pages/hospital/Testimony'));
const Doctors        = lazy(() => import('../pages/hospital/Doctors'));
const Contact        = lazy(() => import('../pages/hospital/Contact'));
const DoctorProfile  = lazy(() => import('../pages/hospital/DoctorProfile'));
const MyAppointments = lazy(() => import('../pages/hospital/MyAppointment'));
const BlogDetails    = lazy(() => import('../pages/hospital/blogs/BlogDetails'));
const Profile        = lazy(() => import('../pages/register/profile/Profile'));
const EditProfile    = lazy(() => import('../pages/register/profile/EditProfile'));
const ServiceDetails = lazy(() => import('../pages/hospital/ServiceDetails'));
const Journal        = lazy(() => import('../pages/hospital/Journal'));
const NewCruClinic   = lazy(() => import('../pages/hospital/NewCruClinic'));
const History        = lazy(() => import('../pages/about/History'));
const Trainings      = lazy(() => import('../pages/about/Trainings'));
const Programs       = lazy(() => import('../pages/about/Programs'));
const TheOrder       = lazy(() => import('../pages/about/TheOrder'));
const SymptomChecker = lazy(() => import('../pages/SymptomChecker/SymptomChecker'));
const VideoPage      = lazy(() => import('../pages/VideoPage/VideoPage'));
const DoctorDashboard = lazy(() => import('../pages/DoctorDashboard/DoctorDashboard'));
const AddDoctor      = lazy(() => import('../pages/hospital/admin/AddDoctor'));
const MedicalVault   = lazy(() => import('../pages/medicalVault/MedicalVault'));
const Triage         = lazy(() => import('../pages/Triage/'));

// ── New auth pages ──
const ForgotPassword = lazy(() => import('../pages/auth/ForgetPassword'));
const ResetPassword  = lazy(() => import('../pages/auth/ResetPassword'));
const DoctorSetup    = lazy(() => import('../pages/auth/DoctorSetup'));

// ── Admin ──
const AdminLayout    = lazy(() => import('../pages/hospital/admin/AdminLayout'));
const AdminDashboard = lazy(() => import('../pages/hospital/admin/AdminDashboard'));
const ManageBlogs    = lazy(() => import('../pages/hospital/admin/ManageBlogs'));
const PostBlog       = lazy(() => import('../pages/hospital/admin/PostBlog'));
const EditBlog       = lazy(() => import('../pages/hospital/admin/EditBlog'));
const AddAdmin       = lazy(() => import('../pages/hospital/admin/AddAdmin'));
const AdminServices  = lazy(() => import('../pages/hospital/admin/AdminServices'));
const AdminInquiries = lazy(() => import('../pages/hospital/admin/AdminInquiries'));
const AdminSettings  = lazy(() => import('../pages/hospital/admin/AdminSettings'));
const ManageDoctors = lazy(() => import('../pages/hospital/admin/ManageDoctors'));

/* ── Loading spinner ── */
const PageLoader = () => (
  <div style={{ minHeight: '60vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16 }}>
    <div style={{ position: 'relative', width: 48, height: 48 }}>
      <div style={{ width: 48, height: 48, border: '4px solid #eff6ff', borderTopColor: '#2563eb', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }}/>
      <div style={{ position: 'absolute', inset: 6, border: '4px solid #eff6ff', borderTopColor: '#93c5fd', borderRadius: '50%', animation: 'spin 0.6s linear infinite reverse' }}/>
    </div>
    <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    <p style={{ fontSize: 10, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.3em', color: '#94a3b8' }}>Loading...</p>
  </div>
);

const AppRouter = () => {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>

        {/* ══ PUBLIC ROUTES ══ */}
        <Route path="/"               element={<Home />} />
        <Route path="/login"          element={<Login />} />
        <Route path="/register"       element={<Register />} />

        {/* Auth flows */}
        <Route path="/forgot-password"          element={<ForgotPassword />} />
        <Route path="/reset-password/:token"    element={<ResetPassword />} />
        <Route path="/doctor-setup/:token"      element={<DoctorSetup />} />

        {/* Blog / Journal */}
        <Route path="/blog"           element={<Journal />} />
        <Route path="/journal"        element={<Journal />} />
        <Route path="/blog/:id"       element={<BlogDetails />} />
        <Route path="/journal/:id"    element={<BlogDetails />} />

        {/* Hospital pages */}
        <Route path="/services"       element={<Services />} />
        <Route path="/services/:id"   element={<ServiceDetails />} />
        <Route path="/doctors"        element={<Doctors />} />
        <Route path="/contact"        element={<Contact />} />
        <Route path="/testimony"      element={<Testimony />} />
        <Route path="/new-cru-clinic" element={<NewCruClinic />} />
        <Route path="/doctor/:docId"  element={<DoctorProfile />} />

        {/* AI tools — public */}
        <Route path="/triage"          element={<Triage />} />
        <Route path="/symptom-checker" element={<SymptomChecker />} />

        {/* ── About sub-routes ── */}
        <Route path="/about">
          <Route index            element={<About />} />
          <Route path="history"   element={<History />} />
          <Route path="programs"  element={<Programs />} />
          <Route path="training"  element={<Trainings />} />
          <Route path="the-order" element={<TheOrder />} />
        </Route>

        {/* ── Appointment — PUBLIC so anyone can browse doctors ── */}
        {/* With docId = book specific doctor */}
        <Route path="/appointment/:docId" element={<Appointment />} />

        {/* Without docId = redirect to doctors page to pick one */}
        <Route path="/appointment" element={<Doctors />} />

        {/* ══ AUTHENTICATED ROUTES ══ */}
        <Route element={<ProtectedRoute allowedRoles={['user', 'patient', 'admin', 'doctor']} />}>
          <Route path="/profile"                    element={<Profile />} />
          <Route path="/edit-profile"               element={<EditProfile />} />
          <Route path="/my-appointments"            element={<MyAppointments />} />
          <Route path="/medical-vault"              element={<MedicalVault />} />
          <Route path="/video-consultation/:roomId" element={<VideoPage />} />
        </Route>

        {/* ══ DOCTOR ROUTES ══ */}
        <Route element={<ProtectedRoute allowedRoles={['doctor']} />}>
          <Route path="/doctor/dashboard" element={<DoctorDashboard />} />
        </Route>

        {/* ══ ADMIN ROUTES ══ */}
        <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
          <Route path="/admin" element={<AdminLayout />}>
            <Route index                 element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard"      element={<AdminDashboard />} />
            <Route path="manage-blogs"   element={<ManageBlogs />} />
            <Route path="post-blog"      element={<PostBlog />} />
            <Route path="edit-blog/:id"  element={<EditBlog />} />
            <Route path="add-admin"      element={<AddAdmin />} />
            <Route path="services"       element={<AdminServices />} />
            <Route path="inquiries"      element={<AdminInquiries />} />
            <Route path="add-doctor"     element={<AddDoctor />} />
            <Route path="settings"       element={<AdminSettings />} />
            <Route path="manage-doctors" element={<ManageDoctors />} />
          </Route>
        </Route>

        {/* ══ 404 ══ */}
        <Route path="*" element={<NotFoundPage />} />

      </Routes>
    </Suspense>
  );
};

const NotFoundPage = () => (
  <div style={{ display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', minHeight:'70vh', textAlign:'center', padding:'0 24px', background:'#fff', position:'relative' }}>
    <h1 style={{ fontSize:'10rem', fontWeight:900, color:'#f1f5f9', margin:0, lineHeight:1 }}>404</h1>
    <div style={{ position:'absolute', display:'flex', flexDirection:'column', alignItems:'center' }}>
      <p style={{ fontSize:18, fontWeight:700, color:'#1e293b', textTransform:'uppercase', letterSpacing:'0.15em' }}>Page Not Found</p>
      <p style={{ fontSize:14, color:'#64748b', marginTop:8, marginBottom:24 }}>The page you're looking for doesn't exist or has been moved.</p>
      <button onClick={() => window.location.href = '/'}
        style={{ padding:'12px 32px', background:'#2563eb', color:'#fff', border:'none', borderRadius:999, fontWeight:900, fontSize:11, textTransform:'uppercase', letterSpacing:'0.18em', cursor:'pointer' }}>
        Back to Home
      </button>
    </div>
  </div>
);

export default AppRouter;