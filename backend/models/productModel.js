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
    ageGroups: {
        type: [String],
        enum: ['1-3', '3-6', '6-12', '12+']
    },
    weight: { 
        type: Number,
        default: 0,
    },
    stockQuantity: {
        type: Number,
        required: [true, 'Số lượng tồn kho không được để trống'],
        default: 0,
    },
    mainImage: { 
        type: String,
        required: [true, 'Ảnh đại diện không được để trống'],
    },
    detailImages: [{ 
        type: String,
    }],
    // --- THAY ĐỔI TỪ ĐƠN LẺ SANG MẢNG ---
    categories: [{ 
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
    }],
    // ------------------------------------
    brand: { 
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Brand',
        required: false, 
    },
    productCollection: { 
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Collection',
        required: false,
    },
}, { timestamps: true });

const Product = mongoose.model('Product', productSchema);
module.exports = Product;