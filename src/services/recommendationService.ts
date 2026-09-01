import { Project, Recommendation } from '../types/project';
import { DecisionBrief } from '../types/riskNetwork';

class RecommendationService {
  /**
   * Generates prioritized prescriptive interventions tailored to project telemetry.
   */
  public getRecommendations(project: Project): Recommendation[] {
    const rawRecommendations: (Recommendation & { rawScore: number })[] = [];

    // 1. Multi-Risk Simultaneous Bottleneck (Highest Priority when critical)
    const isMultiRisk =
      (project.land_progress < project.land_target - 15) &&
      (project.milestones_delayed >= 2) &&
      (project.utility_shift_status === 'Critical Delay' || project.utility_shift_status === 'In Progress');

    if (isMultiRisk) {
      rawRecommendations.push({
        id: `rec-${project.project_id}-multi`,
        priority: 1,
        title: 'Convene PMO Inter-Ministerial Fast-Track Taskforce',
        category: 'Monitoring',
        problem: 'Simultaneous convergence of Right-of-Way deficits, transmission line hold-ups, and milestone slippages.',
        evidence: `Risk Score is ${project.risk_score}/100 with ${project.predicted_delay_months} months projected delay and ${project.milestones_delayed} delayed milestones.`,
        impact: `Compounded cascading risk threatening overall commissioning target by up to ${project.predicted_delay_months} months.`,
        action: 'Convene empowered inter-ministerial coordination meeting involving Nodal Ministry, State Chief Secretary, and Implementing Agency.',
        expected_benefit: 'Aligns statutory decisions in a single window, preventing an estimated ₹120-250 Cr in compounding delay claims.',
        responsible_entity: `PMO Infrastructure Cell / ${project.ministry}`,
        urgency: 'Immediate',
        rawScore: 98,
      });
    }

    // 2. Land Acquisition & RoW Intervention
    if (project.land_progress < project.land_target) {
      const deficit = project.land_target - project.land_progress;
      const urgency = deficit > 20 ? 'Immediate' : 'High';
      rawRecommendations.push({
        id: `rec-${project.project_id}-land`,
        priority: 1,
        title: 'Accelerate District Land Acquisition & RoW Handover',
        category: 'Land',
        problem: `Right-of-Way handover deficit of ${deficit}% blocking unencumbered site access.`,
        evidence: `Land acquired is ${project.land_progress}% against required baseline target of ${project.land_target}%.`,
        impact: `Imposes an estimated ${project.predicted_delay_months > 4 ? '3-5' : '1-2'} month delay on critical path civil works.`,
        action: 'Empower Special Land Acquisition Officer (SLAO) with direct district escrow fund release for immediate compensation disbursement.',
        expected_benefit: `Could eliminate ~2.5 to 3.5 months of projected schedule exposure.`,
        responsible_entity: `${project.implementing_agency} / State Revenue Department`,
        urgency,
        rawScore: 90 + deficit * 0.2,
      });
    }

    // 3. Utility Shifting & Transmission Line Relocation
    if (project.utility_shift_status === 'Critical Delay' || project.utility_shift_status === 'In Progress') {
      const isCrit = project.utility_shift_status === 'Critical Delay';
      rawRecommendations.push({
        id: `rec-${project.project_id}-utility`,
        priority: isCrit ? 1 : 2,
        title: 'Mandate Coordinated Transmission Line & Feeder Shutdown Windows',
        category: 'Clearance',
        problem: 'High-voltage line crossings and water pipeline relocations pending clearance.',
        evidence: `Utility shifting status is recorded as "${project.utility_shift_status}".`,
        impact: 'Halts overhead bridge girder launching and heavy crane deployment on critical sections.',
        action: 'Direct State Power Transmission Utility and PGCIL to sanction staggered weekend line shutdown windows.',
        expected_benefit: 'Unlocks ₹150+ Cr worth of pending superstructure and mast erection civil packages.',
        responsible_entity: `State Transmission Utility / ${project.implementing_agency}`,
        urgency: isCrit ? 'Immediate' : 'High',
        rawScore: isCrit ? 88 : 75,
      });
    }

    // 4. Milestone Slippage & Critical Path Crashing
    if (project.milestones_delayed > 0) {
      const isMajor = project.milestones_delayed >= 3;
      rawRecommendations.push({
        id: `rec-${project.project_id}-milestone`,
        priority: isMajor ? 1 : 2,
        title: 'Execute Critical Path Crashing & Milestone Recovery Plan',
        category: 'Milestone',
        problem: `${project.milestones_delayed} milestone(s) currently in delayed status.`,
        evidence: `Physical progress of ${project.physical_progress}% lags planned ${project.planned_progress}% (${project.planned_progress - project.physical_progress}% gap).`,
        impact: `Risks overall commercial commissioning deadline slippage by +${project.predicted_delay_months} months.`,
        action: 'Instruct EPC contractor to submit revised catch-up schedule incorporating double-shift operations and parallel signaling shifts.',
        expected_benefit: 'Recovers approximately 35–45% of accumulated milestone schedule variance within 90 days.',
        responsible_entity: `Project Director, ${project.implementing_agency}`,
        urgency: isMajor ? 'Immediate' : 'High',
        rawScore: 82 + project.milestones_delayed * 3,
      });
    }

    // 5. Low Expenditure & Billing Cycle Alignment
    const expGap = project.planned_progress - project.financial_progress;
    if (expGap > 10) {
      rawRecommendations.push({
        id: `rec-${project.project_id}-expenditure`,
        priority: 2,
        title: 'Audit Pending Contractor Invoices & Accelerate Capital Disbursement',
        category: 'Expenditure',
        problem: `Financial progress (${project.financial_progress}%) lagging planned trajectory (${project.planned_progress}%).`,
        evidence: `Capital expenditure deployment deficit of ${Math.round(expGap)}% against scheduled cash flow requirements.`,
        impact: 'Strains contractor working capital, leading to reduced daily labour deployment and supplier credit bottlenecks.',
        action: 'Release 75% ad-hoc provisional payments against undisputed variation bills as per Ministry arbitration guidelines.',
        expected_benefit: 'Restores vendor liquidity and boosts daily execution velocity by ~20%.',
        responsible_entity: `${project.ministry} Finance Division / ${project.implementing_agency}`,
        urgency: expGap > 20 ? 'High' : 'Moderate',
        rawScore: 70 + expGap * 0.5,
      });
    }

    // 6. Contractor & Labour Shortage Review
    if (project.labour_status === 'Severe Shortage' || project.material_status === 'Supply Disrupted') {
      rawRecommendations.push({
        id: `rec-${project.project_id}-contractor`,
        priority: 2,
        title: 'Contractor Performance Review & Regional Workforce Augmentation',
        category: 'Contractor',
        problem: `On-site execution constraints due to ${project.labour_status.toLowerCase()} and ${project.material_status.toLowerCase()}.`,
        evidence: `Contractor: ${project.contractor}; Labour status: ${project.labour_status}.`,
        impact: 'Constrains daily construction output and extends critical path work cycles.',
        action: 'Mandate contractor to engage regional sub-contractor backups and establish on-site cement/steel buffer inventory.',
        expected_benefit: 'Stabilizes weekly execution output against seasonal labour migration.',
        responsible_entity: `Contract Management Division / ${project.contractor}`,
        urgency: 'High',
        rawScore: 72,
      });
    }

    // Fallback if low risk
    if (rawRecommendations.length === 0) {
      rawRecommendations.push({
        id: `rec-${project.project_id}-routine`,
        priority: 3,
        title: 'Maintain Standard Bi-Weekly Telemetry Surveillance',
        category: 'Monitoring',
        problem: 'No critical operational bottlenecks detected in the current telemetry window.',
        evidence: `Composite risk score is ${project.risk_score}/100 (within normal operating band).`,
        impact: 'Project remains on target for timely commissioning.',
        action: 'Continue bi-weekly updates on the PAIMANA monitoring portal and verify upcoming milestone deliverables.',
        expected_benefit: 'Ensures proactive early warning detection if minor deviations emerge.',
        responsible_entity: `${project.implementing_agency}`,
        urgency: 'Moderate',
        rawScore: 50,
      });
    }

    // Sort by rawScore descending and assign priority (1 = Immediate, 2 = High, 3 = Moderate)
    rawRecommendations.sort((a, b) => b.rawScore - a.rawScore);

    return rawRecommendations.slice(0, 3).map((r, idx) => ({
      ...r,
      priority: (idx + 1) as 1 | 2 | 3,
    }));
  }

