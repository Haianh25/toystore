const Section = require('../models/sectionModel');
const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');

exports.getAllSections = async (req, res) => {
    try {
        const query = req.query.activeOnly === 'true' ? { isActive: true } : {};
        const sections = await Section.find(query).sort('sortOrder').populate('content.products');
        res.status(200).json({ status: 'success', data: { sections } });
    } catch (err) {
        res.status(500).json({ status: 'fail', message: err.message });
    }
};

exports.createSection = async (req, res) => {
    try {
        const { title, type, sortOrder, isActive, link, products } = req.body;
        const content = {
            link: link || '',
            products: products ? products.split(',') : [],
            bannerGroup: []
        };

        if (req.files) {
            if (type === 'promo_with_products' && req.files.bannerImage) {
                content.bannerImage = `/public/images/sections/${req.files.bannerImage[0].filename}`;
            } else if (type === 'banner_slider' && req.files.bannerImages) {
                const bannerStructure = req.body.bannerGroup ? JSON.parse(req.body.bannerGroup) : [];
                let fileCounter = 0;
                content.bannerGroup = bannerStructure.map(banner => {
                    if (banner.image === '__NEW_FILE__' && req.files.bannerImages[fileCounter]) {
                        const newFile = req.files.bannerImages[fileCounter++];
                        return { image: `/public/images/sections/${newFile.filename}`, link: banner.link };
                    }
                    return null;
                }).filter(Boolean);
            }
        }

        const newSection = await Section.create({ title, type, sortOrder, isActive, content });
        res.status(201).json({ status: 'success', data: { section: newSection } });
    } catch (err) {
        console.error("LỖI CREATE SECTION:", err);
        res.status(400).json({ status: 'fail', message: err.message });
    }
};

// --- CẬP NHẬT LOGIC HÀM UPDATE ---
exports.updateSection = async (req, res) => {
    try {
        const { title, type, sortOrder, isActive, link, products } = req.body;
        
        const oldSection = await Section.findById(req.params.id);
        if (!oldSection) return res.status(404).json({ message: 'Không tìm thấy section' });

        const content = {
            link: link || '',
            products: products ? products.split(',') : [],
            bannerImage: oldSection.content?.bannerImage,
            bannerGroup: oldSection.content?.bannerGroup || []
        };
        
        if (type === 'promo_with_products' && req.files && req.files.bannerImage) {
            content.bannerImage = `/public/images/sections/${req.files.bannerImage[0].filename}`;
        } else if (type === 'banner_slider') {
            const bannerStructure = req.body.bannerGroup ? JSON.parse(req.body.bannerGroup) : [];
            const newFiles = req.files.bannerImages || [];
            let fileCounter = 0;

            const finalBannerGroup = bannerStructure.map(banner => {
                if (banner.image === '__NEW_FILE__') {
                    const file = newFiles[fileCounter++];
                    if (file) {
                        return { image: `/public/images/sections/${file.filename}`, link: banner.link };
                    }
                    return null; // Trường hợp file không tồn tại
                }
                return banner; // Giữ lại banner cũ { image: 'path/to/old.jpg', link: '...' }
            }).filter(Boolean); // Lọc bỏ các giá trị null

            content.bannerGroup = finalBannerGroup;
        }

        const updatedSection = await Section.findByIdAndUpdate(req.params.id,
            { title, type, sortOrder, isActive, content },
            { new: true, runValidators: true }
        );
        res.status(200).json({ status: 'success', data: { section: updatedSection } });
    } catch (err) {
        console.error("LỖI UPDATE SECTION:", err);
        res.status(400).json({ status: 'fail', message: err.message });
    }
};

exports.deleteSection = async (req, res) => {
    try {
        const section = await Section.findById(req.params.id);
        if (!section) return res.status(404).json({ message: 'Không tìm thấy section' });

        if (section.content?.bannerImage) {
            const imagePath = path.join(__dirname, '..', section.content.bannerImage);
            if (fs.existsSync(imagePath)) fs.unlinkSync(imagePath);
        }
        if (section.content?.bannerGroup) {
            section.content.bannerGroup.forEach(banner => {
                if(banner.image){
                    const imagePath = path.join(__dirname, '..', banner.image);
                    if (fs.existsSync(imagePath)) fs.unlinkSync(imagePath);
                }
            });
        }
        await Section.findByIdAndDelete(req.params.id);
        res.status(204).json({ status: 'success', data: null });
    } catch (err) {
        console.error("LỖI DELETE SECTION:", err);
        res.status(500).json({ status: 'fail', message: err.message });
    }
};