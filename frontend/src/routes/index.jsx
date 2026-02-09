import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

import AdminLayout from '../layouts/AdminLayout';
import MainLayout from '../layouts/MainLayout';

import AdminLogin from '../pages/admin/AdminLogin';
import Dashboard from '../pages/admin/Dashboard';
import UserManagement from '../pages/admin/UserManagement';
import ProductManagement from '../pages/admin/ProductManagement';
import CategoryManagement from '../pages/admin/CategoryManagement';
import OrderManagement from '../pages/admin/OrderManagement';
import ProductForm from '../pages/admin/ProductForm';
import OrderDetail from '../pages/admin/OrderDetail';
// import VoucherManagement from '../pages/admin/VoucherManagement';
// import FlashSaleManagement from '../pages/admin/FlashSaleManagement';
// import FlashSaleForm from '../pages/admin/FlashSaleForm';
import BrandManagement from '../pages/admin/BrandManagement';
import CollectionManagement from '../pages/admin/CollectionManagement';
import BannerManagement from '../pages/admin/BannerManagement';
import SectionManagement from '../pages/admin/SectionManagement';

import HomePage from '../pages/public/HomePage';
import Register from '../pages/public/Register';
import Login from '../pages/public/Login';
import MyAccount from '../pages/public/MyAccount';
import ProductListPage from '../pages/public/ProductListPage';
import BrandPage from '../pages/public/BrandPage';
import BrandDetailPage from '../pages/public/BrandDetailPage';
import AboutPage from '../pages/public/AboutPage.jsx';
import ProductDetailPage from '../pages/public/ProductDetailPage.jsx';
import CartPage from '../pages/public/CartPage.jsx';
import CheckoutPage from '../pages/public/CheckoutPage.jsx'; // <-- Thêm import
import OrderSuccessPage from '../pages/public/OrderSuccessPage.jsx';
const ProtectedRoute = ({ children }) => {
    const { adminToken } = useAuth();
    return adminToken ? children : <Navigate to="/admin/login" replace />;
};
const UserProtectedRoute = ({ children }) => {
    const { userToken } = useAuth();
    return userToken ? children : <Navigate to="/login" replace />;
};

const AppRoutes = () => {
    return (
        <Routes>
            {/* === ROUTE ADMIN === */}
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin" element={<ProtectedRoute><AdminLayout /></ProtectedRoute>}>
                <Route path="dashboard" element={<Dashboard />} />
                <Route path="users" element={<UserManagement />} />
                <Route path="products" element={<ProductManagement />} />
                <Route path="products/new" element={<ProductForm />} />
                <Route path="products/edit/:id" element={<ProductForm />} />
                <Route path="categories" element={<CategoryManagement />} />
                <Route path="orders" element={<OrderManagement />} />
                <Route path="orders/:id" element={<OrderDetail />} />
                {/* <Route path="vouchers" element={<VoucherManagement />} />
                <Route path="flash-sales" element={<FlashSaleManagement />} />
                <Route path="flash-sales/new" element={<FlashSaleForm />} />
                <Route path="flash-sales/edit/:id" element={<FlashSaleForm />} /> */}
                <Route path="brands" element={<BrandManagement />} />
                <Route path="collections" element={<CollectionManagement />} />
                <Route path="banners" element={<BannerManagement />} />
                <Route path="sections" element={<SectionManagement />} />
                <Route index element={<Navigate to="dashboard" replace />} />
            </Route>

            {/* === ROUTE USER (NẰM TRONG MAINLAYOUT) === */}
            <Route path="/" element={<MainLayout />}>
                <Route index element={<HomePage />} />
                <Route path="products" element={<ProductListPage />} />
                <Route path="category/:slug" element={<ProductListPage />} />
                <Route path="collection/:slug" element={<ProductListPage />} />
                <Route path="register" element={<Register />} />
                <Route path="login" element={<Login />} />
                <Route path="my-account" element={<UserProtectedRoute><MyAccount /></UserProtectedRoute>} />
                <Route path="brands" element={<BrandPage />} />
                <Route path="brands/:slug" element={<BrandDetailPage />} />
                <Route path="about" element={<AboutPage />} />
                <Route path="products/:id" element={<ProductDetailPage />} />
                <Route path="cart" element={<CartPage />} />
                <Route path="checkout" element={<UserProtectedRoute><CheckoutPage /></UserProtectedRoute>} />
                <Route path="order-success/:orderId" element={<UserProtectedRoute><OrderSuccessPage /></UserProtectedRoute>} />
            </Route>
        </Routes>
    );
};
export default AppRoutes;