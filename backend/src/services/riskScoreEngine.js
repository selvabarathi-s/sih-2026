/**
 * PAIMANA PREDICT — DYNAMIC RISK-INTELLIGENCE & PRIORITIZATION ENGINE (Parts 2, 3, 9)
 * 
 * Formal 0–100 Operational Risk Scoring Engine combining:
 * 1. Observable Project Signals (Schedule, Cost, Velocity, Decoupling, ML, Anomalies)
 * 2. Multi-Period Risk Momentum (Stable, Improving, Deteriorating, Rapid Deterioration, Critical Acceleration, Recovering)
 * 3. Forward Risk Transitions (30-day, 60-day, 90-day Horizon Forecasts)
 * 4. Epistemic Prediction Confidence (Factoring Data Completeness, Snapshot Depth, Stability)
 * 5. Project Criticality & Intervention Priority (Capital Scale, Strategic Sector, Urgency)
 * 
 * Engine Version: risk-v2.3-dynamic
 */

import { calculatePredictionConfidence } from './confidenceEngine.js';
import { calculateProjectPriority } from './priorityEngine.js';

export const RISK_BANDS = {
  LOW: { label: 'LOW', min: 0, max: 24, color: 'emerald' },
  MODERATE: { label: 'MODERATE', min: 25, max: 49, color: 'blue' },
  HIGH: { label: 'HIGH', min: 50, max: 74, color: 'amber' },
  CRITICAL: { label: 'CRITICAL', min: 75, max: 100, color: 'rose' },
};

export const RISK_WEIGHTS = {
  schedule: 0.25,
  cost: 0.20,
  progress: 0.20,
  expenditure: 0.15,
  predictive: 0.15,
  weakSignal: 0.05,
};

export function classifyRiskBand(score) {
  const rounded = Math.max(0, Math.min(100, Math.round(score)));
  if (rounded >= 75) return 'CRITICAL';
  if (rounded >= 50) return 'HIGH';
  if (rounded >= 25) return 'MODERATE';
  return 'LOW';
}

/**
 * Computes forward risk transitions for 30d, 60d, and 90d horizons.
 */
export function projectRiskTransitions(currentScore, momentumCategory, acceleration = 0) {
  let delta30 = 0;
  let delta60 = 0;
  let delta90 = 0;

  switch (momentumCategory) {
    case 'CRITICAL_ACCELERATION':
      delta30 = +6;
      delta60 = +13;
      delta90 = +20;
      break;
    case 'RAPID_DETERIORATION':
      delta30 = +4;
      delta60 = +9;
      delta90 = +14;
      break;
    case 'DETERIORATING':
      delta30 = +2;
      delta60 = +5;
      delta90 = +8;
      break;
    case 'RECOVERING':
      delta30 = -3;
      delta60 = -7;
      delta90 = -12;
      break;
    case 'IMPROVING':
      delta30 = -2;
      delta60 = -4;
      delta90 = -7;
      break;
    case 'STABLE':
    default:
      delta30 = 0;
      delta60 = +1;
      delta90 = +2;
      break;
  }

  const score30 = Math.max(0, Math.min(100, Math.round(currentScore + delta30)));
  const score60 = Math.max(0, Math.min(100, Math.round(currentScore + delta60)));
  const score90 = Math.max(0, Math.min(100, Math.round(currentScore + delta90)));

  return {
    current: classifyRiskBand(currentScore),
    horizon30d: {
      projectedScore: score30,
      state: classifyRiskBand(score30),
      delta: delta30,
    },
    horizon60d: {
      projectedScore: score60,
      state: classifyRiskBand(score60),
      delta: delta60,
    },
    horizon90d: {
      projectedScore: score90,
      state: classifyRiskBand(score90),
      delta: delta90,
    },
  };
}

/**
 * Calculates normalized 0-100 dimension scores, composite Risk Score, Momentum, and Confidence.
 */
