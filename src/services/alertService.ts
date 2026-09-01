import { EarlyWarningAlert, AlertStatus, AlertSeverity } from '../types/alert';
import { INITIAL_COMPREHENSIVE_ALERTS } from '../data/alertsData';

class AlertService {
  private alerts: EarlyWarningAlert[] = [...INITIAL_COMPREHENSIVE_ALERTS];

  public getAllAlerts(): EarlyWarningAlert[] {
    return this.alerts;
  }

  public getHeroAlert(): EarlyWarningAlert {
    const hero = this.alerts.find(a => a.id === 'ALT-HERO-PJ1042');
    return hero || this.alerts[0];
  }

  public getActiveAlerts(): EarlyWarningAlert[] {
    return this.alerts.filter(a => a.status !== 'RESOLVED');
  }

  public getAlertById(id: string): EarlyWarningAlert | undefined {
    return this.alerts.find(a => a.id === id);
  }

  public getAlertsForProject(projectId: string): EarlyWarningAlert[] {
    return this.alerts.filter(a => a.project_id.toLowerCase() === projectId.toLowerCase());
  }

  public updateAlertStatus(
    id: string,
    status: AlertStatus,
    officerName: string = 'Monitoring Officer (Transport & Infra)'
  ): EarlyWarningAlert | undefined {
    const alert = this.alerts.find(a => a.id === id);
    if (alert) {
      alert.status = status;
      if (status === 'ACKNOWLEDGED' || status === 'ACTION_INITIATED' || status === 'RESOLVED') {
        alert.acknowledged_by = officerName;
        alert.acknowledged_at = new Date().toISOString().split('T')[0];
      }
    }
    return alert;
  }

  public getAlertSummary() {
    const total = this.alerts.length;
    const critical = this.alerts.filter(a => a.severity === 'CRITICAL').length;
    const high = this.alerts.filter(a => a.severity === 'HIGH').length;
    const medium = this.alerts.filter(a => a.severity === 'MEDIUM').length;
    const unacknowledged = this.alerts.filter(a => a.status === 'DETECTED').length;
    const acknowledged = this.alerts.filter(a => a.status === 'ACKNOWLEDGED').length;
    const inAction = this.alerts.filter(a => a.status === 'ACTION_INITIATED').length;
    const resolved = this.alerts.filter(a => a.status === 'RESOLVED').length;

    const avgLeadTimeMonths = Number(
      (this.alerts.reduce((acc, a) => acc + a.lead_time_months, 0) / Math.max(1, total)).toFixed(1)
    );

    return {
      total,
      critical,
      high,
      medium,
      unacknowledged,
      acknowledged,
      inAction,
      resolved,
      avgLeadTimeMonths,
    };
  }
}

export const alertService = new AlertService();
