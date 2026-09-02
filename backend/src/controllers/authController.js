import { authService } from '../services/authService.js';
import { auditService } from '../services/auditService.js';

export const login = async (req, res, next) => {
  try {
    const { username, password } = req.body || {};
    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password are required' });
    }

    const result = await authService.login(username, password);

    // Record audit event
    await auditService.logEvent({
      action: 'USER_LOGIN',
      userId: result.user.id,
      userRole: result.user.role,
      resourceType: 'AUTH',
      resourceId: result.user.id,
      details: { username: result.user.username, department: result.user.department },
      ipAddress: req.ip || req.connection.remoteAddress,
    });

    res.status(200).json(result);
  } catch (err) {
    res.status(401).json({ error: err.message || 'Authentication failed' });
  }
};

export const getCurrentUser = async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Not authenticated' });
    }
    res.status(200).json({ user: req.user });
  } catch (err) {
    next(err);
  }
};

export const logout = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization || req.headers['x-auth-token'];
    if (req.user) {
      await auditService.logEvent({
        action: 'USER_LOGOUT',
        userId: req.user.userId,
        userRole: req.user.role,
        resourceType: 'AUTH',
        resourceId: req.user.userId,
        details: { username: req.user.username },
        ipAddress: req.ip || req.connection.remoteAddress,
      });
    }
    await authService.logout(authHeader);
    res.status(200).json({ message: 'Logged out successfully' });
  } catch (err) {
    next(err);
  }
};

export const getRolesAndPermissions = async (req, res, next) => {
  try {
    const roles = authService.getAllRoles();
    res.status(200).json({ count: roles.length, roles });
  } catch (err) {
    next(err);
  }
};
