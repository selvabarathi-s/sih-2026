import React from 'react';
import { Milestone } from '../../types/project';
import { CheckCircle2, Clock, AlertCircle, AlertOctagon } from 'lucide-react';

interface MilestoneListProps {
  milestones: Milestone[];
}

export const MilestoneList: React.FC<MilestoneListProps> = ({ milestones }) => {
  if (!milestones || milestones.length === 0) {
    return <div className="p-4 text-xs text-slate-500">No milestone records defined for this project.</div>;
  }

  const getStatusIcon = (status: Milestone['status']) => {
    switch (status) {
      case 'COMPLETED':
        return <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />;
      case 'ON_TRACK':
        return <Clock className="w-4 h-4 text-blue-600 dark:text-blue-400" />;
      case 'DELAYED':
        return <AlertCircle className="w-4 h-4 text-amber-600 dark:text-amber-400" />;
      case 'CRITICAL_DELAY':
        return <AlertOctagon className="w-4 h-4 text-red-600 dark:text-red-400" />;
      default:
        return <Clock className="w-4 h-4 text-slate-400 dark:text-slate-500" />;
    }
  };

  const getStatusBadge = (status: Milestone['status'], delay: number) => {
    switch (status) {
      case 'COMPLETED':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold font-mono bg-emerald-50 dark:bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/30">Completed</span>;
      case 'ON_TRACK':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold font-mono bg-blue-50 dark:bg-blue-500/15 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-500/30">On Track</span>;
      case 'DELAYED':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold font-mono bg-amber-50 dark:bg-amber-500/15 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-500/30">Delayed (+{delay} mo)</span>;
      case 'CRITICAL_DELAY':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold font-mono bg-red-50 dark:bg-red-500/15 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-500/30">Critical Delay (+{delay} mo)</span>;
      default:
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold font-mono bg-slate-100 dark:bg-slate-500/15 text-slate-600 dark:text-slate-400">Pending</span>;
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-5 shadow-sm">
      <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3 mb-4">
        <div>
          <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider font-mono">Critical Path Milestones Tracker</h3>
          <p className="text-[11px] text-slate-500 dark:text-slate-400">Progress against statutory and technical milestones</p>
        </div>
        <span className="text-[11px] font-mono text-slate-600 dark:text-slate-400">
          {milestones.filter(m => m.status === 'COMPLETED').length} / {milestones.length} Completed
        </span>
      </div>

      <div className="divide-y divide-slate-100 dark:divide-slate-800/80">
        {milestones.map((ms, idx) => (
          <div key={ms.id} className="py-3 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-1 rounded bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                {getStatusIcon(ms.status)}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-slate-400 dark:text-slate-500 text-xs font-bold">M{idx + 1}</span>
                  <h4 className="text-xs font-semibold text-slate-900 dark:text-white">{ms.name}</h4>
                </div>
                <div className="flex items-center gap-3 text-[11px] text-slate-500 dark:text-slate-400 font-mono mt-0.5">
                  <span>Target: {ms.target_date}</span>
                  {ms.actual_date && <span className="text-emerald-600 dark:text-emerald-400">Done: {ms.actual_date}</span>}
                  {ms.weightage_percent && <span>Weight: {ms.weightage_percent}%</span>}
                </div>
              </div>
            </div>

            <div className="shrink-0 flex items-center gap-3">
              {getStatusBadge(ms.status, ms.delay_months)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
