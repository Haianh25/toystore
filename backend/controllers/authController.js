const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/userModel');

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: 'Vui lòng cung cấp email và mật khẩu.' });
        }

        // 2. Tìm user trong DB và BẮT BUỘC lấy cả mật khẩu
        const user = await User.findOne({ email }).select('+password'); // <-- SỬA DÒNG NÀY

        // Lấy phương thức so sánh mật khẩu từ model
        const correct = user ? await user.correctPassword(password, user.password) : false;

        if (!user || !correct) {
            return res.status(401).json({ message: 'Email hoặc mật khẩu không đúng.' });
        }

        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET || 'my-ultra-secret', {
            expiresIn: process.env.JWT_EXPIRES_IN || '90d',
        });

        res.status(200).json({
            status: 'success',
            token,
            data: { // <-- Thêm lại data.user
                user,
            },
        });

    } catch (error) {
        // THÊM DÒNG NÀY ĐỂ IN LỖI RA
        console.error('LỖI ĐĂNG NHẬP:', error); 
        res.status(500).json({ message: 'Có lỗi xảy ra' });
    }
};