const express = require('express');
const flashSaleController = require('../controllers/flashSaleController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();


router.get('/active', flashSaleController.getActiveFlashSales);

router.route('/')
    .get(flashSaleController.getAllFlashSales)
    .post(authMiddleware.protect, authMiddleware.restrictTo('admin'), flashSaleController.createFlashSale);

router.route('/:id')
    .get(flashSaleController.getFlashSale)
    .patch(authMiddleware.protect, authMiddleware.restrictTo('admin'), flashSaleController.updateFlashSale)
    .delete(authMiddleware.protect, authMiddleware.restrictTo('admin'), flashSaleController.deleteFlashSale);

module.exports = router;