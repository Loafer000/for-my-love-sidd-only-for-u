import React, { useState, useRef } from 'react';

const ProfilePhotoUpload = ({ currentPhoto, onPhotoUpdate, isEditing }) => {
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [previewPhoto, setPreviewPhoto] = useState(currentPhoto);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileSelect = (file) => {
    if (!file) return;

    // Validate file type
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
    if (!validTypes.includes(file.type)) {
      alert('Please select a valid image file (JPEG, PNG, or GIF)');
      return;
    }

    // Validate file size (5MB limit)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      alert('File size must be less than 5MB');
      return;
    }

    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreviewPhoto(e.target.result);
    };
    reader.readAsDataURL(file);

    // Simulate upload process
    uploadPhoto(file);
  };

  const uploadPhoto = async (file) => {
    setIsUploading(true);
    setUploadProgress(0);

    try {
      // Simulate upload progress
      for (let progress = 0; progress <= 100; progress += 10) {
        setUploadProgress(progress);
        await new Promise(resolve => setTimeout(resolve, 100));
      }

      // Upload to Cloudinary via our backend
      const cloudinaryService = await import('../../services/cloudinaryService');
      const uploadResult = await cloudinaryService.default.uploadWithProgress(
        file, 
        'profiles',
        (progress) => setUploadProgress(progress)
      );
      
      const photoData = {
        url: uploadResult.url, // Use Cloudinary URL
        publicId: uploadResult.publicId, // Store for deletion
        name: file.name,
        size: file.size,
        uploadedAt: new Date().toISOString()
      };

      onPhotoUpdate(photoData);
    } catch (error) {
      console.error('Upload error:', error);
      alert('Failed to upload photo. Please try again.');
      setPreviewPhoto(currentPhoto);
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const handleFileInputChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const file = e.dataTransfer.files[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  const removePhoto = () => {
    setPreviewPhoto(null);
    onPhotoUpdate(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const getInitials = () => {
    // This would typically come from user's name
    return 'JD'; // Mock initials
  };

  return (
    <div className="relative">
      {/* Profile Photo Display */}
      <div className="relative group">
        <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center border-4 border-white shadow-lg">
          {previewPhoto ? (
            <img
              src={previewPhoto}
              alt="Profile"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center">
              <span className="text-2xl font-bold text-white">
                {getInitials()}
              </span>
            </div>
          )}
        </div>

        {/* Upload Progress Overlay */}
        {isUploading && (
          <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center">
            <div className="text-center">
              <div className="w-16 h-16 border-4 border-white border-t-transparent rounded-full animate-spin mb-2"></div>
              <p className="text-white text-sm font-medium">{uploadProgress}%</p>
            </div>
          </div>
        )}

        {/* Edit Overlay (when editing) */}
        {isEditing && !isUploading && (
          <div className="absolute inset-0 bg-black bg-opacity-40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <button
              onClick={openFileDialog}
              className="bg-white rounded-full p-2 shadow-lg hover:bg-gray-50 transition-colors"
              title="Change photo"
            >
              <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </button>
          </div>
        )}

        {/* Remove Photo Button */}
        {isEditing && previewPhoto && !isUploading && (
          <button
            onClick={removePhoto}
            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center shadow-lg hover:bg-red-600 transition-colors"
            title="Remove photo"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {/* File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileInputChange}
        className="hidden"
      />

      {/* Drag & Drop Zone (when editing and no photo) */}
      {isEditing && !previewPhoto && !isUploading && (
        <div
          className={`mt-4 border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
            dragActive
              ? 'border-primary-500 bg-primary-50'
              : 'border-gray-300 hover:border-gray-400'
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
            <path
              d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <div className="mt-4">
            <button
              type="button"
              onClick={openFileDialog}
              className="text-primary-600 hover:text-primary-700 font-medium"
            >
              Upload a photo
            </button>
            <p className="text-gray-500 text-sm mt-1">or drag and drop</p>
          </div>
          <p className="text-xs text-gray-400 mt-2">
            PNG, JPG, GIF up to 5MB
          </p>
        </div>
      )}

      {/* Upload Instructions (when editing) */}
      {isEditing && (
        <div className="mt-4 space-y-2">
          <div className="flex items-center space-x-2">
            <button
              onClick={openFileDialog}
              disabled={isUploading}
              className="flex items-center px-4 py-2 bg-primary-600 text-white text-sm rounded-md hover:bg-primary-700 disabled:bg-gray-400 transition-colors"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
              {isUploading ? 'Uploading...' : 'Choose Photo'}
            </button>
            
            {previewPhoto && (
              <button
                onClick={removePhoto}
                disabled={isUploading}
                className="px-4 py-2 border border-gray-300 text-gray-700 text-sm rounded-md hover:bg-gray-50 disabled:bg-gray-100 transition-colors"
              >
                Remove
              </button>
            )}
          </div>

          <div className="text-xs text-gray-500 space-y-1">
            <p>• Maximum file size: 5MB</p>
            <p>• Supported formats: JPEG, PNG, GIF</p>
            <p>• Recommended: Square images (1:1 ratio)</p>
          </div>
        </div>
      )}

      {/* Photo Info (when not editing and has photo) */}
      {!isEditing && previewPhoto && currentPhoto && (
        <div className="mt-2 text-xs text-gray-500 text-center">
          <p>Profile photo</p>
          {currentPhoto.uploadedAt && (
            <p>Updated {new Date(currentPhoto.uploadedAt).toLocaleDateString()}</p>
          )}
        </div>
      )}
    </div>
  );
};

export default ProfilePhotoUpload;