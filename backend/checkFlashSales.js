const mongoose = require('mongoose');
const dotenv = require('dotenv');
const FlashSale = require('./models/flashSaleModel');

dotenv.config({ path: './.env' });

const DB = process.env.MONGO_URI;

mongoose.connect(DB).then(async () => {
    console.log('✅ Connected to MongoDB!');
    const now = new Date();
    console.log('Current server time (ISO):', now.toISOString());
    console.log('Current server time (Local):', now.toString());
    console.log('Server TZ offset:', now.getTimezoneOffset());

    const allSales = await FlashSale.find();
    console.log(`Found ${allSales.length} flash sales in total.`);

    allSales.forEach((sale, index) => {
        console.log(`\n--- Sale ${index + 1}: ${sale.title} ---`);
        console.log(`ID: ${sale._id}`);
        console.log(`Start: ${sale.startTime.toISOString()}`);
        console.log(`End: ${sale.endTime.toISOString()}`);
        console.log(`Is active now? ${sale.startTime <= now && sale.endTime >= now}`);
        console.log(`Products count: ${sale.products.length}`);
    });

    process.exit(0);
}).catch(err => {
    console.error('❌ MongoDB Connection Error:', err.message);
    process.exit(1);
});
