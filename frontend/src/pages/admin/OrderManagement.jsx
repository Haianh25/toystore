import React, { useState, useEffect } from 'react';
import axios from 'axios';
import OrderTable from '../../components/admin/OrderTable';
import { API_URL } from '../../config/api';
import { useSocket } from '../../context/SocketContext';
import { useToast } from '../../context/ToastContext';

const OrderManagement = () => {
    const [orders, setOrders] = useState([]);
    const [filteredOrders, setFilteredOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [statusFilter, setStatusFilter] = useState('All');
    const [searchTerm, setSearchTerm] = useState('');
    const { showToast } = useToast();
    const { socket } = useSocket();

    const fetchOrders = async () => {
        try {
            const token = localStorage.getItem('adminToken');
            const response = await axios.get(`${API_URL}/api/v1/orders`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            const ordersData = response.data?.data?.orders || [];
            setOrders(ordersData);
            setFilteredOrders(ordersData);
        } catch (error) {
            console.error("Lỗi tải đơn hàng:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        let result = orders;
        if (statusFilter !== 'All') {
            result = result.filter(o => o.status === statusFilter);
        }
        if (searchTerm) {
            result = result.filter(o =>
                o._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                o.user?.fullName?.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }
        setFilteredOrders(result);
    }, [statusFilter, searchTerm, orders]);

    useEffect(() => {
        fetchOrders();
    }, []);

    // Listen for real-time order updates
    useEffect(() => {
        if (!socket) return;

        socket.on('newOrder', (data) => {
            console.log("New order received:", data);
            showToast(`🔔 Đơn hàng mới! ${data.message || ''}`, "success");
            fetchOrders(); // Refresh list immediately
        });

        return () => {
            socket.off('newOrder');
        };
    }, [socket]);

    if (loading) return <p>Đang tải danh sách đơn hàng...</p>;

    return (
        <div className="page-container">
            <div className="page-header">
                <h1>Quản lý Đơn hàng</h1>
                <div style={{ display: 'flex', gap: '15px' }}>
                    <div className="search-box">
                        <input
                            type="text"
                            placeholder="Tìm mã đơn hoặc khách hàng..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            style={{ padding: '8px 12px', borderRadius: '4px', border: '1px solid #ddd', minWidth: '250px' }}
                        />
                    </div>
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        style={{ padding: '8px 12px', borderRadius: '4px', border: '1px solid #ddd' }}
                    >
                        <option value="All">Tất cả trạng thái</option>
                        <option value="Pending">Chờ xác nhận</option>
                        <option value="Processing">Đang chuẩn bị</option>
                        <option value="Shipped">Đang giao</option>
                        <option value="Completed">Đã hoàn thành</option>
                        <option value="Cancelled">Đã huỷ</option>
                    </select>
                </div>
            </div>
            <OrderTable orders={filteredOrders} onRefresh={fetchOrders} />
        </div>
    );
};

export default OrderManagement;