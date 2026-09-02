import express from 'express';
import { listActions, assignAction, updateActionStatus } from '../../controllers/actionController.js';
import { authenticate, requirePermission } from '../../middleware/rbac.js';
import { PERMISSIONS } from '../../models/userModel.js';

const router = express.Router();

router.get('/', authenticate, listActions);
router.post('/assign', authenticate, requirePermission(PERMISSIONS.ASSIGN_INTERVENTIONS), assignAction);
router.patch('/:id/status', authenticate, requirePermission(PERMISSIONS.UPDATE_ACTIONS), updateActionStatus);

export default router;
