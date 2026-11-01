const express = require('express');
const router = express.Router();
const {
    sendContactMessage,
    getAllMessages,
    getMessage,
    markAsRead,
    replyToMessage,
    deleteMessage
} = require('../controllers/contactController');
const { protect, authorizeRole } = require('../middlewares/authMiddleware');

// Public route - anyone can send message
router.post('/send', sendContactMessage);

// Admin only routes
router.get('/admin/messages', protect, authorizeRole('admin'), getAllMessages);
router.get('/admin/messages/:id', protect, authorizeRole('admin'), getMessage);
router.put('/admin/messages/:id/read', protect, authorizeRole('admin'), markAsRead);
router.post('/admin/reply', protect, authorizeRole('admin'), replyToMessage);
router.delete('/admin/messages/:id', protect, authorizeRole('admin'), deleteMessage);

module.exports = router;