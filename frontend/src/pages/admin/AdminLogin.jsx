import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const AdminLogin = () => {
    const [email, setEmail] = useState('admin@gmail.com');
    const [password, setPassword] = useState('password123');
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const { login } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        try {
            const response = await axios.post('http://localhost:5000/api/v1/auth/login', {
                email,
                password,
            });
            
            // Kiểm tra dữ liệu trả về có đúng cấu trúc và user có phải admin không
            if (response.data.status === 'success' && response.data.data.user.role === 'admin') {
                // Đăng nhập thành công
                login(response.data.token);
                navigate('/admin/dashboard');
            } else {
                // Trường hợp đăng nhập thành công nhưng không phải admin
                setError('Tài khoản của bạn không có quyền truy cập trang quản trị.');
            }
        } catch (err) {
            const errorMessage = err.response?.data?.message || 'Đăng nhập thất bại. Vui lòng thử lại.';
            setError(errorMessage);
        }
    };

    // Giao diện JSX của bạn
    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#f7f7f7' }}>
            <form onSubmit={handleSubmit} style={{ padding: '40px', background: 'white', borderRadius: '8px', boxShadow: '0 4px 8px rgba(0,0,0,0.1)', width: '350px' }}>
                <h2 style={{ textAlign: 'center', marginBottom: '24px' }}>Đăng Nhập Admin</h2>
                
                <div style={{ marginBottom: '16px' }}>
                    <label htmlFor="email">Email</label>
                    <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        style={{ width: '100%', padding: '10px', marginTop: '4px', borderRadius: '4px', border: '1px solid #ccc' }}
                    />
                </div>

                <div style={{ marginBottom: '24px' }}>
                    <label htmlFor="password">Mật khẩu</label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        style={{ width: '100%', padding: '10px', marginTop: '4px', borderRadius: '4px', border: '1px solid #ccc' }}
                    />
                </div>

                {error && <p style={{ color: 'red', textAlign: 'center', marginBottom: '16px' }}>{error}</p>}

                <button type="submit" style={{ width: '100%', padding: '12px', border: 'none', borderRadius: '4px', backgroundColor: '#007bff', color: 'white', cursor: 'pointer', fontSize: '16px' }}>
                    Đăng Nhập
                </button>
            </form>
        </div>
    );
};

export default AdminLogin;