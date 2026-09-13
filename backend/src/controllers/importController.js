/**
 * PAIMANA PREDICT — DATA IMPORT CONTROLLER
 */

import { dataImportService } from '../services/dataImportService.js';

export const getImportTemplates = async (req, res, next) => {
  try {
    const templates = dataImportService.getTemplates();
    res.status(200).json({
      data: templates,
      meta: { total: templates.length },
      error: null,
    });
  } catch (err) {
    next(err);
  }
};

export const saveImportTemplate = async (req, res, next) => {
  try {
    const template = dataImportService.saveTemplate(req.body);
    res.status(201).json({
      data: template,
      meta: { message: 'Mapping template saved successfully.' },
      error: null,
    });
  } catch (err) {
    next(err);
  }
};

export const previewImport = async (req, res, next) => {
  try {
    const { filename, rawData, fileType, templateId, customMappings } = req.body;
    const batch = await dataImportService.stageImportBatch({
      filename,
      rawData,
      fileType,
      templateId,
      customMappings,
      user: req.user,
    });

    res.status(200).json({
      data: batch,
      meta: {
        totalRows: batch.totalRows,
        validRows: batch.validRows,
        warningRows: batch.warningRows,
        rejectedRows: batch.rejectedRows,
      },
      error: null,
    });
  } catch (err) {
    next(err);
  }
};

export const commitImport = async (req, res, next) => {
  try {
    const { batchId } = req.params;
    const { includeWarnings } = req.body;
    const result = await dataImportService.commitBatch(batchId, {
      user: req.user,
      includeWarnings: includeWarnings !== false,
    });

    res.status(200).json({
      data: result,
      meta: { message: `Successfully committed ${result.committedCount} project records.` },
      error: null,
    });
  } catch (err) {
    next(err);
  }
};

export const getImportHistory = async (req, res, next) => {
  try {
    const history = dataImportService.getImportHistory();
    res.status(200).json({
      data: history,
      meta: { count: history.length },
      error: null,
    });
  } catch (err) {
    next(err);
  }
};
