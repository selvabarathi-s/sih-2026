import React from 'react';
import { Recommendation } from '../../types/project';
import { CheckSquare, ArrowRight, ShieldAlert, Zap, Building } from 'lucide-react';

interface RecommendationsProps {
  recommendations: Recommendation[];
}

export const Recommendations: React.FC<RecommendationsProps> = ({ recommendations }) => {
  if (!recommendations || recommendations.length === 0) {
    return <div className="p-4 text-xs text-slate-500">No prescriptive interventions generated.</div>;
  }

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-5 shadow-sm">
      <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4 mb-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/60">
              <Zap className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white tracking-tight">
              Prescriptive Decision Support: Targeted Interventions
            </h3>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Prioritized actions designed to arrest schedule slippage and contain cost escalation.
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {recommendations.map(rec => (
          <div
            key={rec.id}
            className="p-4 rounded-lg bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800/80 hover:border-slate-300 dark:hover:border-slate-700 transition shadow-sm"
          >
            <div className="flex items-start justify-between gap-3 mb-2">
              <div className="flex items-center gap-2">
                <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold uppercase font-mono ${
                  rec.priority === 1 ? 'bg-red-50 dark:bg-red-500/20 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-500/40' :
                  rec.priority === 2 ? 'bg-amber-50 dark:bg-amber-500/20 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-500/40' :
                  'bg-blue-50 dark:bg-blue-500/20 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-500/40'
                }`}>
                  Priority {rec.priority}
                </span>
                <h4 className="text-sm font-semibold text-slate-900 dark:text-white">{rec.title}</h4>
              </div>

              <span className="text-[11px] font-medium text-slate-600 dark:text-slate-400 px-2 py-0.5 rounded bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                {rec.category}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs mt-3">
              <div className="space-y-1 text-slate-700 dark:text-slate-300">
                <p><span className="text-slate-500 font-semibold">Identified Bottleneck:</span> {rec.problem}</p>
                <p><span className="text-slate-500 font-semibold">Downstream Impact:</span> {rec.impact}</p>
              </div>

              <div className="space-y-1 text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-900/60 p-2.5 rounded border border-slate-200 dark:border-slate-800/80">
                <p className="text-blue-700 dark:text-blue-400 font-medium">
                  <strong className="text-slate-900 dark:text-white">Prescribed Directive:</strong> {rec.action}
                </p>
                <p className="text-emerald-700 dark:text-emerald-400 font-medium">
                  <strong className="text-slate-900 dark:text-white">Expected Outcome:</strong> {rec.expected_benefit}
                </p>
              </div>
            </div>

            <div className="mt-3 pt-2.5 border-t border-slate-200/60 dark:border-slate-800/60 flex items-center justify-between text-xs text-slate-500">
              <div className="flex items-center gap-1.5 font-medium text-slate-600 dark:text-slate-400">
                <Building className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" />
                <span>Action Owner: {rec.responsible_entity}</span>
              </div>
              <span className="text-[10px] font-mono">Directive ID: {rec.id}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
