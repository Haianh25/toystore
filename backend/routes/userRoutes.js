const express = require('express');
const userController = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();


router.use(authMiddleware.protect);

// Wishlist Routes (Moved to top for priority)
router.get('/wishlist', (req, res, next) => { console.log('[ROUTE DEBUG] GET /wishlist reached'); next(); }, userController.getWishlist);
router.post('/wishlist', (req, res, next) => { console.log('[ROUTE DEBUG] POST /wishlist reached'); next(); }, userController.addToWishlist);
router.delete('/wishlist', (req, res, next) => { console.log('[ROUTE DEBUG] DELETE /wishlist reached'); next(); }, userController.removeFromWishlist);

router.get('/me', userController.getMe, userController.getUser);
router.patch('/updateMe', userController.updateMe);


router.use(authMiddleware.restrictTo('admin'));

router.route('/')
    .get(userController.getAllUsers)
    .post(userController.createUser);

router.route('/:id')
    .get(userController.getUser)
    .patch(userController.updateUser)
    .delete(userController.deleteUser);

module.exports = router;