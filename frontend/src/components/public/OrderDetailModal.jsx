import React, { useState } from 'react';
import axios from 'axios';
import { API_URL } from '../../config/api';
import './OrderDetailModal.css';

const OrderDetailModal = ({ orderId, onClose }) => {
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);

    React.useEffect(() => {
        const fetchOrderDetail = async () => {
            try {
                const token = localStorage.getItem('userToken');
                const res = await axios.get(`${API_URL}/api/v1/orders/${orderId}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setOrder(res.data.data.order); // Adjust based on controller response structure
            } catch (error) {
                console.error("Lỗi tải chi tiết đơn hàng:", error);
                const message = error.response?.data?.message || "Không thể tải chi tiết đơn hàng.";
                console.log("Error details:", message);
                alert(message);
                onClose();
            } finally {
                setLoading(false);
            }
        };
        fetchOrderDetail();
    }, [orderId, onClose]);

    const handleDownloadInvoice = async () => {
        try {
            const token = localStorage.getItem('userToken');
            const res = await axios.get(`${API_URL}/api/v1/orders/${orderId}/invoice`, {
                headers: { Authorization: `Bearer ${token}` },
                responseType: 'blob'
            });

            // Create a blob URL and trigger download
            const url = window.URL.createObjectURL(new Blob([res.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `invoice-${orderId.slice(-6).toUpperCase()}.pdf`);
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (error) {
            console.error("Lỗi tải hóa đơn:", error);
            alert("Không thể tải hóa đơn. Vui lòng thử lại sau.");
        }
    };

    if (!loading && !order) return null;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
                <button className="close-btn" onClick={onClose}>&times;</button>
                {loading ? (
                    <div className="tdp-loader">Loading...</div>
                ) : (
                    <div className="order-detail-content">
                        <h2>ORDER #{order._id.slice(-6).toUpperCase()}</h2>
                        <div className="order-meta">
                            <p><strong>Date:</strong> {new Date(order.createdAt).toLocaleDateString('vi-VN')}</p>
                            <p><strong>Status:</strong> <span className={`status-badge ${order.status.toLowerCase()}`}>{order.status}</span></p>
                            <p><strong>Payment:</strong> {order.isPaid ? <span className="status-badge paid">PAID ({new Date(order.paidAt).toLocaleDateString('vi-VN')})</span> : <span className="status-badge pending">UNPAID</span>}</p>
                            {order.isDelivered && (
                                <p><strong>Delivery:</strong> <span className="status-badge delivered">DELIVERED ({new Date(order.deliveredAt).toLocaleDateString('vi-VN')})</span></p>
                            )}
                            <p><strong>Total:</strong> {order.totalAmount.toLocaleString('vi-VN')} VND</p>
                            {order.discount > 0 && (
                                <p><strong>Discount:</strong> -{order.discount.toLocaleString('vi-VN')} VND</p>
                            )}
                            <div className="order-actions" style={{ marginTop: '20px' }}>
                                <button
                                    className="tdp-button-dark download-invoice-btn"
                                    onClick={handleDownloadInvoice}
                                >
                                    DOWNLOAD INVOICE (PDF)
                                </button>
                            </div>
                        </div>

                        <div className="order-items-list">
                            {order.products.map(item => (
                                <div key={item._id} className="order-item-row">
                                    <div className="item-img">
                                        {item.product ? (
                                            <img src={`${API_URL}${item.product.mainImage}`} alt={item.product.name} />
                                        ) : (
                                            <div className="item-placeholder">No Image</div>
                                        )}
                                    </div>
                                    <div className="item-info">
                                        <h4>{item.product ? item.product.name : 'Sản phẩm không còn tồn tại'}</h4>
                                        <p>Qty: {item.quantity}</p>
                                        <p>{item.price.toLocaleString('vi-VN')} VND</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="shipping-info-block">
                            <h3>Shipping Address</h3>
                            <p>{order.shippingAddress.fullName}</p>
                            <p>{order.shippingAddress.phone}</p>
                            <p>{order.shippingAddress.street}, {order.shippingAddress.ward}</p>
                            <p>{order.shippingAddress.district}, {order.shippingAddress.city}</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default OrderDetailModal;
