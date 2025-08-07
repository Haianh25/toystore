const Collection = require('../models/collectionModel');
const slugify = require('slugify');

// Lấy tất cả
exports.getAllCollections = async (req, res) => {
    try {
        const collections = await Collection.find();
        res.status(200).json({ status: 'success', data: { collections } });
    } catch (error) {
        res.status(500).json({ status: 'fail', message: error.message });
    }
};

// Tạo mới
exports.createCollection = async (req, res) => {
    try {
        const { name, description } = req.body;
        const newCollection = await Collection.create({
            name,
            description,
            slug: slugify(name, { lower: true })
        });
        res.status(201).json({ status: 'success', data: { collection: newCollection } });
    } catch (error) {
        res.status(400).json({ status: 'fail', message: error.message });
    }
};

// Cập nhật
exports.updateCollection = async (req, res) => {
    try {
        const { name, description } = req.body;
        const updateData = { name, description };
        if (name) {
            updateData.slug = slugify(name, { lower: true });
        }
        const collection = await Collection.findByIdAndUpdate(req.params.id, updateData, { new: true, runValidators: true });
        if (!collection) return res.status(404).json({ message: 'Không tìm thấy bộ sưu tập' });
        res.status(200).json({ status: 'success', data: { collection } });
    } catch (error) {
        res.status(400).json({ status: 'fail', message: error.message });
    }
};

// Xóa
exports.deleteCollection = async (req, res) => {
    try {
        const collection = await Collection.findByIdAndDelete(req.params.id);
        if (!collection) return res.status(404).json({ message: 'Không tìm thấy bộ sưu tập' });
        res.status(204).json({ status: 'success', data: null });
    } catch (error) {
        res.status(500).json({ status: 'fail', message: error.message });
    }
};