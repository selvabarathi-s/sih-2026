import { analyticsService } from '../services/analyticsService.js';

export const getOverviewAnalytics = async (req, res, next) => {
  try {
    const data = await analyticsService.getOverviewAnalytics();
    res.status(200).json({
      data,
      meta: { source: 'PAIMANA Portfolio Analytics Engine' },
      error: null,
    });
  } catch (err) {
    next(err);
  }
};

export const getStateAnalytics = async (req, res, next) => {
  try {
    const states = await analyticsService.getStateAnalytics();
    res.status(200).json({
      data: states,
      meta: { count: states.length },
      error: null,
    });
  } catch (err) {
    next(err);
  }
};

export const getSectorAnalytics = async (req, res, next) => {
  try {
    const sectors = await analyticsService.getSectorAnalytics();
    res.status(200).json({
      data: sectors,
      meta: { count: sectors.length },
      error: null,
    });
  } catch (err) {
    next(err);
  }
};