export function calculateProjectRiskScore(project, options = {}) {
  const dataMode = options.dataMode || project.data_mode || 'REAL_PAIMANA';
  const isSyntheticDemo = dataMode === 'AI_DEMO' || dataMode === 'AI_DEMONSTRATION';
  const snapshots = options.snapshots || [];

  // -------------------------------------------------------------
  // 1. Dimension A: Schedule Risk (0-100) — Weight: 25%
  // -------------------------------------------------------------
  const extensionMonths = Number(project.schedule_extension_months || 0);
  let scheduleScore = 0;
  if (extensionMonths > 0) {
    scheduleScore = Math.min(100, Math.round((extensionMonths / 60) * 100));
  } else if (project.is_schedule_extended) {
    scheduleScore = 30;
  }
  if (isSyntheticDemo && project.milestone_delay_months) {
    scheduleScore = Math.min(100, scheduleScore + Math.round(project.milestone_delay_months * 2.5));
  }

  // -------------------------------------------------------------
  // 2. Dimension B: Cost Risk (0-100) — Weight: 20%
  // -------------------------------------------------------------
  const costGrowthPct = Number(project.cost_growth_pct || 0);
  let costScore = 0;
  if (costGrowthPct > 0) {
    costScore = Math.min(100, Math.round((costGrowthPct / 150) * 100));
  }
  const overrunCr = Number(project.cost_overrun_cr || 0);
  if (overrunCr > 10000) {
    costScore = Math.max(costScore, 65);
  } else if (overrunCr > 2000) {
    costScore = Math.max(costScore, 40);
  }

  // -------------------------------------------------------------
  // 3. Dimension C: Progress / Deterioration Risk (0-100) — Weight: 20%
  // -------------------------------------------------------------
  const physicalProgress = Number(project.physical_progress || 0);
  let progressScore = 0;
  
  if (physicalProgress < 20 && extensionMonths > 12) {
    progressScore = 90;
  } else if (physicalProgress < 50 && extensionMonths > 24) {
    progressScore = 80;
  } else if (physicalProgress < 75 && extensionMonths > 36) {
    progressScore = 70;
  } else {
    progressScore = Math.min(100, Math.round(Math.max(0, 100 - physicalProgress) * (extensionMonths > 0 ? 0.8 : 0.2)));
  }

  if (project.recent_deterioration_flag || project.velocity_trend === 'DECELERATING') {
    progressScore = Math.min(100, progressScore + 15);
  }

  // -------------------------------------------------------------
  // 4. Dimension D: Expenditure Trajectory Risk (0-100) — Weight: 15%
  // -------------------------------------------------------------
  const expRatio = Number(project.expenditure_ratio_pct || 0);
  let expenditureScore = 0;

  const disconnect = Math.abs(expRatio - physicalProgress);
  if (expRatio > 80 && physicalProgress < 50) {
    expenditureScore = Math.min(100, 75 + Math.round(disconnect * 0.4));
  } else if (expRatio < 20 && extensionMonths > 24) {
    expenditureScore = 70;
  } else {
    expenditureScore = Math.min(100, Math.round(disconnect * 1.2));
  }

  // -------------------------------------------------------------
  // 5. Dimension E: Predictive Risk Signal (0-100) — Weight: 15%
  // -------------------------------------------------------------
  let predictiveProbability = project.predictive_probability !== undefined 
    ? Number(project.predictive_probability) 
    : (project.predicted_delay_months ? Math.min(1.0, project.predicted_delay_months / 12) : 0.5);
  
  if (project.predictedProbability !== undefined) {
    predictiveProbability = Number(project.predictedProbability);
  }
  const predictiveScore = Math.min(100, Math.max(0, Math.round(predictiveProbability * 100)));

  // -------------------------------------------------------------
  // 6. Dimension F: Anomaly / Weak Signal Risk (0-100) — Weight: 5%
  // -------------------------------------------------------------
  let weakSignalScore = Number(project.weak_signal_score || 0);
  if (project.is_anomaly || project.anomaly_flag) {
    weakSignalScore = Math.max(weakSignalScore, 75);
  } else if (weakSignalScore === 0) {
    weakSignalScore = extensionMonths > 12 || costGrowthPct > 25 ? 45 : 10;
  }
  weakSignalScore = Math.min(100, Math.max(0, Math.round(weakSignalScore)));

  // Synthetic Enriched Variables (ONLY for AI Demo Mode)
  if (isSyntheticDemo) {
    if (project.land_acquisition_deficit) {
      weakSignalScore = Math.min(100, weakSignalScore + Math.round(project.land_acquisition_deficit * 0.5));
    }
    if (project.contractor_performance_score !== undefined) {
      const contractorPenalty = Math.max(0, 100 - project.contractor_performance_score);
      progressScore = Math.min(100, progressScore + Math.round(contractorPenalty * 0.2));
    }
  }

  // -------------------------------------------------------------
  // Weighted Composite Risk Score (0-100)
  // -------------------------------------------------------------
  const weightedSchedule = Math.round(scheduleScore * RISK_WEIGHTS.schedule);
  const weightedCost = Math.round(costScore * RISK_WEIGHTS.cost);
  const weightedProgress = Math.round(progressScore * RISK_WEIGHTS.progress);
  const weightedExpenditure = Math.round(expenditureScore * RISK_WEIGHTS.expenditure);
  const weightedPredictive = Math.round(predictiveScore * RISK_WEIGHTS.predictive);
  const weightedWeakSignal = Math.round(weakSignalScore * RISK_WEIGHTS.weakSignal);

  const rawScore = (
    scheduleScore * RISK_WEIGHTS.schedule +
    costScore * RISK_WEIGHTS.cost +
    progressScore * RISK_WEIGHTS.progress +
    expenditureScore * RISK_WEIGHTS.expenditure +
    predictiveScore * RISK_WEIGHTS.predictive +
    weakSignalScore * RISK_WEIGHTS.weakSignal
  );

  const riskScore = Math.max(0, Math.min(100, Math.round(rawScore)));
  const riskBand = classifyRiskBand(riskScore);

  // -------------------------------------------------------------
  // Risk Drivers
  // -------------------------------------------------------------
  const drivers = [];
  if (costScore >= 50) {
    drivers.push({
      dimension: 'Cost Escalation',
      severity: costScore >= 75 ? 'CRITICAL' : 'HIGH',
      description: `Cost growth of ${costGrowthPct.toFixed(1)}% (+₹${overrunCr.toLocaleString('en-IN')} Cr revision)`,
    });
  }
  if (scheduleScore >= 50) {
    drivers.push({
      dimension: 'Schedule Extension',
      severity: scheduleScore >= 75 ? 'CRITICAL' : 'HIGH',
      description: `Target completion delayed by ${extensionMonths} months`,
    });
  }
  if (progressScore >= 50) {
    drivers.push({
      dimension: 'Progress Velocity Lag',
      severity: progressScore >= 75 ? 'CRITICAL' : 'HIGH',
      description: `Physical progress at ${physicalProgress}% lagging schedule requirements`,
    });
  }
  if (expenditureScore >= 50) {
    drivers.push({
      dimension: 'Capital Burn Decoupling',
      severity: expenditureScore >= 75 ? 'CRITICAL' : 'HIGH',
      description: `Expenditure ratio (${expRatio}%) disconnected from physical delivery (${physicalProgress}%)`,
    });
  }
  if (predictiveScore >= 60) {
    drivers.push({
      dimension: 'Predictive Horizon Signal',
      severity: predictiveScore >= 80 ? 'CRITICAL' : 'HIGH',
      description: `${predictiveScore}% probability of 90-day adverse deterioration event`,
    });
  }
  if (drivers.length === 0) {
    drivers.push({
      dimension: 'Normal Operational Surveillance',
      severity: 'LOW',
      description: 'Project telemetry within standard milestone tolerances',
    });
  }

  // -------------------------------------------------------------
  // Multi-Period Risk Momentum (Part 2B)
  // 6 Standardized Categories:
  // STABLE, IMPROVING, DETERIORATING, RAPID_DETERIORATION, CRITICAL_ACCELERATION, RECOVERING
  // -------------------------------------------------------------
  let momentumCategory = 'STABLE';
  let trajectory = 'Stable execution velocity across available reporting snapshots.';
  let acceleration = 0;

  if (snapshots.length >= 3) {
    const sorted = [...snapshots].sort((a, b) => (a.report_date_key || '').localeCompare(b.report_date_key || ''));
    const p0 = Number(sorted[sorted.length - 1].physical_progress || 0);
    const p1 = Number(sorted[sorted.length - 2].physical_progress || p0);
    const p2 = Number(sorted[sorted.length - 3].physical_progress || p1);
    const v1 = p0 - p1;
    const v2 = p1 - p2;
    acceleration = Number((v1 - v2).toFixed(2));

    if (acceleration < -2.0 || (v1 < 0.2 && costGrowthPct > 50)) {
      momentumCategory = 'CRITICAL_ACCELERATION';
      trajectory = 'Critical deceleration: Velocity stalled while overhead compounding.';
    } else if (acceleration < -1.0) {
      momentumCategory = 'RAPID_DETERIORATION';
      trajectory = 'Rapid deterioration: Execution velocity decelerating sharply.';
    } else if (acceleration < -0.2 || v1 < 0.5) {
      momentumCategory = 'DETERIORATING';
      trajectory = 'Moderate deterioration: Pacing slower than preceding cycles.';
    } else if (acceleration > 2.0 && v1 > 3.0) {
      momentumCategory = 'RECOVERING';
      trajectory = 'Active recovery: Rapid pace acceleration across latest reporting periods.';
    } else if (acceleration > 0.5) {
      momentumCategory = 'IMPROVING';
      trajectory = 'Improving: Positive delivery acceleration observed.';
    }
  } else if (costGrowthPct > 100 || extensionMonths > 48) {
    momentumCategory = 'CRITICAL_ACCELERATION';
    trajectory = 'Severe long-term divergence: Over 100% cost growth recorded.';
  } else if (costGrowthPct > 40 || extensionMonths > 24) {
    momentumCategory = 'RAPID_DETERIORATION';
    trajectory = 'Rapid deterioration: Substantial revision over baseline schedule.';
  } else if (costGrowthPct > 15 || extensionMonths > 12) {
    momentumCategory = 'DETERIORATING';
    trajectory = 'Moderate lag against initial targets.';
  }

  const momentumObj = {
    momentumCategory,
    category: momentumCategory,
    acceleration,
    trajectory,
    trend: momentumCategory,
  };

  // -------------------------------------------------------------
  // Forward Risk Transitions (Part 2C: 30d, 60d, 90d)
  // -------------------------------------------------------------
  const transitions = projectRiskTransitions(riskScore, momentumCategory, acceleration);

  // -------------------------------------------------------------
  // Epistemic Prediction Confidence (Part 3)
  // -------------------------------------------------------------
  const confidence = calculatePredictionConfidence(project, snapshots, options);

  // -------------------------------------------------------------
  // Project Criticality & Intervention Priority (Part 9)
  // -------------------------------------------------------------
  const priority = calculateProjectPriority(project, { riskScore, momentumCategory }, options);

  return {
    projectId: project.project_id || (project.project_code ? `PAI-${project.project_code}` : 'UNKNOWN'),
    projectCode: project.project_code,
    projectName: project.project_name,
    sector: project.sector,
    ministry: project.ministry,
    state: project.state,
    riskScore,
    riskBand,
    riskMomentum: momentumCategory,
    momentum: momentumObj,
    transitions,
    confidence: {
      score: confidence.confidenceScore,
      reliabilityLevel: confidence.reliabilityLevel,
      completenessScore: confidence.completenessScore,
      snapshotDepth: confidence.snapshotDepth,
      warnings: confidence.warnings,
    },
    priority: {
      priorityScore: priority.priorityScore,
      priorityBand: priority.priorityBand,
      priorityLabel: priority.priorityLabel,
      criticalityScore: priority.criticalityScore,
    },
    dimensions: {
      schedule: weightedSchedule,
      cost: weightedCost,
      progress: weightedProgress,
      expenditure: weightedExpenditure,
      predictive: weightedPredictive,
      weakSignal: weightedWeakSignal,
      raw: {
        schedule: scheduleScore,
        cost: costScore,
        progress: progressScore,
        expenditure: expenditureScore,
        predictive: predictiveScore,
        weakSignal: weakSignalScore,
      },
      weights: RISK_WEIGHTS,
    },
    drivers,
    predictiveProbability,
    revisedCostCr: Number(project.revised_cost || project.revisedCostCr || 0),
    originalCostCr: Number(project.original_cost || project.originalCostCr || 0),
    costOverrunCr: overrunCr,
    scheduleExtensionMonths: extensionMonths,
    physicalProgress,
    expenditureRatioPct: expRatio,
    dataMode,
    engineVersion: 'risk-v2.3-dynamic',
    calculatedAt: new Date().toISOString(),
    provenance: {
      source: 'PAIMANA Table 6 Grounded Ingestion Engine',
      snapshotBaseline: 'April 2026',
      totalProjectsEvaluated: 1981,
    },
  };
}

