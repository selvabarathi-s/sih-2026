import React from 'react';
import { useNavigate } from 'react-router-dom';
import { riskIntelligenceService } from '../services/riskIntelligenceService';
import { projectService } from '../services/projectService';
import {
  ShieldAlert,
  AlertTriangle,
  TrendingUp,
  LandPlot,
  FileClock,
  Zap,
  IndianRupee,
  Layers,
  ArrowRight,
  ChevronRight,
  Clock,
  Sparkles,
  BarChart3,
} from 'lucide-react';

export const RiskIntelligencePage: React.FC = () => {
  const navigate = useNavigate();
  const summary = riskIntelligenceService.getRiskIntelligenceSummary();

  return (
    <div className="space-y-6">
      {/* Executive Header */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-6 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-800 font-mono">
                Portfolio Risk Intelligence
              </span>
              <span className="text-xs text-slate-400 dark:text-slate-500">•</span>
              <span className="text-xs text-slate-500 dark:text-slate-400">Systemic Root-Cause Diagnostics</span>
            </div>
            <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Portfolio Risk Intelligence & Systemic Concentrations
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-3xl">
              Answering <strong>“Why is the portfolio becoming risky?”</strong> by isolating systemic cross-project root causes, recurring Right-of-Way frictions, and multi-cycle deterioration trends.
            </p>
          </div>

          <button
            onClick={() => navigate('/projects/PJ-1042')}
            className="px-3.5 py-2 text-xs font-semibold bg-red-600 hover:bg-red-500 text-white rounded flex items-center gap-1.5 shrink-0 transition shadow-sm"
          >
            <span>Inspect Critical Hero Project (PJ-1042)</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Top Row: Portfolio Risk Index Hero & Risk Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* A. Portfolio Risk Index Hero Block (5 cols) */}
        <div className="lg:col-span-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-6 flex flex-col justify-between shadow-sm">
          <div>
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3 mb-4">
              <span className="text-xs font-bold text-slate-800 dark:text-slate-300 uppercase tracking-wider font-mono">
                A. Portfolio Risk Index
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-50 dark:bg-amber-950 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800">
                Current Cycle
              </span>
            </div>

            <div className="flex items-baseline gap-3 my-2">
              <span className="text-5xl font-extrabold font-mono text-amber-600 dark:text-amber-400 tracking-tight">
                {summary.currentRiskIndex}
              </span>
              <span className="text-base text-slate-400 dark:text-slate-500 font-mono">/ 100</span>
              <div className="flex items-center gap-1 text-xs font-bold text-red-700 dark:text-red-400 bg-red-50 dark:bg-red-950/40 px-2.5 py-1 rounded border border-red-200 dark:border-red-800/40 ml-2">
                <TrendingUp className="w-3.5 h-3.5" />
                <span>+{summary.riskIndexDelta} pts vs Last Cycle</span>
              </div>
            </div>

            <p className="text-xs text-slate-700 dark:text-slate-300 mt-2">
              <strong>Risk Concentration Warning:</strong> Portfolio risk deteriorated by +4.0 points over the preceding 30 days, driven primarily by linear Right-of-Way handover lags in Transport & Energy.
            </p>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800/80 grid grid-cols-2 gap-3 text-xs">
            <div className="bg-slate-50 dark:bg-slate-950/80 p-2.5 rounded border border-slate-200 dark:border-slate-800">
              <span className="text-slate-500 block text-[10px] uppercase font-mono">High/Critical Exposure</span>
              <span className="text-base font-bold text-red-600 dark:text-red-400 font-mono">{summary.criticalCount + summary.highCount} Projects</span>
            </div>
            <div className="bg-slate-50 dark:bg-slate-950/80 p-2.5 rounded border border-slate-200 dark:border-slate-800">
              <span className="text-slate-500 block text-[10px] uppercase font-mono">Stable / On Track</span>
              <span className="text-base font-bold text-emerald-600 dark:text-emerald-400 font-mono">{summary.lowCount} Projects</span>
            </div>
          </div>
        </div>

        {/* B. Risk Distribution Breakdown (7 cols) */}
        <div className="lg:col-span-7 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-6 flex flex-col justify-between shadow-sm">
          <div>
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3 mb-4">
              <span className="text-xs font-bold text-slate-800 dark:text-slate-300 uppercase tracking-wider font-mono">
                B. Portfolio Risk Distribution ({summary.totalProjects} Projects)
              </span>
              <span className="text-[11px] text-slate-500 font-mono">Normalized 0–100 Scale</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/40 p-3.5 rounded-lg text-center">
                <span className="text-[10px] font-bold uppercase text-red-700 dark:text-red-400 font-mono">Critical (75–100)</span>
                <p className="text-2xl font-bold font-mono text-red-600 dark:text-red-400 mt-1">{summary.criticalCount}</p>
                <span className="text-[10px] text-slate-500 dark:text-slate-400">({Math.round((summary.criticalCount / summary.totalProjects) * 100)}% of total)</span>
              </div>

              <div className="bg-orange-50 dark:bg-orange-950/20 border border-orange-200 dark:border-orange-900/40 p-3.5 rounded-lg text-center">
                <span className="text-[10px] font-bold uppercase text-orange-700 dark:text-orange-400 font-mono">High (50–74)</span>
                <p className="text-2xl font-bold font-mono text-orange-600 dark:text-orange-400 mt-1">{summary.highCount}</p>
                <span className="text-[10px] text-slate-500 dark:text-slate-400">({Math.round((summary.highCount / summary.totalProjects) * 100)}% of total)</span>
              </div>

              <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/40 p-3.5 rounded-lg text-center">
                <span className="text-[10px] font-bold uppercase text-amber-700 dark:text-amber-400 font-mono">Moderate (25–49)</span>
                <p className="text-2xl font-bold font-mono text-amber-600 dark:text-amber-400 mt-1">{summary.moderateCount}</p>
                <span className="text-[10px] text-slate-500 dark:text-slate-400">({Math.round((summary.moderateCount / summary.totalProjects) * 100)}% of total)</span>
              </div>

              <div className="bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900/40 p-3.5 rounded-lg text-center">
                <span className="text-[10px] font-bold uppercase text-emerald-700 dark:text-emerald-400 font-mono">Low (0–24)</span>
                <p className="text-2xl font-bold font-mono text-emerald-600 dark:text-emerald-400 mt-1">{summary.lowCount}</p>
                <span className="text-[10px] text-slate-500 dark:text-slate-400">({Math.round((summary.lowCount / summary.totalProjects) * 100)}% of total)</span>
              </div>
            </div>
          </div>

          <div className="mt-4 p-3 bg-slate-50 dark:bg-slate-950/80 rounded border border-slate-200 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-400 flex items-center justify-between">
            <span>
              <strong>Surveillance Directive:</strong> Priority escalation recommended for {summary.criticalCount} projects in the Critical Red Zone.
            </span>
            <button
              onClick={() => navigate('/projects?riskLevel=CRITICAL')}
              className="text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300 font-semibold flex items-center gap-1 shrink-0 ml-2"
            >
              <span>Filter Critical</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* C. Risk Driver Concentration (Aggregated Portfolio Bottlenecks) */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-6 space-y-4 shadow-sm">
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
          <div>
            <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider font-mono">
              C. Systemic Risk Driver Concentrations & Frequency Matrix
            </h3>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Aggregated project-level root causes identifying systemic friction points across the national portfolio
            </p>
          </div>
          <span className="text-[10px] font-mono bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-800 px-2 py-0.5 rounded">
            Portfolio Frequency Audit
          </span>
        </div>

        <div className="space-y-3">
          {summary.driversConcentration.map(driver => (
            <div
              key={driver.id}
              className="p-4 rounded-lg bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 transition shadow-sm"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                <div className="flex items-center gap-2.5">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold font-mono uppercase ${
                    driver.systemicSeverity === 'CRITICAL'
                      ? 'bg-red-50 dark:bg-red-500/20 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-500/40'
                      : driver.systemicSeverity === 'HIGH'
                      ? 'bg-orange-50 dark:bg-orange-500/20 text-orange-700 dark:text-orange-400 border border-orange-200 dark:border-orange-500/40'
                      : 'bg-amber-50 dark:bg-amber-500/20 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-500/40'
                  }`}>
                    {driver.systemicSeverity} Severity
                  </span>
                  <h4 className="text-sm font-semibold text-slate-900 dark:text-white">{driver.name}</h4>
                  <span className="text-xs text-slate-500">({driver.category})</span>
                </div>

                <div className="flex items-center gap-4 text-xs font-mono">
                  <span className="text-slate-700 dark:text-slate-300">
                    Affected: <strong className="text-slate-900 dark:text-white font-bold">{driver.affectedProjectsCount} Projects</strong>
                  </span>
                  <span className="text-red-600 dark:text-red-400 font-bold">
                    {driver.pctOfHighCriticalAffected}% of Critical Projects
                  </span>
                </div>
              </div>

              <p className="text-xs text-slate-700 dark:text-slate-300 mb-2">
                {driver.description}
              </p>

              <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-200/60 dark:border-slate-800/60 text-[11px] text-slate-500 dark:text-slate-400">
                <div className="flex items-center gap-1.5">
                  <span className="text-slate-500 font-medium">Top Impacted Sectors:</span>
                  {driver.topAffectedSectors.map(s => (
                    <span key={s} className="px-2 py-0.2 rounded bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 font-medium">
                      {s}
                    </span>
                  ))}
                </div>
                <span className="font-mono text-slate-600 dark:text-slate-400">
                  Avg Contribution: <strong className="text-red-600 dark:text-red-400">+{driver.avgImpactPoints} Risk Points</strong>
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* D. Sector Risk Matrix & E. Emerging Telemetry Trends */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* D. Sector Risk Matrix */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-6 shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3 mb-4">
            <div>
              <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider font-mono">
                D. Sector Risk Comparison Matrix
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">Ranking sectors by critical project density & financial exposure</p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 uppercase text-[10px]">
                  <th className="py-2.5 px-3 font-sans font-semibold">Sector</th>
                  <th className="py-2.5 px-3">Avg Risk</th>
                  <th className="py-2.5 px-3">Critical Projects</th>
                  <th className="py-2.5 px-3 text-right">Predicted Exposure</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                {summary.sectorMatrix.map(sec => (
                  <tr key={sec.sector} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                    <td className="py-2.5 px-3 font-sans font-semibold text-slate-900 dark:text-slate-200">{sec.sector}</td>
                    <td className="py-2.5 px-3 font-bold text-amber-600 dark:text-amber-400">{sec.avgRisk} / 100</td>
                    <td className="py-2.5 px-3">
                      <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                        sec.criticalCount > 3 ? 'bg-red-50 dark:bg-red-500/20 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-500/30' : 'text-slate-600 dark:text-slate-400'
                      }`}>
                        {sec.criticalCount} of {sec.count}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-right font-bold text-red-600 dark:text-red-400">
                      ₹{Math.round(sec.totalCostExposure / 1000).toLocaleString()}k Cr
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* E. Emerging Risk Trends */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-6 space-y-4 shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
            <div>
              <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider font-mono">
                E. Emerging Deterioration Trends (Telemetry Signals)
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">Automated multi-cycle anomaly detection across monthly observations</p>
            </div>
            <span className="text-[10px] font-mono bg-purple-50 dark:bg-purple-950 text-purple-700 dark:text-purple-400 border border-purple-200 dark:border-purple-800 px-2 py-0.5 rounded">
              Trend Signals
            </span>
          </div>

          <div className="space-y-3">
            {summary.emergingTrends.map(trend => (
              <div key={trend.id} className="p-3.5 rounded bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 text-xs space-y-1.5 shadow-sm">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-red-500 dark:bg-red-400 animate-pulse" />
                    <h4 className="font-semibold text-slate-900 dark:text-white">{trend.title}</h4>
                  </div>
                  <span className="text-[10px] font-mono text-purple-700 dark:text-purple-400 font-bold">{trend.affectedCount} Projects</span>
                </div>
                <p className="text-slate-700 dark:text-slate-300 text-[11px]">{trend.signalDescription}</p>
                <div className="flex items-center justify-between pt-1 text-[10px] text-slate-500 dark:text-slate-400 font-mono">
                  <span>Cycle: {trend.detectionCycle}</span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-bold">{trend.leadTimeImpact}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
