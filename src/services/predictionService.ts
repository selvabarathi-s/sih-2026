import { Project, RiskBreakdown, RiskDriver, Recommendation } from '../types/project';
import { EarlyWarningAlert } from '../types/alert';
import { calculateRiskBreakdown, computeTotalRiskScore, getRiskLevel, generateRiskDrivers, generateRecommendations } from './riskService';

export interface PredictionResult {
  riskScore: number;
  riskLevel: 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL';
  costOverrunProbability: number;
  predictedCostExposureCr: number;
  timeOverrunProbability: number;
  predictedDelayMonths: number;
  riskBreakdown: RiskBreakdown;
  confidenceScore: number;
}

/**
 * Replaceable Prediction Service Abstraction
 * This service implements the deterministic prototype inference layer
 * and is structured to be seamlessly swapped with a RealMLPredictionService later.
 */
export class DemoPredictionService {
  /**
   * Predicts cost escalation probability and estimated rupee exposure.
   */
  public predictCostOverrun(project: Partial<Project>): { probability: number; exposureCr: number } {
    const orig = project.original_cost || 1000;
    const rev = project.revised_cost || orig;
    const currentEscalation = Math.max(0, rev - orig);

    // Predict future additional escalation based on progress deficit and material/labour flags
    const progressGap = Math.max(0, (project.planned_progress || 0) - (project.physical_progress || 0));
    const delayFactor = (project.predicted_delay_months || 0) * 0.012; // ~1.2% per month of delay overhead
    const inflationFactor = project.material_status === 'Cost Inflation' ? 0.05 : 0;
    
    const futureEscalationPct = (progressGap * 0.006) + delayFactor + inflationFactor;
    const additionalExposure = Math.round(rev * futureEscalationPct);
    const totalExposure = currentEscalation + additionalExposure;

    let probability = Math.min(95, Math.max(10, Math.round((totalExposure / orig) * 200 + (progressGap * 1.5))));
    if (project.risk_score && project.risk_score > 75) probability = Math.max(75, probability);

    return {
      probability: Math.min(99, probability),
      exposureCr: totalExposure,
    };
  }

  /**
   * Predicts schedule delay probability and expected months of slippage.
   */
  public predictTimeOverrun(project: Partial<Project>): { probability: number; delayMonths: number } {
    const planned = project.planned_progress || 0;
    const actual = project.physical_progress || 0;
    const gap = Math.max(0, planned - actual);
    
    // Monthly execution velocity
    const milestonesDelayed = project.milestones_delayed || 0;
    const landDeficit = Math.max(0, (project.land_target || 100) - (project.land_progress || 100));
    
    let delayMonths = Math.round((gap / 3.5) + (milestonesDelayed * 1.5) + (landDeficit * 0.12));
    if (project.approval_delay === 'Major (>6 mo)') delayMonths += 6;
    if (project.utility_shift_status === 'Critical Delay') delayMonths += 3;

    const delayProbability = Math.min(98, Math.max(5, Math.round((delayMonths / 18) * 80 + (gap * 1.2))));

    return {
      probability: delayProbability,
      delayMonths: Math.max(0, delayMonths),
    };
  }

  /**
   * Evaluates comprehensive project risk and updates breakdown.
   */
  public calculateRisk(project: Project): PredictionResult {
    const breakdown = calculateRiskBreakdown(project);
    const riskScore = computeTotalRiskScore(breakdown);
    const riskLevel = getRiskLevel(riskScore);
    
    const costPred = this.predictCostOverrun(project);
    const timePred = this.predictTimeOverrun(project);

    return {
      riskScore,
      riskLevel,
      costOverrunProbability: costPred.probability,
      predictedCostExposureCr: costPred.exposureCr,
      timeOverrunProbability: timePred.probability,
      predictedDelayMonths: timePred.delayMonths,
      riskBreakdown: breakdown,
      confidenceScore: 89, // Prototype calibrated confidence
    };
  }

  public getRiskDrivers(project: Project): RiskDriver[] {
    return generateRiskDrivers(project);
  }

