# ConnectSpace Backend API

A robust Node.js backend for the ConnectSpace rental platform.

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ 
- MongoDB (local or MongoDB Atlas)
- Git

### Installation

1. **Clone and navigate to backend directory**
   ```bash
   cd connectspace/backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   # Copy example env file
   cp .env.example .env
   
   # Edit .env file with your configurations
   nano .env
   ```

4. **Start the server**
   ```bash
   # Development mode (with auto-reload)
   npm run dev
   
   # Production mode
   npm start
   ```

5. **Test the API**
   ```bash
   # Health check
   curl http://localhost:5000/api/health
   
   # Test routes
   curl http://localhost:5000/api/auth/test
   ```

## 📁 Project Structure

```
backend/
├── config/          # Database & configuration files
├── controllers/     # Route controllers (business logic)
├── middleware/      # Custom middleware functions
├── models/         # Database models/schemas
├── routes/         # API route definitions
├── utils/          # Utility functions & helpers
├── uploads/        # File uploads (if using local storage)
├── server.js       # Main server file
├── package.json    # Dependencies & scripts
└── .env           # Environment variables
```

## 🛠️ Environment Setup

### Required Environment Variables

```bash
# Server Configuration
NODE_ENV=development
PORT=5000

# Database
MONGODB_URI=mongodb://localhost:27017/connectspace

# JWT Secrets
JWT_SECRET=your-super-secret-jwt-key-here-min-32-characters-long
JWT_REFRESH_SECRET=your-refresh-secret-key-here-different-from-above

# Email (for notifications)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password

# SMS/OTP (Twilio)
TWILIO_ACCOUNT_SID=your-twilio-account-sid
TWILIO_AUTH_TOKEN=your-twilio-auth-token
TWILIO_PHONE_NUMBER=+1234567890

# File Upload (Cloudinary)
CLOUDINARY_CLOUD_NAME=your-cloudinary-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# Payment Gateway (Razorpay)
RAZORPAY_KEY_ID=your-razorpay-key-id
RAZORPAY_KEY_SECRET=your-razorpay-key-secret
```

## 📋 API Endpoints

### Health & Info
- `GET /` - Welcome message
- `GET /api/health` - Health check

### Authentication (TODO: Step 4)
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - Email login
- `POST /api/auth/phone/send-otp` - Send phone OTP
- `POST /api/auth/phone/verify-otp` - Verify phone OTP
- `GET /api/auth/me` - Get current user

### Users (TODO)
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update profile
- `POST /api/users/upload-avatar` - Upload avatar

### Properties (TODO: Step 5)
- `GET /api/properties` - List properties
- `GET /api/properties/:id` - Get property details
- `POST /api/properties` - Create property
- `PUT /api/properties/:id` - Update property
- `DELETE /api/properties/:id` - Delete property

### Bookings (TODO)
- `GET /api/bookings` - List bookings
- `POST /api/bookings` - Create booking
- `PUT /api/bookings/:id` - Update booking

### Payments (TODO)
- `POST /api/payments/create-order` - Create payment
- `POST /api/payments/verify` - Verify payment

## 🧪 Testing

```bash
# Run tests
npm test

# Test specific routes
curl -X GET http://localhost:5000/api/health
curl -X GET http://localhost:5000/api/auth/test
curl -X GET http://localhost:5000/api/properties/test
```

## 📊 Development Tools

- **Morgan** - HTTP request logging
- **Helmet** - Security headers
- **CORS** - Cross-origin resource sharing
- **Rate Limiting** - API rate limiting
- **Compression** - Response compression
- **Nodemon** - Development auto-reload

## 🔒 Security Features

- JWT authentication
- Password hashing with bcrypt
- Rate limiting
- CORS configuration
- Input validation
- Security headers with Helmet
- Error handling without exposing stack traces

## 🚀 Next Steps

1. **Step 3**: Set up Database Models
2. **Step 4**: Create Authentication System
3. **Step 5**: Build Property CRUD APIs
4. **Step 6**: Connect Frontend to Backend
5. **Step 7**: Deploy MVP

## 🐛 Troubleshooting

### Common Issues

1. **MongoDB Connection Failed**
   - Check if MongoDB is running locally
   - Verify MONGODB_URI in .env file
   - Check network connectivity for Atlas

2. **Port Already in Use**
   ```bash
   # Find process using port 5000
   netstat -ano | findstr :5000
   
   # Kill process or change PORT in .env
   ```

3. **Missing Dependencies**
   ```bash
   # Delete node_modules and reinstall
   rm -rf node_modules package-lock.json
   npm install
   ```

## 📞 Support

For issues and questions:
1. Check the error logs in console
2. Verify environment variables
3. Test API endpoints with curl or Postman
4. Check database connection

---

**Status**: ✅ Backend Structure Complete  
**Next**: Step 3 - Set up Database Models