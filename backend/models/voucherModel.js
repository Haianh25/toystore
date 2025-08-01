const mongoose = require('mongoose');

const voucherSchema = new mongoose.Schema({
    code: {
        type: String,
        required: [true, 'Mã voucher không được để trống'],
        unique: true,
        trim: true,
        uppercase: true, // Tự động chuyển mã thành chữ hoa
    },
    discountType: {
        type: String,
        enum: ['percentage', 'fixed_amount'], // Giảm theo % hoặc số tiền cố định
        required: true,
    },
    discountValue: {
        type: Number,
        required: [true, 'Giá trị giảm giá không được để trống'],
    },
    maxUses: { // Số lần sử dụng tối đa
        type: Number,
        required: [true, 'Số lượng mã không được để trống'],
    },
    usesCount: { // Số lần đã sử dụng
        type: Number,
        default: 0,
    },
    expiresAt: { // Ngày hết hạn
        type: Date,
        required: [true, 'Ngày hết hạn không được để trống'],
    },
    isActive: { // Cho phép admin bật/tắt voucher
        type: Boolean,
        default: true,
    },
}, { timestamps: true });

const Voucher = mongoose.model('Voucher', voucherSchema);
module.exports = Voucher;