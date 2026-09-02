import { authService } from '../services/authService.js';

/**
 * Authentication middleware to populate req.user
 */
export const authenticate = async (req, res, next) => {
  const authHeader = req.headers.authorization || req.headers['x-auth-token'];
  if (!authHeader) {
    req.user = null;
    return next();
  }

  try {
    const userSession = await authService.verifyToken(authHeader);
    req.user = userSession;
  } catch (err) {
    req.user = null;
  }
  next();
};

/**
 * Require valid authenticated user session
 */
export const requireAuth = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      error: {
        message: 'Authentication required. Please provide a valid Authorization Bearer token.',
        statusCode: 401,
      },
    });
  }
  next();
};

/**
 * Require specific user role(s)
 */
export const requireRole = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        error: {
          message: 'Authentication required',
          statusCode: 401,
        },
      });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        error: {
          message: `Access forbidden: Role '${req.user.role}' is not authorized to access this resource. Allowed roles: [${allowedRoles.join(', ')}]`,
          statusCode: 403,
          requiredRoles: allowedRoles,
          currentRole: req.user.role,
        },
      });
    }

    next();
  };
};

/**
 * Require specific permission(s)
 */
export const requirePermission = (...requiredPermissions) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        error: {
          message: 'Authentication required',
          statusCode: 401,
        },
      });
    }

    const userPermissions = req.user.permissions || [];
    const hasAll = requiredPermissions.every(p => userPermissions.includes(p));

    if (!hasAll) {
      return res.status(403).json({
        error: {
          message: `Access forbidden: Missing required permission(s).`,
          statusCode: 403,
          requiredPermissions,
        },
      });
    }

    next();
  };
};
