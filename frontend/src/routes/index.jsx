import React from 'react';
import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Import Layout
import AdminLayout from '../layouts/AdminLayout';

// Import các trang
import AdminLogin from '../pages/admin/AdminLogin';
import Dashboard from '../pages/admin/Dashboard';
import UserManagement from '../pages/admin/UserManagement';
import ProductManagement from '../pages/admin/ProductManagement';
import CategoryManagement from '../pages/admin/CategoryManagement';
import OrderManagement from '../pages/admin/OrderManagement';
import ProductForm from '../pages/admin/ProductForm';
import OrderDetail from '../pages/admin/OrderDetail';

// Component bảo vệ route
const ProtectedRoute = () => {
    const { token } = useAuth();
    return token ? <AdminLayout /> : <Navigate to="/admin/login" replace />;
};

const AppRoutes = () => {
    return (
        <Routes>
            {/* Route công khai */}
            <Route path="/admin/login" element={<AdminLogin />} />

            {/* Gom các route admin vào trong ProtectedRoute */}
            <Route element={<ProtectedRoute />}>
                <Route path="/admin/dashboard" element={<Dashboard />} />
                <Route path="/admin/users" element={<UserManagement />} />
                <Route path="/admin/products" element={<ProductManagement />} />
                <Route path="/admin/categories" element={<CategoryManagement />} />
                <Route path="/admin/orders" element={<OrderManagement />} />
                {/* Route mặc định cho admin, chuyển hướng đến dashboard */}
                <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
                <Route path="/admin/products/new" element={<ProductForm />} />
                <Route path="/admin/products/edit/:id" element={<ProductForm />} />
                <Route path="/admin/orders/:id" element={<OrderDetail />} />
            </Route>

            {/* Route trang chủ */}
            <Route path="/" element={<h1>Trang Chủ User</h1>} />
        </Routes>
    );
};

export default AppRoutes;