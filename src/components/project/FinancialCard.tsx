import React from 'react';
import { Project } from '../../types/project';
import { IndianRupee, TrendingUp, AlertOctagon } from 'lucide-react';

interface FinancialCardProps {
  project: Project;
}

export const FinancialCard: React.FC<FinancialCardProps> = ({ project }) => {
  const isEscalated = project.revised_cost > project.original_cost;
  const escalationCr = Math.max(0, project.revised_cost - project.original_cost);
  const escalationPct = project.original_cost > 0 ? Math.round((escalationCr / project.original_cost) * 100) : 0;

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-5 shadow-sm">
      <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3 mb-4">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800/60">
            <IndianRupee className="w-4 h-4" />
          </div>
          <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider font-mono">Financial Intelligence</h3>
        </div>
        <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400">
          Expenditure Rate: <strong className="text-slate-900 dark:text-white">{project.financial_progress}%</strong>
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        <div className="bg-slate-50 dark:bg-slate-950/60 p-3 rounded border border-slate-200 dark:border-slate-800/80">
          <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">Original Sanctioned Cost</span>
          <p className="text-base font-bold font-mono text-slate-900 dark:text-white mt-1">₹{project.original_cost.toLocaleString()} Cr</p>
        </div>

        <div className="bg-slate-50 dark:bg-slate-950/60 p-3 rounded border border-slate-200 dark:border-slate-800/80">
          <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">Revised Cost Baseline</span>
          <p className="text-base font-bold font-mono text-slate-900 dark:text-white mt-1">
            ₹{project.revised_cost.toLocaleString()} Cr
            {isEscalated && (
              <span className="text-xs text-red-600 dark:text-red-400 font-normal ml-1">(+{escalationPct}%)</span>
            )}
          </p>
        </div>

        <div className="bg-slate-50 dark:bg-slate-950/60 p-3 rounded border border-slate-200 dark:border-slate-800/80">
          <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">Cumulative Expenditure</span>
          <p className="text-base font-bold font-mono text-emerald-600 dark:text-emerald-400 mt-1">
            ₹{project.cumulative_expenditure.toLocaleString()} Cr
          </p>
        </div>
      </div>

      {/* Predicted Cost Overrun Bar */}
      <div className="mt-4 p-3.5 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/40 rounded-lg flex items-center justify-between">
        <div className="flex items-center gap-3">
          <AlertOctagon className="w-5 h-5 text-red-600 dark:text-red-400 shrink-0" />
          <div>
            <span className="text-xs font-bold text-red-700 dark:text-red-300 font-mono">Predicted Cost Overrun Exposure</span>
            <p className="text-[11px] text-slate-600 dark:text-slate-400">
              Machine learning estimate based on schedule slippage & price indexation
            </p>
          </div>
        </div>
        <div className="text-right font-mono">
          <span className="text-base font-extrabold text-red-600 dark:text-red-400">+₹{project.predicted_cost_overrun.toLocaleString()} Cr</span>
          <span className="text-[10px] text-slate-500 dark:text-slate-400 block font-sans">Probability: {project.cost_overrun_probability}%</span>
        </div>
      </div>
    </div>
  );
};
