/**
 * PAIMANA PREDICT — DOMAIN EVENT BUS (Part 48)
 * 
 * Central Event-Driven infrastructure enabling decoupled reactive workflows:
 * Event Published -> Subscribers React (Indicator update, Risk recalculation, Task creation, SLA timer, Audit log)
 */

import EventEmitter from 'events';
import { auditService } from './auditService.js';

export const DOMAIN_EVENTS = {
  // Project Lifecycle Events
  PROJECT_REGISTERED: 'PROJECT_REGISTERED',
  PROJECT_STATE_TRANSITIONED: 'PROJECT_STATE_TRANSITIONED',
  
  // Monitoring & Monthly Reporting Events
  REPORTING_CYCLE_OPENED: 'REPORTING_CYCLE_OPENED',
  PROJECT_UPDATE_DRAFT_SAVED: 'PROJECT_UPDATE_DRAFT_SAVED',
  PROJECT_UPDATE_SUBMITTED: 'PROJECT_UPDATE_SUBMITTED',
  PROJECT_UPDATE_APPROVED: 'PROJECT_UPDATE_APPROVED',
  PROJECT_UPDATE_REJECTED: 'PROJECT_UPDATE_REJECTED',
  PROJECT_INDICATORS_UPDATED: 'PROJECT_INDICATORS_UPDATED',
  
  // Risk & Early Warning Events
  RISK_RECALCULATED: 'RISK_RECALCULATED',
  RISK_DETERIORATION_DETECTED: 'RISK_DETERIORATION_DETECTED',
  EARLY_WARNING_GENERATED: 'EARLY_WARNING_GENERATED',
  EARLY_WARNING_ACKNOWLEDGED: 'EARLY_WARNING_ACKNOWLEDGED',
  
  // Case & Investigation Events
  CASE_OPENED: 'CASE_OPENED',
  INVESTIGATION_FACTOR_UPDATED: 'INVESTIGATION_FACTOR_UPDATED',
  CASE_CLOSED: 'CASE_CLOSED',
  
  // Intervention & SLA Events
  INTERVENTION_ASSIGNED: 'INTERVENTION_ASSIGNED',
  INTERVENTION_ACKNOWLEDGED: 'INTERVENTION_ACKNOWLEDGED',
  EVIDENCE_SUBMITTED: 'EVIDENCE_SUBMITTED',
  INTERVENTION_VERIFIED: 'INTERVENTION_VERIFIED',
  INTERVENTION_RESOLVED: 'INTERVENTION_RESOLVED',
  SLA_DUE_SOON: 'SLA_DUE_SOON',
  SLA_BREACHED: 'SLA_BREACHED',
  TASK_ESCALATED: 'TASK_ESCALATED',
  
  // Quality & Compliance Events
  QUALITY_INSPECTION_REQUESTED: 'QUALITY_INSPECTION_REQUESTED',
  QUALITY_FINDING_RECORDED: 'QUALITY_FINDING_RECORDED',
  QUALITY_VERIFIED: 'QUALITY_VERIFIED',
  
  // Decision & Governance Events
  DECISION_REQUESTED: 'DECISION_REQUESTED',
  DECISION_RECORDED: 'DECISION_RECORDED',
  HUMAN_OVERRIDE_RECORDED: 'HUMAN_OVERRIDE_RECORDED',
  
  // Systemic Risk & Dependencies
  SYSTEMIC_RISK_DETECTED: 'SYSTEMIC_RISK_DETECTED',
  DEPENDENCY_STATUS_CHANGED: 'DEPENDENCY_STATUS_CHANGED',
  
  // Data Governance & Corrections
  DATA_CORRECTION_REQUESTED: 'DATA_CORRECTION_REQUESTED',
  DATA_CORRECTION_APPROVED: 'DATA_CORRECTION_APPROVED',
  DATA_CORRECTION_REJECTED: 'DATA_CORRECTION_REJECTED',
  MODEL_DRIFT_DETECTED: 'MODEL_DRIFT_DETECTED',
};

class DomainEventBus extends EventEmitter {
  constructor() {
    super();
    this.setMaxListeners(50);
    this.eventHistory = [];
    this.setupAuditSubscriber();
  }

  /**
   * Automatically captures every published domain event into the audit trail
   */
  setupAuditSubscriber() {
    Object.values(DOMAIN_EVENTS).forEach(eventName => {
      this.on(eventName, async (payload) => {
        const record = {
          eventId: `evt-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
          event: eventName,
          timestamp: new Date().toISOString(),
          projectId: payload?.projectId || payload?.project_id || null,
          actor: payload?.actor || payload?.user || { id: 'system', role: 'SYSTEM' },
          details: payload?.details || payload,
        };

        this.eventHistory.unshift(record);
        if (this.eventHistory.length > 1000) {
          this.eventHistory = this.eventHistory.slice(0, 1000);
        }

        try {
          await auditService.logEvent({
            action: eventName,
            userId: record.actor.id || record.actor.userId || 'system',
            userRole: record.actor.role || 'SYSTEM',
            resourceType: 'DOMAIN_EVENT',
            resourceId: record.projectId || record.eventId,
            details: record.details,
          });
        } catch (err) {
          console.error(`[EventBus Audit Error] Failed to log ${eventName}:`, err.message);
        }
      });
    });
  }

  /**
   * Publishes a typed domain event across the system
   */
  publish(eventName, payload) {
    if (!DOMAIN_EVENTS[eventName]) {
      console.warn(`[EventBus] Unregistered domain event '${eventName}' published.`);
    }
    const enrichedPayload = {
      ...payload,
      _publishedAt: new Date().toISOString(),
    };
    this.emit(eventName, enrichedPayload);
    return enrichedPayload;
  }

  /**
   * Retrieves recent event log
   */
  getRecentEvents(limit = 50, filterEvent = null) {
    let list = this.eventHistory;
    if (filterEvent) {
      list = list.filter(e => e.event === filterEvent);
    }
    return list.slice(0, limit);
  }
}

export const eventBus = new DomainEventBus();
