// ==============================================================================
// PAIMANA PREDICT — CASE MANAGEMENT CONTROLLER
// ==============================================================================

import { caseManagementService, ROOT_CAUSE_FACTORS } from '../services/caseManagementService.js';

export const listCases = async (req, res, next) => {
  try {
    const cases = caseManagementService.getAllCases(req.query);
    res.status(200).json({ count: cases.length, data: cases, factors: ROOT_CAUSE_FACTORS, error: null });
  } catch (err) {
    next(err);
  }
};

export const getCase = async (req, res, next) => {
  try {
    const caseFile = caseManagementService.getCase(req.params.id);
    if (!caseFile) {
      return res.status(404).json({ error: `Case ${req.params.id} not found.` });
    }
    res.status(200).json({ data: caseFile, factors: ROOT_CAUSE_FACTORS, error: null });
  } catch (err) {
    next(err);
  }
};

export const createCase = async (req, res, next) => {
  try {
    const newCase = await caseManagementService.createCase(req.body, req.user);
    res.status(201).json({ data: newCase, message: 'Case file opened successfully.', error: null });
  } catch (err) {
    res.status(err.statusCode || 400).json({ error: err.message });
  }
};

export const updateRootCauses = async (req, res, next) => {
  try {
    const updated = await caseManagementService.updateRootCauses(req.params.id, req.body.factorRatings, req.user);
    res.status(200).json({ data: updated, error: null });
  } catch (err) {
    res.status(err.statusCode || 400).json({ error: err.message });
  }
};

export const submitActionPlan = async (req, res, next) => {
  try {
    const updated = await caseManagementService.submitActionPlan(req.params.id, req.body, req.user);
    res.status(200).json({ data: updated, message: 'Action plan submitted successfully.', error: null });
  } catch (err) {
    res.status(err.statusCode || 400).json({ error: err.message });
  }
};

export const uploadEvidence = async (req, res, next) => {
  try {
    const updated = await caseManagementService.uploadEvidence(req.params.id, req.body, req.user);
    res.status(201).json({ data: updated, message: 'Evidence uploaded successfully.', error: null });
  } catch (err) {
    res.status(err.statusCode || 400).json({ error: err.message });
  }
};

export const verifyEvidence = async (req, res, next) => {
  try {
    const { id, evidenceId } = req.params;
    const updated = await caseManagementService.verifyEvidence(id, evidenceId, req.body, req.user);
    res.status(200).json({ data: updated, message: 'Evidence verification completed.', error: null });
  } catch (err) {
    res.status(err.statusCode || 400).json({ error: err.message });
  }
};
