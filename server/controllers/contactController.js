// server/controllers/contactController.js
const Contact = require('../models/Contact');
const catchAsyncErrors = require('../middlewares/catchAsyncErrors');
const ErrorHandler = require('../utils/errorHandler');
const sendEmail = require('../utils/sendEmail');
const { 
    contactAdminTemplate, 
    contactUserReplyTemplate 
} = require('../utils/emailTemplate');

// Send contact form (save to database + send emails)
const sendContactMessage = catchAsyncErrors(async (req, res, next) => {
    const { name, email, subject, message } = req.body;

    // Validation
    if (!name || !email || !subject || !message) {
        return next(new ErrorHandler('All fields are required', 400));
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return next(new ErrorHandler('Please enter a valid email address', 400));
    }

    // Save to database
    const contact = await Contact.create({
        name,
        email,
        subject,
        message,
        status: 'unread'
    });

    // Send email to Admin
    await sendEmail({
        email: process.env.ADMIN_EMAIL,
        subject: `New Contact Message: ${subject}`,
        html: contactAdminTemplate(name, email, subject, message)
    });

    // Send auto-reply to User
    await sendEmail({
        email: email,
        subject: 'Thank you for contacting PakBazar',
        html: contactUserReplyTemplate(name, message)
    });

    res.status(200).json({
        success: true,
        message: 'Message sent successfully! We will contact you soon.'
    });
});

// Get all contact messages (Admin only)
const getAllMessages = catchAsyncErrors(async (req, res) => {
    // Check if user is admin
    if (req.user.role !== 'admin') {
        return next(new ErrorHandler('Access denied. Admin only.', 403));
    }
    
    const messages = await Contact.find().sort('-createdAt');
    
    res.status(200).json({
        success: true,
        count: messages.length,
        messages
    });
});

// Get single message (Admin only)
const getMessage = catchAsyncErrors(async (req, res, next) => {
    if (req.user.role !== 'admin') {
        return next(new ErrorHandler('Access denied. Admin only.', 403));
    }
    
    const message = await Contact.findById(req.params.id);
    
    if (!message) {
        return next(new ErrorHandler('Message not found', 404));
    }
    
    res.status(200).json({
        success: true,
        message
    });
});

// Mark message as read (Admin only)
const markAsRead = catchAsyncErrors(async (req, res, next) => {
    if (req.user.role !== 'admin') {
        return next(new ErrorHandler('Access denied. Admin only.', 403));
    }
    
    const message = await Contact.findById(req.params.id);
    
    if (!message) {
        return next(new ErrorHandler('Message not found', 404));
    }
    
    message.status = 'read';
    await message.save();
    
    res.status(200).json({
        success: true,
        message: 'Message marked as read'
    });
});

// Reply to message and send email
const replyToMessage = catchAsyncErrors(async (req, res, next) => {
    const { messageId, reply, userEmail, userName } = req.body;
    
    if (req.user.role !== 'admin') {
        return next(new ErrorHandler('Access denied. Admin only.', 403));
    }
    
    // Update message status
    const message = await Contact.findById(messageId);
    if (!message) {
        return next(new ErrorHandler('Message not found', 404));
    }
    
    message.status = 'replied';
    await message.save();
    
    // Send reply email to user
    const replyHtml = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: #198754; padding: 20px; text-align: center;">
                <h2 style="color: white;">PakBazar Support</h2>
            </div>
            <div style="padding: 20px;">
                <h3>Dear ${userName},</h3>
                <p>Thank you for contacting PakBazar. Here's our response to your inquiry:</p>
                
                <div style="background: #f8f9fa; padding: 15px; border-radius: 8px; margin: 15px 0;">
                    <p><strong>Your Message:</strong></p>
                    <p>${message.message}</p>
                    <hr>
                    <p><strong>Our Reply:</strong></p>
                    <p>${reply}</p>
                </div>
                
                <p>If you have any further questions, feel free to contact us again.</p>
                
                <p>Best Regards,<br>
                <strong>PakBazar Support Team</strong></p>
            </div>
            <div style="background: #f8f9fa; padding: 10px; text-align: center; font-size: 12px;">
                © ${new Date().getFullYear()} PakBazar. All rights reserved.
            </div>
        </div>
    `;
    
    await sendEmail({
        email: userEmail,
        subject: `Re: ${message.subject}`,
        html: replyHtml
    });
    
    res.status(200).json({
        success: true,
        message: 'Reply sent successfully'
    });
});

// Delete message (Admin only)
const deleteMessage = catchAsyncErrors(async (req, res, next) => {
    if (req.user.role !== 'admin') {
        return next(new ErrorHandler('Access denied. Admin only.', 403));
    }
    
    const message = await Contact.findById(req.params.id);
    
    if (!message) {
        return next(new ErrorHandler('Message not found', 404));
    }
    
    await message.deleteOne();
    
    res.status(200).json({
        success: true,
        message: 'Message deleted successfully'
    });
});

module.exports = {
    sendContactMessage,
    getAllMessages,
    getMessage,
    markAsRead,
    replyToMessage,
    deleteMessage
};