import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css';
import { Provider } from 'react-redux';
import { store } from './redux/store';
import { BrowserRouter } from 'react-router-dom';
// 🚀 Import the ThemeProvider
import { ThemeProvider } from '../src/content/ThemeContext'; 

const container = document.getElementById('root');
const root = createRoot(container); 

root.render(
  <React.StrictMode>
    {/* 💡 The ThemeProvider wraps everything so isDarkMode is available globally */}
    <ThemeProvider>
      <Provider store={store}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </Provider>
    </ThemeProvider>
  </React.StrictMode>
);