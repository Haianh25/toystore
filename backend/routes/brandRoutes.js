const express = require('express');
const brandController = require('../controllers/brandController');
const { brandUpload } = require('../middleware/uploadMiddleware');

const router = express.Router();

router.get('/slug/:slug', brandController.getBrandBySlug);

router.route('/')
    .get(brandController.getAllBrands)
    .post(brandUpload.single('logo'), brandController.createBrand);

// === BẠN ĐANG THIẾU ĐOẠN CODE NÀY ===
router.route('/:id')
    .patch(brandUpload.single('logo'), brandController.updateBrand)
    .delete(brandController.deleteBrand);
// ===================================

module.exports = router;