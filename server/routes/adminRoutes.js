const express = require('express');
const router = express.Router();

const {
    getDashboardStats,
    getRecentOrders,
    getRecentProducts,
    getPendingSuppliers,
    approveSupplier,
    updateOrderStatus,
    getAllUsers,
    getAllProducts,
    deleteProduct,
    getOrderDetails,
    deleteUser,
    updateUserRole
} = require('../controllers/adminController');

const { protect, authorizeRole } = require('../middlewares/authMiddleware');

// All routes require admin authentication
router.use(protect);
router.use(authorizeRole('admin'));

// Dashboard routes
router.get('/stats', getDashboardStats);
router.get('/recent-orders', getRecentOrders);
router.get('/recent-products', getRecentProducts);
router.get('/pending-suppliers', getPendingSuppliers);
router.put('/approve-supplier/:id', approveSupplier);
router.put('/orders/:id/status', updateOrderStatus);
router.get('/orders/:id', getOrderDetails);

// User management
router.get('/users', getAllUsers);
router.delete('/users/:id', deleteUser);
router.put('/users/:id/role', updateUserRole);

// Product management
router.get('/products', getAllProducts);
router.delete('/products/:id', deleteProduct);

module.exports = router;