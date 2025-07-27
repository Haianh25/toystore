const Category = require('../models/categoryModel');
const slugify = require('slugify');
const fs = require('fs');
const path = require('path');

exports.createCategory = async (req, res) => {
    try {
        const { name, sortOrder, status } = req.body;
        if (!req.file) {
            return res.status(400).json({ message: 'Vui lòng tải lên ảnh banner.' });
        }
        
        const newCategory = await Category.create({
            name,
            slug: slugify(name, { lower: true }),
            sortOrder,
            status,
            bannerImage: `/public/images/categories/${req.file.filename}`
        });
        res.status(201).json({ status: 'success', data: { category: newCategory } });
    } catch (err) {
        console.error('LỖI CREATE CATEGORY:', err); // <-- Thêm dòng này
        res.status(400).json({ status: 'fail', message: err.message });
    }
};

exports.getAllCategories = async (req, res) => {
    try {
        const categories = await Category.find().sort({ sortOrder: 'asc' });
        res.status(200).json({ status: 'success', data: { categories } });
    } catch (err) {
        console.error('LỖI GET ALL CATEGORIES:', err); // <-- Thêm dòng này
        res.status(500).json({ status: 'fail', message: err.message });
    }
};

exports.updateCategory = async (req, res) => {
    try {
        const { name, sortOrder, status } = req.body;
        const updateData = { name, sortOrder, status };

        if (name) {
            updateData.slug = slugify(name, { lower: true });
        }
        if (req.file) {
            updateData.bannerImage = `/public/images/categories/${req.file.filename}`;
        }

        const category = await Category.findByIdAndUpdate(req.params.id, updateData, { new: true, runValidators: true });
        if (!category) return res.status(404).json({ message: 'Không tìm thấy danh mục' });

        res.status(200).json({ status: 'success', data: { category } });
    } catch (err) {
        console.error('LỖI UPDATE CATEGORY:', err); // <-- Thêm dòng này
        res.status(400).json({ status: 'fail', message: err.message });
    }
};

exports.deleteCategory = async (req, res) => {
    try {
        const category = await Category.findByIdAndDelete(req.params.id);
        if (!category) return res.status(404).json({ message: 'Không tìm thấy danh mục' });
        
        if (category.bannerImage) {
            const imagePath = path.join(__dirname, '..', category.bannerImage);
            if (fs.existsSync(imagePath)) {
                fs.unlinkSync(imagePath);
            }
        }

        res.status(204).json({ status: 'success', data: null });
    } catch (err) {
        console.error('LỖI DELETE CATEGORY:', err); // <-- Thêm dòng này
        res.status(500).json({ status: 'fail', message: err.message });
    }
};