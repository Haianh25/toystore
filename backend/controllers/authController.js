const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const sendEmail = require('../utils/email');
const crypto = require('crypto');
const catchAsync = require('../utils/catchAsync');

const signToken = id => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '90d'
    });
};

const createSendToken = (user, statusCode, res) => {
    const token = signToken(user._id);
    user.password = undefined;

    res.status(statusCode).json({
        status: 'success',
        token,
        data: {
            user
        }
    });
};

exports.signup = catchAsync(async (req, res, next) => {
    let newUser;
    try {
        newUser = await User.create({
            fullName: req.body.fullName,
            email: req.body.email,
            phone: req.body.phone,
            password: req.body.password,
        });
    } catch (err) {
        // Robust duplicate key check
        const isDuplicate = err.code === 11000 ||
            (err.message && err.message.includes('duplicate key error')) ||
            (err.name === 'MongoServerError' && err.code === 11000);

        if (isDuplicate) {
            return res.status(400).json({
                status: 'fail',
                message: 'Email hoặc số điện thoại đã tồn tại. Vui lòng sử dụng thông tin khác.'
            });
        }
        throw err;
    }

    const verifyToken = newUser.createEmailVerifyToken();
    await newUser.save({ validateBeforeSave: false });

    // Use environment variable for URL in production, but keeping it simple for now
    const verifyURL = `${req.protocol}://${req.get('host')}/api/v1/auth/verify-email/${verifyToken}`;
    const message = `Chào mừng bạn đến với Toy Store! Vui lòng nhấn vào link sau để xác thực tài khoản (link có hiệu lực trong 10 phút): ${verifyURL}`;

    try {
        await sendEmail({
            email: newUser.email,
            subject: 'Xác thực tài khoản Toy Store',
            message,
        });

        res.status(201).json({
            status: 'success',
            message: 'Đăng ký thành công! Vui lòng kiểm tra email để xác thực tài khoản.'
        });
    } catch (err) {
        console.error('ERROR SENDING EMAIL:', err);
        newUser.emailVerificationToken = undefined;
        newUser.emailVerificationExpires = undefined;
        await newUser.save({ validateBeforeSave: false });

        return res.status(500).json({
            status: 'error',
            message: 'Tài khoản đã được tạo nhưng có lỗi khi gửi email xác thực. Vui lòng liên hệ hỗ trợ hoặc thử lại sau.'
        });
    }
});

exports.verifyEmail = catchAsync(async (req, res, next) => {
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
    await user.save({ validateBeforeSave: false });

    res.redirect('http://localhost:5173/login?verified=true');
});

exports.login = catchAsync(async (req, res, next) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ status: 'fail', message: 'Vui lòng cung cấp email và mật khẩu.' });
    }

    const user = await User.findOne({ email }).select('+password');

    if (!user || !(await user.correctPassword(password, user.password))) {
        return res.status(401).json({ status: 'fail', message: 'Email hoặc mật khẩu không đúng.' });
    }

    createSendToken(user, 200, res);
});
