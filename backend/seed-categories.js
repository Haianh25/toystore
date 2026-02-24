const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Category = require('./models/categoryModel');

dotenv.config({ path: './.env' });

const DB = process.env.MONGO_URI;

const categories = [
    {
        name: "WOODEN HERITAGE",
        slug: "wooden-toys",
        bannerImage: "/public/images/categories/wooden.jpg",
        status: "Active"
    },
    {
        name: "SOFT COMPANIONS",
        slug: "plush-toys",
        bannerImage: "/public/images/categories/plush.jpg",
        status: "Active"
    },
    {
        name: "CREATIVE MINDS",
        slug: "educational-toys",
        bannerImage: "/public/images/categories/educational.jpg",
        status: "Active"
    }
];

mongoose.connect(DB).then(async () => {
    console.log('✅ Connected to DB');

    for (const cat of categories) {
        const exists = await Category.findOne({ slug: cat.slug });
        if (!exists) {
            await Category.create(cat);
            console.log(`Created category: ${cat.name} (${cat.slug})`);
        } else {
            console.log(`Category exists: ${cat.name} (${cat.slug})`);
        }
    }

    process.exit(0);
}).catch(err => {
    console.error('❌ Error:', err);
    process.exit(1);
});
