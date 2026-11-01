// server/routes/supplierRoutes.js
const express = require('express');
const router = express.Router();
const {
    getDashboardStats,
    getRecentOrders,
    getTopProducts,
    updateOrderStatus,
    getSupplierProducts,
    getProductAnalytics,
    getSupplierReviews,      
    replyToReview,           
    getReviewStats, 
} = require('../controllers/supplierController');
const { protect, authorizeRole } = require('../middlewares/authMiddleware');

// All routes require supplier authentication
router.use(protect);
router.use(authorizeRole('supplier'));

router.get('/stats', getDashboardStats);
router.get('/recent-orders', getRecentOrders);
router.get('/top-products', getTopProducts);
router.put('/orders/:orderId/status', updateOrderStatus);
router.get('/products', getSupplierProducts);
router.get('/analytics', getProductAnalytics);
router.get('/reviews', getSupplierReviews);              
router.get('/reviews/stats', getReviewStats);     
router.put('/reviews/:reviewId/reply', replyToReview); 

module.exports = router;