  /**
   * Generates a presentation-ready executive Decision Brief for any project.
   */
  public getDecisionBrief(project: Project): DecisionBrief {
    const recs = this.getRecommendations(project);
    const topDrivers = (project.risk_drivers || []).slice(0, 4).map(d => ({
      name: d.name,
      impact: d.impact_points,
      evidence: d.evidence,
    }));

    const riskChainSummary = [
      `${project.land_progress < project.land_target ? 'Right-of-Way Land Handover Deficit' : 'Initial Clearance Delay'}`,
      `Construction Pace Reduction & ${project.milestones_delayed} Milestone Delay(s)`,
      `Commercial Commissioning Forecast Extended by +${project.predicted_delay_months} Months`,
      `Terminal Capital Cost Escalation of ₹${project.predicted_cost_overrun} Cr`,
    ];

    const priorityActions = recs.map(r => ({
      priority: r.priority,
      title: r.title,
      action: r.action,
      owner: r.responsible_entity,
      benefit: r.expected_benefit,
      urgency: r.urgency || 'High',
    }));

    return {
      projectId: project.project_id,
      projectName: project.project_name,
      ministry: project.ministry,
      sector: project.sector,
      state: project.state,
      riskScore: project.risk_score,
      riskLevel: project.risk_level,
      predictedDelayMonths: project.predicted_delay_months,
      delayProbability: project.time_overrun_probability,
      predictedCostExposureCr: project.predicted_cost_overrun,
      costOverrunProbability: project.cost_overrun_probability,
      topDrivers,
      riskChainSummary,
      priorityActions,
      generatedAt: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
    };
  }
}

export const recommendationService = new RecommendationService();
