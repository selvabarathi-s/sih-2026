import express from 'express';
import { getDeteriorationSignals, getCompositeWarnings, updateSignalStatus } from '../../controllers/alertController.js';
import { authenticate, requireAuth, requireRole } from '../../middleware/rbac.js';

const router = express.Router();

router.get('/', getDeteriorationSignals);
router.get('/signals', getDeteriorationSignals);
router.get('/composite', getCompositeWarnings);
router.patch('/:id/status', authenticate, requireAuth, updateSignalStatus);

export default router;
