export interface ModelPerformanceMetric {
  model_name: string;
  model_type: 'Statistical Baseline' | 'Classical ML' | 'Gradient Boosting / Ensemble';
  cost_auc: number;
  time_auc: number;
  accuracy: number;
  precision: number;
  recall: number;
  f1_score: number;
  early_warning_lead_time_months: number;
  description: string;
}

export interface VariableImportance {
  variable_name: string;
  category: 'CUF Standard' | 'Expanded Risk Variable';
  importance_score: number; // 0-100 relative
  correlation_with_delay: number; // -1 to +1
  description: string;
}

export interface PeerBenchmark {
  sector: string;
  cost_band: string; // e.g. "₹5,000 Cr - ₹10,000 Cr"
  avg_risk_score: number;
  median_risk_score: number;
  avg_delay_months: number;
  avg_cost_overrun_pct: number;
  avg_physical_progress: number;
  avg_expenditure_rate: number;
  project_count: number;
}
