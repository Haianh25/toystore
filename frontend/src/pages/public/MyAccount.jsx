import React, { useState, useEffect } from 'react'; // Sửa lại dòng này
import axios from 'axios';
import { API_URL } from '../../config/api';
import './MyAccount.css';
import OrderHistory from './OrderHistory';

const MyAccount = () => {
    const [user, setUser] = useState(null);
    const [formData, setFormData] = useState({
        fullName: '',
        phone: '',
        address: { street: '', ward: '', district: '', city: '' }
    });
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const apiConfig = { headers: { Authorization: `Bearer ${localStorage.getItem('userToken')}` } };

    const fetchUserData = async () => {
        try {
            const res = await axios.get(`${API_URL}/api/v1/users/me`, apiConfig);
            const userData = res.data.data.user;
            setUser(userData);
            setFormData({
                fullName: userData.fullName || '',
                phone: userData.phone || '',
                address: userData.address || { street: '', ward: '', district: '', city: '' }
            });
        } catch (err) {
            console.error("Lỗi tải thông tin user:", err);
            setError('Không thể tải thông tin tài khoản.');
        }
    };

    useEffect(() => {
        fetchUserData();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleAddressChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            address: {
                ...prev.address,
                [name]: value
            }
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        setError('');
        try {
            const res = await axios.patch(`${API_URL}/api/v1/users/updateMe`, formData, apiConfig);
            setUser(res.data.data.user);
            setMessage('Cập nhật thông tin thành công!');
        } catch (err) {
            setError(err.response?.data?.message || 'Cập nhật thất bại. Vui lòng thử lại.');
        }
    };

    if (!user) return <p>Đang tải thông tin...</p>;

    return (
        <div className="account-container">
            <h1>Tài khoản của tôi</h1>
            {message && <p className="account-message message-success">{message}</p>}
            {error && <p className="account-message message-error">{error}</p>}

            <form onSubmit={handleSubmit} className="account-form">
                <div className="form-group">
                    <label>Email</label>
                    <input type="email" value={user.email} disabled />
                </div>
                <div className="form-group">
                    <label htmlFor="fullName">Họ và tên</label>
                    <input id="fullName" type="text" name="fullName" value={formData.fullName} onChange={handleChange} />
                </div>
                <div className="form-group">
                    <label htmlFor="phone">Số điện thoại</label>
                    <input id="phone" type="tel" name="phone" value={formData.phone} onChange={handleChange} />
                </div>

                <hr style={{ margin: '20px 0', border: 'none', borderTop: '1px solid #eee' }} />
                <h3>Địa chỉ giao hàng</h3>

                <div className="form-group">
                    <label htmlFor="street">Số nhà, tên đường</label>
                    <input id="street" type="text" name="street" value={formData.address.street} onChange={handleAddressChange} />
                </div>
                <div className="form-group">
                    <label htmlFor="ward">Phường / Xã</label>
                    <input id="ward" type="text" name="ward" value={formData.address.ward} onChange={handleAddressChange} />
                </div>
                <div className="form-group">
                    <label htmlFor="district">Quận / Huyện</label>
                    <input id="district" type="text" name="district" value={formData.address.district} onChange={handleAddressChange} />
                </div>
                <div className="form-group">
                    <label htmlFor="city">Tỉnh / Thành phố</label>
                    <input id="city" type="text" name="city" value={formData.address.city} onChange={handleAddressChange} />
                </div>

                <button type="submit">Lưu thay đổi</button>
            </form>

            <hr style={{ margin: '40px 0', border: 'none', borderTop: '1px solid #eee' }} />

            <OrderHistory />
        </div>
    );
};

export default MyAccount;