import React from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { API_URL } from '../../config/api';
import { useToast } from '../../context/ToastContext';

const OrderTable = ({ orders, onRefresh }) => {
    const { showToast } = useToast();

    const handleQuickStatusUpdate = async (orderId, newStatus) => {
        try {
            const token = localStorage.getItem('adminToken');
            await axios.patch(`${API_URL}/api/v1/orders/${orderId}`, { status: newStatus }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            showToast("Cập nhật trạng thái thành công!", "success");
            if (onRefresh) onRefresh();
        } catch (error) {
            console.error("Lỗi cập nhật nhanh:", error);
            showToast(error.response?.data?.message || "Cập nhật thất bại", "error");
        }
    };

    const getStatusClass = (status) => {
        return `status-badge status-${status.toLowerCase()}`;
    };

    return (
        <table className="admin-table">
            <thead>
                <tr>
                    <th>Mã Đơn Hàng</th>
                    <th>Khách Hàng</th>
                    <th>Ngày Đặt</th>
                    <th>Tổng Tiền</th>
                    <th>Trạng Thái</th>
                    <th>Hành động</th>
                </tr>
            </thead>
            <tbody>
                {orders && orders.length > 0 ? orders.map(order => (
                    <tr key={order._id}>
                        <td>#{order._id.slice(-6)}</td>
                        <td>{order.user?.fullName || 'N/A'}</td>
                        <td>{new Date(order.createdAt).toLocaleDateString('vi-VN')}</td>
                        <td>{order.totalAmount.toLocaleString('vi-VN')} VND</td>
                        <td>
                            <span className={`status-${order.status.toLowerCase()}`}>{order.status}</span>
                        </td>
                        <td className="action-buttons" style={{ display: 'flex', gap: '5px' }}>
                            <Link to={`/admin/orders/${order._id}`} className="btn-outline" style={{ padding: '6px 10px', fontSize: '0.7rem' }}>Chi tiết</Link>

                            {order.status === 'Pending' && (
                                <button
                                    onClick={() => handleQuickStatusUpdate(order._id, 'Processing')}
                                    className="btn-primary"
                                    style={{ padding: '6px 10px', fontSize: '0.7rem', backgroundColor: '#2ecc71' }}
                                >
                                    Xác nhận
                                </button>
                            )}

                            {order.status === 'Processing' && (
                                <button
                                    onClick={() => handleQuickStatusUpdate(order._id, 'Shipped')}
                                    className="btn-primary"
                                    style={{ padding: '6px 10px', fontSize: '0.7rem', backgroundColor: '#3498db' }}
                                >
                                    Giao hàng
                                </button>
                            )}
                        </td>
                    </tr>
                )) : (
                    <tr>
                        <td colSpan="6" style={{ textAlign: 'center' }}>Chưa có đơn hàng nào.</td>
                    </tr>
                )}
            </tbody>
        </table>
    );
};

export default OrderTable;