import { Project, RiskBreakdown, RiskDriver, RiskLevel, Recommendation, Milestone } from '../types/project';

/**
 * Calculates transparent multi-factor risk score and breakdown according to PLAN.md Section 20.
 * Normalizes all components to 0-100.
 */
export function calculateRiskBreakdown(p: {
  physical_progress: number;
  planned_progress: number;
  original_cost: number;
  revised_cost: number;
  financial_progress: number;
  cumulative_expenditure: number;
  milestones_total: number;
  milestones_delayed: number;
  land_progress: number;
  land_target: number;
  environment_clearance: string;
  utility_shift_status: string;
  tender_status: string;
  labour_status: string;
  material_status: string;
  approval_delay: string;
  dependency_count: number;
}): RiskBreakdown {
  // 1. Schedule Risk (0-100)
  const progressGap = Math.max(0, p.planned_progress - p.physical_progress);
  let schedule_risk = Math.min(100, Math.round(progressGap * 3.8));
  if (p.approval_delay === 'Major (>6 mo)') schedule_risk = Math.min(100, schedule_risk + 15);
  else if (p.approval_delay === 'Minor (<3 mo)') schedule_risk = Math.min(100, schedule_risk + 5);

  // 2. Milestone Risk (0-100)
  const delayedRatio = p.milestones_total > 0 ? (p.milestones_delayed / p.milestones_total) : 0;
  const milestone_risk = Math.min(100, Math.round(delayedRatio * 100));

  // 3. Cost Risk (0-100)
  const costEscalationRatio = p.original_cost > 0 ? ((p.revised_cost - p.original_cost) / p.original_cost) : 0;
  let cost_risk = Math.min(100, Math.round(costEscalationRatio * 350));
  if (p.material_status === 'Cost Inflation') cost_risk = Math.min(100, cost_risk + 18);

  // 4. Expenditure Trajectory Risk (0-100)
  // When physical progress is ahead of financial progress or expenditure is stalling
  const expectedExp = (p.planned_progress / 100) * p.revised_cost;
  const expDeficit = expectedExp > 0 ? Math.max(0, (expectedExp - p.cumulative_expenditure) / expectedExp) : 0;
  const expenditure_risk = Math.min(100, Math.round(expDeficit * 100));

  // 5. Dependency Risk (0-100)
  let dependency_risk = 10;
  const landDeficit = Math.max(0, p.land_target - p.land_progress);
  dependency_risk += Math.min(45, Math.round(landDeficit * 1.2));
  if (p.environment_clearance === 'Pending') dependency_risk += 25;
  if (p.environment_clearance === 'In Review') dependency_risk += 15;
  if (p.utility_shift_status === 'Critical Delay') dependency_risk += 25;
  if (p.utility_shift_status === 'In Progress') dependency_risk += 10;
  if (p.dependency_count > 3) dependency_risk += 10;
  dependency_risk = Math.min(100, Math.max(0, dependency_risk));

  // 6. Implementation Risk (0-100)
  let implementation_risk = 15;
  if (p.labour_status === 'Severe Shortage') implementation_risk += 35;
  else if (p.labour_status === 'Moderate Shortage') implementation_risk += 15;
  if (p.material_status === 'Supply Disrupted') implementation_risk += 30;
  if (p.tender_status === 'Delayed' || p.tender_status === 'Re-tendered') implementation_risk += 20;
  implementation_risk = Math.min(100, Math.max(0, implementation_risk));

  // 7. Anomaly Score (0-100)
  let anomaly_score = 10;
  if (progressGap > 15 && expDeficit > 0.25) anomaly_score = 75;
  else if (progressGap > 10) anomaly_score = 45;

  return {
    schedule_risk,
    milestone_risk,
    cost_risk,
    expenditure_risk,
    dependency_risk,
    implementation_risk,
    anomaly_score,
  };
}

export function computeTotalRiskScore(breakdown: RiskBreakdown): number {
  const weighted =
    breakdown.schedule_risk * 0.20 +
    breakdown.milestone_risk * 0.20 +
    breakdown.cost_risk * 0.20 +
    breakdown.expenditure_risk * 0.15 +
    breakdown.dependency_risk * 0.10 +
    breakdown.implementation_risk * 0.10 +
    breakdown.anomaly_score * 0.05;
  
  return Math.min(100, Math.max(0, Math.round(weighted)));
}

