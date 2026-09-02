import express from 'express';
import { listProjects, getProjectById, getProjectHistory } from '../../controllers/projectController.js';

const router = express.Router();

router.get('/', listProjects);
router.get('/:id', getProjectById);
router.get('/:id/history', getProjectHistory);

export default router;
