const request = require('supertest');
const User = require('../../models/userModel');
const sendEmail = require('../../utils/email');

// Mock controllers that cause hangs/issues during load
jest.mock('../../controllers/notificationController', () => ({
    sendNotification: jest.fn(),
    subscribe: (req, res) => res.status(201).json({ status: 'success' })
}));

const app = require('../../app');

// Mock email utility
jest.mock('../../utils/email');

describe('Auth Integration Tests', () => {
    const testUser = {
        fullName: 'Test User',
        email: 'test@example.com',
        phone: '0123456789',
        password: 'password123'
    };

    beforeEach(async () => {
        await User.deleteMany();
        sendEmail.mockClear();
    });

    describe('POST /api/v1/auth/signup', () => {
        it('should create a new user and send verification email', async () => {
            const res = await request(app)
                .post('/api/v1/auth/signup')
                .send(testUser);

            expect(res.statusCode).toBe(201);
            expect(res.body.status).toBe('success');

            const user = await User.findOne({ email: testUser.email });
            expect(user).toBeDefined();
            expect(user.emailVerified).toBe(false);
            expect(sendEmail).toHaveBeenCalledTimes(1);
        });

        it('should return 400 if email already exists', async () => {
            await User.create(testUser);

            const res = await request(app)
                .post('/api/v1/auth/signup')
                .send(testUser);

            expect(res.statusCode).toBe(400);
            expect(res.body.message).toMatch(/Email hoặc số điện thoại đã tồn tại/);
        });
    });

    describe('POST /api/v1/auth/login', () => {
        beforeEach(async () => {
            // Need to save user with password for selection during login
            const user = new User(testUser);
            await user.save();
        });

        it('should return token for valid credentials', async () => {
            const res = await request(app)
                .post('/api/v1/auth/login')
                .send({
                    email: testUser.email,
                    password: testUser.password
                });

            expect(res.statusCode).toBe(200);
            expect(res.body.token).toBeDefined();
            expect(res.body.data.user.email).toBe(testUser.email);
        });

        it('should return 401 for invalid password', async () => {
            const res = await request(app)
                .post('/api/v1/auth/login')
                .send({
                    email: testUser.email,
                    password: 'wrongpassword'
                });

            expect(res.statusCode).toBe(401);
            expect(res.body.status).toBe('fail');
        });
    });
});
