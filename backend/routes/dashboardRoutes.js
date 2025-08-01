const express = require('express');
const dashboardController = require('../controllers/dashboardController');
const router = express.Router();

// Route cho thống kê tổng quan
router.get('/stats', dashboardController.getOverviewStats);

// Route cho dữ liệu biểu đồ
router.get('/charts', dashboardController.getChartData);

module.exports = router;