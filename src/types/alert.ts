export type AlertSeverity = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
export type AlertStatus = 'DETECTED' | 'REVIEWED' | 'ACKNOWLEDGED' | 'ACTION_INITIATED' | 'RESOLVED';
export type AlertType =
  | 'Cost Escalation Risk'
  | 'Schedule Delay Risk'
  | 'Milestone Slippage'
  | 'Expenditure Anomaly'
  | 'Progress Anomaly'
  | 'Dependency Risk'
  | 'Implementation Bottleneck'
  | 'Land Acquisition Delay'
  | 'Utility Clearance Bottleneck'
  | 'Simultaneous Multi-Indicator Deterioration';

export interface EarlyWarningAlert {
  id: string;
  project_id: string;
  project_name: string;
  sector: string;
  state: string;
  alert_type: AlertType;
  severity: AlertSeverity;
  trigger_reason: string;
  detected_date: string;
  current_value: string;
  expected_value: string;
  lead_time_months: number;
  lead_time_narrative: string;
  supporting_signals: string[];
  estimated_cost_impact_cr: number;
  estimated_delay_impact_months: number;
  confidence_score: number; // 0-100%
  recommended_action: string;
  status: AlertStatus;
  acknowledged_by?: string;
  acknowledged_at?: string;
  action_notes?: string;
}
