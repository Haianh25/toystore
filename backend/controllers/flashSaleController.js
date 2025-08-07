const FlashSale = require('../models/flashSaleModel');
const Product = require('../models/productModel');

// Lấy tất cả chương trình Flash Sale
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

// Lấy chi tiết một chương trình
exports.getFlashSale = async (req, res) => {
    try {
        const flashSale = await FlashSale.findById(req.params.id).populate('products.product', 'name mainImage sellPrice stockQuantity');
        if (!flashSale) return res.status(404).json({ message: 'Không tìm thấy chương trình sale' });
        res.status(200).json({ status: 'success', data: { flashSale } });
    } catch (error) {
        res.status(500).json({ status: 'fail', message: error.message });
    }
};

// Tạo chương trình mới
exports.createFlashSale = async (req, res) => {
    try {
        const now = new Date();
        for (const item of req.body.products) {
            // Kiểm tra giá sale
            const product = await Product.findById(item.product);
            if (!product || item.flashSalePrice > product.sellPrice) {
                return res.status(400).json({ 
                    message: `Giá sale của sản phẩm "${product.name}" không được cao hơn giá gốc.` 
                });
            }

            // LOGIC MỚI: Kiểm tra sản phẩm có trong sale khác đang hoạt động không
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
        res.status(201).json({ status: 'success', data: { flashSale: newFlashSale } });
    } catch (error) {
        res.status(400).json({ status: 'fail', message: error.message });
    }
};

// Cập nhật chương trình
exports.updateFlashSale = async (req, res) => {
    try {
        const now = new Date();
        if (req.body.products) {
            for (const item of req.body.products) {
                // Kiểm tra giá sale
                const product = await Product.findById(item.product);
                if (!product || item.flashSalePrice > product.sellPrice) {
                    return res.status(400).json({ 
                        message: `Giá sale của sản phẩm "${product.name}" không được cao hơn giá gốc.` 
                    });
                }

                // LOGIC MỚI: Kiểm tra sản phẩm có trong sale khác đang hoạt động không (loại trừ chính sale đang sửa)
                const otherActiveSale = await FlashSale.findOne({
                    _id: { $ne: req.params.id }, // Loại trừ chương trình đang được sửa
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
        res.status(200).json({ status: 'success', data: { flashSale } });
    } catch (error) {
        res.status(400).json({ status: 'fail', message: error.message });
    }
};

// Xóa chương trình
exports.deleteFlashSale = async (req, res) => {
    try {
        const flashSale = await FlashSale.findByIdAndDelete(req.params.id);
        if (!flashSale) return res.status(404).json({ message: 'Không tìm thấy chương trình sale' });
        res.status(204).json({ status: 'success', data: null });
    } catch (error) {
        res.status(500).json({ status: 'fail', message: error.message });
    }
};