/**
 * PAIMANA PREDICT — Translation & Localization Controller (ESM)
 */

import { translationService } from '../services/translationService.js';

export class TranslationController {
  getLanguages(req, res) {
    const languages = translationService.getSupportedLanguages();
    return res.status(200).json({
      data: languages,
      meta: {
        total: languages.length,
        constitutionalClassification: 'Eighth Schedule to the Constitution of India (22 Official Languages + English)',
        primaryUnionOfficial: ['en', 'hi']
      },
      error: null
    });
  }

  translate(req, res) {
    const { text, targetLang = 'hi' } = req.body || {};

    if (!text || typeof text !== 'string') {
      return res.status(400).json({
        data: null,
        meta: null,
        error: {
          code: 'INVALID_INPUT',
          message: 'The "text" field must be a non-empty string.',
          statusCode: 400
        }
      });
    }

    if (!translationService.isLanguageSupported(targetLang)) {
      return res.status(400).json({
        data: null,
        meta: null,
        error: {
          code: 'UNSUPPORTED_LANGUAGE',
          message: `Target language "${targetLang}" is not supported. Supported languages include: ${translationService.getSupportedLanguages().map(l => l.code).join(', ')}`,
          statusCode: 400
        }
      });
    }

    const result = translationService.translateText(text, targetLang);
    return res.status(200).json({
      data: result,
      meta: null,
      error: null
    });
  }

  translateProject(req, res) {
    const { project, targetLang = 'hi' } = req.body || {};

    if (!project || typeof project !== 'object') {
      return res.status(400).json({
        data: null,
        meta: null,
        error: {
          code: 'INVALID_INPUT',
          message: 'The "project" payload must be an object.',
          statusCode: 400
        }
      });
    }

    if (!translationService.isLanguageSupported(targetLang)) {
      return res.status(400).json({
        data: null,
        meta: null,
        error: {
          code: 'UNSUPPORTED_LANGUAGE',
          message: `Target language "${targetLang}" is not supported.`,
          statusCode: 400
        }
      });
    }

    const localizedProject = translationService.translateProjectFields(project, targetLang);
    return res.status(200).json({
      data: localizedProject,
      meta: null,
      error: null
    });
  }
}

export const translationController = new TranslationController();
export default translationController;
