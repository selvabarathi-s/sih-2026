import express from 'express';
import { getDemoState, setDemoStep, resetDemo } from '../../controllers/demoController.js';

const router = express.Router();

router.get('/state', getDemoState);
router.post('/step/:step', setDemoStep);
router.post('/reset', resetDemo);

export default router;
