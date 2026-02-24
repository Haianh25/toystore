const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notificationController');
const authController = require('../controllers/authController');

router.use(authController.protect);

router.post('/subscribe', notificationController.subscribe);

module.exports = router;
