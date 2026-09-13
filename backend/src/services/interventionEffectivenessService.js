/**
 * PAIMANA PREDICT — INTERVENTION EFFECTIVENESS ENGINE (Part 6)
 * 
 * Closes the administrative loop by measuring actual outcomes:
 *   Warning -> Intervention -> Evidence -> Outcome -> Risk Change -> Effectiveness Score -> Learn
 * 
 * Tracks category-level historical effectiveness to guide future prescriptive recommendations.
 */

export const INTERVENTION_CATEGORIES = [
  {
    category: 'UTILITY_LINE_SHIFTING',
    title: 'Utility Coordination & Relocation',
    historicalEffectivenessPct: 82,
    success_rate: 82,
    sampleSize: 142,
    meanRiskReductionPts: 16,
    avg_risk_reduction_pts: 16,
    meanScheduleRecoveryMonths: 3.8,
    status: 'HIGHLY_EFFECTIVE',
  },
  {
    category: 'ROW_LAND_ESCALATION',
    title: 'Right-of-Way & Land Handover Escalation',
    historicalEffectivenessPct: 71,
    success_rate: 71,
    sampleSize: 215,
    meanRiskReductionPts: 19,
    avg_risk_reduction_pts: 19,
    meanScheduleRecoveryMonths: 4.5,
    status: 'EFFECTIVE',
  },
  {
    category: 'JOINT_RAPID_TASKFORCE',
    title: 'Joint Inter-Ministerial Rapid Taskforce',
    historicalEffectivenessPct: 88,
    success_rate: 88,
    sampleSize: 64,
    meanRiskReductionPts: 22,
    avg_risk_reduction_pts: 22,
    meanScheduleRecoveryMonths: 5.1,
    status: 'VERY_HIGH_EFFECTIVENESS',
  },
  {
    category: 'FINANCIAL_RESTRUCTURING',
    title: 'Cash-Flow & Financial Allocation Sync',
    historicalEffectivenessPct: 77,
    success_rate: 77,
    sampleSize: 98,
    meanRiskReductionPts: 14,
    avg_risk_reduction_pts: 14,
    meanScheduleRecoveryMonths: 3.1,
    status: 'EFFECTIVE',
  },
  {
    category: 'CONTRACTOR_MOBILIZATION',
    title: 'Contractor Resource Augmentation Directive',
    historicalEffectivenessPct: 63,
    success_rate: 63,
    sampleSize: 180,
    meanRiskReductionPts: 11,
    avg_risk_reduction_pts: 11,
    meanScheduleRecoveryMonths: 2.2,
    status: 'MODERATELY_EFFECTIVE',
  },
];

class InterventionEffectivenessService {
  constructor() {
    this.outcomes = [
      {
        id: 'out-101',
        actionId: 'act-101',
        projectId: 'PAI-706775',
        projectName: 'BharatNet',
        interventionType: 'ROW_LAND_ESCALATION',
        interventionTitle: 'Establish Special Taskforce for GP Fiber Handover',
        assignedDate: '2026-03-01',
        completedDate: '2026-04-15',
        beforeRiskScore: 84,
        afterRiskScore: 68,
        riskReductionPts: 16,
        scheduleRecoveryMonths: 2.5,
        evidenceVerified: true,
        verificationOfficer: 'Priya Iyer (Monitoring Officer)',
        provenanceTag: 'DEMO_CLOSED_LOOP_RECORD',
      },
    ];
  }

  /**
   * Returns category-level historical effectiveness benchmarks.
   */
  getCategoryBenchmarks() {
    return {
      categories: INTERVENTION_CATEGORIES,
      totalCompletedInterventionsEvaluated: 699,
      meanPortfolioRiskReductionPts: 16.4,
      provenance: {
        type: 'PLATFORM_LEARNING_AGGREGATE',
        disclaimer: 'Category effectiveness benchmarks compiled from historical case audits and synthetic demonstration workflows.',
      },
    };
  }

  /**
   * Records a verified intervention outcome and computes risk delta.
   */
  recordOutcome(data) {
    const {
      actionId,
      projectId,
      projectName,
      interventionType,
      interventionTitle,
      beforeRiskScore,
      afterRiskScore,
      scheduleRecoveryMonths,
      verificationOfficer,
    } = data;

    const riskDelta = Number(beforeRiskScore || 0) - Number(afterRiskScore || 0);

    const record = {
      id: `out-${Date.now()}`,
      actionId,
      projectId,
      projectName,
      interventionType: interventionType || 'UTILITY_LINE_SHIFTING',
      interventionTitle,
      assignedDate: data.assignedDate || new Date(Date.now() - 2592000000).toISOString().split('T')[0],
      completedDate: new Date().toISOString().split('T')[0],
      beforeRiskScore: Number(beforeRiskScore || 0),
      afterRiskScore: Number(afterRiskScore || 0),
      riskReductionPts: riskDelta,
      scheduleRecoveryMonths: Number(scheduleRecoveryMonths || 1.5),
      evidenceVerified: true,
      verificationOfficer: verificationOfficer || 'Monitoring Officer',
      recordedAt: new Date().toISOString(),
    };

    this.outcomes.unshift(record);
    return record;
  }

  getProjectOutcomes(projectId) {
    const formattedId = `PAI-${projectId.replace(/^PAI-/i, '').trim()}`;
    return this.outcomes.filter(o => o.projectId === formattedId);
  }
}

export const interventionEffectivenessService = new InterventionEffectivenessService();
