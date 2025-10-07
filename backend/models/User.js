const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
  // Basic Information
  firstName: {
    type: String,
    required: [true, 'First name is required'],
    trim: true,
    maxlength: [50, 'First name cannot exceed 50 characters']
  },
  lastName: {
    type: String,
    required: [true, 'Last name is required'],
    trim: true,
    maxlength: [50, 'Last name cannot exceed 50 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Please enter a valid email'
    ]
  },
  phone: {
    type: String,
    required: false,
    unique: true,
    sparse: true, // Allow multiple null values
    trim: true,
    match: [/^[6-9]\d{9}$/, 'Please enter a valid 10-digit phone number']
  },
  password: {
    type: String,
    required() {
      return !this.isPhoneVerified || this.authMethod !== 'phone';
    },
    minlength: [6, 'Password must be at least 6 characters'],
    select: false // Don't include password in queries by default
  },

  // User Role & Status
  userType: {
    type: String,
    required: [true, 'User type is required'],
    enum: {
      values: ['tenant', 'landlord', 'agent'],
      message: 'User type must be tenant, landlord, or agent'
    }
  },
  isActive: {
    type: Boolean,
    default: true
  },
  isVerified: {
    type: Boolean,
    default: false
  },

  // Verification Status
  emailVerified: {
    type: Boolean,
    default: false
  },
  phoneVerified: {
    type: Boolean,
    default: false
  },
  documentVerified: {
    type: Boolean,
    default: false
  },

  // Authentication Methods
  authMethod: {
    type: String,
    enum: ['email', 'phone', 'google', 'facebook'],
    default: 'email'
  },

  // Profile Information
  avatar: {
    url: String,
    publicId: String // Cloudinary public ID for deletion
  },
  dateOfBirth: Date,
  gender: {
    type: String,
    enum: ['male', 'female', 'other', 'prefer-not-to-say']
  },
  occupation: String,

  // Address Information
  address: {
    street: String,
    city: String,
    state: String,
    pincode: {
      type: String,
      match: [/^[1-9][0-9]{5}$/, 'Please enter a valid 6-digit pincode']
    },
    country: {
      type: String,
      default: 'India'
    }
  },

  // Emergency Contact
  emergencyContact: {
    name: String,
    phone: String,
    relation: String
  },

  // Document Verification
  documents: {
    aadhaar: {
      number: String,
      verified: { type: Boolean, default: false },
      document: {
        url: String,
        publicId: String
      }
    },
    pan: {
      number: String,
      verified: { type: Boolean, default: false },
      document: {
        url: String,
        publicId: String
      }
    },
    drivingLicense: {
      number: String,
      verified: { type: Boolean, default: false },
      document: {
        url: String,
        publicId: String
      }
    }
  },

  // Landlord-specific Information
  landlordInfo: {
    businessName: String,
    gstNumber: String,
    bankAccount: {
      accountNumber: String,
      ifscCode: String,
      bankName: String,
      accountHolderName: String
    },
    totalProperties: {
      type: Number,
      default: 0
    },
    averageRating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5
    },
    totalReviews: {
      type: Number,
      default: 0
    }
  },

  // Tenant-specific Information
  tenantInfo: {
    monthlyIncome: Number,
    employmentStatus: {
      type: String,
      enum: ['employed', 'self-employed', 'student', 'unemployed', 'retired']
    },
    companyName: String,
    previousRentals: [{
      address: String,
      duration: String,
      landlordContact: String
    }],
    preferences: {
      propertyType: [String], // ['apartment', 'house', 'pg', 'studio']
      budget: {
        min: Number,
        max: Number
      },
      preferredLocations: [String],
      amenities: [String] // ['parking', 'gym', 'pool', 'security']
    }
  },

  // Security & Recovery
  resetPasswordToken: String,
  resetPasswordExpire: Date,
  emailVerificationToken: String,
  emailVerificationExpire: Date,
  phoneOTP: {
    code: String,
    expiresAt: Date,
    attempts: {
      type: Number,
      default: 0
    }
  },
  emailOTP: {
    code: String,
    expiresAt: Date,
    attempts: {
      type: Number,
      default: 0
    }
  },

  // Activity Tracking
  lastLogin: Date,
  loginAttempts: {
    type: Number,
    default: 0
  },
  lockUntil: Date,

  // Refresh Token for JWT
  refreshTokens: [{
    token: String,
    createdAt: {
      type: Date,
      default: Date.now,
      expires: '7d'
    }
  }],

  // Timestamps
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for better performance
userSchema.index({ email: 1 });
userSchema.index({ phone: 1 });
userSchema.index({ userType: 1 });
userSchema.index({ 'address.city': 1 });
userSchema.index({ 'address.state': 1 });
userSchema.index({ isActive: 1, isVerified: 1 });
userSchema.index({ createdAt: -1 });

// Virtual for account lock status
userSchema.virtual('isLocked').get(function () {
  return !!(this.lockUntil && this.lockUntil > Date.now());
});

