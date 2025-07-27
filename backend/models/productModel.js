const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Tên sản phẩm không được để trống'],
        trim: true,
    },
    description: {
        type: String,
        required: [true, 'Mô tả sản phẩm không được để trống'],
    },
    barcode: {
        type: String,
        trim: true,
    },
    importPrice: {
        type: Number,
        required: [true, 'Giá nhập không được để trống'],
    },
    sellPrice: {
        type: Number,
        required: [true, 'Giá bán không được để trống'],
    },
    weight: { // Đơn vị: gram
        type: Number,
        default: 0,
    },
    stockQuantity: {
        type: Number,
        required: [true, 'Số lượng tồn kho không được để trống'],
        default: 0,
    },
    mainImage: { // Ảnh đại diện
        type: String,
        required: [true, 'Ảnh đại diện không được để trống'],
    },
    detailImages: [{ // Album ảnh chi tiết
        type: String,
    }],
    category: { // Quan hệ với Category Model
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: [true, 'Sản phẩm phải thuộc về một danh mục'],
    },
}, { timestamps: true });

const Product = mongoose.model('Product', productSchema);
module.exports = Product;