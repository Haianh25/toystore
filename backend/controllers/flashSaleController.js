const Product = require('../models/productModel');
const User = require('../models/userModel');
const notificationController = require('./notificationController');
const catchAsync = require('../utils/catchAsync');
const FlashSale = require('../models/flashSaleModel');


exports.getAllFlashSales = async (req, res) => {
    try {
        const flashSales = await FlashSale.find()
            .sort('-startTime')
            .populate('products.product', 'name mainImage');
        res.status(200).json({ status: 'success', data: { flashSales } });
    } catch (error) {
        res.status(500).json({ status: 'fail', message: error.message });
    }
};


exports.getFlashSale = async (req, res) => {
    try {
        const flashSale = await FlashSale.findById(req.params.id).populate('products.product', 'name mainImage sellPrice stockQuantity');
        if (!flashSale) return res.status(404).json({ message: 'Không tìm thấy chương trình sale' });
        res.status(200).json({ status: 'success', data: { flashSale } });
    } catch (error) {
        res.status(500).json({ status: 'fail', message: error.message });
    }
};


exports.createFlashSale = async (req, res) => {
    try {
        const now = new Date();
        for (const item of req.body.products) {

            const product = await Product.findById(item.product);
            if (!product || item.flashSalePrice > product.sellPrice) {
                return res.status(400).json({
                    message: `Giá sale của sản phẩm "${product.name}" không được cao hơn giá gốc.`
                });
            }


            const otherActiveSale = await FlashSale.findOne({
                'products.product': item.product,
                startTime: { $lte: now },
                endTime: { $gte: now }
            });
            if (otherActiveSale) {
                return res.status(400).json({ message: `Sản phẩm "${product.name}" đã có trong một chương trình sale khác đang hoạt động.` });
            }
        }

        const newFlashSale = await FlashSale.create(req.body);

        if (newFlashSale.isActive) {
            const subscribers = await User.find({ pushSubscription: { $exists: true } });
            subscribers.forEach(user => {
                notificationController.sendNotification(user, {
                    title: 'FLASH SALE MỚI!',
                    body: `Chương trình "${newFlashSale.title}" đã bắt đầu. Săn ngay kẻo lỡ!`,
                    url: '/flash-sale'
                });
            });
        }

        res.status(201).json({ status: 'success', data: { flashSale: newFlashSale } });
    } catch (error) {
        res.status(400).json({ status: 'fail', message: error.message });
    }
};


exports.updateFlashSale = async (req, res) => {
    try {
        const now = new Date();
        if (req.body.products) {
            for (const item of req.body.products) {

                const product = await Product.findById(item.product);
                if (!product || item.flashSalePrice > product.sellPrice) {
                    return res.status(400).json({
                        message: `Giá sale của sản phẩm "${product.name}" không được cao hơn giá gốc.`
                    });
                }


                const otherActiveSale = await FlashSale.findOne({
                    _id: { $ne: req.params.id },
                    'products.product': item.product,
                    startTime: { $lte: now },
                    endTime: { $gte: now }
                });
                if (otherActiveSale) {
                    return res.status(400).json({ message: `Sản phẩm "${product.name}" đã có trong một chương trình sale khác đang hoạt động.` });
                }
            }
        }

        const flashSale = await FlashSale.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!flashSale) return res.status(404).json({ message: 'Không tìm thấy chương trình sale' });

        if (req.body.isActive === true) {
            const subscribers = await User.find({ pushSubscription: { $exists: true } });
            subscribers.forEach(user => {
                notificationController.sendNotification(user, {
                    title: 'FLASH SALE ĐANG DIỄN RA!',
                    body: `Chương trình "${flashSale.title}" đang cực hot. Xem ngay!`,
                    url: '/flash-sale'
                });
            });
        }

        res.status(200).json({ status: 'success', data: { flashSale } });
    } catch (error) {
        res.status(400).json({ status: 'fail', message: error.message });
    }
};


exports.deleteFlashSale = async (req, res) => {
    try {
        const flashSale = await FlashSale.findByIdAndDelete(req.params.id);
        if (!flashSale) return res.status(404).json({ message: 'Không tìm thấy chương trình sale' });
        res.status(204).json({ status: 'success', data: null });
    } catch (error) {
        res.status(500).json({ status: 'fail', message: error.message });
    }
};

exports.getActiveFlashSales = async (req, res) => {
    try {
        const now = new Date();
        const activeSales = await FlashSale.find({
            startTime: { $lte: now }, // Bắt đầu trước hoặc bằng thời điểm hiện tại
            endTime: { $gte: now }    // Kết thúc sau hoặc bằng thời điểm hiện tại
        }).sort('startTime').populate('products.product', 'name mainImage sellPrice stockQuantity');

        res.status(200).json({ status: 'success', data: { flashSales: activeSales } });
    } catch (error) {
        res.status(500).json({ status: 'fail', message: error.message });
    }
};