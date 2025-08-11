const mongoose = require('mongoose');

const voucherSchema = new mongoose.Schema({
    code: {
        type: String,
        required: [true, 'Mã voucher không được để trống'],
        unique: true,
        trim: true,
        uppercase: true, 
    },
    discountType: {
        type: String,
        enum: ['percentage', 'fixed_amount'], 
        required: true,
    },
    discountValue: {
        type: Number,
        required: [true, 'Giá trị giảm giá không được để trống'],
    },
    maxUses: { 
        type: Number,
        required: [true, 'Số lượng mã không được để trống'],
    },
    usesCount: { 
        type: Number,
        default: 0,
    },
    expiresAt: { 
        type: Date,
        required: [true, 'Ngày hết hạn không được để trống'],
    },
    isActive: { // 
        type: Boolean,
        default: true,
    },
}, { timestamps: true });

const Voucher = mongoose.model('Voucher', voucherSchema);
module.exports = Voucher;