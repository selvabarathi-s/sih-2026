import express from 'express';
import {
  getAllMasterData,
  getMinistries,
  getSectors,
  getStates,
  getAgencies,
  getTaxonomies,
} from '../../controllers/referenceController.js';

const router = express.Router();

router.get('/', getAllMasterData);
router.get('/ministries', getMinistries);
router.get('/sectors', getSectors);
router.get('/states', getStates);
router.get('/agencies', getAgencies);
router.get('/taxonomies/:type', getTaxonomies);

export default router;
