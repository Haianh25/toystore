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

// Helper to parse CSV row accurately (handling quoted values with commas)
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
        console.error("LEGO Brand not found.");
        process.exit(1);
    }

    // 1. Wipe existing data to start fresh (as requested: "xoá toàn bộ")
    console.log("🧹 Wiping catalog...");
    await Product.deleteMany({});
    await Category.deleteMany({});
    await Collection.deleteMany({});

    const fileContent = fs.readFileSync('lego-massive.csv', 'utf-8');
    const lines = fileContent.split('\n').filter(line => line.trim() !== '');
    const header = parseCSVRow(lines[0]);

    // Header indices
    const idx = {
        number: header.indexOf('Number'),
        theme: header.indexOf('Theme'),
        name: header.indexOf('SetName'),
        pieces: header.indexOf('Pieces'),
        year: header.indexOf('Year')
    };

    console.log(`📊 Total lines to process: ${lines.length - 1}`);

    const categoryCache = {};
    const collectionCache = {};
    const productsToInsert = [];
    const BATCH_SIZE = 1000;

    for (let i = 1; i < lines.length; i++) {
        const row = parseCSVRow(lines[i]);
        if (row.length < header.length) continue;

        const setNum = row[idx.number];
        const themeName = (row[idx.theme] || 'General').toUpperCase();
        let setName = row[idx.name];
        const pieces = parseInt(row[idx.pieces]) || 0;
        const year = row[idx.year];

        if (!setNum || !setName) continue;

        // Clean name (remove quotes)
        setName = setName.replace(/^"|"$/g, '');

        // 1. Ensure Category exists
        if (!categoryCache[themeName]) {
            let cat = await Category.findOne({ name: themeName });
            if (!cat) {
                cat = await Category.create({
                    name: themeName,
                    slug: slugify(themeName, { lower: true }),
                    bannerImage: "https://images.unsplash.com/photo-1585366119957-e9730b6d0f60?auto=format&fit=crop&q=80&w=1000",
                    status: "Active"
                });
            }
            categoryCache[themeName] = cat._id;
        }

        // 2. Ensure Collection exists
        if (!collectionCache[themeName]) {
            let coll = await Collection.findOne({ slug: slugify(themeName, { lower: true }) });
            if (!coll) {
                coll = await Collection.create({
                    name: themeName,
                    slug: slugify(themeName, { lower: true }),
                    description: `Tất cả sản phẩm LEGO thuộc dòng ${themeName}`
                });
            }
            collectionCache[themeName] = coll._id;
        }

        // 3. Prepare Product
        // Pricing logic: Base 200k + (Pieces * 1200 VND)
        const price = pieces > 0 ? (200000 + (pieces * 1200)) : (Math.floor(Math.random() * 500000) + 200000);

        productsToInsert.push({
            name: `LEGO ${setName} [Set ${setNum}-1]`,
            description: `${setName} (Năm ${year}). Một sản phẩm chất lượng từ LEGO.`,
            importPrice: Math.round(price * 0.7),
            sellPrice: Math.round(price),
            ageGroups: pieces > 500 ? ['12+'] : ['6-12'],
            stockQuantity: Math.floor(Math.random() * 50) + 10,
            mainImage: `https://img.bricklink.com/ItemImage/SN/0/${setNum}-1.png`,
            categories: [categoryCache[themeName]],
            productCollection: collectionCache[themeName],
            brand: legoBrand._id,
            status: "Active"
        });

        if (productsToInsert.length >= BATCH_SIZE) {
            await Product.insertMany(productsToInsert);
            console.log(`✅ Inserted batch. Progress: ${i}/${lines.length - 1}`);
            productsToInsert.length = 0; // Clear array
        }
    }

    // Insert remaining
    if (productsToInsert.length > 0) {
        await Product.insertMany(productsToInsert);
    }

    const finalCount = await Product.countDocuments();
    console.log(`🏁 FINISHED! Total products: ${finalCount}`);
    process.exit(0);
}

run().catch(err => {
    console.error('❌ Error during import:', err);
    process.exit(1);
});
