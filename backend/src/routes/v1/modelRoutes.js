import { Router } from 'express';
import {
  listModels,
  getModelDetail,
  getModelCard,
  getDriftReport,
  getBacktest,
  approveModel,
  signoffDrift,
} from '../../controllers/modelController.js';
import { authenticate, requireAuth, requireRole } from '../../middleware/rbac.js';

const router = Router();

router.get('/', listModels);
router.get('/drift/report', getDriftReport);
router.get('/:id/card', getModelCard);
router.get('/:id', getModelDetail);
router.get('/:modelId/backtest', getBacktest);

// Governed Model Approvals (Restricted to AI Governance Approver & System Admin)
router.post('/:id/approve', authenticate, requireAuth, requireRole('ai_governance', 'system_admin'), approveModel);
router.post('/drift/signoff', authenticate, requireAuth, requireRole('ai_governance', 'system_admin'), signoffDrift);

export default router;
