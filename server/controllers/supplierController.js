// server/controllers/supplierController.js
const Product = require('../models/Product');
const Order = require('../models/Order');
const Review = require('../models/Review');
const catchAsyncErrors = require('../middlewares/catchAsyncErrors');
const ErrorHandler = require('../utils/errorHandler');

// Get supplier dashboard statistics
const getDashboardStats = catchAsyncErrors(async (req, res) => {
    const supplierId = req.user._id;

    const [
        totalProducts,
        totalOrders,
        pendingOrders,
        totalRevenue,
        averageRating,
        totalCustomers
    ] = await Promise.all([
        Product.countDocuments({ supplier: supplierId }),
        Order.countDocuments({ 'items.product': { $in: await Product.find({ supplier: supplierId }).distinct('_id') } }),
        Order.countDocuments({
            'items.product': { $in: await Product.find({ supplier: supplierId }).distinct('_id') },
            orderStatus: 'pending'
        }),
        Order.aggregate([
            { $match: { orderStatus: 'delivered' } },
            { $unwind: '$items' },
            {
                $lookup: {
                    from: 'products',
                    localField: 'items.product',
                    foreignField: '_id',
                    as: 'product'
                }
            },
            { $unwind: '$product' },
            { $match: { 'product.supplier': supplierId } },
            { $group: { _id: null, total: { $sum: { $multiply: ['$items.price', '$items.quantity'] } } } }
        ]),
        Review.aggregate([
            {
                $lookup: {
                    from: 'products',
                    localField: 'product',
                    foreignField: '_id',
                    as: 'product'
                }
            },
            { $unwind: '$product' },
            { $match: { 'product.supplier': supplierId } },
            { $group: { _id: null, avgRating: { $avg: '$rating' } } }
        ]),
        // Get unique customers count
        Order.aggregate([
            { 
                $match: { 
                    'items.product': { $in: await Product.find({ supplier: supplierId }).distinct('_id') } 
                } 
            },
            { $group: { _id: '$user' } },
            { $count: 'total' }
        ])
    ]);

    res.status(200).json({
        totalProducts,
        totalOrders,
        pendingOrders,
        totalRevenue: totalRevenue[0]?.total || 0,
        averageRating: averageRating[0]?.avgRating || 0,
        totalCustomers: totalCustomers[0]?.total || 0
    });
});

// Get supplier's recent orders
const getRecentOrders = catchAsyncErrors(async (req, res) => {
    const supplierId = req.user._id;

    // Get all products belonging to this supplier
    const supplierProducts = await Product.find({ supplier: supplierId }).select('_id name');
    const supplierProductIds = supplierProducts.map(p => p._id);

    if (supplierProductIds.length === 0) {
        return res.status(200).json({ orders: [] });
    }

    // Find all orders that contain supplier's products
    const orders = await Order.find({
        'items.product': { $in: supplierProductIds }
    })
        .populate('user', 'name email')
        .sort('-createdAt');

    // Format orders for supplier view - Extract only supplier's items
    const formattedOrders = [];

    for (const order of orders) {
        for (const item of order.items) {
            // Check if this item belongs to the supplier
            const isSupplierProduct = supplierProductIds.some(
                pid => pid.toString() === item.product.toString()
            );

            if (isSupplierProduct) {
                formattedOrders.push({
                    _id: order._id,
                    orderId: order.orderId,
                    productName: item.name,
                    productId: item.product,
                    quantity: item.quantity,
                    amount: item.price * item.quantity,
                    status: order.orderStatus,
                    customer: order.user?.name,
                    customerEmail: order.user?.email,
                    createdAt: order.createdAt
                });
            }
        }
    }

    res.status(200).json({
        success: true,
        orders: formattedOrders
    });
});

