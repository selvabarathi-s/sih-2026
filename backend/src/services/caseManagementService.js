// ==============================================================================
// PAIMANA PREDICT — CASE MANAGEMENT & 11-FACTOR INVESTIGATION SERVICE
// Structured Case Files, Root-Cause Matrix, Evidence Submissions & Field Verification
// ==============================================================================

import { CASE_STATES } from '../models/stateMachines.js';
import { projectRepository } from '../repositories/projectRepository.js';
import { auditService } from './auditService.js';
import { eventBus, DOMAIN_EVENTS } from './eventBus.js';
import { responsibilityEngine } from './responsibilityEngine.js';

export const ROOT_CAUSE_FACTORS = [
  { id: 'LAND_ACQUISITION', name: 'Land Acquisition & ROW Clearance', weight: 0.18 },
  { id: 'FOREST_ENVIRONMENT_CLEARANCE', name: 'Forest & Environmental Statutory Clearances', weight: 0.15 },
  { id: 'UTILITY_SHIFTING', name: 'Utility Relocation (High Tension / Water / Gas)', weight: 0.10 },
  { id: 'LAW_AND_ORDER', name: 'Local Agitations, Right-of-Way Blockades & Law and Order', weight: 0.08 },
  { id: 'GEOLOGICAL_SURPRISE', name: 'Unforeseen Geotechnical Strata & Tunneling Anomalies', weight: 0.10 },
  { id: 'CONTRACTOR_FINANCIAL_DISTRESS', name: 'Contractor Working Capital Freeze & Liquidity Crisis', weight: 0.12 },
  { id: 'DPR_SCOPE_REVISION', name: 'DPR Alignment Inadequacy & Structural Scope Variations', weight: 0.09 },
  { id: 'INTER_AGENCY_COORDINATION', name: 'Inter-Ministerial & Inter-Departmental NOC Impasse', weight: 0.08 },
  { id: 'MATERIAL_SUPPLY_CHAIN', name: 'Raw Material (Cement/Steel/Aggregates) Transit Deficit', weight: 0.04 },
  { id: 'EQUIPMENT_DEFICIT', name: 'Specialist Machinery & TBM / Gantry Shortage', weight: 0.03 },
  { id: 'WEATHER_DISASTER', name: 'Extreme Meteorological & Flash Flood Disruptions', weight: 0.03 },
];

class CaseManagementService {
  constructor() {
    this.cases = new Map();
    this.seedDefaultCases();
  }

  seedDefaultCases() {
    const defaultCase = {
      caseId: 'CASE-2026-00101',
      projectId: 'PAI-706775',
      projectName: 'BharatNet Phase-II Optical Fiber Connectivity',
      title: 'Gram Panchayat Right-of-Way Clearance & Cable Laying Impasse',
      status: CASE_STATES.INVESTIGATION_IN_PROGRESS,
      severity: 'CRITICAL',
      triggerAlertId: 'SIG-706775',
      rootCauseMatrix: {
        LAND_ACQUISITION: { score: 9, notes: 'Forest corridor trenching permission held up across 3 districts.' },
        INTER_AGENCY_COORDINATION: { score: 8, notes: 'State PWD and NHAI joint crossing approvals pending 7 months.' },
        CONTRACTOR_FINANCIAL_DISTRESS: { score: 6, notes: 'Subcontractor optical fiber inventory liquidity shortage.' },
      },
      actionPlan: {
        planSummary: 'Establish dedicated state-level clearance taskforce with District Collectors and fast-track PWD road restoration NOCs.',
        targetResolutionDate: '2026-11-30',
        submittedBy: 'Amitabh Verma (Chief PGM)',
        submittedAt: new Date(Date.now() - 86400000 * 2).toISOString(),
      },
      evidenceList: [
        {
          evidenceId: 'EVD-001',
          documentType: 'ROW_HANDOVER_PROTOCOL',
          title: 'District Collector Joint Inspection Protocol (Bhiwandi-Thane)',
          url: 'https://paimana.gov.in/cases/doc_row_thane.pdf',
          uploadedBy: 'Amitabh Verma',
          uploadedAt: new Date(Date.now() - 86400000 * 1).toISOString(),
          status: 'PENDING_VERIFICATION',
        }
      ],
      fieldVerification: null,
      assignedOfficers: null,
      createdAt: new Date(Date.now() - 86400000 * 4).toISOString(),
      updatedAt: new Date().toISOString(),
    };

    this.cases.set(defaultCase.caseId, defaultCase);
  }

