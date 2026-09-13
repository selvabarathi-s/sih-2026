import express from 'express';
import { submitOverride, getOverrides } from '../../controllers/overrideController.js';
import { authenticate, requireAuth, requireAnyRole } from '../../middleware/rbac.js';

const router = express.Router();

router.get('/projects/:id', getOverrides);
router.get('/:id', getOverrides);

// Overrides require authenticated session and monitoring/admin role
router.post(
  '/',
  authenticate,
  requireAuth,
  requireAnyRole('monitoring_officer', 'system_admin', 'senior_decision_maker'),
  submitOverride
);

router.post(
  '/:id',
  authenticate,
  requireAuth,
  requireAnyRole('monitoring_officer', 'system_admin', 'senior_decision_maker'),
  submitOverride
);

router.post(
  '/projects/:id',
  authenticate,
  requireAuth,
  requireAnyRole('monitoring_officer', 'system_admin', 'senior_decision_maker'),
  submitOverride
);

export default router;
