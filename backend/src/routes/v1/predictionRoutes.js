import express from 'express';
import { getModelRegistry } from '../../controllers/predictionController.js';

const router = express.Router();

router.get('/models', getModelRegistry);

export default router;
