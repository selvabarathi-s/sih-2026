import { ACTION_STATES, ACTION_STATE_TRANSITIONS, evaluateProjectRiskState } from '../models/stateMachines.js';
import { projectRepository } from '../repositories/projectRepository.js';
import { auditService } from './auditService.js';
import { notificationService } from './notificationService.js';

class ActionService {
  constructor() {
    this.actions = [
      {
        id: 'act-101',
        projectId: 'PAI-706775',
        projectName: 'BharatNet',
        title: 'Establish Special Taskforce for GP Fiber Handover',
        assignedTo: 'Amitabh Verma (Chief PGM)',
        assignedRole: 'PROJECT_ADMIN',
        assignedBy: 'Priya Iyer (Monitoring Officer)',
        priority: 'CRITICAL',
        status: ACTION_STATES.ACTION_ASSIGNED,
        targetCompletionDate: '2026-11-30',
        progressNotes: 'Taskforce notified; inter-ministerial coordination meeting scheduled.',
        evidenceUrls: [],
        createdAt: new Date(Date.now() - 86400000).toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: 'act-102',
        projectId: 'PAI-705728',
        projectName: 'Mumbai-Ahmedabad High Speed Rail',
        title: 'Expedite Maharashtra State Utility Line Shifting Clearances',
        assignedTo: 'Nodal Officer (NHSRCL)',
        assignedRole: 'PROJECT_ADMIN',
        assignedBy: 'Rajesh Sharma (Director)',
        priority: 'HIGH',
        status: ACTION_STATES.IN_PROGRESS,
        targetCompletionDate: '2026-12-15',
        progressNotes: '4 out of 7 power grid transmission lines shifted successfully.',
        evidenceUrls: ['https://paimana.gov.in/docs/clearance_cert_mumbai.pdf'],
        createdAt: new Date(Date.now() - 172800000).toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ];
  }

  async getAllActions(filters = {}) {
    let result = [...this.actions];
    const { projectId, status, assignedRole } = filters;

    if (projectId) {
      result = result.filter(a => a.projectId.toLowerCase() === projectId.toLowerCase());
    }
    if (status) {
      result = result.filter(a => a.status === status);
    }
    if (assignedRole) {
      result = result.filter(a => a.assignedRole === assignedRole);
    }

    return {
      count: result.length,
      actions: result,
    };
  }

  async assignAction(data, user) {
    const newAction = {
      id: `act-${Date.now()}`,
      projectId: data.projectId,
      projectName: data.projectName || data.projectId,
      title: data.title,
      assignedTo: data.assignedTo || 'Project Nodal Officer',
      assignedRole: data.assignedRole || 'PROJECT_ADMIN',
      assignedBy: user?.fullName || 'Monitoring Officer',
      priority: data.priority || 'HIGH',
      status: ACTION_STATES.ACTION_ASSIGNED,
      targetCompletionDate: data.targetCompletionDate || '2026-12-31',
      progressNotes: data.initialNotes || '',
      evidenceUrls: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    this.actions.unshift(newAction);

    // Audit log
    await auditService.logEvent({
      action: 'ACTION_ASSIGNED',
      userId: user?.userId || 'officer',
      userRole: user?.role || 'MONITORING_OFFICER',
      resourceType: 'PROJECT_ACTION',
      resourceId: newAction.id,
      details: { projectId: data.projectId, title: data.title, priority: data.priority },
    });

    // Notify Project Administrator
    await notificationService.createNotification({
      type: 'ACTION_ASSIGNED',
      title: `New Action Assigned: ${data.title}`,
      message: `Action assigned for ${data.projectName || data.projectId}. Target: ${newAction.targetCompletionDate}`,
      targetRoles: ['PROJECT_ADMIN'],
      projectId: data.projectId,
      severity: data.priority === 'CRITICAL' ? 'CRITICAL' : 'HIGH',
    });

    return newAction;
  }

  async updateActionStatus(actionId, statusUpdate, user) {
    const action = this.actions.find(a => a.id === actionId);
    if (!action) {
      throw new Error(`Action '${actionId}' not found`);
    }

    const { newStatus, notes, evidenceUrl } = statusUpdate;
    const allowedTransitions = ACTION_STATE_TRANSITIONS[action.status] || [];

    if (newStatus && !allowedTransitions.includes(newStatus)) {
      throw new Error(`Invalid state transition from '${action.status}' to '${newStatus}'. Allowed: [${allowedTransitions.join(', ')}]`);
    }

    if (newStatus) action.status = newStatus;
    if (notes) action.progressNotes = notes;
    if (evidenceUrl) action.evidenceUrls.push(evidenceUrl);
    action.updatedAt = new Date().toISOString();

    // Audit log
    await auditService.logEvent({
      action: 'ACTION_UPDATED',
      userId: user?.userId || 'nodal',
      userRole: user?.role || 'PROJECT_ADMIN',
      resourceType: 'PROJECT_ACTION',
      resourceId: action.id,
      details: { projectId: action.projectId, newStatus: action.status, notes },
    });

    return action;
  }

  async updateProjectProgress(projectId, updateData, user) {
    const project = await projectRepository.findById(projectId);
    if (!project) {
      throw new Error(`Project '${projectId}' not found`);
    }

    // Apply numerical updates
    if (updateData.physical_progress !== undefined) {
      project.physical_progress = Number(updateData.physical_progress);
    }
    if (updateData.cumulative_expenditure !== undefined) {
      project.cumulative_expenditure = Number(updateData.cumulative_expenditure);
      if (project.revised_cost > 0) {
        project.expenditure_ratio_pct = Number(((project.cumulative_expenditure / project.revised_cost) * 100).toFixed(2));
      }
    }
    if (updateData.target_completion_date) {
      project.target_completion_date = updateData.target_completion_date;
    }

    // Recalculate dynamic risk state
    const newRiskState = evaluateProjectRiskState(project);
    project.current_risk_state = newRiskState;
    project.last_updated_at = new Date().toISOString();
    project.last_updated_by = user?.fullName || 'Nodal Officer';

    // Audit log
    await auditService.logEvent({
      action: 'PROJECT_UPDATED',
      userId: user?.userId || 'nodal',
      userRole: user?.role || 'PROJECT_ADMIN',
      resourceType: 'PROJECT',
      resourceId: project.project_id,
      details: {
        physical_progress: project.physical_progress,
        cumulative_expenditure: project.cumulative_expenditure,
        new_risk_state: newRiskState,
      },
    });

    // Notify Monitoring Officers of project progress updates
    await notificationService.createNotification({
      type: 'PROJECT_RESPONSE',
      title: `Progress Updated: ${project.project_name}`,
      message: `Reported physical progress updated to ${project.physical_progress}%. Recalculated state: ${newRiskState}.`,
      targetRoles: ['MONITORING_OFFICER', 'DECISION_MAKER'],
      projectId: project.project_id,
      severity: newRiskState === 'CRITICAL' ? 'CRITICAL' : 'INFO',
    });

    return {
      message: 'Project updated successfully. Risk recalculated dynamically.',
      project,
      risk_state: newRiskState,
    };
  }
}

export const actionService = new ActionService();
