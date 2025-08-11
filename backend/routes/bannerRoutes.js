const express = require('express');
const bannerController = require('../controllers/bannerController');
const { bannerUpload } = require('../middleware/uploadMiddleware');
const router = express.Router();

router.route('/')
    .get(bannerController.getAllBanners)
    .post(bannerUpload.single('image'), bannerController.createBanner);

router.route('/:id')
    .patch(bannerUpload.single('image'), bannerController.updateBanner)
    .delete(bannerController.deleteBanner);

module.exports = router;