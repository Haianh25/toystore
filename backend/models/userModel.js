const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const validator = require('validator');

const addressSchema = new mongoose.Schema({
    street: { type: String, required: true },
    ward: { type: String, required: true },
    district: { type: String, required: true },
    city: { type: String, required: true },
    isDefault: { type: Boolean, default: false },
});

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
    addresses: [addressSchema],
    active: {
        type: Boolean,
        default: true,
        select: false,
    },
}, { timestamps: true });

// Middleware mã hóa mật khẩu
userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 12);
    next();
});

// *** PHƯƠNG THỨC SO SÁNH MẬT KHẨU PHẢI NẰM Ở ĐÂY ***
userSchema.methods.correctPassword = async function(candidatePassword, userPassword) {
    return await bcrypt.compare(candidatePassword, userPassword);
};

// Sau đó mới đến dòng tạo Model
const User = mongoose.model('User', userSchema);

module.exports = User;