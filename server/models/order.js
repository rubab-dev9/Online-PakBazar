// models/Order.js - Copy this complete code
const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    orderId: {
        type: String,
        default: function() {
            return 'ORD-' + Date.now() + '-' + Math.floor(Math.random() * 1000);
        }
    },
    items: [{
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product',
            required: true
        },
        name: String,
        price: Number,
        quantity: Number,
        image: String
    }],
    subtotal: {
        type: Number,
        required: true
    },
    shippingFee: {
        type: Number,
        default: 0
    },
    totalAmount: {
        type: Number,
        required: true
    },
    shippingAddress: {
        fullName: String,
        phone: String,
        address: String,
        city: String,
        postalCode: String,
        landmark: String
    },
    paymentMethod: {
        type: String,
        default: 'cod'
    },
    paymentStatus: {
        type: String,
        default: 'pending'
    },
    orderStatus: {
        type: String,
        default: 'pending'
    },
    statusHistory: [{
        status: String,
        date: Date,
        note: String
    }],
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Make sure model is not overwritten
module.exports = mongoose.models.Order || mongoose.model('Order', orderSchema);