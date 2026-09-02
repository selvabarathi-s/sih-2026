import { Router } from 'express';
import { getDeteriorationSignals, updateSignalStatus } from '../../controllers/alertController.js';
import { requireAnyPermission } from '../../middleware/rbac.js';

const router = Router();

router.get('/signals', getDeteriorationSignals);
router.patch('/:id/status', requireAnyPermission('review:warnings', 'acknowledge:warnings', 'update:actions'), updateSignalStatus);

export default router;
