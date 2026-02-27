const dotenv = require('dotenv');
dotenv.config({ path: './.env' });

const mongoose = require('mongoose');
const app = require('./app');
const notificationRouter = require('./routes/notificationRoutes');

// Routes specific to the final server setup
app.use('/api/v1/notifications', notificationRouter);

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