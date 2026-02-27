import React, { useState, useEffect } from 'react'; // Sửa lại dòng này
import axios from 'axios';
import { API_URL } from '../../config/api';
import './MyAccount.css';
import OrderHistory from './OrderHistory';
import { useNotifications } from '../../hooks/useNotifications';

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
    const { isSubscribed, subscribeUser } = useNotifications(localStorage.getItem('userToken'));

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
        document.title = "Tài khoản của tôi | TheDevilPlayz";
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

            <div className="notification-subscription" style={{ marginBottom: '30px', padding: '20px', border: '1px solid #e0be8d', background: '#fffcf7', borderRadius: '4px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <h4 style={{ margin: 0, color: '#1a1a1a', letterSpacing: '0.1em' }}>THÔNG BÁO TỨC THÌ</h4>
                    <p style={{ margin: '8px 0 0', fontSize: '0.85rem', color: '#666', lineHeight: '1.4' }}>Nhận thông báo Real-time khi có Flash Sale mới hoặc cập nhật trạng thái đơn hàng của bạn.</p>
                </div>
                {!isSubscribed ? (
                    <button
                        onClick={subscribeUser}
                        className="tdp-button-dark"
                        style={{ padding: '10px 20px', fontSize: '0.75rem', minWidth: '150px' }}
                    >
                        BẬT THÔNG BÁO
                    </button>
                ) : (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#27ae60', fontWeight: 600, fontSize: '0.85rem' }}>
                        <span style={{ width: '8px', height: '8px', backgroundColor: '#27ae60', borderRadius: '50%', display: 'inline-block' }}></span>
                        ĐÃ KÍCH HOẠT
                    </div>
                )}
            </div>

            {/* BRICKPOINTS LOYALTY CARD */}
            <div className="brickpoints-luxury-card glass-panel">
                <div className="brickpoints-header">
                    <div className="brickpoints-info">
                        <span className="label">LOYALTY STATUS</span>
                        <h2 className="points-value">{user.brickPoints || 0} <small>BRICKPOINTS</small></h2>
                    </div>
                    <div className="hero-rank">
                        <span className="rank-name">COLLECTOR LEVEL: {user.brickPoints >= 500 ? 'HERO' : user.brickPoints >= 100 ? 'SENTINEL' : 'RECRUIT'}</span>
                    </div>
                </div>
                <div className="points-progress-container">
                    <div className="progress-bar">
                        <div
                            className="progress-fill"
                            style={{ width: `${Math.min(100, ((user.brickPoints || 0) % 500) / 5)}%` }}
                        ></div>
                    </div>
                    <div className="progress-labels">
                        <span>{user.brickPoints || 0} PTS</span>
                        <span>NEXT TIER: {user.brickPoints >= 500 ? 'MAX' : user.brickPoints >= 100 ? '500 PTS' : '100 PTS'}</span>
                    </div>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="account-form">
                <div className="form-group full-width">
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

                <div className="address-section">
                    <h3 className="full-width">Địa chỉ giao hàng</h3>

                    <div className="form-group full-width">
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
                    <div className="form-group full-width">
                        <label htmlFor="city">Tỉnh / Thành phố</label>
                        <input id="city" type="text" name="city" value={formData.address.city} onChange={handleAddressChange} />
                    </div>
                </div>

                <button type="submit">Lưu thay đổi</button>
            </form>

            <hr style={{ margin: '40px 0', border: 'none', borderTop: '1px solid #eee' }} />

            <OrderHistory />
        </div>
    );
};

export default MyAccount;