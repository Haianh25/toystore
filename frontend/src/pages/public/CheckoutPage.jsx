import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { FaCheckCircle, FaChevronRight } from 'react-icons/fa';
import './CheckoutPage.css';

const CheckoutPage = () => {
    const { cartItems, totalPrice, clearCart } = useCart();
    const { userToken } = useAuth();
    const navigate = useNavigate();

    const [step, setStep] = useState(1); // 1: Shipping, 2: Review
    const [shippingInfo, setShippingInfo] = useState({
        fullName: '', phone: '', street: '', ward: '', district: '', city: ''
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
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
        } else {
            setLoading(false);
        }
    }, [userToken]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setShippingInfo(prev => ({ ...prev, [name]: value }));
    };

    const handleNextStep = (e) => {
        e.preventDefault();
        setStep(2);
        window.scrollTo(0, 0);
    };

    const handlePlaceOrder = async () => {
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

    if (loading) return (
        <div className="luxury-loader">
            <span className="loader-text">DIOR</span>
        </div>
    );

    return (
        <div className="checkout-page-wrapper">
            <div className="checkout-stepper">
                <div className={`step ${step >= 1 ? 'active' : ''}`}>
                    <span className="step-num">01</span>
                    <span className="step-label">SHIPPING</span>
                </div>
                <div className="step-divider"><FaChevronRight /></div>
                <div className={`step ${step >= 2 ? 'active' : ''}`}>
                    <span className="step-num">02</span>
                    <span className="step-label">REVIEW & PLACE ORDER</span>
                </div>
            </div>

            <div className="checkout-main-grid">
                {step === 1 ? (
                    <div className="checkout-form-container">
                        <h2 className="dior-serif-title">SHIPPING DETAILS</h2>
                        <form onSubmit={handleNextStep} className="dior-form">
                            <div className="form-row">
                                <div className="dior-input-group">
                                    <label>FULL NAME</label>
                                    <input type="text" name="fullName" value={shippingInfo.fullName} onChange={handleChange} required />
                                </div>
                                <div className="dior-input-group">
                                    <label>PHONE NUMBER</label>
                                    <input type="tel" name="phone" value={shippingInfo.phone} onChange={handleChange} required />
                                </div>
                            </div>
                            <div className="dior-input-group">
                                <label>STREET ADDRESS</label>
                                <input type="text" name="street" value={shippingInfo.street} onChange={handleChange} required />
                            </div>
                            <div className="form-row-tri">
                                <div className="dior-input-group">
                                    <label>WARD</label>
                                    <input type="text" name="ward" value={shippingInfo.ward} onChange={handleChange} required />
                                </div>
                                <div className="dior-input-group">
                                    <label>DISTRICT</label>
                                    <input type="text" name="district" value={shippingInfo.district} onChange={handleChange} required />
                                </div>
                                <div className="dior-input-group">
                                    <label>CITY</label>
                                    <input type="text" name="city" value={shippingInfo.city} onChange={handleChange} required />
                                </div>
                            </div>
                            <button type="submit" className="dior-button-dark next-btn">
                                CONTINUE TO REVIEW
                            </button>
                        </form>
                    </div>
                ) : (
                    <div className="checkout-review-container">
                        <h2 className="dior-serif-title">REVIEW YOUR ORDER</h2>
                        <div className="review-shipping-info">
                            <h3>SHIPPING TO:</h3>
                            <p>{shippingInfo.fullName} | {shippingInfo.phone}</p>
                            <p>{shippingInfo.street}, {shippingInfo.ward}, {shippingInfo.district}, {shippingInfo.city}</p>
                            <button className="edit-step-btn" onClick={() => setStep(1)}>EDIT SHIPPING</button>
                        </div>

                        <div className="review-items-list">
                            {cartItems.map(item => (
                                <div key={item.product._id} className="review-item">
                                    <div className="review-item-main">
                                        <span className="review-item-name">{item.product.name}</span>
                                        <span className="review-item-qty">QTY: {item.quantity}</span>
                                    </div>
                                    <span className="review-item-price">
                                        {(item.product.sellPrice * item.quantity).toLocaleString('vi-VN')} VND
                                    </span>
                                </div>
                            ))}
                        </div>

                        <div className="payment-method-badge">
                            <FaCheckCircle /> PAYMENT ON DELIVERY (COD)
                        </div>

                        {error && <p className="dior-error-message">{error}</p>}

                        <div className="review-actions">
                            <button onClick={handlePlaceOrder} className="dior-button-dark place-order-btn">
                                PLACE ORDER & COMPLETE
                            </button>
                        </div>
                    </div>
                )}

                <div className="checkout-summary-column">
                    <div className="dior-summary-card">
                        <h2 className="summary-title">YOUR SELECTION</h2>
                        <div className="summary-row">
                            <span>SUBTOTAL</span>
                            <span>{totalPrice.toLocaleString('vi-VN')} VND</span>
                        </div>
                        <div className="summary-row">
                            <span>SHIPPING</span>
                            <span className="complimentary">COMPLIMENTARY</span>
                        </div>
                        <div className="summary-divider"></div>
                        <div className="summary-row total">
                            <span>TOTAL</span>
                            <span>{totalPrice.toLocaleString('vi-VN')} VND</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CheckoutPage;
