import { actionService } from '../services/actionService.js';

export const listActions = async (req, res, next) => {
  try {
    const result = await actionService.getAllActions(req.query);
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
};

export const assignAction = async (req, res, next) => {
  try {
    const action = await actionService.assignAction(req.body, req.user);
    res.status(201).json(action);
  } catch (err) {
    next(err);
  }
};

export const updateActionStatus = async (req, res, next) => {
  try {
    const updated = await actionService.updateActionStatus(req.params.id, req.body, req.user);
    res.status(200).json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const updateProjectProgress = async (req, res, next) => {
  try {
    const result = await actionService.updateProjectProgress(req.params.id, req.body, req.user);
    res.status(200).json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
