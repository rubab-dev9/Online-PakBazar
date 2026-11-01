const Wishlist = require('../models/wishlist');
const Product = require('../models/product');
const catchAsyncErrors = require('../middlewares/catchAsyncErrors');

// Get user's wishlist
const getWishlist = catchAsyncErrors(async (req, res) => {
    try {
        let wishlist = await Wishlist.findOne({ user: req.user._id })
            .populate('products.product');
        
        if (!wishlist) {
            wishlist = await Wishlist.create({ user: req.user._id, products: [] });
        }
        
        res.json({
            success: true,
            wishlist: wishlist.products.map(item => item.product)
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ 
            success: false, 
            message: 'Error fetching wishlist' 
        });
    }
});

// Add product to wishlist
const addToWishlist = catchAsyncErrors(async (req, res) => {
    try {
        const { productId } = req.body;
        
        // Check if product exists
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ 
                success: false, 
                message: 'Product not found' 
            });
        }
        
        let wishlist = await Wishlist.findOne({ user: req.user._id });
        
        if (!wishlist) {
            wishlist = await Wishlist.create({ 
                user: req.user._id, 
                products: [] 
            });
        }
        
        // Check if product already in wishlist
        const alreadyExists = wishlist.products.some(
            item => item.product.toString() === productId
        );
        
        if (alreadyExists) {
            return res.status(400).json({ 
                success: false, 
                message: 'Product already in wishlist' 
            });
        }
        
        wishlist.products.push({ product: productId });
        await wishlist.save();
        
        await wishlist.populate('products.product');
        
        res.json({
            success: true,
            message: 'Product added to wishlist',
            wishlist: wishlist.products.map(item => item.product)
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ 
            success: false, 
            message: 'Error adding to wishlist' 
        });
    }
});

// Remove product from wishlist
const removeFromWishlist = catchAsyncErrors(async (req, res) => {
    try {
        const { productId } = req.params;
        
        const wishlist = await Wishlist.findOne({ user: req.user._id });
        
        if (!wishlist) {
            return res.status(404).json({ 
                success: false, 
                message: 'Wishlist not found' 
            });
        }
        
        wishlist.products = wishlist.products.filter(
            item => item.product.toString() !== productId
        );
        
        await wishlist.save();
        await wishlist.populate('products.product');
        
        res.json({
            success: true,
            message: 'Product removed from wishlist',
            wishlist: wishlist.products.map(item => item.product)
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ 
            success: false, 
            message: 'Error removing from wishlist' 
        });
    }
});

// Clear entire wishlist
const clearWishlist = catchAsyncErrors(async (req, res) => {
    try {
        const wishlist = await Wishlist.findOne({ user: req.user._id });
        
        if (wishlist) {
            wishlist.products = [];
            await wishlist.save();
        }
        
        res.json({
            success: true,
            message: 'Wishlist cleared successfully'
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ 
            success: false, 
            message: 'Error clearing wishlist' 
        });
    }
});

// Check if product is in wishlist
const checkWishlist = catchAsyncErrors(async (req, res) => {
    try {
        const { productId } = req.params;
        
        const wishlist = await Wishlist.findOne({ user: req.user._id });
        
        let isInWishlist = false;
        if (wishlist) {
            isInWishlist = wishlist.products.some(
                item => item.product.toString() === productId
            );
        }
        
        res.json({
            success: true,
            isInWishlist
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ 
            success: false, 
            message: 'Error checking wishlist' 
        });
    }
});

// Sync guest wishlist to user account
const syncGuestWishlist = catchAsyncErrors(async (req, res) => {
    try {
        const { items } = req.body;
        
        let wishlist = await Wishlist.findOne({ user: req.user._id });
        
        if (!wishlist) {
            wishlist = await Wishlist.create({ 
                user: req.user._id, 
                products: [] 
            });
        }
        
        // Add items that are not already in wishlist
        for (const item of items) {
            const alreadyExists = wishlist.products.some(
                p => p.product.toString() === item._id
            );
            
            if (!alreadyExists) {
                wishlist.products.push({ product: item._id });
            }
        }
        
        await wishlist.save();
        await wishlist.populate('products.product');
        
        res.json({
            success: true,
            message: 'Wishlist synced successfully',
            wishlist: wishlist.products.map(item => item.product)
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ 
            success: false, 
            message: 'Error syncing wishlist' 
        });
    }
});

module.exports = {
    getWishlist,
    addToWishlist,
    removeFromWishlist,
    clearWishlist,
    checkWishlist,
    syncGuestWishlist
}