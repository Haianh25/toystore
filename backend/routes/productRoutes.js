const express = require('express');
const productController = require('../controllers/productController');
const { productUpload } = require('../middleware/uploadMiddleware');

const router = express.Router();

router.route('/')
    .get(productController.getAllProducts)
    .post(productUpload, productController.createProduct);

// Thêm các route mới
router.route('/:id')
    .get(productController.getProduct)
    .patch(productUpload, productController.updateProduct)
    .delete(productController.deleteProduct);

module.exports = router;