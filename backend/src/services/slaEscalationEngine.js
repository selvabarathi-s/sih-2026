// ==============================================================================
// PAIMANA PREDICT — SLA & AUTOMATED ESCALATION ENGINE
// Multi-Tier Breach Detection, Deadlines Tracking & Automated Escalations
// ==============================================================================

import { auditService } from './auditService.js';
import { eventBus, DOMAIN_EVENTS } from './eventBus.js';
import { notificationService } from './notificationService.js';

export const SLA_TIERS = {
  IN_SLA: 'IN_SLA',
  APPROACHING_DEADLINE: 'APPROACHING_DEADLINE',
  BREACH_TIER1: 'BREACH_TIER1', // Nodal + Monitoring Officer
  BREACH_TIER2: 'BREACH_TIER2', // Ministry Joint Secretary
  BREACH_TIER3: 'BREACH_TIER3', // PMO / Cabinet Secretariat
};

class SlaEscalationEngine {
  constructor() {
    this.trackers = new Map();
    this.seedDefaultTrackers();
  }

  seedDefaultTrackers() {
    // Seed an approaching SLA and an active breach for realistic operational monitoring
    this.registerSlaTracker({
      entityType: 'ALERT',
      entityId: 'SIG-706775',
      projectId: 'PAI-706775',
      projectName: 'BharatNet Phase-II',
      slaType: 'WARNING_ACKNOWLEDGMENT',
      deadlineHours: 48,
      createdAt: new Date(Date.now() - 3600000 * 52).toISOString(), // 52 hours ago -> Tier 1 breach
      currentTier: SLA_TIERS.BREACH_TIER1,
    });

    this.registerSlaTracker({
      entityType: 'ACTION',
      entityId: 'act-101',
      projectId: 'PAI-706775',
      projectName: 'BharatNet Phase-II',
      slaType: 'CORRECTIVE_EVIDENCE',
      deadlineHours: 336, // 14 days
      createdAt: new Date(Date.now() - 3600000 * 200).toISOString(),
      currentTier: SLA_TIERS.IN_SLA,
    });
  }

  registerSlaTracker(item) {
    const trackerId = `SLA-${item.entityType}-${item.entityId}`;
    const createdAt = new Date(item.createdAt || Date.now());
    const deadlineMs = (item.deadlineHours || 48) * 3600 * 1000;
    const targetDeadline = new Date(createdAt.getTime() + deadlineMs).toISOString();

    const tracker = {
      trackerId,
      entityType: item.entityType,
      entityId: item.entityId,
      projectId: item.projectId,
      projectName: item.projectName || item.projectId,
      slaType: item.slaType || 'STANDARD_INTERVENTION',
      createdAt: createdAt.toISOString(),
      targetDeadline,
      deadlineHours: item.deadlineHours || 48,
      currentTier: item.currentTier || SLA_TIERS.IN_SLA,
      escalationHistory: [
        {
          tier: item.currentTier || SLA_TIERS.IN_SLA,
          timestamp: createdAt.toISOString(),
          reason: 'Initial SLA window initialized',
        }
      ],
      resolved: false,
    };

    this.trackers.set(trackerId, tracker);
    return tracker;
  }

  resolveSlaTracker(entityType, entityId, notes = '') {
    const trackerId = `SLA-${entityType}-${entityId}`;
    const tracker = this.trackers.get(trackerId);
    if (tracker) {
      tracker.resolved = true;
      tracker.resolvedAt = new Date().toISOString();
      tracker.resolutionNotes = notes;
    }
  }

  async evaluateAllSlas() {
    const now = Date.now();
    const results = [];

    for (const [id, tracker] of this.trackers.entries()) {
      if (tracker.resolved) continue;

      const createdMs = new Date(tracker.createdAt).getTime();
      const deadlineMs = new Date(tracker.targetDeadline).getTime();
      const elapsedHours = (now - createdMs) / 3600000;
      const baseLimit = tracker.deadlineHours;

      let newTier = tracker.currentTier;
      let escalationReason = null;

      // Tier Calculation:
      // T3: 3x baseLimit
      // T2: 2x baseLimit
      // T1: 1x baseLimit (deadline passed)
      // Approaching: > 80% of window elapsed
      if (elapsedHours >= baseLimit * 3) {
        newTier = SLA_TIERS.BREACH_TIER3;
        escalationReason = `3x SLA window expired (${elapsedHours.toFixed(1)}h elapsed vs ${baseLimit}h limit). Escalated to Cabinet Secretariat / PMO.`;
      } else if (elapsedHours >= baseLimit * 2) {
        newTier = SLA_TIERS.BREACH_TIER2;
        escalationReason = `2x SLA window expired (${elapsedHours.toFixed(1)}h elapsed vs ${baseLimit}h limit). Escalated to Ministry Joint Secretary.`;
      } else if (elapsedHours >= baseLimit) {
        newTier = SLA_TIERS.BREACH_TIER1;
        escalationReason = `SLA window exceeded (${elapsedHours.toFixed(1)}h elapsed vs ${baseLimit}h limit). Escalated to Supervising Monitoring Officer.`;
      } else if (elapsedHours >= baseLimit * 0.8) {
        newTier = SLA_TIERS.APPROACHING_DEADLINE;
      }

      if (newTier !== tracker.currentTier) {
        const oldTier = tracker.currentTier;
        tracker.currentTier = newTier;
        tracker.escalationHistory.push({
          tier: newTier,
          timestamp: new Date().toISOString(),
          reason: escalationReason || `Tier updated to ${newTier}`,
        });

        // Audit Log
        await auditService.logEvent({
          action: 'SLA_TIER_ESCALATED',
          userId: 'system_automation',
          userRole: 'SYSTEM_ADMIN',
          resourceType: 'SLA_TRACKER',
          resourceId: tracker.trackerId,
          details: {
            entityType: tracker.entityType,
            entityId: tracker.entityId,
            projectId: tracker.projectId,
            oldTier,
            newTier,
            elapsedHours,
            reason: escalationReason,
          },
        });

        // Publish domain event
        await eventBus.publish(DOMAIN_EVENTS.SLA_BREACH_DETECTED, {
          tracker,
          oldTier,
          newTier,
          reason: escalationReason,
          timestamp: new Date().toISOString(),
        });

        // Dispatch alert notification
        await notificationService.createNotification({
          type: 'SLA_ESCALATION',
          title: `[SLA BREACH - ${newTier}] ${tracker.projectName}`,
          message: escalationReason || `SLA breach detected for ${tracker.entityType} ${tracker.entityId}`,
          targetRoles: newTier === SLA_TIERS.BREACH_TIER3 ? ['DECISION_MAKER', 'SYSTEM_ADMIN'] : ['MONITORING_OFFICER', 'PROJECT_ADMIN'],
          projectId: tracker.projectId,
        });

        results.push({
          trackerId: tracker.trackerId,
          entityId: tracker.entityId,
          oldTier,
          newTier,
          escalated: true,
        });
      } else {
        results.push({
          trackerId: tracker.trackerId,
          entityId: tracker.entityId,
          tier: tracker.currentTier,
          escalated: false,
        });
      }
    }

    return results;
  }

  getTrackers(filters = {}) {
    let list = Array.from(this.trackers.values());
    if (filters.projectId) {
      list = list.filter(t => t.projectId.toLowerCase() === filters.projectId.toLowerCase());
    }
    if (filters.currentTier) {
      list = list.filter(t => t.currentTier === filters.currentTier);
    }
    return list;
  }
}

export const slaEscalationEngine = new SlaEscalationEngine();
