/**
 * PAIMANA PREDICT — RESILIENCE & FRAGILITY INTELLIGENCE (Part 7)
 * 
 * Platform-derived diagnostic indicators:
 *   - PROJECT RESILIENCE SCORE (0-100): Pacing rebound capacity after execution bottlenecks.
 *   - PROJECT FRAGILITY SCORE (0-100): Susceptibility to cascading milestone and expenditure shocks.
 * 
 * Scientific Guardrail: Explicitly marked as platform-derived diagnostic indicators, not statutory MoSPI metrics.
 */

import { snapshotRepository } from '../repositories/snapshotRepository.js';

export function calculateResilienceAndFragility(project, snapshots = []) {
  const extMonths = Number(project.schedule_extension_months || 0);
  const costGrowthPct = Number(project.cost_growth_pct || 0);
  const physicalProgress = Number(project.physical_progress || 0);
  const expRatio = Number(project.expenditure_ratio_pct || 0);

  // 1. Resilience Calculation
  // Looks at whether progress accelerated after previous stagnant periods
  let reboundPoints = 45; // Default moderate baseline
  if (Array.isArray(snapshots) && snapshots.length >= 4) {
    const sorted = [...snapshots].sort((a, b) => (a.report_date_key || '').localeCompare(b.report_date_key || ''));
    let recoveries = 0;
    for (let i = 2; i < sorted.length; i++) {
      const vPrev = Number(sorted[i - 1].physical_progress || 0) - Number(sorted[i - 2].physical_progress || 0);
      const vCurr = Number(sorted[i].physical_progress || 0) - Number(sorted[i - 1].physical_progress || 0);
      if (vPrev < 0.5 && vCurr >= 1.5) {
        recoveries++; // Demonstrated recovery after stagnation
      }
    }
    reboundPoints = Math.min(95, 50 + (recoveries * 18));
  } else if (physicalProgress > 75 && extMonths <= 12) {
    reboundPoints = 85;
  } else if (extMonths > 36) {
    reboundPoints = 30; // Chronic non-recovery
  }

  const resilienceScore = Math.max(10, Math.min(95, reboundPoints));
  let resilienceTier = 'MODERATE';
  if (resilienceScore >= 75) resilienceTier = 'HIGH_RESILIENCE';
  else if (resilienceScore <= 40) resilienceTier = 'LOW_RESILIENCE';

  // 2. Fragility Calculation
  // High fragility: Capital expenditure disconnected from physical work + compounding extensions
  let fragilityRaw = 20;
  const disconnect = Math.abs(expRatio - physicalProgress);
  fragilityRaw += Math.min(35, disconnect * 0.7);

  if (costGrowthPct > 50) fragilityRaw += 25;
  else if (costGrowthPct > 20) fragilityRaw += 15;

  if (extMonths > 36) fragilityRaw += 20;
  else if (extMonths > 12) fragilityRaw += 10;

  const fragilityScore = Math.max(15, Math.min(95, Math.round(fragilityRaw)));
  let fragilityTier = 'MODERATE';
  if (fragilityScore >= 75) fragilityTier = 'CRITICAL_FRAGILITY';
  else if (fragilityScore >= 55) fragilityTier = 'HIGH_FRAGILITY';
  else if (fragilityScore <= 35) fragilityTier = 'RESILIENT';

  return {
    resilienceScore,
    resilience_score: resilienceScore,
    resilienceTier,
    resilience_band: resilienceTier,
    resilienceLabel: resilienceTier.replace('_', ' '),
    fragilityScore,
    fragility_score: fragilityScore,
    fragilityTier,
    fragility_band: fragilityTier,
    fragilityLabel: fragilityTier.replace('_', ' '),
    provenance: 'DERIVED_VARIABLE',
    provenanceMeta: {
      type: 'DERIVED_VARIABLE',
      disclaimer: 'Resilience and Fragility scores are analytical diagnostic models derived by PAIMANA Predict and are not official MoSPI statutory ratings.',
    },
  };
}
