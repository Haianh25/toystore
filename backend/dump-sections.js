const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Category = require('./models/categoryModel');
const Collection = require('./models/collectionModel');
const Section = require('./models/sectionModel');

dotenv.config({ path: './.env' });

const DB = process.env.MONGO_URI;

mongoose.connect(DB).then(async () => {
    console.log('✅ Connected to DB');
    const sections = await Section.find({});

    console.log('\n--- SECTIONS ---');
    sections.forEach(sec => {
        console.log(`ID: ${sec._id}, Title: ${sec.title}, Type: ${sec.type}`);
        console.log(`Content: ${JSON.stringify(sec.content, null, 2)}`);
    });

    process.exit(0);
}).catch(err => {
    console.error('❌ Error:', err);
    process.exit(1);
});
