import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { API_URL } from '../../config/api';
import './Register.css';

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
            const res = await axios.post(`${API_URL}/api/v1/auth/signup`, formData);
            setMessage(res.data.message);
        } catch (err) {
            setError(err.response?.data?.message || 'Có lỗi xảy ra.');
        }
    };

    return (
        <div className="register-page-container">
            <div className="auth-card">
                <h2>Create Account</h2>

                {message && <p className="auth-message success">{message}</p>}
                {error && <p className="auth-message error">{error}</p>}

                {!message && (
                    <form onSubmit={handleSubmit} className="tdp-form">
                        <div className="tdp-input-group">
                            <input name="fullName" placeholder="FULL NAME" onChange={handleChange} required className="tdp-input" />
                        </div>
                        <div className="tdp-input-group">
                            <input type="email" name="email" placeholder="EMAIL ADDRESS" onChange={handleChange} required className="tdp-input" />
                        </div>
                        <div className="tdp-input-group">
                            <input type="tel" name="phone" placeholder="PHONE NUMBER" onChange={handleChange} required className="tdp-input" />
                        </div>
                        <div className="tdp-input-group">
                            <input type="password" name="password" placeholder="PASSWORD" onChange={handleChange} required className="tdp-input" />
                        </div>
                        <button type="submit" className="btn-tdp-primary">Create Account</button>
                    </form>
                )}

                <p className="auth-footer">
                    Already have an account? <Link to="/login">Sign In</Link>
                </p>
            </div>
        </div>
    );
};

export default Register;