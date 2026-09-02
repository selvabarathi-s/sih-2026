import express from 'express';
import {
  login,
  getCurrentUser,
  logout,
  getRolesAndPermissions,
  listUsers,
  createUser,
  updateUserRole,
} from '../../controllers/authController.js';
import { authenticate, requireAuth, requireRole } from '../../middleware/rbac.js';

const router = express.Router();

router.post('/login', login);
router.get('/me', authenticate, getCurrentUser);
router.post('/logout', authenticate, logout);
router.get('/roles', getRolesAndPermissions);

// User Management (Strictly restricted to System Administrator)
router.get('/users', authenticate, requireAuth, requireRole('system_admin'), listUsers);
router.post('/users', authenticate, requireAuth, requireRole('system_admin'), createUser);
router.put('/users/:id/role', authenticate, requireAuth, requireRole('system_admin'), updateUserRole);

export default router;
