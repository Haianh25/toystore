const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Category = require('./models/categoryModel');
const Collection = require('./models/collectionModel');

dotenv.config({ path: './.env' });

const DB = process.env.MONGO_URI;

mongoose.connect(DB).then(async () => {
    console.log('✅ Connected to DB');
    const categories = await Category.find({});
    const collections = await Collection.find({});

    console.log('\n--- CATEGORIES ---');
    categories.forEach(cat => console.log(`ID: ${cat._id}, Name: ${cat.name}, Slug: ${cat.slug}`));

    console.log('\n--- COLLECTIONS ---');
    collections.forEach(col => console.log(`ID: ${col._id}, Name: ${col.name}, Slug: ${col.slug}`));

    process.exit(0);
}).catch(err => {
    console.error('❌ Error:', err);
    process.exit(1);
});
