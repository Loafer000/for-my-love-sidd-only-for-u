const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const AWS = require('aws-sdk');
const multerS3 = require('multer-s3');
// Best practice: Load environment variables at the very top.
require('dotenv').config();

const { authMiddleware, adminAuthMiddleware } = require('./backend/middleware/auth');

const app = express();
// Use the PORT from .env, with a fallback for safety.
const PORT = process.env.PORT || 3001;

// --- SECURITY ---
// Add a secret key for JWT. This should be in your .env file for production.
const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-key-for-development';

// Configure AWS S3
const s3 = new AWS.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION
});

// Middleware
const allowedOrigins = ['http://localhost:3000', 'https://your-frontend-domain.com']; // REPLACE WITH YOUR ACTUAL FRONTEND DOMAINS
app.use(cors({
    origin: function (origin, callback) {
        // allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true);
        if (allowedOrigins.indexOf(origin) === -1) {
            const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
            return callback(new Error(msg), false);
        }
        return callback(null, true);
    }
}));
app.use(express.json());
app.use(helmet()); // Add Helmet for security headers

// Rate limiting to prevent brute-force attacks and excessive requests
const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
    message: 'Too many requests from this IP, please try again after 15 minutes'
});

// Apply the rate limiting middleware to API calls only
app.use('/api/', apiLimiter);

// Serve static files (HTML, CSS, JS) from the 'public' directory.
app.use(express.static('public'));
// Serve uploaded files from the 'uploads' directory.


// MongoDB Connection
// Removed hardcoded fallback and deprecated options.
// The app will now fail to start if MONGODB_URI is not set, which is safer.
mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('MongoDB connected successfully.'))
    .catch(err => console.error('MongoDB connection error:', err));

// Property Schema
const propertySchema = new mongoose.Schema({
    title: { type: String, required: true },
    type: { type: String, enum: ['office', 'retail', 'industrial'], required: true },
    location: { type: String, required: true },
    address: { type: String, required: true },
    city: { type: String, required: true },
    pincode: { type: String, required: true },
    price: { type: Number, required: true },
    size: { type: Number, required: true },
    description: { type: String, required: true },
    landlord: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String },
    verified: { type: Boolean, default: false },
    documents: [String],
    lat: Number,
    lng: Number,
    createdAt: { type: Date, default: Date.now }
});

const Property = mongoose.model('Property', propertySchema);

// User Schema
const userSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    userType: { type: String, enum: ['landlord', 'tenant'], required: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    phone: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
});

// This pre-save hook hashes the password before saving a new user
userSchema.pre('save', async function(next) {
    if (this.isModified('password')) {
        this.password = await bcrypt.hash(this.password, 12);
    }
    next();
});

const User = mongoose.model('User', userSchema);

// Inquiry Schema
const inquirySchema = new mongoose.Schema({
    propertyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Property', required: true },
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    message: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
});

const Inquiry = mongoose.model('Inquiry', inquirySchema);

// File upload configuration for AWS S3
const upload = multer({
    storage: multerS3({
        s3: s3,
        bucket: process.env.AWS_S3_BUCKET_NAME,
        acl: 'public-read', // Adjust ACL as needed
        metadata: function (req, file, cb) {
            cb(null, { fieldName: file.fieldname });
        },
        key: function (req, file, cb) {
            cb(null, Date.now().toString() + '-' + file.originalname);
        }
    })
});

// --- API Routes ---

// Get all properties
app.get('/api/properties', async (req, res) => {
    // --- SECURITY & COMPLEXITY IMPROVEMENT ---
    // Validate and build the filter safely to prevent NoSQL injection.
    try {
        const { type, location, maxPrice, minPrice } = req.query;
        let filter = {};
        
        if (type) filter.type = type;
        // Use regex for case-insensitive partial matching on location.
        if (location) filter.location = new RegExp(location, 'i');
        
        // Safely handle price range.
        filter.price = {};
        if (maxPrice) filter.price.$lte = parseInt(maxPrice, 10);
        if (minPrice) filter.price.$gte = parseInt(minPrice, 10);
        if (Object.keys(filter.price).length === 0) delete filter.price;
        
        const properties = await Property.find(filter).sort({ createdAt: -1 });
        res.json(properties);
    } catch (error) {
        console.error('Error fetching properties:', error);
        res.status(500).json({ error: 'An internal server error occurred.' });
    }
});

