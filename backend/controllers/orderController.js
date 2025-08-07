const Order = require('../models/orderModel');
const Product = require('../models/productModel');

exports.getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find().populate('user', 'fullName email').sort('-createdAt');
        res.status(200).json({ status: 'success', data: { orders } });
    } catch (error) {
        console.error("LỖI GET ALL ORDERS:", error);
        res.status(500).json({ status: 'fail', message: error.message });
    }
};

exports.getOrder = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id).populate('user').populate('products.product');
        if (!order) {
            return res.status(404).json({ message: 'Không tìm thấy đơn hàng' });
        }
        res.status(200).json({ status: 'success', data: { order } });
    } catch (error) {
        console.error("LỖI GET ORDER:", error);
        res.status(500).json({ status: 'fail', message: error.message });
    }
};

exports.updateOrderStatus = async (req, res) => {
    try {
        const { status: newStatus } = req.body;
        const order = await Order.findById(req.params.id);
        if (!order) return res.status(404).json({ message: 'Không tìm thấy đơn hàng' });

        const oldStatus = order.status;

        const allowedTransitions = {
            Pending: ['Processing', 'Cancelled'],
            Processing: ['Shipped', 'Completed', 'Cancelled'],
            Shipped: ['Completed'],
            Completed: [],
            Cancelled: [],
        };

        if (!allowedTransitions[oldStatus] || !allowedTransitions[oldStatus].includes(newStatus)) {
            return res.status(400).json({ 
                message: `Không thể chuyển trạng thái từ "${oldStatus}" sang "${newStatus}"` 
            });
        }

        if (oldStatus === 'Pending' && newStatus === 'Processing') {
            for (const item of order.products) {
                await Product.findByIdAndUpdate(item.product, { $inc: { stockQuantity: -item.quantity } });
            }
        }
        if (['Processing', 'Shipped', 'Completed'].includes(oldStatus) && newStatus === 'Cancelled') {
            for (const item of order.products) {
                await Product.findByIdAndUpdate(item.product, { $inc: { stockQuantity: +item.quantity } });
            }
        }
        
        order.status = newStatus;
        await order.save();
        await order.populate('products.product');
        res.status(200).json({ status: 'success', data: { order } });
    } catch (error) {
        console.error("LỖI UPDATE ORDER STATUS:", error);
        res.status(500).json({ status: 'fail', message: error.message });
    }
};

exports.addProductToOrder = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);
        if (!order) return res.status(404).json({ message: 'Không tìm thấy đơn hàng' });

        if (order.status !== 'Processing') {
            return res.status(400).json({ message: `Không thể sửa đơn hàng ở trạng thái "${order.status}"` });
        }

        const { productId, quantity, price } = req.body;
        const existingProduct = order.products.find(p => p.product.toString() === productId);

        if (existingProduct) {
            existingProduct.quantity += quantity;
        } else {
            order.products.push({ product: productId, quantity, price });
        }
        
        if (['Processing', 'Shipped', 'Completed'].includes(order.status)) {
            await Product.findByIdAndUpdate(productId, { $inc: { stockQuantity: -quantity } });
        }

        order.totalAmount = order.products.reduce((acc, curr) => acc + curr.price * curr.quantity, 0);
        await order.save();
        await order.populate('products.product');
        res.status(200).json({ status: 'success', data: { order } });
    } catch (error) {
        console.error("LỖI ADD PRODUCT TO ORDER:", error);
        res.status(400).json({ status: 'fail', message: error.message });
    }
};

exports.updateProductInOrder = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);
        if (!order) return res.status(404).json({ message: 'Không tìm thấy đơn hàng' });
        
        if (order.status !== 'Processing') {
            return res.status(400).json({ message: `Không thể sửa đơn hàng ở trạng thái "${order.status}"` });
        }

        const { productId } = req.params;
        const { quantity } = req.body;
        const itemIndex = order.products.findIndex(p => p.product.toString() === productId);
        if (itemIndex === -1) return res.status(404).json({ message: 'Sản phẩm không có trong đơn hàng' });

        const oldQuantity = order.products[itemIndex].quantity;
        const quantityDifference = oldQuantity - quantity;

        if (['Processing', 'Shipped', 'Completed'].includes(order.status) && quantityDifference !== 0) {
            await Product.findByIdAndUpdate(productId, { $inc: { stockQuantity: quantityDifference } });
        }

        if (quantity > 0) {
            order.products[itemIndex].quantity = quantity;
        } else {
            order.products.splice(itemIndex, 1);
        }

        order.totalAmount = order.products.reduce((acc, curr) => acc + curr.price * curr.quantity, 0);
        await order.save({ validateBeforeSave: false });
        await order.populate('products.product');
        res.status(200).json({ status: 'success', data: { order } });
    } catch (error) {
        console.error("LỖI UPDATE PRODUCT IN ORDER:", error);
        res.status(400).json({ status: 'fail', message: error.message });
    }
};

exports.removeProductFromOrder = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);
        if (!order) return res.status(404).json({ message: 'Không tìm thấy đơn hàng' });
        
        if (order.status !== 'Processing') {
            return res.status(400).json({ message: `Không thể sửa đơn hàng ở trạng thái "${order.status}"` });
        }
        
        const { productId } = req.params;
        order.products = order.products.filter(p => p.product.toString() !== productId);
        order.totalAmount = order.products.reduce((acc, curr) => acc + curr.price * curr.quantity, 0);

        await order.save();
        await order.populate('products.product');
        res.status(200).json({ status: 'success', data: { order } });
    } catch (error) {
        console.error("LỖI REMOVE PRODUCT FROM ORDER:", error);
        res.status(400).json({ status: 'fail', message: error.message });
    }
};

exports.getMyOrders = async (req, res) => {
    try {
        const orders = await Order.find({ user: req.user.id }).sort('-createdAt');
        res.status(200).json({ status: 'success', data: { orders } });
    } catch (error) {
        res.status(500).json({ status: 'fail', message: error.message });
    }
};