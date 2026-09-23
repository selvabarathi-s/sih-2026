// ==============================================================================
// PAIMANA PREDICT — MONTHLY MONITORING & DATA INGESTION LIFECYCLE SERVICE
// Multi-Rule Validation, Optimistic Locking & Non-Destructive Snapshot Appending
// ==============================================================================

import { projectRepository } from '../repositories/projectRepository.js';
import { snapshotRepository } from '../repositories/snapshotRepository.js';
import { MONITORING_UPDATE_STATES, PROJECT_OPERATIONAL_STATES } from '../models/stateMachines.js';
import { auditService } from './auditService.js';
import { eventBus, DOMAIN_EVENTS } from './eventBus.js';
import { projectLifecycleService } from './projectLifecycleService.js';

class MonthlyMonitoringService {
  constructor() {
    this.activeReportingCycles = [
      {
        cycleId: 'CYCLE-2026-07',
        monthName: 'July 2026',
        periodKey: '2026-07',
        status: 'OPEN',
        openedAt: new Date(Date.now() - 86400000 * 5).toISOString(),
        submissionDeadline: '2026-08-07T23:59:59Z',
      },
      {
        cycleId: 'CYCLE-2026-06',
        monthName: 'June 2026',
        periodKey: '2026-06',
        status: 'CLOSED',
        openedAt: '2026-06-01T00:00:00Z',
        closedAt: '2026-07-05T23:59:59Z',
      },
    ];

    // In-memory submissions store mapping submissionId -> submission object
    this.submissions = new Map();
    this.seedDemoSubmissions();
  }

