// ==============================================================================
// PAIMANA PREDICT — BACKGROUND AUTOMATION & SLA DAEMON
// Automated SLA Checks, Multi-Tier Escalations & Reporting Cycle Reminders
// ==============================================================================

import { slaEscalationEngine } from './slaEscalationEngine.js';
import { monthlyMonitoringService } from './monthlyMonitoringService.js';
import { projectRepository } from '../repositories/projectRepository.js';
import { auditService } from './auditService.js';

class AutomationWorker {
  constructor() {
    this.intervalHandle = null;
    this.isRunning = false;
    this.lastRunAt = null;
    this.executionCount = 0;
    this.lastResults = null;
  }

  start(intervalMs = 60000) {
    if (this.isRunning) return;

    this.isRunning = true;
    console.log(`[AutomationWorker] Background Automation Worker started (Interval: ${intervalMs}ms)`);

    // Run first cycle immediately
    this.runCycle().catch(err => console.error('[AutomationWorker] Error in initial cycle:', err));

    this.intervalHandle = setInterval(() => {
      this.runCycle().catch(err => console.error('[AutomationWorker] Error in background cycle:', err));
    }, intervalMs);
  }

  stop() {
    if (!this.isRunning) return;
    clearInterval(this.intervalHandle);
    this.intervalHandle = null;
    this.isRunning = false;
    console.log('[AutomationWorker] Background Automation Worker stopped');
  }

  async runCycle() {
    this.executionCount++;
    this.lastRunAt = new Date().toISOString();

    // 1. Evaluate all SLAs across tracked alerts and actions
    const slaEvaluations = await slaEscalationEngine.evaluateAllSlas();
    const escalatedItems = slaEvaluations.filter(e => e.escalated);

    // 2. Check open reporting cycles and identify pending submissions
    const currentCycle = monthlyMonitoringService.getCurrentCycle();
    let pendingRemindersCount = 0;

    if (currentCycle && currentCycle.status === 'OPEN') {
      const existingSubs = monthlyMonitoringService.getSubmissions({ cycleId: currentCycle.cycleId });
      const submittedProjectIds = new Set(existingSubs.map(s => s.projectId.toLowerCase()));

      const sampleProjects = await projectRepository.findAll({ limit: 10 });
      for (const p of (sampleProjects.data || [])) {
        if (!submittedProjectIds.has(p.project_id.toLowerCase())) {
          pendingRemindersCount++;
        }
      }
    }

    this.lastResults = {
      executionCount: this.executionCount,
      lastRunAt: this.lastRunAt,
      slaEvaluationsCount: slaEvaluations.length,
      escalatedItemsCount: escalatedItems.length,
      pendingCycleReminders: pendingRemindersCount,
    };

    if (escalatedItems.length > 0) {
      await auditService.logEvent({
        action: 'AUTOMATION_WORKER_ESCALATIONS',
        userId: 'system_daemon',
        userRole: 'SYSTEM_ADMIN',
        resourceType: 'WORKER_CYCLE',
        resourceId: `CYCLE-${this.executionCount}`,
        details: this.lastResults,
      });
    }

    return this.lastResults;
  }

  getStatus() {
    return {
      isRunning: this.isRunning,
      executionCount: this.executionCount,
      lastRunAt: this.lastRunAt,
      lastResults: this.lastResults,
    };
  }
}

export const automationWorker = new AutomationWorker();
