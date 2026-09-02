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
import modelRoutes from './modelRoutes.js';
import signalRoutes from './signalRoutes.js';
import anomalyRoutes from './anomalyRoutes.js';

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
router.use('/models', modelRoutes);
router.use('/signals', signalRoutes);
router.use('/anomalies', anomalyRoutes);
router.use('/backtests', modelRoutes);
router.use('/features', modelRoutes);

export default router;
