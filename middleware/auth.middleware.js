import jwt from 'jsonwebtoken';

export const authenticate = (req, res, next) => {
  try {
    // Get token from header
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ message: 'No token, authorization denied' });
    }
    
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    
    // Add user id to request
    req.userId = decoded.id;
    req.userRole = decoded.role;
    
    next();
  } catch (error) {
    res.status(401).json({ message: 'Token is not valid' });
  }
};

export const isAdmin = (req, res, next) => {
  if (req.userRole !== 'admin') {
    return res.status(403).json({ message: 'Access denied, admin role required' });
  }
  
  next();
};