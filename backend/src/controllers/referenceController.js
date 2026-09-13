// ==============================================================================
// PAIMANA PREDICT — REFERENCE MASTER DATA CONTROLLER
// ==============================================================================

import { referenceDataService } from '../services/referenceDataService.js';

export const getAllMasterData = async (req, res, next) => {
  try {
    const data = referenceDataService.getAllMasterData();
    res.status(200).json({ data, error: null });
  } catch (err) {
    next(err);
  }
};

export const getMinistries = async (req, res, next) => {
  try {
    const data = referenceDataService.getMinistries();
    res.status(200).json({ data, count: data.length, error: null });
  } catch (err) {
    next(err);
  }
};

export const getSectors = async (req, res, next) => {
  try {
    const data = referenceDataService.getSectors(req.query.ministry);
    res.status(200).json({ data, count: data.length, error: null });
  } catch (err) {
    next(err);
  }
};

export const getStates = async (req, res, next) => {
  try {
    const data = referenceDataService.getStates();
    res.status(200).json({ data, count: data.length, error: null });
  } catch (err) {
    next(err);
  }
};

export const getAgencies = async (req, res, next) => {
  try {
    const data = referenceDataService.getAgencies(req.query.ministry);
    res.status(200).json({ data, count: data.length, error: null });
  } catch (err) {
    next(err);
  }
};

export const getTaxonomies = async (req, res, next) => {
  try {
    const type = req.params.type;
    let data;
    switch (type) {
      case 'milestones':
        data = referenceDataService.getMilestoneTypes();
        break;
      case 'risks':
        data = referenceDataService.getRiskCategories();
        break;
      case 'interventions':
        data = referenceDataService.getInterventionTypes();
        break;
      case 'documents':
        data = referenceDataService.getDocumentTypes();
        break;
      case 'quality-issues':
        data = referenceDataService.getQualityIssueTypes();
        break;
      case 'approvals':
        data = referenceDataService.getApprovalTypes();
        break;
      default:
        data = referenceDataService.getAllMasterData();
        break;
    }
    res.status(200).json({ type, data, error: null });
  } catch (err) {
    next(err);
  }
};
