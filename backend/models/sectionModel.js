const mongoose = require('mongoose');

const sectionSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Tiêu đề section không được để trống'],
        trim: true,
    },
    type: {
        type: String,
        enum: ['product_grid', 'single_banner', 'product_slider', 'promo_with_products'],
        required: true,
    },
    content: {
        // === SỬA LỖI CẤU TRÚC VALIDATE TẠI ĐÂY ===
        products: {
            type: [{
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Product'
            }],
            // Validator phải được đặt trong một đối tượng 'validate'
            validate: {
                validator: function(v) {
                    // Mảng sản phẩm không được có nhiều hơn 10 phần tử
                    return v.length <= 10;
                },
                message: props => `Một section chỉ có thể chứa tối đa 10 sản phẩm.`
            }
        },
        bannerImage: String,
        link: String,
    },
    sortOrder: {
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