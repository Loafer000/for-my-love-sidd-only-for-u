const { User } = require('../models');
const { uploadToCloudinary } = require('../utils/cloudinary');

// Get user profile
const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .select('-password -refreshToken')
      .populate('properties', 'title location price images status');

    res.json({
      success: true,
      message: 'Profile retrieved successfully',
      data: { user }
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve profile',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

// Update user profile
const updateUserProfile = async (req, res) => {
  try {
    const {
      firstName, lastName, phone, bio, location, preferences
    } = req.body;

    const updateData = {
      firstName,
      lastName,
      phone,
      bio,
      location,
      preferences,
      updatedAt: new Date()
    };

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { $set: updateData },
      { new: true, runValidators: true }
    ).select('-password -refreshToken');

    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: { user }
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update profile',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

// Upload profile photo
const uploadProfilePhoto = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded'
      });
    }

    // TODO: Integrate with Cloudinary later
    // const uploadResult = await uploadToCloudinary(req.file.buffer, 'profiles');

    // Mock upload for now - replace with actual Cloudinary integration
    const profilePhotoUrl = `https://via.placeholder.com/300x300?text=Profile+${req.user._id}`;

    const user = await User.findByIdAndUpdate(
      req.user._id,
      {
        $set: {
          profilePhoto: profilePhotoUrl,
          updatedAt: new Date()
        }
      },
      { new: true }
    ).select('-password -refreshToken');

    res.json({
      success: true,
      message: 'Profile photo uploaded successfully',
      data: {
        user,
        profilePhoto: profilePhotoUrl
      }
    });
  } catch (error) {
    console.error('Upload profile photo error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to upload profile photo',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

// Change password
const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    const user = await User.findById(req.user._id);

    // Verify current password
    const isCurrentPasswordValid = await user.comparePassword(currentPassword);
    if (!isCurrentPasswordValid) {
      return res.status(400).json({
        success: false,
        message: 'Current password is incorrect'
      });
    }

    // Update password
    user.password = newPassword;
    user.updatedAt = new Date();
    await user.save();

    res.json({
      success: true,
      message: 'Password changed successfully'
    });
  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to change password',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

// Get user's properties (for landlords)
const getUserProperties = async (req, res) => {
  try {
    const { page = 1, limit = 10, status } = req.query;

    const filters = { owner: req.user._id, isDeleted: false };
    if (status) filters.status = status;

    const skip = (parseInt(page, 10) - 1) * parseInt(limit, 10);

    const properties = await Property.find(filters)
      .populate('owner', 'firstName lastName phone email')
      .sort('-createdAt')
      .skip(skip)
      .limit(parseInt(limit, 10));

    const total = await Property.countDocuments(filters);

    res.json({
      success: true,
      message: 'Properties retrieved successfully',
      data: {
        properties,
        pagination: {
          currentPage: parseInt(page, 10),
          totalPages: Math.ceil(total / parseInt(limit, 10)),
          totalProperties: total,
          hasNextPage: skip + properties.length < total,
          hasPrevPage: parseInt(page, 10) > 1
        }
      }
    });
  } catch (error) {
    console.error('Get user properties error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve properties',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

// Get user by ID (public profile)
const getUserById = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id)
      .select('firstName lastName profilePhoto bio location userType verifications createdAt')
      .populate('properties', 'title location price images status');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      message: 'User profile retrieved successfully',
      data: { user }
    });
  } catch (error) {
    console.error('Get user by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve user',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

module.exports = {
  getUserProfile,
  updateUserProfile,
  uploadProfilePhoto,
  changePassword,
  getUserProperties,
  getUserById
};
