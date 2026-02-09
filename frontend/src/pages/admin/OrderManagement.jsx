import React, { useState, useEffect } from 'react';
import axios from 'axios';
import OrderTable from '../../components/admin/OrderTable';
import { API_URL } from '../../config/api';
import { useSocket } from '../../context/SocketContext';

const OrderManagement = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const socket = useSocket();

    const fetchOrders = async () => {
        // setLoading(true); // Don't show loading on background updates
        try {
            const token = localStorage.getItem('adminToken');
            const response = await axios.get(`${API_URL}/api/v1/orders`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setOrders(response.data?.data?.orders || []);
        } catch (error) {
            console.error("Lỗi tải đơn hàng:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    // Listen for real-time order updates
    useEffect(() => {
        if (!socket) return;

        socket.on('newOrder', (data) => {
            console.log("New order received:", data);
            alert(`🔔 Đơn hàng mới! ${data.message || ''}`); // Simple alert for now, can be Toast
            fetchOrders(); // Refresh list immediately
        });

        return () => {
            socket.off('newOrder');
        };
    }, [socket]);

    if (loading) return <p>Đang tải danh sách đơn hàng...</p>;

    return (
        <div>
            <h1>Quản lý Đơn hàng</h1>
            <OrderTable orders={orders} />
        </div>
    );
};

export default OrderManagement;