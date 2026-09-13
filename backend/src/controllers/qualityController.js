import { qualityService } from '../services/qualityService.js';

export const getQualitySummary = async (req, res, next) => {
  try {
    const summary = qualityService.getQualitySummary();
    res.status(200).json({
      data: summary,
      error: null,
    });
  } catch (err) {
    next(err);
  }
};

export const getAllNcrs = async (req, res, next) => {
  try {
    const { projectId, severity, status } = req.query;
    const ncrs = qualityService.getAllNcrs({ projectId, severity, status });
    res.status(200).json({
      data: ncrs,
      meta: { total: ncrs.length },
      error: null,
    });
  } catch (err) {
    next(err);
  }
};

export const getProjectQuality = async (req, res, next) => {
  try {
    const { id } = req.params;
    const data = qualityService.getQualityData(id);
    res.status(200).json({
      data,
      meta: { verifiedEvidenceOnly: false },
      error: null,
    });
  } catch (err) {
    next(err);
  }
};

export const createNcr = async (req, res, next) => {
  try {
    const { id } = req.params;
    const ncr = qualityService.createNcr(id, req.body, req.user);
    res.status(201).json({
      data: ncr,
      meta: { requiresEngineeringVerification: true },
      error: null,
    });
  } catch (err) {
    next(err);
  }
};

export const updateNcrStatus = async (req, res, next) => {
  try {
    const { ncrId } = req.params;
    const ncr = qualityService.updateNcrStatus(ncrId, {
      ...req.body,
      user: req.user,
    });
    res.status(200).json({
      data: ncr,
      meta: { message: 'NCR status updated successfully.' },
      error: null,
    });
  } catch (err) {
    next(err);
  }
};

export const addLabTest = async (req, res, next) => {
  try {
    const { id } = req.params;
    const test = qualityService.addLabTest(id, req.body, req.user);
    res.status(201).json({
      data: test,
      meta: { certifiedStandard: test.standard },
      error: null,
    });
  } catch (err) {
    next(err);
  }
};

export const addSitePhoto = async (req, res, next) => {
  try {
    const { id } = req.params;
    const photo = qualityService.addSitePhotoAnomaly(id, req.body, req.user);
    res.status(201).json({
      data: photo,
      meta: { disclaimer: photo.disclaimer },
      error: null,
    });
  } catch (err) {
    next(err);
  }
};

export const verifySitePhoto = async (req, res, next) => {
  try {
    const { photoId } = req.params;
    const photo = qualityService.verifySitePhoto(photoId, {
      ...req.body,
      user: req.user,
    });
    res.status(200).json({
      data: photo,
      meta: { message: 'Photo anomaly status verified.' },
      error: null,
    });
  } catch (err) {
    next(err);
  }
};

export const addQualityInspection = async (req, res, next) => {
  try {
    const { id } = req.params;
    const inspection = qualityService.addInspectionRecord(id, req.body, req.user);
    res.status(201).json({
      data: inspection,
      meta: { requiresEngineeringVerification: true },
      error: null,
    });
  } catch (err) {
    next(err);
  }
};
