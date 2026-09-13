import express from 'express';
import {
  getProjectState,
  getStateHistory,
  getAvailableTransitions,
  transitionProjectState,
  registerProject,
  checkDuplicateProject,
} from '../../controllers/workflowController.js';

const router = express.Router();

router.get('/projects/:id/state', getProjectState);
router.get('/projects/:id/history', getStateHistory);
router.get('/projects/:id/transitions', getAvailableTransitions);
router.post('/projects/:id/transition', transitionProjectState);
router.post('/projects/register', registerProject);
router.post('/projects/check-duplicate', checkDuplicateProject);

export default router;
