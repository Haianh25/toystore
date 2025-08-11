import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Import Layouts
import AdminLayout from '../layouts/AdminLayout';
import MainLayout from '../layouts/MainLayout'; // <-- Import MainLayout

// Import các trang Admin
import AdminLogin from '../pages/admin/AdminLogin';
import Dashboard from '../pages/admin/Dashboard';
import UserManagement from '../pages/admin/UserManagement';
import ProductManagement from '../pages/admin/ProductManagement';
import CategoryManagement from '../pages/admin/CategoryManagement';
import OrderManagement from '../pages/admin/OrderManagement';
import ProductForm from '../pages/admin/ProductForm';
import OrderDetail from '../pages/admin/OrderDetail';
import VoucherManagement from '../pages/admin/VoucherManagement';
import FlashSaleManagement from '../pages/admin/FlashSaleManagement';
import FlashSaleForm from '../pages/admin/FlashSaleForm';
import BrandManagement from '../pages/admin/BrandManagement';
import CollectionManagement from '../pages/admin/CollectionManagement';
import Register from '../pages/public/Register';
import Login from '../pages/public/Login';
import MyAccount from '../pages/public/MyAccount';
import BannerManagement from '../pages/admin/BannerManagement';
import SectionManagement from '../pages/admin/SectionManagement';
// Import các trang User
import HomePage from '../pages/public/HomePage';


// Component bảo vệ route Admin
const ProtectedRoute = () => {
    const { token } = useAuth();
    return token ? <AdminLayout /> : <Navigate to="/admin/login" replace />;
};

const UserProtectedRoute = ({ children }) => {
    const userToken = localStorage.getItem('userToken');
    return userToken ? children : <Navigate to="/login" replace />;
};

const AppRoutes = () => {
    return (
        <Routes>
            {/* === ROUTE ADMIN === */}
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route element={<ProtectedRoute />}>
                <Route path="/admin/dashboard" element={<Dashboard />} />
                <Route path="/admin/users" element={<UserManagement />} />
                <Route path="/admin/products" element={<ProductManagement />} />
                <Route path="/admin/products/new" element={<ProductForm />} />
                <Route path="/admin/products/edit/:id" element={<ProductForm />} />
                <Route path="/admin/categories" element={<CategoryManagement />} />
                <Route path="/admin/orders" element={<OrderManagement />} />
                <Route path="/admin/orders/:id" element={<OrderDetail />} />
                <Route path="/admin/vouchers" element={<VoucherManagement />} />
                <Route path="/admin/flash-sales" element={<FlashSaleManagement />} />
                <Route path="/admin/flash-sales/new" element={<FlashSaleForm />} />
                <Route path="/admin/flash-sales/edit/:id" element={<FlashSaleForm />} />
                <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
                <Route path="/admin/brands" element={<BrandManagement />} />
                <Route path="/admin/collections" element={<CollectionManagement />} />
                <Route path="/admin/banners" element={<BannerManagement />} />
                <Route path="/admin/sections" element={<SectionManagement />} />
            </Route>

            {/* === ROUTE USER (NẰM TRONG MAINLAYOUT) === */}
            <Route element={<MainLayout />}>
                <Route path="/" element={<HomePage />} />
                <Route path="/register" element={<Register />} />
                 <Route path="/login" element={<Login />} />
                 <Route 
                    path="/my-account" 
                    element={
                        <UserProtectedRoute>
                            <MyAccount />
                        </UserProtectedRoute>
                    } 
                />
                {/* Các trang khác của user như /products, /cart... sẽ thêm vào đây */}
            </Route>
        </Routes>
    );
};

export default AppRoutes;