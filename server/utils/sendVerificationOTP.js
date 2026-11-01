const emailTemplate = require("./emailTemplate")

const sendVerificationCode = async (otp, email, res) => {
    try {
        const message = emailTemplate(otp)
        sendEmail({
            email,
            subject: 'Verification Code (ScrapingDude)',
            message
        })
        res.status(200).json({
            success: true,
            message: 'Verification code sent successfully.'
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Verification code failed to sent.'
        })
    }
}

module.exports = sendVerificationCode