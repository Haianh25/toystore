const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('./models/productModel');
const https = require('https');

dotenv.config({ path: './.env' });

function probeUrl(url) {
    return new Promise((resolve) => {
        if (!url || !url.startsWith('http')) return resolve(404);
        const req = https.get(url, (res) => {
            resolve(res.statusCode);
            res.resume();
        });
        req.on('error', () => resolve(404));
        req.setTimeout(3000, () => { req.abort(); resolve(404); });
    });
}

async function run() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const products = await Product.find({});
        console.log(`Auditing ${products.length} products for final fallback...`);

        for (const p of products) {
            const status = await probeUrl(p.mainImage);
            if (status !== 200) {
                p.mainImage = 'https://images.unsplash.com/photo-1585366119957-e9730b6d0f60?auto=format&fit=crop&q=80&w=1000';
                await p.save();
                console.log(`✅ Applied fallback for: ${p.name}`);
            }
        }
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

run();