export function getRiskLevel(score: number): RiskLevel {
  if (score >= 75) return 'CRITICAL';
  if (score >= 50) return 'HIGH';
  if (score >= 25) return 'MODERATE';
  return 'LOW';
}

export function generateRiskDrivers(p: Project): RiskDriver[] {
  const drivers: RiskDriver[] = [];

  // Land Acquisition Driver
  if (p.land_progress < p.land_target) {
    const deficit = p.land_target - p.land_progress;
    const impact = Math.min(25, Math.round(deficit * 0.6) + 4);
    drivers.push({
      id: `drv-${p.project_id}-land`,
      name: 'Land Acquisition Delay',
      category: 'Land Acquisition',
      severity: deficit > 30 ? 'CRITICAL' : deficit > 15 ? 'HIGH' : 'MEDIUM',
      impact_points: impact,
      evidence: `Land acquisition achieved ${p.land_progress}% vs targeted ${p.land_target}% (Deficit: ${deficit}%)`,
      explanation: `Right of Way (RoW) handover pending in key stretches, preventing contractor mobilization and site preparation.`,
      recommended_action: `Initiate joint taskforce with District Revenue authorities for expedited compensation disbursement.`,
    });
  }

  // Milestone Slippage Driver
  if (p.milestones_delayed > 0) {
    const ratio = p.milestones_delayed / Math.max(1, p.milestones_total);
    const impact = Math.min(22, Math.round(ratio * 30) + 4);
    drivers.push({
      id: `drv-${p.project_id}-milestone`,
      name: 'Milestone Slippage',
      category: 'Milestone Slippage',
      severity: p.milestones_delayed >= 3 ? 'CRITICAL' : p.milestones_delayed >= 2 ? 'HIGH' : 'MEDIUM',
      impact_points: impact,
      evidence: `${p.milestones_delayed} of ${p.milestones_total} critical milestones currently in delay status`,
      explanation: `Key interim engineering milestones have slipped past statutory review dates, pushing critical path activities.`,
      recommended_action: `Conduct technical review with implementing agency to crash critical path activities.`,
    });
  }

  // Low Expenditure Trajectory Driver
  const expectedExpPct = p.planned_progress;
  const actualExpPct = p.financial_progress;
  if (expectedExpPct - actualExpPct > 10) {
    const gap = Math.round(expectedExpPct - actualExpPct);
    const impact = Math.min(18, Math.round(gap * 0.55) + 3);
    drivers.push({
      id: `drv-${p.project_id}-expenditure`,
      name: 'Low Expenditure Trajectory',
      category: 'Expenditure Trajectory',
      severity: gap > 20 ? 'HIGH' : 'MEDIUM',
      impact_points: impact,
      evidence: `Actual expenditure progress is ${actualExpPct}% vs expected trajectory ${expectedExpPct}% (${gap}% gap)`,
      explanation: `Contractor billing cycles and capital deployment are running significantly behind target disbursements.`,
      recommended_action: `Audit pending contractor invoices and verify fund release milestones with finance division.`,
    });
  }

  // Utility Shifting Driver
  if (p.utility_shift_status === 'Critical Delay' || p.utility_shift_status === 'In Progress') {
    const isCritical = p.utility_shift_status === 'Critical Delay';
    drivers.push({
      id: `drv-${p.project_id}-utility`,
      name: 'Utility Shifting & Clearances',
      category: 'Utility & Clearances',
      severity: isCritical ? 'CRITICAL' : 'MEDIUM',
      impact_points: isCritical ? 12 : 7,
      evidence: `Utility shifting status: ${p.utility_shift_status}; Environment clearance: ${p.environment_clearance}`,
      explanation: `High-tension transmission lines and water mains relocation awaiting joint inspection and forest clearance sanction.`,
      recommended_action: `Convene inter-ministerial coordination meeting with state power utility and MoEFCC.`,
    });
  }

  // Implementation / Contractor Driver
  if (p.labour_status === 'Severe Shortage' || p.material_status === 'Supply Disrupted' || p.tender_status === 'Delayed') {
    drivers.push({
      id: `drv-${p.project_id}-contractor`,
      name: 'Contractor & Supply Bottlenecks',
      category: 'Contractor & Labour',
      severity: p.labour_status === 'Severe Shortage' ? 'HIGH' : 'MEDIUM',
      impact_points: 10,
      evidence: `Labour availability: ${p.labour_status}; Material supply: ${p.material_status}`,
      explanation: `Specialized labor constraints and regional supply chain bottlenecks are slowing daily execution rates.`,
      recommended_action: `Direct contractor to deploy supplemental work shifts and regional vendor backups.`,
    });
  }

  // Fallback if low risk
  if (drivers.length === 0) {
    drivers.push({
      id: `drv-${p.project_id}-stable`,
      name: 'Stable Execution Trajectory',
      category: 'Milestone Slippage',
      severity: 'LOW',
      impact_points: 0,
      evidence: `Physical progress (${p.physical_progress}%) closely aligned with planned progress (${p.planned_progress}%)`,
      explanation: `Project milestones are progressing within standard operational tolerance limits.`,
      recommended_action: `Continue routine monthly monitoring and milestone tracking.`,
    });
  }

  return drivers.sort((a, b) => b.impact_points - a.impact_points);
}

