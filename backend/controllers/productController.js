const Product = require('../models/productModel');
const factory = require('../utils/handlerFactory');
const catchAsync = require('../utils/catchAsync');
const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const FlashSale = require('../models/flashSaleModel');

const parseArrayFields = (body) => {
    ['ageGroups', 'categories'].forEach(field => {
        if (body[field] && typeof body[field] === 'string') {
            body[field] = body[field] === '' ? [] : body[field].split(',');
        }
    });
};

// Sửa lại hàm createProduct để xử lý categories và ageGroups
exports.createProduct = catchAsync(async (req, res, next) => {
    parseArrayFields(req.body);

    if (!req.files || !req.files.mainImage) {
        return res.status(400).json({ status: 'fail', message: 'Vui lòng tải lên ảnh đại diện.' });
    }
    const mainImage = `/public/images/products/${req.files.mainImage[0].filename}`;
    let detailImagesPaths = req.files.detailImages ? req.files.detailImages.map(file => `/public/images/products/${file.filename}`) : [];
    const newProduct = await Product.create({ ...req.body, mainImage, detailImages: detailImagesPaths });
    res.status(201).json({ status: 'success', data: { product: newProduct } });
});

// Sửa lại toàn bộ hàm getAllProducts để hỗ trợ mọi tính năng
exports.getAllProducts = catchAsync(async (req, res, next) => {
    const { search, age, category, collection, brand, minPrice, maxPrice, sort, page = 1, limit = 12 } = req.query;

    const matchStage = {};
    if (search) matchStage.name = new RegExp(search, 'i');
    if (category) matchStage.categories = new mongoose.Types.ObjectId(category);
    if (collection) matchStage.productCollection = new mongoose.Types.ObjectId(collection);
    if (brand) matchStage.brand = new mongoose.Types.ObjectId(brand);
    if (age) matchStage.ageGroups = { $in: age.split(',') };
    if (minPrice || maxPrice) {
        matchStage.sellPrice = {};
        if (minPrice) matchStage.sellPrice.$gte = Number(minPrice);
        if (maxPrice) matchStage.sellPrice.$lte = Number(maxPrice);
    }

    // --- EXCLUDE PRODUCTS IN ACTIVE FLASH SALES ---
    if (req.query.excludeActiveSale === 'true') {
        const now = new Date();
        const activeSales = await FlashSale.find({
            startTime: { $lte: now },
            endTime: { $gte: now }
        });
        const productIdsInSales = activeSales.flatMap(s => s.products.map(p => p.product));
        if (productIdsInSales.length > 0) {
            matchStage._id = { ...matchStage._id, $nin: productIdsInSales };
        }
    }

    const pipeline = [{ $match: matchStage }];

    // --- FIX RANDOM SORT PAGINATION ---
    // Instead of $sample (which is unstable for pagination), we use a deterministic sort 
    // if a specific sort isn't provided, or just use _id as a fallback.
    if (sort === 'random') {
        // We still want things to look different, but $sample is too unstable for page 2+
        // Small hack: sort by something that looks random-ish but stays same for the request session
        // For simplicity, we'll just sort by createdAt or similar if random, or a larger sample if first page
        if (Number(page) === 1) {
            pipeline.push({ $sample: { size: 1000 } }); // Large enough to cover most shops
        } else {
            pipeline.push({ $sort: { createdAt: -1 } });
        }
    } else {
        const sortOrder = sort && sort.startsWith('-') ? -1 : 1;
        const sortField = sort ? sort.replace('-', '') : 'createdAt';
        pipeline.push({ $sort: { [sortField]: sortOrder } });
    }

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

    await Product.populate(products, [{ path: 'categories', select: 'name slug' }, { path: 'brand', select: 'name slug' }]);

    res.status(200).json({
        status: 'success',
        results: products.length,
        data: { products },
        pagination: { page: Number(page), limit: Number(limit), totalPages, totalProducts }
    });
});

exports.getProduct = factory.getOne(Product, [
    { path: 'categories', select: 'name slug' },
    { path: 'brand', select: 'name slug' },
    { path: 'productCollection' }
]);

exports.updateProduct = catchAsync(async (req, res, next) => {
    parseArrayFields(req.body);

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
    if (!product) return res.status(404).json({ status: 'fail', message: 'Không tìm thấy sản phẩm' });
    res.status(200).json({ status: 'success', data: { product } });
});

exports.deleteProduct = catchAsync(async (req, res, next) => {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ status: 'fail', message: 'Không tìm thấy sản phẩm' });
    const imagesToDelete = [product.mainImage, ...product.detailImages];
    imagesToDelete.forEach(imgPath => {
        if (imgPath) {
            const fullPath = path.join(__dirname, '..', imgPath);
            if (fs.existsSync(fullPath)) fs.unlinkSync(fullPath);
        }
    });
    await Product.findByIdAndDelete(req.params.id);
    res.status(204).json({ status: 'success', data: null });
});

// Smart Recommendations for Phase 4
exports.getRelatedProducts = catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const currentProduct = await Product.findById(id);

    if (!currentProduct) {
        return res.status(404).json({ status: 'fail', message: 'Không tìm thấy sản phẩm' });
    }

    // Smart logic: 
    // 1. Same category (Strong match)
    // 2. Same brand (Medium match)
    // 3. Similar price range (+/- 30%)
    const minPrice = currentProduct.sellPrice * 0.7;
    const maxPrice = currentProduct.sellPrice * 1.3;

    let relatedProducts = await Product.find({
        _id: { $ne: id },
        $or: [
            { categories: { $in: currentProduct.categories } },
            { brand: currentProduct.brand },
            { sellPrice: { $gte: minPrice, $lte: maxPrice } }
        ]
    })
        .limit(10)
        .populate('categories brand');

    // Sort by relevance (basic implementation: if same category, prioritize)
    relatedProducts = relatedProducts.sort((a, b) => {
        const aCatMatch = a.categories.some(c => currentProduct.categories.includes(c._id.toString()));
        const bCatMatch = b.categories.some(c => currentProduct.categories.includes(c._id.toString()));
        if (aCatMatch && !bCatMatch) return -1;
        if (!aCatMatch && bCatMatch) return 1;
        return 0;
    });

    res.status(200).json({
        status: 'success',
        data: {
            products: relatedProducts.slice(0, 4)
        }
    });
});
