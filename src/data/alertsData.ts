import { EarlyWarningAlert } from '../types/alert';
import { SYNTHETIC_PROJECTS } from './syntheticProjects';

export function generateComprehensiveAlerts(): EarlyWarningAlert[] {
  // 1. HERO EARLY WARNING (PJ-1042: Eastern Freight Corridor Expansion)
  const heroAlert: EarlyWarningAlert = {
    id: 'ALT-HERO-PJ1042',
    project_id: 'PJ-1042',
    project_name: 'Eastern Freight Corridor Expansion (Package E-4)',
    sector: 'Transport & Logistics',
    state: 'Uttar Pradesh / Bihar',
    alert_type: 'Simultaneous Multi-Indicator Deterioration',
    severity: 'CRITICAL',
    trigger_reason: 'Physical execution progress (61%) diverged 15% below planned baseline (76%), compounding with 3 consecutive delayed milestones.',
    detected_date: '2026-08-12',
    current_value: '61% Physical / 58% Financial (15% Lag)',
    expected_value: '76% Planned Execution Baseline',
    lead_time_months: 4.3,
    lead_time_narrative: 'Detected approximately 4.3 months before projected commercial COD schedule slippage.',
    supporting_signals: [
      '3 consecutive engineering milestones past statutory target (Track Laying, Substations, Interlocking).',
      'Right-of-Way land acquisition achieved 52% against required baseline target 90%.',
      'High-voltage 400kV transmission line shutdown clearance pending >120 days.',
      'Capital expenditure (58%) trailing planned cash flow disbursement schedule (76%).',
    ],
    estimated_cost_impact_cr: 730,
    estimated_delay_impact_months: 7,
    confidence_score: 94,
    recommended_action: 'Escalate land acquisition escrow and utility-shifting shutdown permits before next quarterly milestone window.',
    status: 'DETECTED',
  };

  const alerts: EarlyWarningAlert[] = [heroAlert];

  // 2. Generate dynamic operational alerts across other high-risk and critical projects
  SYNTHETIC_PROJECTS.slice(1).forEach((project, idx) => {
    if (project.risk_score >= 55) {
      const progressGap = project.planned_progress - project.physical_progress;
      const expGap = project.planned_progress - project.financial_progress;

      // Trigger Archetype A: Severe Progress Divergence & Milestone Delay
      if (progressGap > 12 && project.milestones_delayed >= 2) {
        const leadTime = Number((3.5 + (idx % 3) * 0.5).toFixed(1));
        alerts.push({
          id: `ALT-${project.project_id}-PROG`,
          project_id: project.project_id,
          project_name: project.project_name,
          sector: project.sector,
          state: project.state,
          alert_type: 'Schedule Delay Risk',
          severity: project.risk_score >= 75 ? 'CRITICAL' : 'HIGH',
          trigger_reason: `Critical progress divergence detected: ${Math.round(progressGap)}% execution lag behind planned schedule.`,
          detected_date: '2026-08-15',
          current_value: `${project.physical_progress}% Physical Progress`,
          expected_value: `${project.planned_progress}% Scheduled Benchmark`,
          lead_time_months: leadTime,
          lead_time_narrative: `Detected ${leadTime} months ahead of expected critical path failure.`,
          supporting_signals: [
            `${project.milestones_delayed} milestones in delayed status.`,
            `Predicted delay exposure of +${project.predicted_delay_months} months.`,
          ],
          estimated_cost_impact_cr: project.predicted_cost_overrun,
          estimated_delay_impact_months: project.predicted_delay_months,
          confidence_score: 91,
          recommended_action: 'Convene Project Review Board to mandate double-shift contractor recovery schedule.',
          status: idx % 4 === 0 ? 'ACKNOWLEDGED' : 'DETECTED',
          acknowledged_by: idx % 4 === 0 ? 'Monitoring Officer' : undefined,
          acknowledged_at: idx % 4 === 0 ? '2026-08-18' : undefined,
        });
      }

      // Trigger Archetype B: Land Handover Deficit
      if (project.land_progress < project.land_target - 15) {
        const deficit = project.land_target - project.land_progress;
        const leadTime = Number((4.5 + (idx % 2) * 0.8).toFixed(1));
        alerts.push({
          id: `ALT-${project.project_id}-LAND`,
          project_id: project.project_id,
          project_name: project.project_name,
          sector: project.sector,
          state: project.state,
          alert_type: 'Land Acquisition Delay',
          severity: deficit > 25 ? 'CRITICAL' : 'HIGH',
          trigger_reason: `Right-of-Way handover deficit of ${deficit}% blocking continuous site access.`,
          detected_date: '2026-08-08',
          current_value: `${project.land_progress}% Acquired`,
          expected_value: `${project.land_target}% Target Baseline`,
          lead_time_months: leadTime,
          lead_time_narrative: `Early detection provides ${leadTime} months lead time for district compensation award before civil stoppage.`,
          supporting_signals: [
            `Land status: ${project.land_status}`,
            `Inter-agency dependency count: ${project.dependency_count}`,
          ],
          estimated_cost_impact_cr: Math.round(project.revised_cost * 0.04),
          estimated_delay_impact_months: Math.max(2, Math.round(deficit * 0.12)),
          confidence_score: 93,
          recommended_action: 'Direct district revenue liaison cell to release pending escrow compensation.',
          status: idx % 3 === 0 ? 'ACTION_INITIATED' : 'DETECTED',
          acknowledged_by: idx % 3 === 0 ? 'State Liaison Officer' : undefined,
          acknowledged_at: idx % 3 === 0 ? '2026-08-14' : undefined,
        });
      }

      // Trigger Archetype C: Expenditure Anomaly & Cash Flow Lag
      if (expGap > 15) {
        const leadTime = 3.8;
        alerts.push({
          id: `ALT-${project.project_id}-EXP`,
          project_id: project.project_id,
          project_name: project.project_name,
          sector: project.sector,
          state: project.state,
          alert_type: 'Expenditure Anomaly',
          severity: 'HIGH',
          trigger_reason: `Capital expenditure (${project.financial_progress}%) trailing planned milestone trajectory (${project.planned_progress}%) by ${Math.round(expGap)}%.`,
          detected_date: '2026-08-02',
          current_value: `₹${project.cumulative_expenditure.toLocaleString()} Cr Expended`,
          expected_value: `₹${Math.round((project.planned_progress / 100) * project.revised_cost).toLocaleString()} Cr Target`,
          lead_time_months: leadTime,
          lead_time_narrative: `Anticipates contractor liquidity friction ${leadTime} months before on-site workforce demobilization.`,
          supporting_signals: [
            `Contractor: ${project.contractor}`,
            `Approval delay status: ${project.approval_delay}`,
          ],
          estimated_cost_impact_cr: Math.round(project.revised_cost * 0.035),
          estimated_delay_impact_months: 2,
          confidence_score: 87,
          recommended_action: 'Audit pending contractor variation bills and release undisputed milestone payments.',
          status: 'DETECTED',
        });
      }

      // Trigger Archetype D: Utility Clearance Bottlenecks
      if (project.utility_shift_status === 'Critical Delay') {
        const leadTime = 4.0;
        alerts.push({
          id: `ALT-${project.project_id}-UTIL`,
          project_id: project.project_id,
          project_name: project.project_name,
          sector: project.sector,
          state: project.state,
          alert_type: 'Utility Clearance Bottleneck',
          severity: 'HIGH',
          trigger_reason: 'High-voltage transmission line / pipeline relocation overdue by >90 days.',
          detected_date: '2026-07-28',
          current_value: 'Critical Delay (>90 Days)',
          expected_value: 'Clearance Executed',
          lead_time_months: leadTime,
          lead_time_narrative: `Yields ${leadTime} months advance window for SLMC grid shutdown coordination.`,
          supporting_signals: [
            `Clearance status: ${project.environment_clearance}`,
            `Implementing agency: ${project.implementing_agency}`,
          ],
          estimated_cost_impact_cr: Math.round(project.revised_cost * 0.025),
          estimated_delay_impact_months: 3,
          confidence_score: 89,
          recommended_action: 'Escalate to State Power Transmission Corporation for scheduled weekend shutdown window.',
          status: idx % 5 === 0 ? 'RESOLVED' : 'ACKNOWLEDGED',
          acknowledged_by: 'Nodal Power Officer',
          acknowledged_at: '2026-08-01',
        });
      }
    }
  });

  return alerts;
}

export const INITIAL_COMPREHENSIVE_ALERTS: EarlyWarningAlert[] = generateComprehensiveAlerts();
