const express = require('express');
const userController = require('../controllers/userController');
const authController = require('../controllers/authController');

const router = express.Router();

// --- CÁC ROUTE CHO USER ĐÃ ĐĂNG NHẬP ---
// Tất cả các route từ đây trở xuống đều yêu cầu đăng nhập
router.use(authController.protect);

router.get('/me', userController.getMe, userController.getUser);
router.patch('/updateMe', userController.updateMe);


// --- CÁC ROUTE CHỈ DÀNH CHO ADMIN ---
// Ngoài việc yêu cầu đăng nhập, các route này còn yêu cầu vai trò là 'admin'
router.use(authController.restrictTo('admin'));

router.route('/')
    .get(userController.getAllUsers)
    .post(userController.createUser);

router.route('/:id')
    .get(userController.getUser) // Admin có thể lấy thông tin của bất kỳ user nào
    .patch(userController.updateUser)
    .delete(userController.deleteUser);

module.exports = router;