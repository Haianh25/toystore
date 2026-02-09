const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
    review: {
        type: String,
        required: [true, 'Nhận xét không được để trống']
    },
    rating: {
        type: Number,
        min: 1,
        max: 5,
        required: [true, 'Đánh giá phải từ 1 đến 5 sao']
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: [true, 'Đánh giá phải thuộc về một sản phẩm']
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'Đánh giá phải thuộc về một người dùng']
    }
}, {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Mỗi user chỉ được đánh giá 1 sản phẩm 1 lần
reviewSchema.index({ product: 1, user: 1 }, { unique: true });

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;
