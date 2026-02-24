const fs = require('fs');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('./models/productModel');
const Category = require('./models/categoryModel');
const Collection = require('./models/collectionModel');
const Brand = require('./models/brandModel');
const slugify = require('slugify');

dotenv.config({ path: './.env' });

const DB = process.env.MONGO_URI;

function parseCSVRow(row) {
    const result = [];
    let current = '';
    let inQuotes = false;
    for (let i = 0; i < row.length; i++) {
        const char = row[i];
        if (char === '"') {
            inQuotes = !inQuotes;
        } else if (char === ',' && !inQuotes) {
            result.push(current.trim());
            current = '';
        } else {
            current += char;
        }
    }
    result.push(current.trim());
    return result;
}

async function run() {
    await mongoose.connect(DB);
    console.log('✅ Connected to DB');

    const legoBrand = await Brand.findOne({ slug: 'lego' });
    if (!legoBrand) {
        console.error("LEGO Brand not found. Run init-lego.js first.");
        process.exit(1);
    }

    const fileContent = fs.readFileSync('lego-massive.csv', 'utf-8');
    const lines = fileContent.split('\n').filter(line => line.trim() !== '');
    const header = parseCSVRow(lines[0]);

    const idx = {
        number: header.indexOf('Number'),
        theme: header.indexOf('Theme'),
        name: header.indexOf('SetName'),
        pieces: header.indexOf('Pieces'),
        year: header.indexOf('Year')
    };

    const superheroThemes = ['MARVEL', 'DC', 'SUPER HEROES', 'BATMAN', 'SPIDER-MAN', 'AVENGERS', 'JUSTICE LEAGUE'];

    console.log(`📊 Total lines to filter: ${lines.length - 1}`);

    const categoryCache = {};
    const collectionCache = {};
    const productsToInsert = [];

    for (let i = 1; i < lines.length; i++) {
        const row = parseCSVRow(lines[i]);
        if (row.length < header.length) continue;

        const themeName = (row[idx.theme] || '').toUpperCase();

        // Filter for Superheroes
        const isSuperhero = superheroThemes.some(t => themeName.includes(t));
        if (!isSuperhero) continue;

        const setNum = row[idx.number];
        let setName = row[idx.name];
        const pieces = parseInt(row[idx.pieces]) || 0;
        const year = row[idx.year];

        if (!setNum || !setName) continue;

        setName = setName.replace(/^"|"$/g, '');

        // 1. Category
        if (!categoryCache[themeName]) {
            let cat = await Category.findOne({ name: themeName });
            if (!cat) {
                cat = await Category.create({
                    name: themeName,
                    slug: slugify(themeName, { lower: true }),
                    bannerImage: "https://images.unsplash.com/photo-1612036782180-6f0b6cd846fe?auto=format&fit=crop&q=80&w=1000",
                    status: "Active"
                });
            }
            categoryCache[themeName] = cat._id;
        }

        // 2. Collection
        if (!collectionCache[themeName]) {
            let coll = await Collection.findOne({ slug: slugify(themeName, { lower: true }) });
            if (!coll) {
                coll = await Collection.create({
                    name: themeName,
                    slug: slugify(themeName, { lower: true }),
                    description: `LEGO ${themeName} - Siêu anh hùng hội tụ.`
                });
            }
            collectionCache[themeName] = coll._id;
        }

        const price = pieces > 0 ? (250000 + (pieces * 1500)) : (Math.floor(Math.random() * 800000) + 300000);

        // Standard image pattern for Superheroes
        // We will use .png as default but also have a mechanism to heal later if 404
        const mainImage = `https://img.bricklink.com/ItemImage/SN/0/${setNum}-1.png`;

        productsToInsert.push({
            name: `LEGO ${setName} [Set ${setNum}-1]`,
            description: `Khám phá thế giới siêu anh hùng với LEGO ${setName}. Ra mắt năm ${year}, bộ sản phẩm gồm ${pieces} mảnh ghép chi tiết.`,
            importPrice: Math.round(price * 0.65),
            sellPrice: Math.round(price),
            ageGroups: pieces > 600 ? ['12+'] : ['6-12'],
            stockQuantity: Math.floor(Math.random() * 30) + 5,
            mainImage,
            categories: [categoryCache[themeName]],
            productCollection: collectionCache[themeName],
            brand: legoBrand._id,
            status: "Active"
        });

        if (productsToInsert.length >= 500) {
            await Product.insertMany(productsToInsert);
            console.log(`✅ Seeded batch. Progress: ${i}/${lines.length - 1}`);
            productsToInsert.length = 0;
        }
    }

    if (productsToInsert.length > 0) {
        await Product.insertMany(productsToInsert);
    }

    const finalCount = await Product.countDocuments();
    console.log(`🏁 FINISHED! Total Superhero products: ${finalCount}`);
    process.exit(0);
}

run().catch(err => {
    console.error('❌ Error during superhero seed:', err);
    process.exit(1);
});