// Get top selling products for supplier
const getTopProducts = catchAsyncErrors(async (req, res) => {
    const supplierId = req.user._id;

    const products = await Product.find({ supplier: supplierId });

    const productSales = await Promise.all(products.map(async (product) => {
        const orders = await Order.find({
            'items.product': product._id,
            orderStatus: 'delivered'
        });

        let totalSold = 0;
        let totalRevenue = 0;

        for (const order of orders) {
            const item = order.items.find(i => i.product.toString() === product._id.toString());
            if (item) {
                totalSold += item.quantity;
                totalRevenue += item.price * item.quantity;
            }
        }

        return {
            _id: product._id,
            name: product.name,
            images: product.images,
            totalSold,
            revenue: totalRevenue
        };
    }));

    const topProducts = productSales.sort((a, b) => b.totalSold - a.totalSold).slice(0, 5);

    res.status(200).json({ products: topProducts });
});

// Update order status (supplier)
const updateOrderStatus = catchAsyncErrors(async (req, res, next) => {
    const { orderId } = req.params;
    const { status } = req.body;
    const supplierId = req.user._id;

    const order = await Order.findById(orderId);
    if (!order) {
        return next(new ErrorHandler('Order not found', 404));
    }

    // Get supplier's products
    const supplierProducts = await Product.find({ supplier: supplierId });
    const supplierProductIds = supplierProducts.map(p => p._id.toString());

    // Check if order contains any supplier's product
    const hasSupplierProduct = order.items.some(item =>
        supplierProductIds.includes(item.product.toString())
    );

    if (!hasSupplierProduct) {
        return next(new ErrorHandler('Not authorized to update this order', 403));
    }

    order.orderStatus = status;
    order.statusHistory.push({
        status,
        date: new Date(),
        note: `Order status updated to ${status} by supplier`
    });

    await order.save();

    res.status(200).json({
        success: true,
        message: 'Order status updated'
    });
});

// Get supplier products
const getSupplierProducts = catchAsyncErrors(async (req, res) => {
    const products = await Product.find({ supplier: req.user._id })
        .sort('-createdAt');

    res.status(200).json({ products });
});

// Get product analytics (sales chart data)
const getProductAnalytics = catchAsyncErrors(async (req, res) => {
    const supplierId = req.user._id;
    const { period = 'week' } = req.query; // week, month, year

    let startDate = new Date();
    if (period === 'week') {
        startDate.setDate(startDate.getDate() - 7);
    } else if (period === 'month') {
        startDate.setMonth(startDate.getMonth() - 1);
    } else if (period === 'year') {
        startDate.setFullYear(startDate.getFullYear() - 1);
    }

    const products = await Product.find({ supplier: supplierId });
    const productIds = products.map(p => p._id);

    const orders = await Order.find({
        'items.product': { $in: productIds },
        createdAt: { $gte: startDate },
        orderStatus: 'delivered'
    });

    // Group sales by date
    const salesByDate = {};
    orders.forEach(order => {
        const date = order.createdAt.toISOString().split('T')[0];
        if (!salesByDate[date]) {
            salesByDate[date] = 0;
        }
        order.items.forEach(item => {
            if (productIds.includes(item.product)) {
                salesByDate[date] += item.price * item.quantity;
            }
        });
    });

    const chartData = Object.entries(salesByDate).map(([date, sales]) => ({
        date,
        sales
    }));

    res.status(200).json({
        success: true,
        chartData,
        totalSales: chartData.reduce((sum, d) => sum + d.sales, 0)
    });
});

