// Simple authentication middleware - no JWT required for now
// Just pass "admin" as Bearer token for authentication

const verifyToken = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Access denied. No token provided.'
      });
    }

    // Simple validation - check if token is "admin"
    if (token !== 'admin') {
      return res.status(401).json({
        success: false,
        message: 'Invalid token. Please provide "admin" as token.'
      });
    }

    // Set user info for admin
    req.user = { role: 'admin' };
    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Token verification failed.'
    });
  }
};

const isAdmin = (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Access denied. Admin privileges required.'
      });
    }
    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Admin verification failed.'
    });
  }
};

const requireAdmin = [verifyToken, isAdmin];

module.exports = {
  verifyToken,
  isAdmin,
  requireAdmin
};
