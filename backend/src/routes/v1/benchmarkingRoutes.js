import { Router } from 'express';
import { getSectorBenchmarks, getProjectBenchmark } from '../../controllers/benchmarkingController.js';

const router = Router();

router.get('/sectors', getSectorBenchmarks);
router.get('/project/:id', getProjectBenchmark);

export default router;
