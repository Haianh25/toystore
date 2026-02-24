const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('./models/productModel');
const Brand = require('./models/brandModel');
const Collection = require('./models/collectionModel');

dotenv.config({ path: './.env' });

mongoose.connect(process.env.MONGO_URI).then(async () => {
    const legoBrand = await Brand.findOne({ slug: 'lego' });
    const totalProducts = await Product.countDocuments();
    const legoProducts = await Product.countDocuments({ brand: legoBrand?._id });
    const otherProducts = totalProducts - legoProducts;

    const collections = await Collection.find({}, 'name slug');

    console.log('--- DATABASE AUDIT ---');
    console.log(`Total Products: ${totalProducts}`);
    console.log(`LEGO Products (To Keep): ${legoProducts}`);
    console.log(`Other Products (To Delete): ${otherProducts}`);
    console.log(`Total Collections (To Delete): ${collections.length}`);
    console.log('Collections List:', collections.map(c => c.slug).join(', '));

    process.exit(0);
});
