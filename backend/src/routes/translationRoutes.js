/**
 * PAIMANA PREDICT — Translation & Localization Routes
 * /api/v1/translate
 */

const express = require('express');
const router = express.Router();
const translationController = require('../controllers/translationController');

// Catalog of supported languages (Eighth Schedule + English)
router.get('/languages', (req, res) => translationController.getLanguages(req, res));

// Translate arbitrary string or term
router.post('/', (req, res) => translationController.translate(req, res));

// Localize project metadata
router.post('/project', (req, res) => translationController.translateProject(req, res));

module.exports = router;
