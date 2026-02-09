const express = require('express');
const cors = require('cors');
const path = require('path');

const userRouter = require('./routes/userRoutes');
const authRouter = require('./routes/authRoutes'); // Import auth router
const categoryRouter = require('./routes/categoryRoutes');
const productRouter = require('./routes/productRoutes');
const orderRouter = require('./routes/orderRoutes');
const voucherRouter = require('./routes/voucherRoutes');
const dashboardRouter = require('./routes/dashboardRoutes');
const flashSaleRouter = require('./routes/flashSaleRoutes');
const brandRouter = require('./routes/brandRoutes');
const collectionRouter = require('./routes/collectionRoutes');
const bannerRouter = require('./routes/bannerRoutes');
const sectionRouter = require('./routes/sectionRoutes');

const app = express();

// MIDDLEWARES
app.use('/public', express.static(path.join(__dirname, 'public')));
app.use('/images', express.static(path.join(__dirname, 'public/images')));
app.use(cors());
app.use(express.json());

// ROUTES
// Sử dụng các router
app.use('/api/v1/users', userRouter);
app.use('/api/v1/auth', authRouter); // Gắn auth router
app.use('/api/v1/categories', categoryRouter);
app.use('/api/v1/products', productRouter);
app.use('/api/v1/orders', orderRouter);
// app.use('/api/v1/vouchers', voucherRouter);
app.use('/api/v1/dashboard', dashboardRouter);
// app.use('/api/v1/flash-sales', flashSaleRouter);
app.use('/api/v1/brands', brandRouter);
app.use('/api/v1/collections', collectionRouter);
app.use('/api/v1/banners', bannerRouter);
app.use('/api/v1/sections', sectionRouter);

// GLOBAL ERROR HANDLER
app.use((err, req, res, next) => {
    let error = { ...err };
    error.message = err.message;
    error.statusCode = err.statusCode || 500;
    error.status = err.status || 'error';

    // Handle Mongoose Duplicate Key Error (Code 11000)
    // Check err directly as properties might be on prototype
    const isDuplicateError = (err.name === 'MongoServerError' && err.code === 11000) ||
        err.code === 11000 ||
        (err.message && err.message.includes('duplicate key error'));

    if (isDuplicateError) {
        error.statusCode = 400;
        let field = 'Trường dữ liệu'; // Default field name

        // Try to extract field from keyValue
        if (err.keyValue) {
            field = Object.keys(err.keyValue)[0];
        }
        // Fallback: extract from message (e.g. index: email_1 dup key)
        else if (err.message) {
            const matchIndex = err.message.match(/index: (\w+)_/);
            if (matchIndex && matchIndex[1]) {
                field = matchIndex[1];
            } else {
                const matchKey = err.message.match(/dup key: { (\w+):/);
                if (matchKey && matchKey[1]) field = matchKey[1];
            }
        }

        error.message = `${field === 'email' ? 'Email' : field === 'phone' ? 'Số điện thoại' : field} đã tồn tại. Vui lòng sử dụng giá trị khác.`;
        error.status = 'fail';
    }

    // Handle Mongoose Validation Error
    if (err.name === 'ValidationError') {
        error.statusCode = 400;
        const messages = Object.values(err.errors).map(el => el.message);
        error.message = `Dữ liệu không hợp lệ: ${messages.join('. ')}`;
        error.status = 'fail';
    }

    // Handle JWT Errors
    if (err.name === 'JsonWebTokenError') {
        error.statusCode = 401;
        error.message = 'Token không hợp lệ. Vui lòng đăng nhập lại.';
        error.status = 'fail';
    }
    if (err.name === 'TokenExpiredError') {
        error.statusCode = 401;
        error.message = 'Token đã hết hạn. Vui lòng đăng nhập lại.';
        error.status = 'fail';
    }

    res.status(error.statusCode).json({
        status: error.status,
        message: error.message,
        stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
});

module.exports = app;