/**
 * Deterministic Comparator for Sorting & Tie-Breaking
 * Supports sorting by riskScore, priorityScore, criticalityScore, costExposure, or delayMonths.
 */
export function compareProjectsByRisk(a, b, order = 'desc', sortField = 'riskScore') {
  const mult = order === 'asc' ? 1 : -1;

  if (sortField === 'priority' || sortField === 'priorityScore') {
    const pA = a.priority?.priorityScore ?? (a.priorityScore || 0);
    const pB = b.priority?.priorityScore ?? (b.priorityScore || 0);
    if (pA !== pB) return mult * (pA - pB);
  }

  const scoreA = a.riskScore !== undefined ? a.riskScore : (a.risk_score || 0);
  const scoreB = b.riskScore !== undefined ? b.riskScore : (b.risk_score || 0);

  if (scoreA !== scoreB) {
    return mult * (scoreA - scoreB);
  }

  // Tie-break 1: Predictive Probability
  const probA = a.predictiveProbability !== undefined ? a.predictiveProbability : (a.predictive_probability || 0);
  const probB = b.predictiveProbability !== undefined ? b.predictiveProbability : (b.predictive_probability || 0);
  if (probA !== probB) {
    return mult * (probA - probB);
  }

  // Tie-break 2: Cost Exposure
  const costA = Number(a.revisedCostCr || a.revised_cost || 0);
  const costB = Number(b.revisedCostCr || b.revised_cost || 0);
  if (costA !== costB) {
    return mult * (costA - costB);
  }

  // Tie-break 3: Delay extension
  const delayA = Number(a.scheduleExtensionMonths || a.schedule_extension_months || 0);
  const delayB = Number(b.scheduleExtensionMonths || b.schedule_extension_months || 0);
  return mult * (delayA - delayB);
}
