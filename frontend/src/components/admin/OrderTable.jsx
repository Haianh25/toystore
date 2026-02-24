import React from 'react';
import { Link } from 'react-router-dom';

const OrderTable = ({ orders }) => {
    const getStatusStyle = (status) => {
        switch (status) {
            case 'Pending': return { color: 'orange', fontWeight: 'bold' };
            case 'Processing': return { color: 'blue', fontWeight: 'bold' };
            case 'Shipped': return { color: 'purple', fontWeight: 'bold' };
            case 'Completed': return { color: 'green', fontWeight: 'bold' };
            case 'Cancelled': return { color: 'red', fontWeight: 'bold' };
            default: return {};
        }
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
                        <td className="action-buttons">
                            <Link to={`/admin/orders/${order._id}`} className="btn-outline" style={{ padding: '6px 12px', fontSize: '0.75rem' }}>Xem chi tiết</Link>
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