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
        <table style={{ width: '100%', borderCollapse: 'collapse', backgroundColor: 'white' }}>
            <thead>
                <tr style={{ backgroundColor: '#f2f2f2' }}>
                    <th style={{ padding: '12px', border: '1px solid #ddd', textAlign: 'left' }}>Mã Đơn Hàng</th>
                    <th style={{ padding: '12px', border: '1px solid #ddd', textAlign: 'left' }}>Khách Hàng</th>
                    <th style={{ padding: '12px', border: '1px solid #ddd', textAlign: 'left' }}>Ngày Đặt</th>
                    <th style={{ padding: '12px', border: '1px solid #ddd' }}>Tổng Tiền</th>
                    <th style={{ padding: '12px', border: '1px solid #ddd' }}>Trạng Thái</th>
                    <th style={{ padding: '12px', border: '1px solid #ddd' }}>Hành động</th>
                </tr>
            </thead>
            <tbody>
                {orders.length > 0 ? orders.map(order => (
                    <tr key={order._id}>
                        <td style={{ padding: '12px', border: '1px solid #ddd' }}>#{order._id.slice(-6)}</td>
                        <td style={{ padding: '12px', border: '1px solid #ddd' }}>{order.user?.fullName || 'N/A'}</td>
                        <td style={{ padding: '12px', border: '1px solid #ddd' }}>{new Date(order.createdAt).toLocaleDateString('vi-VN')}</td>
                        <td style={{ padding: '12px', border: '1px solid #ddd' }}>{order.totalAmount.toLocaleString('vi-VN')} VND</td>
                        <td style={{ padding: '12px', border: '1px solid #ddd' }}>
                            <span style={getStatusStyle(order.status)}>{order.status}</span>
                        </td>
                        <td style={{ padding: '12px', border: '1px solid #ddd' }}>
                            <Link to={`/admin/orders/${order._id}`}>Xem chi tiết</Link>
                        </td>
                    </tr>
                )) : (
                    <tr>
                        <td colSpan="6" style={{ padding: '12px', border: '1px solid #ddd', textAlign: 'center' }}>Chưa có đơn hàng nào.</td>
                    </tr>
                )}
            </tbody>
        </table>
    );
};

export default OrderTable;