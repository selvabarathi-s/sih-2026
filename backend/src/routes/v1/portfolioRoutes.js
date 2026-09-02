import express from 'express';
import { getPortfolioSummary, getSectorBreakdown } from '../../controllers/portfolioController.js';

const router = express.Router();

router.get('/summary', getPortfolioSummary);
router.get('/sectors', getSectorBreakdown);

export default router;
