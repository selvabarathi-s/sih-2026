import React from 'react';
import { Project } from '../../types/project';
import { Clock, CalendarCheck, AlertTriangle } from 'lucide-react';

interface ScheduleCardProps {
  project: Project;
}

export const ScheduleCard: React.FC<ScheduleCardProps> = ({ project }) => {
  const progressGap = project.planned_progress - project.physical_progress;

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-5 shadow-sm">
      <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3 mb-4">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800/60">
            <Clock className="w-4 h-4" />
          </div>
          <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider font-mono">Schedule & Execution Trajectory</h3>
        </div>
        <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400">
          Planned: <strong className="text-blue-600 dark:text-blue-400">{project.planned_progress}%</strong> | Actual: <strong className="text-slate-900 dark:text-white">{project.physical_progress}%</strong>
        </span>
      </div>

      {/* Progress Bars Comparison */}
      <div className="space-y-3 mb-4">
        <div>
          <div className="flex justify-between text-xs mb-1">
            <span className="text-slate-600 dark:text-slate-400">Planned Execution Benchmark</span>
            <span className="font-mono text-blue-600 dark:text-blue-400 font-semibold">{project.planned_progress}%</span>
          </div>
          <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
            <div className="bg-blue-600 dark:bg-blue-500 h-full rounded-full" style={{ width: `${project.planned_progress}%` }} />
          </div>
        </div>

        <div>
          <div className="flex justify-between text-xs mb-1">
            <span className="text-slate-600 dark:text-slate-400">Actual Physical Achievement</span>
            <span className="font-mono text-slate-900 dark:text-white font-semibold">{project.physical_progress}%</span>
          </div>
          <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full ${progressGap > 10 ? 'bg-red-500' : progressGap > 5 ? 'bg-amber-500' : 'bg-emerald-500'}`}
              style={{ width: `${project.physical_progress}%` }}
            />
          </div>
        </div>
      </div>

      {/* Schedule Summary Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        <div className="bg-slate-50 dark:bg-slate-950/60 p-3 rounded border border-slate-200 dark:border-slate-800/80">
          <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">Original Target Date</span>
          <p className="text-xs font-bold font-mono text-slate-900 dark:text-white mt-1">{project.original_completion_date}</p>
        </div>

        <div className="bg-slate-50 dark:bg-slate-950/60 p-3 rounded border border-slate-200 dark:border-slate-800/80">
          <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">Revised COD Target</span>
          <p className="text-xs font-bold font-mono text-slate-900 dark:text-white mt-1">{project.revised_completion_date}</p>
        </div>

        <div className="bg-slate-50 dark:bg-slate-950/60 p-3 rounded border border-slate-200 dark:border-slate-800/80">
          <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">Delayed Milestones</span>
          <p className="text-xs font-bold font-mono text-red-600 dark:text-red-400 mt-1">
            {project.milestones_delayed} of {project.milestones_total} Key Milestones
          </p>
        </div>
      </div>

      {/* Predicted Schedule Slippage Callout */}
      <div className="mt-4 p-3.5 bg-orange-50 dark:bg-orange-950/20 border border-orange-200 dark:border-orange-900/40 rounded-lg flex items-center justify-between">
        <div className="flex items-center gap-3">
          <AlertTriangle className="w-5 h-5 text-orange-600 dark:text-orange-400 shrink-0" />
          <div>
            <span className="text-xs font-bold text-orange-700 dark:text-orange-300 font-mono">Predicted Schedule Slippage</span>
            <p className="text-[11px] text-slate-600 dark:text-slate-400">
              Estimated critical path delay beyond currently approved COD
            </p>
          </div>
        </div>
        <div className="text-right font-mono">
          <span className="text-base font-extrabold text-orange-600 dark:text-orange-400">+{project.predicted_delay_months} Months</span>
          <span className="text-[10px] text-slate-500 dark:text-slate-400 block font-sans">Probability: {project.time_overrun_probability}%</span>
        </div>
      </div>
    </div>
  );
};
