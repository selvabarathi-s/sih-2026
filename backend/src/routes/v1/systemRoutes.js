import express from 'express';
import {
  getWorkerStatus,
  triggerWorkerCycle,
  listSlas,
  listCorrections,
  requestCorrection,
  reviewCorrection,
  getNotificationDispatches,
} from '../../controllers/systemController.js';

const router = express.Router();

router.get('/worker', getWorkerStatus);
router.post('/worker/run', triggerWorkerCycle);
router.get('/slas', listSlas);
router.get('/corrections', listCorrections);
router.post('/corrections', requestCorrection);
router.post('/corrections/:id/review', reviewCorrection);
router.get('/notification-dispatches', getNotificationDispatches);

export default router;