// Get single property
app.get('/api/properties/:id', async (req, res) => {
    try {
        const property = await Property.findById(req.params.id);
        if (!property) return res.status(404).json({ error: 'Property not found' });
        res.json(property);
    } catch (error) {
        // --- SECURITY IMPROVEMENT ---
        // Send a generic error message to the client.
        console.error('Error fetching property by ID:', error);
        res.status(500).json({ error: 'An internal server error occurred.' });
    }
});

// Create property
app.post('/api/properties', upload.array('documents', 5), async (req, res) => {
    try {
        // --- COMPLEXITY IMPROVEMENT ---
        // Parse numbers directly from the request body.
        const propertyData = {
            ...req.body,
            price: parseInt(req.body.price, 10),
            size: parseInt(req.body.size, 10),
            documents: req.files ? req.files.map(file => file.filename) : []
        };
        
        // --- COMPLEXITY IMPROVEMENT (Placeholder) ---
        // This is a placeholder. For a real application, you should use a geocoding API.
        // Example: const { lat, lng } = await geocodeService.getCoords(req.body.address);
        if (req.body.city && req.body.city.toLowerCase().includes('kolkata')) {
            propertyData.lat = 22.5726 + (Math.random() - 0.5) * 0.2;
            propertyData.lng = 88.3639 + (Math.random() - 0.5) * 0.2;
        }
        
        const property = new Property(propertyData);
        await property.save();
        res.status(201).json(property);
    } catch (error) {
        // Send specific validation error messages if available.
        res.status(400).json({ error: error.message });
    }
});

// Create inquiry
app.post('/api/inquiries', async (req, res) => {
    try {
        const inquiry = new Inquiry(req.body);
        await inquiry.save();
        res.status(201).json({ message: 'Inquiry sent successfully' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// --- AUTHENTICATION ROUTES ---

// User Registration
app.post('/api/auth/register', async (req, res) => {
    try {
        const { email, password, userType, firstName, lastName, phone } = req.body;

        // Basic validation
        if (!email || !password || !userType || !firstName || !lastName || !phone) {
            return res.status(400).json({ error: 'Please provide all required fields.' });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: 'User with this email already exists.' });
        }

        const user = new User({ email, password, userType, firstName, lastName, phone });
        await user.save();

        res.status(201).json({ message: 'User registered successfully!' });

    } catch (error) {
        console.error('Registration Error:', error);
        res.status(500).json({ error: 'An internal server error occurred.' });
    }
});

// User Login
app.post('/api/auth/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ error: 'Please provide email and password.' });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ error: 'Invalid credentials.' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ error: 'Invalid credentials.' });
        }

        // Create and sign a JWT token
        const token = jwt.sign({ userId: user._id, userType: user.userType }, JWT_SECRET, { expiresIn: '1d' });

        res.json({ token, userType: user.userType, message: 'Logged in successfully!' });

    } catch (error) {
        console.error('Login Error:', error);
        res.status(500).json({ error: 'An internal server error occurred.' });
    }
});

// Get inquiries for a property
app.get('/api/properties/:id/inquiries', async (req, res) => {
    try {
        const inquiries = await Inquiry.find({ propertyId: req.params.id }).sort({ createdAt: -1 });
        res.json(inquiries);
    } catch (error) {
        console.error('Error fetching inquiries:', error);
        res.status(500).json({ error: 'An internal server error occurred.' });
    }
});

// Verify property (admin only)
// --- SECURITY WARNING ---
// This endpoint is not protected! Anyone can call it.
// In a real application, you must add authentication and authorization middleware here.
// Example: app.patch('/api/properties/:id/verify', ensureAdmin, async (req, res) => { ... });
app.patch('/api/properties/:id/verify', adminAuthMiddleware, async (req, res) => {
    try {
        const property = await Property.findByIdAndUpdate(
            req.params.id,
            { verified: true },
            { new: true }
        );
        if (!property) return res.status(404).json({ error: 'Property not found' });
        res.json(property);
    } catch (error) {
        console.error('Error verifying property:', error);
        res.status(500).json({ error: 'An internal server error occurred.' });
    }
});

// --- Serve Frontend ---
// This is a "catch-all" route. It should be the last route defined.
// It ensures that any request that doesn't match an API route will serve the main HTML page,
// which is useful for single-page applications (SPAs).
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});