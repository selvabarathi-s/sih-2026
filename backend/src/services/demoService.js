/**
 * PAIMANA PREDICT — JUDGE DEMONSTRATION CONTROLLER (Parts 46, 47)
 * 
 * Provides an accelerated 12-stage guided journey for Smart India Hackathon evaluators:
 * Enables presenting the entire predictive, diagnostic, prescriptive, and closed-loop flow in < 2 minutes.
 */

export const DEMO_STAGES = [
  { step: 1, id: 'SELECT_PROJECT', title: '1. Select Critical Project', route: '/projects/PAI-706775', description: 'Inspect Hero Project PAI-706775 (BharatNet) under national surveillance.' },
  { step: 2, id: 'CURRENT_RISK', title: '2. Operational Risk Score', route: '/projects/PAI-706775', description: 'Review the multi-dimensional 0–100 Risk Score (84/100: CRITICAL).' },
  { step: 3, id: 'RISK_MOMENTUM', title: '3. Risk Momentum & Drivers', route: '/projects/PAI-706775', description: 'Observe velocity deceleration and multi-period deterioration momentum.' },
  { step: 4, id: 'AS_OF_PREDICTION', title: '4. As-Of Historical Prediction', route: '/as-of-prediction?projectId=PAI-706775&cutoff=2026-01', description: 'Reconstruct historical state at cutoff T under Rule T anti-leakage governance.' },
  { step: 5, id: 'RISK_PROPAGATION', title: '5. Risk Propagation Network', route: '/risk-network?projectId=PAI-706775', description: 'Trace cascading multi-tier impacts from land handover to COD extension.' },
  { step: 6, id: 'SCENARIO_SIMULATION', title: '6. Intervention Scenarios', route: '/projects/PAI-706775', description: 'Simulate "Do Nothing" vs "Fast-Track Taskforce" scenario estimates.' },
  { step: 7, id: 'EARLY_WARNING', title: '7. Deduplicated Alert & SLA', route: '/early-warnings', description: 'Inspect consolidated composite early warnings with SLA countdown.' },
  { step: 8, id: 'ASSIGN_ACTION', title: '8. Assign Administrative Action', route: '/early-warnings', description: 'Assign binding intervention task to implementing agency Nodal Officer.' },
  { step: 9, id: 'SUBMIT_EVIDENCE', title: '9. Evidence & Verification', route: '/projects/PAI-706775', description: 'Submit compliance documentation and verify field rectification.' },
  { step: 10, id: 'RECALCULATE_RISK', title: '10. Dynamic Recalculation', route: '/projects/PAI-706775', description: 'Observe immediate risk score recalculation from 84 to 68 (Recovery).' },
  { step: 11, id: 'EFFECTIVENESS_LEARN', title: '11. Intervention Effectiveness', route: '/early-warnings', description: 'Measure recovery delta and feed outcome into category effectiveness benchmarks.' },
  { step: 12, id: 'AUDIT_LOG', title: '12. Immutable Audit Trail', route: '/data-health', description: 'Verify append-only cryptographic audit logs for every officer decision.' },
];

class DemoService {
  constructor() {
    this.currentStep = 1;
    this.demoState = {
      heroProjectId: 'PAI-706775',
      activeStep: 1,
      isSimulatedActionActive: false,
      recalculatedScore: null,
      resetCount: 0,
    };
  }

  getDemoState() {
    return {
      ...this.demoState,
      currentStage: this.demoState.activeStep,
      stageInfo: DEMO_STAGES.find(s => s.step === this.demoState.activeStep) || DEMO_STAGES[0],
      stages: DEMO_STAGES.map(s => ({ ...s, name: s.title })),
      allStages: DEMO_STAGES,
    };
  }

  setDemoStep(stepNumber) {
    const num = Math.max(1, Math.min(DEMO_STAGES.length, parseInt(stepNumber, 10)));
    this.demoState.activeStep = num;
    return this.getDemoState();
  }

  resetDemo() {
    this.demoState = {
      heroProjectId: 'PAI-706775',
      activeStep: 1,
      isSimulatedActionActive: false,
      recalculatedScore: null,
      resetCount: this.demoState.resetCount + 1,
    };
    return this.getDemoState();
  }
}

export const demoService = new DemoService();
