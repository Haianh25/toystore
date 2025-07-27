const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/userModel');
const Product = require('./models/productModel');
const Order = require('./models/orderModel');

dotenv.config({ path: './.env' });

mongoose.connect(process.env.MONGO_URI).then(() => {
    console.log('✅ DB connected');
    createSampleOrder();
});

const createSampleOrder = async () => {
    try {
        // 1. Tìm một user và hai sản phẩm bất kỳ
        const user = await User.findOne({ email: 'admin@gmail.com' });
        const products = await Product.find().limit(2);

        if (!user || products.length < 2) {
            console.log('Không đủ user hoặc sản phẩm để tạo đơn hàng.');
            return;
        }

        // 2. Tạo đơn hàng
        const orderData = {
            user: user._id,
            products: [
                { product: products[0]._id, quantity: 1, price: products[0].sellPrice },
                { product: products[1]._id, quantity: 2, price: products[1].sellPrice },
            ],
            shippingAddress: {
                fullName: user.fullName,
                phone: user.phone,
                street: '123 Đường ABC',
                ward: 'Phường XYZ',
                district: 'Quận 1',
                city: 'Hồ Chí Minh',
            },
            totalAmount: products[0].sellPrice * 1 + products[1].sellPrice * 2,
        };

        await Order.create(orderData);
        console.log('✅ Tạo đơn hàng mẫu thành công!');
    } catch (error) {
        console.error('❌ Lỗi tạo đơn hàng mẫu:', error);
    } finally {
        mongoose.connection.close();
    }
};