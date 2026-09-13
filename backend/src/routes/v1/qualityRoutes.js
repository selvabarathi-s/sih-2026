import express from 'express';
import {
  getQualitySummary,
  getAllNcrs,
  getProjectQuality,
  createNcr,
  updateNcrStatus,
  addLabTest,
  addSitePhoto,
  verifySitePhoto,
  addQualityInspection,
} from '../../controllers/qualityController.js';
import { authenticate, requireAuth, requireAnyRole } from '../../middleware/rbac.js';

const router = express.Router();

// General & Portfolio Quality Endpoints (Must be before /:id)
router.get('/summary', getQualitySummary);
router.get('/ncrs', getAllNcrs);

// Specific Project Quality Data
router.get('/projects/:id', getProjectQuality);
router.get('/:id', getProjectQuality);

// Protected Operations
router.use(authenticate);

// NCR Management
router.post('/projects/:id/ncrs', requireAuth, createNcr);
router.post('/:id/ncrs', requireAuth, createNcr);
router.patch('/ncrs/:ncrId', requireAuth, updateNcrStatus);

// Lab Tests
router.post('/projects/:id/lab-tests', requireAuth, addLabTest);
router.post('/:id/lab-tests', requireAuth, addLabTest);

// Site Photo Telemetry
router.post('/projects/:id/site-photos', requireAuth, addSitePhoto);
router.post('/:id/site-photos', requireAuth, addSitePhoto);
router.patch('/site-photos/:photoId/verify', requireAuth, verifySitePhoto);

// Backward Compatibility Inspections Endpoint
router.post('/projects/:id/inspections', requireAuth, addQualityInspection);
router.post('/:id/inspections', requireAuth, addQualityInspection);

export default router;