export function generateRecommendations(p: Project): Recommendation[] {
  const recs: Recommendation[] = [];

  if (p.land_progress < p.land_target) {
    recs.push({
      id: `rec-${p.project_id}-1`,
      priority: 1,
      title: 'Accelerate District Land Acquisition & RoW Handover',
      category: 'Land',
      problem: `Land acquisition deficit of ${p.land_target - p.land_progress}% blocking unencumbered site access.`,
      evidence: `Land acquired is only ${p.land_progress}% against required ${p.land_target}%.`,
      impact: `Imposes an estimated ${p.predicted_delay_months > 4 ? '3-5' : '1-2'} month delay on critical path civil works.`,
      action: `Establish high-priority district liaison cell; release pending compensation escrow funds to district collectorate.`,
      expected_benefit: `Could eliminate ~2.5 to 3 months of projected schedule delay.`,
      responsible_entity: `${p.implementing_agency} / State Revenue Department`,
    });
  }

  if (p.utility_shift_status === 'Critical Delay' || p.utility_shift_status === 'In Progress') {
    recs.push({
      id: `rec-${p.project_id}-2`,
      priority: 2,
      title: 'Inter-Agency Utility Relocation Fast-Track',
      category: 'Clearance',
      problem: `Pending power line and water pipeline shifting halting heavy machinery deployment.`,
      evidence: `Utility status recorded as "${p.utility_shift_status}".`,
      impact: `Prevents commencement of superstructure works on critical sections.`,
      action: `Escalate to State Level Monitoring Committee (SLMC) for mandatory 21-day utility relocation clearance.`,
      expected_benefit: `Prevents cascading idle-machinery charges estimated at ₹15-30 Cr.`,
      responsible_entity: `State Transmission Utility / ${p.implementing_agency}`,
    });
  }

  if (p.milestones_delayed > 0) {
    recs.push({
      id: `rec-${p.project_id}-3`,
      priority: (recs.length + 1) as 1 | 2 | 3,
      title: 'Critical Path Compression & Milestone Recovery Plan',
      category: 'Milestone',
      problem: `${p.milestones_delayed} milestone(s) in critical delay status.`,
      evidence: `Progress gap of ${Math.max(0, p.planned_progress - p.physical_progress)}% behind schedule.`,
      impact: `Risks overall commissioning deadline slippage by ${p.predicted_delay_months} months.`,
      action: `Require EPC contractor to submit revised catch-up schedule incorporating double-shift operations.`,
      expected_benefit: `Recovers ~40% of accumulated milestone variance within 90 days.`,
      responsible_entity: `Project Director, ${p.implementing_agency}`,
    });
  }

  if (recs.length === 0) {
    recs.push({
      id: `rec-${p.project_id}-def`,
      priority: 1,
      title: 'Maintain Standard Monitoring Rhythm',
      category: 'Monitoring',
      problem: `No critical bottlenecks detected at current reporting cycle.`,
      evidence: `Risk Score is ${p.risk_score}/100 within acceptable threshold.`,
      impact: `Project remains on target for timely commissioning.`,
      action: `Ensure bi-weekly update logs in PAIMANA portal and verify upcoming milestone deliverables.`,
      expected_benefit: `Ensures early warning detection if minor deviations occur.`,
      responsible_entity: `${p.implementing_agency}`,
    });
  }

  return recs;
}
