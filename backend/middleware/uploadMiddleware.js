const multer = require('multer');
const path = require('path');

// Cấu hình lưu trữ file (giữ nguyên)
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        // Ảnh của danh mục và sản phẩm sẽ lưu chung một nơi cho đơn giản
        cb(null, 'public/images/products'); 
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

// >> Thêm cấu hình upload cho sản phẩm
// Middleware này sẽ xử lý nhiều trường file khác nhau
const productUpload = upload.fields([
    { name: 'mainImage', maxCount: 1 },      // Trường 'mainImage' chỉ nhận 1 file
    { name: 'detailImages', maxCount: 10 }   // Trường 'detailImages' nhận tối đa 10 file
]);

module.exports = {
    categoryUpload: upload, // Giữ lại upload cũ cho category
    productUpload: productUpload // Export upload mới cho product
};