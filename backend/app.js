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
app.use(cors());
app.use(express.json());

// ROUTES
// Sử dụng các router
app.use('/api/v1/users', userRouter);
app.use('/api/v1/auth', authRouter); // Gắn auth router
app.use('/api/v1/categories', categoryRouter);
app.use('/api/v1/products', productRouter);
app.use('/api/v1/orders', orderRouter);
app.use('/api/v1/vouchers', voucherRouter);
app.use('/api/v1/dashboard', dashboardRouter);
app.use('/api/v1/flash-sales', flashSaleRouter);
app.use('/api/v1/brands', brandRouter);
app.use('/api/v1/collections', collectionRouter);
app.use('/api/v1/banners', bannerRouter);
app.use('/api/v1/sections', sectionRouter);

// GLOBAL ERROR HANDLER
app.use((err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';

    res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
        stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
});

module.exports = app;