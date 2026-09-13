import React from 'react';
import { CheckCircle2, Clock, AlertTriangle, ShieldAlert, Flag, Calendar, ArrowRight } from 'lucide-react';

export interface MilestoneItem {
  id: string;
  name: string;
  phase: string;
  plannedDate: string;
  revisedDate: string;
  actualDate?: string;
  status: 'COMPLETED' | 'IN_PROGRESS' | 'DELAYED' | 'UPCOMING';
  delayMonths?: number;
  alertSignal?: string;
  interventionEvent?: string;
}

interface ProjectTimelineProps {
  projectId: string;
  approvalDate?: string | null;
  startDate?: string | null;
  targetCompletionDate?: string | null;
  revisedCompletionDate?: string | null;
  extensionMonths?: number;
  milestones?: MilestoneItem[];
}

export const ProjectTimeline: React.FC<ProjectTimelineProps> = ({
  projectId,
  approvalDate = '03/2020',
  startDate = '08/2020',
  targetCompletionDate = '12/2024',
  revisedCompletionDate = '12/2026',
  extensionMonths = 24,
  milestones,
}) => {
  // Default realistic timeline for mega project
  const defaultMilestones: MilestoneItem[] = [
    {
      id: 'm1',
      name: 'Administrative & Financial Sanction',
      phase: 'Approval',
      plannedDate: approvalDate || '03/2020',
      revisedDate: approvalDate || '03/2020',
      status: 'COMPLETED',
    },
    {
      id: 'm2',
      name: 'Engineering Procurement & EPC Award',
      phase: 'Procurement',
      plannedDate: '07/2020',
      revisedDate: '09/2020',
      status: 'COMPLETED',
      delayMonths: 2,
    },
    {
      id: 'm3',
      name: 'Right-of-Way Land Handover & Site Access',
      phase: 'Pre-Construction',
      plannedDate: '01/2021',
      revisedDate: '08/2022',
      status: 'COMPLETED',
      delayMonths: 19,
      alertSignal: 'Critical ROW deficit triggered high-severity warning',
    },
    {
      id: 'm4',
      name: 'Substructure & Foundation Execution',
      phase: 'Civil Construction',
      plannedDate: '12/2022',
      revisedDate: '06/2024',
      status: 'COMPLETED',
      delayMonths: 18,
    },
    {
      id: 'm5',
      name: 'Superstructure & Technical System Integration',
      phase: 'Core Infrastructure',
      plannedDate: '06/2024',
      revisedDate: '03/2026',
      status: 'IN_PROGRESS',
      delayMonths: 21,
      alertSignal: 'Sub-threshold progress velocity stagnation observed',
      interventionEvent: 'Inter-ministerial taskforce deployed for fiber splicing handover',
    },
    {
      id: 'm6',
      name: 'Integrated Safety Testing & Commissioning Trial',
      phase: 'Quality & Testing',
      plannedDate: '10/2024',
      revisedDate: '09/2026',
      status: 'UPCOMING',
    },
    {
      id: 'm7',
      name: 'Commercial Operation Date (COD)',
      phase: 'Terminal COD',
      plannedDate: targetCompletionDate || '12/2024',
      revisedDate: revisedCompletionDate || '12/2026',
      status: 'DELAYED',
      delayMonths: extensionMonths,
    },
  ];

  const items = milestones || defaultMilestones;

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-6 shadow-sm space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 dark:border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <h3 className="text-base font-extrabold text-slate-900 dark:text-white uppercase tracking-wider font-mono">
              Project Milestone Timeline & Risk Overlay
            </h3>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-mono">
            Chronological progress across project lifecycle overlaid with observed slippages, early warnings, and administrative interventions.
          </p>
        </div>

        <div className="flex items-center gap-2 font-mono text-xs shrink-0">
          <span className="px-2.5 py-1 bg-rose-50 dark:bg-rose-950/50 text-rose-700 dark:text-rose-400 rounded border border-rose-200 dark:border-rose-800 font-bold">
            Cumulative Delay: +{extensionMonths} Months
          </span>
        </div>
      </div>

      {/* Vertical Timeline Nodes */}
      <div className="relative pl-6 sm:pl-8 space-y-8 before:absolute before:left-3 sm:before:left-4 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200 dark:before:bg-slate-800">
        {items.map((m, idx) => {
          const isCompleted = m.status === 'COMPLETED';
          const isInProgress = m.status === 'IN_PROGRESS';
          const isDelayed = m.status === 'DELAYED' || (m.delayMonths && m.delayMonths > 0);

          return (
            <div key={m.id || idx} className="relative group">
              {/* Circle Marker */}
              <div
                className={`absolute -left-6 sm:-left-8 top-1 w-6 h-6 rounded-full border-2 flex items-center justify-center transition shadow-sm ${
                  isCompleted
                    ? 'bg-emerald-500 border-emerald-500 text-white'
                    : isInProgress
                    ? 'bg-blue-600 border-blue-600 text-white animate-pulse'
                    : isDelayed
                    ? 'bg-rose-500 border-rose-500 text-white'
                    : 'bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-700 text-slate-400'
                }`}
              >
                {isCompleted ? (
                  <CheckCircle2 className="w-3.5 h-3.5" />
                ) : isDelayed ? (
                  <AlertTriangle className="w-3.5 h-3.5" />
                ) : (
                  <span className="text-[10px] font-bold font-mono">{idx + 1}</span>
                )}
              </div>

              {/* Node Card */}
              <div className="bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 rounded-lg p-4 space-y-2 hover:border-blue-400 transition">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold font-mono uppercase px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                      {m.phase}
                    </span>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                      {m.name}
                    </h4>
                  </div>

                  <span
                    className={`text-[10px] font-bold font-mono px-2 py-0.5 rounded border uppercase ${
                      isCompleted
                        ? 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 border-emerald-300'
                        : isInProgress
                        ? 'bg-blue-50 dark:bg-blue-950/50 text-blue-700 border-blue-300'
                        : isDelayed
                        ? 'bg-rose-50 dark:bg-rose-950/50 text-rose-700 border-rose-300'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 border-slate-300'
                    }`}
                  >
                    {m.status.replace('_', ' ')}
                  </span>
                </div>

                {/* Dates row */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs font-mono text-slate-600 dark:text-slate-400 pt-1">
                  <div>
                    <span className="text-[10px] uppercase text-slate-400 block">Baseline Planned:</span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200">{m.plannedDate}</span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase text-slate-400 block">Revised / Actual:</span>
                    <span className={`font-semibold ${m.plannedDate !== m.revisedDate ? 'text-amber-600 dark:text-amber-400' : 'text-slate-800 dark:text-slate-200'}`}>
                      {m.revisedDate}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase text-slate-400 block">Observed Variance:</span>
                    <span className={`font-semibold ${m.delayMonths ? 'text-rose-600 dark:text-rose-400' : 'text-emerald-600'}`}>
                      {m.delayMonths ? `+${m.delayMonths} Months Delay` : 'On Schedule'}
                    </span>
                  </div>
                </div>

                {/* Warning / Intervention Overlay Tags */}
                {(m.alertSignal || m.interventionEvent) && (
                  <div className="pt-2 border-t border-slate-200/60 dark:border-slate-800/60 space-y-1.5 font-mono text-xs">
                    {m.alertSignal && (
                      <div className="flex items-center gap-1.5 text-rose-700 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 p-2 rounded border border-rose-200 dark:border-rose-900/60">
                        <ShieldAlert className="w-3.5 h-3.5 shrink-0" />
                        <span><strong>Warning Overlay:</strong> {m.alertSignal}</span>
                      </div>
                    )}
                    {m.interventionEvent && (
                      <div className="flex items-center gap-1.5 text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 p-2 rounded border border-emerald-200 dark:border-emerald-900/60">
                        <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                        <span><strong>Closed-Loop Action:</strong> {m.interventionEvent}</span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
