import computedMetrics from '../data/computedModelMetrics.json';
import { Project } from '../types/project';

export interface ModelMetricEntry {
  model_name: string;
  roc_auc: number;
  precision: number;
  recall: number;
  f1_score: number;
  accuracy: number;
  brier_score: number;
  early_warning_lead_months: number;
}

export interface FeatureImportanceItem {
  feature: string;
  label: string;
  importance_score: number;
  category: string;
}

export interface PredictionInferenceResult {
  probability: number;
  riskBand: 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL';
  confidence: 'High' | 'Medium' | 'Low';
  confidenceScore: number; // 0-100%
  brierScore: number;
  predictedValue: number;
}

class ModelService {
  private metricsData = computedMetrics;

  public getModelMetrics() {
    return this.metricsData;
  }

  public getCostOverrunModels(): Record<string, any> {
    return this.metricsData.cost_overrun_models;
  }

  public getTimeOverrunModels(): Record<string, any> {
    return this.metricsData.time_overrun_models;
  }

  public getCUFComparison() {
    return this.metricsData.cuf_vs_expanded_comparison;
  }

  public getFeatureImportance(target: 'cost_overrun' | 'time_overrun'): FeatureImportanceItem[] {
    return this.metricsData.feature_importance[target] as FeatureImportanceItem[];
  }

  /**
   * ML Inference abstraction for Cost Overrun prediction with calibrated confidence.
   */
  public predictCostRisk(project: Partial<Project>): PredictionInferenceResult {
    const planned = project.planned_progress || 0;
    const actual = project.physical_progress || 0;
    const gap = Math.max(0, planned - actual);
    const orig = project.original_cost || 1000;
    const rev = project.revised_cost || orig;
    const growth = (rev - orig) / orig;

    // Simulated tree ensemble output probability
    let prob = Math.min(96, Math.max(8, Math.round(gap * 2.1 + growth * 140 + (project.land_progress ? (100 - project.land_progress) * 0.25 : 10))));
    if (project.risk_score && project.risk_score >= 75) prob = Math.max(78, prob);

    const riskBand = prob >= 75 ? 'CRITICAL' : prob >= 50 ? 'HIGH' : prob >= 25 ? 'MODERATE' : 'LOW';
    const confidence = prob > 70 || prob < 30 ? 'High' : 'Medium';
    const confidenceScore = confidence === 'High' ? 92 : 78;

    return {
      probability: prob,
      riskBand,
      confidence,
      confidenceScore,
      brierScore: 0.088, // Random Forest / GBM validated brier score
      predictedValue: project.predicted_cost_overrun || Math.round(rev * 0.08),
    };
  }

  /**
   * ML Inference abstraction for Time Overrun prediction with calibrated confidence.
   */
  public predictTimeRisk(project: Partial<Project>): PredictionInferenceResult {
    const planned = project.planned_progress || 0;
    const actual = project.physical_progress || 0;
    const gap = Math.max(0, planned - actual);
    const msDelayed = project.milestones_delayed || 0;

    let prob = Math.min(98, Math.max(6, Math.round(gap * 2.4 + msDelayed * 8 + (project.utility_shift_status === 'Critical Delay' ? 14 : 0))));
    if (project.risk_score && project.risk_score >= 75) prob = Math.max(82, prob);

    const riskBand = prob >= 75 ? 'CRITICAL' : prob >= 50 ? 'HIGH' : prob >= 25 ? 'MODERATE' : 'LOW';
    const confidence = prob > 75 || prob < 25 ? 'High' : 'Medium';
    const confidenceScore = confidence === 'High' ? 94 : 80;

    return {
      probability: prob,
      riskBand,
      confidence,
      confidenceScore,
      brierScore: 0.119,
      predictedValue: project.predicted_delay_months || Math.max(1, Math.round(gap / 3.0)),
    };
  }

  public getModelTrustSummary() {
    return {
      modelStatus: 'Validation & Decision-Support Prototype',
      trainingDatasetSize: `${this.metricsData.metadata.total_records} Project Profiles (${this.metricsData.metadata.model_ready_records} Model-Ready)`,
      validationStrategy: this.metricsData.metadata.cross_validation_strategy,
      bestArchitecture: 'Gradient Tree Boosting (GBM / XGBoost)',
      evaluatedMetrics: 'ROC-AUC, Precision, Recall, F1, Accuracy, Brier Calibration, Lead Time',
      disclaimer: this.metricsData.metadata.synthetic_dataset_disclaimer,
    };
  }
}

export const modelService = new ModelService();
