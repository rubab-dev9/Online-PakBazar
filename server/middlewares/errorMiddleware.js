const ErrorHandler = require('../utils/errorHandler');

const errorMiddleware = (err, req, res, next) => {
    err.message = err.message || 'Internal Server Error'
    err.statusCode = err.statusCode || 500

    if (err.code === 11000) {
        err = new ErrorHandler('Duplicate Field Value Entered', 400)
    }

    if (err.name === 'JsonWebTokenError') {
        err = new ErrorHandler('Invalid JSON Web Token', 401)
    }

    if (err.name === 'TokenExpiredError') {
        err = new ErrorHandler('Expired JSON Web Token', 401)
    }

    if (err.name === 'CastError') {
        err = new ErrorHandler(`Resource not found. Invalid: ${err.path}`, 400)
    }

    const message = err.errors
        ? Object.values(err.errors).map(e => e.message).join(', ')
        : err.message

    res.status(err.statusCode).json({
        success: false,
        message,
    })
}

module.exports = errorMiddleware
