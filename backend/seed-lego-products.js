const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('./models/productModel');
const Category = require('./models/categoryModel');
const Brand = require('./models/brandModel');
const slugify = require('slugify');

dotenv.config({ path: './.env' });

const DB = process.env.MONGO_URI;

const productsData = [
    {
        "name": "LEGO Star Wars Millennium Falcon (Starship Collection)",
        "category": "Star Wars",
        "sellPrice": 2000000,
        "mainImage": "https://images.brickset.com/sets/images/75375-1.jpg",
        "description": "921 pieces. A detailed mid-scale build part of the 25th-anniversary starship collection.",
        "ageGroups": ["12+"]
    },
    {
        "name": "LEGO Star Wars TIE Interceptor (UCS)",
        "category": "Star Wars",
        "sellPrice": 5750000,
        "mainImage": "https://images.brickset.com/sets/images/75382-1.jpg",
        "description": "1931 pieces. An Ultimate Collector Series model with intricate detailing and display stand.",
        "ageGroups": ["12+"]
    },
    {
        "name": "LEGO Icons Medieval Town Square",
        "category": "Icons",
        "sellPrice": 5750000,
        "mainImage": "https://images.brickset.com/sets/images/10332-1.jpg",
        "description": "3304 pieces. Features a tavern, cheese factory, and shieldsmith workshop.",
        "ageGroups": ["12+"]
    },
    {
        "name": "LEGO Icons The Lord of the Rings: Barad-dûr",
        "category": "Icons",
        "sellPrice": 11500000,
        "mainImage": "https://images.brickset.com/sets/images/10333-1.jpg",
        "description": "5471 pieces. An epic recreation of Sauron's fortress with the glowing Eye of Sauron.",
        "ageGroups": ["12+"]
    },
    {
        "name": "LEGO Architecture Notre-Dame de Paris",
        "category": "Architecture",
        "sellPrice": 5750000,
        "mainImage": "https://images.brickset.com/sets/images/21061-1.jpg",
        "description": "4383 pieces. A building journey that follows the historical phases of the cathedral.",
        "ageGroups": ["12+"]
    },
    {
        "name": "LEGO Ideas Dungeons & Dragons: Red Dragon's Tale",
        "category": "Ideas",
        "sellPrice": 9000000,
        "mainImage": "https://images.brickset.com/sets/images/21348-1.jpg",
        "description": "3745 pieces. Includes Cinderhowl the dragon and six minifigures for tabletop play.",
        "ageGroups": ["12+"]
    },
    {
        "name": "LEGO Icons Dune Atreides Royal Ornithopter",
        "category": "Icons",
        "sellPrice": 4125000,
        "mainImage": "https://images.brickset.com/sets/images/10327-1.jpg",
        "description": "1369 pieces. Features functional 'flapping' wings and retractable landing gear.",
        "ageGroups": ["12+"]
    },
    {
        "name": "LEGO Technic Mercedes-AMG F1 W14 E Performance",
        "category": "Technic",
        "sellPrice": 5500000,
        "mainImage": "https://images.brickset.com/sets/images/42171-1.jpg",
        "description": "1642 pieces. 1:8 scale model featuring steering and a working 6-cylinder engine.",
        "ageGroups": ["12+"]
    },
    {
        "name": "LEGO Ideas Tuxedo Cat",
        "category": "Ideas",
        "sellPrice": 2500000,
        "mainImage": "https://images.brickset.com/sets/images/21349-1.jpg",
        "description": "1710 pieces. Life-sized cat model with interchangeable eye colors and rotatable head.",
        "ageGroups": ["12+"]
    },
    {
        "name": "LEGO Icons Transformers Bumblebee",
        "category": "Icons",
        "sellPrice": 2250000,
        "mainImage": "https://images.brickset.com/sets/images/10338-1.jpg",
        "description": "950 pieces. Fully convertible from robot to Volkswagen Beetle mode without rebuilding.",
        "ageGroups": ["12+"]
    },
    {
        "name": "LEGO Icons Retro Radio",
        "category": "Icons",
        "sellPrice": 2500000,
        "mainImage": "https://images.brickset.com/sets/images/10334-1.jpg",
        "description": "906 pieces. 1970s-style radio featuring a sound brick and smartphone holder.",
        "ageGroups": ["12+"]
    },
    {
        "name": "LEGO Harry Potter Talking Sorting Hat",
        "category": "Harry Potter",
        "sellPrice": 2500000,
        "mainImage": "https://images.brickset.com/sets/images/76429-1.jpg",
        "description": "561 pieces. Features a sound brick that plays 31 different phrases to 'sort' you.",
        "ageGroups": ["12+"]
    },
    {
        "name": "LEGO Speed Champions BMW M4 GT3 & BMW M Hybrid V8",
        "category": "Speed Champions",
        "sellPrice": 1125000,
        "mainImage": "https://images.brickset.com/sets/images/76922-1.jpg",
        "description": "676 pieces. Double pack of high-performance BMW race cars.",
        "ageGroups": ["6-12"]
    },
    {
        "name": "LEGO Disney Stitch",
        "category": "Disney",
        "sellPrice": 1625000,
        "mainImage": "https://images.brickset.com/sets/images/43249-1.jpg",
        "description": "730 pieces. Buildable figure of Experiment 626 wearing a Hawaiian shirt.",
        "ageGroups": ["6-12"]
    },
    {
        "name": "LEGO Ideas Jaws",
        "category": "Ideas",
        "sellPrice": 3750000,
        "mainImage": "https://images.brickset.com/sets/images/21350-1.jpg",
        "description": "1497 pieces. Diorama of the Orca boat and the great white shark from the 1975 classic.",
        "ageGroups": ["12+"]
    },
    {
        "name": "LEGO Icons NASA Artemis Space Launch System",
        "category": "Icons",
        "sellPrice": 6500000,
        "mainImage": "https://images.brickset.com/sets/images/10341-1.jpg",
        "description": "3601 pieces. Scale model of the SLS rocket with the mobile launcher and Orion spacecraft.",
        "ageGroups": ["12+"]
    },
    {
        "name": "LEGO Icons Concorde",
        "category": "Icons",
        "sellPrice": 5000000,
        "mainImage": "https://images.brickset.com/sets/images/10318-1.jpg",
        "description": "2083 pieces. Detailed replica of the supersonic airliner with the iconic 'droop nose'.",
        "ageGroups": ["12+"]
    },
    {
        "name": "LEGO Art Milky Way Galaxy",
        "category": "Art",
        "sellPrice": 5000000,
        "mainImage": "https://images.brickset.com/sets/images/31212-1.jpg",
        "description": "3091 pieces. Layered 3D wall art piece representing our home galaxy.",
        "ageGroups": ["12+"]
    },
    {
        "name": "LEGO Marvel Avengers Tower",
        "category": "Marvel",
        "sellPrice": 12500000,
        "mainImage": "https://images.brickset.com/sets/images/76269-1.jpg",
        "description": "5201 pieces. Stands over 35 inches tall with 31 minifigures from the Infinity Saga.",
        "ageGroups": ["12+"]
    },
    {
        "name": "LEGO Technic NASA Mars Rover Perseverance",
        "category": "Technic",
        "sellPrice": 2500000,
        "mainImage": "https://images.brickset.com/sets/images/42158-1.jpg",
        "description": "1132 pieces. Interactive AR-enabled model with 360-degree steering and articulation.",
        "ageGroups": ["12+"]
    },
    {
        "name": "LEGO Icons The Botanical Garden",
        "category": "Icons",
        "sellPrice": 8250000,
        "mainImage": "https://images.brickset.com/sets/images/10345-1.jpg",
        "description": "3792 pieces. A grand Victorian-style glasshouse filled with exotic plant species (late 2024).",
        "ageGroups": ["12+"]
    },
    {
        "name": "LEGO Harry Potter Buckbeak",
        "category": "Harry Potter",
        "sellPrice": 1500000,
        "mainImage": "https://images.brickset.com/sets/images/76427-1.jpg",
        "description": "723 pieces. Large-scale buildable figure of the Hippogriff with posable wings and head.",
        "ageGroups": ["6-12"]
    },
    {
        "name": "LEGO Star Wars Boarding the Tantive IV",
        "category": "Star Wars",
        "sellPrice": 1375000,
        "mainImage": "https://images.brickset.com/sets/images/75387-1.jpg",
        "description": "502 pieces. Diorama capturing the iconic opening scene of A New Hope.",
        "ageGroups": ["6-12"]
    },
    {
        "name": "LEGO Disney Snow White and the Seven Dwarfs' Cottage",
        "category": "Disney",
        "sellPrice": 5250000,
        "mainImage": "https://images.brickset.com/sets/images/43242-1.jpg",
        "description": "2228 pieces. Detailed cottage with living, dining, and sleeping areas plus 10 minifigures.",
        "ageGroups": ["12+"]
    },
    {
        "name": "LEGO Creator Safari Animals",
        "category": "Creator 3-in-1",
        "sellPrice": 1625000,
        "mainImage": "https://images.brickset.com/sets/images/31150-1.jpg",
        "description": "780 pieces. Builds a giraffe, a gazelle with a lion, or a rhino.",
        "ageGroups": ["6-12"]
    },
    {
        "name": "LEGO Architecture Himeji Castle",
        "category": "Architecture",
        "sellPrice": 4000000,
        "mainImage": "https://images.brickset.com/sets/images/21060-1.jpg",
        "description": "2125 pieces. Authentic details of Japan’s largest castle, including cherry blossom trees.",
        "ageGroups": ["12+"]
    },
    {
        "name": "LEGO Technic Planet Earth and Moon in Motion",
        "category": "Technic",
        "sellPrice": 1875000,
        "mainImage": "https://images.brickset.com/sets/images/42179-1.jpg",
        "description": "526 pieces. Functional orrery showing the orbits of the Earth and Moon.",
        "ageGroups": ["12+"]
    },
    {
        "name": "LEGO Star Wars Invisible Hand",
        "category": "Star Wars",
        "sellPrice": 1250000,
        "mainImage": "https://images.brickset.com/sets/images/75377-1.jpg",
        "description": "557 pieces. Mid-scale model of General Grievous' flagship from Episode III.",
        "ageGroups": ["12+"]
    },
    {
        "name": "LEGO Icons Kingfisher Bird",
        "category": "Icons",
        "sellPrice": 1250000,
        "mainImage": "https://images.brickset.com/sets/images/10331-1.jpg",
        "description": "833 pieces. Striking model features a Kingfisher emerging from water with a fish.",
        "ageGroups": ["12+"]
    },
    {
        "name": "LEGO Ideas Red London Telephone Box",
        "category": "Ideas",
        "sellPrice": 2875000,
        "mainImage": "https://images.brickset.com/sets/images/21347-1.jpg",
        "description": "1460 pieces. Classic K2 kiosk with light-brick interior and street scene.",
        "ageGroups": ["12+"]
    },
    {
        "name": "LEGO Marvel X-Men X-Jet",
        "category": "Marvel",
        "sellPrice": 2125000,
        "mainImage": "https://images.brickset.com/sets/images/76281-1.jpg",
        "description": "359 pieces. Features opening cockpits and spring-loaded shooters based on X-Men ‘97.",
        "ageGroups": ["6-12"]
    },
    {
        "name": "LEGO Ninjago Wolf Mask Shadow Dojo",
        "category": "Ninjago",
        "sellPrice": 3000000,
        "mainImage": "https://images.brickset.com/sets/images/71813-1.jpg",
        "description": "1190 pieces. 2-tier dojo with secret traps and aerial battle wires.",
        "ageGroups": ["6-12"]
    },
    {
        "name": "LEGO Star Wars Captain Rex Y-Wing Microfighter",
        "category": "Star Wars",
        "sellPrice": 325000,
        "mainImage": "https://images.brickset.com/sets/images/75391-1.jpg",
        "description": "99 pieces. Includes a rare Phase II Captain Rex minifigure.",
        "ageGroups": ["6-12"]
    },
    {
        "name": "LEGO Creator Retro Camera",
        "category": "Creator 3-in-1",
        "sellPrice": 500000,
        "mainImage": "https://images.brickset.com/sets/images/31147-1.jpg",
        "description": "261 pieces. 3-in-1 set builds a camera, a video camera, or a retro TV.",
        "ageGroups": ["6-12"]
    },
    {
        "name": "LEGO Technic Kawasaki Ninja H2R Motorcycle",
        "category": "Technic",
        "sellPrice": 2125000,
        "mainImage": "https://images.brickset.com/sets/images/42170-1.jpg",
        "description": "643 pieces. 1:8 scale model with a 2-speed gearbox and steering.",
        "ageGroups": ["12+"]
    },
    {
        "name": "LEGO Batman: Gotham City Skyline",
        "category": "Batman",
        "sellPrice": 7500000,
        "mainImage": "https://images.brickset.com/sets/images/76271-1.jpg",
        "description": "4210 pieces. Art-style skyline from The Animated Series with hidden details.",
        "ageGroups": ["12+"]
    },
    {
        "name": "LEGO Ideas Polaroid OneStep SX-70 Camera",
        "category": "Ideas",
        "sellPrice": 2000000,
        "mainImage": "https://images.brickset.com/sets/images/21345-1.jpg",
        "description": "516 pieces. Functional shutter button and 'photo' ejection mechanism.",
        "ageGroups": ["12+"]
    },
    {
        "name": "LEGO Harry Potter Mandrake",
        "category": "Harry Potter",
        "sellPrice": 1750000,
        "mainImage": "https://images.brickset.com/sets/images/76433-1.jpg",
        "description": "579 pieces. Life-sized poseable plant in a buildable flowerpot.",
        "ageGroups": ["12+"]
    },
    {
        "name": "LEGO Icons Poinsettia",
        "category": "Icons",
        "sellPrice": 1250000,
        "mainImage": "https://images.brickset.com/sets/images/10370-1.jpg",
        "description": "608 pieces. Botanical collection set with a woven-basket style pot.",
        "ageGroups": ["12+"]
    },
    {
        "name": "LEGO Icons Wreath",
        "category": "Icons",
        "sellPrice": 2500000,
        "mainImage": "https://images.brickset.com/sets/images/10340-1.jpg",
        "description": "1194 pieces. Customizable holiday wreath with berries, oranges, and cones.",
        "ageGroups": ["12+"]
    },
    {
        "name": "LEGO City Space Base and Rocket Launchpad",
        "category": "City",
        "sellPrice": 3375000,
        "mainImage": "https://images.brickset.com/sets/images/60434-1.jpg",
        "description": "1422 pieces. Includes a large rocket, crane, and research lab.",
        "ageGroups": ["6-12"]
    },
    {
        "name": "LEGO City Modular Space Station",
        "category": "City",
        "sellPrice": 2750000,
        "mainImage": "https://images.brickset.com/sets/images/60433-1.jpg",
        "description": "1097 pieces. Features individual pods for the lab, kitchen, and sleeping quarters.",
        "ageGroups": ["6-12"]
    },
    {
        "name": "LEGO Star Wars Darth Maul's Sith Infiltrator",
        "category": "Star Wars",
        "sellPrice": 1750000,
        "mainImage": "https://images.brickset.com/sets/images/75383-1.jpg",
        "description": "640 pieces. Includes Saw Gerrera minifigure for the 25th anniversary.",
        "ageGroups": ["6-12"]
    },
    {
        "name": "LEGO Icons Plum Blossom",
        "category": "Icons",
        "sellPrice": 750000,
        "mainImage": "https://images.brickset.com/sets/images/10369-1.jpg",
        "description": "327 pieces. Elegant build representing winter from the Four Gentlemen collection.",
        "ageGroups": ["12+"]
    },
    {
        "name": "LEGO Icons Chrysanthemum",
        "category": "Icons",
        "sellPrice": 750000,
        "mainImage": "https://images.brickset.com/sets/images/10368-1.jpg",
        "description": "278 pieces. Features posable petals and a pastel-blue flowerpot.",
        "ageGroups": ["12+"]
    },
    {
        "name": "LEGO Harry Potter Hagrid's Hut: An Unexpected Visit",
        "category": "Harry Potter",
        "sellPrice": 1875000,
        "mainImage": "https://images.brickset.com/sets/images/76428-1.jpg",
        "description": "896 pieces. Detailed interior of Hagrid's hut with Fang the dog.",
        "ageGroups": ["6-12"]
    },
    {
        "name": "LEGO Technic VTOL Heavy Cargo Spaceship LT81",
        "category": "Technic",
        "sellPrice": 2750000,
        "mainImage": "https://images.brickset.com/sets/images/42181-1.jpg",
        "description": "1365 pieces. Features vertical takeoff and landing functions and a mini space rover.",
        "ageGroups": ["12+"]
    },
    {
        "name": "LEGO Icons Natural History Museum",
        "category": "Icons",
        "sellPrice": 7500000,
        "mainImage": "https://images.brickset.com/sets/images/10326-1.jpg",
        "description": "4014 pieces. Modular building with dinosaur skeleton and multiple exhibits.",
        "ageGroups": ["12+"]
    },
    {
        "name": "LEGO Icons The Great Deku Tree 2-in-1",
        "category": "Icons",
        "sellPrice": 7500000,
        "mainImage": "https://images.brickset.com/sets/images/73102-1.jpg",
        "description": "2500 pieces. Builds the version from Ocarina of Time or Breath of the Wild.",
        "ageGroups": ["12+"]
    },
    {
        "name": "LEGO Ninjago Kai's Source Dragon Battle",
        "category": "Ninjago",
        "sellPrice": 950000,
        "mainImage": "https://images.brickset.com/sets/images/71815-1.jpg",
        "description": "120 pieces. 4+ set designed for younger builders featuring a posable dragon.",
        "ageGroups": ["3-6"]
    }
];

