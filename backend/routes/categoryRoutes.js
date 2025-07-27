const express = require('express');
const categoryController = require('../controllers/categoryController');
// Sửa lại cách import ở đây
const { categoryUpload } = require('../middleware/uploadMiddleware');

const router = express.Router();

router.route('/')
    .get(categoryController.getAllCategories)
    // Và sử dụng đúng biến ở đây
    .post(categoryUpload.single('bannerImage'), categoryController.createCategory);

router.route('/:id')
    // Và cả ở đây
    .patch(categoryUpload.single('bannerImage'), categoryController.updateCategory)
    .delete(categoryController.deleteCategory);

module.exports = router;