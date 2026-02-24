import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext.jsx';
import { SocketProvider } from './context/SocketContext.jsx';
import { CartProvider } from './context/CartContext.jsx'; // <-- 1. Import CartProvider
import { ToastProvider } from './context/ToastContext.jsx';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <SocketProvider>
        <AuthProvider>
          <ToastProvider>
            <CartProvider> {/* <-- 2. Bọc App trong CartProvider */}
              <App />
            </CartProvider>
          </ToastProvider>
        </AuthProvider>
      </SocketProvider>
    </BrowserRouter>
  </React.StrictMode>,
);

// Register service worker for push notifications
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then(reg => console.log('Service Worker registered:', reg.scope))
      .catch(err => console.error('Service Worker registration failed:', err));
  });
}