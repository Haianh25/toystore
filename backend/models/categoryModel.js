const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Tên danh mục không được để trống'],
        unique: true,
        trim: true,
    },
    slug: {
        type: String,
        required: true,
        unique: true,
    },
    bannerImage: {
        type: String,
        required: [true, 'Ảnh banner không được để trống'],
    },
    status: {
        type: String,
        enum: ['Active', 'Inactive'],
        default: 'Active',
    },
    sortOrder: {
        type: Number,
        default: 0,
    }
}, { timestamps: true });

const Category = mongoose.model('Category', categorySchema);
module.exports = Category;