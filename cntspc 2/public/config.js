// Secure Configuration - No sensitive data exposed
const CONFIG = {
    // This setup allows for easy switching between local, Vercel, and a future custom domain.
    API_BASE: window.location.hostname === 'localhost'
        ? 'http://localhost:3000/api' // For local development
        : 'https://api.your-custom-domain.com/api', // For your future professional setup
        // : 'https://your-backend-url.vercel.app/api', // Your old Vercel URL
    
    // Public configuration only
    APP_NAME: 'ConnectSpace',
    VERSION: '1.0.0',
    FEATURES: {
        VERIFICATION: true,
        EMAIL_NOTIFICATIONS: true,
        FILE_UPLOAD: true
    },
    
    // No secrets, tokens, or sensitive data here
    VALIDATION: {
        MIN_PASSWORD_LENGTH: 8,
        MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
        ALLOWED_FILE_TYPES: ['jpg', 'jpeg', 'png', 'pdf']
    }
};

// Prevent modification
Object.freeze(CONFIG);