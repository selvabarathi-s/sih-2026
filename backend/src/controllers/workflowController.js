// ==============================================================================
// PAIMANA PREDICT — PROJECT OPERATIONAL WORKFLOW CONTROLLER
// 14-State Lifecycle Transitions, History & Master Record Registration
// ==============================================================================

import { projectLifecycleService } from '../services/projectLifecycleService.js';
import { projectRegistrationService } from '../services/projectRegistrationService.js';

export const getProjectState = async (req, res, next) => {
  try {
    const { id } = req.params;
    const state = await projectLifecycleService.getProjectState(id);
    const available = await projectLifecycleService.getAvailableTransitions(id, req.user);
    res.status(200).json({
      projectId: id,
      state,
      availableTransitions: available.transitions,
      error: null,
    });
  } catch (err) {
    next(err);
  }
};

export const getStateHistory = async (req, res, next) => {
  try {
    const { id } = req.params;
    const history = await projectLifecycleService.getStateHistory(id);
    res.status(200).json({
      projectId: id,
      count: history.length,
      history,
      error: null,
    });
  } catch (err) {
    next(err);
  }
};

export const getAvailableTransitions = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await projectLifecycleService.getAvailableTransitions(id, req.user);
    res.status(200).json({
      projectId: id,
      ...result,
      error: null,
    });
  } catch (err) {
    next(err);
  }
};

export const transitionProjectState = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { toState, reason, evidenceRef, metadata } = req.body;

    const result = await projectLifecycleService.transitionState(
      id,
      toState,
      req.user,
      { reason, evidenceRef, metadata }
    );

    res.status(200).json(result);
  } catch (err) {
    res.status(err.statusCode || 400).json({ error: err.message });
  }
};

export const registerProject = async (req, res, next) => {
  try {
    const result = await projectRegistrationService.registerProject(req.body, req.user);
    res.status(201).json(result);
  } catch (err) {
    res.status(err.statusCode || 400).json({
      error: err.message,
      duplicateMatches: err.duplicateMatches || null,
    });
  }
};

export const checkDuplicateProject = async (req, res, next) => {
  try {
    const duplicates = await projectRegistrationService.detectDuplicates(req.body);
    res.status(200).json({
      matchesCount: duplicates.length,
      matches: duplicates,
      error: null,
    });
  } catch (err) {
    next(err);
  }
};
