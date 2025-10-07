// Frontend Cloudinary Configuration and Upload Service
class CloudinaryService {
  constructor() {
    this.baseURL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
  }

  // Upload single image
  async uploadSingleImage(file, folder = 'properties', onProgress = null) {
    try {
      const formData = new FormData();
      formData.append('image', file);
      formData.append('folder', folder);

      const response = await fetch(`${this.baseURL}/upload/image`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        },
        body: formData
      });

      if (!response.ok) {
        throw new Error(`Upload failed: ${response.statusText}`);
      }

      const result = await response.json();
      return result.data;
    } catch (error) {
      console.error('Single image upload error:', error);
      throw error;
    }
  }

  // Upload multiple images
  async uploadMultipleImages(files, folder = 'properties', onProgress = null) {
    try {
      const formData = new FormData();
      
      // Append all files
      Array.from(files).forEach(file => {
        formData.append('images', file);
      });
      formData.append('folder', folder);

      const response = await fetch(`${this.baseURL}/upload/images`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        },
        body: formData
      });

      if (!response.ok) {
        throw new Error(`Upload failed: ${response.statusText}`);
      }

      const result = await response.json();
      return result.data;
    } catch (error) {
      console.error('Multiple image upload error:', error);
      throw error;
    }
  }

  // Upload with progress tracking
  async uploadWithProgress(file, folder = 'properties', onProgress = null) {
    return new Promise((resolve, reject) => {
      const formData = new FormData();
      formData.append('image', file);
      formData.append('folder', folder);

      const xhr = new XMLHttpRequest();

      // Track upload progress
      xhr.upload.addEventListener('progress', (e) => {
        if (e.lengthComputable && onProgress) {
          const percentComplete = (e.loaded / e.total) * 100;
          onProgress(percentComplete);
        }
      });

      xhr.addEventListener('load', () => {
        if (xhr.status === 200) {
          try {
            const result = JSON.parse(xhr.responseText);
            resolve(result.data);
          } catch (e) {
            reject(new Error('Invalid response format'));
          }
        } else {
          reject(new Error(`Upload failed: ${xhr.statusText}`));
        }
      });

      xhr.addEventListener('error', () => {
        reject(new Error('Upload failed'));
      });

      xhr.open('POST', `${this.baseURL}/upload/image`);
      xhr.setRequestHeader('Authorization', `Bearer ${localStorage.getItem('authToken')}`);
      xhr.send(formData);
    });
  }

  // Delete image
  async deleteImage(publicId) {
    try {
      const response = await fetch(`${this.baseURL}/upload/${encodeURIComponent(publicId)}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`Delete failed: ${response.statusText}`);
      }

      const result = await response.json();
      return result.data;
    } catch (error) {
      console.error('Image delete error:', error);
      throw error;
    }
  }

  // Generate optimized image URLs
  generateImageURL(publicId, transformations = {}) {
    // If no transformations needed, return the original URL
    if (Object.keys(transformations).length === 0) {
      return publicId; // Assuming publicId is already a full URL from Cloudinary
    }

    // For advanced transformations, you might want to construct Cloudinary URLs
    // This is a simplified version - you can expand based on your needs
    const baseTransformations = {
      quality: 'auto:good',
      fetch_format: 'auto',
      ...transformations
    };

    // This would need to be expanded based on Cloudinary URL structure
    return publicId;
  }

  // Validate file before upload
  validateFile(file, options = {}) {
    const {
      maxSize = 5 * 1024 * 1024, // 5MB default
      allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
    } = options;

    const errors = [];

    // Check file type
    if (!allowedTypes.includes(file.type)) {
      errors.push(`File type ${file.type} not allowed. Allowed types: ${allowedTypes.join(', ')}`);
    }

    // Check file size
    if (file.size > maxSize) {
      errors.push(`File size ${(file.size / (1024 * 1024)).toFixed(2)}MB exceeds limit of ${(maxSize / (1024 * 1024))}MB`);
    }

    // Check if file is actually an image
    if (!file.type.startsWith('image/')) {
      errors.push('File must be an image');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  // Batch upload with individual progress tracking
  async batchUpload(files, folder = 'properties', onFileProgress = null, onOverallProgress = null) {
    const results = [];
    const errors = [];
    
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      
      try {
        // Validate file
        const validation = this.validateFile(file);
        if (!validation.isValid) {
          errors.push({ file: file.name, errors: validation.errors });
          continue;
        }

        // Upload with progress
        const result = await this.uploadWithProgress(file, folder, (progress) => {
          if (onFileProgress) {
            onFileProgress(i, file.name, progress);
          }
        });

        results.push({ file: file.name, result });

        // Update overall progress
        if (onOverallProgress) {
          onOverallProgress(((i + 1) / files.length) * 100);
        }

      } catch (error) {
        errors.push({ file: file.name, error: error.message });
      }
    }

    return { results, errors };
  }

  // Get upload statistics
  async getUploadStats() {
    try {
      const response = await fetch(`${this.baseURL}/upload/stats`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`Stats fetch failed: ${response.statusText}`);
      }

      const result = await response.json();
      return result.data;
    } catch (error) {
      console.error('Upload stats error:', error);
      throw error;
    }
  }
}

// Create singleton instance
const cloudinaryService = new CloudinaryService();

export default cloudinaryService;