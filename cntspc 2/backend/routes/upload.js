const express = require('express');
const { auth } = require('../middleware/auth');
const { uploadPropertyImages, uploadPropertyDocuments, handleUploadError } = require('../middleware/upload');

const router = express.Router();

// @route   POST /api/upload/images
// @desc    Upload property images
// @access  Private
router.post('/images', auth, uploadPropertyImages, async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: 'No files uploaded' });
    }

    // In production, upload to Cloudinary
    // For now, return mock URLs
    const uploadedFiles = req.files.map((file, index) => ({
      url: `https://example.com/uploads/${Date.now()}-${index}.jpg`,
      publicId: `property_${Date.now()}_${index}`,
      originalName: file.originalname,
      size: file.size
    }));

    res.json({
      message: 'Files uploaded successfully',
      files: uploadedFiles
    });

  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ message: 'Upload failed' });
  }
});

// @route   POST /api/upload/documents
// @desc    Upload property documents
// @access  Private
router.post('/documents', auth, uploadPropertyDocuments, async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: 'No files uploaded' });
    }

    // In production, upload to Cloudinary
    const uploadedFiles = req.files.map((file, index) => ({
      url: `https://example.com/documents/${Date.now()}-${index}.pdf`,
      publicId: `document_${Date.now()}_${index}`,
      originalName: file.originalname,
      size: file.size,
      type: req.body.type || 'other'
    }));

    res.json({
      message: 'Documents uploaded successfully',
      files: uploadedFiles
    });

  } catch (error) {
    console.error('Document upload error:', error);
    res.status(500).json({ message: 'Document upload failed' });
  }
});

// Error handling middleware
router.use(handleUploadError);

module.exports = router;