export type DatasetMode = 'REAL_PAIMANA' | 'AI_DEMO';

export interface PaimanaProject {
  sl_no: number;
  project_id: string; // e.g. "PAI-705728"
  project_code: string; // e.g. "705728"
  legacy_ocms_code: string; // e.g. "N02000001" or ""
  pmgid: string; // e.g. "1234" or ""
  project_name: string;
  agency: string;
  ministry: string;
  sector: string;
  state: string;
  approval_date: string | null; // "MM/YYYY"
  start_date: string | null; // "MM/YYYY"
  target_completion_date: string | null; // "MM/YYYY"
  revised_completion_date: string | null; // "MM/YYYY"
  original_cost: number; // in Rs. Crore
  revised_cost: number; // in Rs. Crore
  cumulative_expenditure: number; // in Rs. Crore
  physical_progress: number; // percentage 0 - 100
  cost_growth_pct: number; // ((revised_cost - original_cost) / original_cost) * 100
  expenditure_ratio_pct: number; // (cumulative_expenditure / revised_cost) * 100
  cost_overrun_cr: number; // max(0, revised_cost - original_cost)
  schedule_extension_months: number;
  is_cost_escalated: boolean;
  is_schedule_extended: boolean;
  status?: string;
  current_risk_state?: string;
  provenance: {
    source_document: string;
    report_period: string;
    source_table: string;
    reporting_authority: string;
    extracted_at: string;
  };
}

export interface PaimanaSnapshot {
  report_period: string; // e.g. "April 2026", "March 2026"
  report_date_key: string; // "2026-04"
  source_document: string;
  target_completion_date: string | null;
  revised_completion_date: string | null;
  original_cost: number;
  revised_cost: number;
  cumulative_expenditure: number;
  physical_progress: number;
}

export interface PaimanaPortfolioSummary {
  headline: {
    total_projects: number;
    original_cost_cr: number;
    revised_cost_cr: number;
    cumulative_expenditure_cr: number;
    expenditure_ratio_pct: number;
    average_physical_progress_pct: number;
    cost_growth_total_cr: number;
    cost_growth_total_pct: number;
    total_ministries: number;
    total_sectors: number;
    total_states: number;
    projects_with_cost_growth: number;
    projects_with_schedule_extension: number;
    report_period: string;
    source_authority: string;
  };
  ministries: {
    ministry: string;
    project_count: number;
    original_cost: number;
    revised_cost: number;
    expenditure: number;
  }[];
  sectors: {
    sector: string;
    project_count: number;
    original_cost: number;
    revised_cost: number;
    expenditure: number;
  }[];
  states: {
    state: string;
    project_count: number;
    original_cost: number;
    revised_cost: number;
    expenditure: number;
  }[];
  top_cost_escalations: {
    project_id: string;
    project_name: string;
    ministry: string;
    sector: string;
    original_cost: number;
    revised_cost: number;
    cost_overrun_cr: number;
    cost_growth_pct: number;
    physical_progress: number;
  }[];
  top_schedule_extensions: {
    project_id: string;
    project_name: string;
    ministry: string;
    sector: string;
    target_completion_date: string | null;
    revised_completion_date: string | null;
    schedule_extension_months: number;
    physical_progress: number;
  }[];
}

export interface IngestionAudit {
  source_file: string;
  report_period: string;
  source_table: string;
  target_project_count: number;
  rows_extracted: number;
  rows_valid: number;
  rows_rejected: number;
  unique_project_codes: number;
  missing_project_codes: number;
  duplicate_project_codes: number;
  target_original_cost_cr: number;
  extracted_original_cost_cr: number;
  original_cost_diff_pct: number;
  target_revised_cost_cr: number;
  extracted_revised_cost_cr: number;
  revised_cost_diff_pct: number;
  target_expenditure_cr: number;
  extracted_expenditure_cr: number;
  expenditure_diff_pct: number;
  average_physical_progress_pct: number;
  total_ministries_count: number;
  total_sectors_count: number;
  total_states_count: number;
  projects_with_cost_escalation: number;
  projects_with_schedule_extension: number;
  reconciliation_status: 'PASS' | 'FAIL';
  reconciliation_timestamp: string;
}
