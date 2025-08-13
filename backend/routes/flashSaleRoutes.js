const express = require('express');
const flashSaleController = require('../controllers/flashSaleController');

const router = express.Router();


router.get('/active', flashSaleController.getActiveFlashSales);

router.route('/')
    .get(flashSaleController.getAllFlashSales)
    .post(flashSaleController.createFlashSale);

router.route('/:id')
    .get(flashSaleController.getFlashSale)
    .patch(flashSaleController.updateFlashSale)
    .delete(flashSaleController.deleteFlashSale);

module.exports = router;