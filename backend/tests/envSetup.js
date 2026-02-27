process.env.JWT_SECRET = 'test-secret-key-123';
process.env.NODE_ENV = 'test';
process.env.PORT = '5001';
// Don't set VAPID keys here, notificationController will skip initialization if they are missing
