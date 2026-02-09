const Review = require('../models/reviewModel');

exports.getAllReviews = async (req, res) => {
    try {
        let filter = {};
        if (req.params.productId) filter = { product: req.params.productId };

        const reviews = await Review.find(filter).populate('user', 'fullName');

        res.status(200).json({
            status: 'success',
            results: reviews.length,
            data: { reviews }
        });
    } catch (err) {
        res.status(500).json({ status: 'fail', message: err.message });
    }
};

exports.createReview = async (req, res) => {
    try {
        // Allow nested routes
        if (!req.body.product) req.body.product = req.params.productId;
        if (!req.body.user) req.body.user = req.user.id;

        const newReview = await Review.create(req.body);

        res.status(201).json({
            status: 'success',
            data: { review: newReview }
        });
    } catch (err) {
        if (err.code === 11000) {
            return res.status(400).json({ status: 'fail', message: 'Bạn đã đánh giá sản phẩm này rồi' });
        }
        res.status(400).json({ status: 'fail', message: err.message });
    }
};

exports.deleteReview = async (req, res) => {
    try {
        const review = await Review.findByIdAndDelete(req.params.id);

        if (!review) {
            return res.status(404).json({ message: 'Không tìm thấy đánh giá' });
        }

        res.status(204).json({
            status: 'success',
            data: null
        });
    } catch (err) {
        res.status(500).json({ status: 'fail', message: err.message });
    }
};
