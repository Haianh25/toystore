const express = require('express');
const sectionController = require('../controllers/sectionController');
const { sectionUpload } = require('../middleware/uploadMiddleware');
const router = express.Router();

router.route('/')
    .get(sectionController.getAllSections)
    .post(sectionUpload.single('image'), sectionController.createSection);

router.route('/:id')
    .patch(sectionUpload.single('image'), sectionController.updateSection)
    .delete(sectionController.deleteSection);

module.exports = router;