const multer = require('multer');
const path = require('path');

const storage = (folder) => multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, `public/images/${folder}`);
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = (folder) => multer({ storage: storage(folder) });

const productUpload = multer({ storage: storage('products') }).fields([
    { name: 'mainImage', maxCount: 1 },
    { name: 'detailImages', maxCount: 10 }
]);

module.exports = {
    categoryUpload: upload('categories'),
    brandUpload: upload('brands'),
    bannerUpload: upload('banners'), // <-- Thêm upload cho banner
    sectionUpload: upload('sections'),
    productUpload: productUpload
};