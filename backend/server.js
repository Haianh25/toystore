const mongoose = require('mongoose');
const dotenv = require('dotenv');
const app = require('./app');
const notificationRouter = require('./routes/notificationRoutes');
const brandRouter = require('./routes/brandRoutes'); // Added brandRouter import

app.use('/api/v1/brands', brandRouter); // Added brandRouter middleware
app.use('/api/v1/notifications', notificationRouter); // Added notificationRouter middleware

dotenv.config({ path: './.env' });

const DB = process.env.MONGO_URI;

mongoose.connect(DB).then(() => {
    console.log('✅ Kết nối MongoDB thành công!');
}).catch(err => {
    console.error('❌ Lỗi kết nối MongoDB:', err.message);
});

const port = process.env.PORT || 5000;
const server = require('./server-http'); // Import HTTP server

server.listen(port, () => {
    console.log(`🚀 Backend đang chạy trên cổng ${port}...`);
});