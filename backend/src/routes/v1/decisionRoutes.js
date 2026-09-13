import express from 'express';
import {
  listBriefs,
  getBrief,
  createBrief,
  issueDirective,
} from '../../controllers/decisionController.js';
import { authenticate, requireAuth, requireRole } from '../../middleware/rbac.js';

const router = express.Router();

router.get('/briefs', listBriefs);
router.get('/briefs/:id', getBrief);
router.post('/briefs', authenticate, requireAuth, createBrief);
router.post('/briefs/:id/directive', authenticate, requireAuth, requireRole('senior_decision_maker', 'data_platform_security_admin', 'system_admin'), issueDirective);

export default router;
