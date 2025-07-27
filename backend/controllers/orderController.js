const Order = require('../models/orderModel');
const Product = require('../models/productModel');

// Lấy tất cả đơn hàng
exports.getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find().populate('user', 'fullName email').sort('-createdAt');
        res.status(200).json({ status: 'success', data: { orders } });
    } catch (error) {
        res.status(500).json({ status: 'fail', message: error.message });
    }
};

// Lấy chi tiết một đơn hàng
exports.getOrder = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id).populate('user').populate('products.product');
        if (!order) {
            return res.status(404).json({ message: 'Không tìm thấy đơn hàng' });
        }
        res.status(200).json({ status: 'success', data: { order } });
    } catch (error) {
        res.status(500).json({ status: 'fail', message: error.message });
    }
};

// Cập nhật trạng thái đơn hàng
exports.updateOrderStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const order = await Order.findById(req.params.id);

        if (!order) {
            return res.status(404).json({ message: 'Không tìm thấy đơn hàng' });
        }

        // *** LOGIC TRỪ TỒN KHO ***
        // Chỉ trừ kho một lần duy nhất khi chuyển trạng thái từ "Pending" sang "Processing"
        if (order.status === 'Pending' && status === 'Processing') {
            for (const item of order.products) {
                await Product.findByIdAndUpdate(item.product, {
                    $inc: { stockQuantity: -item.quantity }
                });
            }
        }
        
        order.status = status;
        await order.save();

        res.status(200).json({ status: 'success', data: { order } });
    } catch (error) {
        console.error("LỖI UPDATE ORDER STATUS:", error);
        res.status(500).json({ status: 'fail', message: error.message });
    }
};