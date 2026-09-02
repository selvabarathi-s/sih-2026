import { Router } from 'express';
import { listModels, getModelDetail, getBacktest, getFeatureAvailability } from '../../controllers/modelController.js';

const router = Router();

router.get('/', listModels);
router.get('/availability', getFeatureAvailability);
router.get('/:id', getModelDetail);
router.get('/:modelId/backtest', getBacktest);

export default router;
