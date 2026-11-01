const express = require("express");
const { register, verifyOtp, resendOtp, login, logout, getMe } = require("../controllers/authController");
const { forgotPassword, resetPassword, updatePassword } = require('../controllers/passwordController');
const { protect } = require('../middlewares/authMiddleware')
const router = express.Router();

router.post("/register", register);
router.post('/verify-otp', verifyOtp);
router.post('/resend-otp', resendOtp);
router.post('/login', login);
router.post("/logout", protect, logout);
router.get('/me', protect, getMe);

// forgot, reset, & update password
router.post('/forgot-password', forgotPassword)
router.put('/reset-password/:token', resetPassword)
router.put('/update-password', protect, updatePassword)

module.exports = router
