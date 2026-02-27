const request = require('supertest');
const Order = require('../../models/orderModel');
const Product = require('../../models/productModel');
const User = require('../../models/userModel');
const Category = require('../../models/categoryModel');
const jwt = require('jsonwebtoken');

// Mock controllers that cause hangs/issues during load
jest.mock('../../controllers/notificationController', () => ({
    sendNotification: jest.fn(),
    subscribe: (req, res) => res.status(201).json({ status: 'success' })
}));

const app = require('../../app');

describe('Order Integration Tests', () => {
    let token;
    let user;
    let product;
    let category;

    beforeEach(async () => {
        await Order.deleteMany();
        await Product.deleteMany();
        await User.deleteMany();
        await Category.deleteMany();

        user = await User.create({
            fullName: 'Test Buyer',
            email: 'buyer@example.com',
            phone: '0987654321',
            password: 'password123',
            role: 'user'
        });

        token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'test-secret-key-123');

        category = await Category.create({
            name: 'Test Category',
            slug: 'test-category',
            bannerImage: 'banner.jpg'
        });

        product = await Product.create({
            name: 'Order Test Product',
            description: 'Order Test Description',
            importPrice: 50,
            sellPrice: 100,
            stockQuantity: 10,
            mainImage: 'product.jpg',
            categories: [category._id]
        });
    });

    describe('POST /api/v1/orders', () => {
        it('should create a new order and return 201', async () => {
            const orderData = {
                products: [
                    {
                        product: product._id,
                        quantity: 2,
                        price: 100
                    }
                ],
                shippingAddress: {
                    fullName: 'Test Receiver',
                    phone: '0987654321',
                    street: '123 Test St',
                    ward: 'Ward 1',
                    district: 'District 1',
                    city: 'HCMC'
                },
                paymentMethod: 'COD'
            };

            const res = await request(app)
                .post('/api/v1/orders')
                .set('Authorization', `Bearer ${token}`)
                .send(orderData);

            expect(res.statusCode).toBe(201);
            expect(res.body.status).toBe('success');
            expect(res.body.data.order.totalAmount).toBe(200);

            const createdOrder = await Order.findOne({ user: user._id });
            expect(createdOrder).toBeDefined();
            expect(createdOrder.products).toHaveLength(1);
        });

        it('should return 400 if product is out of stock', async () => {
            const orderData = {
                products: [
                    {
                        product: product._id,
                        quantity: 11, // More than stock (10)
                        price: 100
                    }
                ],
                shippingAddress: {
                    fullName: 'Test Receiver',
                    phone: '0987654321',
                    street: '123 Test St',
                    ward: 'Ward 1',
                    district: 'District 1',
                    city: 'HCMC'
                }
            };

            const res = await request(app)
                .post('/api/v1/orders')
                .set('Authorization', `Bearer ${token}`)
                .send(orderData);

            expect(res.statusCode).toBe(400);
            expect(res.body.message).toMatch(/không đủ số lượng tồn kho/);
        });
    });

    describe('GET /api/v1/orders/my-orders', () => {
        it('should return list of user orders', async () => {
            await Order.create({
                user: user._id,
                products: [{ product: product._id, quantity: 1, price: 100 }],
                totalAmount: 100,
                shippingAddress: {
                    fullName: 'Test Receiver',
                    phone: '0987654321',
                    street: '123 Test St',
                    ward: 'Ward 1',
                    district: 'District 1',
                    city: 'HCMC'
                }
            });

            const res = await request(app)
                .get('/api/v1/orders/my-orders')
                .set('Authorization', `Bearer ${token}`);

            expect(res.statusCode).toBe(200);
            expect(res.body.data.orders).toHaveLength(1);
        });
    });
});
