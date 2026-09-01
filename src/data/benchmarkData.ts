import { PeerBenchmark } from '../types/prediction';
import { SYNTHETIC_PROJECTS } from './syntheticProjects';

export function calculateSectorBenchmarks(): PeerBenchmark[] {
  const sectors = Array.from(new Set(SYNTHETIC_PROJECTS.map(p => p.sector)));
  
  return sectors.map(sec => {
    const projs = SYNTHETIC_PROJECTS.filter(p => p.sector === sec);
    const count = projs.length;
    const totalRisk = projs.reduce((acc, p) => acc + p.risk_score, 0);
    const sortedRisk = [...projs].map(p => p.risk_score).sort((a, b) => a - b);
    const medianRisk = sortedRisk[Math.floor(count / 2)] || 50;
    const totalDelay = projs.reduce((acc, p) => acc + p.predicted_delay_months, 0);
    const totalProg = projs.reduce((acc, p) => acc + p.physical_progress, 0);
    const totalExpRate = projs.reduce((acc, p) => acc + p.financial_progress, 0);
    const totalEscalation = projs.reduce((acc, p) => acc + ((p.revised_cost - p.original_cost) / p.original_cost) * 100, 0);

    return {
      sector: sec,
      cost_band: 'Sector Portfolio Wide',
      avg_risk_score: Math.round(totalRisk / count),
      median_risk_score: medianRisk,
      avg_delay_months: Number((totalDelay / count).toFixed(1)),
      avg_cost_overrun_pct: Number((totalEscalation / count).toFixed(1)),
      avg_physical_progress: Math.round(totalProg / count),
      avg_expenditure_rate: Math.round(totalExpRate / count),
      project_count: count,
    };
  });
}

export const SECTOR_BENCHMARKS: PeerBenchmark[] = calculateSectorBenchmarks();
