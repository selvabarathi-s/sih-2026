import { alertService } from '../services/alertService.js';

export const getDeteriorationSignals = async (req, res, next) => {
  try {
    const signals = await alertService.getDeteriorationSignals(req.query);
    res.status(200).json({
      data: signals,
      meta: {
        count: signals.length,
        source: 'Observed PAIMANA Telemetry',
        report_period: 'April 2026',
      },
      error: null,
    });
  } catch (err) {
    next(err);
  }
};

export const updateSignalStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status, notes } = req.body;
    const result = await alertService.updateSignalStatus(id, {
      newStatus: status,
      notes,
      user: req.user,
    });
    res.status(200).json({
      data: result,
      meta: { timestamp: new Date().toISOString() },
      error: null,
    });
  } catch (err) {
    next(err);
  }
};
