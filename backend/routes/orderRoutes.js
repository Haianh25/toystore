const express = require('express');
const orderController = require('../controllers/orderController');
const authController = require('../controllers/authController');

const router = express.Router();

// This route is for CUSTOMERS who are logged in to get their own orders
router.get('/my-orders', authController.protect, orderController.getMyOrders);    

// This route handles ADMIN getting all orders and CUSTOMERS creating a new one
router.route('/')
    .get(authController.protect, authController.restrictTo('admin'), orderController.getAllOrders)
    .post(authController.protect, orderController.createOrder); // This was the missing part

// This route is for ADMINS to manage a specific order
router.route('/:id')
    .get(authController.protect, authController.restrictTo('admin'), orderController.getOrder)
    .patch(authController.protect, authController.restrictTo('admin'), orderController.updateOrderStatus);

// These routes are for ADMINS to edit products within an order
router.route('/:id/products')
    .post(authController.protect, authController.restrictTo('admin'), orderController.addProductToOrder);

router.route('/:id/products/:productId')
    .patch(authController.protect, authController.restrictTo('admin'), orderController.updateProductInOrder)
    .delete(authController.protect, authController.restrictTo('admin'), orderController.removeProductFromOrder);

module.exports = router;