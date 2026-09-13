// ==============================================================================
// PAIMANA PREDICT — EXECUTIVE DECISION BRIEF & RESOLUTION WORKFLOW
// Options A/B/C Trade-off Matrix, Impact Scoring & Senior Executive Directives
// ==============================================================================

import { DECISION_STATES } from '../models/stateMachines.js';
import { projectRepository } from '../repositories/projectRepository.js';
import { auditService } from './auditService.js';
import { eventBus, DOMAIN_EVENTS } from './eventBus.js';

class DecisionWorkflowService {
  constructor() {
    this.decisionBriefs = new Map();
    this.seedDefaultBriefs();
  }

  seedDefaultBriefs() {
    const demoBrief = {
      briefId: 'DEC-2026-00042',
      projectId: 'PAI-706775',
      projectName: 'BharatNet Phase-II Optical Fiber Connectivity',
      title: 'High-Level Strategic Resolution for GP Optical Fiber Stoppage',
      status: DECISION_STATES.PENDING_REVIEW,
      criticality: 'CRITICAL',
      backgroundSummary: 'BharatNet Phase-II has incurred 207% cost revision and 60 months schedule delay due to right-of-way permissions in 480 Gram Panchayats.',
      options: [
        {
          optionId: 'OPT_A',
          title: 'Option A: Scope Rationalization & Phase Freeze',
          costImpactCr: 0,
          scheduleImpactMonths: 3,
          legalRisk: 'LOW',
          description: 'Freeze GP connectivity at 85% completion, hand over completed Gram Panchayats to state telecom discoms, drop contested remote nodes.',
          tradeOffs: 'Immediate fiscal containment; leaves 15% remote tribal blocks without fiber until Phase-III.',
        },
        {
          optionId: 'OPT_B',
          title: 'Option B: Inter-Ministerial Fast-Track & Baseline Extension (Recommended)',
          costImpactCr: 1250,
          scheduleImpactMonths: 9,
          legalRisk: 'MEDIUM',
          description: 'Convene Empowered Committee with Ministry of MoRTH and State PWD to grant blanket Right-of-Way exemption with ₹1,250 Cr additional budgetary sanction.',
          tradeOffs: 'Delivers 100% promised digital connectivity; requires cabinet economic committee approval.',
        },
        {
          optionId: 'OPT_C',
          title: 'Option C: EPC Contract Termination & Retendering',
          costImpactCr: 2800,
          scheduleImpactMonths: 24,
          legalRisk: 'HIGH',
          description: 'Issue immediate default notice to non-performing consortium, invoke bank guarantees, and retender balance works.',
          tradeOffs: 'Enforces strict contractor accountability; introduces 2-year arbitration delay and severe cost escalation.',
        },
      ],
      selectedOption: null,
      directiveIssued: null,
      submittedBy: 'Priya Iyer (Joint Director MoSPI)',
      submittedAt: new Date(Date.now() - 86400000 * 2).toISOString(),
      updatedAt: new Date().toISOString(),
    };

    this.decisionBriefs.set(demoBrief.briefId, demoBrief);
  }

  async createDecisionBrief(data, actor) {
    const { projectId, title, backgroundSummary, options } = data;
    if (!projectId || !title) {
      const err = new Error('projectId and title are required for decision brief.');
      err.statusCode = 400;
      throw err;
    }

    const project = await projectRepository.findById(projectId);
    if (!project) {
      const err = new Error(`Project ${projectId} not found.`);
      err.statusCode = 404;
      throw err;
    }

    const briefId = `DEC-${new Date().getFullYear()}-${Math.floor(10000 + Math.random() * 90000)}`;

    const newBrief = {
      briefId,
      projectId: project.project_id,
      projectName: project.project_name,
      title: title.trim(),
      status: DECISION_STATES.PENDING_REVIEW,
      criticality: data.criticality || 'HIGH',
      backgroundSummary: backgroundSummary || 'Executive brief submitted for inter-ministerial resolution.',
      options: options || [],
      selectedOption: null,
      directiveIssued: null,
      submittedBy: actor?.fullName || 'Monitoring Officer',
      submittedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    this.decisionBriefs.set(briefId, newBrief);

    await auditService.logEvent({
      action: 'DECISION_BRIEF_CREATED',
      userId: actor?.id || 'officer',
      userRole: actor?.role || 'monitoring_officer',
      resourceType: 'DECISION_BRIEF',
      resourceId: briefId,
      details: { projectId, title },
    });

    return newBrief;
  }

  async issueExecutiveDirective(briefId, directiveData, actor) {
    const brief = this.decisionBriefs.get(briefId);
    if (!brief) {
      const err = new Error(`Decision brief ${briefId} not found.`);
      err.statusCode = 404;
      throw err;
    }

    // Role check: Senior Decision Maker or System Admin only
    if (actor?.role !== 'senior_decision_maker' && actor?.role !== 'system_admin') {
      const err = new Error('Unauthorized: Only Senior Decision Makers (Cabinet Sec / PMO) can issue executive directives.');
      err.statusCode = 403;
      throw err;
    }

    const { selectedOptionId, justification, immediateActions, directiveNoticeRef } = directiveData;
    if (!selectedOptionId || !justification) {
      const err = new Error('selectedOptionId and justification are mandatory.');
      err.statusCode = 400;
      throw err;
    }

    const chosenOption = brief.options.find(o => o.optionId === selectedOptionId);
    if (!chosenOption) {
      const err = new Error(`Option ${selectedOptionId} not found in brief options.`);
      err.statusCode = 400;
      throw err;
    }

    brief.selectedOption = chosenOption;
    brief.status = DECISION_STATES.DIRECTIVE_ISSUED;
    brief.directiveIssued = {
      directiveId: `DIR-${Date.now()}`,
      issuedBy: actor?.fullName || 'V. K. Sundaram (Secretary Infrastructure)',
      issuedByRole: actor?.role,
      directiveNoticeRef: directiveNoticeRef || `CAB-SEC/INFRA/${new Date().getFullYear()}/${brief.briefId}`,
      justification: justification.trim(),
      immediateActions: immediateActions || [],
      issuedAt: new Date().toISOString(),
    };
    brief.updatedAt = new Date().toISOString();

    await auditService.logEvent({
      action: 'EXECUTIVE_DIRECTIVE_ISSUED',
      userId: actor?.id || 'secretary',
      userRole: actor?.role || 'senior_decision_maker',
      resourceType: 'DECISION_BRIEF',
      resourceId: briefId,
      details: {
        directiveId: brief.directiveIssued.directiveId,
        selectedOption: selectedOptionId,
        projectId: brief.projectId,
      },
    });

    await eventBus.publish(DOMAIN_EVENTS.DECISION_PROPOSED, {
      briefId,
      projectId: brief.projectId,
      directive: brief.directiveIssued,
      timestamp: brief.directiveIssued.issuedAt,
    });

    return brief;
  }

  getDecisionBrief(briefId) {
    return this.decisionBriefs.get(briefId) || null;
  }

  getAllBriefs(filters = {}) {
    let list = Array.from(this.decisionBriefs.values());
    if (filters.projectId) {
      list = list.filter(b => b.projectId.toLowerCase() === filters.projectId.toLowerCase());
    }
    if (filters.status) {
      list = list.filter(b => b.status === filters.status);
    }
    return list;
  }
}

export const decisionWorkflowService = new DecisionWorkflowService();
