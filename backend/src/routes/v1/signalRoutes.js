import { Router } from 'express';
import { getProjectSignals } from '../../controllers/predictionController.js';

const router = Router();

router.get('/:projectId', getProjectSignals);

export default router;
