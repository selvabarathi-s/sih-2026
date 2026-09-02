import { Router } from 'express';
import { listModels, getModelDetail, getModelCard, getDriftReport, getBacktest, getFeatureAvailability } from '../../controllers/modelController.js';

const router = Router();

router.get('/', listModels);
router.get('/availability', getFeatureAvailability);
router.get('/drift/report', getDriftReport);
router.get('/:id/card', getModelCard);
router.get('/:id', getModelDetail);
router.get('/:modelId/backtest', getBacktest);

export default router;
