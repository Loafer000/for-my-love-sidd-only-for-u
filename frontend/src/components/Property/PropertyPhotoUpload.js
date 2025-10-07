import React, { useState, useCallback } from 'react';

const PropertyPhotoUpload = ({ images = [], onImagesChange }) => {
  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState({});

  const maxFiles = 10;
  const maxFileSize = 5 * 1024 * 1024; // 5MB
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

  const validateFile = (file) => {
    if (!allowedTypes.includes(file.type)) {
      return 'Please upload only JPEG, PNG, or WebP images';
    }
    if (file.size > maxFileSize) {
      return 'File size should be less than 5MB';
    }
    return null;
  };

  const handleFiles = async (files) => {
    if (images.length + files.length > maxFiles) {
      alert(`You can upload maximum ${maxFiles} images`);
      return;
    }

    const validFiles = [];
    const errors = [];

    for (let file of files) {
      const error = validateFile(file);
      if (error) {
        errors.push(`${file.name}: ${error}`);
      } else {
        validFiles.push(file);
      }
    }

    if (errors.length > 0) {
      alert('Some files were not uploaded:\n' + errors.join('\n'));
    }

    if (validFiles.length > 0) {
      await uploadFiles(validFiles);
    }
  };

  const uploadFiles = async (files) => {
    setUploading(true);
    const newImages = [];

    for (let file of files) {
      try {
        // Create preview URL for immediate display
        const previewUrl = URL.createObjectURL(file);
        
        // Upload to Cloudinary via our backend
        const cloudinaryService = await import('../../../services/cloudinaryService');
        const uploadResult = await cloudinaryService.default.uploadWithProgress(
          file, 
          'properties',
          (progress) => {
            setUploadProgress(prev => ({
              ...prev,
              [file.name]: progress
            }));
          }
        );
        
        const imageData = {
          id: Date.now() + Math.random(),
          file: file,
          url: uploadResult.url, // Use Cloudinary URL
          publicId: uploadResult.publicId, // Store for deletion
          name: file.name,
          size: file.size,
          isPrimary: images.length === 0 && newImages.length === 0, // First image is primary
          uploaded: false
        };

        newImages.push(imageData);
        
        // Simulate upload progress
        setUploadProgress(prev => ({ ...prev, [imageData.id]: 0 }));
        
        // Simulate upload time
        for (let progress = 0; progress <= 100; progress += 10) {
          await new Promise(resolve => setTimeout(resolve, 50));
          setUploadProgress(prev => ({ ...prev, [imageData.id]: progress }));
        }
        
        imageData.uploaded = true;
      } catch (error) {
        console.error('Error uploading file:', file.name, error);
        alert(`Failed to upload ${file.name}`);
      }
    }

    const updatedImages = [...images, ...newImages];
    onImagesChange(updatedImages);
    setUploading(false);
    setUploadProgress({});
  };

  const handleDrag = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    const files = Array.from(e.dataTransfer.files);
    handleFiles(files);
  }, [images.length]);

  const handleFileInput = (e) => {
    const files = Array.from(e.target.files);
    handleFiles(files);
    e.target.value = ''; // Reset input
  };

  const removeImage = (imageId) => {
    const updatedImages = images.filter(img => img.id !== imageId);
    onImagesChange(updatedImages);
  };

  const setPrimaryImage = (imageId) => {
    const updatedImages = images.map(img => ({
      ...img,
      isPrimary: img.id === imageId
    }));
    onImagesChange(updatedImages);
  };

  const reorderImages = (dragIndex, hoverIndex) => {
    const updatedImages = [...images];
    const draggedImage = updatedImages[dragIndex];
    updatedImages.splice(dragIndex, 1);
    updatedImages.splice(hoverIndex, 0, draggedImage);
    onImagesChange(updatedImages);
  };

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Property Photos *
        </label>
        <p className="text-sm text-gray-600 mb-4">
          Add up to {maxFiles} photos to showcase your property. First photo will be the primary image.
        </p>

        {/* Upload Area */}
        <div
          className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
            dragActive
              ? 'border-primary-500 bg-primary-50'
              : 'border-gray-300 hover:border-gray-400'
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <div className="space-y-4">
            <div className="mx-auto h-12 w-12 text-gray-400">
              <svg fill="none" stroke="currentColor" viewBox="0 0 48 48">
                <path
                  d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <div>
              <label
                htmlFor="photo-upload"
                className="cursor-pointer inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-primary-700 bg-primary-100 hover:bg-primary-200 transition-colors"
              >
                Choose Photos
                <input
                  id="photo-upload"
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleFileInput}
                  className="sr-only"
                  disabled={uploading || images.length >= maxFiles}
                />
              </label>
              <p className="text-sm text-gray-500 mt-2">
                or drag and drop images here
              </p>
            </div>
            <p className="text-xs text-gray-500">
              PNG, JPG, WebP up to 5MB each • {images.length}/{maxFiles} uploaded
            </p>
          </div>
        </div>

        {/* Image Grid */}
        {images.length > 0 && (
          <div className="mt-6">
            <h4 className="text-sm font-medium text-gray-700 mb-3">
              Uploaded Photos ({images.length}/{maxFiles})
            </h4>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {images.map((image, index) => (
                <div
                  key={image.id}
                  className="relative group bg-gray-100 rounded-lg overflow-hidden aspect-square"
                >
                  <img
                    src={image.url}
                    alt={image.name}
                    className="w-full h-full object-cover"
                  />
                  
                  {/* Upload Progress */}
                  {!image.uploaded && uploadProgress[image.id] !== undefined && (
                    <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                      <div className="text-white text-center">
                        <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                        <div className="text-xs">{uploadProgress[image.id]}%</div>
                      </div>
                    </div>
                  )}

                  {/* Primary Badge */}
                  {image.isPrimary && (
                    <div className="absolute top-2 left-2 bg-primary-600 text-white px-2 py-1 rounded text-xs font-medium">
                      Primary
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-opacity flex items-center justify-center">
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity flex space-x-2">
                      {!image.isPrimary && (
                        <button
                          onClick={() => setPrimaryImage(image.id)}
                          className="bg-white text-gray-700 p-2 rounded-full hover:bg-gray-100 transition-colors"
                          title="Set as primary image"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                          </svg>
                        </button>
                      )}
                      <button
                        onClick={() => removeImage(image.id)}
                        className="bg-red-600 text-white p-2 rounded-full hover:bg-red-700 transition-colors"
                        title="Remove image"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  </div>

                  {/* Image Info */}
                  <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-75 text-white p-2 text-xs">
                    <div className="truncate">{image.name}</div>
                    <div className="text-gray-300">
                      {(image.size / 1024 / 1024).toFixed(2)} MB
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Photo Tips */}
            <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h4 className="text-sm font-medium text-blue-800">Photo Tips</h4>
                  <ul className="text-sm text-blue-700 mt-1 space-y-1">
                    <li>• Use good lighting and take photos during daytime</li>
                    <li>• Include exterior, living room, bedrooms, kitchen, and bathrooms</li>
                    <li>• Show key amenities like parking, balcony, or garden</li>
                    <li>• Avoid personal items and clutter in the photos</li>
                    <li>• First photo will be used as the main listing image</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Upload Status */}
        {uploading && (
          <div className="mt-4 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg className="animate-spin h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-yellow-800">
                  Uploading photos... Please don't close this window.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PropertyPhotoUpload;