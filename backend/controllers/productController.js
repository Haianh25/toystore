const Product = require('../models/productModel');
const fs = require('fs');
const path = require('path');

// CREATE
exports.createProduct = async (req, res) => {
    try {
        if (!req.files || !req.files.mainImage) {
            return res.status(400).json({ message: 'Vui lòng tải lên ảnh đại diện.' });
        }
        const mainImage = `/public/images/products/${req.files.mainImage[0].filename}`;
        let detailImagesPaths = req.files.detailImages ? req.files.detailImages.map(file => `/public/images/products/${file.filename}`) : [];
        const newProduct = await Product.create({ ...req.body, mainImage, detailImages: detailImagesPaths });
        res.status(201).json({ status: 'success', data: { product: newProduct } });
    } catch (err) {
        console.error("LỖI CREATE PRODUCT:", err);
        res.status(400).json({ status: 'fail', message: err.message });
    }
};

// READ ALL
exports.getAllProducts = async (req, res) => {
    try {
        const query = {};
        if (req.query.search) {
            query.name = new RegExp(req.query.search, 'i');
        }
        const products = await Product.find(query).populate('category', 'name');
        res.status(200).json({ status: 'success', data: { products } });
    } catch (err) { // <<== LỖI THIẾU DẤU {} Ở ĐÂY
        res.status(500).json({ status: 'fail', message: err.message });
    }
};

// READ ONE
exports.getProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id).populate('category');
        if (!product) return res.status(404).json({ message: 'Không tìm thấy sản phẩm' });
        res.status(200).json({ status: 'success', data: { product } });
    } catch (err) {
        res.status(500).json({ status: 'fail', message: err.message });
    }
};

// UPDATE
exports.updateProduct = async (req, res) => {
    try {
        let updateData = { ...req.body };
        if (req.files) {
            if (req.files.mainImage) {
                updateData.mainImage = `/public/images/products/${req.files.mainImage[0].filename}`;
            }
            if (req.files.detailImages) {
                updateData.detailImages = req.files.detailImages.map(file => `/public/images/products/${file.filename}`);
            }
        }
        const product = await Product.findByIdAndUpdate(req.params.id, updateData, { new: true, runValidators: true });
        if (!product) return res.status(404).json({ message: 'Không tìm thấy sản phẩm' });
        res.status(200).json({ status: 'success', data: { product } });
    } catch (err) {
        console.error("LỖI UPDATE PRODUCT:", err);
        res.status(400).json({ status: 'fail', message: err.message });
    }
};

// DELETE
exports.deleteProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) return res.status(404).json({ message: 'Không tìm thấy sản phẩm' });

        const imagesToDelete = [product.mainImage, ...product.detailImages];
        imagesToDelete.forEach(imgPath => {
            if (imgPath) {
                const fullPath = path.join(__dirname, '..', imgPath);
                if (fs.existsSync(fullPath)) fs.unlinkSync(fullPath);
            }
        });
        
        await Product.findByIdAndDelete(req.params.id);
        res.status(204).json({ status: 'success', data: null });
    } catch (err) {
        console.error("LỖI DELETE PRODUCT:", err);
        res.status(500).json({ status: 'fail', message: err.message });
    }
};