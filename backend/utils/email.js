const nodemailer = require('nodemailer');

// Create reusable transporter
let transporter = null;

const createTransporter = () => {
  if (!transporter) {
    transporter = nodemailer.createTransporter({
      host: process.env.EMAIL_HOST || 'smtp.gmail.com',
      port: process.env.EMAIL_PORT || 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });
  }
  return transporter;
};

// Send email function
const sendEmail = async (options) => {
  try {
    // If no email configuration, log instead of sending
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      console.log('📧 Email would be sent:', {
        to: options.to,
        subject: options.subject,
        content: options.html || options.text
      });
      return { success: true, message: 'Email logged (no config)' };
    }

    const transporter = createTransporter();

    const mailOptions = {
      from: process.env.EMAIL_FROM || `"ConnectSpace" <${process.env.EMAIL_USER}>`,
      to: options.to,
      subject: options.subject,
      html: options.html,
      text: options.text
    };

    const result = await transporter.sendMail(mailOptions);
    console.log('📧 Email sent successfully:', result.messageId);

    return {
      success: true,
      messageId: result.messageId
    };
  } catch (error) {
    console.error('📧 Email send failed:', error);

    // Don't throw error in development, just log
    if (process.env.NODE_ENV === 'development') {
      console.log('📧 Email would be sent (dev mode):', {
        to: options.to,
        subject: options.subject
      });
      return { success: true, message: 'Email simulated in dev mode' };
    }

    throw error;
  }
};

// Send welcome email template
const sendWelcomeEmail = async (user) => {
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #4F46E5;">Welcome to ConnectSpace! 🏢</h2>
      <p>Hi ${user.firstName},</p>
      <p>Welcome to ConnectSpace - your premier commercial real estate platform!</p>
      <p>Your account has been created successfully. You can now:</p>
      <ul>
        <li>🔍 Search for premium commercial spaces</li>
        <li>📋 List your properties (if you're a landlord)</li>
        <li>💼 Manage your bookings and payments</li>
        <li>⭐ Rate and review properties</li>
      </ul>
      <p>Get started by exploring our featured properties or listing your first space.</p>
      <p>Best regards,<br>The ConnectSpace Team</p>
    </div>
  `;

  return sendEmail({
    to: user.email,
    subject: 'Welcome to ConnectSpace! 🏢',
    html
  });
};

// Send booking confirmation email
const sendBookingConfirmation = async (booking, user, property) => {
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #4F46E5;">Booking Confirmation 📋</h2>
      <p>Hi ${user.firstName},</p>
      <p>Your booking has been confirmed!</p>
      <div style="background: #F3F4F6; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h3 style="margin-top: 0;">Booking Details</h3>
        <p><strong>Property:</strong> ${property.title}</p>
        <p><strong>Location:</strong> ${property.address.area}, ${property.address.city}</p>
        <p><strong>Booking ID:</strong> ${booking.bookingId}</p>
        <p><strong>Move-in Date:</strong> ${new Date(booking.dates.moveInDate).toDateString()}</p>
        <p><strong>Monthly Rent:</strong> ₹${booking.financial.monthlyRent.toLocaleString()}</p>
      </div>
      <p>You can track your booking status in your dashboard.</p>
      <p>Best regards,<br>The ConnectSpace Team</p>
    </div>
  `;

  return sendEmail({
    to: user.email,
    subject: `Booking Confirmed - ${property.title}`,
    html
  });
};

module.exports = {
  sendEmail,
  sendWelcomeEmail,
  sendBookingConfirmation
};
