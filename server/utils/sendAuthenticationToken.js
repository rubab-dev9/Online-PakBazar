const jwt = require('jsonwebtoken')

const sendToken = (res, user, message, statusCode) => {
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
        expiresIn: '7d'
    });

    res
        .status(statusCode)
        .cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'Strict',
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        });

    res.status(200).json({
        success: true,
        message,
        user: {
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            isApproved: user.isApproved
        }
    });
};

module.exports = sendToken;
