import express from 'express';
import { simulateScenarios } from '../../controllers/scenarioController.js';

const router = express.Router();

router.post('/simulate', simulateScenarios);

export default router;
