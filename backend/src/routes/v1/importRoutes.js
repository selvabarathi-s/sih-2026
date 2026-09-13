import express from 'express';
import {
  getImportTemplates,
  saveImportTemplate,
  previewImport,
  commitImport,
  getImportHistory,
} from '../../controllers/importController.js';
import { authenticate, requireAuth, requireAnyRole } from '../../middleware/rbac.js';

const router = express.Router();

router.use(authenticate);

// Publicly authenticated access for templates & history
router.get('/templates', requireAuth, getImportTemplates);
router.get('/history', requireAuth, getImportHistory);

// Governed operations: System Admins, Data Officers, Monitoring Officers, Risk Analysts
router.post('/templates', requireAnyRole(['system_admin', 'SYSTEM_ADMIN', 'data_officer', 'DATA_OFFICER', 'monitoring_officer', 'MONITORING_OFFICER']), saveImportTemplate);
router.post('/preview', requireAnyRole(['system_admin', 'SYSTEM_ADMIN', 'data_officer', 'DATA_OFFICER', 'monitoring_officer', 'MONITORING_OFFICER', 'risk_analyst', 'DATA_ANALYST']), previewImport);
router.post('/:batchId/commit', requireAnyRole(['system_admin', 'SYSTEM_ADMIN', 'data_officer', 'DATA_OFFICER', 'monitoring_officer', 'MONITORING_OFFICER']), commitImport);

export default router;
