import { Router } from 'express';
import { getProjectPredictions, getProjectPrescription } from '../../controllers/predictionController.js';

const router = Router();

router.get('/:projectId', getProjectPredictions);
router.get('/:projectId/prescription', getProjectPrescription);

export default router;
