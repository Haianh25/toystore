const mongoose = require('mongoose');

const brandSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Tên thương hiệu không được để trống'],
        unique: true,
        trim: true,
    },
    logo: {
        type: String, 
        required: [true, 'Logo thương hiệu không được để trống'],
    },
    description: {
        type: String,
        trim: true,
    },
    slug: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
    }
}, { timestamps: true });

const Brand = mongoose.model('Brand', brandSchema);
module.exports = Brand;