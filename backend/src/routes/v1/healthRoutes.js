import express from 'express';
import { getHealth, getDataHealth, getMlHealth } from '../../controllers/healthController.js';

const router = express.Router();

router.get('/', getHealth);
router.get('/data', getDataHealth);
router.get('/ml', getMlHealth);

export default router;
