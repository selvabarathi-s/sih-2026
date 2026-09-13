import { snapshotRepository } from '../repositories/snapshotRepository.js';

/**
 * PAIMANA PREDICT — TEMPORAL FEATURE ENGINEERING SERVICE
 * Strict Anti-Temporal Leakage (Rule T): Features at asOfDate use ONLY snapshots <= asOfDate.
 */
class TemporalFeatureService {
  /**
   * Extracts historical time-series features for a project as of a specific cutoff period.
   */
  async extractFeatures(projectId, asOfPeriod = null) {
    const rawId = (projectId || '').replace(/^PAI-/, '');
    const allSnapshots = await snapshotRepository.findByProjectCode(rawId);

    if (!allSnapshots || allSnapshots.length === 0) {
      return null;
    }

    // Filter strictly to t <= asOfPeriod (or all if asOfPeriod not specified)
    let history = [...allSnapshots].sort((a, b) => a.report_date_key.localeCompare(b.report_date_key));
    if (asOfPeriod) {
      history = history.filter(s => s.report_period <= asOfPeriod || s.report_date_key <= asOfPeriod);
    }

    if (history.length === 0) {
      history = [allSnapshots[0]];
    }

    const current = history[history.length - 1];
    const prev = history.length > 1 ? history[history.length - 2] : current;

    const pCurr = Number(current.physical_progress || 0);
    const pPrev = Number(prev.physical_progress || pCurr);

    const eCurr = Number(current.cumulative_expenditure || 0);
    const ePrev = Number(prev.cumulative_expenditure || eCurr);

    const cCurr = Number(current.revised_cost || current.original_cost || 1);
    const cOrig = Number(current.original_cost || cCurr || 1);

    // 1. Progress Velocity (1-month and 3-month)
    const velocity1m = Number((pCurr - pPrev).toFixed(2));
    const p3m = history.length >= 4 ? Number(history[history.length - 4].physical_progress || pCurr) : pPrev;
    const velocity3m = Number(((pCurr - p3m) / Math.max(1, Math.min(3, history.length - 1))).toFixed(2));

    // 2. Progress Momentum (Acceleration / Rate of velocity change)
    let momentum = 0;
    if (history.length >= 3) {
      const pPrev2 = Number(history[history.length - 3].physical_progress || pPrev);
      const velocityPrev = pPrev - pPrev2;
      momentum = Number((velocity1m - velocityPrev).toFixed(2));
    }

    // 3. Expenditure Trajectory
    const expVelocityCr = Number((eCurr - ePrev).toFixed(2));
    const expRatio = Number(((eCurr / Math.max(1, cCurr)) * 100).toFixed(2));

    // 4. Expenditure / Progress Decoupling Alignment
    let expProgressAlignment = 1.0;
    if (velocity1m > 0) {
      expProgressAlignment = Number((expVelocityCr / Math.max(0.1, velocity1m)).toFixed(2));
    } else if (expVelocityCr > 0) {
      expProgressAlignment = Number((expVelocityCr * 2.5).toFixed(2));
    }

    // 5. Cost Growth as of Cutoff T
    const costGrowthPct = Number((((cCurr - cOrig) / cOrig) * 100).toFixed(2));

    // 6. Progress Volatility
    const velocities = [];
    for (let i = 1; i < history.length; i++) {
      const v = Number(history[i].physical_progress || 0) - Number(history[i - 1].physical_progress || 0);
      velocities.push(v);
    }
    const meanVel = velocities.length > 0 ? velocities.reduce((a, b) => a + b, 0) / velocities.length : 0;
    const variance = velocities.length > 1
      ? velocities.reduce((sum, v) => sum + Math.pow(v - meanVel, 2), 0) / velocities.length
      : 0;
    const progressVolatility = Number(Math.sqrt(variance).toFixed(2));

    // 7. Consecutive Stagnant Periods (< 0.5% progress)
    let stagnantCount = 0;
    for (let i = velocities.length - 1; i >= 0; i--) {
      if (velocities[i] < 0.5) {
        stagnantCount++;
      } else {
        break;
      }
    }

    return {
      projectId: `PAI-${rawId}`,
      asOfPeriod: current.report_period,
      asOfDateKey: current.report_date_key,
      snapshotDepthHistory: history.length,
      physicalProgress: pCurr,
      progressVelocity1m: velocity1m,
      progressVelocity3m: velocity3m,
      progressMomentum: momentum,
      expenditureRatio: expRatio,
      expenditureVelocityCr: expVelocityCr,
      expProgressAlignment: expProgressAlignment,
      costGrowthPct,
      progressVolatility,
      consecutiveStagnantPeriods: stagnantCount,
      historySnapshotDates: history.map(h => h.report_period),
    };
  }
}

export const temporalFeatureService = new TemporalFeatureService();
