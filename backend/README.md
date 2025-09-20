# SpaceConnect Backend API

## Overview
Secure Node.js backend for SpaceConnect Commercial Real Estate Platform with MongoDB database.

## Features
- 🔐 JWT Authentication with account lockout
- 👥 User management (Landlords & Tenants)
- 🏢 Property CRUD operations with search
- 📧 Inquiry management system
- 📁 File upload with validation
- 🗺️ Location-based queries
- 🛡️ Security middleware (Rate limiting, CORS, Helmet)
- ✅ Input validation and sanitization

## Setup

### 1. Install Dependencies
```bash
npm install
```

### 2. Environment Variables
Create `.env` file:
```env
MONGODB_URI=mongodb://localhost:27017/spaceconnect
JWT_SECRET=your-super-secure-jwt-secret
JWT_EXPIRE=7d
PORT=5000
NODE_ENV=development
SESSION_SECRET=your-session-secret
```

### 3. Start MongoDB
```bash
# Using MongoDB Compass or local installation
mongod
```

### 4. Seed Database (Optional)
```bash
npm run seed
```

### 5. Start Server
```bash
# Development
npm run dev

# Production
npm start
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/profile` - Update profile

### Properties
- `GET /api/properties` - Search properties with filters
- `POST /api/properties` - Create property (landlord only)
- `GET /api/properties/:id` - Get property details
- `PUT /api/properties/:id` - Update property
- `DELETE /api/properties/:id` - Delete property
- `GET /api/properties/landlord/my-properties` - Get landlord's properties

### Inquiries
- `POST /api/inquiries` - Create inquiry
- `GET /api/inquiries/landlord` - Get landlord's inquiries
- `GET /api/inquiries/property/:id` - Get property inquiries
- `PUT /api/inquiries/:id/respond` - Respond to inquiry
- `GET /api/inquiries/my` - Get user's inquiries

### File Upload
- `POST /api/upload/images` - Upload property images
- `POST /api/upload/documents` - Upload documents

### Maps
- `GET /api/maps/properties` - Get properties for map view
- `GET /api/maps/nearby` - Get nearby amenities

### Users
- `GET /api/users/landlords` - Get verified landlords
- `GET /api/users/profile/:id` - Get public profile
- `GET /api/users/dashboard/stats` - Get dashboard stats

## Security Features

### Authentication
- JWT tokens with secure secrets
- Account lockout after 5 failed attempts
- Password hashing with bcrypt (12 salt rounds)
- Session management with MongoDB store

### Input Validation
- Express-validator for all inputs
- Mongoose schema validation
- File type and size validation
- SQL injection prevention

### Rate Limiting
- General API: 100 requests/15min
- Auth endpoints: 5 requests/15min
- IP-based limiting

### Security Headers
- Helmet.js for security headers
- CORS configuration
- Content Security Policy

## Database Models

### User
- Authentication & profile data
- Role-based access (landlord/tenant)
- Verification status tracking
- Security features (login attempts, lockout)

### Property
- Complete property information
- Geospatial indexing for location queries
- Media and document storage
- Verification workflow

### Inquiry
- Tenant-landlord communication
- Status tracking and responses
- Property relationship

## File Structure
```
backend/
├── models/          # Database schemas
├── routes/          # API route handlers
├── middleware/      # Authentication, validation, upload
├── utils/           # Database, JWT, seeding utilities
├── scripts/         # Database seeding scripts
├── server.js        # Main server file
└── package.json     # Dependencies and scripts
```

## Testing
```bash
npm test
```

## Production Deployment
1. Set `NODE_ENV=production`
2. Use secure JWT secrets
3. Configure MongoDB Atlas
4. Set up SSL certificates
5. Configure reverse proxy (Nginx)

## Security Checklist
- ✅ Environment variables for secrets
- ✅ Input validation and sanitization
- ✅ Rate limiting implemented
- ✅ CORS properly configured
- ✅ Password hashing with salt
- ✅ Account lockout mechanism
- ✅ File upload validation
- ✅ Error handling without data leaks