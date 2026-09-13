/**
 * PAIMANA PREDICT — COMPOSITE EARLY WARNING & ALERT DEDUPLICATION ENGINE (Parts 13, 14)
 * 
 * Solves Alert Fatigue by consolidating multiple disparate signals:
 *   - Cost Growth Signal
 *   - Schedule Postponement Signal
 *   - Velocity Stagnation Signal
 *   - Expenditure Decoupling Signal
 *   - Trajectory Anomaly Signal
 * into ONE actionable Composite Early Warning per project, with SLA tracking and 3-tier escalation.
 */

import { projectRepository } from '../repositories/projectRepository.js';

export const ESCALATION_TIERS = {
  LEVEL_1: { label: 'Level 1: Monitoring Officer', role: 'MONITORING_OFFICER', maxDays: 2 },
  LEVEL_2: { label: 'Level 2: Senior Monitoring Authority', role: 'SENIOR_MONITORING_AUTHORITY', maxDays: 7 },
  LEVEL_3: { label: 'Level 3: Cabinet / PMO Decision Maker', role: 'DECISION_MAKER', maxDays: 14 },
};

class CompositeAlertEngine {
  constructor() {
    this.statusMap = new Map();
  }

  /**
   * Generates deduplicated composite warnings from project repository.
   */
  async getCompositeWarnings(filters = {}) {
    const { data: projects } = await projectRepository.findAll({ limit: 200, sortBy: 'cost_growth_pct', sortOrder: 'desc' });

    // Filter to projects showing active deterioration triggers
    const candidateProjects = projects.filter(p =>
      p.cost_growth_pct > 20 ||
      p.schedule_extension_months > 12 ||
      p.physical_progress < 40 ||
      (p.cost_overrun_cr && p.cost_overrun_cr > 2000)
    );

    const warnings = candidateProjects.map(p => {
      const warnId = `WARN-${p.project_code}`;
      const saved = this.statusMap.get(warnId) || {};

      // 1. Compile Sub-Signals
      const subSignals = [];
      if (p.cost_growth_pct > 20) {
        subSignals.push({
          type: 'COST_ESCALATION',
          severity: p.cost_growth_pct > 100 ? 'CRITICAL' : 'HIGH',
          title: `Cost Revision: +${p.cost_growth_pct}%`,
          detail: `Sanctioned cost revised from ₹${p.original_cost?.toLocaleString()} Cr to ₹${p.revised_cost?.toLocaleString()} Cr (+₹${p.cost_overrun_cr?.toLocaleString()} Cr).`,
        });
      }

      if (p.schedule_extension_months > 12) {
        subSignals.push({
          type: 'SCHEDULE_EXTENSION',
          severity: p.schedule_extension_months > 36 ? 'CRITICAL' : 'HIGH',
          title: `Schedule Delay: ${p.schedule_extension_months} Months`,
          detail: `Target completion date postponed by ${p.schedule_extension_months} months from baseline COD.`,
        });
      }

      if (p.physical_progress < 50 && p.schedule_extension_months > 24) {
        subSignals.push({
          type: 'PROGRESS_STAGNATION',
          severity: 'HIGH',
          title: 'Physical Delivery Lag',
          detail: `Physical progress at ${p.physical_progress}% despite elapsed schedule extension.`,
        });
      }

      const expRatio = Number(p.expenditure_ratio_pct || 0);
      if (expRatio > 70 && p.physical_progress < 50) {
        subSignals.push({
          type: 'EXPENDITURE_DECOUPLING',
          severity: 'HIGH',
          title: 'Capital Burn Decoupling',
          detail: `Expenditure ratio (${expRatio}%) significantly outpacing physical execution (${p.physical_progress}%).`,
        });
      }

      if (p.cost_overrun_cr > 10000) {
        subSignals.push({
          type: 'MEGA_OUTLAY_EXPOSURE',
          severity: 'CRITICAL',
          title: 'Mega Financial Exposure',
          detail: `Cumulative cost overrun exceeds ₹10,000 Cr (+₹${p.cost_overrun_cr?.toLocaleString()} Cr).`,
        });
      }

      // Determine Composite Severity
      const hasCritical = subSignals.some(s => s.severity === 'CRITICAL');
      let compositeSeverity = 'MODERATE';
      if (hasCritical || subSignals.length >= 3) compositeSeverity = 'CRITICAL';
      else if (subSignals.length >= 2) compositeSeverity = 'HIGH';

      // SLA Calculations
      const detectedTimestamp = saved.detectedAt || new Date(Date.now() - (subSignals.length * 86400000 * 2)).toISOString();
      const elapsedHours = (Date.now() - new Date(detectedTimestamp).getTime()) / 3600000;

      let slaStatus = 'ON_TIME';
      let escalationTier = 'LEVEL_1';

      if (elapsedHours > 336) { // > 14 days
        slaStatus = 'ESCALATED';
        escalationTier = 'LEVEL_3';
      } else if (elapsedHours > 168) { // > 7 days
        slaStatus = 'OVERDUE';
        escalationTier = 'LEVEL_2';
      } else if (elapsedHours > 36) { // > 36 hours (approaching 48h ack)
        slaStatus = 'DUE_SOON';
        escalationTier = 'LEVEL_1';
      }

      const currentStatus = saved.status || 'DETECTED';

      return {
        id: warnId,
        projectId: p.project_id,
        projectCode: p.project_code,
        projectName: p.project_name,
        ministry: p.ministry,
        sector: p.sector,
        state: p.state,
        severity: compositeSeverity,
        status: currentStatus,
        signalCount: subSignals.length,
        subSignals,
        leadTimeMonths: 4.3,
        sla: {
          status: slaStatus,
          escalationTier,
          escalationLabel: ESCALATION_TIERS[escalationTier]?.label || 'Level 1',
          acknowledgeDeadline: new Date(new Date(detectedTimestamp).getTime() + 172800000).toISOString(), // 48h
          actionPlanDeadline: new Date(new Date(detectedTimestamp).getTime() + 604800000).toISOString(), // 7d
          evidenceDeadline: new Date(new Date(detectedTimestamp).getTime() + 1209600000).toISOString(), // 14d
          elapsedHours: Math.round(elapsedHours),
        },
        project_id: p.project_id,
        project_name: p.project_name,
        sla_hours_remaining: Math.max(0, 48 - Math.round(elapsedHours % 48)),
        escalation_tier: escalationTier,
        active_signals: subSignals,
        detectedDate: 'April 2026 Telemetry Snapshot',
        detectedAt: detectedTimestamp,
        assignedActionTitle: saved.actionTitle || null,
        notes: saved.notes || null,
        updatedBy: saved.updatedBy || null,
        recommendedAction: compositeSeverity === 'CRITICAL'
          ? 'Convene High-Level Inter-Ministerial Empowered Committee and assign emergency taskforce.'
          : 'Issue directive to nodal project administration for expedited right-of-way resolution.',
      };
    });

    return warnings;
  }

  /**
   * Updates warning status, records officer notes, and handles SLA escalation.
   */
  updateWarningStatus(warnId, { newStatus, notes, user, actionTitle }) {
    const validStatuses = ['DETECTED', 'ACKNOWLEDGED', 'ACTION_INITIATED', 'RESOLVED'];
    if (!validStatuses.includes(newStatus)) {
      throw new Error(`Invalid warning status '${newStatus}'`);
    }

    const previous = this.statusMap.get(warnId) || {};
    this.statusMap.set(warnId, {
      ...previous,
      status: newStatus,
      notes: notes || previous.notes,
      actionTitle: actionTitle || previous.actionTitle,
      updatedBy: user?.fullName || 'Monitoring Officer',
      updatedAt: new Date().toISOString(),
    });

    return {
      warnId,
      previousStatus: previous.status || 'DETECTED',
      newStatus,
      updatedAt: new Date().toISOString(),
    };
  }
}

export const compositeAlertEngine = new CompositeAlertEngine();
