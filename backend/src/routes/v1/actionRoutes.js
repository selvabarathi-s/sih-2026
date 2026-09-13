import express from 'express';
import {
  listActions,
  assignAction,
  updateActionStatus,
  getEffectivenessBenchmarks,
  recordInterventionOutcome,
} from '../../controllers/actionController.js';
import { authenticate, requireAuth, requireRole } from '../../middleware/rbac.js';

const router = express.Router();

router.get('/', authenticate, listActions);
router.get('/effectiveness', getEffectivenessBenchmarks);

// Assigning intervention is strictly permitted ONLY to Monitoring Officer
router.post('/assign', authenticate, requireAuth, requireRole('monitoring_officer'), assignAction);

// Updating intervention status is restricted to Project Admin and Monitoring Officer
router.patch('/:id/status', authenticate, requireAuth, requireRole('monitoring_officer', 'project_admin'), updateActionStatus);

// Record closed-loop intervention outcome
router.post('/outcomes', authenticate, requireAuth, requireRole('monitoring_officer', 'system_admin'), recordInterventionOutcome);

export default router;
