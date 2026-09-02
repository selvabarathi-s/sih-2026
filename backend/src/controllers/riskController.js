import { riskService } from '../services/riskService.js';

export const getPortfolioRisk = async (req, res, next) => {
  try {
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
