import express from 'express';
import { listProjects, getProjectById, getProjectHistory } from '../../controllers/projectController.js';
import { updateProjectProgress } from '../../controllers/actionController.js';
import { authenticate, requireAuth, requireAnyPermission, requireProjectAssignment } from '../../middleware/rbac.js';
import { PERMISSIONS } from '../../models/userModel.js';

const router = express.Router();

router.get('/', listProjects);
router.get('/:id', getProjectById);
router.get('/:id/history', getProjectHistory);

// Dynamic project update strictly restricted to Project Administrator assigned to the project
router.post(
  '/:id/update',
  authenticate,
  requireAuth,
  requireAnyPermission(PERMISSIONS.PROGRESS_UPDATE, 'update:progress'),
  requireProjectAssignment,
  updateProjectProgress
);

export default router;
