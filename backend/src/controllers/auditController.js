import { auditService } from '../services/auditService.js';

export const getAuditLogs = async (req, res, next) => {
  try {
    const logs = await auditService.getLogs(req.query);
    res.status(200).json(logs);
  } catch (err) {
    next(err);
  }
};

export const createAuditLog = async (req, res, next) => {
  try {
    const entry = await auditService.logEvent({
      ...req.body,
      userId: req.user?.userId || req.body.userId,
      userRole: req.user?.role || req.body.userRole,
      ipAddress: req.ip,
    });
    res.status(201).json(entry);
  } catch (err) {
    next(err);
  }
};
