// src/main.tsx - CORRECT version for routing
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom'; // Import BrowserRouter
import App from './App.tsx'; // App will define routes
import './index.css';

// This simplified version has no router or other dependencies
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter> {/* Wrap App */}
      <App />
    </BrowserRouter>
  </React.StrictMode>
);