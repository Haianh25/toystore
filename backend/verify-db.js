const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Collection = require('./models/collectionModel');
const Category = require('./models/categoryModel');
const Product = require('./models/productModel');

dotenv.config({ path: './.env' });

mongoose.connect(process.env.MONGO_URI).then(async () => {
    console.log('--- ALL COLLECTIONS ---');
    const cols = await Collection.find({});
    cols.forEach(c => console.log(`- ${c.name} (${c.slug})`));

    console.log('\n--- ALL CATEGORIES ---');
    const cats = await Category.find({});
    cats.forEach(c => console.log(`- ${c.name} (${c.slug})`));

    console.log('\n--- SAMPLE PRODUCTS ---');
    const prods = await Product.find({}).limit(5);
    prods.forEach(p => console.log(`- ${p.name} | Image: ${p.mainImage}`));

    process.exit(0);
});
