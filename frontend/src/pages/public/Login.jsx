import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { API_URL } from '../../config/api';
import './Login.css';

const Login = () => {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const isVerified = searchParams.get('verified') === 'true';
    const { userLogin } = useAuth(); // Lấy hàm userLogin từ context

    const handleChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = async e => {
        e.preventDefault();
        setError('');
        try {
            const response = await axios.post(`${API_URL}/api/v1/auth/login`, formData);
            if (response.data.status === 'success' && response.data.token) {
                userLogin(response.data.token); // Dùng hàm từ context để lưu token và cập nhật state
                navigate('/');
            } else {
                setError('Không nhận được token. Vui lòng thử lại.');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Email hoặc mật khẩu không chính xác.');
        }
    };

    return (
        <div className="login-page-container">
            <div className="auth-card">
                <h2>Sign In</h2>

                {isVerified && <p className="auth-message success">Email verified successfully! You can now log in.</p>}
                {error && <p className="auth-message error">{error}</p>}

                <form onSubmit={handleSubmit} className="dior-form">
                    <div className="dior-input-group">
                        <input
                            type="email"
                            name="email"
                            placeholder="EMAIL ADDRESS"
                            onChange={handleChange}
                            required
                            className="dior-input"
                        />
                    </div>
                    <div className="dior-input-group">
                        <input
                            type="password"
                            name="password"
                            placeholder="PASSWORD"
                            onChange={handleChange}
                            required
                            className="dior-input"
                        />
                    </div>
                    <button type="submit" className="btn-dior-primary">Sign In</button>
                </form>

                <p className="auth-footer">
                    New to Maison? <Link to="/register">Create an Account</Link>
                </p>
            </div>
        </div>
    );
};

export default Login;