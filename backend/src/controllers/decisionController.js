// ==============================================================================
// PAIMANA PREDICT — SENIOR EXECUTIVE DECISION CONTROLLER
// ==============================================================================

import { decisionWorkflowService } from '../services/decisionWorkflowService.js';

export const listBriefs = async (req, res, next) => {
  try {
    const briefs = decisionWorkflowService.getAllBriefs(req.query);
    res.status(200).json({ count: briefs.length, data: briefs, error: null });
  } catch (err) {
    next(err);
  }
};

export const getBrief = async (req, res, next) => {
  try {
    const brief = decisionWorkflowService.getDecisionBrief(req.params.id);
    if (!brief) {
      return res.status(404).json({ error: `Decision brief ${req.params.id} not found.` });
    }
    res.status(200).json({ data: brief, error: null });
  } catch (err) {
    next(err);
  }
};

export const createBrief = async (req, res, next) => {
  try {
    const brief = await decisionWorkflowService.createDecisionBrief(req.body, req.user);
    res.status(201).json({ data: brief, message: 'Executive decision brief created.', error: null });
  } catch (err) {
    res.status(err.statusCode || 400).json({ error: err.message });
  }
};

export const issueDirective = async (req, res, next) => {
  try {
    const updated = await decisionWorkflowService.issueExecutiveDirective(req.params.id, req.body, req.user);
    res.status(200).json({ data: updated, message: 'Executive directive issued successfully.', error: null });
  } catch (err) {
    res.status(err.statusCode || 400).json({ error: err.message });
  }
};
