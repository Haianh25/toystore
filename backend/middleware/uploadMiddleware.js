const multer = require('multer');
const path = require('path');

const storage = (folder) => multer.diskStorage({
    destination: (req, file, cb) => cb(null, `public/images/${folder}`),
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = (folder) => multer({ storage: storage(folder) });

const productUpload = upload('products').fields([
    { name: 'mainImage', maxCount: 1 },
    { name: 'detailImages', maxCount: 10 }
]);

// SỬA LẠI HOÀN TOÀN LOGIC UPLOAD CỦA SECTION
const sectionUpload = upload('sections').fields([
    { name: 'bannerImage', maxCount: 1 }, // Cho type 'promo_with_products'
    { name: 'bannerImages', maxCount: 5 } // Cho type 'banner_slider'
]);

module.exports = {
    categoryUpload: upload('categories'),
    brandUpload: upload('brands'),
    bannerUpload: upload('banners'),
    sectionUpload, // Export trực tiếp middleware đã cấu hình
    productUpload
};