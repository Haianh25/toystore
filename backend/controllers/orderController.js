const Order = require('../models/orderModel');
const Product = require('../models/productModel');
const factory = require('../utils/handlerFactory');
const catchAsync = require('../utils/catchAsync');

exports.createOrder = catchAsync(async (req, res, next) => {
    const { products, shippingAddress } = req.body;

    if (!products || products.length === 0) {
        return res.status(400).json({ status: 'fail', message: 'Giỏ hàng của bạn đang trống.' });
    }

    let totalAmount = 0;
    const productDetails = [];

    for (const item of products) {
        const product = await Product.findById(item.product);
        if (!product) {
            return res.status(404).json({ status: 'fail', message: `Không tìm thấy sản phẩm với ID: ${item.product}` });
        }

        // We DON'T decrement here anymore. We only check if there's enough stock.
        if (product.stockQuantity < item.quantity) {
            return res.status(400).json({ status: 'fail', message: `Sản phẩm "${product.name}" không đủ số lượng tồn kho.` });
        }

        totalAmount += product.sellPrice * item.quantity;
        productDetails.push({
            product: product._id,
            quantity: item.quantity,
            price: product.sellPrice
        });
    }

    const newOrder = await Order.create({
        user: req.user.id,
        products: productDetails,
        shippingAddress,
        totalAmount,
        paymentMethod: 'COD'
    });

    res.status(201).json({
        status: 'success',
        data: {
            order: newOrder
        }
    });
});

exports.getAllOrders = factory.getAll(Order);
exports.getOrder = factory.getOne(Order, ['user', 'products.product']);

exports.updateOrderStatus = catchAsync(async (req, res, next) => {
    const { status: newStatus } = req.body;
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ status: 'fail', message: 'Không tìm thấy đơn hàng' });

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
            status: 'fail',
            message: `Không thể chuyển trạng thái từ "${oldStatus}" sang "${newStatus}"`
        });
    }

    // Logic for Stock Adjustment
    // 1. Pending -> Processing (confirmed): Decrement stock
    if (oldStatus === 'Pending' && newStatus === 'Processing') {
        for (const item of order.products) {
            const product = await Product.findById(item.product);
            if (product.stockQuantity < item.quantity) {
                return res.status(400).json({
                    status: 'fail',
                    message: `Không thể xác nhận đơn hàng. Sản phẩm "${product.name}" hiện không đủ tồn kho.`
                });
            }
            await Product.findByIdAndUpdate(item.product, { $inc: { stockQuantity: -item.quantity } });
        }
    }

    // 2. Confirmed status back to Cancelled: Increment stock back
    if (['Processing', 'Shipped', 'Completed'].includes(oldStatus) && newStatus === 'Cancelled') {
        for (const item of order.products) {
            await Product.findByIdAndUpdate(item.product, { $inc: { stockQuantity: +item.quantity } });
        }
    }

    order.status = newStatus;
    await order.save();
    await order.populate('products.product');

    res.status(200).json({ status: 'success', data: { order } });
});

exports.getMyOrders = catchAsync(async (req, res, next) => {
    const orders = await Order.find({ user: req.user.id }).sort('-createdAt');
    res.status(200).json({ status: 'success', data: { orders } });
});

// Admin extensions for orders (CRUD refinement)
exports.addProductToOrder = catchAsync(async (req, res, next) => {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ status: 'fail', message: 'Không tìm thấy đơn hàng' });

    if (order.status !== 'Processing') {
        return res.status(400).json({ status: 'fail', message: `Không thể sửa đơn hàng ở trạng thái "${order.status}"` });
    }

    const { productId, quantity, price } = req.body;
    const existingProduct = order.products.find(p => p.product.toString() === productId);

    if (existingProduct) {
        existingProduct.quantity += quantity;
    } else {
        order.products.push({ product: productId, quantity, price });
    }

    // Decrement stock for the item added while in Processing
    await Product.findByIdAndUpdate(productId, { $inc: { stockQuantity: -quantity } });

    order.totalAmount = order.products.reduce((acc, curr) => acc + curr.price * curr.quantity, 0);
    await order.save();
    await order.populate('products.product');
    res.status(200).json({ status: 'success', data: { order } });
});

exports.updateProductInOrder = catchAsync(async (req, res, next) => {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ status: 'fail', message: 'Không tìm thấy đơn hàng' });

    if (order.status !== 'Processing') {
        return res.status(400).json({ status: 'fail', message: `Không thể sửa đơn hàng ở trạng thái "${order.status}"` });
    }

    const { productId } = req.params;
    const { quantity } = req.body;
    const itemIndex = order.products.findIndex(p => p.product.toString() === productId);
    if (itemIndex === -1) return res.status(404).json({ status: 'fail', message: 'Sản phẩm không có trong đơn hàng' });

    const oldQuantity = order.products[itemIndex].quantity;
    const quantityDifference = oldQuantity - quantity;

    // Adjust stock based on quantity change
    if (quantityDifference !== 0) {
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
});

exports.removeProductFromOrder = catchAsync(async (req, res, next) => {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ status: 'fail', message: 'Không tìm thấy đơn hàng' });

    if (order.status !== 'Processing') {
        return res.status(400).json({ status: 'fail', message: `Không thể sửa đơn hàng ở trạng thái "${order.status}"` });
    }

    const { productId } = req.params;
    const removedItem = order.products.find(p => p.product.toString() === productId);

    if (removedItem) {
        // Return stock when removed from a confirmed order
        await Product.findByIdAndUpdate(productId, { $inc: { stockQuantity: removedItem.quantity } });
        order.products = order.products.filter(p => p.product.toString() !== productId);
    }

    order.totalAmount = order.products.reduce((acc, curr) => acc + curr.price * curr.quantity, 0);
    await order.save();
    await order.populate('products.product');
    res.status(200).json({ status: 'success', data: { order } });
});
