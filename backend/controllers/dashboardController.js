const Order = require('../models/orderModel');
const Product = require('../models/productModel');

exports.getOverviewStats = async (req, res) => {
    try {
        // 1. Tổng số đơn hàng đã bán (không tính đơn bị hủy)
        const totalOrders = await Order.countDocuments({ status: { $ne: 'Cancelled' } });

        // 2. Tổng doanh thu (chỉ tính đơn đã hoàn thành)
        const revenueResult = await Order.aggregate([
            { $match: { status: 'Completed' } },
            { $group: { _id: null, totalRevenue: { $sum: '$totalAmount' } } }
        ]);
        const totalRevenue = revenueResult.length > 0 ? revenueResult[0].totalRevenue : 0;

        // 3. Tổng số lượng sản phẩm đã bán
        const productsSoldResult = await Order.aggregate([
            { $match: { status: { $ne: 'Cancelled' } } },
            { $unwind: '$products' },
            { $group: { _id: null, totalProductsSold: { $sum: '$products.quantity' } } }
        ]);
        const totalProductsSold = productsSoldResult.length > 0 ? productsSoldResult[0].totalProductsSold : 0;

        // 4. Sản phẩm sắp hết hàng (stock > 0 và stock < 10)
        const lowStockCount = await Product.countDocuments({ stockQuantity: { $gt: 0, $lt: 10 } });

        // 5. Sản phẩm hết hàng (stock === 0)
        const outOfStockCount = await Product.countDocuments({ stockQuantity: 0 });

        // 6. Tổng số sản phẩm trong hệ thống
        const totalProducts = await Product.countDocuments();

        res.status(200).json({
            status: 'success',
            data: {
                totalOrders,
                totalRevenue,
                totalProductsSold,
                lowStockCount,
                outOfStockCount,
                totalProducts
            }
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