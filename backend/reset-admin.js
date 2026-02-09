const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/userModel');

dotenv.config({ path: './.env' });

const DB = process.env.MONGO_URI;

mongoose.connect(DB).then(() => {
    console.log('✅ Connected to MongoDB for Reset...');
    resetAdmin();
});

const resetAdmin = async () => {
    try {
        const adminEmail = 'admin@gmail.com';
        const newPassword = 'password123'; // Setting it back to a standard default

        const admin = await User.findOne({ email: adminEmail });

        if (admin) {
            admin.password = newPassword;
            await admin.save();
            console.log(`✅ Admin password reset successfully to: ${newPassword}`);
        } else {
            console.log('❌ Admin user not found. Creating a new one...');
            await User.create({
                fullName: 'Admin ToyStore',
                email: adminEmail,
                password: newPassword,
                phone: '0000000000',
                role: 'admin'
            });
            console.log('✅ New Admin user created with password: ' + newPassword);
        }
    } catch (error) {
        console.error('❌ Error during reset:', error);
    } finally {
        mongoose.connection.close();
    }
};
