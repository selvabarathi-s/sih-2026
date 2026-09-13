import express from 'express';
import { getAuditLogs, createAuditLog } from '../../controllers/auditController.js';
import { authenticate, requireAuth, requireRole } from '../../middleware/rbac.js';

const router = express.Router();

// Audit logs inspection is restricted to System Administrator & Security Officer
router.get('/', authenticate, requireAuth, requireRole('system_admin', 'security_officer'), getAuditLogs);
router.get('/logs', authenticate, requireAuth, requireRole('system_admin', 'security_officer'), getAuditLogs);
router.post('/log', authenticate, requireAuth, createAuditLog);

export default router;
