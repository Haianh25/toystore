const mongoose = require('mongoose');
const Product = require('../models/productModel');
const FlashSale = require('../models/flashSaleModel'); 
const fs = require('fs');
const path = require('path');

exports.createProduct = async (req, res) => {
    try {
        if (req.body.ageGroups && typeof req.body.ageGroups === 'string') {
            req.body.ageGroups = req.body.ageGroups.split(',');
        }
        // Xử lý categories
        if (req.body.categories && typeof req.body.categories === 'string') {
            req.body.categories = req.body.categories.split(',');
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
        let { search, age, category, collection, brand, minPrice, maxPrice, sort, page = 1, limit = 18 } = req.query;
        
        // --- XÂY DỰNG PIPELINE ---
        const pipeline = [];

        // --- STAGE 1: LỌC ($match) ---
        const matchStage = {};
        if (search) matchStage.name = new RegExp(search, 'i');
        if (brand) matchStage.brand = new mongoose.Types.ObjectId(brand);
        if (collection) matchStage.productCollection = new mongoose.Types.ObjectId(collection);
        if (age) matchStage.ageGroups = { $in: age.split(',') };
        if (minPrice || maxPrice) {
            matchStage.sellPrice = {};
            if (minPrice) matchStage.sellPrice.$gte = Number(minPrice);
            if (maxPrice) matchStage.sellPrice.$lte = Number(maxPrice);
        }
        
        // Logic lọc "Hàng mới"
        if (category) {
            const categoryObj = await mongoose.model('Category').findById(category);
            if (categoryObj && categoryObj.slug === 'hang-moi') {
                const fiveDaysAgo = new Date(Date.now() - 5 * 24 * 60 * 60 * 1000);
                matchStage.createdAt = { $gte: fiveDaysAgo };
            } else {
                matchStage.categories = new mongoose.Types.ObjectId(category);
            }
        }
        
        pipeline.push({ $match: matchStage });

        // --- STAGE 2: SẮP XẾP ($sort) ---
        if (sort === 'random') {
            pipeline.push({ $sample: { size: 100 } });
        } else {
            const sortOrder = sort && sort.startsWith('-') ? -1 : 1;
            const sortField = sort ? sort.replace('-', '') : 'createdAt';
            pipeline.push({ $sort: { [sortField]: sortOrder } });
        }
        
        // --- STAGE 3: PHÂN TRANG ($facet) ---
        const skip = (Number(page) - 1) * Number(limit);
        pipeline.push({
            $facet: {
                metadata: [{ $count: "totalProducts" }],
                data: [{ $skip: skip }, { $limit: Number(limit) }]
            }
        });

        const results = await Product.aggregate(pipeline);
        const products = results[0].data;
        const totalProducts = results[0].metadata[0]?.totalProducts || 0;
        const totalPages = Math.ceil(totalProducts / Number(limit));
        
        await Product.populate(products, [{ path: 'categories', select: 'name' }, { path: 'brand', select: 'name' }]);
        
        res.status(200).json({ 
            status: 'success', 
            results: products.length,
            data: { products },
            pagination: { page: Number(page), limit: Number(limit), totalPages, totalProducts }
        });
    } catch (err) {
        console.error("Lỗi getAllProducts:", err);
        res.status(500).json({ status: 'fail', message: err.message });
    }
};

exports.getProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id).populate('categories').populate('brand').populate('productCollection');
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
        
        if (req.body.categories && typeof req.body.categories === 'string') {
            req.body.categories = req.body.categories === '' ? [] : req.body.categories.split(',');
        } else if (!req.body.categories) {
            req.body.categories = [];
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