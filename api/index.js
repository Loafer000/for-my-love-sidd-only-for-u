// Vercel-optimized server for ConnectSpace
const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();

// Middleware
app.use(cors({
    origin: [
        'http://localhost:3000',
        'https://connectspace-trial.vercel.app',
        'https://connectspace.vercel.app',
        'https://your-custom-domain.com'
    ],
    credentials: true
}));

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.status(200).json({ 
        status: 'healthy', 
        timestamp: new Date().toISOString(),
        service: 'ConnectSpace Backend',
        version: '2.0.0',
        platform: 'Vercel'
    });
});

// Serve static files from public directory
app.use(express.static(path.join(__dirname, 'public')));

// API Routes - Load conditionally for Vercel serverless
if (process.env.NODE_ENV !== 'frontend-only') {
    try {
        // Import routes only if backend modules exist
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
        
        // Fallback API routes for demo purposes
        app.get('/api/properties', (req, res) => {
            res.json({ 
                success: true, 
                message: 'Properties API - Frontend Demo Mode',
                data: []
            });
        });
        
        app.get('/api/auth/status', (req, res) => {
            res.json({ 
                success: true, 
                message: 'Auth API - Frontend Demo Mode',
                authenticated: false
            });
        });
    }
}

// Catch-all handler for SPA routing
app.get('*', (req, res) => {
    // For Vercel, serve index.html for all non-API routes
    if (!req.path.startsWith('/api/')) {
        res.sendFile(path.join(__dirname, 'public', 'index.html'));
    } else {
        res.status(404).json({ error: 'API endpoint not found' });
    }
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Error:', err.stack);
    res.status(500).json({ 
        error: 'Something went wrong!',
        message: process.env.NODE_ENV === 'production' ? 'Internal server error' : err.message
    });
});

// Export for Vercel serverless functions
module.exports = app;

// Start server for local development
if (require.main === module) {
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
        console.log(`🚀 ConnectSpace server running on port ${PORT}`);
        console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
        console.log(`🌐 Environment: ${process.env.NODE_ENV || 'development'}`);
        console.log(`☁️ Platform: Vercel-ready`);
    });
}