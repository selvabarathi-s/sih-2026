// ==============================================================================
// PAIMANA PREDICT — PROJECT LIFECYCLE SERVICE
// 14-State Operational Lifecycle Management with Rule Validation & Audit Trail
// ==============================================================================

import {
  PROJECT_OPERATIONAL_STATES,
  OPERATIONAL_STATE_TRANSITIONS,
  OPERATIONAL_TRANSITION_PERMISSIONS,
} from '../models/stateMachines.js';
import { projectRepository } from '../repositories/projectRepository.js';
import { auditService } from './auditService.js';
import { eventBus, DOMAIN_EVENTS } from './eventBus.js';

class ProjectLifecycleService {
  constructor() {
    // In-memory runtime state store mapping projectId -> current operational state & history
    this.projectStates = new Map();
    this.projectHistories = new Map();

    // Initialize state cache from existing projects
    this.initializeDefaultStates();
  }

  initializeDefaultStates() {
    // Seed default operational states for key demo projects
    const defaultMappings = [
      { id: 'PAI-706775', state: PROJECT_OPERATIONAL_STATES.INTERVENTION_REQUIRED, reason: 'Cost escalation >200% and GP fiber handover latency' },
      { id: 'PAI-705728', state: PROJECT_OPERATIONAL_STATES.INTERVENTION_IN_PROGRESS, reason: 'Maharashtra utility line shifting active taskforce' },
      { id: 'PAI-704992', state: PROJECT_OPERATIONAL_STATES.AT_RISK, reason: 'Forest clearance Stage 2 pending under MoEFCC' },
      { id: 'PAI-703881', state: PROJECT_OPERATIONAL_STATES.MONITORING, reason: 'Standard monthly reporting cycle ongoing' },
      { id: 'PAI-701244', state: PROJECT_OPERATIONAL_STATES.ACTIVE, reason: 'Initial mobilization complete, monthly cycle active' },
    ];

    for (const item of defaultMappings) {
      this.projectStates.set(item.id, item.state);
      this.projectHistories.set(item.id, [
        {
          fromState: PROJECT_OPERATIONAL_STATES.ACTIVE,
          toState: item.state,
          changedBy: 'system',
          role: 'system_admin',
          reason: item.reason,
          timestamp: new Date(Date.now() - 86400000 * 2).toISOString(),
        }
      ]);
    }
  }

  async getProjectState(projectId) {
    const cleanId = (projectId || '').trim();
    if (this.projectStates.has(cleanId)) {
      return this.projectStates.get(cleanId);
    }
    // Check with PAI- prefix
    const prefixed = cleanId.startsWith('PAI-') ? cleanId : `PAI-${cleanId}`;
    if (this.projectStates.has(prefixed)) {
      return this.projectStates.get(prefixed);
    }

    // Default: Check project repository; if exists, set default to MONITORING or AT_RISK based on cost growth
    const project = await projectRepository.findById(cleanId);
    if (!project) {
      return PROJECT_OPERATIONAL_STATES.DRAFT;
    }

    const state = (project.cost_growth_pct > 50 || project.schedule_extension_months > 24)
      ? PROJECT_OPERATIONAL_STATES.AT_RISK
      : PROJECT_OPERATIONAL_STATES.MONITORING;

    this.projectStates.set(project.project_id, state);
    return state;
  }

  initializeProjectState(projectId, initialState = PROJECT_OPERATIONAL_STATES.DRAFT) {
    const canonicalId = projectId.startsWith('PAI-') ? projectId : `PAI-${projectId}`;
    this.projectStates.set(canonicalId, initialState);
    return initialState;
  }

  async getStateHistory(projectId) {
    const cleanId = (projectId || '').trim();
    const prefixed = cleanId.startsWith('PAI-') ? cleanId : `PAI-${cleanId}`;
    return this.projectHistories.get(cleanId) || this.projectHistories.get(prefixed) || [];
  }

