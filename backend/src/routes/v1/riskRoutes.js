import { Router } from 'express';
import { getPortfolioRisk, getRiskNetwork } from '../../controllers/riskController.js';
import { getProjectRisk } from '../../controllers/predictionController.js';

const router = Router();

router.get('/portfolio', getPortfolioRisk);
router.get('/network', getRiskNetwork);
router.get('/:projectId', getProjectRisk);

export default router;
