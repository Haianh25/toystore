const mongoose = require('mongoose');

const flashSaleProductSchema = new mongoose.Schema({
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true,
    },
    flashSalePrice: {
        type: Number,
        required: true,
    },
    flashSaleStock: {
        type: Number,
        required: true,
    },
});

const flashSaleSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Tên chương trình sale không được để trống'],
        trim: true,
    },
    startTime: {
        type: Date,
        required: true,
    },
    endTime: {
        type: Date,
        required: true,
    },
    products: [flashSaleProductSchema],
}, { timestamps: true });

const FlashSale = mongoose.model('FlashSale', flashSaleSchema);
module.exports = FlashSale;