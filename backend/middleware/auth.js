import jwt from 'jsonwebtoken';
import User from '../models/User.js';

/**
 * Protect routes - Verify JWT token
 * Middleware to check if user is authenticated
 */
export const protect = async (req, res, next) => {
  let token;

  // Check for token in headers or cookies
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    // Get token from Bearer token in header
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies.token) {
    // Get token from cookie
    token = req.cookies.token;
  }

  // Make sure token exists
  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'غير مصرح لك بالدخول إلى هذا المسار'
    });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Get user from token
    req.user = await User.findById(decoded.id).select('-password');

    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'المستخدم غير موجود'
      });
    }

    // Check if user is active
    if (!req.user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'هذا الحساب معطل'
      });
    }

    next();
  } catch (err) {
    console.error('Auth middleware error:', err);
    return res.status(401).json({
      success: false,
      message: 'غير مصرح لك بالدخول - رمز غير صالح'
    });
  }
};

/**
 * Authorize roles
 * Middleware to check if user has required role
 * @param  {...String} roles - Allowed roles
 */
export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `دور المستخدم ${req.user.role} غير مصرح له بالوصول إلى هذا المسار`
      });
    }
    next();
  };
};

/**
 * Check specific permission
 * More granular permission checking
 * @param {String} permission - Required permission
 */
export const checkPermission = (permission) => {
  return async (req, res, next) => {
    try {
      const hasPermission = await User.hasPermission(req.user.id, permission);
      
      if (!hasPermission) {
        return res.status(403).json({
          success: false,
          message: 'ليس لديك صلاحية للقيام بهذا الإجراء'
        });
      }
      
      next();
    } catch (error) {
      console.error('Permission check error:', error);
      return res.status(500).json({
        success: false,
        message: 'خطأ في التحقق من الصلاحيات'
      });
    }
  };
};

/**
 * Admin only middleware
 * Allows only admin role
 */
export const adminOnly = authorize('admin');
