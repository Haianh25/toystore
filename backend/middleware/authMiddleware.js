const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');

exports.protect = catchAsync(async (req, res, next) => {
    console.log('[AUTH DEBUG] protect middleware entered');
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
        console.log('[AUTH DEBUG] Token extracted from headers.');
    }

    if (!token) {
        return res.status(401).json({
            status: 'fail',
            message: 'Bạn chưa đăng nhập. Vui lòng đăng nhập để tiếp tục.'
        });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const currentUser = await User.findById(decoded.id);

    if (!currentUser) {
        return res.status(401).json({
            status: 'fail',
            message: 'Người dùng không còn tồn tại.'
        });
    }

    req.user = currentUser;
    next();
});

exports.restrictTo = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            console.log(`[AUTH DEBUG] 403 Forbidden: URL=${req.originalUrl}, Method=${req.method}, Role=${req.user.role}, Allowed=${roles}`);
            return res.status(403).json({
                status: 'fail',
                message: 'Bạn không có quyền thực hiện hành động này.'
            });
        }
        next();
    };
};
