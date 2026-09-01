import React from 'react';
import { projectService } from '../services/projectService';
import { BarChart3, MapPin, IndianRupee, Clock, Layers } from 'lucide-react';

export const AnalyticsPage: React.FC = () => {
  const allProjects = projectService.getAllProjects();

  // Aggregate by state
  const stateAgg: Record<string, { count: number; totalCost: number; criticalCount: number; avgDelay: number }> = {};
  allProjects.forEach(p => {
    const s = p.state.split(' / ')[0] || p.state;
    if (!stateAgg[s]) {
      stateAgg[s] = { count: 0, totalCost: 0, criticalCount: 0, avgDelay: 0 };
    }
    stateAgg[s].count++;
    stateAgg[s].totalCost += p.revised_cost;
    if (p.risk_level === 'CRITICAL') stateAgg[s].criticalCount++;
    stateAgg[s].avgDelay += p.predicted_delay_months;
  });

  const stateList = Object.entries(stateAgg)
    .map(([state, data]) => ({
      state,
      count: data.count,
      totalCost: data.totalCost,
      criticalCount: data.criticalCount,
      avgDelay: Number((data.avgDelay / data.count).toFixed(1)),
    }))
    .sort((a, b) => b.criticalCount - a.criticalCount);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-5 shadow-sm">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-800 font-mono">
            Portfolio Analytics
          </span>
          <span className="text-xs text-slate-400 dark:text-slate-500">•</span>
          <span className="text-xs text-slate-500 dark:text-slate-400">State & Geographic Spatial Risk</span>
        </div>
        <h1 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Geographic Risk Distribution & State Infrastructure Density
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-3xl">
          Multi-dimensional spatial aggregation identifying regional execution friction, Right-of-Way clearance bottlenecks, and capital deployment across Indian states.
        </p>
      </div>

      {/* State Risk Matrix */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-5 shadow-sm">
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3 mb-4">
          <div>
            <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider font-mono">
              State-Wise Infrastructure Portfolio Risk Breakdown
            </h3>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">Ranked by volume of projects in Critical Risk zone</p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 uppercase text-[10px] font-semibold font-mono">
                <th className="py-2.5 px-3">State / Region</th>
                <th className="py-2.5 px-3 font-mono">Monitored Undertakings</th>
                <th className="py-2.5 px-3 font-mono">Total Capital Outlay (₹ Cr)</th>
                <th className="py-2.5 px-3 font-mono">Critical Projects</th>
                <th className="py-2.5 px-3 font-mono">Average Delay Exposure</th>
                <th className="py-2.5 px-3 text-right">Risk Density</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-mono">
              {stateList.map(st => (
                <tr key={st.state} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                  <td className="py-3 px-3 font-sans font-semibold text-slate-900 dark:text-slate-200 flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" />
                    <span>{st.state}</span>
                  </td>
                  <td className="py-3 px-3 text-slate-600 dark:text-slate-300">{st.count} Projects</td>
                  <td className="py-3 px-3 font-bold text-slate-900 dark:text-white">₹{st.totalCost.toLocaleString()} Cr</td>
                  <td className="py-3 px-3">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      st.criticalCount > 3 ? 'bg-red-50 dark:bg-red-500/20 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-500/40' :
                      st.criticalCount > 0 ? 'bg-orange-50 dark:bg-orange-500/20 text-orange-700 dark:text-orange-400 border border-orange-200 dark:border-orange-500/40' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                    }`}>
                      {st.criticalCount} Critical
                    </span>
                  </td>
                  <td className="py-3 px-3 text-orange-600 dark:text-orange-400 font-bold">+{st.avgDelay} Months</td>
                  <td className="py-3 px-3 text-right font-sans">
                    <span className={`text-[11px] font-semibold ${
                      st.criticalCount > 3 ? 'text-red-600 dark:text-red-400 font-bold' : st.criticalCount > 0 ? 'text-amber-600 dark:text-amber-400 font-bold' : 'text-emerald-600 dark:text-emerald-400 font-bold'
                    }`}>
                      {Math.round((st.criticalCount / st.count) * 100)}% At Risk
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
