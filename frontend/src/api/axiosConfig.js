import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001'

const API = axios.create({
  baseURL: `${BASE_URL}/api`,
  withCredentials: true,
  // ✅ Removed default Content-Type — axios sets it automatically
  // For FormData it sets multipart/form-data with correct boundary
  // For JSON it sets application/json
});

API.interceptors.request.use(
  (config) => config,
  (error) => Promise.reject(error)
);

API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      const status = error.response.status;

      if (status === 401) {
        console.warn("Session expired.");
        localStorage.removeItem('user');
        if (!window.location.pathname.includes('/login')) {
          window.location.href = '/login';
        }
      }

      if (status === 403) {
        console.error("Access Denied.");
      }
    }
    return Promise.reject(error);
  }
);

export default API;