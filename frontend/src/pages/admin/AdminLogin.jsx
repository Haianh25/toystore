import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { API_URL } from '../../config/api';
import './AdminLogin.css';

const AdminLogin = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { adminLogin } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const response = await axios.post(`${API_URL}/api/v1/auth/login`, {
                email,
                password,
            });

            if (response.data.status === 'success' && response.data.data.user.role === 'admin') {
                adminLogin(response.data.token);
                navigate('/admin/dashboard');
            } else {
                setError('UNAUTHORIZED ACCESS. ADMIN PRIVILEGES REQUIRED.');
            }
        } catch (err) {
            const errorMessage = err.response?.data?.message || 'AUTHENTICATION FAILED.';
            setError(errorMessage.toUpperCase());
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="admin-login-container">
            <form onSubmit={handleSubmit} className="login-form-box">
                <h2>TDP Admin</h2>

                <div className="input-group">
                    <input
                        type="email"
                        placeholder="EMAIL ADDRESS"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="login-input"
                    />
                </div>

                <div className="input-group">
                    <input
                        type="password"
                        placeholder="PASSWORD"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="login-input"
                    />
                </div>

                {error && <p className="error-message">{error}</p>}

                <button
                    type="submit"
                    disabled={loading}
                    className="btn-signin"
                >
                    {loading ? 'AUTHENTICATING...' : 'SIGN IN'}
                </button>
            </form>
        </div>
    );
};


export default AdminLogin;