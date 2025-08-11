const fs = require('fs');
const path = require('path');
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

// --- LOGIC MỚI ĐƯỢC THÊM VÀO ĐÂY ---
exports.deleteBanner = async (req, res) => {
    try {
        // 1. Tìm banner dựa trên ID để lấy đường dẫn ảnh
        const banner = await Banner.findById(req.params.id);
        if (!banner) {
            return res.status(404).json({ message: 'Không tìm thấy banner' });
        }

        // 2. Xóa file ảnh khỏi server
        if (banner.image) {
            // Tạo đường dẫn tuyệt đối đến file ảnh
            const imagePath = path.join(__dirname, '..', banner.image);
            
            // Kiểm tra xem file có tồn tại không rồi mới xóa
            if (fs.existsSync(imagePath)) {
                fs.unlinkSync(imagePath);
            }
        }

        // 3. Xóa banner khỏi database
        await Banner.findByIdAndDelete(req.params.id);

        // 4. Trả về mã 204 (No Content) báo hiệu thành công
        res.status(204).json({ status: 'success', data: null });

    } catch (err) {
        res.status(500).json({ status: 'fail', message: err.message });
    }
};
// --- KẾT THÚC LOGIC MỚI ---

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