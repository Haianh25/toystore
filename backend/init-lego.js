const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Brand = require('./models/brandModel');

dotenv.config({ path: './.env' });

async function initBrand() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        let brand = await Brand.findOne({ slug: 'lego' });
        if (!brand) {
            brand = await Brand.create({
                name: 'LEGO',
                slug: 'lego',
                description: 'The world\'s most popular building toy brand.',
                logo: 'https://upload.wikimedia.org/wikipedia/commons/2/24/LEGO_logo.svg'
            });
            console.log('✅ Created LEGO Brand');
        } else {
            console.log('ℹ️ LEGO Brand already exists');
        }
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

initBrand();
