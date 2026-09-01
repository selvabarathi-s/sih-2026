import React from 'react';
import { RiskBreakdown, RiskLevel } from '../../types/project';
import { RiskBadge } from './RiskBadge';

interface RiskGaugeProps {
  score: number;
  level: RiskLevel;
  breakdown?: RiskBreakdown;
  size?: 'compact' | 'full';
}

export const RiskGauge: React.FC<RiskGaugeProps> = ({
  score,
  level,
  breakdown,
  size = 'full',
}) => {
  const getScoreColor = (val: number) => {
    if (val >= 75) return 'text-red-600 dark:text-red-400';
    if (val >= 50) return 'text-orange-600 dark:text-orange-400';
    if (val >= 25) return 'text-amber-600 dark:text-amber-400';
    return 'text-emerald-600 dark:text-emerald-400';
  };

  const getBarColor = (val: number) => {
    if (val >= 75) return 'bg-red-500';
    if (val >= 50) return 'bg-orange-500';
    if (val >= 25) return 'bg-amber-500';
    return 'bg-emerald-500';
  };

  if (size === 'compact') {
    return (
      <div className="flex items-center gap-3">
        <div className="flex items-baseline gap-1">
          <span className={`text-xl font-bold font-mono ${getScoreColor(score)}`}>{score}</span>
          <span className="text-xs text-slate-400 dark:text-slate-500">/100</span>
        </div>
        <RiskBadge level={level} size="sm" />
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 rounded-lg p-5 shadow-sm">
      <div className="flex items-start justify-between">
        <div>
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider font-mono">
            Composite Risk Index
          </span>
          <div className="mt-2 flex items-baseline gap-2">
            <span className={`text-4xl font-extrabold font-mono tracking-tight ${getScoreColor(score)}`}>
              {score}
            </span>
            <span className="text-sm text-slate-400 dark:text-slate-500 font-mono">/ 100</span>
            <div className="ml-2">
              <RiskBadge level={level} size="lg" />
            </div>
          </div>
        </div>

        <div className="text-right">
          <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Monitoring Mandate</span>
          <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 mt-0.5">
            {level === 'CRITICAL' ? 'Mandatory Senior Escalation' :
             level === 'HIGH' ? 'Active Fortnightly Review' :
             level === 'MODERATE' ? 'Monthly Surveillance' : 'Standard Quarterly Audit'}
          </p>
        </div>
      </div>

      {/* Main Bar Progress */}
      <div className="mt-4">
        <div className="w-full bg-slate-100 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-500 ${getBarColor(score)}`}
            style={{ width: `${score}%` }}
          />
        </div>
      </div>

      {/* 6-Dimension Breakdown */}
      {breakdown && (
        <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800/80">
          <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-3 font-mono">
            6-Dimension Risk Attribution Matrix
          </h4>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
            <div className="bg-slate-50 dark:bg-slate-950 p-2.5 rounded border border-slate-200 dark:border-slate-800/60">
              <div className="flex justify-between mb-1">
                <span className="text-slate-500 dark:text-slate-400 font-medium">Schedule Slip (20%)</span>
                <span className="font-mono font-bold text-slate-900 dark:text-white">{breakdown.schedule_risk}</span>
              </div>
              <div className="w-full bg-slate-200 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                <div className="bg-blue-500 h-full rounded-full" style={{ width: `${breakdown.schedule_risk}%` }} />
              </div>
            </div>

            <div className="bg-slate-50 dark:bg-slate-950 p-2.5 rounded border border-slate-200 dark:border-slate-800/60">
              <div className="flex justify-between mb-1">
                <span className="text-slate-500 dark:text-slate-400 font-medium">Milestones (20%)</span>
                <span className="font-mono font-bold text-slate-900 dark:text-white">{breakdown.milestone_risk}</span>
              </div>
              <div className="w-full bg-slate-200 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                <div className="bg-amber-500 h-full rounded-full" style={{ width: `${breakdown.milestone_risk}%` }} />
              </div>
            </div>

            <div className="bg-slate-50 dark:bg-slate-950 p-2.5 rounded border border-slate-200 dark:border-slate-800/60">
              <div className="flex justify-between mb-1">
                <span className="text-slate-500 dark:text-slate-400 font-medium">Cost Overrun (20%)</span>
                <span className="font-mono font-bold text-slate-900 dark:text-white">{breakdown.cost_risk}</span>
              </div>
              <div className="w-full bg-slate-200 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                <div className="bg-red-500 h-full rounded-full" style={{ width: `${breakdown.cost_risk}%` }} />
              </div>
            </div>

            <div className="bg-slate-50 dark:bg-slate-950 p-2.5 rounded border border-slate-200 dark:border-slate-800/60">
              <div className="flex justify-between mb-1">
                <span className="text-slate-500 dark:text-slate-400 font-medium">Expenditure Lag (15%)</span>
                <span className="font-mono font-bold text-slate-900 dark:text-white">{breakdown.expenditure_risk}</span>
              </div>
              <div className="w-full bg-slate-200 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                <div className="bg-purple-500 h-full rounded-full" style={{ width: `${breakdown.expenditure_risk}%` }} />
              </div>
            </div>

            <div className="bg-slate-50 dark:bg-slate-950 p-2.5 rounded border border-slate-200 dark:border-slate-800/60">
              <div className="flex justify-between mb-1">
                <span className="text-slate-500 dark:text-slate-400 font-medium">Dependencies (10%)</span>
                <span className="font-mono font-bold text-slate-900 dark:text-white">{breakdown.dependency_risk}</span>
              </div>
              <div className="w-full bg-slate-200 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                <div className="bg-cyan-500 h-full rounded-full" style={{ width: `${breakdown.dependency_risk}%` }} />
              </div>
            </div>

            <div className="bg-slate-50 dark:bg-slate-950 p-2.5 rounded border border-slate-200 dark:border-slate-800/60">
              <div className="flex justify-between mb-1">
                <span className="text-slate-500 dark:text-slate-400 font-medium">Implementation (10%)</span>
                <span className="font-mono font-bold text-slate-900 dark:text-white">{breakdown.implementation_risk}</span>
              </div>
              <div className="w-full bg-slate-200 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${breakdown.implementation_risk}%` }} />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
