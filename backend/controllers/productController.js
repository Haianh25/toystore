const Product = require('../models/productModel');
const FlashSale = require('../models/flashSaleModel');
const fs = require('fs');
const path = require('path');

exports.createProduct = async (req, res) => {
    try {
        if (req.body.ageGroups && typeof req.body.ageGroups === 'string') {
            req.body.ageGroups = req.body.ageGroups.split(',');
        }
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

exports.getAllProducts = async (req, res) => {
    try {
        let query = {};
        const { search, age, category, collection, brand, minPrice, maxPrice, sort } = req.query;

        if (search) query.name = new RegExp(search, 'i');
        if (category) query.category = category;
        if (collection) query.productCollection = collection;
        if (brand) query.brand = brand;
        if (age) query.ageGroups = { $in: age.split(',') };
        
        if (minPrice || maxPrice) {
            query.sellPrice = {};
            if (minPrice) query.sellPrice.$gte = Number(minPrice);
            if (maxPrice) query.sellPrice.$lte = Number(maxPrice);
        }

        let productQuery = Product.find(query);

        if (sort) {
            const sortBy = sort.replace(',', ' ');
            productQuery = productQuery.sort(sortBy);
        } else {
            productQuery = productQuery.sort('-createdAt');
        }

        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 18;
        const skip = (page - 1) * limit;

        productQuery = productQuery.skip(skip).limit(limit);

        const products = await productQuery
            .populate('category', 'name')
            .populate('brand', 'name');
            
        const totalProducts = await Product.countDocuments(query);
        const totalPages = Math.ceil(totalProducts / limit);
            
        res.status(200).json({ 
            status: 'success', 
            results: products.length,
            data: { products },
            pagination: { page, limit, totalPages, totalProducts }
        });
    } catch (err) {
        res.status(500).json({ status: 'fail', message: err.message });
    }
};

exports.getProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id).populate('category').populate('brand').populate('productCollection');
        if (!product) return res.status(404).json({ message: 'Không tìm thấy sản phẩm' });
        res.status(200).json({ status: 'success', data: { product } });
    } catch (err) {
        res.status(500).json({ status: 'fail', message: err.message });
    }
};

exports.updateProduct = async (req, res) => {
    try {
        if (req.body.ageGroups && typeof req.body.ageGroups === 'string') {
            req.body.ageGroups = req.body.ageGroups === '' ? [] : req.body.ageGroups.split(',');
        } else if (!req.body.ageGroups) {
            req.body.ageGroups = [];
        }

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