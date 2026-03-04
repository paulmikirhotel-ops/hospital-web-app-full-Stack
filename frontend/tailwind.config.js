/** @type {import('tailwindcss').Config} */
export default {
  // 🚀 Add this line to enable class-based dark mode
  darkMode: 'class', 
  
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#2563eb",
        // 🏥 Adding a dark-surface color for medical UI depth
        dark: {
          900: "#0f172a", // Deep Slate for backgrounds
          800: "#1e293b", // Lighter Slate for cards/modals
          700: "#334155", // For borders/strokes
        }
      }
    },
  },
  plugins: [],
}