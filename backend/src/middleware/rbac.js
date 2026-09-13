import { authService } from '../services/authService.js';
import { ROLE_ALIASES } from '../models/userModel.js';
import { auditService, AUDIT_EVENT_TYPES } from '../services/auditService.js';

/**
 * Normalizes role string to canonical key (e.g. 'MONITORING_OFFICER' -> 'monitoring_officer')
 */
export const normalizeRole = (role) => {
  if (!role) return '';
  if (typeof role !== 'string') {
    if (Array.isArray(role)) return role.map(normalizeRole).join(',');
    return String(role);
  }
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
  const flattened = allowedRoles.flat(Infinity);
  const normalizedAllowed = flattened.map(normalizeRole);
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
      auditService.logEvent({
        action: AUDIT_EVENT_TYPES.PERMISSION_DENIED,
        actor: req.user.username,
        userId: req.user.userId || req.user.id,
        role: req.user.role,
        organization: req.user.organization,
        resource: req.originalUrl,
        actionResult: 'FAILURE',
        reason: `Role '${req.user.role}' not in permitted roles [${allowedRoles.join(', ')}]`,
      }).catch(() => {});

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
      auditService.logEvent({
        action: AUDIT_EVENT_TYPES.PERMISSION_DENIED,
        actor: req.user.username,
        userId: req.user.userId || req.user.id,
        role: req.user.role,
        organization: req.user.organization,
        resource: req.originalUrl,
        actionResult: 'FAILURE',
        reason: `Missing required permissions: [${requiredPermissions.join(', ')}]`,
      }).catch(() => {});

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
      auditService.logEvent({
        action: AUDIT_EVENT_TYPES.PERMISSION_DENIED,
        actor: req.user.username,
        userId: req.user.userId || req.user.id,
        role: req.user.role,
        organization: req.user.organization,
        resource: req.originalUrl,
        actionResult: 'FAILURE',
        reason: `Requires at least one permission from [${permissions.join(', ')}]`,
      }).catch(() => {});

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
 * Require Specific Organization Category
 */
export const requireOrganizationAccess = (...allowedCategories) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: { code: 'UNAUTHORIZED', statusCode: 401 } });
    }

    const orgCategory = req.user.organization?.category;
    if (!orgCategory || !allowedCategories.includes(orgCategory)) {
      auditService.logEvent({
        action: AUDIT_EVENT_TYPES.PERMISSION_DENIED,
        actor: req.user.username,
        userId: req.user.userId || req.user.id,
        role: req.user.role,
        organization: req.user.organization,
        resource: req.originalUrl,
        actionResult: 'FAILURE',
        reason: `Organization category '${orgCategory}' not in [${allowedCategories.join(', ')}]`,
      }).catch(() => {});

      return res.status(403).json({
        error: {
          code: 'ORGANIZATION_FORBIDDEN',
          message: `Access denied: Organization '${req.user.organization?.name || 'Unknown'}' is not authorized for this scope.`,
          statusCode: 403,
          allowedCategories,
        },
      });
    }

    next();
  };
};

/**
 * Resource-Level Authorization for Assigned Projects
 */
export const requireProjectAccess = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      error: { code: 'UNAUTHORIZED', message: 'Authentication required', statusCode: 401 },
    });
  }

  const userRole = normalizeRole(req.user.role);
  const projectScopedRoles = ['project_admin', 'contractor_rep', 'project_engineering', 'supervision_consultant'];

  if (projectScopedRoles.includes(userRole)) {
    const rawProjectId = req.params.id || req.params.projectId || req.body?.projectId || '';
    const cleanId = rawProjectId.replace(/^PAI-/i, '').trim();

    const assigned = req.user.assignedProjects || [];
    const isGlobal = assigned.some(p => p.startsWith('ALL_'));
    const isAssigned = isGlobal || assigned.some(p => {
      const cleanAssigned = p.replace(/^PAI-/i, '').trim();
      return cleanAssigned === cleanId || p === rawProjectId;
    });

    if (!isAssigned && rawProjectId) {
      auditService.logEvent({
        action: AUDIT_EVENT_TYPES.PERMISSION_DENIED,
        actor: req.user.username,
        userId: req.user.userId || req.user.id,
        role: req.user.role,
        organization: req.user.organization,
        resource: rawProjectId,
        actionResult: 'FAILURE',
        reason: `Project '${rawProjectId}' is not assigned to '${req.user.username}'`,
      }).catch(() => {});

      return res.status(403).json({
        error: {
          code: 'RESOURCE_FORBIDDEN',
          message: `Access denied: Project '${rawProjectId}' is not assigned to officer '${req.user.username}'. You may only update assigned projects.`,
          statusCode: 403,
          assignedProjects: assigned,
        },
      });
    }
  }

  next();
};

export const requireProjectAssignment = requireProjectAccess;

/**
 * Enforce Governed Workflow State Transitions
 */
export const requireWorkflowTransition = (entityType, fromState, toState) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: { code: 'UNAUTHORIZED', statusCode: 401 } });
    }

    const userRole = normalizeRole(req.user.role);

    // E.g., Contractors cannot verify or close NCRs
    if (entityType === 'NCR' && (toState === 'CLOSED' || toState === 'TPI_LAB_VERIFIED')) {
      if (userRole === 'contractor_rep') {
        auditService.logEvent({
          action: AUDIT_EVENT_TYPES.PERMISSION_DENIED,
          actor: req.user.username,
          userId: req.user.userId || req.user.id,
          role: req.user.role,
          organization: req.user.organization,
          resource: req.params.id || 'NCR',
          actionResult: 'FAILURE',
          reason: 'Contractors cannot approve or close their own non-conformance records',
        }).catch(() => {});

        return res.status(403).json({
          error: {
            code: 'WORKFLOW_TRANSITION_FORBIDDEN',
            message: 'Contractor representatives cannot verify or close Non-Conformance Records. Independent TPI sign-off required.',
            statusCode: 403,
          },
        });
      }
    }

    next();
  };
};
