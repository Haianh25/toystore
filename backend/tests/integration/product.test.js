const request = require('supertest');
const Product = require('../../models/productModel');
const Category = require('../../models/categoryModel');

// Mock controllers that cause hangs/issues during load
jest.mock('../../controllers/notificationController', () => ({
    sendNotification: jest.fn(),
    subscribe: (req, res) => res.status(201).json({ status: 'success' })
}));

const app = require('../../app');

describe('Product Integration Tests', () => {
    let categoryId;

    beforeEach(async () => {
        await Product.deleteMany();
        await Category.deleteMany();

        const category = await Category.create({
            name: 'Test Category',
            slug: 'test-category',
            bannerImage: 'banner.jpg'
        });
        categoryId = category._id;
    });

    describe('GET /api/v1/products', () => {
        it('should return empty list when no products exist', async () => {
            const res = await request(app).get('/api/v1/products');
            expect(res.statusCode).toBe(200);
            expect(res.body.data.products).toHaveLength(0);
        });

        it('should return products when they exist', async () => {
            await Product.create({
                name: 'Test Product',
                description: 'Description',
                importPrice: 10,
                sellPrice: 20,
                stockQuantity: 100,
                mainImage: 'image.jpg',
                categories: [categoryId]
            });

            const res = await request(app).get('/api/v1/products');
            expect(res.statusCode).toBe(200);
            expect(res.body.data.products).toHaveLength(1);
            expect(res.body.data.products[0].name).toBe('Test Product');
        });
    });

    describe('GET /api/v1/products/:id', () => {
        it('should return 404 for invalid ID', async () => {
            const res = await request(app).get('/api/v1/products/60d5ec49f396ca5e4c027811');
            expect(res.statusCode).toBe(404);
        });
    });
});
