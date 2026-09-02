import express from 'express';
import { listProjects, getProjectById, getProjectHistory } from '../../controllers/projectController.js';
import { updateProjectProgress } from '../../controllers/actionController.js';
import { authenticate, requirePermission } from '../../middleware/rbac.js';
import { PERMISSIONS } from '../../models/userModel.js';

const router = express.Router();

router.get('/', listProjects);
router.get('/:id', getProjectById);
router.get('/:id/history', getProjectHistory);

// Dynamic project update by Project Administrator
router.post('/:id/update', authenticate, requirePermission(PERMISSIONS.UPDATE_PROGRESS), updateProjectProgress);

export default router;
