import { useSelector } from 'react-redux';
import { Navigate, Outlet, useLocation } from 'react-router-dom';

const ProtectedRoute = ({ allowedRoles }) => {
  const { user, loading } = useSelector((state) => state.auth);
  const location = useLocation();

  // 1. Loading State
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  // 2. Authentication Check
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // 🚀 DEFINE VARIABLES EARLY TO AVOID REFERENCE ERRORS
  const userRole = user?.role?.toLowerCase() || "";

  // 3. Authorization (Role) Check
  if (allowedRoles && allowedRoles.length > 0) {
    // We compare lowercase to lowercase to avoid "Patient" vs "patient" issues
    const isAllowed = allowedRoles.some(role => role.toLowerCase() === userRole);

    if (!isAllowed) {
      console.warn(`Access Denied: Role '${userRole}' is not authorized for this route.`);
      return <Navigate to="/" replace />;
    }
  }

  // 4. Permission Granted
  return <Outlet />;
};

export default ProtectedRoute;