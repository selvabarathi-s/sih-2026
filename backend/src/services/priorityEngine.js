/**
 * PAIMANA PREDICT — PROJECT CRITICALITY & INTERVENTION PRIORITY ENGINE (Part 9)
 * 
 * Explicitly separates:
 *   - RISK SCORE: Pure empirical probability/severity of project delay or cost escalation (0-100)
 *   - PROJECT CRITICALITY: National strategic importance and capital exposure (0-100)
 *   - INTERVENTION PRIORITY: Action ranking combining Criticality, Momentum, and Urgency (0-100)
 * 
 * Version: priority-v1.2-governed
 */

const STRATEGIC_SECTOR_WEIGHTS = {
  'Telecommunication': 95,
  'Railways': 95,
  'Roads & Highways': 90,
  'Urban Public Transport': 90,
  'Electricity Generation': 85,
  'Transmission & Distribution': 85,
  'Oil & Gas': 80,
  'Water Resources': 80,
  'Energy Storage': 80,
  'Coal': 75,
  'Aviation & Aviation Infrastructure': 75,
  'Healthcare': 85,
  'Education': 70,
  'Steel': 70,
  'Shipping': 70,
};

export const PRIORITY_BANDS = {
  URGENT: { label: 'URGENT INTERVENTION', min: 80, max: 100, color: 'rose' },
  HIGH: { label: 'HIGH PRIORITY', min: 60, max: 79, color: 'amber' },
  MODERATE: { label: 'ELEVATED PRIORITY', min: 40, max: 59, color: 'blue' },
  ROUTINE: { label: 'ROUTINE SURVEILLANCE', min: 0, max: 39, color: 'emerald' },
};

/**
 * Calculates Project Criticality and Intervention Priority Score.
 */
export function calculateProjectPriority(project, riskAssessment = {}, options = {}) {
  const riskScore = Number(riskAssessment.riskScore !== undefined ? riskAssessment.riskScore : (project.riskScore || 50));
  const momentum = riskAssessment.momentumCategory || project.riskMomentumCategory || 'STABLE';
  
  // 1. Capital Scale Exposure Score (0-100)
  const revisedCostCr = Number(project.revised_cost || project.revisedCostCr || project.original_cost || 0);
  let capitalScaleScore = 20;
  if (revisedCostCr >= 50000) {
    capitalScaleScore = 100; // Mega undertaking (> ₹50,000 Cr e.g. Western DFC, BharatNet)
  } else if (revisedCostCr >= 20000) {
    capitalScaleScore = 85;
  } else if (revisedCostCr >= 10000) {
    capitalScaleScore = 70;
  } else if (revisedCostCr >= 3000) {
    capitalScaleScore = 55;
  } else if (revisedCostCr >= 1000) {
    capitalScaleScore = 40;
  }

  // 2. Sector Strategic Importance Score (0-100)
  const sector = project.sector || 'General';
  const sectorWeight = STRATEGIC_SECTOR_WEIGHTS[sector] || 70;

  // 3. Systemic Interdependence Score (0-100)
  const extMonths = Number(project.schedule_extension_months || 0);
  let dependencyScore = 40;
  if (sector === 'Telecommunication' || sector === 'Railways') {
    dependencyScore = 85; // Cross-state utility / corridor dependency
  } else if (extMonths > 36) {
    dependencyScore = 75;
  }

  // -------------------------------------------------------------
  // Composite Project Criticality (0-100)
  // 40% Risk + 35% Capital Scale + 15% Sector Strategic + 10% Dependency
  // -------------------------------------------------------------
  const rawCriticality = (
    riskScore * 0.40 +
    capitalScaleScore * 0.35 +
    sectorWeight * 0.15 +
    dependencyScore * 0.10
  );
  const criticalityScore = Math.max(0, Math.min(100, Math.round(rawCriticality)));

  // -------------------------------------------------------------
  // Momentum & Urgency Multiplier for Intervention Priority
  // -------------------------------------------------------------
  let momentumMultiplier = 1.0;
  if (momentum === 'CRITICAL_ACCELERATION' || momentum === 'RAPIDLY_DETERIORATING') {
    momentumMultiplier = 1.25; // +25% priority surge for rapid deterioration
  } else if (momentum === 'DETERIORATING' || momentum === 'MODERATELY_DETERIORATING') {
    momentumMultiplier = 1.12;
  } else if (momentum === 'RECOVERING' || momentum === 'RECOVERING_RAPIDLY') {
    momentumMultiplier = 0.85; // Lower intervention priority if naturally recovering
  }

  // Urgency factor
  let urgencyBonus = 0;
  if (extMonths > 24 && Number(project.physical_progress || 0) < 50) {
    urgencyBonus = 8; // Chronic bottleneck requiring executive intervention
  }
  if (Number(project.cost_growth_pct || 0) > 100) {
    urgencyBonus += 7; // Severe cost revision
  }

  const rawPriority = (criticalityScore * momentumMultiplier) + urgencyBonus;
  const priorityScore = Math.max(0, Math.min(100, Math.round(rawPriority)));

  let priorityBand = 'ROUTINE';
  if (priorityScore >= 80) priorityBand = 'URGENT';
  else if (priorityScore >= 60) priorityBand = 'HIGH';
  else if (priorityScore >= 40) priorityBand = 'MODERATE';

  return {
    priorityScore,
    priorityBand,
    priorityLabel: PRIORITY_BANDS[priorityBand]?.label || 'ROUTINE',
    criticalityScore,
    capitalScaleScore,
    sectorWeight,
    momentumMultiplier,
    urgencyBonus,
    formulaVersion: 'priority-v1.2-governed',
    calculatedAt: new Date().toISOString(),
  };
}
