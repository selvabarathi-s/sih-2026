import express from 'express';
import { login, getCurrentUser, logout, getRolesAndPermissions } from '../../controllers/authController.js';
import { authenticate } from '../../middleware/rbac.js';

const router = express.Router();

router.post('/login', login);
router.get('/me', authenticate, getCurrentUser);
router.post('/logout', authenticate, logout);
router.get('/roles', getRolesAndPermissions);

export default router;
