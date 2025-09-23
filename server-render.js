// Health check endpoint for Render
const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors({
    origin: [
        'http://localhost:3000',
        'https://connectspace-trial.netlify.app',
        'https://your-render-app.onrender.com',
        'https://connectspace.onrender.com'
    ],
    credentials: true
}));

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Health check endpoint (required by Render)
app.get('/api/health', (req, res) => {
    res.status(200).json({ 
        status: 'healthy', 
        timestamp: new Date().toISOString(),
        service: 'ConnectSpace Backend',
        version: '1.0.0'
    });
});

// Serve static files from public directory
app.use(express.static(path.join(__dirname, 'public')));

// API Routes
if (process.env.NODE_ENV !== 'frontend-only') {
    try {
        // Import routes only if not in frontend-only mode
        const authRoutes = require('./backend/routes/auth');
        const propertyRoutes = require('./backend/routes/properties');
        const inquiryRoutes = require('./backend/routes/inquiries');
        const uploadRoutes = require('./backend/routes/upload');
        const userRoutes = require('./backend/routes/users');
        const mapRoutes = require('./backend/routes/maps');
        const paymentRoutes = require('./backend/routes/payments');

        // Use routes
        app.use('/api/auth', authRoutes);
        app.use('/api/properties', propertyRoutes);
        app.use('/api/inquiries', inquiryRoutes);
        app.use('/api/upload', uploadRoutes);
        app.use('/api/users', userRoutes);
        app.use('/api/maps', mapRoutes);
        app.use('/api/payments', paymentRoutes);

        console.log('✅ All API routes loaded successfully');
    } catch (error) {
        console.log('⚠️ Running in frontend-only mode:', error.message);
    }
}

// Catch-all handler: send back React's index.html file for SPA routing
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Error:', err.stack);
    res.status(500).json({ 
        error: 'Something went wrong!',
        message: process.env.NODE_ENV === 'production' ? 'Internal server error' : err.message
    });
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 ConnectSpace server running on port ${PORT}`);
    console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
    console.log(`🌐 Environment: ${process.env.NODE_ENV || 'development'}`);
});

module.exports = app;