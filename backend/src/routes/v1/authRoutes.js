import express from 'express';
import {
  login,
  getCurrentUser,
  logout,
  getRolesAndPermissions,
  listUsers,
  createUser,
  updateUserRole,
  forgotPassword,
  resetPassword,
  switchWorkspace,
  switchRole,
  getOrganizations,
} from '../../controllers/authController.js';
import { authenticate, requireAuth, requireRole } from '../../middleware/rbac.js';

const router = express.Router();

router.post('/login', login);
router.get('/me', authenticate, getCurrentUser);
router.post('/logout', authenticate, logout);
router.get('/roles', getRolesAndPermissions);
router.get('/organizations', getOrganizations);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);
router.post('/switch-workspace', authenticate, requireAuth, switchWorkspace);
router.post('/switch-role', authenticate, requireAuth, switchRole);

// User Management (Strictly restricted to System / Platform Administrator)
router.get('/users', authenticate, requireAuth, requireRole('data_platform_security_admin', 'system_admin'), listUsers);
router.post('/users', authenticate, requireAuth, requireRole('data_platform_security_admin', 'system_admin'), createUser);
router.put('/users/:id/role', authenticate, requireAuth, requireRole('data_platform_security_admin', 'system_admin'), updateUserRole);

export default router;
