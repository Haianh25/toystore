import React from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import Sidebar from '../components/admin/Sidebar';
import { useAuth } from '../context/AuthContext';

const AdminLayout = () => {
    const { logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/admin/login');
    };

    return (
        <div style={{ display: 'flex' }}>
            <Sidebar />
            <main style={{ flexGrow: 1, padding: '20px' }}>
                <div style={{ textAlign: 'right', marginBottom: '20px' }}>
                    <button onClick={handleLogout} style={{ padding: '8px 16px', cursor: 'pointer' }}>
                        Đăng xuất
                    </button>
                </div>
                <Outlet /> {/* Đây là nơi các trang con sẽ được render */}
            </main>
        </div>
    );
};

export default AdminLayout;