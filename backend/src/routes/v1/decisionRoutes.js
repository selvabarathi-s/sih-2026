import express from 'express';
import {
  listBriefs,
  getBrief,
  createBrief,
  issueDirective,
} from '../../controllers/decisionController.js';
import { authenticate, requireAuth, requireRole } from '../../middleware/rbac.js';

const router = express.Router();

router.get('/briefs', authenticate, listBriefs);
router.get('/briefs/:id', authenticate, getBrief);

// Briefs can be prepared by Monitoring Officers, Senior Decision Makers, and Security Admins
router.post('/briefs', authenticate, requireAuth, requireRole('monitoring_officer', 'senior_decision_maker', 'data_platform_security_admin'), createBrief);
// Directives strictly restricted to Senior Decision Maker and Platform Admin
router.post('/briefs/:id/directive', authenticate, requireAuth, requireRole('senior_decision_maker', 'data_platform_security_admin'), issueDirective);

export default router;
