import { Router } from 'express';
import { getPortfolioRisk, getRiskNetwork } from '../../controllers/riskController.js';

const router = Router();

router.get('/portfolio', getPortfolioRisk);
router.get('/network', getRiskNetwork);

export default router;
