import { modelRegistryService } from '../services/modelRegistryService.js';
import { backtestService } from '../services/backtestService.js';

export const listModels = async (req, res, next) => {
  try {
    const models = await modelRegistryService.getAllModels();
    res.status(200).json({
      data: models,
      meta: { count: models.length },
      error: null,
    });
  } catch (err) {
    next(err);
  }
};

export const getModelDetail = async (req, res, next) => {
  try {
    const { id } = req.params;
    const model = await modelRegistryService.getModelById(id);
    if (!model) {
      return res.status(404).json({
        data: null,
        meta: null,
        error: { code: 'MODEL_NOT_FOUND', message: `Model with ID ${id} not found.` },
      });
    }
    res.status(200).json({
      data: model,
      meta: { modelId: id },
      error: null,
    });
  } catch (err) {
    next(err);
  }
};

export const getBacktest = async (req, res, next) => {
  try {
    const { modelId } = req.params;
    const results = await backtestService.getBacktestResults(modelId);
    res.status(200).json({
      data: results,
      meta: { modelId },
      error: null,
    });
  } catch (err) {
    next(err);
  }
};

export const getFeatureAvailability = async (req, res, next) => {
  try {
    const report = await modelRegistryService.getFeatureAvailability();
    res.status(200).json({
      data: report,
      meta: { totalFeatures: report.length },
      error: null,
    });
  } catch (err) {
    next(err);
  }
};
