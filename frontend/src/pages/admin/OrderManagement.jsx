import React, { useState, useEffect } from 'react';
import axios from 'axios';
import OrderTable from '../../components/admin/OrderTable';

const OrderManagement = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrders = async () => {
            setLoading(true);
            try {
                const token = localStorage.getItem('adminToken');
                const response = await axios.get('http://localhost:5000/api/v1/orders', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setOrders(response.data.data.orders);
            } catch (error) {
                console.error("Lỗi tải đơn hàng:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchOrders();
    }, []);

    if (loading) return <p>Đang tải danh sách đơn hàng...</p>;

    return (
        <div>
            <h1>Quản lý Đơn hàng</h1>
            <OrderTable orders={orders} />
        </div>
    );
};

export default OrderManagement;