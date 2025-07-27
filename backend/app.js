const express = require('express');
const cors = require('cors');
const path = require('path');

const userRouter = require('./routes/userRoutes');
const authRouter = require('./routes/authRoutes'); // Import auth router
const categoryRouter = require('./routes/categoryRoutes');
const productRouter = require('./routes/productRoutes');
const orderRouter = require('./routes/orderRoutes');

const app = express();
app.use('/public', express.static(path.join(__dirname, 'public')));
app.use(cors());
app.use(express.json());

// Sử dụng các router
app.use('/api/v1/users', userRouter);
app.use('/api/v1/auth', authRouter); // Gắn auth router
app.use('/api/v1/categories', categoryRouter);
app.use('/api/v1/products', productRouter);
app.use('/api/v1/orders', orderRouter);


module.exports = app;