import { overrideService } from '../services/overrideService.js';

export const submitOverride = async (req, res, next) => {
  try {
    const { id } = req.params;
    const body = { ...req.body, projectId: id || req.body.projectId };
    const record = await overrideService.submitOverride(body, req.user);
    res.status(201).json({
      data: record,
      meta: { audited: true },
      error: null,
    });
  } catch (err) {
    next(err);
  }
};

export const getOverrides = async (req, res, next) => {
  try {
    const { id } = req.params;
    const records = overrideService.getOverrides(id);
    const active = overrideService.getLatestOverride(id);
    res.status(200).json({
      data: active || (records.length > 0 ? records[0] : null),
      history: records,
      meta: { count: records.length },
      error: null,
    });
  } catch (err) {
    next(err);
  }
};
