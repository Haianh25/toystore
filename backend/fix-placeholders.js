const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('./models/productModel');

dotenv.config({ path: './.env' });

async function fixPlaceholders() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const fallback = 'https://images.unsplash.com/photo-1585366119957-e9730b6d0f60?auto=format&fit=crop&q=80&w=1000';

        const result = await Product.updateMany(
            { mainImage: { $regex: /ANN2012|placeholder/i } },
            { mainImage: fallback }
        );

        console.log(`✅ Fixed ${result.modifiedCount} placeholder sets`);
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

fixPlaceholders();
