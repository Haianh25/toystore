const express = require('express');
const orderController = require('../controllers/orderController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// This route is for CUSTOMERS who are logged in to get their own orders
router.get('/my-orders', authMiddleware.protect, orderController.getMyOrders);

// This route handles ADMIN getting all orders and CUSTOMERS creating a new one
router.route('/')
    .get(authMiddleware.protect, authMiddleware.restrictTo('admin'), orderController.getAllOrders)
    .post(authMiddleware.protect, orderController.createOrder); // This was the missing part

// This route is for ADMINS to manage a specific order
router.route('/:id')
    .get(authMiddleware.protect, orderController.getOrder)
    .patch(authMiddleware.protect, authMiddleware.restrictTo('admin'), orderController.updateOrderStatus);

// These routes are for ADMINS to edit products within an order
router.route('/:id/products')
    .post(authMiddleware.protect, authMiddleware.restrictTo('admin'), orderController.addProductToOrder);

router.route('/:id/products/:productId')
    .patch(authMiddleware.protect, authMiddleware.restrictTo('admin'), orderController.updateProductInOrder)
    .delete(authMiddleware.protect, authMiddleware.restrictTo('admin'), orderController.removeProductFromOrder);

module.exports = router;