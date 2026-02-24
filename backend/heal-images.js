const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('./models/productModel');
const https = require('https');

dotenv.config({ path: './.env' });

function probeUrl(url) {
    return new Promise((resolve) => {
        const req = https.get(url, (res) => {
            resolve(res.statusCode);
            res.resume();
        });
        req.on('error', () => resolve(404));
        req.setTimeout(3000, () => { req.abort(); resolve(404); });
    });
}

function getSetNum(name) {
    const match = name.match(/\[Set (.*?)-1\]/);
    return match ? match[1] : null;
}

async function healImages() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');

        const products = await Product.find({});
        console.log(`Auditing ${products.length} superhero products for image health...`);

        let fixed = 0;
        let checked = 0;
        let alreadyOk = 0;

        for (const p of products) {
            const currentStatus = await probeUrl(p.mainImage);
            checked++;

            if (currentStatus === 200) {
                alreadyOk++;
                continue;
            }

            const setNum = getSetNum(p.name);
            if (!setNum) continue;

            // Try alternative patterns
            const alternatives = [
                `https://img.bricklink.com/ItemImage/SN/0/${setNum}-1.jpg`,
                `https://img.bricklink.com/ItemImage/SN/0/${setNum}.png`,
                `https://img.bricklink.com/ItemImage/SN/0/${setNum}.jpg`,
                `https://img.bricklink.com/ItemImage/SN/1/0/${setNum}-1.png`,
                `https://www.bricklink.com/v2/catalog/catalogitem.page?S=${setNum}-1` // Not an image URL but helpful for debugging
            ];

            let found = false;
            for (const alt of alternatives) {
                if (alt.includes('catalogitem.page')) continue;

                const altStatus = await probeUrl(alt);
                if (altStatus === 200) {
                    p.mainImage = alt;
                    await p.save();
                    fixed++;
                    found = true;
                    console.log(`✅ Fixed ${setNum}: ${alt}`);
                    break;
                }
            }

            if (!found) {
                console.log(`❌ Failed to find image for ${setNum}`);
            }
        }

        console.log('--- HEALING SUMMARY ---');
        console.log(`Checked: ${checked}`);
        console.log(`Already OK: ${alreadyOk}`);
        console.log(`Fixed: ${fixed}`);
        console.log(`Total OK: ${alreadyOk + fixed}`);

        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

healImages();
