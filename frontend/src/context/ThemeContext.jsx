import { createContext, useContext, useState } from 'react';

export const THEME_ORDER = ['gold', 'blue', 'white'];

export const SITE_THEMES = {
  gold: {
    key: 'gold',
    siteBg: '#fdf8ee',
    siteAltBg: '#fef3cc',
    siteText: '#1a0f00',
    siteMuted: '#6b4c00',
    siteAccent: '#d4a017',
    siteAccentHover: '#f5c842',
    siteCard: '#ffffff',
    siteCardAlt: '#fffbf0',
    siteBorder: 'rgba(212,160,23,0.2)',
    siteInputBg: '#fffbf0',
    siteInputBorder: '#f0d080',
    siteBtnBg: '#1a0f00',
    siteBtnText: '#f5c842',
    siteBadgeBg: '#fff8e0',
    siteBadgeText: '#1a0f00',
    siteBadgeAccent: '#d4a017',
    siteGlow: 'rgba(212,160,23,0.25)',
    siteShadow: '0 4px 24px rgba(212,160,23,0.12)',
    siteDarkBg: '#0a0700',
    siteDarkText: '#f5e6c0',
    siteDarkMuted: '#c9971a',
  },
  blue: {
    key: 'blue',
    siteBg: '#f0f9ff',
    siteAltBg: '#e0f2fe',
    siteText: '#0c1a2e',
    siteMuted: '#334e6b',
    siteAccent: '#0ea5e9',
    siteAccentHover: '#38bdf8',
    siteCard: '#ffffff',
    siteCardAlt: '#f0f9ff',
    siteBorder: 'rgba(14,165,233,0.15)',
    siteInputBg: '#f0f9ff',
    siteInputBorder: '#bae6fd',
    siteBtnBg: '#0c1a2e',
    siteBtnText: '#ffffff',
    siteBadgeBg: '#e8f4ff',
    siteBadgeText: '#0c1a2e',
    siteBadgeAccent: '#0ea5e9',
    siteGlow: 'rgba(14,165,233,0.2)',
    siteShadow: '0 4px 24px rgba(14,165,233,0.1)',
    siteDarkBg: '#000814',
    siteDarkText: '#e0f2fe',
    siteDarkMuted: '#38bdf8',
  },
  white: {
    key: 'white',
    siteBg: '#f8faff',
    siteAltBg: '#f1f5f9',
    siteText: '#0f172a',
    siteMuted: '#64748b',
    siteAccent: '#2563eb',
    siteAccentHover: '#1d4ed8',
    siteCard: '#ffffff',
    siteCardAlt: '#f8fafc',
    siteBorder: 'rgba(59,130,246,0.12)',
    siteInputBg: '#f8fafc',
    siteInputBorder: '#e2e8f0',
    siteBtnBg: '#0f172a',
    siteBtnText: '#ffffff',
    siteBadgeBg: '#eff6ff',
    siteBadgeText: '#0f172a',
    siteBadgeAccent: '#2563eb',
    siteGlow: 'rgba(37,99,235,0.12)',
    siteShadow: '0 4px 24px rgba(37,99,235,0.06)',
    siteDarkBg: '#0f172a',
    siteDarkText: '#f8fafc',
    siteDarkMuted: '#94a3b8',
  },
};

const ThemeContext = createContext(null);

export const ThemeProvider = ({ children }) => {
  const [themeIdx, setThemeIdx] = useState(2); // default: Classic White

  const themeKey = THEME_ORDER[themeIdx];
  const siteTheme = SITE_THEMES[themeKey];

  const cycleTheme = () => setThemeIdx(prev => (prev + 1) % THEME_ORDER.length);

  return (
    <ThemeContext.Provider value={{ themeIdx, themeKey, siteTheme, cycleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useSiteTheme = () => {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useSiteTheme must be used inside <ThemeProvider>');
  return ctx;
};