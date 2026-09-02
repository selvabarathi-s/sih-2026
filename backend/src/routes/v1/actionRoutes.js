import express from 'express';
import { listActions, assignAction, updateActionStatus } from '../../controllers/actionController.js';
import { authenticate, requireAuth, requireRole, requireAnyRole } from '../../middleware/rbac.js';

const router = express.Router();

router.get('/', authenticate, listActions);

// Assigning intervention is strictly permitted ONLY to Monitoring Officer
router.post('/assign', authenticate, requireAuth, requireRole('monitoring_officer'), assignAction);

// Updating intervention status is restricted to Project Admin and Monitoring Officer
router.patch('/:id/status', authenticate, requireAuth, requireRole('monitoring_officer', 'project_admin'), updateActionStatus);

export default router;
