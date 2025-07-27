import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext'; // <-- Import useAuth

const AdminLogin = () => {
    const [email, setEmail] = useState('admin@gmail.com');
    const [password, setPassword] = useState('password123');
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const { login } = useAuth(); // <-- Lấy hàm login từ context

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:5000/api/v1/auth/login', { email, password });
            
            if (response.data.data.user.role !== 'admin') {
                setError('Tài khoản không có quyền truy cập.');
                return;
            }
            
            login(response.data.token); // <-- Dùng hàm login từ context
            nnavigate('/admin/dashboard'); // Chuyển hướng sau khi đăng nhập thành công
        } catch (err) {
            setError(err.response?.data?.message || 'Đăng nhập thất bại.');
        }
    };

    // Giao diện JSX của bạn giữ nguyên hoặc dùng code từ lần trước
    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
            <form onSubmit={handleSubmit} style={{ padding: '40px', background: 'white', borderRadius: '8px', boxShadow: '0 4px 8px rgba(0,0,0,0.1)', width: '350px' }}>
                <h2 style={{ textAlign: 'center', marginBottom: '24px' }}>Đăng Nhập Admin</h2>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" required style={{ width: '100%', padding: '10px', marginBottom: '16px' }} />
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Mật khẩu" required style={{ width: '100%', padding: '10px', marginBottom: '16px' }} />
                {error && <p style={{ color: 'red' }}>{error}</p>}
                <button type="submit" style={{ width: '100%', padding: '12px', cursor: 'pointer' }}>Đăng Nhập</button>
            </form>
        </div>
    );
};

export default AdminLogin;