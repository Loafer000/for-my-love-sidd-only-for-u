// SMS utility functions - Ready for Twilio integration

// TODO: Install Twilio SDK when ready to integrate
// const twilio = require('twilio');

// Initialize Twilio client
let twilioClient = null;

// TODO: Uncomment when ready to integrate
/*
if (process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN) {
  twilioClient = twilio(
    process.env.TWILIO_ACCOUNT_SID,
    process.env.TWILIO_AUTH_TOKEN
  );
}
*/

const getTwilioClient = () => {
  if (!twilioClient && process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN) {
    twilioClient = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
  }
  return twilioClient;
};

// Send SMS function
const sendSMS = async (options) => {
  try {
    const client = getTwilioClient();
    
    // If no Twilio configuration, log instead of sending
    if (!client) {
      console.log('📱 SMS would be sent:', {
        to: options.to,
        message: options.message
      });
      return { success: true, message: 'SMS logged (no config)' };
    }

    const result = await client.messages.create({
      body: options.message,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: options.to,
    });

    console.log('📱 SMS sent successfully:', result.sid);
    
    return {
      success: true,
      sid: result.sid,
      status: result.status,
    };

  } catch (error) {
    console.error('📱 SMS send failed:', error);
    
    // Don't throw error in development, just log
    if (process.env.NODE_ENV === 'development') {
      console.log('📱 SMS would be sent (dev mode):', {
        to: options.to,
        message: options.message,
      });
      return { success: true, message: 'SMS simulated in dev mode' };
    }
    
    throw error;
  }
};

// Send OTP SMS
const sendOTPSMS = async (phone, otp) => {
  const message = `Your ConnectSpace verification code is: ${otp}. Valid for 10 minutes. Do not share this code with anyone.`;
  
  return sendSMS({
    to: phone,
    message,
  });
};

// Send booking notification SMS
const sendBookingNotificationSMS = async (phone, bookingDetails) => {
  const message = `ConnectSpace: Your booking ${bookingDetails.bookingId} for ${bookingDetails.propertyTitle} has been ${bookingDetails.status}. Check your dashboard for details.`;
  
  return sendSMS({
    to: phone,
    message,
  });
};

// Send payment reminder SMS
const sendPaymentReminderSMS = async (phone, paymentDetails) => {
  const message = `ConnectSpace: Payment of ₹${paymentDetails.amount} is due on ${paymentDetails.dueDate}. Pay now to avoid late fees.`;
  
  return sendSMS({
    to: phone,
    message,
  });
};

module.exports = {
  sendSMS,
  sendOTPSMS,
  sendBookingNotificationSMS,
  sendPaymentReminderSMS,
};