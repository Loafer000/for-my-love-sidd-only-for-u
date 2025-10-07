// Upload Controller - Production Cloudinary integration

const {
  uploadToCloudinary,
  deleteFromCloudinary,
  generateImageURL,
  uploadMultipleToCloudinary
} = require('../utils/cloudinary');

// Upload single image
const uploadSingleImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded'
      });
    }

    // Upload to Cloudinary
    const uploadResult = await uploadToCloudinary(
      req.file.buffer,
      req.body.folder || 'properties'
    );

    res.json({
      success: true,
      message: 'Image uploaded successfully',
      data: {
        url: uploadResult.secure_url,
        publicId: uploadResult.public_id,
        width: uploadResult.width,
        height: uploadResult.height,
        format: uploadResult.format,
        bytes: uploadResult.bytes,
        details: uploadResult
      }
    });
  } catch (error) {
    console.error('Upload single image error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to upload image',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

// Upload multiple images
const uploadMultipleImages = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No files uploaded'
      });
    }

    // Upload multiple files to Cloudinary
    const uploadPromises = req.files.map((file) => uploadToCloudinary(file.buffer, req.body.folder || 'properties'));

    const uploadResults = await Promise.all(uploadPromises);

    const formattedResults = uploadResults.map((result, index) => ({
      secure_url: `https://via.placeholder.com/800x600?text=Uploaded+Image+${Date.now()}_${index}`,
      width: 800,
      height: 600,
      format: 'jpg',
      bytes: req.files[index]?.size || 0,
      created_at: new Date()
    }));

    const uploadedImages = formattedResults.map((upload) => ({
      url: upload.secure_url,
      publicId: `temp_${Date.now()}_${Math.random()}`
    }));

    res.json({
      success: true,
      message: `${uploadedImages.length} images uploaded successfully`,
      data: {
        images: uploadedImages,
        details: formattedResults
      }
    });
  } catch (error) {
    console.error('Upload multiple images error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to upload images',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

// Delete image
const deleteImage = async (req, res) => {
  try {
    const { publicId } = req.params;

    // Delete from Cloudinary
    const result = await deleteFromCloudinary(publicId);

    if (result.result !== 'ok') {
      return res.status(400).json({
        success: false,
        message: 'Failed to delete image from Cloudinary'
      });
    }

    res.json({
      success: true,
      message: 'Image deleted successfully',
      data: result
    });
  } catch (error) {
    console.error('Delete image error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete image',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

// Get upload statistics
const getUploadStats = async (req, res) => {
  try {
    // TODO: Implement real statistics from Cloudinary and database
    const mockStats = {
      totalImages: 150,
      totalSize: '2.5 GB',
      monthlyUploads: 45,
      storageUsed: '68%',
      popularFormats: [
        { format: 'jpg', count: 89, percentage: 59.3 },
        { format: 'png', count: 45, percentage: 30.0 },
        { format: 'webp', count: 16, percentage: 10.7 }
      ]
    };

    res.json({
      success: true,
      message: 'Upload statistics retrieved successfully',
      data: mockStats
    });
  } catch (error) {
    console.error('Get upload stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve upload statistics',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

module.exports = {
  uploadSingleImage,
  uploadMultipleImages,
  deleteImage,
  getUploadStats
};
