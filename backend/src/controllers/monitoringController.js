// ==============================================================================
// PAIMANA PREDICT — MONTHLY MONITORING CYCLE & SUBMISSION CONTROLLER
// ==============================================================================

import { monthlyMonitoringService } from '../services/monthlyMonitoringService.js';
import { projectRepository } from '../repositories/projectRepository.js';

export const getCycles = async (req, res, next) => {
  try {
    const cycles = monthlyMonitoringService.getActiveCycles();
    res.status(200).json({ data: cycles, error: null });
  } catch (err) {
    next(err);
  }
};

export const getCurrentCycle = async (req, res, next) => {
  try {
    const cycle = monthlyMonitoringService.getCurrentCycle();
    res.status(200).json({ data: cycle, error: null });
  } catch (err) {
    next(err);
  }
};

export const openCycle = async (req, res, next) => {
  try {
    const cycle = await monthlyMonitoringService.openNewReportingCycle(req.body, req.user);
    res.status(201).json({ data: cycle, message: 'Reporting cycle opened successfully.', error: null });
  } catch (err) {
    res.status(err.statusCode || 400).json({ error: err.message });
  }
};

export const validateTelemetry = async (req, res, next) => {
  try {
    const { projectId } = req.body;
    const project = await projectRepository.findById(projectId);
    if (!project) {
      return res.status(404).json({ error: `Project ${projectId} not found.` });
    }

    const validation = monthlyMonitoringService.validateSubmission(project, req.body);
    res.status(200).json({ validation, error: null });
  } catch (err) {
    next(err);
  }
};

export const submitUpdate = async (req, res, next) => {
  try {
    const isDraft = Boolean(req.body.isDraft);
    const result = await monthlyMonitoringService.createOrUpdateSubmission(req.body, req.user, isDraft);
    res.status(201).json(result);
  } catch (err) {
    res.status(err.statusCode || 400).json({
      error: err.message,
      validationFlags: err.validationFlags || null,
    });
  }
};

export const reviewSubmission = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { decision, remarks } = req.body;
    const result = await monthlyMonitoringService.reviewSubmission(id, decision, req.user, remarks);
    res.status(200).json(result);
  } catch (err) {
    res.status(err.statusCode || 400).json({ error: err.message });
  }
};

export const listSubmissions = async (req, res, next) => {
  try {
    const submissions = monthlyMonitoringService.getSubmissions(req.query);
    res.status(200).json({ count: submissions.length, data: submissions, error: null });
  } catch (err) {
    next(err);
  }
};
