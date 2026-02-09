const express = require('express');
const productController = require('../controllers/productController');
const { productUpload } = require('../middleware/uploadMiddleware');
const authMiddleware = require('../middleware/authMiddleware');
const reviewRouter = require('./reviewRoutes');
const reviewController = require('../controllers/reviewController');

const router = express.Router();

router.get('/:productId/reviews', (req, res, next) => { console.log('[ROUTE DEBUG] GET reviews reached, productId:', req.params.productId); next(); }, reviewController.getAllReviews);
router.use('/:productId/reviews', reviewRouter);

router.route('/')
    .get(productController.getAllProducts)
    .post(
        authMiddleware.protect,
        authMiddleware.restrictTo('admin'),
        productUpload,
        productController.createProduct
    );

router.route('/:id')
    .get(productController.getProduct)
    .patch(
        authMiddleware.protect,
        authMiddleware.restrictTo('admin'),
        productUpload,
        productController.updateProduct
    )
    .delete(
        authMiddleware.protect,
        authMiddleware.restrictTo('admin'),
        productController.deleteProduct
    );

module.exports = router;