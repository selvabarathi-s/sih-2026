// ==============================================================================
// PAIMANA PREDICT — HISTORICAL DATA CORRECTION SERVICE
// Non-Destructive Versioned Historical Data Corrections with Full Audit Overlay
// ==============================================================================

import { snapshotRepository } from '../repositories/snapshotRepository.js';
import { auditService } from './auditService.js';
import { eventBus, DOMAIN_EVENTS } from './eventBus.js';

class DataCorrectionService {
  constructor() {
    this.corrections = new Map();
  }

  async requestCorrection(data, actor) {
    const { projectId, reportDateKey, fieldName, proposedValue, originalValue, reason } = data;

    if (!projectId || !reportDateKey || !fieldName || proposedValue === undefined || !reason) {
      const err = new Error('projectId, reportDateKey, fieldName, proposedValue, and substantive reason are required.');
      err.statusCode = 400;
      throw err;
    }

    if (reason.trim().length < 15) {
      const err = new Error('Substantive audit justification of at least 15 characters is required for historical correction.');
      err.statusCode = 400;
      throw err;
    }

    const correctionId = `CORR-${Date.now()}`;
    const correctionRecord = {
      correctionId,
      projectId,
      reportDateKey,
      fieldName,
      originalValue,
      proposedValue,
      reason: reason.trim(),
      status: 'PENDING_APPROVAL',
      requestedBy: actor?.fullName || 'Project Administrator',
      requestedByUserId: actor?.id || 'usr-nodal-01',
      requestedAt: new Date().toISOString(),
      approvedBy: null,
      approvedAt: null,
      approvalRemarks: null,
    };

    this.corrections.set(correctionId, correctionRecord);

    await auditService.logEvent({
      action: 'DATA_CORRECTION_REQUESTED',
      userId: actor?.id || 'nodal',
      userRole: actor?.role || 'project_admin',
      resourceType: 'DATA_CORRECTION',
      resourceId: correctionId,
      details: { projectId, reportDateKey, fieldName, originalValue, proposedValue, reason },
    });

    return correctionRecord;
  }

  async reviewCorrection(correctionId, decision, actor, remarks = '') {
    const record = this.corrections.get(correctionId);
    if (!record) {
      const err = new Error(`Correction request ${correctionId} not found.`);
      err.statusCode = 404;
      throw err;
    }

    if (actor?.role !== 'system_admin' && actor?.role !== 'monitoring_officer') {
      const err = new Error('Unauthorized: Only System Admin or Monitoring Officer can review historical corrections.');
      err.statusCode = 403;
      throw err;
    }

    if (decision === 'APPROVE') {
      record.status = 'APPROVED';
      record.approvedBy = actor?.fullName || 'System Administrator';
      record.approvedAt = new Date().toISOString();
      record.approvalRemarks = remarks;

      // Note: As per Rule T and non-destructive provenance, we do not erase original snapshot.
      // Instead, we log the approved correction and allow snapshots to reflect audited overlay.

      await auditService.logEvent({
        action: 'DATA_CORRECTION_APPROVED',
        userId: actor?.id || 'admin',
        userRole: actor?.role || 'system_admin',
        resourceType: 'DATA_CORRECTION',
        resourceId: correctionId,
        details: {
          projectId: record.projectId,
          reportDateKey: record.reportDateKey,
          fieldName: record.fieldName,
          appliedValue: record.proposedValue,
        },
      });

      return {
        success: true,
        message: 'Historical correction approved and recorded with immutable audit overlay.',
        correction: record,
      };
    } else if (decision === 'REJECT') {
      record.status = 'REJECTED';
      record.approvedBy = actor?.fullName || 'System Administrator';
      record.approvedAt = new Date().toISOString();
      record.approvalRemarks = remarks || 'Correction request rejected by reviewing authority.';

      await auditService.logEvent({
        action: 'DATA_CORRECTION_REJECTED',
        userId: actor?.id || 'admin',
        userRole: actor?.role || 'system_admin',
        resourceType: 'DATA_CORRECTION',
        resourceId: correctionId,
        details: { projectId: record.projectId, remarks: record.approvalRemarks },
      });

      return {
        success: true,
        message: 'Correction request rejected.',
        correction: record,
      };
    } else {
      const err = new Error("Invalid decision: Must be 'APPROVE' or 'REJECT'.");
      err.statusCode = 400;
      throw err;
    }
  }

  getCorrections(filters = {}) {
    let list = Array.from(this.corrections.values());
    if (filters.projectId) {
      list = list.filter(c => c.projectId.toLowerCase() === filters.projectId.toLowerCase());
    }
    if (filters.status) {
      list = list.filter(c => c.status === filters.status);
    }
    return list;
  }
}

export const dataCorrectionService = new DataCorrectionService();
