const User = require('../../models/userModel');
const Product = require('../../models/productModel');
const mongoose = require('mongoose');

describe('UserModel', () => {
    test('should fail if required fields are missing', async () => {
        const user = new User({});
        let err;
        try {
            await user.validate();
        } catch (error) {
            err = error;
        }
        expect(err.errors.fullName).toBeDefined();
        expect(err.errors.email).toBeDefined();
        expect(err.errors.phone).toBeDefined();
        expect(err.errors.password).toBeDefined();
    });

    test('should validate correct email format', async () => {
        const user = new User({
            fullName: 'Test User',
            email: 'invalid-email',
            phone: '0123456789',
            password: 'password123'
        });
        let err;
        try {
            await user.validate();
        } catch (error) {
            err = error;
        }
        expect(err.errors.email).toBeDefined();
    });

    test('should hash password before saving', async () => {
        const user = await User.create({
            fullName: 'Hash Test',
            email: 'hash@test.com',
            phone: '0987654321',
            password: 'password123'
        });
        expect(user.password).not.toBe('password123');
        expect(user.password.length).toBeGreaterThan(20);
    });
});

describe('ProductModel', () => {
    test('should fail if required fields are missing', async () => {
        const product = new Product({});
        let err;
        try {
            await product.validate();
        } catch (error) {
            err = error;
        }
        expect(err.errors.name).toBeDefined();
        expect(err.errors.importPrice).toBeDefined();
        expect(err.errors.sellPrice).toBeDefined();
        expect(err.errors.mainImage).toBeDefined();
    });

    test('should correctly validate ageGroups enum', async () => {
        const product = new Product({
            name: 'Toy',
            description: 'Desc',
            importPrice: 100,
            sellPrice: 150,
            mainImage: 'img.jpg',
            ageGroups: ['invalid-age']
        });
        let err;
        try {
            await product.validate();
        } catch (error) {
            err = error;
        }
        expect(err.errors['ageGroups.0']).toBeDefined();
    });
});
