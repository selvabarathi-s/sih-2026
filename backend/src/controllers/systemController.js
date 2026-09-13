// ==============================================================================
// PAIMANA PREDICT — SYSTEM AUTOMATION & DATA CORRECTION CONTROLLER
// ==============================================================================

import { automationWorker } from '../services/automationWorker.js';
import { slaEscalationEngine } from '../services/slaEscalationEngine.js';
import { dataCorrectionService } from '../services/dataCorrectionService.js';
import { notificationProviders } from '../services/notificationProviders.js';

export const getWorkerStatus = async (req, res, next) => {
  try {
    const status = automationWorker.getStatus();
    res.status(200).json({ data: status, error: null });
  } catch (err) {
    next(err);
  }
};

export const triggerWorkerCycle = async (req, res, next) => {
  try {
    const results = await automationWorker.runCycle();
    res.status(200).json({ data: results, message: 'Automation worker cycle executed successfully.', error: null });
  } catch (err) {
    next(err);
  }
};

export const listSlas = async (req, res, next) => {
  try {
    const slas = slaEscalationEngine.getTrackers(req.query);
    res.status(200).json({ count: slas.length, data: slas, error: null });
  } catch (err) {
    next(err);
  }
};

export const listCorrections = async (req, res, next) => {
  try {
    const list = dataCorrectionService.getCorrections(req.query);
    res.status(200).json({ count: list.length, data: list, error: null });
  } catch (err) {
    next(err);
  }
};

export const requestCorrection = async (req, res, next) => {
  try {
    const record = await dataCorrectionService.requestCorrection(req.body, req.user);
    res.status(201).json({ data: record, message: 'Historical correction request submitted.', error: null });
  } catch (err) {
    res.status(err.statusCode || 400).json({ error: err.message });
  }
};

export const reviewCorrection = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { decision, remarks } = req.body;
    const result = await dataCorrectionService.reviewCorrection(id, decision, req.user, remarks);
    res.status(200).json(result);
  } catch (err) {
    res.status(err.statusCode || 400).json({ error: err.message });
  }
};

export const getNotificationDispatches = async (req, res, next) => {
  try {
    const logs = notificationProviders.getDeliveryLogs(Number(req.query.limit || 50));
    res.status(200).json({ count: logs.length, data: logs, error: null });
  } catch (err) {
    next(err);
  }
};
