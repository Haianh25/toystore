const express = require('express');
const orderController = require('../controllers/orderController');

const router = express.Router();

// Route cho danh sách và chi tiết
router.route('/')
    .get(orderController.getAllOrders);

router.route('/:id')
    .get(orderController.getOrder)
    .patch(orderController.updateOrderStatus);

// === THÊM CÁC ROUTE CÒN THIẾU ===
// Route để thêm sản phẩm mới vào đơn hàng
router.route('/:id/products')
    .post(orderController.addProductToOrder);

// Route để cập nhật hoặc xóa một sản phẩm đã có trong đơn hàng
router.route('/:id/products/:productId')
    .patch(orderController.updateProductInOrder)
    .delete(orderController.removeProductFromOrder);
    
module.exports = router;