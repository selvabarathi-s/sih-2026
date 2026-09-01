export type SectorType =
  | 'Transport & Logistics'
  | 'Energy'
  | 'Water & Sanitation'
  | 'Communication'
  | 'Social Infrastructure'
  | 'Coal'
  | 'Steel'
  | 'Mining';

export type RiskLevel = 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL';

export type ProjectStatus = 'ON_TRACK' | 'UNDER_WATCH' | 'DELAYED' | 'CRITICAL' | 'COMPLETED';

export type ClearanceStatus = 'Approved' | 'Pending' | 'Conditional' | 'In Review';
export type UtilityStatus = 'Completed' | 'In Progress' | 'Critical Delay' | 'Pending';
export type TenderStatus = 'Awarded' | 'Delayed' | 'Re-tendered' | 'In Evaluation';
export type LabourStatus = 'Adequate' | 'Moderate Shortage' | 'Severe Shortage';
export type MaterialStatus = 'Stable' | 'Supply Disrupted' | 'Cost Inflation';
export type WeatherDisruption = 'None' | 'Seasonal' | 'Severe Weather';
export type ApprovalDelay = 'None' | 'Minor (<3 mo)' | 'Major (>6 mo)';

export interface RiskBreakdown {
  schedule_risk: number;      // 0-100, weight 20%
  milestone_risk: number;     // 0-100, weight 20%
  cost_risk: number;          // 0-100, weight 20%
  expenditure_risk: number;   // 0-100, weight 15%
  dependency_risk: number;    // 0-100, weight 10%
  implementation_risk: number;// 0-100, weight 10%
  anomaly_score: number;      // 0-100, weight 5%
}

export interface RiskDriver {
  id: string;
  name: string;
  category: 'Land Acquisition' | 'Milestone Slippage' | 'Expenditure Trajectory' | 'Utility & Clearances' | 'Contractor & Labour' | 'External Disruption';
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  impact_points: number; // e.g. +18 risk points
  evidence: string;      // e.g. "Land progress is 52% vs 90% planned target"
  explanation: string;   // e.g. "Pending ROW handover for 34km section blocking subgrade excavation."
  recommended_action: string;
}

export interface Recommendation {
  id: string;
  priority: 1 | 2 | 3;
  title: string;
  category: 'Land' | 'Milestone' | 'Contractor' | 'Clearance' | 'Expenditure' | 'Monitoring';
  problem: string;
  evidence: string;
  impact: string;
  action: string;
  expected_benefit: string; // e.g. "Could reduce projected schedule exposure by 2-3 months."
  responsible_entity: string;
  urgency?: 'Immediate' | 'High' | 'Moderate';
}

export interface Milestone {
  id: string;
  name: string;
  target_date: string;
  revised_date?: string;
  actual_date?: string;
  status: 'COMPLETED' | 'ON_TRACK' | 'DELAYED' | 'CRITICAL_DELAY' | 'PENDING';
  delay_months: number;
  weightage_percent: number;
}

export interface Project {
  project_id: string;
  project_name: string;
  ministry: string;
  department: string;
  sector: SectorType;
  sub_sector: string;
  state: string;
  district: string;
  implementing_agency: string;
  project_type: string;
  
  // Financial metrics (in ₹ Crores)
  original_cost: number;
  revised_cost: number;
  cumulative_expenditure: number;
  financial_progress: number; // percentage (expenditure / revised_cost)
  
  // Schedule metrics
  approved_date: string;
  original_start_date: string;
  original_completion_date: string;
  revised_completion_date: string;
  current_completion_forecast: string;
  physical_progress: number; // percentage
  planned_progress: number;  // percentage
  
  // Milestones
  milestones_total: number;
  milestones_completed: number;
  milestones_delayed: number;
  milestones: Milestone[];
  
  // Operational fields (CUF & Extended)
  status: ProjectStatus;
  monthly_update_date: string;
  contractor: string;
  land_status: string;
  land_progress: number; // percentage
  land_target: number;   // percentage
  environment_clearance: ClearanceStatus;
  utility_shift_status: UtilityStatus;
  tender_status: TenderStatus;
  labour_status: LabourStatus;
  material_status: MaterialStatus;
  weather_disruption: WeatherDisruption;
  approval_delay: ApprovalDelay;
  dependency_count: number;
  
  // Calculated Risk & Prediction Intelligence
  risk_score: number;       // 0-100
  risk_level: RiskLevel;
  risk_breakdown: RiskBreakdown;
  cost_overrun_probability: number; // 0-100%
  time_overrun_probability: number; // 0-100%
  predicted_cost_overrun: number;   // in ₹ Crores
  predicted_delay_months: number;   // in months
  
  // Explainability & Recommendations
  risk_drivers: RiskDriver[];
  recommendations: Recommendation[];
}

export interface MonthlyObservation {
  project_id: string;
  month: string;             // YYYY-MM
  planned_progress: number;  // %
  actual_progress: number;   // %
  planned_expenditure: number;// ₹ Cr
  actual_expenditure: number; // ₹ Cr
  milestones_due: number;
  milestones_completed: number;
  issues_open: number;
  issues_closed: number;
  risk_score: number;
}
