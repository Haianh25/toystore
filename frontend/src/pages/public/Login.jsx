import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';

const Login = () => {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const isVerified = searchParams.get('verified') === 'true';

    const handleChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = async e => {
        e.preventDefault();
        setError('');
        try {
            // 1. Gọi API đăng nhập thật
            const response = await axios.post('http://localhost:5000/api/v1/auth/login', formData);

            // 2. Kiểm tra phản hồi và lấy token
            if (response.data.status === 'success' && response.data.token) {
                // 3. Lưu token vào localStorage của trình duyệt
                localStorage.setItem('userToken', response.data.token);
                // (Lưu ý: dùng key 'userToken' cho người dùng, 'adminToken' cho admin)

                // 4. Chuyển hướng về trang chủ
                navigate('/');
            } else {
                setError('Không nhận được token. Vui lòng thử lại.');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Email hoặc mật khẩu không chính xác.');
        }
    };

    return (
        <div style={{ maxWidth: '400px', margin: '50px auto', padding: '20px', textAlign: 'center', border: '1px solid #ddd', borderRadius: '8px' }}>
            <h2>Đăng nhập</h2>
            {isVerified && <p style={{ color: 'green', padding: '10px', border: '1px solid green', borderRadius: '4px' }}>Xác thực email thành công! Bây giờ bạn có thể đăng nhập.</p>}
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginTop: '20px' }}>
                <input type="email" name="email" placeholder="Email" onChange={handleChange} required style={{padding: '12px', borderRadius: '4px', border: '1px solid #ccc'}} />
                <input type="password" name="password" placeholder="Mật khẩu" onChange={handleChange} required style={{padding: '12px', borderRadius: '4px', border: '1px solid #ccc'}} />
                <button type="submit" style={{padding: '12px', cursor: 'pointer', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px', fontSize: '1rem' }}>Đăng nhập</button>
            </form>
            <p style={{marginTop: '20px'}}>Chưa có tài khoản? <Link to="/register">Đăng ký</Link></p>
        </div>
    );
};

export default Login;