  public getRecommendations(project: Project): Recommendation[] {
    return generateRecommendations(project);
  }

  public getEarlyWarnings(project: Project): EarlyWarningAlert[] {
    const alerts: EarlyWarningAlert[] = [];

    if (project.risk_score >= 75) {
      alerts.push({
        id: `alt-${project.project_id}-crit`,
        project_id: project.project_id,
        project_name: project.project_name,
        sector: project.sector,
        state: project.state,
        alert_type: 'Schedule Delay Risk',
        severity: 'CRITICAL',
        trigger_reason: `Critical progress divergence detected: ${Math.round(project.planned_progress - project.physical_progress)}% gap with ${project.predicted_delay_months} months projected delay.`,
        detected_date: '2026-08-15',
        current_value: `${project.physical_progress}% Physical vs ${project.planned_progress}% Planned`,
        expected_value: `${project.planned_progress}% Scheduled Benchmark`,
        lead_time_months: 4.5,
        lead_time_narrative: 'Detected 4.5 months ahead of expected milestone window.',
        supporting_signals: [
          `${project.milestones_delayed} milestone(s) in delayed status.`,
          `Predicted delay exposure of +${project.predicted_delay_months} months.`,
        ],
        estimated_cost_impact_cr: project.predicted_cost_overrun,
        estimated_delay_impact_months: project.predicted_delay_months,
        confidence_score: 88,
        recommended_action: 'Initiate urgent Project Review Board intervention with implementing agency.',
        status: 'DETECTED',
      });
    }

    if (project.land_progress < project.land_target - 15) {
      alerts.push({
        id: `alt-${project.project_id}-land`,
        project_id: project.project_id,
        project_name: project.project_name,
        sector: project.sector,
        state: project.state,
        alert_type: 'Land Acquisition Delay',
        severity: project.land_progress < project.land_target - 30 ? 'CRITICAL' : 'HIGH',
        trigger_reason: `Land handover deficit of ${project.land_target - project.land_progress}% threatening critical path civil packages.`,
        detected_date: '2026-08-10',
        current_value: `${project.land_progress}% Acquired`,
        expected_value: `${project.land_target}% Target Baseline`,
        lead_time_months: 6.0,
        lead_time_narrative: 'Provides 6.0 months advance lead time for district compensation awards.',
        supporting_signals: [
          `Land status: ${project.land_status}`,
        ],
        estimated_cost_impact_cr: Math.round(project.revised_cost * 0.04),
        estimated_delay_impact_months: Math.max(3, Math.round((project.land_target - project.land_progress) * 0.15)),
        confidence_score: 92,
        recommended_action: 'Direct state revenue liaison officer to resolve Section 19 compensation disbursements.',
        status: 'DETECTED',
      });
    }

    if (project.utility_shift_status === 'Critical Delay') {
      alerts.push({
        id: `alt-${project.project_id}-util`,
        project_id: project.project_id,
        project_name: project.project_name,
        sector: project.sector,
        state: project.state,
        alert_type: 'Utility Clearance Bottleneck',
        severity: 'HIGH',
        trigger_reason: `Transmission line & water feeder relocation overdue by >90 days.`,
        detected_date: '2026-08-01',
        current_value: 'Critical Delay (>90 Days)',
        expected_value: 'Clearance Executed',
        lead_time_months: 3.5,
        lead_time_narrative: 'Yields 3.5 months advance window for SLMC grid shutdown coordination.',
        supporting_signals: [
          `Clearance status: ${project.environment_clearance}`,
        ],
        estimated_cost_impact_cr: Math.round(project.revised_cost * 0.025),
        estimated_delay_impact_months: 3,
        confidence_score: 85,
        recommended_action: 'Request State Energy Dept joint inspection and shutdown permit.',
        status: 'ACKNOWLEDGED',
        acknowledged_by: 'Monitoring Officer (Transport)',
        acknowledged_at: '2026-08-05',
      });
    }

    return alerts;
  }
}

export const predictionService = new DemoPredictionService();
