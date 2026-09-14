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
import asOfRoutes from './asOfRoutes.js';
import scenarioRoutes from './scenarioRoutes.js';
import overrideRoutes from './overrideRoutes.js';
import qualityRoutes from './qualityRoutes.js';
import demoRoutes from './demoRoutes.js';
import referenceRoutes from './referenceRoutes.js';
import workflowRoutes from './workflowRoutes.js';
import monitoringRoutes from './monitoringRoutes.js';
import caseRoutes from './caseRoutes.js';
import decisionRoutes from './decisionRoutes.js';
import dependencyRoutes from './dependencyRoutes.js';
import inboxRoutes from './inboxRoutes.js';
import systemRoutes from './systemRoutes.js';
import importRoutes from './importRoutes.js';
import translationRoutes from './translationRoutes.js';

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

// Advanced P0/P1 Intelligence Routers
router.use('/as-of', asOfRoutes);
router.use('/scenarios', scenarioRoutes);
router.use('/overrides', overrideRoutes);
router.use('/quality', qualityRoutes);
router.use('/demo', demoRoutes);

// Operational Government Workflow Routers
router.use('/reference', referenceRoutes);
router.use('/workflow', workflowRoutes);
router.use('/monitoring', monitoringRoutes);
router.use('/cases', caseRoutes);
router.use('/decisions', decisionRoutes);
router.use('/dependencies', dependencyRoutes);
router.use('/inbox', inboxRoutes);
router.use('/system', systemRoutes);
router.use('/imports', importRoutes);
router.use('/translate', translationRoutes);

export default router;
