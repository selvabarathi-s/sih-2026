import express from 'express';
import healthRoutes from './healthRoutes.js';
import projectRoutes from './projectRoutes.js';
import portfolioRoutes from './portfolioRoutes.js';
import alertRoutes from './alertRoutes.js';
import predictionRoutes from './predictionRoutes.js';
import assistantRoutes from './assistantRoutes.js';

const router = express.Router();

// Mount sub-routers under /api/v1
router.use('/health', healthRoutes);
router.use('/projects', projectRoutes);
router.use('/portfolio', portfolioRoutes);
router.use('/alerts', alertRoutes);
router.use('/predictions', predictionRoutes);
router.use('/assistant', assistantRoutes);

export default router;
