const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('./models/productModel');
const https = require('https');

dotenv.config({ path: './.env' });

function probeUrl(url) {
    return new Promise((resolve) => {
        const req = https.get(url, (res) => {
            resolve(res.statusCode);
            res.resume(); // consume response data to free up memory
        });
        req.on('error', (e) => {
            resolve('ERR');
        });
        req.setTimeout(5000, () => {
            req.abort();
            resolve('TIMEOUT');
        });
    });
}

async function checkImageHealth() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');

        // Sample different types of sets
        const products = await Product.find({}).limit(50);
        console.log(`Checking ${products.length} products...`);

        const results = [];
        for (const p of products) {
            const status = await probeUrl(p.mainImage);
            results.push({ sku: p.sku, name: p.name, status, ok: status === 200, url: p.mainImage });
        }

        const broken = results.filter(r => !r.ok);
        console.log('--- PROBE RESULTS ---');
        console.log(`Checked: ${results.length}`);
        console.log(`OK: ${results.length - broken.length}`);
        console.log(`Broken/404: ${broken.length}`);

        if (broken.length > 0) {
            console.log('Sample issues:');
            broken.slice(0, 10).forEach(b => console.log(`- ${b.sku}: ${b.status} -> ${b.url}`));
        }

        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

checkImageHealth();
