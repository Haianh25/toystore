const Section = require('../models/sectionModel');
const slugify = require('slugify');

// Lấy tất cả sections
exports.getAllSections = async (req, res) => {
    try {
        const query = req.query.activeOnly === 'true' ? { isActive: true } : {};
        const sections = await Section.find(query).sort('sortOrder').populate('content.products');
        res.status(200).json({ status: 'success', data: { sections } });
    } catch (err) {
        res.status(500).json({ status: 'fail', message: err.message });
    }
};

// Tạo section mới
exports.createSection = async (req, res) => {
    try {
        let content = {};
        if (req.body.type === 'single_banner') {
            if (!req.file) return res.status(400).json({ message: 'Vui lòng tải ảnh cho banner section.' });
            content.image = `/public/images/sections/${req.file.filename}`;
            content.link = req.body.link;
        } else {
            content.products = req.body.products ? req.body.products.split(',') : [];
        }
        
        const newSection = await Section.create({
            title: req.body.title,
            type: req.body.type,
            sortOrder: req.body.sortOrder,
            isActive: req.body.isActive,
            content
        });
        res.status(201).json({ status: 'success', data: { section: newSection } });
    } catch (err) {
        res.status(400).json({ status: 'fail', message: err.message });
    }
};

// Cập nhật section (Thêm mới)
exports.updateSection = async (req, res) => {
    try {
        let updateData = { ...req.body };
        let content = {};

        if (req.body.type === 'single_banner') {
            if (req.file) {
                content.image = `/public/images/sections/${req.file.filename}`;
            }
            content.link = req.body.link;
        } else {
            content.products = req.body.products ? req.body.products.split(',') : [];
        }
        updateData.content = content;
        
        const section = await Section.findByIdAndUpdate(req.params.id, updateData, { new: true, runValidators: true });
        if (!section) return res.status(404).json({ message: 'Không tìm thấy section' });

        res.status(200).json({ status: 'success', data: { section } });
    } catch (err) {
        res.status(400).json({ status: 'fail', message: err.message });
    }
};

// Xóa section (Thêm mới)
exports.deleteSection = async (req, res) => {
    try {
        const section = await Section.findByIdAndDelete(req.params.id);
        if (!section) return res.status(404).json({ message: 'Không tìm thấy section' });
        // (Nâng cao: có thể thêm logic xóa ảnh nếu là banner)
        res.status(204).json({ status: 'success', data: null });
    } catch (err) {
        res.status(500).json({ status: 'fail', message: err.message });
    }
};