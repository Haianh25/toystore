const Section = require('../models/sectionModel');
const fs = require('fs');
const path = require('path');

// Lấy tất cả sections
exports.getAllSections = async (req, res) => {
    try {
        const query = req.query.activeOnly === 'true' ? { isActive: true } : {};
        // populate là đúng, nó sẽ bỏ qua nếu path không tồn tại hoặc rỗng
        const sections = await Section.find(query).sort('sortOrder').populate('content.products');
        res.status(200).json({ status: 'success', data: { sections } });
    } catch (err) {
        res.status(500).json({ status: 'fail', message: err.message });
    }
};

// Tạo section mới
exports.createSection = async (req, res) => {
    try {
        const { title, type, sortOrder, isActive, link, products } = req.body;
        let content = {
            link,
            products: products ? products.split(',') : []
        };
        
        if (req.file) {
            content.bannerImage = `/public/images/sections/${req.file.filename}`;
        }
        
        const newSection = await Section.create({
            title,
            type,
            sortOrder,
            isActive,
            content
        });
        res.status(201).json({ status: 'success', data: { section: newSection } });
    } catch (err) {
        console.error("LỖI CREATE SECTION:", err);
        res.status(400).json({ status: 'fail', message: err.message });
    }
};

// Cập nhật section
exports.updateSection = async (req, res) => {
    try {
        const { title, type, sortOrder, isActive, link, products } = req.body;
        
        const oldSection = await Section.findById(req.params.id);
        if (!oldSection) {
            return res.status(404).json({ message: 'Không tìm thấy section' });
        }

        let content = {
            link,
            products: products ? products.split(',') : [],
            // === SỬA LỖI TẠI ĐÂY ===
            // Sử dụng optional chaining (?.) để truy cập an toàn
            bannerImage: oldSection?.content?.bannerImage 
        };
        
        if (req.file) {
            content.bannerImage = `/public/images/sections/${req.file.filename}`;
        }
        
        const updatedSection = await Section.findByIdAndUpdate(req.params.id, {
            title,
            type,
            sortOrder,
            isActive,
            content
        }, { new: true, runValidators: true }).populate('content.products');

        res.status(200).json({ status: 'success', data: { section: updatedSection } });
    } catch (err) {
        console.error("LỖI UPDATE SECTION:", err);
        res.status(400).json({ status: 'fail', message: err.message });
    }
};

// Xóa section
exports.deleteSection = async (req, res) => {
    try {
        const section = await Section.findById(req.params.id);
        if (!section) {
            return res.status(404).json({ message: 'Không tìm thấy section' });
        }
        
        // Xóa ảnh banner của section nếu có
        if (section.content && section.content.bannerImage) {
            const imagePath = path.join(__dirname, '..', section.content.bannerImage);
            if (fs.existsSync(imagePath)) {
                fs.unlinkSync(imagePath);
            }
        }
        
        await Section.findByIdAndDelete(req.params.id);
        res.status(204).json({ status: 'success', data: null });
    } catch (err) {
        console.error("LỖI DELETE SECTION:", err);
        res.status(500).json({ status: 'fail', message: err.message });
    }
};