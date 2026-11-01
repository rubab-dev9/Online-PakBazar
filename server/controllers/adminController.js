const User = require('../models/user');
const Product = require('../models/product');
const Order = require('../models/order');
const catchAsyncErrors = require('../middlewares/catchAsyncErrors');
const ErrorHandler = require('../utils/errorHandler');

// Get dashboard statistics
const getDashboardStats = catchAsyncErrors(async (req, res) => {
    const [
        totalUsers,
        totalSuppliers,
        totalCustomers,
        totalProducts,
        totalOrders,
        pendingOrders,
        totalRevenue
    ] = await Promise.all([
        User.countDocuments(),
        User.countDocuments({ role: 'supplier', isApproved: true }),
        User.countDocuments({ role: 'customer' }),
        Product.countDocuments(),
        Order.countDocuments(),
        Order.countDocuments({ orderStatus: 'pending' }),
        Order.aggregate([
            { $match: { orderStatus: 'delivered' } },
            { $group: { _id: null, total: { $sum: '$totalAmount' } } }
        ])
    ]);

    res.status(200).json({
        totalUsers,
        totalSuppliers,
        totalCustomers,
        totalProducts,
        totalOrders,
        pendingOrders,
        totalRevenue: totalRevenue[0]?.total || 0
    });
});

// Get recent orders (last 10)
const getRecentOrders = catchAsyncErrors(async (req, res) => {
    const orders = await Order.find()
        .populate('user', 'name email')
        .sort('-createdAt')
        .limit(10);

    res.status(200).json({ orders });
});

// Get recent products
const getRecentProducts = catchAsyncErrors(async (req, res) => {
    const products = await Product.find()
        .populate('supplier', 'name email')
        .sort('-createdAt')
        .limit(10);

    res.status(200).json({ products });
});

// Get pending suppliers (not approved)
const getPendingSuppliers = catchAsyncErrors(async (req, res) => {
    const suppliers = await User.find({ 
        role: 'supplier', 
        isApproved: { $ne: true } 
    }).select('-password');

    res.status(200).json({ suppliers });
});

// Approve supplier
const approveSupplier = catchAsyncErrors(async (req, res, next) => {
    const supplier = await User.findById(req.params.id);

    if (!supplier) {
        return next(new ErrorHandler('Supplier not found', 404));
    }

    if (supplier.role !== 'supplier') {
        return next(new ErrorHandler('User is not a supplier', 400));
    }

    supplier.isApproved = true;
    await supplier.save();

    res.status(200).json({
        success: true,
        message: 'Supplier approved successfully'
    });
});

// Update order status
const updateOrderStatus = catchAsyncErrors(async (req, res, next) => {
    const { status } = req.body;
    const order = await Order.findById(req.params.id);

    if (!order) {
        return next(new ErrorHandler('Order not found', 404));
    }

    order.orderStatus = status;
    order.statusHistory.push({
        status,
        date: new Date(),
        note: `Order status updated to ${status} by admin`
    });

    await order.save();

    res.status(200).json({
        success: true,
        message: 'Order status updated',
        order
    });
});

// Get order details
const getOrderDetails = catchAsyncErrors(async (req, res, next) => {
    const order = await Order.findById(req.params.id)
        .populate('user', 'name email')
        .populate('items.product', 'name images price');

    if (!order) {
        return next(new ErrorHandler('Order not found', 404));
    }

    res.status(200).json({ order });
});

// Get all users
const getAllUsers = catchAsyncErrors(async (req, res) => {
    const users = await User.find().select('-password').sort('-createdAt');
    
    res.status(200).json({ users });
});

// Get all products (admin view)
const getAllProducts = catchAsyncErrors(async (req, res) => {
    const products = await Product.find()
        .populate('supplier', 'name email')
        .sort('-createdAt');

    res.status(200).json({ products });
});

// Delete product (admin)
const deleteProduct = catchAsyncErrors(async (req, res, next) => {
    const product = await Product.findById(req.params.id);

    if (!product) {
        return next(new ErrorHandler('Product not found', 404));
    }

    await product.deleteOne();

    res.status(200).json({
        success: true,
        message: 'Product deleted successfully'
    });
});

// Delete user (admin only)
const deleteUser = catchAsyncErrors(async (req, res, next) => {
    const { id } = req.params;
    
    // Find user
    const userToDelete = await User.findById(id);
    
    if (!userToDelete) {
        return next(new ErrorHandler('User not found', 404));
    }
    
    // Prevent admin from deleting their own account
    if (userToDelete._id.toString() === req.user._id.toString()) {
        return next(new ErrorHandler('You cannot delete your own account', 400));
    }
    
    // If user is a supplier, delete their products too
    if (userToDelete.role === 'supplier') {
        await Product.deleteMany({ supplier: id });
    }
    
    // Delete user's reviews
    await Review.deleteMany({ user: id });
    
    // Delete user's wishlist
    await Wishlist.deleteOne({ user: id });
    
    // Delete the user
    await userToDelete.deleteOne();
    
    res.status(200).json({
        success: true,
        message: 'User deleted successfully'
    });
});

// Update user role (admin only)
const updateUserRole = catchAsyncErrors(async (req, res, next) => {
    const { id } = req.params;
    const { role } = req.body;
    
    // Valid roles
    const validRoles = ['customer', 'supplier', 'admin'];
    if (!validRoles.includes(role)) {
        return next(new ErrorHandler('Invalid role', 400));
    }
    
    const user = await User.findById(id);
    
    if (!user) {
        return next(new ErrorHandler('User not found', 404));
    }
    
    // Prevent changing own role
    if (user._id.toString() === req.user._id.toString()) {
        return next(new ErrorHandler('You cannot change your own role', 400));
    }
    
    user.role = role;
    await user.save();
    
    res.status(200).json({
        success: true,
        message: 'User role updated successfully',
        user
    });
});

module.exports = {
    getDashboardStats,
    getRecentOrders,
    getRecentProducts,
    getPendingSuppliers,
    approveSupplier,
    updateOrderStatus,
    getOrderDetails,
    getAllUsers,
    getAllProducts,
    deleteProduct,
    deleteUser,        
    updateUserRole 
}