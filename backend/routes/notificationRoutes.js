const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notificationController');
const authMiddleware = require('../middleware/authMiddleware');

router.use(authMiddleware.protect);

router.post('/subscribe', notificationController.subscribe);

module.exports = router;
