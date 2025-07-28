const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/userModel'); // <-- DÒNG QUAN TRỌNG NHẤT

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: 'Vui lòng cung cấp email và mật khẩu.' });
        }

        const user = await User.findOne({ email }).select('+password');
        const correct = user ? await user.correctPassword(password, user.password) : false;

        if (!user || !correct) {
            return res.status(401).json({ message: 'Email hoặc mật khẩu không đúng.' });
        }

        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
            expiresIn: '90d',
        });
        
        user.password = undefined;

        res.status(200).json({
            status: 'success',
            token,
            data: { 
                user,
            },
        });

    } catch (error) {
        console.error('LỖI ĐĂNG NHẬP:', error);
        res.status(500).json({ message: 'Có lỗi xảy ra' });
    }
};