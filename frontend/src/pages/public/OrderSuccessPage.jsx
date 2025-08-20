import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { FaCheckCircle } from 'react-icons/fa';
import './OrderSuccessPage.css';

const OrderSuccessPage = () => {
    const { orderId } = useParams();

    return (
        <div className="order-success-container">
            <FaCheckCircle className="success-icon" />
            <h1>Đặt hàng thành công!</h1>
            <p>Cảm ơn bạn đã mua hàng. Mã đơn hàng của bạn là:</p>
            <p className="order-id">#{orderId.slice(-8)}</p>
            <p>Chúng tôi sẽ liên hệ với bạn để xác nhận đơn hàng trong thời gian sớm nhất.</p>
            <div className="action-links">
                <Link to="/products" className="btn-secondary">Tiếp tục mua sắm</Link>
                <Link to="/my-account" className="btn-primary">Xem lịch sử đơn hàng</Link>
            </div>
        </div>
    );
};

export default OrderSuccessPage;