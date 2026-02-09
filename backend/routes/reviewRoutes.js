const express = require('express');
const reviewController = require('../controllers/reviewController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router({ mergeParams: true });

router.route('/')
    .get(reviewController.getAllReviews)
    .post(authMiddleware.protect, authMiddleware.restrictTo('user'), reviewController.createReview);

router.route('/:id')
    .delete(authMiddleware.protect, authMiddleware.restrictTo('user', 'admin'), reviewController.deleteReview);

module.exports = router;
