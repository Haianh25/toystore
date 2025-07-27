const User = require('../models/userModel');

// Phải có 'exports.' ở đầu mỗi hàm
exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find();
        res.status(200).json({
            status: 'success',
            results: users.length,
            data: { users },
        });
    } catch (err) {
        res.status(500).json({ status: 'fail', message: err.message });
    }
};

exports.createUser = async (req, res) => {
    try {
        const newUser = await User.create(req.body);
        res.status(201).json({
            status: 'success',
            data: { user: newUser },
        });
    } catch (err) {
        res.status(400).json({ status: 'fail', message: err.message });
    }
};

// Thêm 2 hàm này vào cuối file userController.js

exports.updateUser = async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(req.params.id, req.body, {
            new: true, // Trả về document đã được cập nhật
            runValidators: true,
        });

        if (!user) {
            return res.status(404).json({ status: 'fail', message: 'Không tìm thấy người dùng' });
        }

        res.status(200).json({ status: 'success', data: { user } });
    } catch (err) {
        res.status(400).json({ status: 'fail', message: err.message });
    }
};

exports.deleteUser = async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);

        if (!user) {
            return res.status(404).json({ status: 'fail', message: 'Không tìm thấy người dùng' });
        }

        res.status(204).json({ status: 'success', data: null }); // 204 No Content
    } catch (err) {
        res.status(500).json({ status: 'fail', message: err.message });
    }
};