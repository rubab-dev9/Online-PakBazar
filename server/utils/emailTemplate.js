// Base styles for consistency
const baseStyles = `
  body {
    font-family: Arial, sans-serif;
    background-color: #f4f6f8;
    margin: 0;
    padding: 0;
  }
  .container {
    max-width: 600px;
    margin: 30px auto;
    background: #ffffff;
    border-radius: 8px;
    overflow: hidden;
    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  }
  .header {
    background: #198754;
    color: white;
    padding: 20px;
    text-align: center;
    font-size: 22px;
    font-weight: bold;
  }
  .content {
    padding: 30px;
    color: #333;
    line-height: 1.6;
  }
  .otp-box {
    display: inline-block;
    background: #f1f1f1;
    padding: 12px 20px;
    font-size: 22px;
    font-weight: bold;
    letter-spacing: 4px;
    border-radius: 6px;
    margin: 20px 0;
    color: #198754;
  }
  .button {
    display: inline-block;
    margin-top: 20px;
    padding: 12px 20px;
    background: #198754;
    color: white;
    text-decoration: none;
    border-radius: 5px;
    font-weight: bold;
  }
  .footer {
    background: #f8f9fa;
    text-align: center;
    padding: 15px;
    font-size: 12px;
    color: #777;
  }
`;

const getHtmlTemplate = (title, contentBody) => {
  return `
  <html>
    <head>
      <style>${baseStyles}</style>
    </head>
    <body>
      <div class="container">
        
        <div class="header">
          PakBazar
        </div>

        <div class="content">
          <h2>${title}</h2>
          ${contentBody}
        </div>

        <div class="footer">
          © ${new Date().getFullYear()} PakBazar. All rights reserved.
        </div>

      </div>
    </body>
  </html>
  `;
};

// Signup OTP Template
const signupOtpTemplate = (name, otp) => {
  const body = `
    <p>Hello <strong>${name}</strong>,</p>
    <p>Thank you for registering on <strong>PakBazar</strong>.</p>
    <p>Your verification OTP is:</p>

    <div class="otp-box">${otp}</div>

    <p>This OTP will expire in 10 minutes.</p>
    <p>If you did not request this, please ignore this email.</p>
  `;

  return getHtmlTemplate("Verify Your Account", body);
};

// Login OTP Template
const loginOtpTemplate = (name, otp) => {
  const body = `
    <p>Hello <strong>${name}</strong>,</p>
    <p>You are trying to login to your PakBazar account.</p>
    <p>Your OTP is:</p>

    <div class="otp-box">${otp}</div>

    <p>This OTP will expire in 10 minutes.</p>
    <p>If this wasn't you, please secure your account immediately.</p>
  `;

  return getHtmlTemplate("Login Verification", body);
};

// Forgot Password Template
const forgotPasswordTemplate = (name, resetUrl) => {
  const body = `
    <p>Hello <strong>${name}</strong>,</p>
    <p>You requested to reset your password.</p>
    <p>Click the button below to reset your password:</p>

    <a href="${resetUrl}" class="button">Reset Password</a>

    <p>This link will expire soon for security reasons.</p>
    <p>If you did not request this, please ignore this email.</p>
  `;

  return getHtmlTemplate("Reset Your Password", body);
};

// Contact Form Submission Template (Admin)
const contactAdminTemplate = (name, email, subject, message) => {
  const body = `
    <p><strong>New contact form submission received!</strong></p>
    
    <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
      <tr>
        <td style="padding: 10px; background: #f8f9fa; width: 120px;"><strong>Name:</strong></td>
        <td style="padding: 10px; background: #f8f9fa;">${name}</td>
      </tr>
      <tr>
        <td style="padding: 10px;"><strong>Email:</strong></td>
        <td style="padding: 10px;">${email}</td>
      </tr>
      <tr>
        <td style="padding: 10px; background: #f8f9fa;"><strong>Subject:</strong></td>
        <td style="padding: 10px; background: #f8f9fa;">${subject}</td>
      </tr>
      <tr>
        <td style="padding: 10px;"><strong>Message:</strong></td>
        <td style="padding: 10px;">${message}</td>
      </tr>
    </table>
    
    <p>Please respond to this customer as soon as possible.</p>
    <hr>
    <p style="font-size: 12px; color: #777;">This message was sent from PakBazar Contact Form</p>
  `;

  return getHtmlTemplate("New Contact Message", body);
};

// Auto-reply Template for User
const contactUserReplyTemplate = (name, message) => {
  const body = `
    <p>Dear <strong>${name}</strong>,</p>
    
    <p>Thank you for contacting <strong>PakBazar</strong>!</p>
    
    <p>We have received your message and our support team will get back to you within <strong>24 hours</strong>.</p>
    
    <p><strong>Your message:</strong></p>
    <div style="background: #f8f9fa; padding: 15px; border-radius: 8px; margin: 15px 0;">
      ${message}
    </div>
    
    <p>In the meantime, you can:</p>
    <ul>
      <li>Check our <a href="${process.env.FRONTEND_URI}/faqs" style="color: #198754;">FAQs</a> for quick answers</li>
      <li>Visit our <a href="${process.env.FRONTEND_URI}/about" style="color: #198754;">About Us</a> page to learn more</li>
    </ul>
    
    <p>We appreciate your interest in PakBazar!</p>
    
    <p>Best Regards,<br>
    <strong>PakBazar Support Team</strong></p>
  `;

  return getHtmlTemplate("We've Received Your Message", body);
};

module.exports = {
  signupOtpTemplate,
  loginOtpTemplate,
  forgotPasswordTemplate,
  contactAdminTemplate,
  contactUserReplyTemplate
};