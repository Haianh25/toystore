import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { FaCheck } from 'react-icons/fa';
import './OrderSuccessPage.css';

const OrderSuccessPage = () => {
    const { orderId } = useParams();

    return (
        <div className="order-success-page-wrapper">
            <div className="success-content-card">
                <div className="success-icon-wrapper">
                    <FaCheck />
                </div>
                <h1 className="tdp-serif-title">THANK YOU FOR YOUR PURCHASE</h1>
                <p className="success-message">
                    Your order has been successfully placed and is now being processed.
                    An confirmation email will be sent to you shortly.
                </p>
                <div className="order-number-box">
                    <span>ORDER NUMBER</span>
                    <p className="order-id">#{orderId.slice(-8).toUpperCase()}</p>
                </div>
                <div className="success-actions">
                    <Link to="/my-account" className="tdp-button-dark">VIEW MY ORDERS</Link>
                    <Link to="/products" className="tdp-button-outline">CONTINUE EXPLORING</Link>
                </div>
            </div>
        </div>
    );
};

export default OrderSuccessPage;