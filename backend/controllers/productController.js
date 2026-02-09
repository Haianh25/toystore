const Product = require('../models/productModel');
const factory = require('../utils/handlerFactory');
const catchAsync = require('../utils/catchAsync');
const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');

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
    const { search, age, category, collection, brand, minPrice, maxPrice, sort, page = 1, limit = 10 } = req.query;

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

    const pipeline = [{ $match: matchStage }];

    if (sort === 'random') {
        pipeline.push({ $sample: { size: 100 } });
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