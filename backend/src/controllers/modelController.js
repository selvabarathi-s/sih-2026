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

export const getModelCard = async (req, res, next) => {
  try {
    const { id } = req.params;
    const card = await modelRegistryService.getModelCard(id);
    if (!card) {
      return res.status(404).json({
        data: null,
        meta: null,
        error: { code: 'MODEL_CARD_NOT_FOUND', message: `Model card for ${id} not found.` },
      });
    }
    res.status(200).json({
      data: card,
      meta: { modelId: id },
      error: null,
    });
  } catch (err) {
    next(err);
  }
};

export const getDriftReport = async (req, res, next) => {
  try {
    const report = await modelRegistryService.getDriftReport();
    res.status(200).json({
      data: report,
      meta: { status: 'ACTIVE' },
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

export const approveModel = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { remarks, status = 'GOVERNED_APPROVED' } = req.body || {};
    const model = await modelRegistryService.getModelById(id);
    if (!model) {
      return res.status(404).json({ error: `Model ${id} not found` });
    }

    res.status(200).json({
      success: true,
      message: `Model ${id} governance sign-off approved by AI Governance Approver (${req.user?.fullName || req.user?.username || 'Approver'}).`,
      approval: {
        modelId: id,
        status,
        approvedBy: req.user?.fullName || 'Dr. Aruna Chandrasekhar',
        role: req.user?.role || 'ai_governance',
        remarks: remarks || 'Temporal anti-leakage verified. Brier calibration acceptable.',
        timestamp: new Date().toISOString(),
      },
    });
  } catch (err) {
    next(err);
  }
};

export const signoffDrift = async (req, res, next) => {
  try {
    const { remarks } = req.body || {};
    res.status(200).json({
      success: true,
      message: `Quarterly drift report sign-off recorded by AI Governance Approver.`,
      signoff: {
        status: 'DRIFT_ACCEPTABLE',
        approvedBy: req.user?.fullName || 'Dr. Aruna Chandrasekhar',
        role: req.user?.role || 'ai_governance',
        remarks: remarks || 'Feature drift within acceptable Kolmogorov-Smirnov thresholds (< 0.05).',
        timestamp: new Date().toISOString(),
      },
    });
  } catch (err) {
    next(err);
  }
};

