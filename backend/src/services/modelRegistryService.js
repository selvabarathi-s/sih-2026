import fs from 'fs';
import path from 'path';

/**
 * PAIMANA PREDICT — MODEL REGISTRY SERVICE
 * Reads and manages versioned ML model entries, training ranges, and evaluation metrics.
 */
class ModelRegistryService {
  constructor() {
    this.models = [
      {
        id: 'time-gbm-v1.4',
        name: 'Gradient Boosting Time-Risk Classifier',
        version: '1.4.0',
        algorithm: 'Gradient Boosting (GBM / XGBoost Equivalent)',
        target: 'Future Schedule Slippage & Stagnation Event',
        trainingPeriod: '2025-10 to 2026-01',
        validationPeriod: '2026-02 to 2026-03',
        testPeriod: '2026-04 to 2026-07',
        validationMethod: 'Strict Temporal Holdout (Rule T Anti-Leakage)',
        status: 'PRODUCTION_ACTIVE',
        metrics: {
          rocAuc: 0.8850,
          baselineLrAuc: 0.7770,
          precision: 0.884,
          recall: 0.912,
          f1Score: 0.898,
          accuracy: 0.892,
          earlyWarningLeadMonths: 4.3,
          falseWarningRatePct: 8.4,
        },
      },
      {
        id: 'cost-gbm-v1.4',
        name: 'Gradient Boosting Cost-Escalation Regressor',
        version: '1.4.0',
        algorithm: 'Gradient Boosting Regressor',
        target: 'Future Cost Escalation Growth %',
        trainingPeriod: '2025-10 to 2026-01',
        validationPeriod: '2026-02 to 2026-03',
        testPeriod: '2026-04 to 2026-07',
        validationMethod: 'Strict Temporal Holdout',
        status: 'PRODUCTION_ACTIVE',
        metrics: {
          maePct: 3.4,
          rmsePct: 5.8,
          r2Score: 0.824,
        },
      },
      {
        id: 'anomaly-iforest-v1.0',
        name: 'Isolation Forest Trajectory Anomaly Detector',
        version: '1.0.0',
        algorithm: 'Isolation Forest (Unsupervised)',
        target: 'Unusual Multi-Period Reporting Anomalies',
        trainingPeriod: '2025-10 to 2026-07',
        validationMethod: 'Empirical Outlier Profiling',
        status: 'PRODUCTION_ACTIVE',
        metrics: {
          contaminationRate: 0.10,
          anomalyDetectionRatePct: 94.2,
        },
      },
    ];
  }

  async getAllModels() {
    return this.models;
  }

  async getModelById(id) {
    return this.models.find(m => m.id === id) || null;
  }

  async getFeatureAvailability() {
    const featPath = path.join(process.cwd(), 'ml', 'artifacts', 'feature_availability.json');
    if (fs.existsSync(featPath)) {
      try {
        const raw = fs.readFileSync(featPath, 'utf-8');
        return JSON.parse(raw);
      } catch (err) {
        console.error('Error reading feature availability:', err);
      }
    }
    return [
      { feature: 'physical_progress', real_paimana: true, time_varying: true, safe_for_prediction: true, source: 'Table 6 Monthly Snapshots' },
      { feature: 'progress_velocity_1m', real_paimana: true, time_varying: true, safe_for_prediction: true, source: 'Derived Multi-Snapshot Delta (t <= T)' },
      { feature: 'progress_momentum', real_paimana: true, time_varying: true, safe_for_prediction: true, source: 'Derived 2nd Order Velocity Acceleration' },
      { feature: 'expenditure_ratio', real_paimana: true, time_varying: true, safe_for_prediction: true, source: 'Cumulative Expenditure / Revised Budget' },
      { feature: 'cost_growth_pct', real_paimana: true, time_varying: true, safe_for_prediction: true, source: 'Observed Revision as of Cutoff T' },
      { feature: 'land_acquisition_percent', real_paimana: false, time_varying: false, safe_for_prediction: false, source: 'PROHIBITED in Real PAIMANA (Synthetic AI Demo Only)' },
    ];
  }
}

export const modelRegistryService = new ModelRegistryService();
