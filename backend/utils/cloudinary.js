// Cloudinary utility functions - Production ready

const cloudinary = require('cloudinary').v2;

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Upload single image to Cloudinary
const uploadToCloudinary = async (fileBuffer, folder = 'properties') => {
  try {
    // Check if Cloudinary is configured
    if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY) {
      console.warn('⚠️ Cloudinary not configured, using mock upload');
      return {
        public_id: `${folder}/mock_img_${Date.now()}`,
        secure_url: `https://via.placeholder.com/800x600?text=Mock+Upload`,
        width: 800,
        height: 600,
        format: 'jpg',
        bytes: fileBuffer ? fileBuffer.length : 1024,
        created_at: new Date()
      };
    }

    return new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        {
          resource_type: 'image',
          folder,
          transformation: [
            { width: 1200, height: 800, crop: 'limit', quality: 'auto:good' },
            { fetch_format: 'auto' }
          ],
          overwrite: true,
          unique_filename: true
        },
        (error, result) => {
          if (error) {
            console.error('Cloudinary upload error:', error);
            reject(error);
          } else {
            resolve(result);
          }
        }
      ).end(fileBuffer);
    });
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    throw error;
  }
};

// Delete image from Cloudinary
const deleteFromCloudinary = async (publicId) => {
  try {
    // Check if Cloudinary is configured
    if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY) {
      console.warn('⚠️ Cloudinary not configured, using mock deletion');
      return {
        public_id: publicId,
        result: 'ok'
      };
    }

    const result = await cloudinary.uploader.destroy(publicId);
    return result;
  } catch (error) {
    console.error('Cloudinary delete error:', error);
    throw error;
  }
};

// Generate transformation URLs
const generateImageURL = (publicId, transformations = {}) => {
  try {
    // Check if Cloudinary is configured
    if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY) {
      return `https://via.placeholder.com/800x600?text=Transformed+${publicId}`;
    }

    return cloudinary.url(publicId, {
      ...transformations,
      secure: true,
      quality: 'auto:good',
      fetch_format: 'auto'
    });
  } catch (error) {
    console.error('Generate image URL error:', error);
    throw error;
  }
};

// Upload multiple images
const uploadMultipleToCloudinary = async (files, folder = 'properties') => {
  try {
    const uploadPromises = files.map(file => 
      uploadToCloudinary(file.buffer, folder)
    );
    
    return await Promise.all(uploadPromises);
  } catch (error) {
    console.error('Multiple upload error:', error);
    throw error;
  }
};

module.exports = {
  uploadToCloudinary,
  deleteFromCloudinary,
  generateImageURL,
  uploadMultipleToCloudinary
};