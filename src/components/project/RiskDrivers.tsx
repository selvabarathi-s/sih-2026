import React from 'react';
import { Project } from '../../types/project';
import { DriverBar } from '../common/DriverBar';
import { HelpCircle, Sparkles, AlertCircle } from 'lucide-react';

interface RiskDriversProps {
  project: Project;
}

export const RiskDrivers: React.FC<RiskDriversProps> = ({ project }) => {
  const drivers = project.risk_drivers || [];
  const totalImpact = drivers.reduce((acc, d) => acc + d.impact_points, 0);

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-5 shadow-sm">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 dark:border-slate-800 pb-4 mb-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded bg-red-50 dark:bg-red-950 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800/60">
              <Sparkles className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white tracking-tight">
              Root-Cause Explainability: Why is this project at risk?
            </h3>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Quantified contribution breakdown identifying the structural bottlenecks driving the composite risk score.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0 bg-slate-50 dark:bg-slate-950 px-3 py-1.5 rounded border border-slate-200 dark:border-slate-800">
          <AlertCircle className="w-4 h-4 text-red-600 dark:text-red-400" />
          <span className="text-xs text-slate-700 dark:text-slate-300 font-mono">
            Cumulative Driver Impact: <strong className="text-red-600 dark:text-red-400 font-bold">+{totalImpact} Points</strong>
          </span>
        </div>
      </div>

      {/* Driver Cards List */}
      <div className="space-y-3">
        {drivers.map(driver => (
          <DriverBar key={driver.id} driver={driver} />
        ))}
      </div>

      {/* Grounding & Explainability Disclaimer */}
      <div className="mt-4 p-3 bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800/80 rounded flex items-start gap-2.5 text-xs text-slate-500 dark:text-slate-400">
        <HelpCircle className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
        <p>
          <strong className="text-slate-700 dark:text-slate-300 font-medium">Explainability Guarantee:</strong> Risk drivers are derived from deterministic multi-variable evaluation across Right-of-Way handover %, sequential milestone slippage counts, and expenditure rates.
        </p>
      </div>
    </div>
  );
};
