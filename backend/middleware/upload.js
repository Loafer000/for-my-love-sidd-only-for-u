const multer = require('multer');
const path = require('path');

// Configure multer for memory storage (for Cloudinary upload)
const storage = multer.memoryStorage();

// File filter function
const fileFilter = (req, file, cb) => {
  // Check file type
  if (file.fieldname === 'images') {
    // Allow only image files
    const allowedImageTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedImageTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedImageTypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only image files (JPEG, JPG, PNG, GIF, WebP) are allowed for images'));
    }
  } else if (file.fieldname === 'documents') {
    // Allow images and PDFs for documents
    const allowedDocTypes = /jpeg|jpg|png|pdf/;
    const extname = allowedDocTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = /image\/(jpeg|jpg|png)|application\/pdf/.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only image files (JPEG, JPG, PNG) and PDF files are allowed for documents'));
    }
  } else {
    cb(new Error('Unexpected field name'));
  }
};

// Create multer upload middleware
const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit per file
    files: 10 // Maximum 10 files
  },
  fileFilter
});

// Specific upload configurations
const uploadPropertyImages = upload.array('images', 10);
const uploadPropertyDocuments = upload.array('documents', 5);
const uploadMixed = upload.fields([
  { name: 'images', maxCount: 10 },
  { name: 'documents', maxCount: 5 }
]);

// Error handling middleware for multer
const handleUploadError = (error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ message: 'File size too large. Maximum 5MB per file.' });
    }
    if (error.code === 'LIMIT_FILE_COUNT') {
      return res.status(400).json({ message: 'Too many files. Maximum 10 images and 5 documents allowed.' });
    }
    if (error.code === 'LIMIT_UNEXPECTED_FILE') {
      return res.status(400).json({ message: 'Unexpected file field.' });
    }
  }
  
  if (error.message.includes('Only')) {
    return res.status(400).json({ message: error.message });
  }
  
  next(error);
};

module.exports = {
  upload,
  uploadPropertyImages,
  uploadPropertyDocuments,
  uploadMixed,
  handleUploadError
};