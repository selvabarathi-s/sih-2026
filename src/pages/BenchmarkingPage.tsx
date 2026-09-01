import React, { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { projectService } from '../services/projectService';
import { SECTOR_BENCHMARKS } from '../data/benchmarkData';
import { Scale, ArrowRight, BarChart2, TrendingUp, AlertCircle } from 'lucide-react';

export const BenchmarkingPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const initialProjectId = searchParams.get('projectId') || 'PJ-1042';
  const [selectedProjectId, setSelectedProjectId] = useState(initialProjectId);

  const project = projectService.getProjectById(selectedProjectId) || projectService.getHeroProject();
  const sectorBenchmark = SECTOR_BENCHMARKS.find(b => b.sector === project.sector) || SECTOR_BENCHMARKS[0];

  const riskDelta = project.risk_score - sectorBenchmark.avg_risk_score;
  const progressDelta = project.physical_progress - sectorBenchmark.avg_physical_progress;
  const delayDelta = Number((project.predicted_delay_months - sectorBenchmark.avg_delay_months).toFixed(1));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-5 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 font-mono">
                Comparative Analytics
              </span>
              <span className="text-xs text-slate-400 dark:text-slate-500">•</span>
              <span className="text-xs text-slate-500 dark:text-slate-400">Relative Sector Performance</span>
            </div>
            <h1 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Peer Group Benchmarking & Cohort Comparison
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-3xl">
              Evaluating project health relative to comparable sector peers to identify systemic anomalies vs project-specific execution drag.
            </p>
          </div>

          {/* Project Selector */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium shrink-0">Select Project:</span>
            <select
              value={selectedProjectId}
              onChange={e => setSelectedProjectId(e.target.value)}
              aria-label="Select Project to Benchmark"
              className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded px-3 py-1.5 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-blue-500 font-mono"
            >
              <option value="PJ-1042">PJ-1042: Eastern Freight Corridor</option>
              {projectService.getAllProjects().slice(1, 20).map(p => (
                <option key={p.project_id} value={p.project_id}>
                  {p.project_id}: {p.project_name.slice(0, 35)}...
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Benchmark Summary Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Risk Score Delta */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-5 shadow-sm">
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider font-mono">Composite Risk Index</span>
          <div className="mt-3 flex items-baseline justify-between">
            <div>
              <p className="text-xs text-slate-500 dark:text-slate-400">Selected Project</p>
              <p className="text-3xl font-extrabold font-mono text-red-600 dark:text-red-400">{project.risk_score}</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-slate-500 dark:text-slate-400">{project.sector} Peer Avg</p>
              <p className="text-2xl font-bold font-mono text-slate-700 dark:text-slate-300">{sectorBenchmark.avg_risk_score}</p>
            </div>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
            <span className="text-slate-500 dark:text-slate-400">Cohort Variance:</span>
            <span className={`font-mono font-bold ${riskDelta > 0 ? 'text-red-600 dark:text-red-400' : 'text-emerald-600 dark:text-emerald-400'}`}>
              {riskDelta > 0 ? `+${riskDelta} pts higher risk` : `${riskDelta} pts lower risk`}
            </span>
          </div>
        </div>

        {/* Physical Progress Delta */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-5 shadow-sm">
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider font-mono">Physical Progress Rate</span>
          <div className="mt-3 flex items-baseline justify-between">
            <div>
              <p className="text-xs text-slate-500 dark:text-slate-400">Selected Project</p>
              <p className="text-3xl font-extrabold font-mono text-slate-900 dark:text-white">{project.physical_progress}%</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-slate-500 dark:text-slate-400">{project.sector} Peer Avg</p>
              <p className="text-2xl font-bold font-mono text-slate-700 dark:text-slate-300">{sectorBenchmark.avg_physical_progress}%</p>
            </div>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
            <span className="text-slate-500 dark:text-slate-400">Progress Lag:</span>
            <span className={`font-mono font-bold ${progressDelta < 0 ? 'text-red-600 dark:text-red-400' : 'text-emerald-600 dark:text-emerald-400'}`}>
              {progressDelta < 0 ? `${progressDelta}% slower` : `+${progressDelta}% faster`}
            </span>
          </div>
        </div>

        {/* Delay Overrun Delta */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-5 shadow-sm">
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider font-mono">Predicted Delay Slippage</span>
          <div className="mt-3 flex items-baseline justify-between">
            <div>
              <p className="text-xs text-slate-500 dark:text-slate-400">Selected Project</p>
              <p className="text-3xl font-extrabold font-mono text-orange-600 dark:text-orange-400">+{project.predicted_delay_months} Mo</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-slate-500 dark:text-slate-400">{project.sector} Peer Avg</p>
              <p className="text-2xl font-bold font-mono text-slate-700 dark:text-slate-300">+{sectorBenchmark.avg_delay_months} Mo</p>
            </div>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
            <span className="text-slate-500 dark:text-slate-400">Delay Exposure:</span>
            <span className={`font-mono font-bold ${delayDelta > 0 ? 'text-orange-600 dark:text-orange-400' : 'text-emerald-600 dark:text-emerald-400'}`}>
              {delayDelta > 0 ? `+${delayDelta} mo additional slippage` : `${delayDelta} mo below average`}
            </span>
          </div>
        </div>
      </div>

      {/* Sector Baseline Reference Table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-5 shadow-sm">
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3 mb-4">
          <div>
            <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider font-mono">
              National Infrastructure Sector Benchmarks Matrix
            </h3>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">Cohort averages derived across all 241 monitored undertakings</p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 uppercase text-[10px]">
                <th className="py-2.5 px-3 font-sans font-semibold">Sector Portfolio</th>
                <th className="py-2.5 px-3">Projects</th>
                <th className="py-2.5 px-3">Avg Risk Score</th>
                <th className="py-2.5 px-3">Median Risk</th>
                <th className="py-2.5 px-3">Avg Physical Progress</th>
                <th className="py-2.5 px-3">Avg Expenditure Rate</th>
                <th className="py-2.5 px-3">Avg Delay (Months)</th>
                <th className="py-2.5 px-3 text-right">Avg Cost Overrun %</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
              {SECTOR_BENCHMARKS.map(sb => {
                const isSelectedSector = sb.sector === project.sector;
                return (
                  <tr key={sb.sector} className={`hover:bg-slate-50 dark:hover:bg-slate-800/40 ${isSelectedSector ? 'bg-blue-50/60 dark:bg-blue-950/20' : ''}`}>
                    <td className="py-3 px-3 font-sans font-semibold text-slate-900 dark:text-slate-200 flex items-center gap-1.5">
                      <span>{sb.sector}</span>
                      {isSelectedSector && (
                        <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-blue-100 dark:bg-blue-500/20 text-blue-700 dark:text-blue-400 font-mono">
                          CURRENT COHORT
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-3 text-slate-600 dark:text-slate-400">{sb.project_count}</td>
                    <td className="py-3 px-3 font-bold text-amber-600 dark:text-amber-400">{sb.avg_risk_score} / 100</td>
                    <td className="py-3 px-3 text-slate-700 dark:text-slate-300">{sb.median_risk_score}</td>
                    <td className="py-3 px-3 text-slate-900 dark:text-white font-bold">{sb.avg_physical_progress}%</td>
                    <td className="py-3 px-3 text-emerald-600 dark:text-emerald-400 font-bold">{sb.avg_expenditure_rate}%</td>
                    <td className="py-3 px-3 text-orange-600 dark:text-orange-400">+{sb.avg_delay_months} Mo</td>
                    <td className="py-3 px-3 text-right font-bold text-red-600 dark:text-red-400">+{sb.avg_cost_overrun_pct}%</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
