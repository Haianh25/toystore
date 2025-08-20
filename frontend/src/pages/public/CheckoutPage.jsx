import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import './CheckoutPage.css';

const CheckoutPage = () => {
    const { cartItems, totalPrice, clearCart } = useCart();
    const { userToken } = useAuth();
    const navigate = useNavigate();
    
    const [shippingInfo, setShippingInfo] = useState({
        fullName: '', phone: '', street: '', ward: '', district: '', city: ''
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        // Tải thông tin người dùng để điền sẵn vào form
        const fetchUserData = async () => {
            try {
                const apiConfig = { headers: { Authorization: `Bearer ${userToken}` } };
                const res = await axios.get('http://localhost:5000/api/v1/users/me', apiConfig);
                const { fullName, phone, address } = res.data.data.user;
                setShippingInfo({
                    fullName: fullName || '',
                    phone: phone || '',
                    street: address?.street || '',
                    ward: address?.ward || '',
                    district: address?.district || '',
                    city: address?.city || ''
                });
            } catch (err) {
                console.error("Lỗi tải thông tin user:", err);
            } finally {
                setLoading(false);
            }
        };

        if (userToken) {
            fetchUserData();
        }
    }, [userToken]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setShippingInfo(prev => ({ ...prev, [name]: value }));
    };

    const handlePlaceOrder = async (e) => {
        e.preventDefault();
        setError('');

        const orderData = {
            products: cartItems.map(item => ({
                product: item.product._id,
                quantity: item.quantity,
                price: item.product.sellPrice
            })),
            shippingAddress: shippingInfo,
            totalAmount: totalPrice,
            paymentMethod: 'COD'
        };

        try {
            const apiConfig = { headers: { Authorization: `Bearer ${userToken}` } };
            const res = await axios.post('http://localhost:5000/api/v1/orders', orderData, apiConfig);
            
            if (res.data.status === 'success') {
                const newOrderId = res.data.data.order._id;
                clearCart();
                navigate(`/order-success/${newOrderId}`);
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Đã có lỗi xảy ra. Vui lòng thử lại.');
        }
    };

    if (loading) return <p>Đang tải...</p>;

    return (
        <div className="checkout-container">
            <h1>Thanh toán</h1>
            <form onSubmit={handlePlaceOrder} className="checkout-layout">
                <div className="shipping-details">
                    <h2>Thông tin giao hàng</h2>
                    <div className="form-group">
                        <label>Họ và tên</label>
                        <input type="text" name="fullName" value={shippingInfo.fullName} onChange={handleChange} required />
                    </div>
                    <div className="form-group">
                        <label>Số điện thoại</label>
                        <input type="tel" name="phone" value={shippingInfo.phone} onChange={handleChange} required />
                    </div>
                    <div className="form-group">
                        <label>Số nhà, tên đường</label>
                        <input type="text" name="street" value={shippingInfo.street} onChange={handleChange} required />
                    </div>
                    <div className="form-group">
                        <label>Phường/Xã</label>
                        <input type="text" name="ward" value={shippingInfo.ward} onChange={handleChange} required />
                    </div>
                    <div className="form-group">
                        <label>Quận/Huyện</label>
                        <input type="text" name="district" value={shippingInfo.district} onChange={handleChange} required />
                    </div>
                    <div className="form-group">
                        <label>Tỉnh/Thành phố</label>
                        <input type="text" name="city" value={shippingInfo.city} onChange={handleChange} required />
                    </div>
                </div>

                <div className="order-summary">
                    <h2>Đơn hàng của bạn</h2>
                    {cartItems.map(item => (
                        <div key={item.product._id} className="summary-item">
                            <span>{item.product.name} x {item.quantity}</span>
                            <span>{(item.product.sellPrice * item.quantity).toLocaleString('vi-VN')} VND</span>
                        </div>
                    ))}
                    <div className="summary-total">
                        <strong>Tổng cộng:</strong>
                        <strong>{totalPrice.toLocaleString('vi-VN')} VND</strong>
                    </div>
                    <div className="payment-method">
                        <h4>Phương thức thanh toán</h4>
                        <p>✔️ Thanh toán khi nhận hàng (COD)</p>
                    </div>
                    {error && <p className="error-message">{error}</p>}
                    <button type="submit" className="place-order-btn">
                        Đặt hàng
                    </button>
                </div>
            </form>
        </div>
    );
};

export default CheckoutPage;