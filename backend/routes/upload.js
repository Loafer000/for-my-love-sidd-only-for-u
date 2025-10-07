const express = require('express');
const router = express.Router();

// @desc    Test upload routes
// @route   GET /api/upload/test
// @access  Public
router.get('/test', (req, res) => {
  res.json({
    success: true,
    message: 'Upload routes working!',
    availableRoutes: [
      'POST   /api/upload/image',
      'POST   /api/upload/documents',
      'DELETE /api/upload/:fileId',
    ],
  });
});

const uploadController = require('../controllers/uploadController');
const { authenticate } = require('../middleware/auth');
const multer = require('multer');

// Multer configuration
const upload = multer({
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'), false);
    }
  }
});

// Routes
router.post('/image', authenticate, upload.single('image'), uploadController.uploadSingleImage);
router.post('/images', authenticate, upload.array('images', 10), uploadController.uploadMultipleImages);
router.delete('/:publicId', authenticate, uploadController.deleteImage);
router.get('/stats', authenticate, uploadController.getUploadStats);

module.exports = router;