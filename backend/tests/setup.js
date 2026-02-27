const { MongoMemoryServer } = require('mongodb-memory-server');
const mongoose = require('mongoose');

// Set dummy environment variables for tests
process.env.VAPID_PUBLIC_KEY = 'BD6z_D-X9rS0mYh5O4FkL0M1N2P3Q4R5S6T7U8V9W0X1Y2Z3A4B5C6D7E';
process.env.VAPID_PRIVATE_KEY = 'private-key-dummy';
process.env.JWT_SECRET = 'test-secret-key-123';
process.env.NODE_ENV = 'test';

let mongoServer;

beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();

    if (mongoose.connection.readyState !== 0) {
        await mongoose.disconnect();
    }

    await mongoose.connect(mongoUri);
});

afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
});

beforeEach(async () => {
    const collections = mongoose.connection.collections;
    for (const key in collections) {
        const collection = collections[key];
        await collection.deleteMany();
    }
});
