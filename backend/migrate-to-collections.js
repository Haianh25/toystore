const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Category = require('./models/categoryModel');
const Collection = require('./models/collectionModel');
const Product = require('./models/productModel');
const slugify = require('slugify');

dotenv.config({ path: './.env' });

const DB = process.env.MONGO_URI;

mongoose.connect(DB).then(async () => {
    console.log('✅ Connected to DB');

    // 1. Get all theme-based categories
    const categories = await Category.find({});

    for (const cat of categories) {
        // Skip some system categories if needed, but here we'll move all that make sense
        if (cat.slug === 'hang-moi') continue;

        // Check if collection exists
        let collection = await Collection.findOne({ slug: cat.slug });
        if (!collection) {
            collection = await Collection.create({
                name: cat.name,
                slug: cat.slug,
                description: `Tất cả sản phẩm thuộc dòng ${cat.name}`
            });
            console.log(`Created Collection: ${cat.name}`);
        }

        // 2. Update products that have this category to also have this collection
        const prods = await Product.find({ categories: cat._id });
        for (const prod of prods) {
            prod.productCollection = collection._id;

            // Fix images while we are at it - use a more reliable LEGO CDN or placeholder if brickset is down
            // But for now, let's just make sure the URL is absolute as we did in frontend

            await prod.save();
        }
        console.log(`Updated ${prods.length} products for collection ${cat.name}`);
    }

    // 3. Special fix for the 50 LEGO products images if needed
    // Many Brickset images are working, but some might be broken.
    // Let's just double check the most common sets.

    console.log("✅ Migration completed!");
    process.exit(0);
}).catch(err => {
    console.error('❌ Error:', err);
    process.exit(1);
});
