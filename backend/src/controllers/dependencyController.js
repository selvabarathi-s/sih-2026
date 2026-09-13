// ==============================================================================
// PAIMANA PREDICT — PROJECT DEPENDENCY & SYSTEMIC RISK CONTROLLER
// ==============================================================================

import { dependencyService } from '../services/dependencyService.js';

export const getAllDependencies = async (req, res, next) => {
  try {
    const list = await dependencyService.getAllDependencies();
    res.status(200).json({ count: list.length, data: list, error: null });
  } catch (err) {
    next(err);
  }
};

export const getProjectDependencies = async (req, res, next) => {
  try {
    const result = await dependencyService.getDependenciesForProject(req.params.id);
    res.status(200).json({ data: result, error: null });
  } catch (err) {
    next(err);
  }
};

export const addDependency = async (req, res, next) => {
  try {
    const dep = await dependencyService.addDependency(req.body, req.user);
    res.status(201).json({ data: dep, message: 'Dependency recorded successfully.', error: null });
  } catch (err) {
    res.status(err.statusCode || 400).json({ error: err.message });
  }
};

export const calculateCascadeImpact = async (req, res, next) => {
  try {
    const delayMonths = Number(req.body.additionalDelayMonths || 6);
    const result = await dependencyService.calculateCascadeImpact(req.params.id, delayMonths);
    res.status(200).json({ data: result, error: null });
  } catch (err) {
    next(err);
  }
};
