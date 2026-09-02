import express from 'express';
import { getAuditLogs, createAuditLog } from '../../controllers/auditController.js';
import { requireAuth, requirePermission } from '../../middleware/rbac.js';
import { PERMISSIONS } from '../../models/userModel.js';

const router = express.Router();

// System Admins and authorized roles can inspect audit logs
router.get('/', requireAuth, requirePermission(PERMISSIONS.INSPECT_AUDIT), getAuditLogs);
router.post('/log', requireAuth, createAuditLog);

export default router;
