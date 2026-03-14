import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Toaster } from 'react-hot-toast';
import { checkAuth } from './redux/features/auth/authSlice';

import Navbar from './components/Navbar';
import Footer from './components/Footer';
import AppRouter from './router/AppRouter';
import { ThemeProvider, useSiteTheme } from './context/ThemeContext';

function AppContent() {
  const dispatch = useDispatch();
  const [appReady, setAppReady] = useState(false);
  const { siteTheme } = useSiteTheme();

  useEffect(() => {
    const initializeAuth = async () => {
      await dispatch(checkAuth());
      setAppReady(true);
    };
    initializeAuth();
  }, [dispatch]);

  if (!appReady) {
    return (
      <div
        style={{ background: siteTheme.siteBg, transition: 'background 0.5s ease' }}
        className="h-screen w-full flex flex-col items-center justify-center"
      >
        <div className="relative flex items-center justify-center">
          <div
            className="w-16 h-16 rounded-full animate-spin"
            style={{
              border: `4px solid ${siteTheme.siteBorder}`,
              borderTopColor: siteTheme.siteAccent,
            }}
          />
          <div className="absolute animate-pulse text-xl" style={{ color: siteTheme.siteAccent }}>✚</div>
        </div>
        <p
          className="mt-4 text-[10px] font-black uppercase tracking-[0.3em]"
          style={{ color: siteTheme.siteMuted }}
        >
          Syncing Health Portal...
        </p>
      </div>
    );
  }

  return (
    <div
      style={{
        background: siteTheme.siteBg,
        color: siteTheme.siteText,
        transition: 'background 0.5s ease, color 0.5s ease',
      }}
      className="flex flex-col min-h-screen selection:bg-blue-100 selection:text-blue-600"
    >
      <Toaster
        position="top-center"
        reverseOrder={false}
        toastOptions={{
          style: {
            borderRadius: '1rem',
            background: siteTheme.siteCard,
            color: siteTheme.siteText,
            border: `1px solid ${siteTheme.siteBorder}`,
            fontWeight: '600',
          },
        }}
      />
      <Navbar />
      <main
        className="flex-grow max-w-screen-2xl mx-auto w-full pt-24 px-4 sm:px-6 lg:px-8"
        style={{ color: siteTheme.siteText }}
      >
        <AppRouter />
      </main>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}

export default App;