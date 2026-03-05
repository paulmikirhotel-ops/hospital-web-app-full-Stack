import React from 'react';
import { createRoot } from 'react-dom/client'; // Modern way
import App from './App';
import './index.css';
import { Provider } from 'react-redux';
import { store } from './redux/store';
import { BrowserRouter } from 'react-router-dom';

// Create the root once and render
const container = document.getElementById('root');
const root = createRoot(container); 

root.render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </Provider>
  </React.StrictMode>
);