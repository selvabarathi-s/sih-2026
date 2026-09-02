import { projectRepository } from '../repositories/projectRepository.js';

class AlertService {
  constructor() {
    this.alertsCache = [];
  }

  async getDeteriorationSignals(filters = {}) {
    const { data: projects } = await projectRepository.findAll({ limit: 100, sortBy: 'cost_growth_pct', sortOrder: 'desc' });
    
    // Generate grounded historical deterioration signals based on observed telemetry
    return projects
      .filter(p => p.cost_growth_pct > 20 || p.schedule_extension_months > 12)
      .map(p => ({
        id: `SIG-${p.project_code}`,
        project_id: p.project_id,
        project_name: p.project_name,
        ministry: p.ministry,
        sector: p.sector,
        severity: p.cost_growth_pct > 100 ? 'CRITICAL' : p.cost_growth_pct > 40 ? 'HIGH' : 'MODERATE',
        signal_type: 'HISTORICAL_DETERIORATION_SIGNAL',
        status: 'DETECTED',
        trigger_reason: `Observed +${p.cost_growth_pct}% cost revision (+₹${p.cost_overrun_cr.toLocaleString()} Cr) against original sanctioned budget.`,
        observed_progress: `${p.physical_progress}%`,
        snapshot_coverage: '10 Monthly Reports',
      }));
  }
}

export const alertService = new AlertService();
