// ==============================================================================
// PAIMANA PREDICT — OPERATIONAL WORKLOAD INBOX CONTROLLER
// ==============================================================================

import { responsibilityEngine } from '../services/responsibilityEngine.js';

export const getMyWorkload = async (req, res, next) => {
  try {
    const workload = await responsibilityEngine.getMyWorkload(req.user);
    res.status(200).json({ data: workload, error: null });
  } catch (err) {
    next(err);
  }
};

export const resolveProjectResponsibility = async (req, res, next) => {
  try {
    const { projectId, issueCategory, severity } = req.body;
    const result = await responsibilityEngine.resolveResponsibility(projectId, issueCategory, severity);
    res.status(200).json({ data: result, error: null });
  } catch (err) {
    next(err);
  }
};