// Pre-save middleware to hash password
userSchema.pre('save', async function (next) {
  // Only hash password if it's modified and exists
  if (!this.isModified('password') || !this.password) {
    return next();
  }

  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Pre-save middleware to update timestamps
userSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

// Method to compare password
userSchema.methods.comparePassword = async function (candidatePassword) {
  if (!this.password) {
    return false;
  }
  return await bcrypt.compare(candidatePassword, this.password);
};

// Method to generate JWT token
userSchema.methods.generateAuthToken = function () {
  return jwt.sign(
    {
      id: this._id,
      email: this.email,
      userType: this.userType
    },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRE || '1d' }
  );
};

// Method to generate refresh token
userSchema.methods.generateRefreshToken = function () {
  return jwt.sign(
    { id: this._id },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: '7d' }
  );
};

// Method to generate password reset token
userSchema.methods.generatePasswordResetToken = function () {
  const resetToken = Math.random().toString(36).substring(2, 15)
                    + Math.random().toString(36).substring(2, 15);

  this.resetPasswordToken = resetToken;
  this.resetPasswordExpire = Date.now() + 10 * 60 * 1000; // 10 minutes

  return resetToken;
};

// Method to generate email verification token
userSchema.methods.generateEmailVerificationToken = function () {
  const verificationToken = Math.random().toString(36).substring(2, 15)
                           + Math.random().toString(36).substring(2, 15);

  this.emailVerificationToken = verificationToken;
  this.emailVerificationExpire = Date.now() + 24 * 60 * 60 * 1000; // 24 hours

  return verificationToken;
};

// Method to generate OTP
userSchema.methods.generateOTP = function (type = 'phone') {
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

  if (type === 'phone') {
    this.phoneOTP = {
      code: otp,
      expiresAt,
      attempts: 0
    };
  } else if (type === 'email') {
    this.emailOTP = {
      code: otp,
      expiresAt,
      attempts: 0
    };
  }

  return otp;
};

// Method to verify OTP
userSchema.methods.verifyOTP = function (inputOTP, type = 'phone') {
  const otpData = type === 'phone' ? this.phoneOTP : this.emailOTP;

  if (!otpData || !otpData.code) {
    return { success: false, message: 'No OTP found' };
  }

  if (otpData.expiresAt < new Date()) {
    return { success: false, message: 'OTP has expired' };
  }

  if (otpData.attempts >= 5) {
    return { success: false, message: 'Maximum OTP attempts exceeded' };
  }

  if (otpData.code !== inputOTP) {
    otpData.attempts += 1;
    return { success: false, message: 'Invalid OTP' };
  }

  // OTP is valid
  if (type === 'phone') {
    this.phoneVerified = true;
    this.phoneOTP = undefined;
  } else {
    this.emailVerified = true;
    this.emailOTP = undefined;
  }

  return { success: true, message: 'OTP verified successfully' };
};

// Method to handle login attempts
userSchema.methods.incrementLoginAttempts = function () {
  // If we have a previous lock that has expired, restart at 1
  if (this.lockUntil && this.lockUntil < Date.now()) {
    return this.updateOne({
      $unset: { lockUntil: 1 },
      $set: { loginAttempts: 1 }
    });
  }

  const updates = { $inc: { loginAttempts: 1 } };

  // Lock account after 5 failed attempts for 2 hours
  if (this.loginAttempts + 1 >= 5 && !this.isLocked) {
    updates.$set = { lockUntil: Date.now() + 2 * 60 * 60 * 1000 };
  }

  return this.updateOne(updates);
};

// Method to reset login attempts
userSchema.methods.resetLoginAttempts = function () {
  return this.updateOne({
    $unset: { loginAttempts: 1, lockUntil: 1 }
  });
};

// Static method to find by credentials
userSchema.statics.findByCredentials = async function (identifier, password) {
  // identifier can be email or phone
  const query = identifier.includes('@')
    ? { email: identifier.toLowerCase() }
    : { phone: identifier };

  const user = await this.findOne(query).select('+password');

  if (!user) {
    throw new Error('Invalid credentials');
  }

  if (user.isLocked) {
    throw new Error('Account is temporarily locked due to too many failed login attempts');
  }

  const isPasswordValid = await user.comparePassword(password);

  if (!isPasswordValid) {
    await user.incrementLoginAttempts();
    throw new Error('Invalid credentials');
  }

  // Reset login attempts on successful login
  if (user.loginAttempts > 0) {
    await user.resetLoginAttempts();
  }

  // Update last login
  user.lastLogin = new Date();
  await user.save();

  return user;
};

// Virtual field for full name
userSchema.virtual('name').get(function () {
  return `${this.firstName} ${this.lastName}`;
});

// Ensure virtual fields are serialized
userSchema.set('toJSON', {
  virtuals: true
});

module.exports = mongoose.model('User', userSchema);
