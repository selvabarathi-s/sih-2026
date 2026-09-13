import express from 'express';
import {
  getCycles,
  getCurrentCycle,
  openCycle,
  validateTelemetry,
  submitUpdate,
  reviewSubmission,
  listSubmissions,
} from '../../controllers/monitoringController.js';

const router = express.Router();

router.get('/cycles', getCycles);
router.get('/cycles/current', getCurrentCycle);
router.post('/cycles/open', openCycle);
router.post('/validate', validateTelemetry);
router.post('/submissions', submitUpdate);
router.post('/submissions/:id/review', reviewSubmission);
router.get('/submissions', listSubmissions);

export default router;
