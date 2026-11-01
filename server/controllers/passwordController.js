const User = require('../models/user')
const ErrorHandler = require('../utils/errorHandler')
const catchAsyncErrors = require('../middlewares/catchAsyncErrors')
const generateResetToken = require('../utils/generatePasswordToken')
const sendEmail = require('../utils/sendEmail')
const { forgotPasswordTemplate } = require('../utils/emailTemplate')
const crypto = require('crypto')

// Forgot Password(Resquest reset link)
const forgotPassword = catchAsyncErrors(async (req, res, next) => {
    const { name, email } = req.body

    if (!email) {
        return next(new ErrorHandler('Email is required.', 400))
    }

    const user = await User.findOne({ email, accountVerified: true })
    if (!user) return next(new ErrorHandler('User not found!', 404))

    const { token, hashedToken, expireTime } = generateResetToken()

    user.resetPasswordToken = hashedToken
    user.resetPasswordExpire = expireTime
    await user.save({ validateBeforeSave: false })

    const resetUrl = `${process.env.FRONTEND_URI}/reset-password/${token}`

    const html = forgotPasswordTemplate(user.name, resetUrl)

    try {
        await sendEmail({
            email: user.email,
            subject: 'PakBazar (Password Recovery)',
            html
        });

        res.status(200).json({ success: true, message: `Password Reset link sent to ${user.email}` });
    } catch (error) {
        console.error(error);
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;

        await user.save({ validateBeforeSave: false })

        return next(new ErrorHandler(error.message, 500))
    }
})

// Reset Password
const resetPassword = catchAsyncErrors(async (req, res, next) => {

    const { password, confirmPassword } = req.body
    // Hash URL token
    const { token } = req.params
    const hashedToken = crypto
        .createHash('sha256')
        .update(token)
        .digest('hex')

    const user = await User.findOne({
        resetPasswordToken: hashedToken,
        resetPasswordExpire: { $gt: Date.now() }
    })

    if (!user) return next(new ErrorHandler('Invalid or expired token', 400))

    if (password !== confirmPassword) {
        return next(new ErrorHandler('Password & confirm password do not match.'))
    }

    // Set new Password
    user.password = password
    user.resetPasswordToken = undefined
    user.resetPasswordExpire = undefined
    await user.save()

    res.status(200).json({
        success: true,
        message: 'Password reset successfully!'
    })
})

// Update Password
const updatePassword = catchAsyncErrors(async (req, res, next) => {
    const { oldPassword, newPassword, confirmPassword } = req.body

    const user = await User.findById(req.user.id).select('+password')
    if (!user) return next(new ErrorHandler('User not found', 404))

    const isMatch = await user.matchPassword(oldPassword)
    if (!isMatch) return next(new ErrorHandler('Old password is incorrect', 400))

    if (newPassword !== confirmPassword) {
        return next(new ErrorHandler('New password and confirm password do not match', 400))
    }

    user.password = newPassword
    await user.save()

    res.status(200).json({
        success: true,
        message: 'Password updated successfully.',
    })
})

module.exports = { forgotPassword, resetPassword, updatePassword }