import { portfolioService } from '../services/portfolioService.js';

export const getPortfolioSummary = async (req, res, next) => {
  try {
    const summary = await portfolioService.getSummary();
    res.status(200).json(summary);
  } catch (err) {
    next(err);
  }
};

export const getSectorBreakdown = async (req, res, next) => {
  try {
    const sectors = await portfolioService.getSectorsBreakdown();
    res.status(200).json({ count: sectors.length, sectors });
  } catch (err) {
    next(err);
  }
};
