import React from 'react';
import { PayPalScriptProvider } from "@paypal/react-paypal-js";
import AppRoutes from './routes'; // Import router
import ScrollToTop from './components/common/ScrollToTop';
import './assets/global.css'; // (Tùy chọn) Tạo file css global

function App() {
  return (
    <PayPalScriptProvider options={{ "client-id": import.meta.env.VITE_PAYPAL_CLIENT_ID }}>
      <div className="luxury-pattern-overlay"></div>
      <ScrollToTop />
      <AppRoutes />
    </PayPalScriptProvider>
  );
}

export default App;