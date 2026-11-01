const express = require('express');
const router = express.Router();

const {
    addReview,
    getProductReviews,
    getMyReviews,
    updateReview,
    deleteReview,
    markHelpful
} = require('../controllers/reviewController');

const { protect } = require('../middlewares/authMiddleware');

// Public routes
router.get('/product/:productId', getProductReviews);

// Protected routes (Customer only)
router.post('/add', protect, addReview);
router.get('/my-reviews', protect, getMyReviews);
router.put('/:id', protect, updateReview);
router.delete('/:id', protect, deleteReview);
router.put('/:id/helpful', protect, markHelpful);

module.exports = router;