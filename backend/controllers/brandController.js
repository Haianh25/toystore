const Brand = require('../models/brandModel');
const slugify = require('slugify');
const fs = require('fs');
const path = require('path');

// CREATE
exports.createBrand = async (req, res) => {
    try {
        const { name, description } = req.body;
        if (!req.file) {
            return res.status(400).json({ message: 'Vui lòng tải lên logo.' });
        }
        const newBrand = await Brand.create({
            name,
            description,
            slug: slugify(name, { lower: true }),
            logo: `/public/images/brands/${req.file.filename}`
        });
        res.status(201).json({ status: 'success', data: { brand: newBrand } });
    } catch (err) {
        res.status(400).json({ status: 'fail', message: err.message });
    }
};

// READ ALL
exports.getAllBrands = async (req, res) => {
    try {
        const brands = await Brand.find();
        res.status(200).json({ status: 'success', data: { brands } });
    } catch (err) {
        res.status(500).json({ status: 'fail', message: err.message });
    }
};

// UPDATE (Hoàn thiện)
exports.updateBrand = async (req, res) => {
    try {
        const { name, description } = req.body;
        const updateData = { name, description };

        if (name) {
            updateData.slug = slugify(name, { lower: true });
        }
        if (req.file) {
            updateData.logo = `/public/images/brands/${req.file.filename}`;
            // (Nâng cao: có thể thêm logic xóa file logo cũ ở đây)
        }

        const brand = await Brand.findByIdAndUpdate(req.params.id, updateData, { new: true, runValidators: true });
        if (!brand) return res.status(404).json({ message: 'Không tìm thấy thương hiệu' });

        res.status(200).json({ status: 'success', data: { brand } });
    } catch (err) {
        res.status(400).json({ status: 'fail', message: err.message });
    }
};

// DELETE (Hoàn thiện)
exports.deleteBrand = async (req, res) => {
    try {
        const brand = await Brand.findByIdAndDelete(req.params.id);
        if (!brand) return res.status(404).json({ message: 'Không tìm thấy thương hiệu' });
        
        // Xóa file logo
        if (brand.logo) {
            const imagePath = path.join(__dirname, '..', brand.logo);
            if (fs.existsSync(imagePath)) {
                fs.unlinkSync(imagePath);
            }
        }

        res.status(204).json({ status: 'success', data: null });
    } catch (err) {
        res.status(500).json({ status: 'fail', message: err.message });
    }
};

exports.getBrandBySlug = async (req, res) => {
    try {
        const brand = await Brand.findOne({ slug: req.params.slug });
        if (!brand) {
            return res.status(404).json({ message: 'Không tìm thấy thương hiệu' });
        }
        res.status(200).json({ status: 'success', data: { brand } });
    } catch (err) {
        res.status(500).json({ status: 'fail', message: err.message });
    }
};

