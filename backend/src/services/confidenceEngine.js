/**
 * PAIMANA PREDICT — PREDICTION CONFIDENCE & UNCERTAINTY ENGINE (Part 3)
 * 
 * Computes formal epistemic uncertainty and data completeness metrics for every model inference.
 * Strictly separates:
 *   - RISK SCORE (Likelihood/Severity of Project Delay/Overrun)
 *   - PREDICTION CONFIDENCE (Epistemic Certainty of Model Inference based on Data Health)
 */

export const CONFIDENCE_LEVELS = {
  HIGH: { label: 'HIGH', min: 80, max: 100, color: 'emerald' },
  MODERATE: { label: 'MODERATE', min: 60, max: 79, color: 'blue' },
  LOW: { label: 'LOW', min: 0, max: 59, color: 'amber' },
};

/**
 * Evaluates prediction confidence and uncertainty across 4 verifiable dimensions:
 * 1. Data Completeness Ratio (35%)
 * 2. Snapshot History Depth (25%)
 * 3. Execution Velocity Stability (20%)
 * 4. Model Calibration & Horizon Alignment (20%)
 */
export function calculatePredictionConfidence(project, snapshots = [], options = {}) {
  const warnings = [];
  const modelId = options.modelId || 'time-gbm-v1.4';

  // -------------------------------------------------------------
  // 1. Data Completeness Evaluation (Weight: 35%)
  // -------------------------------------------------------------
  const requiredFields = [
    'original_cost',
    'revised_cost',
    'cumulative_expenditure',
    'physical_progress',
    'target_completion_date',
    'ministry',
    'sector',
  ];

  let presentCount = 0;
  requiredFields.forEach(field => {
    const val = project[field];
    if (val !== undefined && val !== null && val !== '') {
      presentCount++;
    }
  });

  const completenessRatio = presentCount / requiredFields.length;
  const completenessScore = Math.round(completenessRatio * 100);
  if (completenessRatio < 0.85) {
    warnings.push({
      code: 'INCOMPLETE_DATA',
      message: `Project record has missing or unpopulated fields (${presentCount}/${requiredFields.length} complete).`,
      severity: 'WARNING',
    });
  }

  // -------------------------------------------------------------
  // 2. Historical Snapshot Depth Evaluation (Weight: 25%)
  // -------------------------------------------------------------
  const snapCount = Array.isArray(snapshots) ? snapshots.length : Number(project.snapshot_count || 1);
  let depthScore = 50; // Default baseline for 1 snapshot
  if (snapCount >= 6) {
    depthScore = 100;
  } else if (snapCount >= 4) {
    depthScore = 90;
  } else if (snapCount >= 3) {
    depthScore = 80;
  } else if (snapCount === 2) {
    depthScore = 70;
  } else {
    depthScore = 50;
    warnings.push({
      code: 'SHALLOW_HISTORY',
      message: 'Only 1 historical reporting snapshot available. Epistemic uncertainty is elevated.',
      severity: 'NOTICE',
    });
  }

  // -------------------------------------------------------------
  // 3. Execution Velocity Stability & Dispersion (Weight: 20%)
  // -------------------------------------------------------------
  let stabilityScore = 85; // Default standard stability
  if (Array.isArray(snapshots) && snapshots.length >= 3) {
    const sorted = [...snapshots].sort((a, b) => (a.report_date_key || '').localeCompare(b.report_date_key || ''));
    const velocities = [];
    for (let i = 1; i < sorted.length; i++) {
      const v = Number(sorted[i].physical_progress || 0) - Number(sorted[i - 1].physical_progress || 0);
      velocities.push(v);
    }
    const mean = velocities.reduce((a, b) => a + b, 0) / velocities.length;
    const variance = velocities.reduce((sum, v) => sum + Math.pow(v - mean, 2), 0) / velocities.length;
    const stdDev = Math.sqrt(variance);

    if (stdDev > 4.5) {
      stabilityScore = 50;
      warnings.push({
        code: 'HIGH_VELOCITY_VARIANCE',
        message: `High progress volatility (σ = ±${stdDev.toFixed(1)}%/mo) across monthly reporting periods.`,
        severity: 'WARNING',
      });
    } else if (stdDev > 2.5) {
      stabilityScore = 75;
    } else {
      stabilityScore = 95;
    }
  }

  // -------------------------------------------------------------
  // 4. Model Calibration Factor (Weight: 20%)
  // -------------------------------------------------------------
  let calibrationFactor = 90; // time-gbm-v1.4 Platt calibrated (Brier = 0.1714)
  if (modelId.includes('demo') || modelId.includes('uncalibrated')) {
    calibrationFactor = 65;
    warnings.push({
      code: 'UNCALIBRATED_MODEL',
      message: 'Active model lacks empirical Platt scaling calibration.',
      severity: 'NOTICE',
    });
  }

  // -------------------------------------------------------------
  // Weighted Composite Prediction Confidence
  // -------------------------------------------------------------
  const compositeConfidence = Math.round(
    completenessScore * 0.35 +
    depthScore * 0.25 +
    stabilityScore * 0.20 +
    calibrationFactor * 0.20
  );

  const confidenceScore = Math.max(25, Math.min(98, compositeConfidence));

  let reliabilityLevel = 'HIGH';
  if (confidenceScore < 60) {
    reliabilityLevel = 'LOW';
  } else if (confidenceScore < 80) {
    reliabilityLevel = 'MODERATE';
  }

  return {
    confidenceScore,
    overall_confidence: confidenceScore,
    score: confidenceScore,
    reliabilityLevel,
    reliability_tier: reliabilityLevel,
    level: reliabilityLevel,
    completenessScore,
    snapshotDepth: snapCount,
    modelId,
    modelVersion: 'v1.4.0-governed',
    dataCutoffPeriod: project.provenance?.report_period || 'April 2026',
    calculatedAt: new Date().toISOString(),
    warnings,
    breakdown: {
      data_completeness: completenessScore,
      snapshot_depth: depthScore,
      velocity_stability: stabilityScore,
      calibration_fit: calibrationFactor,
    },
    decomposition: {
      completenessWeight: 0.35,
      completenessScore,
      depthWeight: 0.25,
      depthScore,
      stabilityWeight: 0.20,
      stabilityScore,
      calibrationWeight: 0.20,
      calibrationScore: calibrationFactor,
    },
  };
}
