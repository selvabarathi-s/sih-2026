import express from 'express';
import { queryAssistant } from '../../controllers/assistantController.js';

const router = express.Router();

router.post('/query', queryAssistant);

export default router;
