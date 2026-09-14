import { qualityService } from '../services/qualityService.js';
import { normalizeRole } from '../middleware/rbac.js';
import { auditService } from '../services/auditService.js';

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
    const userRole = normalizeRole(req.user?.role);
    if (userRole === 'audit_observer') {
      return res.status(403).json({
        error: {
          code: 'FORBIDDEN',
          message: 'Access denied: Audit Observer is strictly read-only and cannot raise NCRs.',
          statusCode: 403,
        },
      });
    }

    const { id } = req.params;
    const ncr = qualityService.createNcr(id, req.body, req.user);

    await auditService.logEvent({
      action: 'NCR_CREATED',
      userId: req.user?.id || 'usr-quality-01',
      userRole: req.user?.role || 'quality_auditor',
      organization: req.user?.organization || 'Quality Directorate',
      resourceType: 'QUALITY_NCR',
      resourceId: ncr.id,
      details: { projectId: id, severity: ncr.severity, title: ncr.title },
      ipAddress: req.ip || '127.0.0.1',
    });

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
    const { status } = req.body || {};
    const userRole = normalizeRole(req.user?.role);

    // Rule: Contractor cannot close or verify own NCR
    if (userRole === 'contractor_rep' && (status === 'CLOSED' || status === 'TPI_LAB_VERIFIED')) {
      await auditService.logEvent({
        action: 'PERMISSION_DENIED',
        userId: req.user?.id || req.user?.userId || 'contractor',
        userRole: req.user?.role || 'contractor_rep',
        organization: req.user?.organization || 'Contractor EPC',
        resourceType: 'QUALITY_NCR',
        resourceId: ncrId,
        details: { attemptedStatus: status, reason: 'Contractor cannot close own NCR' },
        ipAddress: req.ip || '127.0.0.1',
      });

      return res.status(403).json({
        error: {
          code: 'FORBIDDEN',
          message: 'Access denied: Contractor / EPC Representative cannot approve or close their own NCR. Independent Quality / TPI verification required.',
          statusCode: 403,
        },
      });
    }

    // Rule: Audit Observer cannot mutate operational NCR records
    if (userRole === 'audit_observer') {
      return res.status(403).json({
        error: {
          code: 'FORBIDDEN',
          message: 'Access denied: Audit Observer is strictly read-only and cannot mutate NCRs.',
          statusCode: 403,
        },
      });
    }

    const ncr = qualityService.updateNcrStatus(ncrId, {
      ...req.body,
      user: req.user,
    });

    if (status === 'CLOSED') {
      await auditService.logEvent({
        action: 'NCR_CLOSED',
        userId: req.user?.id || 'usr-quality-01',
        userRole: req.user?.role || 'quality_auditor',
        organization: req.user?.organization || 'Quality Directorate',
        resourceType: 'QUALITY_NCR',
        resourceId: ncrId,
        details: { status: 'CLOSED', verifiedBy: req.user?.fullName },
        ipAddress: req.ip || '127.0.0.1',
      });
    } else if (status === 'TPI_LAB_VERIFIED') {
      await auditService.logEvent({
        action: 'NCR_VERIFIED',
        userId: req.user?.id || 'usr-quality-01',
        userRole: req.user?.role || 'quality_auditor',
        organization: req.user?.organization || 'Quality Directorate',
        resourceType: 'QUALITY_NCR',
        resourceId: ncrId,
        details: { status: 'TPI_LAB_VERIFIED' },
        ipAddress: req.ip || '127.0.0.1',
      });
    }

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
    const userRole = normalizeRole(req.user?.role);
    if (userRole === 'audit_observer') {
      return res.status(403).json({
        error: {
          code: 'FORBIDDEN',
          message: 'Access denied: Audit Observer is strictly read-only.',
          statusCode: 403,
        },
      });
    }

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
    const updated = qualityService.verifySitePhotoAnomaly(photoId, req.body, req.user);
    res.status(200).json({
      data: updated,
      meta: { requiresPhysicalCheck: true },
      error: null,
    });
  } catch (err) {
    next(err);
  }
};

export const addQualityInspection = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = qualityService.addQualityInspection(id, req.body, req.user);
    res.status(201).json({
      data: result,
      meta: { message: 'Inspection log recorded' },
      error: null,
    });
  } catch (err) {
    next(err);
  }
};