  async createCase(data, actor) {
    const { projectId, title, severity = 'HIGH', triggerAlertId, initialFactors } = data;
    if (!projectId || !title) {
      const err = new Error('projectId and title are required to open an investigation case.');
      err.statusCode = 400;
      throw err;
    }

    const project = await projectRepository.findById(projectId);
    if (!project) {
      const err = new Error(`Project ${projectId} not found.`);
      err.statusCode = 404;
      throw err;
    }

    const caseNum = Math.floor(10000 + Math.random() * 90000);
    const caseId = `CASE-${new Date().getFullYear()}-${caseNum}`;

    const responsibility = await responsibilityEngine.resolveResponsibility(projectId, 'INTERVENTION_REQUIRED', severity);

    const newCase = {
      caseId,
      projectId: project.project_id,
      projectName: project.project_name,
      title: title.trim(),
      status: CASE_STATES.OPENED,
      severity,
      triggerAlertId: triggerAlertId || null,
      rootCauseMatrix: initialFactors || {},
      actionPlan: null,
      evidenceList: [],
      fieldVerification: null,
      assignedOfficers: {
        primaryNodal: responsibility.primaryAssignee,
        supervisingOfficer: responsibility.supervisingOfficer,
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    this.cases.set(caseId, newCase);

    await auditService.logEvent({
      action: 'CASE_FILE_OPENED',
      userId: actor?.id || 'officer',
      userRole: actor?.role || 'monitoring_officer',
      resourceType: 'CASE_FILE',
      resourceId: caseId,
      details: { projectId, title, severity },
    });

    await eventBus.publish(DOMAIN_EVENTS.INTERVENTION_ASSIGNED, {
      caseFile: newCase,
      actor: { id: actor?.id, name: actor?.fullName, role: actor?.role },
      timestamp: newCase.createdAt,
    });

    return newCase;
  }

  async updateRootCauses(caseId, factorRatings, actor) {
    const caseFile = this.cases.get(caseId);
    if (!caseFile) {
      const err = new Error(`Case ${caseId} not found.`);
      err.statusCode = 404;
      throw err;
    }

    caseFile.rootCauseMatrix = { ...caseFile.rootCauseMatrix, ...factorRatings };
    caseFile.status = CASE_STATES.INVESTIGATION_IN_PROGRESS;
    caseFile.updatedAt = new Date().toISOString();

    await auditService.logEvent({
      action: 'CASE_ROOT_CAUSE_UPDATED',
      userId: actor?.id || 'officer',
      userRole: actor?.role || 'monitoring_officer',
      resourceType: 'CASE_FILE',
      resourceId: caseId,
      details: { factorRatings },
    });

    return caseFile;
  }

  async submitActionPlan(caseId, planData, actor) {
    const caseFile = this.cases.get(caseId);
    if (!caseFile) {
      const err = new Error(`Case ${caseId} not found.`);
      err.statusCode = 404;
      throw err;
    }

    const { planSummary, targetResolutionDate, keyDeliverables } = planData;
    if (!planSummary || !targetResolutionDate) {
      const err = new Error('planSummary and targetResolutionDate are mandatory.');
      err.statusCode = 400;
      throw err;
    }

    caseFile.actionPlan = {
      planSummary: planSummary.trim(),
      targetResolutionDate,
      keyDeliverables: keyDeliverables || [],
      submittedBy: actor?.fullName || 'Project Nodal Officer',
      submittedAt: new Date().toISOString(),
    };
    caseFile.status = CASE_STATES.ACTION_PLAN_SUBMITTED;
    caseFile.updatedAt = new Date().toISOString();

    await auditService.logEvent({
      action: 'CASE_ACTION_PLAN_SUBMITTED',
      userId: actor?.id || 'nodal',
      userRole: actor?.role || 'project_admin',
      resourceType: 'CASE_FILE',
      resourceId: caseId,
      details: { targetResolutionDate, planSummary },
    });

    return caseFile;
  }

  async uploadEvidence(caseId, evidenceData, actor) {
    const caseFile = this.cases.get(caseId);
    if (!caseFile) {
      const err = new Error(`Case ${caseId} not found.`);
      err.statusCode = 404;
      throw err;
    }

    const { documentType, title, url, geotag, notes } = evidenceData;
    if (!documentType || !title || !url) {
      const err = new Error('documentType, title, and url are mandatory for evidence upload.');
      err.statusCode = 400;
      throw err;
    }

    const evidenceId = `EVD-${Date.now()}`;
    const evidenceItem = {
      evidenceId,
      documentType,
      title: title.trim(),
      url,
      geotag: geotag || null,
      notes: notes || '',
      uploadedBy: actor?.fullName || 'Project Administrator',
      uploadedAt: new Date().toISOString(),
      status: 'PENDING_VERIFICATION',
    };

    caseFile.evidenceList.push(evidenceItem);
    caseFile.status = CASE_STATES.EVIDENCE_SUBMITTED;
    caseFile.updatedAt = new Date().toISOString();

    await auditService.logEvent({
      action: 'CASE_EVIDENCE_SUBMITTED',
      userId: actor?.id || 'nodal',
      userRole: actor?.role || 'project_admin',
      resourceType: 'CASE_FILE',
      resourceId: caseId,
      details: { evidenceId, title, documentType },
    });

    return caseFile;
  }

  async verifyEvidence(caseId, evidenceId, verificationData, actor) {
    const caseFile = this.cases.get(caseId);
    if (!caseFile) {
      const err = new Error(`Case ${caseId} not found.`);
      err.statusCode = 404;
      throw err;
    }

    if (actor?.role !== 'monitoring_officer' && actor?.role !== 'system_admin' && actor?.role !== 'data_platform_security_admin') {
      const err = new Error('Unauthorized: Only Monitoring Officers or Admins can perform field verification.');
      err.statusCode = 403;
      throw err;
    }

    const item = caseFile.evidenceList.find(e => e.evidenceId === evidenceId);
    if (!item) {
      const err = new Error(`Evidence item ${evidenceId} not found.`);
      err.statusCode = 404;
      throw err;
    }

    const { verified, comments, fieldInspectionConducted } = verificationData;

    item.status = verified ? 'VERIFIED' : 'REJECTED';
    item.verifiedBy = actor?.fullName || 'Monitoring Officer';
    item.verifiedAt = new Date().toISOString();
    item.verificationComments = comments || '';
    item.fieldInspectionConducted = Boolean(fieldInspectionConducted);

    const allVerified = caseFile.evidenceList.every(e => e.status === 'VERIFIED');
    if (allVerified) {
      caseFile.status = CASE_STATES.VERIFIED_RESOLVED;
    }

    caseFile.updatedAt = new Date().toISOString();

    await auditService.logEvent({
      action: 'CASE_EVIDENCE_VERIFIED',
      userId: actor?.id || 'officer',
      userRole: actor?.role || 'monitoring_officer',
      resourceType: 'CASE_FILE',
      resourceId: caseId,
      details: { evidenceId, verified, comments },
    });

    return caseFile;
  }

  getCase(caseId) {
    return this.cases.get(caseId) || null;
  }

  getAllCases(filters = {}) {
    let result = Array.from(this.cases.values());
    if (filters.projectId) {
      result = result.filter(c => c.projectId.toLowerCase() === filters.projectId.toLowerCase());
    }
    if (filters.status) {
      result = result.filter(c => c.status === filters.status);
    }
    return result;
  }
}

export const caseManagementService = new CaseManagementService();
