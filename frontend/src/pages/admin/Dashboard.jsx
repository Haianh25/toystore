import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const Dashboard = () => {
    const [stats, setStats] = useState({ totalOrders: 0, totalRevenue: 0, totalProductsSold: 0 });
    const [chartData, setChartData] = useState({ labels: [], datasets: [] });
    const apiConfig = { headers: { Authorization: `Bearer ${localStorage.getItem('adminToken')}` } };

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Lấy thống kê tổng quan
                const statsRes = await axios.get('http://localhost:5000/api/v1/dashboard/stats', apiConfig);
                setStats(statsRes.data.data);

                // Lấy dữ liệu biểu đồ
                const chartRes = await axios.get('http://localhost:5000/api/v1/dashboard/charts', apiConfig);
                const dailyData = chartRes.data.data.dailyData;

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
        <div>
            <h1>Dashboard</h1>
            {/* Thống kê tổng quan */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', marginBottom: '30px' }}>
                <div style={{ padding: '20px', backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
                    <h2>Tổng Đơn hàng</h2>
                    <p style={{ fontSize: '2rem', fontWeight: 'bold' }}>{stats.totalOrders}</p>
                </div>
                <div style={{ padding: '20px', backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
                    <h2>Tổng Doanh thu</h2>
                    <p style={{ fontSize: '2rem', fontWeight: 'bold' }}>{stats.totalRevenue.toLocaleString('vi-VN')} VND</p>
                </div>
                <div style={{ padding: '20px', backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
                    <h2>Sản phẩm đã bán</h2>
                    <p style={{ fontSize: '2rem', fontWeight: 'bold' }}>{stats.totalProductsSold}</p>
                </div>
            </div>

            {/* Biểu đồ */}
            <div style={{ padding: '20px', backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
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