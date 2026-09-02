import { projectRepository } from '../repositories/projectRepository.js';
import { auditService } from './auditService.js';
import { notificationService } from './notificationService.js';

class AlertService {
  constructor() {
    this.statusOverrides = new Map(); // In-memory / database persistence map
  }

  async getDeteriorationSignals(filters = {}) {
    const { data: projects } = await projectRepository.findAll({ limit: 100, sortBy: 'cost_growth_pct', sortOrder: 'desc' });
    
    // Generate grounded historical deterioration signals based on observed telemetry
    return projects
      .filter(p => p.cost_growth_pct > 20 || p.schedule_extension_months > 12)
      .map(p => {
        const sigId = `SIG-${p.project_code}`;
        const currentStatus = this.statusOverrides.get(sigId)?.status || 'DETECTED';
        const notes = this.statusOverrides.get(sigId)?.notes || null;
        const updatedBy = this.statusOverrides.get(sigId)?.updatedBy || null;

        return {
          id: sigId,
          project_id: p.project_id,
          project_code: p.project_code,
          project_name: p.project_name,
          ministry: p.ministry,
          sector: p.sector,
          state: p.state,
          severity: p.cost_growth_pct > 100 ? 'CRITICAL' : p.cost_growth_pct > 40 ? 'HIGH' : 'MODERATE',
          signal_type: 'HISTORICAL_DETERIORATION_SIGNAL',
          status: currentStatus,
          trigger_reason: `Observed +${p.cost_growth_pct}% cost revision (+₹${p.cost_overrun_cr.toLocaleString()} Cr) against original sanctioned budget.`,
          evidence_metrics: {
            original_cost: p.original_cost,
            revised_cost: p.revised_cost,
            cost_overrun_cr: p.cost_overrun_cr,
            cost_growth_pct: p.cost_growth_pct,
            physical_progress: p.physical_progress,
            schedule_extension_months: p.schedule_extension_months,
          },
          observed_progress: `${p.physical_progress}%`,
          detected_date: 'April 2026 Snapshot',
          notes,
          updated_by: updatedBy,
          recommended_action: p.cost_growth_pct > 100
            ? 'Convene inter-ministerial empowered committee review & financial restructuring'
            : 'Deploy field surveillance taskforce and establish milestone velocity targets',
        };
      });
  }

  async updateSignalStatus(signalId, { newStatus, notes, user }) {
    const validStatuses = ['DETECTED', 'ACKNOWLEDGED', 'ACTION_INITIATED', 'RESOLVED'];
    if (!validStatuses.includes(newStatus)) {
      throw new Error(`Invalid warning status '${newStatus}'. Valid: ${validStatuses.join(', ')}`);
    }

    const previousStatus = this.statusOverrides.get(signalId)?.status || 'DETECTED';
    this.statusOverrides.set(signalId, {
      status: newStatus,
      notes: notes || '',
      updatedBy: user?.fullName || 'Monitoring Officer',
      updatedAt: new Date().toISOString(),
    });

    // 1. Audit Log
    await auditService.log({
      action: 'WARNING_STATUS_UPDATED',
      userId: user?.id || 'usr-officer-01',
      userRole: user?.role || 'MONITORING_OFFICER',
      resourceType: 'EARLY_WARNING',
      resourceId: signalId,
      details: { previousStatus, newStatus, notes },
    });

    // 2. Dispatch Notification
    await notificationService.createNotification({
      type: 'WARNING_UPDATED',
      title: `Warning Status: ${signalId}`,
      message: `Status transitioned to ${newStatus} by ${user?.fullName || 'Monitoring Officer'}.`,
      targetRoles: ['MONITORING_OFFICER', 'DECISION_MAKER', 'PROJECT_ADMIN'],
      projectId: signalId.replace('SIG-', 'PAI-'),
      severity: newStatus === 'RESOLVED' ? 'SUCCESS' : 'INFO',
    });

    return {
      signalId,
      previousStatus,
      newStatus,
      notes,
      updatedAt: new Date().toISOString(),
    };
  }
}

export const alertService = new AlertService();
