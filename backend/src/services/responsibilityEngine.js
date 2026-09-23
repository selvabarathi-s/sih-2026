// ==============================================================================
// PAIMANA PREDICT — RESPONSIBILITY & WORKLOAD ENGINE
// Algorithmic Ownership Resolution & Cross-Role Operational Workload Dispatch
// ==============================================================================

import { SEED_USERS, ROLES } from '../models/userModel.js';
import { projectRepository } from '../repositories/projectRepository.js';
import { actionService } from './actionService.js';
import { alertService } from './alertService.js';
import { monthlyMonitoringService } from './monthlyMonitoringService.js';

class ResponsibilityEngine {
  constructor() {
    this.officerDirectory = SEED_USERS;
  }

  // Algorithmic Task & Warning Ownership Assignment
  async resolveResponsibility(projectId, issueCategory, severity = 'HIGH') {
    const project = await projectRepository.findById(projectId);
    const agency = project?.agency || 'NHAI';
    const ministry = project?.ministry || 'MORTH';

    // Primary officer mapping based on role and project assignment
    let primaryOfficer = this.officerDirectory.find(
      u => u.role === ROLES.PROJECT_ADMIN && (u.assignedProjects?.includes(projectId) || u.assignedProjects?.includes(project?.project_code))
    );

    if (!primaryOfficer) {
      primaryOfficer = this.officerDirectory.find(u => u.role === ROLES.PROJECT_ADMIN) || {
        id: 'usr-nodal-generic',
        fullName: `${agency} Project Director`,
        email: `director@${agency.toLowerCase()}.gov.in`,
        role: ROLES.PROJECT_ADMIN,
        designation: 'Project Director / Nodal Officer',
      };
    }

    // Supervising Monitoring Officer (MoSPI Surveillance Division)
    const supervisingOfficer = this.officerDirectory.find(u => u.role === ROLES.MONITORING_OFFICER) || {
      id: 'usr-officer-01',
      fullName: 'Monitoring Officer',
      email: 'monitoring.officer@mospi.gov.in',
      role: ROLES.MONITORING_OFFICER,
      designation: 'Joint Director (Surveillance)',
    };

    // Tier 2 Escalation Authority (Joint Secretary / Ministry Head)
    const tier2Escalation = {
      id: 'usr-js-infra',
      fullName: `Joint Secretary (${ministry})`,
      email: `js.infra@${ministry.toLowerCase()}.gov.in`,
      role: 'ministry_joint_secretary',
      designation: 'Joint Secretary (Infrastructure Monitoring)',
    };

    // Tier 3 Escalation Authority (Senior Decision Maker / PMO / Cabinet Sec)
    const tier3Escalation = this.officerDirectory.find(u => u.role === ROLES.DECISION_MAKER) || {
      id: 'usr-secretary-01',
      fullName: 'Senior Decision Maker',
      email: 'senior.decisionmaker@cabinet.gov.in',
      role: ROLES.DECISION_MAKER,
      designation: 'Secretary (Infrastructure & Coordination)',
    };

    return {
      projectId,
      agency,
      ministry,
      issueCategory,
      severity,
      primaryAssignee: primaryOfficer,
      supervisingOfficer,
      escalationHierarchy: {
        tier1: { role: 'Nodal Officer / Chief PGM', officer: primaryOfficer, windowHours: 48 },
        tier2: { role: 'Joint Secretary (Ministry)', officer: tier2Escalation, windowHours: 168 }, // 7 days
        tier3: { role: 'Cabinet Secretariat / PMO', officer: tier3Escalation, windowHours: 336 }, // 14 days
      },
    };
  }

  // Aggregate User Workload Inbox across all operational subsystems
  async getMyWorkload(user) {
    const userRole = user?.role || ROLES.MONITORING_OFFICER;
    const userId = user?.id || user?.userId || 'usr-officer-01';

    // 1. Actions / Tasks
    const allActionsRes = await actionService.getAllActions({});
    const allActions = allActionsRes.actions || [];

    const myTasks = allActions.filter(a => {
      if (userRole === ROLES.SYSTEM_ADMIN) return true;
      if (userRole === ROLES.PROJECT_ADMIN) {
        return a.assignedRole === 'PROJECT_ADMIN' || a.assignedTo?.toLowerCase().includes('nodal') || a.assignedTo?.toLowerCase().includes(user.fullName?.toLowerCase() || '');
      }
      if (userRole === ROLES.MONITORING_OFFICER) {
        return a.assignedRole === 'MONITORING_OFFICER' || a.status === 'EVIDENCE_SUBMITTED' || a.status === 'OFFICER_REVIEW';
      }
      if (userRole === ROLES.DECISION_MAKER) {
        return a.priority === 'CRITICAL';
      }
      return true;
    });

    // 2. Early Warnings
    const allAlerts = await alertService.getAlerts({});
    const myWarnings = allAlerts.filter(w => {
      const pId = w.projectId || w.project_id;
      if (userRole === ROLES.PROJECT_ADMIN) {
        return user.assignedProjects?.includes(pId) || user.assignedProjects?.includes('ALL_SURVEILLANCE') || pId === 'PAI-706775';
      }
      if (userRole === ROLES.MONITORING_OFFICER) {
        return w.status === 'UNACKNOWLEDGED' || w.status === 'DETECTED' || w.severity === 'CRITICAL' || w.severity === 'HIGH';
      }
      if (userRole === ROLES.DECISION_MAKER) {
        return w.severity === 'CRITICAL';
      }
      return true;
    });

    // 3. Submissions & Approvals Pending
    const submissions = monthlyMonitoringService.getSubmissions();
    const myApprovals = submissions.filter(s => {
      if (userRole === ROLES.MONITORING_OFFICER || userRole === ROLES.SYSTEM_ADMIN) {
        return s.status === 'SUBMITTED' || s.status === 'VALIDATION_FLAGGED' || s.status === 'UNDER_REVIEW';
      }
      return false;
    });

    // 4. Overdue Deadlines & SLAs
    const now = Date.now();
    const myDeadlines = myTasks.filter(t => {
      if (!t.targetCompletionDate) return false;
      const dueTime = new Date(t.targetCompletionDate).getTime();
      return dueTime < now || (dueTime - now < 86400000 * 3); // Overdue or due within 3 days
    });

    return {
      user: {
        id: userId,
        fullName: user?.fullName || 'Authorized Officer',
        role: userRole,
      },
      summary: {
        totalPendingTasks: myTasks.length,
        activeWarnings: myWarnings.length,
        pendingApprovals: myApprovals.length,
        slaAttentionRequired: myDeadlines.length,
      },
      tasks: myTasks,
      warnings: myWarnings,
      approvals: myApprovals,
      deadlines: myDeadlines,
    };
  }
}

export const responsibilityEngine = new ResponsibilityEngine();