  async getAvailableTransitions(projectId, actor) {
    const currentState = await this.getProjectState(projectId);
    const candidateStates = OPERATIONAL_STATE_TRANSITIONS[currentState] || [];
    const actorRole = actor?.role || 'public';
    const isGlobalAdmin = actorRole === 'system_admin' || actorRole === 'data_platform_security_admin';

    const permitted = candidateStates.map(nextState => {
      const allowedRoles = OPERATIONAL_TRANSITION_PERMISSIONS[nextState] || [];
      const isRoleAllowed = allowedRoles.includes(actorRole) || isGlobalAdmin;

      return {
        toState: nextState,
        allowed: isRoleAllowed,
        requiredRole: allowedRoles,
      };
    });

    return {
      currentState,
      transitions: permitted,
    };
  }

  async transitionState(projectId, toState, actor, options = {}) {
    const { reason, evidenceRef, metadata = {} } = options;
    const currentState = await this.getProjectState(projectId);

    // 1. Verify valid state transition in state machine
    const allowedNextStates = OPERATIONAL_STATE_TRANSITIONS[currentState] || [];
    if (!allowedNextStates.includes(toState)) {
      const err = new Error(`Invalid lifecycle transition from ${currentState} to ${toState}. Allowed transitions: ${allowedNextStates.join(', ')}`);
      err.statusCode = 400;
      throw err;
    }

    // 2. Verify actor authorization
    const allowedRoles = OPERATIONAL_TRANSITION_PERMISSIONS[toState] || [];
    const actorRole = actor?.role || 'public';
    const isGlobalAdmin = actorRole === 'system_admin' || actorRole === 'data_platform_security_admin';
    if (!allowedRoles.includes(actorRole) && !isGlobalAdmin) {
      const err = new Error(`Unauthorized: Role '${actorRole}' is not permitted to transition project to ${toState}. Required: ${allowedRoles.join(' or ')}`);
      err.statusCode = 403;
      throw err;
    }

    // 3. Verify rationale requirement for critical transitions
    const requiresReason = [
      PROJECT_OPERATIONAL_STATES.AT_RISK,
      PROJECT_OPERATIONAL_STATES.INTERVENTION_REQUIRED,
      PROJECT_OPERATIONAL_STATES.RESOLVED,
      PROJECT_OPERATIONAL_STATES.COMPLETED,
      PROJECT_OPERATIONAL_STATES.CLOSED
    ];
    if (requiresReason.includes(toState) && (!reason || reason.trim().length < 10)) {
      const err = new Error(`Transition to ${toState} requires an official substantive justification (minimum 10 characters).`);
      err.statusCode = 400;
      throw err;
    }

    // 4. Commit state change
    const canonicalId = projectId.startsWith('PAI-') ? projectId : `PAI-${projectId}`;
    this.projectStates.set(canonicalId, toState);

    const historyEntry = {
      fromState: currentState,
      toState,
      changedBy: actor?.fullName || actor?.username || 'system',
      userId: actor?.id || 'system',
      role: actorRole,
      reason: reason || 'Routine operational progression',
      evidenceRef: evidenceRef || null,
      metadata,
      timestamp: new Date().toISOString(),
    };

    if (!this.projectHistories.has(canonicalId)) {
      this.projectHistories.set(canonicalId, []);
    }
    this.projectHistories.get(canonicalId).unshift(historyEntry);

    // 5. Append-only Audit Log
    await auditService.logEvent({
      action: 'PROJECT_STATE_TRANSITION',
      userId: actor?.id || 'system',
      userRole: actorRole,
      resourceType: 'PROJECT_LIFECYCLE',
      resourceId: canonicalId,
      details: {
        fromState: currentState,
        toState,
        reason,
        evidenceRef,
      },
    });

    // 6. Emit domain event
    await eventBus.publish(DOMAIN_EVENTS.PROJECT_STATE_CHANGED, {
      projectId: canonicalId,
      fromState: currentState,
      toState,
      actor: { id: actor?.id, role: actorRole, name: actor?.fullName },
      reason,
      timestamp: historyEntry.timestamp,
    });

    return {
      success: true,
      projectId: canonicalId,
      previousState: currentState,
      currentState: toState,
      historyEntry,
    };
  }
}

export const projectLifecycleService = new ProjectLifecycleService();
