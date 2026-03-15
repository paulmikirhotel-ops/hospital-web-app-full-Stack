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

  // ── App loading screen ──────────────────────────────────────────────────────
  if (!appReady) {
    return (
      <div style={{
        height: '100vh', width: '100%',
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        background: siteTheme?.siteBg || '#fff',
        transition: 'background 0.5s ease',
      }}>
        <style>{`
          @keyframes spin  { to { transform: rotate(360deg); } }
          @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }
        `}</style>
        <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{
            width: 64, height: 64, borderRadius: '50%',
            border: `4px solid ${siteTheme?.siteBorder || '#e2e8f0'}`,
            borderTopColor: siteTheme?.siteAccent || '#2563eb',
            animation: 'spin 0.8s linear infinite',
          }} />
          <div style={{
            position: 'absolute', fontSize: 20,
            color: siteTheme?.siteAccent || '#2563eb',
            animation: 'pulse 1.4s ease-in-out infinite',
          }}>
            ✚
          </div>
        </div>
        <p style={{
          marginTop: 16, fontSize: 10, fontWeight: 900,
          textTransform: 'uppercase', letterSpacing: '0.3em',
          color: siteTheme?.siteMuted || '#94a3b8',
        }}>
          Syncing Health Portal...
        </p>
      </div>
    );
  }

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      minHeight: '100vh',
      background: siteTheme?.siteBg || '#fff',
      color: siteTheme?.siteText || '#0f172a',
      transition: 'background 0.5s ease, color 0.5s ease',
    }}>
      <Toaster
        position="top-center"
        reverseOrder={false}
        toastOptions={{
          style: {
            borderRadius: '1rem',
            background: siteTheme?.siteCard || '#fff',
            color: siteTheme?.siteText || '#0f172a',
            border: `1px solid ${siteTheme?.siteBorder || '#e2e8f0'}`,
            fontWeight: '600',
          },
        }}
      />

      <Navbar />

      {/*
        ── IMPORTANT: main is intentionally a neutral passthrough ──

        Do NOT add padding, max-width, or margin here.
        Reasons:
          1. Full-bleed pages (Home, History, Programs, Hero etc.) manage
             their own layout. A wrapper with pt-24 or max-w pushes them
             down and causes the browser to jump to the bottom on render.
          2. Constrained pages (Profile, EditProfile, MyAppointments etc.)
             already include their own top padding to clear the fixed 68px
             navbar (using paddingTop: 'clamp(80px,12vw,112px)' or similar).
          3. flex-grow: 1 keeps the footer pinned to the bottom on short pages.

        If you need padding on a specific page, add it inside that page's
        own root element — not here.
      */}
      <main style={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
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