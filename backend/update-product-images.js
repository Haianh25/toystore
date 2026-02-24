const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('./models/productModel');

dotenv.config({ path: './.env' });

const DB = process.env.MONGO_URI;

// Reliable high-quality LEGO themed images from Unsplash
const legoImages = [
    "https://images.unsplash.com/photo-1585366119957-e9730b6d0f60?auto=format&fit=crop&q=80&w=1000",
    "https://images.unsplash.com/photo-1560343776-97e7d202ff0e?auto=format&fit=crop&q=80&w=1000",
    "https://images.unsplash.com/photo-1472457897821-70d3819a0e24?auto=format&fit=crop&q=80&w=1000",
    "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80&w=1000",
    "https://images.unsplash.com/photo-1501686696251-2a62027f3037?auto=format&fit=crop&q=80&w=1000"
];

mongoose.connect(DB).then(async () => {
    console.log('✅ Connected to DB');

    const products = await Product.find({ mainImage: { $regex: /brickset/ } });
    console.log(`Found ${products.length} products with brickset images.`);

    for (let i = 0; i < products.length; i++) {
        const prod = products[i];
        // Rotate through our reliable images
        prod.mainImage = legoImages[i % legoImages.length];
        await prod.save();
    }

    console.log("✅ Image update completed!");
    process.exit(0);
}).catch(err => {
    console.error('❌ Error:', err);
    process.exit(1);
});
