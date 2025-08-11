const User = require('../models/userModel');

exports.getMe = (req, res, next) => {
    req.params.id = req.user.id;
    next();
};


exports.updateMe = async (req, res) => {
    try {
        const { fullName, phone, address } = req.body;

        
        const updateData = {
            fullName,
            phone,
            'address.street': address.street,
            'address.ward': address.ward,
            'address.district': address.district,
            'address.city': address.city,
        };

        const updatedUser = await User.findByIdAndUpdate(req.user.id, updateData, {
            new: true,
            runValidators: true
        });

        res.status(200).json({ status: 'success', data: { user: updatedUser } });
    } catch (error) {
        res.status(400).json({ status: 'fail', message: error.message });
    }
};

// === CÁC HÀM CHO ADMIN (Giữ nguyên) ===

// Admin lấy tất cả người dùng
exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find();
        res.status(200).json({ status: 'success', data: { users } });
    } catch (err) {
        res.status(500).json({ status: 'fail', message: err.message });
    }
};

// Admin/User lấy thông tin một người dùng bằng ID
exports.getUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'Không tìm thấy người dùng' });
        }
        res.status(200).json({ status: 'success', data: { user } });
    } catch (error) {
        res.status(500).json({ status: 'fail', message: error.message });
    }
};

// Admin tạo người dùng mới
exports.createUser = async (req, res) => {
    try {
        const newUser = await User.create(req.body);
        res.status(201).json({ status: 'success', data: { user: newUser } });
    } catch (err) {
        res.status(400).json({ status: 'fail', message: err.message });
    }
};

// Admin cập nhật người dùng
exports.updateUser = async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!user) {
            return res.status(404).json({ message: 'Không tìm thấy người dùng' });
        }
        res.status(200).json({ status: 'success', data: { user } });
    } catch (err) {
        res.status(400).json({ status: 'fail', message: err.message });
    }
};

// Admin xóa người dùng
exports.deleteUser = async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'Không tìm thấy người dùng' });
        }
        res.status(204).json({ status: 'success', data: null });
    } catch (err) {
        res.status(500).json({ status: 'fail', message: err.message });
    }
};