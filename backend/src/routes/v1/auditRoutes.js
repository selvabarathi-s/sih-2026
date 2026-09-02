import express from 'express';
import { getAuditLogs, createAuditLog } from '../../controllers/auditController.js';
import { authenticate, requireAuth, requireRole } from '../../middleware/rbac.js';

const router = express.Router();

// Audit logs inspection is strictly restricted to System Administrator
router.get('/', authenticate, requireAuth, requireRole('system_admin'), getAuditLogs);
router.post('/log', authenticate, requireAuth, createAuditLog);

export default router;
