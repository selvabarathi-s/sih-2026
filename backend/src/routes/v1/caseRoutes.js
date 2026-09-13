import express from 'express';
import {
  listCases,
  getCase,
  createCase,
  updateRootCauses,
  submitActionPlan,
  uploadEvidence,
  verifyEvidence,
} from '../../controllers/caseController.js';

const router = express.Router();

router.get('/', listCases);
router.get('/:id', getCase);
router.post('/', createCase);
router.patch('/:id/root-causes', updateRootCauses);
router.post('/:id/action-plan', submitActionPlan);
router.post('/:id/evidence', uploadEvidence);
router.post('/:id/evidence/:evidenceId/verify', verifyEvidence);

export default router;
