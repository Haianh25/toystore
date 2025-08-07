const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const User = require('../models/userModel');
const sendEmail = require('../utils/email');

// HÀM ĐĂNG KÝ (Đã cập nhật)
exports.signup = async (req, res) => {
    try {
        const newUser = await User.create({
            fullName: req.body.fullName,
            email: req.body.email,
            phone: req.body.phone,
            password: req.body.password,
        });

        const verifyToken = newUser.createEmailVerifyToken();
        await newUser.save({ validateBeforeSave: false });

        const verifyURL = `http://localhost:5000/api/v1/auth/verify-email/${verifyToken}`;
        const message = `Chào mừng bạn đến với Toy Store! Vui lòng nhấn vào link sau để xác thực tài khoản (link có hiệu lực trong 10 phút): ${verifyURL}`;
        
        await sendEmail({
            email: newUser.email,
            subject: 'Xác thực tài khoản Toy Store',
            message,
        });

        res.status(201).json({
            status: 'success',
            message: 'Đăng ký thành công! Vui lòng kiểm tra email để xác thực tài khoản.'
        });
    } catch (error) {
        // Cải thiện thông báo lỗi trùng lặp
        if (error.code === 11000) { // Lỗi trùng lặp của MongoDB
            const field = Object.keys(error.keyValue)[0];
            const message = `${field === 'email' ? 'Email' : 'Số điện thoại'} này đã được đăng ký.`;
            return res.status(400).json({ status: 'fail', message });
        }
        res.status(400).json({ status: 'fail', message: error.message });
    }
};

// HÀM XÁC THỰC EMAIL
exports.verifyEmail = async (req, res) => {
    try {
        const hashedToken = crypto.createHash('sha256').update(req.params.token).digest('hex');
        const user = await User.findOne({ 
            emailVerificationToken: hashedToken,
            emailVerificationExpires: { $gt: Date.now() } 
        });

        if (!user) {
            return res.status(400).send('<h1>Token không hợp lệ hoặc đã hết hạn!</h1>');
        }

        user.emailVerified = true;
        user.emailVerificationToken = undefined;
        user.emailVerificationExpires = undefined;
        await user.save();
        
        res.redirect('http://localhost:5173/login?verified=true');
    } catch (error) {
        res.status(500).json({ status: 'fail', message: error.message });
    }
};

// HÀM ĐĂNG NHẬP
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

exports.protect = async (req, res, next) => {
    try {
        let token;
        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
        }

        if (!token) {
            return res.status(401).json({ message: 'Bạn chưa đăng nhập. Vui lòng đăng nhập để tiếp tục.' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const currentUser = await User.findById(decoded.id);

        if (!currentUser) {
            return res.status(401).json({ message: 'Người dùng không còn tồn tại.' });
        }

        req.user = currentUser; // Gắn thông tin user vào request
        next();
    } catch (error) {
        return res.status(401).json({ message: 'Token không hợp lệ hoặc đã hết hạn.' });
    }
};

exports.restrictTo = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ message: 'Bạn không có quyền thực hiện hành động này.' });
        }
        next();
    };
};