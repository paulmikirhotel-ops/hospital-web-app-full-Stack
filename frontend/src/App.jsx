import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Toaster } from 'react-hot-toast';
import { checkAuth } from './redux/features/auth/authSlice';

import Navbar from './components/Navbar';
import Footer from './components/Footer';
import AppRouter from './router/AppRouter';

function App() {
  const dispatch = useDispatch();
  const [appReady, setAppReady] = useState(false);

  useEffect(() => {
    const initializeAuth = async () => {
      await dispatch(checkAuth());
      setAppReady(true);
    };
    initializeAuth();
  }, [dispatch]);

  // --- MEDICAL THEMED LOADER (Cleaned) ---
  if (!appReady) {
    return (
      <div className="h-screen w-full flex flex-col items-center justify-center bg-white transition-colors duration-500">
        <div className="relative flex items-center justify-center">
          <div className="w-16 h-16 border-4 border-blue-50 border-t-blue-600 rounded-full animate-spin"></div>
          <div className="absolute text-blue-600 animate-pulse text-xl">✚</div>
        </div>
        <p className="mt-4 text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">
          Syncing Health Portal...
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 transition-colors duration-300 selection:bg-blue-100 selection:text-blue-600">
      
      <Toaster 
        position="top-center" 
        reverseOrder={false}
        toastOptions={{
          style: {
            borderRadius: '1rem',
            background: '#fff',
            color: '#0f172a',
            border: '1px solid #e2e8f0',
            fontWeight: '600'
          },
        }} 
      />
      
      <Navbar />
      
      {/* Main Content Area */}
      <main className="flex-grow max-w-screen-2xl mx-auto w-full pt-24 px-4 sm:px-6 lg:px-8 text-slate-900">
        <AppRouter />
      </main>

      <Footer />
    </div>
  );
}

export default App;