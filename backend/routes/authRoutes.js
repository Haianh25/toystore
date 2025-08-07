const express = require('express');
const authController = require('../controllers/authController');

const router = express.Router();

router.post('/login', authController.login);
router.post('/signup', authController.signup); // Route mới
router.get('/verify-email/:token', authController.verifyEmail);
module.exports = router;