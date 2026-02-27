const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const User = require('../models/userModel');
const webpush = require('web-push');

// Configure web-push with VAPID keys
if (process.env.VAPID_PUBLIC_KEY && process.env.VAPID_PRIVATE_KEY) {
    webpush.setVapidDetails(
        'mailto:admin@thedevilplayz.com',
        process.env.VAPID_PUBLIC_KEY,
        process.env.VAPID_PRIVATE_KEY
    );
} else if (process.env.NODE_ENV !== 'test') {
    console.warn('VAPID keys not set. Push notifications will not work.');
}

exports.subscribe = catchAsync(async (req, res, next) => {
    const subscription = req.body;

    // Save subscription to user model
    await User.findByIdAndUpdate(req.user.id, {
        pushSubscription: subscription
    });

    res.status(201).json({
        status: 'success',
        message: 'Subscribed to push notifications'
    });
});

exports.sendNotification = async (user, payload) => {
    if (!user.pushSubscription) return;

    try {
        await webpush.sendNotification(user.pushSubscription, JSON.stringify(payload));
    } catch (error) {
        console.error('Error sending push notification:', error);
        // If subscription is invalid (410 Gone or 404), remove it
        if (error.statusCode === 410 || error.statusCode === 404) {
            await User.findByIdAndUpdate(user._id, { $unset: { pushSubscription: 1 } });
        }
    }
};
