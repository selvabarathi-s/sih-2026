import { Router } from 'express';
import { getProjectAnomalies } from '../../controllers/predictionController.js';

const router = Router();

router.get('/:projectId', getProjectAnomalies);

export default router;
