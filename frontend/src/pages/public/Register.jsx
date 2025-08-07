import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const Register = () => {
    const [formData, setFormData] = useState({ fullName: '', email: '', phone: '', password: '' });
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const handleChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = async e => {
        e.preventDefault();
        setError('');
        setMessage('');
        try {
            const res = await axios.post('http://localhost:5000/api/v1/auth/signup', formData);
            setMessage(res.data.message);
        } catch (err) {
            setError(err.response?.data?.message || 'Có lỗi xảy ra.');
        }
    };
    
    return (
        <div style={{ maxWidth: '400px', margin: '50px auto', padding: '20px', textAlign: 'center' }}>
            <h2>Đăng ký tài khoản</h2>
            {message && <p style={{ color: 'green', padding: '10px', border: '1px solid green', borderRadius: '4px' }}>{message}</p>}
            {error && <p style={{ color: 'red' }}>{error}</p>}
            
            {!message && (
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                    <input name="fullName" placeholder="Họ và Tên" onChange={handleChange} required style={{padding: '10px'}} />
                    <input type="email" name="email" placeholder="Email" onChange={handleChange} required style={{padding: '10px'}} />
                    <input type="tel" name="phone" placeholder="Số điện thoại" onChange={handleChange} required style={{padding: '10px'}} />
                    <input type="password" name="password" placeholder="Mật khẩu" onChange={handleChange} required style={{padding: '10px'}} />
                    <button type="submit" style={{padding: '10px', cursor: 'pointer'}}>Đăng ký</button>
                </form>
            )}
            <p style={{marginTop: '20px'}}>Đã có tài khoản? <Link to="/login">Đăng nhập</Link></p>
        </div>
    );
};

export default Register;