  seedDemoSubmissions() {
    const demoSub = {
      submissionId: 'SUB-2026-07-706775',
      cycleId: 'CYCLE-2026-07',
      periodKey: '2026-07',
      projectId: 'PAI-706775',
      projectCode: '706775',
      projectName: 'BharatNet Phase-II Optical Fiber Connectivity',
      status: MONITORING_UPDATE_STATES.SUBMITTED,
      submittedBy: 'Project Administrator',
      submittedByUserId: 'usr-nodal-01',
      physicalProgress: 41.2,
      previousPhysicalProgress: 40.8,
      cumulativeExpenditure: 32450.0,
      previousExpenditure: 32100.0,
      revisedCost: 61109.0,
      delayReasonCategory: 'LAND_ACQUISITION',
      delayReasonDetails: 'Right of Way permissions in 480 Gram Panchayats delayed pending state highway authority clearances.',
      siteInspectionReportUrl: 'https://paimana.gov.in/reports/bbnl_site_insp_jul2026.pdf',
      recordVersion: 1,
      validationFlags: [],
      officerRemarks: 'Submitted within SLA window. Awaiting Monitoring Officer verification.',
      submittedAt: new Date(Date.now() - 86400000 * 1).toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.submissions.set(demoSub.submissionId, demoSub);
  }

  getActiveCycles() {
    return this.activeReportingCycles;
  }

  getCurrentCycle() {
    return this.activeReportingCycles.find(c => c.status === 'OPEN') || this.activeReportingCycles[0];
  }

  async openNewReportingCycle(cycleData, actor) {
    if (actor?.role !== 'system_admin' && actor?.role !== 'monitoring_officer') {
      const err = new Error('Unauthorized: Only System Admin or Monitoring Officer can open new reporting cycles.');
      err.statusCode = 403;
      throw err;
    }

    const { monthName, periodKey, submissionDeadline } = cycleData;
    if (!monthName || !periodKey) {
      const err = new Error('monthName and periodKey are required (e.g., monthName: "August 2026", periodKey: "2026-08").');
      err.statusCode = 400;
      throw err;
    }

    // Close existing open cycles
    for (const cycle of this.activeReportingCycles) {
      if (cycle.status === 'OPEN') {
        cycle.status = 'CLOSED';
        cycle.closedAt = new Date().toISOString();
      }
    }

    const newCycle = {
      cycleId: `CYCLE-${periodKey}`,
      monthName,
      periodKey,
      status: 'OPEN',
      openedAt: new Date().toISOString(),
      submissionDeadline: submissionDeadline || new Date(Date.now() + 86400000 * 15).toISOString(),
    };

    this.activeReportingCycles.unshift(newCycle);

    await auditService.logEvent({
      action: 'REPORTING_CYCLE_OPENED',
      userId: actor?.id || 'system',
      userRole: actor?.role || 'system_admin',
      resourceType: 'MONITORING_CYCLE',
      resourceId: newCycle.cycleId,
      details: { monthName, periodKey },
    });

    await eventBus.publish(DOMAIN_EVENTS.MONITORING_CYCLE_OPENED, {
      cycle: newCycle,
      openedBy: actor?.fullName || actor?.username,
      timestamp: newCycle.openedAt,
    });

    return newCycle;
  }

  // Multi-rule Validation Engine for Monthly Telemetry
  validateSubmission(project, data) {
    const flags = [];
    const currentProgress = Number(data.physical_progress ?? data.physicalProgress ?? project.physical_progress ?? 0);
    const prevProgress = Number(project.physical_progress ?? 0);
    const currentExp = Number(data.cumulative_expenditure ?? data.cumulativeExpenditure ?? project.cumulative_expenditure ?? 0);
    const prevExp = Number(project.cumulative_expenditure ?? 0);
    const revisedCost = Number(data.revised_cost ?? data.revisedCost ?? project.revised_cost ?? project.original_cost);

    // Rule 1: Physical progress cannot decrease without explicit anomaly justification
    if (currentProgress < prevProgress) {
      const decreaseJustification = data.progressDecreaseReason || data.delayReasonDetails;
      if (!decreaseJustification || decreaseJustification.trim().length < 15) {
        flags.push({
          rule: 'RULE_PROGRESS_NON_DECREASING',
          severity: 'HIGH',
          message: `Physical progress reported (${currentProgress}%) is lower than previous record (${prevProgress}%). Substantive explanation (min 15 chars) is mandatory.`,
        });
      }
    }

    // Rule 2: Cumulative expenditure cannot exceed revised cost ceiling
    if (currentExp > revisedCost && revisedCost > 0) {
      flags.push({
        rule: 'RULE_EXPENDITURE_CEILING',
        severity: 'CRITICAL',
        message: `Cumulative expenditure (₹${currentExp} Cr) exceeds revised sanctioned cost (₹${revisedCost} Cr). Requires formal budget revision approval.`,
      });
    }

    // Rule 3: Expenditure delta cannot be negative
    if (currentExp < prevExp) {
      flags.push({
        rule: 'RULE_EXPENDITURE_NON_DECREASING',
        severity: 'HIGH',
        message: `Cumulative expenditure reported (₹${currentExp} Cr) is less than previous cumulative spend (₹${prevExp} Cr). Negative expenditure increments violate accounting standards.`,
      });
    }

    // Rule 4: Suspicious jump flag (>15% physical progress in a single month requires site inspection report)
    const progressJump = currentProgress - prevProgress;
    if (progressJump > 15) {
      if (!data.siteInspectionReportUrl && !data.site_inspection_report_url) {
        flags.push({
          rule: 'RULE_SUSPICIOUS_PROGRESS_SPIKE',
          severity: 'MEDIUM',
          message: `Progress spike (+${progressJump.toFixed(1)}% in one cycle) detected. Mandatory site inspection report upload required for verification.`,
        });
      }
    }

    // Rule 5: Delay reason taxonomy check
    if (data.delayReasonCategory && !['SCHEDULE_SLIPPAGE', 'COST_ESCALATION', 'STATUTORY_CLEARANCE', 'LAND_ACQUISITION', 'CONTRACTOR_DISTRESS', 'TECHNICAL_SCOPE', 'QUALITY_ASSURANCE', 'INTER_AGENCY_STALEMATE', 'WEATHER_DISASTER', 'NONE'].includes(data.delayReasonCategory)) {
      flags.push({
        rule: 'RULE_TAXONOMY_ALIGNMENT',
        severity: 'LOW',
        message: `Delay reason category '${data.delayReasonCategory}' does not match official MoSPI reference taxonomy.`,
      });
    }

    return {
      isValid: flags.filter(f => f.severity === 'CRITICAL').length === 0,
      flags,
    };
  }

  async createOrUpdateSubmission(data, actor, isDraft = false) {
    const { projectId, cycleId } = data;
    if (!projectId) {
      const err = new Error('projectId is required.');
      err.statusCode = 400;
      throw err;
    }

    const project = await projectRepository.findById(projectId);
    if (!project) {
      const err = new Error(`Project ${projectId} not found.`);
      err.statusCode = 404;
      throw err;
    }

    const cycle = cycleId
      ? this.activeReportingCycles.find(c => c.cycleId === cycleId)
      : this.getCurrentCycle();

    const submissionId = `SUB-${cycle.periodKey}-${project.project_code || project.project_id.replace('PAI-', '')}`;

    // Optimistic concurrency check
    const expectedVersion = Number(data.record_version ?? data.recordVersion ?? project.record_version ?? 1);
    if (project.record_version && project.record_version !== expectedVersion) {
      const err = new Error(`Concurrency Conflict: Project record has been updated by another process (Current Version: ${project.record_version}, Submitted: ${expectedVersion}). Please reload and retry.`);
      err.statusCode = 409;
      throw err;
    }

    const validation = this.validateSubmission(project, data);

    if (!isDraft && !validation.isValid) {
      const critical = validation.flags.filter(f => f.severity === 'CRITICAL').map(f => f.message).join(' | ');
      const err = new Error(`Validation Rejection: ${critical}`);
      err.statusCode = 422;
      err.validationFlags = validation.flags;
      throw err;
    }

    const status = isDraft
      ? MONITORING_UPDATE_STATES.DRAFT
      : (validation.flags.length > 0 ? MONITORING_UPDATE_STATES.VALIDATION_FLAGGED : MONITORING_UPDATE_STATES.SUBMITTED);

    const submissionRecord = {
      submissionId,
      cycleId: cycle.cycleId,
      periodKey: cycle.periodKey,
      projectId: project.project_id,
      projectCode: project.project_code,
      projectName: project.project_name,
      status,
      submittedBy: actor?.fullName || 'Project Nodal Officer',
      submittedByUserId: actor?.id || 'usr-nodal-01',
      physicalProgress: Number(data.physical_progress ?? data.physicalProgress ?? project.physical_progress ?? 0),
      previousPhysicalProgress: Number(project.physical_progress ?? 0),
      cumulativeExpenditure: Number(data.cumulative_expenditure ?? data.cumulativeExpenditure ?? project.cumulative_expenditure ?? 0),
      previousExpenditure: Number(project.cumulative_expenditure ?? 0),
      revisedCost: Number(data.revised_cost ?? data.revisedCost ?? project.revised_cost ?? project.original_cost),
      anticipatedCompletionDate: data.anticipated_completion_date || data.anticipatedCompletionDate || project.anticipated_completion_date,
      delayReasonCategory: data.delayReasonCategory || 'NONE',
      delayReasonDetails: data.delayReasonDetails || '',
      siteInspectionReportUrl: data.siteInspectionReportUrl || null,
      recordVersion: expectedVersion,
      validationFlags: validation.flags,
      officerRemarks: data.officerRemarks || '',
      submittedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    this.submissions.set(submissionId, submissionRecord);

    await auditService.logEvent({
      action: isDraft ? 'MONITORING_DRAFT_SAVED' : 'MONITORING_UPDATE_SUBMITTED',
      userId: actor?.id || 'nodal',
      userRole: actor?.role || 'project_admin',
      resourceType: 'MONITORING_SUBMISSION',
      resourceId: submissionId,
      details: {
        projectId: project.project_id,
        status,
        progress: submissionRecord.physicalProgress,
        expenditure: submissionRecord.cumulativeExpenditure,
        flagsCount: validation.flags.length,
      },
    });

    if (!isDraft) {
      await eventBus.publish(DOMAIN_EVENTS.PROJECT_UPDATE_SUBMITTED, {
        submission: submissionRecord,
        actor: { id: actor?.id, name: actor?.fullName, role: actor?.role },
      });
    }

    return {
      success: true,
      submission: submissionRecord,
      validation,
    };
  }

  async reviewSubmission(submissionId, decision, actor, remarks = '') {
    const submission = this.submissions.get(submissionId);
    if (!submission) {
      const err = new Error(`Submission ${submissionId} not found.`);
      err.statusCode = 404;
      throw err;
    }

    if (actor?.role !== 'monitoring_officer' && actor?.role !== 'system_admin' && actor?.role !== 'senior_decision_maker') {
      const err = new Error('Unauthorized: Only Monitoring Officers or Admins can review monitoring submissions.');
      err.statusCode = 403;
      throw err;
    }

    if (decision === 'ACCEPT') {
      submission.status = MONITORING_UPDATE_STATES.ACCEPTED;
      submission.reviewedBy = actor?.fullName || 'Monitoring Officer';
      submission.reviewedAt = new Date().toISOString();
      submission.reviewRemarks = remarks;

      // 1. Non-destructively append historical snapshot to snapshotRepository
      const cleanCode = submission.projectCode || submission.projectId.replace('PAI-', '');
      if (!snapshotRepository.snapshotsCache) {
        snapshotRepository.loadData();
      }
      if (!snapshotRepository.snapshotsCache) {
        snapshotRepository.snapshotsCache = {};
      }
      if (!snapshotRepository.snapshotsCache[cleanCode]) {
        snapshotRepository.snapshotsCache[cleanCode] = [];
      }

      const newSnapshot = {
        report_date_key: submission.periodKey,
        report_month_year: submission.cycleId.replace('CYCLE-', ''),
        physical_progress: submission.physicalProgress,
        cumulative_expenditure: submission.cumulativeExpenditure,
        revised_cost: submission.revisedCost,
        anticipated_completion_date: submission.anticipatedCompletionDate,
        created_at: submission.reviewedAt,
        provenance: 'REAL_PAIMANA',
        source_submission_id: submission.submissionId,
      };

      // Avoid duplicate snapshot for same period key
      const existingIdx = snapshotRepository.snapshotsCache[cleanCode].findIndex(s => s.report_date_key === submission.periodKey);
      if (existingIdx >= 0) {
        snapshotRepository.snapshotsCache[cleanCode][existingIdx] = newSnapshot;
      } else {
        snapshotRepository.snapshotsCache[cleanCode].push(newSnapshot);
      }

      // 2. Update master project in projectRepository
      const project = await projectRepository.findById(submission.projectId);
      if (project) {
        project.physical_progress = submission.physicalProgress;
        project.cumulative_expenditure = submission.cumulativeExpenditure;
        project.revised_cost = submission.revisedCost;
        if (submission.anticipatedCompletionDate) {
          project.anticipated_completion_date = submission.anticipatedCompletionDate;
        }
        project.record_version = (project.record_version || 1) + 1;
        project.last_monitored_cycle = submission.cycleId;
        project.updated_at = new Date().toISOString();
      }

      // 3. Audit log
      await auditService.logEvent({
        action: 'MONITORING_UPDATE_ACCEPTED',
        userId: actor?.id || 'officer',
        userRole: actor?.role || 'monitoring_officer',
        resourceType: 'MONITORING_SUBMISSION',
        resourceId: submissionId,
        details: {
          projectId: submission.projectId,
          periodKey: submission.periodKey,
          approvedBy: actor?.fullName,
        },
      });

      // 4. Publish approval event (triggers automated recalculation)
      await eventBus.publish(DOMAIN_EVENTS.PROJECT_UPDATE_APPROVED, {
        submission,
        project,
        reviewedBy: actor?.fullName,
        timestamp: submission.reviewedAt,
      });

      return {
        success: true,
        message: 'Submission approved and project baseline snapshot successfully appended.',
        submission,
      };
    } else if (decision === 'REJECT') {
      submission.status = MONITORING_UPDATE_STATES.REJECTED_WITH_REMARKS;
      submission.reviewedBy = actor?.fullName || 'Monitoring Officer';
      submission.reviewedAt = new Date().toISOString();
      submission.reviewRemarks = remarks || 'Submission rejected due to validation anomalies. Resubmission required.';

      await auditService.logEvent({
        action: 'MONITORING_UPDATE_REJECTED',
        userId: actor?.id || 'officer',
        userRole: actor?.role || 'monitoring_officer',
        resourceType: 'MONITORING_SUBMISSION',
        resourceId: submissionId,
        details: {
          projectId: submission.projectId,
          remarks: submission.reviewRemarks,
        },
      });

      await eventBus.publish(DOMAIN_EVENTS.PROJECT_UPDATE_REJECTED, {
        submission,
        remarks: submission.reviewRemarks,
        reviewedBy: actor?.fullName,
        timestamp: submission.reviewedAt,
      });

      return {
        success: true,
        message: 'Submission rejected with remarks dispatched to Project Nodal Officer.',
        submission,
      };
    } else {
      const err = new Error("Invalid decision: Must be 'ACCEPT' or 'REJECT'.");
      err.statusCode = 400;
      throw err;
    }
  }

  getSubmissions(filters = {}) {
    let result = Array.from(this.submissions.values());
    const { projectId, cycleId, status } = filters;

    if (projectId) {
      result = result.filter(s => s.projectId.toLowerCase() === projectId.toLowerCase());
    }
    if (cycleId) {
      result = result.filter(s => s.cycleId === cycleId);
    }
    if (status) {
      result = result.filter(s => s.status === status);
    }

    return result;
  }
}

export const monthlyMonitoringService = new MonthlyMonitoringService();
