const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-key-for-development';

const authMiddleware = (req, res, next) => {
    // Get token from header
    const token = req.header('x-auth-token');

    // Check if not token
    if (!token) {
        return res.status(401).json({ msg: 'No token, authorization denied' });
    }

    // Verify token
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded; // Attach user payload to the request object
        next();
    } catch (err) {
        res.status(401).json({ msg: 'Token is not valid' });
    }
};

const adminAuthMiddleware = (req, res, next) => {
    // First, ensure the user is authenticated
    authMiddleware(req, res, () => {
        // Then, check if the authenticated user is an admin
        if (req.user && req.user.userType === 'landlord') { // Assuming 'landlord' is the admin equivalent
            next();
        } else {
            res.status(403).json({ msg: 'Access denied: Not an admin' });
        }
    });
};

module.exports = { authMiddleware, adminAuthMiddleware };
