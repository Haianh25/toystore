const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Banner = require('./models/bannerModel');
const Section = require('./models/sectionModel');
const Product = require('./models/productModel');

dotenv.config({ path: './.env' });

async function seedAssets() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');

        // 1. Cleanup old assets
        await Banner.deleteMany({});
        await Section.deleteMany({});

        // 2. Fetch some top superhero products for featured sections
        const topProducts = await Product.find({}).limit(8);
        const productIds = topProducts.map(p => p._id);

        if (productIds.length === 0) {
            console.error('❌ No products found! Run seed-superhero.js first.');
            process.exit(1);
        }

        // 3. Seed Banners (Cinematic Superhero Sliders)
        const banners = [
            {
                image: 'https://images.unsplash.com/photo-1612036782180-6f0b6cd846fe?auto=format&fit=crop&q=80&w=2000',
                link: '/collection/marvel',
                sortOrder: 1,
                isActive: true
            },
            {
                image: 'https://images.unsplash.com/photo-1531259683007-016a7b628fc3?auto=format&fit=crop&q=80&w=2000',
                link: '/collection/batman',
                sortOrder: 2,
                isActive: true
            },
            {
                image: 'https://images.unsplash.com/photo-1608889175123-8ee362201f81?auto=format&fit=crop&q=80&w=2000',
                link: '/collection/avengers',
                sortOrder: 3,
                isActive: true
            }
        ];

        await Banner.insertMany(banners);
        console.log('✅ Seeded 3 Cinematic Banners');

        // 4. Seed Sections
        // Editorial Selection (2x2 Grid)
        await Section.create({
            title: 'THE COLLECTOR\'S CHOICE',
            type: 'promo_with_products',
            content: {
                bannerImage: 'https://images.unsplash.com/photo-1626278822467-034606778f2c?auto=format&fit=crop&q=80&w=1000',
                products: productIds.slice(0, 4)
            },
            sortOrder: 1,
            isActive: true
        });

        console.log('✅ Seeded Homepage Section (Editorial)');

        process.exit(0);
    } catch (err) {
        console.error('❌ Error seeding superhero assets:', err);
        process.exit(1);
    }
}

seedAssets();