// Get all reviews for supplier's products
const getSupplierReviews = catchAsyncErrors(async (req, res) => {
    const supplierId = req.user._id;

    // Get all products belonging to this supplier
    const supplierProducts = await Product.find({ supplier: supplierId }).select('_id');
    const supplierProductIds = supplierProducts.map(p => p._id);

    if (supplierProductIds.length === 0) {
        return res.status(200).json({
            success: true,
            reviews: [],
            stats: {
                averageRating: 0,
                totalReviews: 0,
                ratingDistribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
            }
        });
    }

    // Find all reviews for supplier's products
    const reviews = await Review.find({
        product: { $in: supplierProductIds },
        status: 'approved'
    })
        .populate('user', 'name email')
        .populate('product', 'name images')
        .sort('-createdAt');

    // Calculate statistics
    const totalReviews = reviews.length;
    const averageRating = totalReviews > 0
        ? reviews.reduce((sum, review) => sum + review.rating, 0) / totalReviews
        : 0;

    const ratingDistribution = {
        5: 0,
        4: 0,
        3: 0,
        2: 0,
        1: 0
    };

    reviews.forEach(review => {
        const rating = Math.floor(review.rating);
        if (ratingDistribution.hasOwnProperty(rating)) {
            ratingDistribution[rating]++;
        }
    });

    res.status(200).json({
        success: true,
        reviews: reviews.map(review => ({
            _id: review._id,
            rating: review.rating,
            title: review.title,
            comment: review.comment,
            user: review.user,
            product: review.product,
            supplierReply: review.supplierReply || null,  // ✅ Make sure this is included
            createdAt: review.createdAt
        })),
        stats: {
            averageRating: parseFloat(averageRating.toFixed(1)),
            totalReviews,
            ratingDistribution
        }
    });
});

// Reply to a review (supplier can reply to customer reviews)
const replyToReview = catchAsyncErrors(async (req, res, next) => {
    const { reviewId } = req.params;
    const { reply } = req.body;
    const supplierId = req.user._id;

    const review = await Review.findById(reviewId).populate('product');

    if (!review) {
        return next(new ErrorHandler('Review not found', 404));
    }

    // Check if the review belongs to supplier's product
    const product = await Product.findOne({
        _id: review.product._id,
        supplier: supplierId
    });

    if (!product) {
        return next(new ErrorHandler('Not authorized to reply to this review', 403));
    }

    // Save the reply
    review.supplierReply = {
        text: reply,
        repliedAt: Date.now(),
        repliedBy: supplierId
    };

    await review.save();

    // Fetch updated review to confirm
    const updatedReview = await Review.findById(reviewId);

    res.status(200).json({
        success: true,
        message: 'Reply added successfully',
        review: updatedReview
    });
});

// Get review statistics for supplier
const getReviewStats = catchAsyncErrors(async (req, res) => {
    const supplierId = req.user._id;

    const supplierProducts = await Product.find({ supplier: supplierId }).select('_id');
    const supplierProductIds = supplierProducts.map(p => p._id);

    if (supplierProductIds.length === 0) {
        return res.status(200).json({
            success: true,
            stats: {
                averageRating: 0,
                totalReviews: 0,
                ratingDistribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
                monthlyTrend: []
            }
        });
    }

    const reviews = await Review.find({
        product: { $in: supplierProductIds },
        status: 'approved'
    });

    const totalReviews = reviews.length;
    const averageRating = totalReviews > 0
        ? reviews.reduce((sum, review) => sum + review.rating, 0) / totalReviews
        : 0;

    // ✅ Calculate rating distribution
    const ratingDistribution = {
        5: 0,
        4: 0,
        3: 0,
        2: 0,
        1: 0
    };

    reviews.forEach(review => {
        const rating = Math.floor(review.rating);
        if (ratingDistribution.hasOwnProperty(rating)) {
            ratingDistribution[rating]++;
        }
    });

    // Monthly review trend
    const monthlyTrend = {};
    reviews.forEach(review => {
        const month = review.createdAt.toISOString().slice(0, 7);
        monthlyTrend[month] = (monthlyTrend[month] || 0) + 1;
    });

    const monthlyData = Object.entries(monthlyTrend).map(([month, count]) => ({
        month,
        count
    })).sort((a, b) => a.month.localeCompare(b.month));

    res.status(200).json({
        success: true,
        stats: {
            averageRating: parseFloat(averageRating.toFixed(1)),
            totalReviews,
            ratingDistribution,
            monthlyTrend: monthlyData
        }
    });
});

module.exports = {
    getDashboardStats,
    getRecentOrders,
    getTopProducts,
    updateOrderStatus,
    getSupplierProducts,
    getProductAnalytics,
    getSupplierReviews,      
    replyToReview,           
    getReviewStats,
}