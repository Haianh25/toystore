const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Category = require('./models/categoryModel');

dotenv.config({ path: './.env' });

const DB = process.env.MONGO_URI;

const categoryUpdates = [
    {
        slug: "wooden-toys",
        bannerImage: "https://images.unsplash.com/photo-1558060370-d644479cb6f7?auto=format&fit=crop&q=80&w=1000"
    },
    {
        slug: "plush-toys",
        bannerImage: "https://images.unsplash.com/photo-1535572290543-960a8046f5af?auto=format&fit=crop&q=80&w=1000"
    },
    {
        slug: "educational-toys",
        bannerImage: "https://images.unsplash.com/photo-1618842676088-c4d48a6a7c9d?auto=format&fit=crop&q=80&w=1000"
    }
];

mongoose.connect(DB).then(async () => {
    console.log('✅ Connected to DB');

    for (const update of categoryUpdates) {
        await Category.findOneAndUpdate({ slug: update.slug }, { bannerImage: update.bannerImage });
        console.log(`Updated banner for category: ${update.slug}`);
    }

    process.exit(0);
}).catch(err => {
    console.error('❌ Error:', err);
    process.exit(1);
});
