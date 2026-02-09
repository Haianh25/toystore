import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Line, Doughnut } from 'react-chartjs-2';
import { API_URL } from '../../config/api';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';
import './Dashboard.css';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, ArcElement);

const Dashboard = () => {
    const [stats, setStats] = useState({ totalOrders: 0, totalRevenue: 0, totalProductsSold: 0, lowStockCount: 0, outOfStockCount: 0, totalProducts: 0 });
    const [chartData, setChartData] = useState({ labels: [], datasets: [] });
    const [stockChartData, setStockChartData] = useState({ labels: [], datasets: [] });
    const apiConfig = { headers: { Authorization: `Bearer ${localStorage.getItem('adminToken')}` } };

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

                // Xử lý dữ liệu biểu đồ tròn Stock
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

                // Xử lý dữ liệu cho biểu đồ
                const labels = dailyData.map(d => new Date(d._id).toLocaleDateString('vi-VN'));
                setChartData({
                    labels,
                    datasets: [
                        {
                            label: 'Đơn hàng mỗi ngày',
                            data: dailyData.map(d => d.dailyOrders),
                            borderColor: 'rgb(54, 162, 235)',
                            backgroundColor: 'rgba(54, 162, 235, 0.5)',
                        },
                        {
                            label: 'Doanh thu mỗi ngày (VND)',
                            data: dailyData.map(d => d.dailyRevenue),
                            borderColor: 'rgb(75, 192, 192)',
                            backgroundColor: 'rgba(75, 192, 192, 0.5)',
                        },
                    ]
                });
            } catch (error) {
                console.error("Lỗi tải dữ liệu dashboard:", error);
            }
        };
        fetchData();
    }, []);

    return (
        <div className="dashboard-container">
            <h1 className="dashboard-title">Dashboard</h1>

            {/* Thống kê tổng quan */}
            <div className="stats-grid">
                <div className="stat-card">
                    <h2>Tổng Đơn hàng</h2>
                    <p className="stat-value">{stats.totalOrders}</p>
                </div>
                <div className="stat-card">
                    <h2>Tổng Doanh thu</h2>
                    <p className="stat-value">{stats.totalRevenue.toLocaleString('vi-VN')} VND</p>
                </div>
                <div className="stat-card">
                    <h2>Sản phẩm đã bán</h2>
                    <p className="stat-value">{stats.totalProductsSold}</p>
                </div>
                <div className={`stat-card ${(stats.lowStockCount || 0) > 0 || (stats.outOfStockCount || 0) > 0 ? 'alert' : ''}`}>
                    <h2>Cảnh báo Kho</h2>
                    <p className="stat-value">{(stats.lowStockCount || 0) + (stats.outOfStockCount || 0)}</p>
                </div>
            </div>

            {/* Biểu đồ */}
            <div className="dashboard-charts-grid">
                <div className="chart-container main-chart">
                    <h2>Hiệu suất kinh doanh (30 ngày)</h2>
                    {chartData.labels.length > 0 ? (
                        <Line options={{ responsive: true, plugins: { legend: { position: 'top' } } }} data={chartData} />
                    ) : (
                        <p>Không có đủ dữ liệu để vẽ biểu đồ.</p>
                    )}
                </div>

                <div className="chart-container stock-chart">
                    <h2>Trạng thái Kho hàng</h2>
                    <div style={{ maxWidth: '300px', margin: '0 auto' }}>
                        <Doughnut data={stockChartData} options={{ responsive: true }} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;