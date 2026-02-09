const Brand = require('../models/brandModel');
const factory = require('../utils/handlerFactory');
const catchAsync = require('../utils/catchAsync');
const slugify = require('slugify');
const path = require('path');
const fs = require('fs');

exports.createBrand = catchAsync(async (req, res, next) => {
    const { name, description } = req.body;
    if (!req.file) {
        return res.status(400).json({ status: 'fail', message: 'Vui lòng tải lên logo.' });
    }
    const newBrand = await Brand.create({
        name,
        description,
        slug: slugify(name, { lower: true }),
        logo: `/public/images/brands/${req.file.filename}`
    });
    res.status(201).json({ status: 'success', data: { brand: newBrand } });
});

exports.getAllBrands = catchAsync(async (req, res, next) => {
    const brands = await Brand.find();
    res.status(200).json({
        status: 'success',
        results: brands.length,
        data: { brands }
    });
});

exports.getBrand = catchAsync(async (req, res, next) => {
    const brand = await Brand.findById(req.params.id);
    if (!brand) return res.status(404).json({ status: 'fail', message: 'Không tìm thấy thương hiệu' });
    res.status(200).json({ status: 'success', data: { brand } });
});

exports.updateBrand = catchAsync(async (req, res, next) => {
    const { name, description } = req.body;
    const updateData = { name, description };

    if (name) {
        updateData.slug = slugify(name, { lower: true });
    }
    if (req.file) {
        updateData.logo = `/public/images/brands/${req.file.filename}`;
    }

    const brand = await Brand.findByIdAndUpdate(req.params.id, updateData, { new: true, runValidators: true });
    if (!brand) return res.status(404).json({ status: 'fail', message: 'Không tìm thấy thương hiệu' });

    res.status(200).json({ status: 'success', data: { brand } });
});

exports.deleteBrand = catchAsync(async (req, res, next) => {
    const brand = await Brand.findById(req.params.id);
    if (!brand) return res.status(404).json({ status: 'fail', message: 'Không tìm thấy thương hiệu' });

    if (brand.logo) {
        const imagePath = path.join(__dirname, '..', brand.logo);
        if (fs.existsSync(imagePath)) fs.unlinkSync(imagePath);
    }

    await Brand.findByIdAndDelete(req.params.id);
    res.status(204).json({ status: 'success', data: null });
});

exports.getBrandBySlug = catchAsync(async (req, res, next) => {
    const brand = await Brand.findOne({ slug: req.params.slug });
    if (!brand) return res.status(404).json({ status: 'fail', message: 'Không tìm thấy thương hiệu' });
    res.status(200).json({ status: 'success', data: { brand } });
});
