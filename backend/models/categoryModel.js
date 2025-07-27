const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Tên danh mục không được để trống'],
        unique: true,
        trim: true,
    },
    slug: { // Dùng cho URL thân thiện, vd: /do-choi-be-trai
        type: String,
        required: true,
        unique: true,
    },
    bannerImage: {
        type: String, // Sẽ lưu đường dẫn đến file ảnh
        required: [true, 'Ảnh banner không được để trống'],
    },
    status: {
        type: String,
        enum: ['Active', 'Inactive'], // Chỉ cho phép 2 giá trị này
        default: 'Active',
    },
    sortOrder: { // Dùng để sắp xếp vị trí hiển thị
        type: Number,
        default: 0,
    }
}, { timestamps: true });

const Category = mongoose.model('Category', categorySchema);
module.exports = Category;