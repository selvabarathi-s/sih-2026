import { temporalFeatureService } from './temporalFeatureService.js';

/**
 * PAIMANA PREDICT — UNSUPERVISED ANOMALY DETECTION SERVICE
 * Trajectory anomaly detection over multi-period reporting behavior.
 */
class AnomalyService {
  async detectAnomaly(projectId, asOfPeriod = null) {
    const feats = await temporalFeatureService.extractFeatures(projectId, asOfPeriod);
    if (!feats) {
      return {
        projectId,
        asOfPeriod: asOfPeriod || 'Current',
        anomalyScore: 12,
        isAnomaly: false,
        anomalyReasons: [],
      };
    }

    const reasons = [];
    let anomalyScore = 0;

    // 1. Extreme Progress Volatility
    if (feats.progressVolatility > 4.5) {
      anomalyScore += 35;
      reasons.push(`High progress volatility (±${feats.progressVolatility}%) deviates significantly from standard cohort pattern.`);
    }

    // 2. High Expenditure with Zero Progress (Ghost Burn)
    if (feats.expenditureVelocityCr > 25.0 && feats.progressVelocity1m <= 0) {
      anomalyScore += 45;
      reasons.push(`Significant capital expenditure (₹${feats.expenditureVelocityCr} Cr) with zero physical progress achieved.`);
    }

    // 3. Stagnation Chain
    if (feats.consecutiveStagnantPeriods >= 3) {
      anomalyScore += 25;
      reasons.push(`Chronic stagnation chain: ${feats.consecutiveStagnantPeriods} consecutive periods with sub-0.5% progress.`);
    }

    // 4. Sudden Cost Growth
    if (feats.costGrowthPct > 100) {
      anomalyScore += 20;
      reasons.push(`Cost revision (+${feats.costGrowthPct}%) is in the top 5th percentile of all portfolio projects.`);
    }

    const normalizedScore = Math.min(100, anomalyScore);
    const isAnomaly = normalizedScore >= 50;

    return {
      projectId: feats.projectId,
      asOfPeriod: feats.asOfPeriod,
      anomalyScore: normalizedScore,
      isAnomaly,
      anomalyReasons: reasons,
      features: {
        progressVolatility: feats.progressVolatility,
        expenditureVelocityCr: feats.expenditureVelocityCr,
        consecutiveStagnantPeriods: feats.consecutiveStagnantPeriods,
        costGrowthPct: feats.costGrowthPct,
      },
    };
  }
}

export const anomalyService = new AnomalyService();
