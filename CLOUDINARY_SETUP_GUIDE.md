# Cloudinary Integration Setup Guide 📸

## What is Cloudinary?
**Cloudinary** is a cloud-based image and video management service that provides:
- **Image upload** and storage
- **Automatic optimization** (format, quality, compression)
- **Image transformations** (resize, crop, filters)
- **CDN delivery** for fast loading worldwide
- **Free tier**: 25GB storage + 25GB bandwidth per month

## Quick Setup (5 minutes)

### 1. Create Cloudinary Account
1. Go to **https://cloudinary.com/**
2. Sign up for **free account**
3. Verify your email
4. Access your **dashboard**

### 2. Get Your API Keys
From your Cloudinary Dashboard, copy these 3 values:

```bash
Cloud Name: your_cloud_name      # (visible in dashboard URL)
API Key: 123456789012345         # (your unique API key)
API Secret: abcdefghijklmnop     # (keep this secret!)
```

### 3. Add to Environment Variables
Add these to your `.env` file (backend):

```bash
# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=123456789012345
CLOUDINARY_API_SECRET=abcdefghijklmnop
```

### 4. Test Upload
1. Start your backend server: `npm start`
2. Upload a test image through your app
3. Check your Cloudinary dashboard - images should appear

## Implementation Status ✅

### Backend (Completed)
- ✅ **Cloudinary SDK** integrated
- ✅ **Upload endpoints** created (`/api/upload/image`, `/api/upload/images`)
- ✅ **Delete functionality** implemented  
- ✅ **Error handling** with fallback to mock uploads
- ✅ **Rate limiting** (20 uploads per hour)
- ✅ **File validation** (type, size, security)

### Frontend (Completed)
- ✅ **CloudinaryService** class created
- ✅ **Progress tracking** for uploads
- ✅ **Batch upload** functionality
- ✅ **Error handling** and validation
- ✅ **Profile photo upload** integrated
- ✅ **Property photo upload** integrated

## Features Included

### Smart Fallback System
- **With Cloudinary**: Real cloud storage, CDN delivery, transformations
- **Without Cloudinary**: Mock uploads work for development/testing

### Upload Features
- **Single image upload** with progress
- **Multiple image upload** (batch processing)
- **File validation** (type, size, format)
- **Progress tracking** (per file and overall)
- **Error handling** with detailed messages

### Image Optimization
- **Automatic format** conversion (WebP, AVIF when supported)
- **Quality optimization** (auto:good setting)
- **Size limits** (5MB per file, 10 files max)
- **Responsive transformations** (multiple sizes)

## API Endpoints

### Upload Single Image
```javascript
POST /api/upload/image
Content-Type: multipart/form-data
Authorization: Bearer <token>

FormData:
- image: File (required)
- folder: String (optional, default: 'properties')
```

### Upload Multiple Images  
```javascript
POST /api/upload/images
Content-Type: multipart/form-data
Authorization: Bearer <token>

FormData:
- images: File[] (required, max 10 files)
- folder: String (optional, default: 'properties')
```

### Delete Image
```javascript
DELETE /api/upload/:publicId
Authorization: Bearer <token>
```

## Frontend Usage Examples

### Basic Upload
```javascript
import cloudinaryService from '../services/cloudinaryService';

// Upload single image
const uploadResult = await cloudinaryService.uploadSingleImage(file, 'profiles');
console.log('Image URL:', uploadResult.url);

// Upload with progress
await cloudinaryService.uploadWithProgress(file, 'properties', (progress) => {
  console.log(`Upload progress: ${progress}%`);
});
```

### Batch Upload
```javascript
const { results, errors } = await cloudinaryService.batchUpload(
  files, 
  'properties',
  (index, fileName, progress) => {
    console.log(`${fileName}: ${progress}%`);
  },
  (overallProgress) => {
    console.log(`Overall: ${overallProgress}%`);
  }
);
```

## Folder Structure
Images are organized in Cloudinary folders:
- **profiles/** - User profile pictures
- **properties/** - Property photos
- **documents/** - Document uploads
- **reviews/** - Review media

## Security Features
- ✅ **Authentication required** for all uploads
- ✅ **File type validation** (images only)
- ✅ **Size limits** enforced (5MB per file)
- ✅ **Rate limiting** (20 uploads per hour)
- ✅ **Malware scanning** (Cloudinary built-in)

## Cost Optimization
- **Free tier**: 25GB storage + 25GB bandwidth
- **Automatic optimization** reduces file sizes by 35-80%
- **Smart caching** minimizes repeated uploads
- **CDN delivery** reduces bandwidth costs

## Troubleshooting

### Common Issues

#### "Cloudinary not configured" Warning
- **Cause**: Missing environment variables
- **Fix**: Add CLOUDINARY_CLOUD_NAME, API_KEY, API_SECRET to .env
- **Note**: App works with mock uploads until configured

#### Upload Fails with 401 Error
- **Cause**: Invalid API credentials  
- **Fix**: Verify API key and secret from Cloudinary dashboard
- **Check**: Ensure no extra spaces in .env file

#### Images Not Loading
- **Cause**: Public ID or URL issues
- **Fix**: Check Cloudinary dashboard for uploaded files
- **Debug**: Enable console logging in cloudinaryService.js

### Development vs Production

#### Development (Optional)
- Mock uploads work without Cloudinary
- Uses placeholder images
- Perfect for UI development

#### Production (Required)
- Real Cloudinary account needed
- Actual cloud storage and CDN
- Better performance and reliability

## Monitoring & Analytics

### Upload Statistics
```javascript
const stats = await cloudinaryService.getUploadStats();
console.log('Total images:', stats.totalImages);
console.log('Storage used:', stats.storageUsed);
```

### Cloudinary Dashboard
- **Usage metrics** (storage, bandwidth)
- **Image analytics** (views, transformations)
- **Performance insights** (load times, optimization savings)

## Next Steps After Setup

1. **Test uploads** with your app
2. **Monitor usage** in Cloudinary dashboard  
3. **Optimize images** using Cloudinary transformations
4. **Set up backup** strategy (optional)
5. **Configure webhooks** for advanced features (optional)

---

## Quick Setup Checklist ✅

- [ ] Create Cloudinary account (free)
- [ ] Copy API credentials from dashboard
- [ ] Add to `.env` file (backend)
- [ ] Restart backend server
- [ ] Test upload functionality
- [ ] Check Cloudinary dashboard for uploaded images

**Setup time: ~5 minutes** | **Free tier: Sufficient for 1000+ images**