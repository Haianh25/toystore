import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Line } from 'react-chartjs-2';
import { API_URL } from '../../config/api';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import './Dashboard.css';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const Dashboard = () => {
    const [stats, setStats] = useState({ totalOrders: 0, totalRevenue: 0, totalProductsSold: 0 });
    const [chartData, setChartData] = useState({ labels: [], datasets: [] });
    const apiConfig = { headers: { Authorization: `Bearer ${localStorage.getItem('adminToken')}` } };

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Lấy thống kê tổng quan
                const statsRes = await axios.get(`${API_URL}/api/v1/dashboard/stats`, apiConfig);
                setStats(statsRes.data?.data || { totalOrders: 0, totalRevenue: 0, totalProductsSold: 0 });

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
            </div>

            {/* Biểu đồ */}
            <div className="chart-container">
                <h2>Phân tích 30 ngày gần nhất</h2>
                {chartData.labels.length > 0 ? (
                    <Line options={{ responsive: true, plugins: { legend: { position: 'top' } } }} data={chartData} />
                ) : (
                    <p>Không có đủ dữ liệu để vẽ biểu đồ.</p>
                )}
            </div>
        </div>
    );
};

export default Dashboard;