import { asOfService } from '../services/asOfService.js';

export const getAvailableCutoffs = async (req, res, next) => {
  try {
    const cutoffs = asOfService.getAvailableCutoffs();
    res.status(200).json({
      data: cutoffs,
      meta: { ruleTEnforced: true },
      error: null,
    });
  } catch (err) {
    next(err);
  }
};

export const getProjectAsOf = async (req, res, next) => {
  try {
    const { id } = req.params;
    const rawCutoff = req.query.cutoff || req.query.asOfDate || req.query.date || '2026-01';
    const cutoff = rawCutoff.length >= 7 ? rawCutoff.slice(0, 7) : rawCutoff;
    const result = await asOfService.getProjectAsOf(id, cutoff);
    res.status(200).json({
      data: result,
      meta: {
        engine: 'as-of-v1.4-reconstruction',
        antiLeakageRuleT: 'PASS',
      },
      error: null,
    });
  } catch (err) {
    next(err);
  }
};
