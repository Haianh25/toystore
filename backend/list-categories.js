const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Category = require('./models/categoryModel');

dotenv.config({ path: './.env' });

const DB = process.env.MONGO_URI;

mongoose.connect(DB).then(async () => {
    console.log('✅ Connected to DB');
    const categories = await Category.find({}, 'name slug');
    console.log('Categories in DB:');
    categories.forEach(cat => {
        console.log(`- Name: "${cat.name}", Slug: "${cat.slug}"`);
    });
    process.exit(0);
}).catch(err => {
    console.error('❌ Connection error:', err);
    process.exit(1);
});
