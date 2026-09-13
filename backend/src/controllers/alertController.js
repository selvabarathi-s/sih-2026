import { alertService } from '../services/alertService.js';
import { compositeAlertEngine } from '../services/compositeAlertEngine.js';

export const getDeteriorationSignals = async (req, res, next) => {
  try {
    const { composite } = req.query;
    if (composite === 'true' || composite === '1') {
      const warnings = await compositeAlertEngine.getCompositeWarnings(req.query);
      return res.status(200).json({
        data: warnings,
        meta: {
          count: warnings.length,
          mode: 'COMPOSITE_DEDUPLICATED_EARLY_WARNINGS',
          report_period: 'April 2026',
        },
        error: null,
      });
    }

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

export const getCompositeWarnings = async (req, res, next) => {
  try {
    const warnings = await compositeAlertEngine.getCompositeWarnings(req.query);
    res.status(200).json({
      data: warnings,
      meta: {
        count: warnings.length,
        mode: 'COMPOSITE_DEDUPLICATED_EARLY_WARNINGS',
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
    const { status, notes, actionTitle } = req.body;

    if (id.startsWith('WARN-')) {
      const result = compositeAlertEngine.updateWarningStatus(id, {
        newStatus: status,
        notes,
        actionTitle,
        user: req.user,
      });
      return res.status(200).json({
        data: result,
        meta: { timestamp: new Date().toISOString() },
        error: null,
      });
    }

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
