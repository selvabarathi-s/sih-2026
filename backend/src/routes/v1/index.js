import express from 'express';
import healthRoutes from './healthRoutes.js';
import authRoutes from './authRoutes.js';
import projectRoutes from './projectRoutes.js';
import portfolioRoutes from './portfolioRoutes.js';
import alertRoutes from './alertRoutes.js';
import actionRoutes from './actionRoutes.js';
import auditRoutes from './auditRoutes.js';
import notificationRoutes from './notificationRoutes.js';
import predictionRoutes from './predictionRoutes.js';
import assistantRoutes from './assistantRoutes.js';
import riskRoutes from './riskRoutes.js';
import benchmarkingRoutes from './benchmarkingRoutes.js';
import analyticsRoutes from './analyticsRoutes.js';

const router = express.Router();

// Mount sub-routers under /api/v1
router.use('/health', healthRoutes);
router.use('/auth', authRoutes);
router.use('/projects', projectRoutes);
router.use('/portfolio', portfolioRoutes);
router.use('/alerts', alertRoutes);
router.use('/actions', actionRoutes);
router.use('/audit', auditRoutes);
router.use('/notifications', notificationRoutes);
router.use('/predictions', predictionRoutes);
router.use('/assistant', assistantRoutes);
router.use('/risk', riskRoutes);
router.use('/benchmarking', benchmarkingRoutes);
router.use('/analytics', analyticsRoutes);

export default router;
