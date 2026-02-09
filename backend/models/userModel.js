const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const validator = require('validator');
const crypto = require('crypto');

// Không cần addressSchema riêng nữa

const userSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: [true, 'Họ tên không được để trống'],
        trim: true,
    },
    email: {
        type: String,
        required: [true, 'Email không được để trống'],
        unique: true,
        lowercase: true,
        trim: true,
        validate: [validator.isEmail, 'Vui lòng cung cấp một email hợp lệ'],
    },
    phone: {
        type: String,
        required: [true, 'Số điện thoại không được để trống'],
        unique: true,
        trim: true,
    },
    password: {
        type: String,
        required: [true, 'Mật khẩu không được để trống'],
        minlength: 6,
        select: false,
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user',
    },
    // Thay thế mảng "addresses" bằng object "address"
    address: {
        street: { type: String, default: '' },
        ward: { type: String, default: '' },
        district: { type: String, default: '' },
        city: { type: String, default: '' },
    },
    active: {
        type: Boolean,
        default: true,
        select: false,
    },
    emailVerificationToken: String,
    emailVerificationExpires: Date,
    emailVerified: {
        type: Boolean,
        default: false,
    },
    wishlist: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product'
    }],
}, { timestamps: true });

// Middleware mã hóa mật khẩu
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 12);
    next();
});

// Phương thức so sánh mật khẩu
userSchema.methods.correctPassword = async function (candidatePassword, userPassword) {
    return await bcrypt.compare(candidatePassword, userPassword);
};

// Method tạo token xác thực email
userSchema.methods.createEmailVerifyToken = function () {
    const verifyToken = crypto.randomBytes(32).toString('hex');
    this.emailVerificationToken = crypto
        .createHash('sha256')
        .update(verifyToken)
        .digest('hex');
    this.emailVerificationExpires = Date.now() + 10 * 60 * 1000; // 10 phút
    return verifyToken;
};

const User = mongoose.model('User', userSchema);
module.exports = User;