import { authService } from '../services/authService.js';
import { ROLE_ALIASES } from '../models/userModel.js';

/**
 * Normalizes role string to canonical key (e.g. 'MONITORING_OFFICER' -> 'monitoring_officer')
 */
export const normalizeRole = (role) => {
  if (!role) return '';
  return ROLE_ALIASES[role] || ROLE_ALIASES[role.toUpperCase()] || role.toLowerCase();
};

/**
 * Authentication middleware to populate req.user from Authorization Bearer token or session header
 */
export const authenticate = async (req, res, next) => {
  const authHeader = req.headers.authorization || req.headers['x-auth-token'];
  if (!authHeader) {
    req.user = null;
    return next();
  }

  try {
    const userSession = await authService.verifyToken(authHeader);
    if (userSession) {
      userSession.canonicalRole = normalizeRole(userSession.role);
    }
    req.user = userSession;
  } catch (err) {
    req.user = null;
  }
  next();
};

/**
 * Require valid authenticated user session (401 Unauthorized)
 */
export const requireAuth = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      error: {
        code: 'UNAUTHORIZED',
        message: 'Authentication required. Please provide a valid Authorization Bearer token.',
        statusCode: 401,
      },
    });
  }
  next();
};

/**
 * Require specific user role(s) (403 Forbidden)
 */
export const requireRole = (...allowedRoles) => {
  const normalizedAllowed = allowedRoles.map(normalizeRole);
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        error: {
          code: 'UNAUTHORIZED',
          message: 'Authentication required. Please provide credentials.',
          statusCode: 401,
        },
      });
    }

    const userRole = normalizeRole(req.user.role);
    if (!normalizedAllowed.includes(userRole)) {
      return res.status(403).json({
        error: {
          code: 'FORBIDDEN',
          message: `Access forbidden: Role '${req.user.role}' is not authorized to access this resource. Required role(s): [${allowedRoles.join(', ')}]`,
          statusCode: 403,
          requiredRoles: allowedRoles,
          currentRole: req.user.role,
        },
      });
    }

    next();
  };
};

export const requireAnyRole = requireRole;

/**
 * Require ALL specific permission(s)
 */
export const requirePermission = (...requiredPermissions) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        error: {
          code: 'UNAUTHORIZED',
          message: 'Authentication required. Please provide credentials.',
          statusCode: 401,
        },
      });
    }

    const userPermissions = req.user.permissions || [];
    const hasAll = requiredPermissions.every(p => userPermissions.includes(p));

    if (!hasAll) {
      return res.status(403).json({
        error: {
          code: 'FORBIDDEN',
          message: `Access forbidden: Missing required permission(s).`,
          statusCode: 403,
          requiredPermissions,
          userPermissions,
        },
      });
    }

    next();
  };
};

/**
 * Require AT LEAST ONE permission from list
 */
export const requireAnyPermission = (...permissions) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        error: {
          code: 'UNAUTHORIZED',
          message: 'Authentication required',
          statusCode: 401,
        },
      });
    }

    const userPermissions = req.user.permissions || [];
    const hasAny = permissions.some(p => userPermissions.includes(p));

    if (!hasAny) {
      return res.status(403).json({
        error: {
          code: 'FORBIDDEN',
          message: `Access forbidden: Requires at least one permission from [${permissions.join(', ')}].`,
          statusCode: 403,
          requiredPermissions: permissions,
        },
      });
    }

    next();
  };
};

/**
 * Resource-Level Authorization:
 * If user is a Project Administrator, verifies the project is assigned to them.
 */
export const requireProjectAssignment = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      error: { code: 'UNAUTHORIZED', message: 'Authentication required', statusCode: 401 },
    });
  }

  const userRole = normalizeRole(req.user.role);
  if (userRole === 'project_admin') {
    const rawProjectId = req.params.id || req.params.projectId || req.body?.projectId || '';
    const cleanId = rawProjectId.replace(/^PAI-/i, '').trim();

    const assigned = req.user.assignedProjects || [];
    const isAssigned = assigned.some(p => {
      const cleanAssigned = p.replace(/^PAI-/i, '').trim();
      return cleanAssigned === cleanId || p === rawProjectId;
    });

    if (!isAssigned) {
      return res.status(403).json({
        error: {
          code: 'RESOURCE_FORBIDDEN',
          message: `Access denied: Project '${rawProjectId}' is not assigned to project administrator '${req.user.username}'. You may only update assigned projects.`,
          statusCode: 403,
          assignedProjects: assigned,
        },
      });
    }
  }

  next();
};
