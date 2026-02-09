const Category = require('../models/categoryModel');
const factory = require('../utils/handlerFactory');
const catchAsync = require('../utils/catchAsync');
const slugify = require('slugify');
const path = require('path');
const fs = require('fs');

exports.createCategory = catchAsync(async (req, res, next) => {
    const { name, sortOrder, status } = req.body;
    if (!req.file) {
        return res.status(400).json({ status: 'fail', message: 'Vui lòng tải lên ảnh banner.' });
    }

    const newCategory = await Category.create({
        name,
        slug: slugify(name, { lower: true }),
        sortOrder,
        status,
        bannerImage: `/public/images/categories/${req.file.filename}`
    });
    res.status(201).json({ status: 'success', data: { category: newCategory } });
});

exports.getAllCategories = catchAsync(async (req, res, next) => {
    const categories = await Category.find().sort({ sortOrder: 'asc' });
    res.status(200).json({ status: 'success', data: { categories } });
});

exports.updateCategory = catchAsync(async (req, res, next) => {
    const { name, sortOrder, status } = req.body;
    const updateData = { sortOrder, status };

    if (name) {
        updateData.name = name;
        updateData.slug = slugify(name, { lower: true });
    }
    if (req.file) {
        updateData.bannerImage = `/public/images/categories/${req.file.filename}`;
    }

    const category = await Category.findByIdAndUpdate(req.params.id, updateData, { new: true, runValidators: true });
    if (!category) {
        return res.status(404).json({ status: 'fail', message: 'Không tìm thấy danh mục' });
    }

    res.status(200).json({ status: 'success', data: { category } });
});

exports.deleteCategory = catchAsync(async (req, res, next) => {
    const category = await Category.findById(req.params.id);
    if (!category) {
        return res.status(404).json({ status: 'fail', message: 'Không tìm thấy danh mục' });
    }

    if (category.bannerImage) {
        const fullPath = path.join(__dirname, '..', category.bannerImage);
        if (fs.existsSync(fullPath)) fs.unlinkSync(fullPath);
    }

    await Category.findByIdAndDelete(req.params.id);
    res.status(204).json({ status: 'success', data: null });
});

exports.getCategoryBySlug = catchAsync(async (req, res, next) => {
    const category = await Category.findOne({ slug: req.params.slug });
    if (!category) {
        return res.status(404).json({ status: 'fail', message: 'Không tìm thấy danh mục' });
    }
    res.status(200).json({ status: 'success', data: { category } });
});

exports.getCategory = factory.getOne(Category);