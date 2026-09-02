import express from 'express';
import { getDeteriorationSignals } from '../../controllers/alertController.js';

const router = express.Router();

router.get('/signals', getDeteriorationSignals);

export default router;
