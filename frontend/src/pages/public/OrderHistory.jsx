import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_URL } from '../../config/api';
import OrderDetailModal from '../../components/public/OrderDetailModal'; // Import modal

const OrderHistory = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedOrderId, setSelectedOrderId] = useState(null); // State for modal

    const apiConfig = { headers: { Authorization: `Bearer ${localStorage.getItem('userToken')}` } };

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const res = await axios.get(`${API_URL}/api/v1/orders/my-orders`, apiConfig);
                setOrders(res.data.data.orders);
            } catch (error) {
                console.error("Lỗi tải lịch sử đơn hàng:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchOrders();
    }, []);

    const handleViewDetail = (orderId) => {
        setSelectedOrderId(orderId);
    };

    const handleCloseModal = () => {
        setSelectedOrderId(null);
    };

    if (loading) return <p>Đang tải lịch sử đơn hàng...</p>;

    return (
        <div className="order-history-section">
            <h3 className="section-title">Lịch sử đơn hàng</h3>
            {orders.length === 0 ? (
                <p className="no-orders">Bạn chưa có đơn hàng nào.</p>
            ) : (
                <div className="orders-grid">
                    <div className="orders-header">
                        <span>Mã đơn</span>
                        <span>Ngày đặt</span>
                        <span>Tổng tiền</span>
                        <span>Trạng thái</span>
                        <span>Hành động</span>
                    </div>
                    {orders.map(order => (
                        <div key={order._id} className="order-row">
                            <span className="order-id">#{order._id.slice(-6).toUpperCase()}</span>
                            <span>{new Date(order.createdAt).toLocaleDateString('vi-VN')}</span>
                            <span className="order-total">{order.totalAmount.toLocaleString('vi-VN')} VND</span>
                            <span>
                                <span className={`status-badge ${order.status.toLowerCase()}`}>
                                    {order.status}
                                </span>
                            </span>
                            <span>
                                <button className="btn-detail" onClick={() => handleViewDetail(order._id)}>
                                    Chi tiết
                                </button>
                            </span>
                        </div>
                    ))}
                </div>
            )}

            {selectedOrderId && (
                <OrderDetailModal orderId={selectedOrderId} onClose={handleCloseModal} />
            )}
        </div>
    );
};

export default OrderHistory;
