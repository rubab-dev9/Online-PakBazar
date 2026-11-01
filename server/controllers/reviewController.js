// server/controllers/reviewController.js
const Review = require('../models/Review');
const Product = require('../models/Product');
const Order = require('../models/Order');
const catchAsyncErrors = require('../middlewares/catchAsyncErrors');
const ErrorHandler = require('../utils/errorHandler');

// Add review for a product (Customer only)
const addReview = catchAsyncErrors(async (req, res, next) => {
    const { productId, rating, title, comment } = req.body;
    
    // Check if product exists
    const product = await Product.findById(productId);
    if (!product) {
        return next(new ErrorHandler('Product not found', 404));
    }
    
    // Check if user has purchased this product
    const hasPurchased = await Order.findOne({
        user: req.user._id,
        'items.product': productId,
        orderStatus: 'delivered'
    });
    
    if (!hasPurchased) {
        return next(new ErrorHandler('You can only review products you have purchased', 403));
    }
    
    // Check if user already reviewed this product
    const existingReview = await Review.findOne({
        product: productId,
        user: req.user._id
    });
    
    if (existingReview) {
        return next(new ErrorHandler('You have already reviewed this product', 400));
    }
    
    // Create review
    const review = await Review.create({
        product: productId,
        user: req.user._id,
        rating,
        title,
        comment,
        isVerified: true,
        status: 'approved'
    });
    
    // Update product average rating
    const reviews = await Review.find({ product: productId, status: 'approved' });
    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
    product.rating = totalRating / reviews.length;
    product.numReviews = reviews.length;
    await product.save();
    
    res.status(201).json({
        success: true,
        review
    });
});

// Get all reviews for a product
const getProductReviews = catchAsyncErrors(async (req, res) => {
    const { productId } = req.params;
    
    const reviews = await Review.find({ product: productId, status: 'approved' })
        .populate('user', 'name email')
        .sort('-createdAt');
    
    // Get average rating
    const avgRating = reviews.length > 0 
        ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length 
        : 0;
    
    res.status(200).json({
        success: true,
        reviews,
        stats: {
            total: reviews.length,
            averageRating: avgRating,
            distribution: {
                5: reviews.filter(r => r.rating === 5).length,
                4: reviews.filter(r => r.rating === 4).length,
                3: reviews.filter(r => r.rating === 3).length,
                2: reviews.filter(r => r.rating === 2).length,
                1: reviews.filter(r => r.rating === 1).length
            }
        }
    });
});

// Get user's reviews
const getMyReviews = catchAsyncErrors(async (req, res) => {
    const reviews = await Review.find({ user: req.user._id })
        .populate('product', 'name images price')
        .sort('-createdAt');
    
    res.status(200).json({
        success: true,
        reviews
    });
});

// Update review
const updateReview = catchAsyncErrors(async (req, res, next) => {
    const { rating, title, comment } = req.body;
    
    let review = await Review.findById(req.params.id);
    
    if (!review) {
        return next(new ErrorHandler('Review not found', 404));
    }
    
    // Check if user owns the review
    if (review.user.toString() !== req.user._id.toString()) {
        return next(new ErrorHandler('Not authorized', 403));
    }
    
    review.rating = rating;
    review.title = title;
    review.comment = comment;
    review.updatedAt = Date.now();
    await review.save();
    
    // Update product average rating
    const product = await Product.findById(review.product);
    const reviews = await Review.find({ product: review.product, status: 'approved' });
    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
    product.rating = totalRating / reviews.length;
    await product.save();
    
    res.status(200).json({
        success: true,
        review
    });
});

// Delete review
const deleteReview = catchAsyncErrors(async (req, res, next) => {
    const review = await Review.findById(req.params.id);
    
    if (!review) {
        return next(new ErrorHandler('Review not found', 404));
    }
    
    // Check if user owns the review or is admin
    if (review.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
        return next(new ErrorHandler('Not authorized', 403));
    }
    
    await review.deleteOne();
    
    // Update product average rating
    const product = await Product.findById(review.product);
    const reviews = await Review.find({ product: review.product, status: 'approved' });
    if (reviews.length > 0) {
        const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
        product.rating = totalRating / reviews.length;
        product.numReviews = reviews.length;
    } else {
        product.rating = 0;
        product.numReviews = 0;
    }
    await product.save();
    
    res.status(200).json({
        success: true,
        message: 'Review deleted successfully'
    });
});

// Mark review as helpful
const markHelpful = catchAsyncErrors(async (req, res, next) => {
    const review = await Review.findById(req.params.id);
    
    if (!review) {
        return next(new ErrorHandler('Review not found', 404));
    }
    
    const alreadyHelped = review.helpful.includes(req.user._id);
    
    if (alreadyHelped) {
        review.helpful = review.helpful.filter(id => id.toString() !== req.user._id.toString());
    } else {
        review.helpful.push(req.user._id);
    }
    
    await review.save();
    
    res.status(200).json({
        success: true,
        helpfulCount: review.helpful.length
    });
});

module.exports = {
    addReview,
    getProductReviews,
    getMyReviews,
    updateReview,
    deleteReview,
    markHelpful
}