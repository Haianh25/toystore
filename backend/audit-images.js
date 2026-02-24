const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('./models/productModel');

dotenv.config({ path: './.env' });

async function auditImages() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');

        const criteria = {
            $or: [
                { mainImage: '' },
                { mainImage: null },
                { mainImage: 'placeholder.jpg' },
                { mainImage: { $regex: /placeholder/i } }
            ]
        };

        const count = await Product.countDocuments(criteria);
        const sample = await Product.find(criteria).limit(20);

        console.log('--- AUDIT RESULTS ---');
        console.log(`Products missing images: ${count}`);
        console.log('Sample missing SKUs:');
        sample.forEach(p => console.log(`- ${p.sku}: ${p.name}`));

        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

auditImages();
