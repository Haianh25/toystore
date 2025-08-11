const mongoose = require('mongoose');

const sectionSchema = new mongoose.Schema({
    title: { // Ví dụ: "Hàng mới về", "Bộ sưu tập LEGO"
        type: String,
        required: [true, 'Tiêu đề section không được để trống'],
        trim: true,
    },
    type: { // Loại section để frontend biết cách hiển thị
        type: String,
        enum: ['product_grid', 'single_banner', 'product_slider'],
        required: true,
    },
    content: {
        products: { // Sửa lại phần này
            type: [{
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Product'
            }],
            validate: [val => val.length <= 10, 'Một section chỉ có thể chứa tối đa 10 sản phẩm']
        },
        image: String,
        link: String,
    },
    sortOrder: { // Để sắp xếp thứ tự
        type: Number,
        default: 0,
    },
    isActive: {
        type: Boolean,
        default: true,
    },
}, { timestamps: true });

const Section = mongoose.model('Section', sectionSchema);
module.exports = Section;   