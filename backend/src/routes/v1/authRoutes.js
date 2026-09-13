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
} from '../../controllers/authController.js';
import { authenticate, requireAuth, requireRole } from '../../middleware/rbac.js';

const router = express.Router();

router.post('/login', login);
router.get('/me', authenticate, getCurrentUser);
router.post('/logout', authenticate, logout);
router.get('/roles', getRolesAndPermissions);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);
router.post('/switch-workspace', authenticate, requireAuth, switchWorkspace);

// User Management (Strictly restricted to System Administrator)
router.get('/users', authenticate, requireAuth, requireRole('system_admin'), listUsers);
router.post('/users', authenticate, requireAuth, requireRole('system_admin'), createUser);
router.put('/users/:id/role', authenticate, requireAuth, requireRole('system_admin'), updateUserRole);

export default router;
