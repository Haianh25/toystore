import React from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import Sidebar from '../components/admin/Sidebar';
import { useAuth } from '../context/AuthContext';
import { useSocket } from '../context/SocketContext';
import { useToast } from '../context/ToastContext';
import './AdminLayout.css';

const AdminLayout = () => {
    const { logout } = useAuth();
    const socket = useSocket();
    const { showToast } = useToast();
    const navigate = useNavigate();

    React.useEffect(() => {
        if (!socket) return;

        socket.on('newOrder', (data) => {
            showToast(`🔔 Đơn hàng mới: #${data.orderId?.slice(-6) || ''}`, "success");
            // Sound notification
            const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3');
            audio.play().catch(e => console.log("Audio play blocked:", e));
        });

        return () => {
            socket.off('newOrder');
        };
    }, [socket, showToast]);

    const handleLogout = () => {
        logout();
        navigate('/admin/login');
    };

    return (
        <div className="admin-layout">
            <Sidebar />
            <main className="admin-content">
                <div className="admin-header">
                    <button className="btn-logout" onClick={handleLogout}>
                        Đăng xuất
                    </button>
                </div>
                <Outlet /> {/* Đây là nơi các trang con sẽ được render */}
            </main>
        </div>
    );
};

export default AdminLayout;