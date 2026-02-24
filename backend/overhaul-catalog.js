const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('./models/productModel');
const Category = require('./models/categoryModel');
const Collection = require('./models/collectionModel');
const Brand = require('./models/brandModel');
const slugify = require('slugify');

dotenv.config({ path: './.env' });

const DB = process.env.MONGO_URI;

const additionalProducts = [
    // ICONS
    { "set": "10305", "name": "Lion Knights' Castle", "cat": "Icons", "price": 10000000, "age": ["12+"], "desc": "4514 pieces. A massive tribute to the classic LEGO Castle theme." },
    { "set": "10316", "name": "The Lord of the Rings: Rivendell", "cat": "Icons", "price": 13000000, "age": ["12+"], "desc": "6167 pieces. An incredibly detailed recreation of the Elven sanctuary." },
    { "set": "10307", "name": "Eiffel Tower", "cat": "Icons", "price": 15000000, "age": ["12+"], "desc": "10001 pieces. The tallest LEGO set ever made, standing at 4.8 feet." },
    { "set": "10302", "name": "Optimus Prime", "cat": "Icons", "price": 4500000, "age": ["12+"], "desc": "1508 pieces. Converts from robot to truck mode without rebuilding." },
    { "set": "10294", "name": "Titanic", "cat": "Icons", "price": 16500000, "age": ["12+"], "desc": "9090 pieces. 1:200 scale model of the legendary ocean liner." },
    { "set": "10300", "name": "Back to the Future Time Machine", "cat": "Icons", "price": 5000000, "age": ["12+"], "desc": "1872 pieces. Build one of three versions of the iconic DeLorean." },
    { "set": "10317", "name": "Land Rover Classic Defender 90", "cat": "Icons", "price": 6000000, "age": ["12+"], "desc": "2336 pieces. Features functional steering, working suspension and more." },
    { "set": "10323", "name": "PAC-MAN Arcade", "cat": "Icons", "price": 6750000, "age": ["12+"], "desc": "2651 pieces. A non-functional but highly interactive arcade cabinet model." },
    { "set": "10274", "name": "Ghostbusters ECTO-1", "cat": "Icons", "price": 6000000, "age": ["12+"], "desc": "2352 pieces. Features moving sniffer, extendable gunner seat and more." },
    { "set": "10281", "name": "Bonsai Tree", "cat": "Icons", "price": 1250000, "age": ["12+"], "desc": "878 pieces. Includes interchangeable green leaves and pink cherry blossoms." },
    { "set": "10280", "name": "Flower Bouquet", "cat": "Icons", "price": 1500000, "age": ["12+"], "desc": "756 pieces. Features a variety of flowers inspired by real species." },
    { "set": "10311", "name": "Orchid", "cat": "Icons", "price": 1250000, "age": ["12+"], "desc": "608 pieces. A beautiful display piece inspired by a real orchid." },
    { "set": "10313", "name": "Wildflower Bouquet", "cat": "Icons", "price": 1500000, "age": ["12+"], "desc": "939 pieces. A colorful arrangement of 8 species of wildflowers." },
    { "set": "10314", "name": "Dried Flower Centerpiece", "cat": "Icons", "price": 1250000, "age": ["12+"], "desc": "812 pieces. Features fall-inspired colors and split design for dual building." },
    { "set": "10298", "name": "Vespa 125", "cat": "Icons", "price": 2500000, "age": ["12+"], "desc": "1106 pieces. Classic 1960s Vespa in pastel blue." },
    { "set": "10306", "name": "Atari 2600", "cat": "Icons", "price": 6000000, "age": ["12+"], "desc": "2532 pieces. Features buildable cartridges and a hidden 80s scene." },
    { "set": "10303", "name": "Loop Coaster", "cat": "Icons", "price": 10000000, "age": ["12+"], "desc": "3756 pieces. A gravity-driven roller coaster with elevator and two loops." },
    { "set": "10312", "name": "Jazz Club", "cat": "Icons", "price": 5750000, "age": ["12+"], "desc": "2899 pieces. Modular building featuring a jazz club, pizzeria and tailor." },
    { "set": "10315", "name": "Tranquil Garden", "cat": "Icons", "price": 2750000, "age": ["12+"], "desc": "1363 pieces. Inspired by a traditional Japanese garden with stone bridge and koi." },
    { "set": "10278", "name": "Police Station", "cat": "Icons", "price": 5000000, "age": ["12+"], "desc": "2923 pieces. Modular police station with donut shop and newspaper kiosk." },
    { "set": "10270", "name": "Bookshop", "cat": "Icons", "price": 5000000, "age": ["12+"], "desc": "2504 pieces. Modular bookshop and town house filled with hidden details." },
    { "set": "10297", "name": "Boutique Hotel", "cat": "Icons", "price": 5750000, "age": ["12+"], "desc": "3066 pieces. Celebrates 15 years of modular buildings with 5 rooms and an art gallery." },

    // STAR WARS
    { "set": "75192", "name": "Millennium Falcon (UCS)", "cat": "Star Wars", "price": 21500000, "age": ["12+"], "desc": "7541 pieces. The ultimate Star Wars collectible and one of the largest LEGO sets ever." },
    { "set": "75252", "name": "Imperial Star Destroyer (UCS)", "cat": "Star Wars", "price": 17500000, "age": ["12+"], "desc": "4784 pieces. Capture the scale of the Empire with this massive display model." },
    { "set": "75313", "name": "AT-AT (UCS)", "cat": "Star Wars", "price": 21500000, "age": ["12+"], "desc": "6785 pieces. Features posable legs, opening side panels and interior room." },
    { "set": "75331", "name": "The Razor Crest (UCS)", "cat": "Star Wars", "price": 15000000, "age": ["12+"], "desc": "6187 pieces. Highly detailed model of Din Djarin's ship from The Mandalorian." },
    { "set": "75308", "name": "R2-D2", "cat": "Star Wars", "price": 5750000, "age": ["12+"], "desc": "2314 pieces. Features a retractable mid-leg, rotating head and hidden tools." },
    { "set": "75309", "name": "Republic Gunship (UCS)", "cat": "Star Wars", "price": 10000000, "age": ["12+"], "desc": "3292 pieces. Massive recreation of the Clone Wars icon as voted by fans." },
    { "set": "75290", "name": "Mos Eisley Cantina", "cat": "Star Wars", "price": 10000000, "age": ["12+"], "desc": "3187 pieces. Master Builder Series set with 21 minifigures and removable roof." },
    { "set": "75341", "name": "Luke Skywalker's Landspeeder (UCS)", "cat": "Star Wars", "price": 5750000, "age": ["12+"], "desc": "1890 pieces. Authentically detailed model capturing the look of the X-34 Landspeeder." },
    { "set": "75355", "name": "X-Wing Starfighter (UCS)", "cat": "Star Wars", "price": 6000000, "age": ["12+"], "desc": "1949 pieces. Features wings that adjust from flight mode to attack mode." },
    { "set": "75367", "name": "Venator-Class Republic Attack Cruiser (UCS)", "cat": "Star Wars", "price": 17000000, "age": ["12+"], "desc": "5374 pieces. Stunning display piece representing the pride of the Republic Fleet." },
    { "set": "75354", "name": "Coruscant Guard Gunship", "cat": "Star Wars", "price": 3500000, "age": ["6-12"], "desc": "1083 pieces. Features 5 minifigures including Commander Fox and Padmé Amidala." },
    { "set": "75357", "name": "Ghost & Phantom II", "cat": "Star Wars", "price": 4000000, "age": ["6-12"], "desc": "1394 pieces. Based on the Ahsoka series with full interior and escape pod." },
    { "set": "75371", "name": "Chewbacca", "cat": "Star Wars", "price": 5000000, "age": ["12+"], "desc": "2319 pieces. Stands over 18 inches tall with buildable bowcaster." },
    { "set": "75337", "name": "AT-TE Walker", "cat": "Star Wars", "price": 3500000, "age": ["6-12"], "desc": "1082 pieces. Includes 5 Clone Troopers and 3 Battle Droids for epic battles." },
    { "set": "75356", "name": "Executor Super Star Destroyer", "cat": "Star Wars", "price": 1750000, "age": ["12+"], "desc": "630 pieces. Mid-scale model capturing Darth Vader's personal flagship." },

    // TECHNIC
    { "set": "42143", "name": "Ferrari Daytona SP3", "cat": "Technic", "price": 11500000, "age": ["12+"], "desc": "3778 pieces. 1:8 scale model with 8-speed sequential gearbox and paddle shifter." },
    { "set": "42115", "name": "Lamborghini Sián FKP 37", "cat": "Technic", "price": 11500000, "age": ["12+"], "desc": "3696 pieces. Vivid lime-green model with moving V12 engine and scissor doors." },
    { "set": "42125", "name": "Ferrari 488 GTE 'AF Corse #51'", "cat": "Technic", "price": 5000000, "age": ["12+"], "desc": "1677 pieces. Authentic details including front and rear suspension and V8 engine." },
    { "set": "42141", "name": "McLaren Formula 1 Race Car", "cat": "Technic", "price": 5000000, "age": ["12+"], "desc": "1432 pieces. Features a V6 cylinder engine with moving pistons and steering." },
    { "set": "42146", "name": "Liebherr Crawler Crane LR 13000", "cat": "Technic", "price": 17500000, "age": ["12+"], "desc": "2883 pieces. One of the largest Technic models, fully remote controlled via CONTROL+." },
    { "set": "42156", "name": "PEUGEOT 9X8 24H Le Mans Hybrid Hypercar", "cat": "Technic", "price": 5000000, "age": ["12+"], "desc": "1775 pieces. 1:10 scale model with hybrid system and suspension." },
    { "set": "42159", "name": "Yamaha MT-10 SP", "cat": "Technic", "price": 6000000, "age": ["12+"], "desc": "1478 pieces. Features a 3-speed transmission, chain drive, and functional steering." },
    { "set": "42151", "name": "Bugatti Bolide", "cat": "Technic", "price": 1250000, "age": ["6-12"], "desc": "905 pieces. Yellow and black color scheme with W16 engine and steering." },
    { "set": "42154", "name": "2022 Ford GT", "cat": "Technic", "price": 3000000, "age": ["12+"], "desc": "1466 pieces. Features rear-wheel drive, independent suspension on all wheels." },
    { "set": "42160", "name": "Audi RS Q e-tron", "cat": "Technic", "price": 4250000, "age": ["6-12"], "desc": "914 pieces. Remote controlled rally car with independent suspension." },

    // IDEAS
    { "set": "21323", "name": "Grand Piano", "cat": "Ideas", "price": 10000000, "age": ["12+"], "desc": "3662 pieces. Features a removable 25-key keyboard and self-playing function." },
    { "set": "21325", "name": "Medieval Blacksmith", "cat": "Ideas", "price": 4500000, "age": ["12+"], "desc": "2164 pieces. 3-level building featuring a glowing forge and horse-drawn cart." },
    { "set": "21327", "name": "Typewriter", "cat": "Ideas", "price": 6250000, "age": ["12+"], "desc": "2079 pieces. Features a center typebar that rises each time a letter key is pressed." },
    { "set": "21330", "name": "Home Alone", "cat": "Ideas", "price": 7500000, "age": ["12+"], "desc": "3955 pieces. Packed with references to the movie, including traps for the Wet Bandits." },
    { "set": "21331", "name": "Sonic the Hedgehog – Green Hill Zone", "cat": "Ideas", "price": 2000000, "age": ["12+"], "desc": "1125 pieces. Iconic level recreation with Dr. Eggman and Chaos Emeralds." },
    { "set": "21332", "name": "The Globe", "cat": "Ideas", "price": 5750000, "age": ["12+"], "desc": "2585 pieces. Features glowing-in-the-dark tiles and spinning axis." },
    { "set": "21333", "name": "Vincent van Gogh - The Starry Night", "cat": "Ideas", "price": 4250000, "age": ["12+"], "desc": "2316 pieces. 3D representation of the famous painting using clever building techniques." },
    { "set": "21335", "name": "Motorized Lighthouse", "cat": "Ideas", "price": 7500000, "age": ["12+"], "desc": "2065 pieces. Features a rotating Fresnel lens and custom glowing elements." },
    { "set": "21336", "name": "The Office", "cat": "Ideas", "price": 3000000, "age": ["12+"], "desc": "1164 pieces. Detailed Dunder Mifflin office with 15 minifigures of the cast." },
    { "set": "21338", "name": "A-Frame Cabin", "cat": "Ideas", "price": 4500000, "age": ["12+"], "desc": "2082 pieces. Cozy forest escape with detailed interior and autumn trees." },

    // MARVEL
    { "set": "76262", "name": "Captain America's Shield", "cat": "Marvel", "price": 5000000, "age": ["12+"], "desc": "3128 pieces. Life-sized 47cm diameter shield with display stand." },
    { "set": "76210", "name": "Hulkbuster", "cat": "Marvel", "price": 13750000, "age": ["12+"], "desc": "4049 pieces. Massive model featuring three light-up arc reactors." },
    { "set": "76178", "name": "Daily Bugle", "cat": "Marvel", "price": 8750000, "age": ["12+"], "desc": "3772 pieces. Stands over 32 inches tall with 25 Marvel minifigures." },
    { "set": "76218", "name": "Sanctum Sanctorum", "cat": "Marvel", "price": 6250000, "age": ["12+"], "desc": "2708 pieces. 3-story modular building recreating Doctor Strange's residence." },

    // HARRY POTTER
    { "set": "71043", "name": "Hogwarts Castle", "cat": "Harry Potter", "price": 11750000, "age": ["12+"], "desc": "6020 pieces. Microscale model of the castle including Hagrid's hut and Whomping Willow." },
    { "set": "75978", "name": "Diagon Alley", "cat": "Harry Potter", "price": 11250000, "age": ["12+"], "desc": "5544 pieces. Over a meter wide with Ollivander's, Flourish & Blotts and more." },
    { "set": "76391", "name": "Hogwarts Icons - Collectors' Edition", "cat": "Harry Potter", "price": 7500000, "age": ["12+"], "desc": "3010 pieces. Featuring Hedwig, Harry's wand, glasses, and three gold minifigures." },
    { "set": "76417", "name": "Gringotts Wizarding Bank – Collectors' Edition", "cat": "Harry Potter", "price": 10750000, "age": ["12+"], "desc": "4803 pieces. Features the opulent bank and the subterranean vaults." },
    { "set": "76419", "name": "Hogwarts Castle and Grounds", "cat": "Harry Potter", "price": 4250000, "age": ["12+"], "desc": "2660 pieces. Detailed scale model of the castle including the Great Hall and Boathouse." },

    // DISNEY
    { "set": "43222", "name": "LEGO Disney Castle", "cat": "Disney", "price": 10000000, "age": ["12+"], "desc": "4837 pieces. A new iteration of the iconic castle with 8 Disney minifigures." },
    { "set": "43217", "name": "‘Up’ House", "cat": "Disney", "price": 1500000, "age": ["6-12"], "desc": "598 pieces. Features the iconic house with balloons and Dug the dog." },
    { "set": "43230", "name": "Walt Disney Tribute Camera", "cat": "Disney", "price": 2500000, "age": ["12+"], "desc": "811 pieces. Vintage-style movie camera celebration of 100 years of Disney." },

    // NINJAGO
    { "set": "71741", "name": "NINJAGO City Gardens", "cat": "Ninjago", "price": 8750000, "age": ["12+"], "desc": "5685 pieces. Five tiers of stunning details from the world of Ninjago." },
    { "set": "71799", "name": "NINJAGO City Markets", "cat": "Ninjago", "price": 9250000, "age": ["12+"], "desc": "6163 pieces. A massive expansion of the Ninjago modular city." }
];

