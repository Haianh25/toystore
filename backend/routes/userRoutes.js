const express = require('express');
const userController = require('../controllers/userController');

const router = express.Router();

router
    .route('/')
    .get(userController.getAllUsers)
    .post(userController.createUser);

// (Sau này sẽ thêm các route cho /:id để sửa và xóa)
router
    .route('/:id')
    .patch(userController.updateUser)  // Dùng PATCH cho việc cập nhật
    .delete(userController.deleteUser);

module.exports = router;