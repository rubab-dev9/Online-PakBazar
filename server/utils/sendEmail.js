const nodemailer = require('nodemailer')

const sendEmail = async (options) => {
    try {
        const transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: process.env.SMTP_PORT,
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS
            }
        })

        await transporter.sendMail({
            from: `"PakBazar" <${process.env.FROM_EMAIL}>`,
            to: options.email,
            subject: options.subject,
            text: options.text || "",
            html: options.html || ""
        })

        console.log('✅ Email sent successfully!')
    } catch (error) {
        console.log('❌ Email not sent!', error.message)
    }
}

module.exports = sendEmail

