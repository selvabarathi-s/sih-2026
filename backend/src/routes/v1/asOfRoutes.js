import express from 'express';
import { getAvailableCutoffs, getProjectAsOf } from '../../controllers/asOfController.js';

const router = express.Router();

router.get('/cutoffs', getAvailableCutoffs);
router.get('/project/:id', getProjectAsOf);
router.get('/:id', getProjectAsOf);

export default router;
