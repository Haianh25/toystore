const mongoose = require('mongoose');

const sectionSchema = new mongoose.Schema({
    title: {
        type: String,
        trim: true,
    },
    type: {
        type: String,
        enum: ['promo_with_products', 'banner_slider'],
        required: true,
    },
    content: {
        products: {
            type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
            validate: {
                validator: v => v.length <= 10,
                message: 'Một section chỉ có thể chứa tối đa 10 sản phẩm.'
            }
        },
        bannerImage: String,
        link: String,
        // CẬP NHẬT: bannerGroup bây giờ là một mảng các object
        bannerGroup: [{
            image: String, // Đường dẫn ảnh đã tải lên
            link: String // Đường dẫn riêng cho banner này
        }]
    },
    sortOrder: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
}, { timestamps: true });

const Section = mongoose.model('Section', sectionSchema);
module.exports = Section;