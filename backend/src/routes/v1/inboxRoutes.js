import express from 'express';
import {
  getMyWorkload,
  resolveProjectResponsibility,
} from '../../controllers/inboxController.js';

const router = express.Router();

router.get('/workload', getMyWorkload);
router.post('/resolve-responsibility', resolveProjectResponsibility);

export default router;
