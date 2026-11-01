const express = require('express');
const router = express.Router();
const {
    getWishlist,
    addToWishlist,
    removeFromWishlist,
    clearWishlist,
    checkWishlist,
    syncGuestWishlist
} = require('../controllers/wishlistController');
const { protect, authorizeRole } = require('../middlewares/authMiddleware');

// All wishlist routes require authentication (Customers can access)
router.use(protect);
// router.use(authorizeRole('customer'));  // Optional: uncomment if wishlist only for customers

router.get('/', getWishlist);
router.post('/add', addToWishlist);
router.delete('/remove/:productId', removeFromWishlist);
router.delete('/clear', clearWishlist);
router.get('/check/:productId', checkWishlist);
router.post('/sync', syncGuestWishlist);

module.exports = router;