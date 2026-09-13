import express from 'express';
import {
  listBriefs,
  getBrief,
  createBrief,
  issueDirective,
} from '../../controllers/decisionController.js';

const router = express.Router();

router.get('/briefs', listBriefs);
router.get('/briefs/:id', getBrief);
router.post('/briefs', createBrief);
router.post('/briefs/:id/directive', issueDirective);

export default router;
