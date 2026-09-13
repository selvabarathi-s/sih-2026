import express from 'express';
import {
  getAllDependencies,
  getProjectDependencies,
  addDependency,
  calculateCascadeImpact,
} from '../../controllers/dependencyController.js';

const router = express.Router();

router.get('/', getAllDependencies);
router.get('/projects/:id', getProjectDependencies);
router.post('/', addDependency);
router.post('/projects/:id/cascade', calculateCascadeImpact);

export default router;
