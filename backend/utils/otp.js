// Simple OTP generation and verification utilities
// In production, use a proper OTP service or store in Redis

// Generate random 6-digit OTP
const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

// Verify OTP (basic implementation)
const verifyOTP = (providedOTP, storedOTP, expiryTime) => {
  if (!storedOTP || !expiryTime) {
    return { valid: false, message: 'No OTP found' };
  }

  if (new Date() > new Date(expiryTime)) {
    return { valid: false, message: 'OTP has expired' };
  }

  if (providedOTP !== storedOTP) {
    return { valid: false, message: 'Invalid OTP' };
  }

  return { valid: true, message: 'OTP verified successfully' };
};

module.exports = {
  generateOTP,
  verifyOTP
};
