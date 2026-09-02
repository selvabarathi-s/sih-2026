/**
 * PAIMANA PREDICT — RISK SCORE PRIORITIZATION SERVICE (FRONTEND)
 * Mirrored from backend/src/services/riskScoreEngine.js
 */

export interface RiskScoreResult {
  projectId: string;
  projectName?: string;
  sector?: string;
  ministry?: string;
  state?: string;
  riskScore: number;
  riskBand: 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL';
  momentum: 'STABLE' | 'IMPROVING' | 'DETERIORATING' | 'RAPIDLY_DETERIORATING';
  dimensions: {
    schedule: number;
    cost: number;
    progress: number;
    expenditure: number;
    predictive: number;
    weakSignal: number;
    raw: {
      schedule: number;
      cost: number;
      progress: number;
      expenditure: number;
      predictive: number;
      weakSignal: number;
    };
    weights: {
      schedule: number;
      cost: number;
      progress: number;
      expenditure: number;
      predictive: number;
      weakSignal: number;
    };
  };
  drivers: Array<{
    dimension: string;
    severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
    description: string;
  }>;
  predictiveProbability: number;
  revisedCostCr: number;
  costOverrunCr: number;
  scheduleExtensionMonths: number;
  physicalProgress: number;
  expenditureRatioPct: number;
  dataMode: string;
  engineVersion: string;
  calculatedAt: string;
}

export const RISK_WEIGHTS = {
  schedule: 0.25,
  cost: 0.20,
  progress: 0.20,
  expenditure: 0.15,
  predictive: 0.15,
  weakSignal: 0.05,
};