mongoose.connect(DB).then(async () => {
    console.log('✅ Connected to DB');

    const legoBrand = await Brand.findOne({ slug: 'lego' });
    if (!legoBrand) {
        console.error("LEGO Brand not found. Run previous seed first.");
        process.exit(1);
    }

    // 1. CLEANUP
    console.log("🧹 Starting Cleanup...");

    // Delete products that are NOT the recent 50 LEGO ones
    // We'll identify them by checking if brand is NOT legoBrand._id
    const deleteProducts = await Product.deleteMany({ brand: { $ne: legoBrand._id } });
    console.log(`Deleted ${deleteProducts.deletedCount} non-LEGO products.`);

    // Delete ALL collections
    const deleteCollections = await Collection.deleteMany({});
    console.log(`Deleted ${deleteCollections.deletedCount} collections.`);

    // 2. EXPANSION (Add additional products)
    console.log("🚀 Starting Expansion...");
    const categoryMap = {};

    for (const data of additionalProducts) {
        // Find or create Category (Theme)
        if (!categoryMap[data.cat]) {
            let cat = await Category.findOne({ name: data.cat.toUpperCase() });
            if (!cat) {
                cat = await Category.create({
                    name: data.cat.toUpperCase(),
                    slug: slugify(data.cat, { lower: true }),
                    bannerImage: "https://images.unsplash.com/photo-1585366119957-e9730b6d0f60?auto=format&fit=crop&q=80&w=1000",
                    status: "Active"
                });
                console.log(`Created Category/Theme: ${data.cat}`);
            }
            categoryMap[data.cat] = cat._id;
        }

        // Create Product
        const productExists = await Product.findOne({ name: `LEGO ${data.name}` });
        if (!productExists) {
            await Product.create({
                name: `LEGO ${data.name} [Set ${data.set}-1]`,
                description: data.desc,
                importPrice: Math.round(data.price * 0.7),
                sellPrice: data.price,
                ageGroups: data.age,
                stockQuantity: Math.floor(Math.random() * 30) + 5,
                mainImage: `https://img.bricklink.com/ItemImage/SN/0/${data.set}-1.png`,
                categories: [categoryMap[data.cat]],
                brand: legoBrand._id,
                status: "Active"
            });
            console.log(`Added: LEGO ${data.name}`);
        }
    }

    // 3. FINAL SYNC (Create Collections for all Themes & link them)
    console.log("🔄 Final Sync: Categories -> Collections...");
    const allCategories = await Category.find({});
    for (const cat of allCategories) {
        let collection = await Collection.findOne({ slug: cat.slug });
        if (!collection) {
            collection = await Collection.create({
                name: cat.name,
                slug: cat.slug,
                description: `Tất cả sản phẩm LEGO thuộc dòng ${cat.name}`
            });
            console.log(`Created Collection: ${cat.name}`);
        }

        // Link all products in this category to this collection
        await Product.updateMany(
            { categories: cat._id },
            { productCollection: collection._id }
        );
    }

    const finalCount = await Product.countDocuments();
    console.log(`✅ Success! Total products in catalog: ${finalCount}`);
    process.exit(0);
}).catch(err => {
    console.error('❌ Error:', err);
    process.exit(1);
});
