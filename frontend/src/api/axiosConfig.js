import axios from 'axios';

// Create an instance with default settings
const API = axios.create({
  // 🚀 UPDATE: Added /api to match your backend app.use('/api/...')
  baseURL: 'http://localhost:5001/api', 
  withCredentials: true,               
  headers: {
    'Content-Type': 'application/json',
  }
});

/**
 * Global Response Interceptor
 * This acts as a "security guard" for your frontend.
 */
API.interceptors.response.use(
  (response) => response,
  (error) => {
    // Check for 401 (Expired/No Token) or 403 (Wrong Role/Permission)
    if (error.response) {
      const status = error.response.status;

      if (status === 401) {
        console.warn("Session expired. Clearing local state...");
        
        // 🚀 CRITICAL: Logic to force logout on the frontend
        // If you are using window.location, it will hard-refresh to clear Redux
        if (!window.location.pathname.includes('/login')) {
            window.location.href = '/login';
        }
      }

      if (status === 403) {
        console.error("Access Denied: You do not have permission for this action.");
        // Redirect to an 'unauthorized' page if a Patient tries to access Admin
      }
    }
    
    return Promise.reject(error);
  }
);

export default API;