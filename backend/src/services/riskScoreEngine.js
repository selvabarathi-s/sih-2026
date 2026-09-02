/**
 * PAIMANA PREDICT — RISK SCORE AS PRIMARY PROJECT PRIORITIZATION ENGINE
 * 
 * Formal 0–100 Operational Risk Scoring Engine.
 * Combines 6 transparent dimensions with governed weights, risk bands, momentum, and tie-breaking.
 * 
 * Dimensions:
 * A. Schedule Risk (25%)
 * B. Cost Risk (20%)
 * C. Progress / Deterioration Risk (20%)
 * D. Expenditure Trajectory Risk (15%)
 * E. Predictive Risk Signal (15%)
 * F. Anomaly / Weak Signal Risk (5%)
 * Total = 100%
 */

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
 * Calculates normalized 0-100 dimension scores and composite Risk Score for a project.
 * Supports both REAL_PAIMANA mode and enriched AI_DEMONSTRATION mode.
 */
export function calculateProjectRiskScore(project, options = {}) {
  const dataMode = options.dataMode || project.data_mode || 'REAL_PAIMANA';
  const isSyntheticDemo = dataMode === 'AI_DEMONSTRATION';

  // -------------------------------------------------------------
  // 1. Dimension A: Schedule Risk (0-100) — Weight: 25%
  // -------------------------------------------------------------
  const extensionMonths = Number(project.schedule_extension_months || 0);
  let scheduleScore = 0;
  if (extensionMonths > 0) {
    // 60+ months delay reaches 100/100
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
    // 150%+ cost growth reaches 100/100
    costScore = Math.min(100, Math.round((costGrowthPct / 150) * 100));
  }
  // If absolute cost overrun exceeds ₹10,000 Cr, minimum cost risk of 50
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
  
  // Progress lag evaluation
  if (physicalProgress < 20 && extensionMonths > 12) {
    progressScore = 90; // Stagnant early-stage mega-delay
  } else if (physicalProgress < 50 && extensionMonths > 24) {
    progressScore = 80;
  } else if (physicalProgress < 75 && extensionMonths > 36) {
    progressScore = 70;
  } else {
    // Inverse progress with extension ratio
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

  // Capital disconnect: spending vs physical delivery
  const disconnect = Math.abs(expRatio - physicalProgress);
  if (expRatio > 80 && physicalProgress < 50) {
    // High expenditure without matching physical delivery -> Severe capital burn risk
    expenditureScore = Math.min(100, 75 + Math.round(disconnect * 0.4));
  } else if (expRatio < 20 && extensionMonths > 24) {
    // Stalled financial execution despite long elapsed schedule
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
  
  // Default calibrated baseline prediction if not present
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

  // Identify Top Primary Risk Drivers
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
      dimension: 'Capital Burn Asymmetry',
      severity: expenditureScore >= 75 ? 'CRITICAL' : 'HIGH',
      description: `Expenditure ratio (${expRatio}%) disconnected from physical delivery (${physicalProgress}%)`,
    });
  }
  if (predictiveScore >= 60) {
    drivers.push({
      dimension: 'Predictive Horizon Risk',
      severity: predictiveScore >= 80 ? 'CRITICAL' : 'HIGH',
      description: `${predictiveScore}% probability of 90-day adverse deterioration event`,
    });
  }
  if (drivers.length === 0) {
    drivers.push({
      dimension: 'Normal Operational Surveillance',
      severity: 'LOW',
      description: 'Project metrics within acceptable tolerance bands',
    });
  }

  // Momentum determination
  let momentumCategory = 'STABLE';
  let trajectory = 'Stable execution velocity.';
  if (project.risk_momentum) {
    momentumCategory = project.risk_momentum;
  } else if (costGrowthPct > 50 || extensionMonths > 36 || progressScore > 70) {
    momentumCategory = 'RAPIDLY_DETERIORATING';
    trajectory = 'Rapid deterioration: Execution velocity decelerating sharply.';
  } else if (costGrowthPct > 15 || extensionMonths > 12) {
    momentumCategory = 'DETERIORATING';
    trajectory = 'Moderate deterioration: Progress lagging baseline schedule.';
  }

  const momentumObj = {
    momentumCategory,
    category: momentumCategory,
    trajectory,
    trend: momentumCategory,
  };

  return {
    projectId: project.project_id || project.project_code,
    projectName: project.project_name,
    sector: project.sector,
    ministry: project.ministry,
    state: project.state,
    riskScore,
    riskBand,
    riskMomentum: momentumCategory,
    momentum: momentumObj,
    dimensions: {
      schedule: weightedSchedule,
      cost: weightedCost,
      progress: weightedProgress,
      expenditure: weightedExpenditure,
      predictive: weightedPredictive,
      weakSignal: weightedWeakSignal,
      // Raw unweighted 0-100 scores
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
    revisedCostCr: project.revised_cost,
    costOverrunCr: overrunCr,
    scheduleExtensionMonths: extensionMonths,
    physicalProgress,
    expenditureRatioPct: expRatio,
    dataMode,
    engineVersion: 'risk-v2.2-prioritization',
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
 * Sorts primarily by Risk Score (DESC).
 * Tie-Breaks using:
 * 1. Predictive probability (DESC)
 * 2. Revised cost / financial exposure (DESC)
 * 3. Schedule extension months (DESC)
 */
export function compareProjectsByRisk(a, b, order = 'desc') {
  const mult = order === 'asc' ? 1 : -1;

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

  // Tie-break 2: Cost Exposure / Revised Cost
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
