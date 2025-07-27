const express = require('express');
const orderController = require('../controllers/orderController');

const router = express.Router();

router.route('/')
    .get(orderController.getAllOrders);

router.route('/:id')
    .get(orderController.getOrder)
    .patch(orderController.updateOrderStatus);

module.exports = router;