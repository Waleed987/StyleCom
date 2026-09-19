const jwt = require('jsonwebtoken');

const getJwtSecret = () => process.env.JWT_SECRET || 'Testkey';

const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ 
        success: false, 
        message: 'Access denied. No token provided.' 
      });
    }

    const decoded = jwt.verify(token, getJwtSecret());
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ 
      success: false, 
      message: 'Invalid token.' 
    });
  }
};

const requireAdmin = (req, res, next) => {
  if (!req.user?.isAdmin) {
    return res.status(403).json({ success: false, message: 'Admin access required.' });
  }
  next();
};

module.exports = auth;
module.exports.requireAdmin = requireAdmin;
