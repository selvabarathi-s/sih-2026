import { riskService } from '../services/riskService.js';

export const getProjectRiskScore = async (req, res, next) => {
  try {
    const { projectId } = req.params;
    const { dataMode } = req.query;
    const result = await riskService.getProjectRisk(projectId, dataMode);
    res.status(200).json({
      data: result,
      meta: {
        engine: 'risk-v2.2-prioritization',
        calculatedAt: result.calculatedAt,
      },
      error: null,
    });
  } catch (err) {
    next(err);
  }
};

export const getPortfolioRisk = async (req, res, next) => {
  try {
    // If pagination or filtering query params are passed, return ranked portfolio list
    if (req.query.page || req.query.sort || req.query.minRisk || req.query.maxRisk || req.query.riskBand || req.query.sector) {
      const ranked = await riskService.getRankedPortfolio(req.query);
      return res.status(200).json({
        data: ranked,
        meta: {
          source: 'PAIMANA Table 6 Telemetry',
          engine: 'risk-v2.2-prioritization',
        },
        error: null,
      });
    }

    const risk = await riskService.getPortfolioRisk();
    res.status(200).json({
      data: risk,
      meta: {
        source: 'PAIMANA Table 6 Telemetry',
        total_projects: 1981,
      },
      error: null,
    });
  } catch (err) {
    next(err);
  }
};

export const getRiskNetwork = async (req, res, next) => {
  try {
    const network = await riskService.getRiskNetwork();
    res.status(200).json({
      data: network,
      meta: { mode: 'REAL_PAIMANA' },
      error: null,
    });
  } catch (err) {
    next(err);
  }
};