mongoose.connect(DB).then(async () => {
    console.log('✅ Connected to DB');

    // 1. Ensure LEGO Brand exists
    let legoBrand = await Brand.findOne({ slug: 'lego' });
    if (!legoBrand) {
        legoBrand = await Brand.create({
            name: "LEGO",
            slug: "lego",
            logo: "/public/images/brands/lego-logo.png",
            description: "Thương hiệu đồ chơi lắp ráp nổi tiếng thế giới đến từ Đan Mạch."
        });
        console.log("Created LEGO Brand");
    }

    // 2. Map themes to Categories
    const categoryMap = {};
    for (const prod of productsData) {
        if (!categoryMap[prod.category]) {
            let cat = await Category.findOne({ name: prod.category.toUpperCase() });
            if (!cat) {
                cat = await Category.create({
                    name: prod.category.toUpperCase(),
                    slug: slugify(prod.category, { lower: true }),
                    bannerImage: "https://images.unsplash.com/photo-1585366119957-e9730b6d0f60?auto=format&fit=crop&q=80&w=1000",
                    status: "Active"
                });
                console.log(`Created Category: ${prod.category}`);
            }
            categoryMap[prod.category] = cat._id;
        }
    }

    // 3. Seed Products
    for (const prod of productsData) {
        const productExists = await Product.findOne({ name: prod.name });
        if (!productExists) {
            await Product.create({
                name: prod.name,
                description: prod.description,
                importPrice: Math.round(prod.sellPrice * 0.7),
                sellPrice: prod.sellPrice,
                ageGroups: prod.ageGroups,
                stockQuantity: Math.floor(Math.random() * 40) + 10,
                mainImage: prod.mainImage,
                categories: [categoryMap[prod.category]],
                brand: legoBrand._id,
                status: "Active"
            });
            console.log(`Seeded: ${prod.name}`);
        } else {
            console.log(`Exists: ${prod.name}`);
        }
    }

    console.log("✅ Seeding completed!");
    process.exit(0);
}).catch(err => {
    console.error('❌ Error:', err);
    process.exit(1);
});
