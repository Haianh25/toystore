const mongoose = require('mongoose');

const collectionSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Tên bộ sưu tập không được để trống'],
        unique: true,
        trim: true,
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

const Collection = mongoose.model('Collection', collectionSchema);
module.exports = Collection;