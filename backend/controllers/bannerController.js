const Banner = require('../models/bannerModel');

exports.createBanner = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'Vui lòng tải lên ảnh banner.' });
        }
        const newBanner = await Banner.create({
            ...req.body,
            image: `/public/images/banners/${req.file.filename}`
        });
        res.status(201).json({ status: 'success', data: { banner: newBanner } });
    } catch (err) {
        res.status(400).json({ status: 'fail', message: err.message });
    }
};

exports.getAllBanners = async (req, res) => {
    try {
        const query = req.query.activeOnly === 'true' ? { isActive: true } : {};
        const banners = await Banner.find(query).sort('sortOrder');
        res.status(200).json({ status: 'success', data: { banners } });
    } catch (err) {
        res.status(500).json({ status: 'fail', message: err.message });
    }
};

exports.deleteBanner = async (req, res) => {
    // ... logic xóa banner và file ảnh tương ứng ...
};

exports.updateBanner = async (req, res) => {
    try {
        let updateData = { ...req.body };
        if (req.file) {
            updateData.image = `/public/images/banners/${req.file.filename}`;
            // (Nâng cao: có thể thêm logic xóa ảnh cũ)
        }
        const banner = await Banner.findByIdAndUpdate(req.params.id, updateData, { new: true });
        if (!banner) return res.status(404).json({ message: 'Không tìm thấy banner' });
        res.status(200).json({ status: 'success', data: { banner } });
    } catch (err) {
        res.status(400).json({ status: 'fail', message: err.message });
    }
};