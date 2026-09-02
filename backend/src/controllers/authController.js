import { authService } from '../services/authService.js';
import { auditService } from '../services/auditService.js';
import { SEED_USERS } from '../models/userModel.js';

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
      ipAddress: req.ip || req.connection?.remoteAddress || '127.0.0.1',
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
        userId: req.user.userId || req.user.id,
        userRole: req.user.role,
        resourceType: 'AUTH',
        resourceId: req.user.userId || req.user.id,
        details: { username: req.user.username },
        ipAddress: req.ip || req.connection?.remoteAddress || '127.0.0.1',
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

export const listUsers = async (req, res, next) => {
  try {
    const users = SEED_USERS.map(u => ({
      id: u.id,
      username: u.username,
      fullName: u.fullName,
      email: u.email,
      role: u.role,
      department: u.department,
      designation: u.designation,
      assignedProjects: u.assignedProjects || [],
      status: 'ACTIVE',
    }));
    res.status(200).json({ count: users.length, users });
  } catch (err) {
    next(err);
  }
};

export const createUser = async (req, res, next) => {
  try {
    const { username, fullName, email, role, department, designation } = req.body;
    if (!username || !role) {
      return res.status(400).json({ error: 'Username and role are required' });
    }

    const newUser = {
      id: `usr-${Date.now()}`,
      username: username.toLowerCase().trim(),
      passwordHash: `${username.toLowerCase().trim()}123`,
      fullName: fullName || username,
      email: email || `${username}@gov.in`,
      role,
      department: department || 'General Administration',
      designation: designation || 'Officer',
    };

    SEED_USERS.push(newUser);

    await auditService.logEvent({
      action: 'USER_CREATED',
      userId: req.user?.userId || 'sysadmin',
      userRole: req.user?.role || 'system_admin',
      resourceType: 'USER',
      resourceId: newUser.id,
      details: { username: newUser.username, role: newUser.role },
      ipAddress: req.ip || '127.0.0.1',
    });

    res.status(201).json({ message: 'User created successfully', user: newUser });
  } catch (err) {
    next(err);
  }
};

export const updateUserRole = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { newRole } = req.body;
    const user = SEED_USERS.find(u => u.id === id || u.username === id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const oldRole = user.role;
    user.role = newRole;

    await auditService.logEvent({
      action: 'ROLE_MODIFIED',
      userId: req.user?.userId || 'sysadmin',
      userRole: req.user?.role || 'system_admin',
      resourceType: 'USER',
      resourceId: user.id,
      details: { username: user.username, oldRole, newRole },
      ipAddress: req.ip || '127.0.0.1',
    });

    res.status(200).json({ message: 'Role updated successfully', user });
  } catch (err) {
    next(err);
  }
};
