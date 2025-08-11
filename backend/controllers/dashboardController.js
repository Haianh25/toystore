const Order = require('../models/orderModel');


exports.getOverviewStats = async (req, res) => {
    try {
        // 1. Tổng số đơn hàng đã bán (không tính đơn bị hủy)
        const totalOrders = await Order.countDocuments({ status: { $ne: 'Cancelled' } });

       
        const revenueResult = await Order.aggregate([
            { $match: { status: 'Completed' } },
            { $group: { _id: null, totalRevenue: { $sum: '$totalAmount' } } }
        ]);
        const totalRevenue = revenueResult.length > 0 ? revenueResult[0].totalRevenue : 0;

       
        const productsSoldResult = await Order.aggregate([
            { $match: { status: { $ne: 'Cancelled' } } },
            { $unwind: '$products' },
            { $group: { _id: null, totalProductsSold: { $sum: '$products.quantity' } } }
        ]);
        const totalProductsSold = productsSoldResult.length > 0 ? productsSoldResult[0].totalProductsSold : 0;

        res.status(200).json({
            status: 'success',
            data: { totalOrders, totalRevenue, totalProductsSold }
        });
    } catch (error) {
        res.status(500).json({ status: 'fail', message: error.message });
    }
};


exports.getChartData = async (req, res) => {
    try {
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        const dailyData = await Order.aggregate([
            { $match: { createdAt: { $gte: thirtyDaysAgo }, status: { $ne: 'Cancelled' } } },
            {
                $group: {
                    _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
                    dailyOrders: { $sum: 1 },
                    dailyRevenue: { $sum: { $cond: [{ $eq: ["$status", "Completed"] }, "$totalAmount", 0] } },
                    dailyProductsSold: { $sum: { $sum: "$products.quantity" } }
                }
            },
            { $sort: { _id: 1 } }
        ]);

        res.status(200).json({ status: 'success', data: { dailyData } });
    } catch (error) {
        res.status(500).json({ status: 'fail', message: error.message });
    }
};