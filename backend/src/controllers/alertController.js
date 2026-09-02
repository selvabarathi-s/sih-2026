import { alertService } from '../services/alertService.js';

export const getDeteriorationSignals = async (req, res, next) => {
  try {
    const signals = await alertService.getDeteriorationSignals(req.query);
    res.status(200).json({ count: signals.length, signals });
  } catch (err) {
    next(err);
  }
};
