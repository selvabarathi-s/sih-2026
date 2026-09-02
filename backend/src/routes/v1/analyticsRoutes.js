import { Router } from 'express';
import { getOverviewAnalytics, getStateAnalytics, getSectorAnalytics } from '../../controllers/analyticsController.js';

const router = Router();

router.get('/overview', getOverviewAnalytics);
router.get('/states', getStateAnalytics);
router.get('/sectors', getSectorAnalytics);

export default router;
