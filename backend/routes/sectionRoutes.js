const express = require('express');
const sectionController = require('../controllers/sectionController');
// Sửa lại tên import cho đúng
const { sectionUpload } = require('../middleware/uploadMiddleware');
const router = express.Router();

router.route('/')
    .get(sectionController.getAllSections)
    // SỬA LẠI DÒNG NÀY:
    // Dùng đúng tên trường là 'bannerImage'
    .post(sectionUpload.single('bannerImage'), sectionController.createSection);

router.route('/:id')
    // VÀ DÒNG NÀY:
    .patch(sectionUpload.single('bannerImage'), sectionController.updateSection)
    .delete(sectionController.deleteSection);

module.exports = router;