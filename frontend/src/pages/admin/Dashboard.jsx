import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Line, Doughnut } from 'react-chartjs-2';
import { API_URL } from '../../config/api';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';
import { FaShoppingCart, FaBoxOpen } from 'react-icons/fa';
import { useSocket } from '../../context/SocketContext';
import { useToast } from '../../context/ToastContext';
import './Dashboard.css';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, ArcElement);

const Dashboard = () => {
    const [stats, setStats] = useState({ totalOrders: 0, totalRevenue: 0, totalProductsSold: 0, lowStockCount: 0, outOfStockCount: 0, totalProducts: 0 });
    const [orderChartData, setOrderChartData] = useState({ labels: [], datasets: [] });
    const [revenueChartData, setRevenueChartData] = useState({ labels: [], datasets: [] });
    const [productsSoldChartData, setProductsSoldChartData] = useState({ labels: [], datasets: [] });
    const [stockChartData, setStockChartData] = useState({ labels: [], datasets: [] });
    const apiConfig = { headers: { Authorization: `Bearer ${localStorage.getItem('adminToken')}` } };
    const { socket } = useSocket();
    const { showToast } = useToast();

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Lấy thống kê tổng quan
                const statsRes = await axios.get(`${API_URL}/api/v1/dashboard/stats`, apiConfig);
                const s = statsRes.data?.data || {};

                // Đảm bảo các giá trị số luôn tồn tại
                const updatedStats = {
                    totalOrders: s.totalOrders || 0,
                    totalRevenue: s.totalRevenue || 0,
                    totalProductsSold: s.totalProductsSold || 0,
                    lowStockCount: s.lowStockCount || 0,
                    outOfStockCount: s.outOfStockCount || 0,
                    totalProducts: s.totalProducts || 0
                };
                setStats(updatedStats);

                // Biểu đồ tròn Stock
                const inStock = updatedStats.totalProducts - updatedStats.lowStockCount - updatedStats.outOfStockCount;
                setStockChartData({
                    labels: ['Đủ hàng', 'Sắp hết', 'Hết hàng'],
                    datasets: [{
                        data: [inStock, updatedStats.lowStockCount, updatedStats.outOfStockCount],
                        backgroundColor: ['#28a745', '#ffc107', '#dc3545'],
                        hoverOffset: 4
                    }]
                });

                // Lấy dữ liệu biểu đồ
                const chartRes = await axios.get(`${API_URL}/api/v1/dashboard/charts`, apiConfig);
                const dailyData = chartRes.data?.data?.dailyData || [];
                const labels = dailyData.map(d => new Date(d._id).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' }));

                // 1. Chart Đơn hàng
                setOrderChartData({
                    labels,
                    datasets: [{
                        label: 'Đơn hàng',
                        data: dailyData.map(d => d.dailyOrders),
                        borderColor: '#2196F3',
                        backgroundColor: 'rgba(33, 150, 243, 0.1)',
                        fill: true,
                        tension: 0.4
                    }]
                });

                // 2. Chart Doanh thu
                setRevenueChartData({
                    labels,
                    datasets: [{
                        label: 'Doanh thu (VND)',
                        data: dailyData.map(d => d.dailyRevenue),
                        borderColor: '#4CAF50',
                        backgroundColor: 'rgba(76, 175, 80, 0.1)',
                        fill: true,
                        tension: 0.4
                    }]
                });

                // 3. Chart Sản phẩm đã bán
                setProductsSoldChartData({
                    labels,
                    datasets: [{
                        label: 'Sản phẩm đã bán',
                        data: dailyData.map(d => d.dailyProductsSold),
                        borderColor: '#9C27B0',
                        backgroundColor: 'rgba(156, 39, 176, 0.1)',
                        fill: true,
                        tension: 0.4
                    }]
                });

            } catch (error) {
                console.error("Lỗi tải dữ liệu dashboard:", error);
            }
        };
        fetchData();
    }, []);

    useEffect(() => {
        if (!socket) return;

        socket.on('lowStockAlert', (data) => {
            console.log("Cảnh báo kho mới:", data);
            showToast(data.message, 'warning');
            // Refresh stats to update circles/counters
            const refreshStats = async () => {
                try {
                    const statsRes = await axios.get(`${API_URL}/api/v1/dashboard/stats`, apiConfig);
                    setStats(statsRes.data?.data || {});
                } catch (err) { }
            };
            refreshStats();
        });

        return () => socket.off('lowStockAlert');
    }, [socket, showToast]);

    const commonOptions = {
        responsive: true,
        plugins: {
            legend: {
                display: false,
            },
            tooltip: {
                backgroundColor: '#000',
                padding: 12,
                titleFont: { size: 14, weight: 'bold' },
                bodyFont: { size: 13 },
                displayColors: false
            }
        },
        scales: {
            y: {
                beginAtZero: true,
                grid: {
                    color: 'rgba(0, 0, 0, 0.05)'
                }
            },
            x: {
                grid: {
                    display: false
                }
            }
        }
    };

    return (
        <div className="dashboard-container">
            <header className="dashboard-header">
                <div>
                    <h1 className="dashboard-title">DASHBOARD</h1>
                    <p className="dashboard-subtitle">Chào mừng trở lại, trình quản trị hệ thống.</p>
                </div>
            </header>

            {/* Thống kê tổng quan */}
            <div className="stats-grid">
                <div className="stat-card">
                    <div className="stat-icon orders"><FaShoppingCart /></div>
                    <div className="stat-info">
                        <span className="stat-label">TỔNG ĐƠN HÀNG</span>
                        <h2 className="stat-value">{stats.totalOrders}</h2>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon revenue">VND</div>
                    <div className="stat-info">
                        <span className="stat-label">TỔNG DOANH THU</span>
                        <h2 className="stat-value">{stats.totalRevenue.toLocaleString('vi-VN')}</h2>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon products"><FaBoxOpen /></div>
                    <div className="stat-info">
                        <span className="stat-label">SẢN PHẨM ĐÃ BÁN</span>
                        <h2 className="stat-value">{stats.totalProductsSold}</h2>
                    </div>
                </div>
                <div className={`stat-card ${(stats.lowStockCount || 0) > 0 || (stats.outOfStockCount || 0) > 0 ? 'critical' : ''}`}>
                    <div className="stat-icon stock">!</div>
                    <div className="stat-info">
                        <span className="stat-label">CẢNH BÁO KHO</span>
                        <h2 className="stat-value">{(stats.lowStockCount || 0) + (stats.outOfStockCount || 0)}</h2>
                    </div>
                </div>
            </div>

            {/* Layout biểu đồ mới */}
            <div className="dashboard-charts-main">
                <div className="chart-large-grid">
                    <div className="chart-card">
                        <div className="chart-card-header">
                            <h3>DOANH THU THEO NGÀY</h3>
                            <span className="chart-period">30 ngày qua</span>
                        </div>
                        <div className="chart-wrapper">
                            <Line data={revenueChartData} options={commonOptions} />
                        </div>
                    </div>

                    <div className="chart-side-grid">
                        <div className="chart-card">
                            <div className="chart-card-header">
                                <h3>ĐƠN HÀNG MỚI</h3>
                            </div>
                            <div className="chart-wrapper-small">
                                <Line data={orderChartData} options={commonOptions} />
                            </div>
                        </div>
                        <div className="chart-card">
                            <div className="chart-card-header">
                                <h3>SẢN PHẨM ĐẨY ĐI</h3>
                            </div>
                            <div className="chart-wrapper-small">
                                <Line data={productsSoldChartData} options={commonOptions} />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="chart-row-secondary">
                    <div className="chart-card stock-radial">
                        <div className="chart-card-header">
                            <h3>TÌNH TRẠNG LƯU KHO</h3>
                        </div>
                        <div className="chart-wrapper-doughnut">
                            <Doughnut data={stockChartData} options={{ maintainAspectRatio: false }} />
                        </div>
                        <div className="stock-legend">
                            <div className="legend-item"><span className="dot ok"></span> Đủ hàng</div>
                            <div className="legend-item"><span className="dot warning"></span> Sắp hết</div>
                            <div className="legend-item"><span className="dot danger"></span> Hết hàng</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;