const Order = require('../models/order');
const Product = require('../models/product');
const catchAsyncErrors = require('../middlewares/catchAsyncErrors');
const ErrorHandler = require('../utils/errorHandler');

// Create new order
const createOrder = catchAsyncErrors(async (req, res, next) => {
    const { items, shippingAddress, paymentMethod, totalAmount } = req.body;

    if (!items || items.length === 0) {
        return next(new ErrorHandler('Cart is empty', 400));
    }

    // Calculate subtotal
    const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    // Calculate shipping fee (free over Rs. 5000)
    const shippingFee = subtotal > 5000 ? 0 : 150;
    
    // Verify final total
    const calculatedTotal = subtotal + shippingFee;
    if (calculatedTotal !== totalAmount) {
        return next(new ErrorHandler('Total amount mismatch', 400));
    }

    // Check stock availability
    for (const item of items) {
        const product = await Product.findById(item.product);
        if (!product) {
            return next(new ErrorHandler(`Product ${item.name} not found`, 404));
        }
        if (product.stock < item.quantity) {
            return next(new ErrorHandler(`Only ${product.stock} items left for ${product.name}`, 400));
        }
    }

    // Create order
    const order = await Order.create({
        user: req.user._id,
        items,
        subtotal,
        shippingFee,
        totalAmount: calculatedTotal,
        shippingAddress,
        paymentMethod,
        paymentStatus: paymentMethod === 'cod' ? 'pending' : 'pending',
        orderStatus: 'pending',
        statusHistory: [{
            status: 'pending',
            date: new Date(),
            note: 'Order placed successfully'
        }]
    });

    // Reduce stock
    for (const item of items) {
        await Product.findByIdAndUpdate(item.product, {
            $inc: { stock: -item.quantity }
        });
    }

    res.status(201).json({
        success: true,
        order,
        message: 'Order placed successfully'
    });
});

// Get user's orders
const getMyOrders = catchAsyncErrors(async (req, res) => {
    const orders = await Order.find({ user: req.user._id })
        .sort('-createdAt')
        .populate('items.product', 'name images');

    res.status(200).json({
        success: true,
        orders
    });
});

// Get single order details
const getOrderDetails = catchAsyncErrors(async (req, res, next) => {
    const order = await Order.findById(req.params.id)
        .populate('user', 'name email')
        .populate('items.product', 'name images');

    if (!order) {
        return next(new ErrorHandler('Order not found', 404));
    }

    // Check if user is owner or admin
    if (order.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
        return next(new ErrorHandler('Not authorized', 403));
    }

    res.status(200).json({
        success: true,
        order
    });
});

// Cancel order (only if pending)
const cancelOrder = catchAsyncErrors(async (req, res, next) => {
    const order = await Order.findById(req.params.id);

    if (!order) {
        return next(new ErrorHandler('Order not found', 404));
    }

    if (order.user.toString() !== req.user._id.toString()) {
        return next(new ErrorHandler('Not authorized', 403));
    }

    if (order.orderStatus !== 'pending') {
        return next(new ErrorHandler('Order cannot be cancelled at this stage', 400));
    }

    order.orderStatus = 'cancelled';
    order.statusHistory.push({
        status: 'cancelled',
        date: new Date(),
        note: 'Order cancelled by customer'
    });

    // Return stock
    for (const item of order.items) {
        await Product.findByIdAndUpdate(item.product, {
            $inc: { stock: item.quantity }
        });
    }

    await order.save();

    res.status(200).json({
        success: true,
        message: 'Order cancelled successfully'
    });
});

// Admin: Update order status
const updateOrderStatus = catchAsyncErrors(async (req, res, next) => {
    const { status, note } = req.body;
    const order = await Order.findById(req.params.id);

    if (!order) {
        return next(new ErrorHandler('Order not found', 404));
    }

    order.orderStatus = status;
    order.statusHistory.push({
        status,
        date: new Date(),
        note: note || `Order status updated to ${status}`
    });

    if (status === 'delivered') {
        order.paymentStatus = 'paid';
    }

    await order.save();

    res.status(200).json({
        success: true,
        message: 'Order status updated',
        order
    });
});

// Admin: Get all orders
const getAllOrders = catchAsyncErrors(async (req, res) => {
    const orders = await Order.find()
        .populate('user', 'name email')
        .populate('items.product', 'name')
        .sort('-createdAt');

    const totalSales = orders.reduce((sum, order) => sum + order.totalAmount, 0);
    const pendingOrders = orders.filter(o => o.orderStatus === 'pending').length;

    res.status(200).json({
        success: true,
        orders,
        stats: {
            totalOrders: orders.length,
            totalSales,
            pendingOrders
        }
    });
});

module.exports = {
    createOrder,
    getMyOrders,
    getOrderDetails,
    cancelOrder,
    updateOrderStatus,
    getAllOrders
}