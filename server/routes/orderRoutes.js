const express = require('express');
const router = express.Router();
const {
    createOrder,
    getMyOrders,
    getOrderDetails,
    cancelOrder,
    updateOrderStatus,
    getAllOrders
} = require('../controllers/orderController');
const { protect, authorizeRole } = require('../middlewares/authMiddleware');

// Customer routes
router.post('/create', protect, createOrder);
router.get('/my-orders', protect, getMyOrders);
router.get('/:id', protect, getOrderDetails);
router.put('/:id/cancel', protect, cancelOrder);

// Admin only routes
router.put('/:id/status', protect, authorizeRole('admin'), updateOrderStatus);
router.get('/admin/all', protect, authorizeRole('admin'), getAllOrders);

module.exports = router;