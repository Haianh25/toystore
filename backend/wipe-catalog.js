const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('./models/productModel');
const Collection = require('./models/collectionModel');
// Optionally Category if it was part of the catalog expansion
const Category = require('./models/categoryModel');

dotenv.config({ path: './.env' });

async function wipeCatalog() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');

        console.log('🧹 Wiping Products...');
        const productRes = await Product.deleteMany({});
        console.log(`✅ Deleted ${productRes.deletedCount} products.`);

        console.log('🧹 Wiping Collections...');
        const collectionRes = await Collection.deleteMany({});
        console.log(`✅ Deleted ${collectionRes.deletedCount} collections.`);

        // Also wiping Categories as they were heavily used in the LEGO expansion
        console.log('🧹 Wiping Categories...');
        const categoryRes = await Category.deleteMany({});
        console.log(`✅ Deleted ${categoryRes.deletedCount} categories.`);

        process.exit(0);
    } catch (err) {
        console.error('❌ Error wiping catalog:', err);
        process.exit(1);
    }
}

wipeCatalog();
