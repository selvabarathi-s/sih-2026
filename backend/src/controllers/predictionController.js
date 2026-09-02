import { predictionService } from '../services/predictionService.js';

export const getModelRegistry = async (req, res, next) => {
  try {
    const registry = await predictionService.getModelRegistry();
    res.status(200).json(registry);
  } catch (err) {
    next(err);
  }
};
