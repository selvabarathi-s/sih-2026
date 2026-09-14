/**
 * PAIMANA PREDICT — Translation & Localization Routes (ESM)
 * /api/v1/translate
 */

import express from 'express';
import { translationController } from '../../controllers/translationController.js';

const router = express.Router();

// Catalog of supported languages (Eighth Schedule + English)
router.get('/languages', (req, res) => translationController.getLanguages(req, res));

// Translate arbitrary string or term
router.post('/', (req, res) => translationController.translate(req, res));
router.post('/text', (req, res) => translationController.translate(req, res));

// Localize project metadata
router.post('/project', (req, res) => translationController.translateProject(req, res));

export default router;
