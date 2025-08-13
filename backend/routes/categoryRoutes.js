const express = require('express');
const categoryController = require('../controllers/categoryController');
const { categoryUpload } = require('../middleware/uploadMiddleware');

const router = express.Router();

router.get('/slug/:slug', categoryController.getCategoryBySlug);

router.route('/')
    .get(categoryController.getAllCategories)
    .post(categoryUpload.single('bannerImage'), categoryController.createCategory);

router.route('/:id')
    .patch(categoryUpload.single('bannerImage'), categoryController.updateCategory)
    .delete(categoryController.deleteCategory);

module.exports = router;