export const RISK_BANDS = {
  LOW: { label: 'LOW', min: 0, max: 24, badgeClass: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800' },
  MODERATE: { label: 'MODERATE', min: 25, max: 49, badgeClass: 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300 border-blue-300 dark:border-blue-800' },
  HIGH: { label: 'HIGH', min: 50, max: 74, badgeClass: 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 border-amber-300 dark:border-amber-800' },
  CRITICAL: { label: 'CRITICAL', min: 75, max: 100, badgeClass: 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300 border-rose-300 dark:border-rose-800' },
};

export function classifyRiskBand(score: number): 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL' {
  const rounded = Math.max(0, Math.min(100, Math.round(score)));
  if (rounded >= 75) return 'CRITICAL';
  if (rounded >= 50) return 'HIGH';
  if (rounded >= 25) return 'MODERATE';
  return 'LOW';
}

export function computeProjectRiskScore(project: any, dataMode: string = 'REAL_PAIMANA'): RiskScoreResult {
  const isSyntheticDemo = dataMode === 'AI_DEMONSTRATION';

  // 1. Schedule Risk (25%)
  const extensionMonths = Number(project.schedule_extension_months || 0);
  let scheduleScore = extensionMonths > 0 ? Math.min(100, Math.round((extensionMonths / 60) * 100)) : (project.is_schedule_extended ? 30 : 0);
  if (isSyntheticDemo && project.milestone_delay_months) {
    scheduleScore = Math.min(100, scheduleScore + Math.round(project.milestone_delay_months * 2.5));
  }

  // 2. Cost Risk (20%)
  const costGrowthPct = Number(project.cost_growth_pct || 0);
  let costScore = costGrowthPct > 0 ? Math.min(100, Math.round((costGrowthPct / 150) * 100)) : 0;
  const overrunCr = Number(project.cost_overrun_cr || 0);
  if (overrunCr > 10000) costScore = Math.max(costScore, 65);
  else if (overrunCr > 2000) costScore = Math.max(costScore, 40);

  // 3. Progress / Deterioration (20%)
  const physicalProgress = Number(project.physical_progress || 0);
  let progressScore = 0;
  if (physicalProgress < 20 && extensionMonths > 12) progressScore = 90;
  else if (physicalProgress < 50 && extensionMonths > 24) progressScore = 80;
  else if (physicalProgress < 75 && extensionMonths > 36) progressScore = 70;
  else progressScore = Math.min(100, Math.round(Math.max(0, 100 - physicalProgress) * (extensionMonths > 0 ? 0.8 : 0.2)));
  if (project.recent_deterioration_flag) progressScore = Math.min(100, progressScore + 15);

  // 4. Expenditure Trajectory (15%)
  const expRatio = Number(project.expenditure_ratio_pct || 0);
  const disconnect = Math.abs(expRatio - physicalProgress);
  let expenditureScore = expRatio > 80 && physicalProgress < 50 ? Math.min(100, 75 + Math.round(disconnect * 0.4)) : Math.min(100, Math.round(disconnect * 1.2));

  // 5. Predictive Risk (15%)
  const predictiveProbability = project.predictive_probability !== undefined
    ? Number(project.predictive_probability)
    : (project.predictedProbability !== undefined ? Number(project.predictedProbability) : (extensionMonths > 12 || costGrowthPct > 30 ? 0.85 : 0.40));
  const predictiveScore = Math.min(100, Math.max(0, Math.round(predictiveProbability * 100)));

  // 6. Anomaly / Weak Signal (5%)
  let weakSignalScore = Number(project.weak_signal_score || 0);
  if (project.is_anomaly || project.anomaly_flag) weakSignalScore = 75;
  else if (weakSignalScore === 0) weakSignalScore = extensionMonths > 12 || costGrowthPct > 25 ? 45 : 10;
  weakSignalScore = Math.min(100, Math.max(0, Math.round(weakSignalScore)));

  // Weighted sum
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

  const drivers: Array<{ dimension: string; severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'; description: string }> = [];
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
      dimension: 'Normal Surveillance',
      severity: 'LOW',
      description: 'Project metrics within acceptable tolerance bands',
    });
  }

  let momentum: 'STABLE' | 'IMPROVING' | 'DETERIORATING' | 'RAPIDLY_DETERIORATING' = 'STABLE';
  if (project.risk_momentum) {
    momentum = project.risk_momentum;
  } else if (costGrowthPct > 50 || extensionMonths > 36 || progressScore > 70) {
    momentum = 'RAPIDLY_DETERIORATING';
  } else if (costGrowthPct > 15 || extensionMonths > 12) {
    momentum = 'DETERIORATING';
  }

  return {
    projectId: project.project_id || project.project_code || 'N/A',
    projectName: project.project_name,
    sector: project.sector,
    ministry: project.ministry,
    state: project.state,
    riskScore,
    riskBand,
    momentum,
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
    revisedCostCr: Number(project.revised_cost || 0),
    costOverrunCr: overrunCr,
    scheduleExtensionMonths: extensionMonths,
    physicalProgress,
    expenditureRatioPct: expRatio,
    dataMode,
    engineVersion: 'risk-v2.2-prioritization',
    calculatedAt: new Date().toISOString(),
  };
}

/**
 * Deterministic Sorting & Tie-Breaking
 */
export function sortProjectsByRiskPriority(projects: any[], ascending: boolean = false): any[] {
  const mult = ascending ? 1 : -1;
  return [...projects].sort((a, b) => {
    const scoreA = a.riskScore !== undefined ? a.riskScore : (computeProjectRiskScore(a).riskScore);
    const scoreB = b.riskScore !== undefined ? b.riskScore : (computeProjectRiskScore(b).riskScore);

    if (scoreA !== scoreB) {
      return mult * (scoreA - scoreB);
    }

    // Tie-break 1: Predictive probability
    const probA = Number(a.predictive_probability || a.predictedProbability || 0);
    const probB = Number(b.predictive_probability || b.predictedProbability || 0);
    if (probA !== probB) return mult * (probA - probB);

    // Tie-break 2: Revised cost exposure
    const costA = Number(a.revised_cost || a.revisedCostCr || 0);
    const costB = Number(b.revised_cost || b.revisedCostCr || 0);
    if (costA !== costB) return mult * (costA - costB);

    // Tie-break 3: Delay extension
    const delayA = Number(a.schedule_extension_months || a.scheduleExtensionMonths || 0);
    const delayB = Number(b.schedule_extension_months || b.scheduleExtensionMonths || 0);
    return mult * (delayA - delayB);
  });
}
