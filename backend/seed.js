const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/userModel');

dotenv.config({ path: './.env' });

const DB = process.env.MONGO_URI;

mongoose.connect(DB).then(() => {
    console.log('✅ Kết nối MongoDB để seeding thành công!');
    createAdmin();
});

const createAdmin = async () => {
    try {
        const adminEmail = 'admin@gmail.com';

        // 1. Kiểm tra xem admin đã tồn tại chưa
        const existingAdmin = await User.findOne({ email: adminEmail });
        if (existingAdmin) {
            console.log('Admin user đã tồn tại.');
            mongoose.connection.close();
            return;
        }

        // 2. Nếu chưa, tạo admin mới
        const adminUser = {
            fullName: 'Admin ToyStore',
            email: adminEmail,
            password: '123123', // Mật khẩu sẽ được mã hóa tự động bởi model
            phone: '0987654321',
            role: 'admin', // Đây là cách để biết đây là admin
        };

        await User.create(adminUser);
        console.log('✅ Tạo admin user thành công!');

    } catch (error) {
        console.error('❌ Lỗi khi tạo admin:', error);
    } finally {
        // 3. Đóng kết nối
        mongoose.connection.close();
    }
};