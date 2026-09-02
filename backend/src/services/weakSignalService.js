import { temporalFeatureService } from './temporalFeatureService.js';

/**
 * PAIMANA PREDICT — WEAK-SIGNAL DETECTION ENGINE
 * Identifies sub-threshold trajectory deterioration before traditional failure thresholds are reached.
 */
class WeakSignalService {
  async detectSignals(projectId, asOfPeriod = null) {
    const feats = await temporalFeatureService.extractFeatures(projectId, asOfPeriod);
    if (!feats) {
      return {
        weakSignalScore: 15,
        severity: 'LOW',
        signals: [],
        asOfPeriod: asOfPeriod || 'Current',
      };
    }

    const signals = [];
    let rawScore = 0;

    // 1. Negative Progress Velocity Check (Weight 35)
    if (feats.progressVelocity1m <= 0) {
      const pts = 35;
      rawScore += pts;
      signals.push({
        id: 'WS-VEL-01',
        name: 'Negative Execution Velocity',
        category: 'VELOCITY_SLIPPAGE',
        impactPoints: pts,
        evidence: `Progress delta is ${feats.progressVelocity1m}%/month (stagnant/negative over last snapshot).`,
      });
    } else if (feats.progressVelocity1m < 1.0) {
      const pts = 18;
      rawScore += pts;
      signals.push({
        id: 'WS-VEL-02',
        name: 'Sub-Par Progress Velocity',
        category: 'VELOCITY_SLIPPAGE',
        impactPoints: pts,
        evidence: `Progress velocity is ${feats.progressVelocity1m}%/month (below 1.0% expected monthly milestone rate).`,
      });
    }

    // 2. Negative Progress Momentum (Deceleration, Weight 25)
    if (feats.progressMomentum < -0.5) {
      const pts = 25;
      rawScore += pts;
      signals.push({
        id: 'WS-MOM-01',
        name: 'Deteriorating Execution Momentum',
        category: 'MOMENTUM_DECELERATION',
        impactPoints: pts,
        evidence: `Execution acceleration is ${feats.progressMomentum}%/month² (velocity declining over consecutive periods).`,
      });
    }

    // 3. Expenditure / Progress Decoupling (Weight 20)
    if (feats.expProgressAlignment > 5.0 && feats.expenditureVelocityCr > 10.0) {
      const pts = 20;
      rawScore += pts;
      signals.push({
        id: 'WS-DEC-01',
        name: 'Expenditure-Progress Decoupling',
        category: 'FINANCIAL_MISMATCH',
        impactPoints: pts,
        evidence: `₹${feats.expenditureVelocityCr} Cr spent in latest period with only ${feats.progressVelocity1m}% physical progress achieved.`,
      });
    }

    // 4. Consecutive Stagnant Periods (Weight 15)
    if (feats.consecutiveStagnantPeriods >= 2) {
      const pts = Math.min(15, feats.consecutiveStagnantPeriods * 5);
      rawScore += pts;
      signals.push({
        id: 'WS-STAG-01',
        name: 'Multi-Period Stagnation Chain',
        category: 'CHRONIC_STAGNATION',
        impactPoints: pts,
        evidence: `Project has recorded ${feats.consecutiveStagnantPeriods} consecutive monthly reports with < 0.5% progress.`,
      });
    }

    // 5. Progress Volatility (Weight 5)
    if (feats.progressVolatility > 3.0) {
      const pts = 5;
      rawScore += pts;
      signals.push({
        id: 'WS-VOL-01',
        name: 'High Execution Volatility',
        category: 'TRAJECTORY_INSTABILITY',
        impactPoints: pts,
        evidence: `Progress rate standard deviation of ±${feats.progressVolatility}% indicates erratic milestone reporting.`,
      });
    }

    const weakSignalScore = Math.min(100, Math.max(0, rawScore));
    let severity = 'LOW';
    if (weakSignalScore >= 70) severity = 'CRITICAL';
    else if (weakSignalScore >= 45) severity = 'HIGH';
    else if (weakSignalScore >= 25) severity = 'MODERATE';

    return {
      projectId: feats.projectId,
      asOfPeriod: feats.asOfPeriod,
      weakSignalScore,
      severity,
      signalsCount: signals.length,
      signals,
      features: feats,
    };
  }
}

export const weakSignalService = new WeakSignalService();
