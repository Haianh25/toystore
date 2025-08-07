const multer = require('multer');
const path = require('path');

// Cấu hình lưu trữ file
const storage = (folder) => multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, `public/images/${folder}`); // Thư mục lưu file linh hoạt
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

// Cấu hình upload chung
const upload = (folder) => multer({ storage: storage(folder) });

// Middleware upload cho sản phẩm (nhiều ảnh)
const productUpload = multer({ storage: storage('products') }).fields([
    { name: 'mainImage', maxCount: 1 },
    { name: 'detailImages', maxCount: 10 }
]);

module.exports = {
    categoryUpload: upload('categories'),
    brandUpload: upload('brands'), // <-- Thêm upload cho brand
    productUpload: productUpload
};