import { Router } from 'express';
import { getPortfolioRisk, getRiskNetwork, getProjectRiskScore } from '../../controllers/riskController.js';

const router = Router();

router.get('/portfolio', getPortfolioRisk);
router.get('/network', getRiskNetwork);
router.get('/:projectId', getProjectRiskScore);

export default router;
