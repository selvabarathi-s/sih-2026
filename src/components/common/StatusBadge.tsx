import React from 'react';
import { ProjectStatus } from '../../types/project';

interface StatusBadgeProps {
  status: ProjectStatus;
  size?: 'sm' | 'md';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, size = 'md' }) => {
  const configs: Record<ProjectStatus, { label: string; style: string }> = {
    ON_TRACK: { label: 'On Track', style: 'bg-blue-50 dark:bg-blue-500/15 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-500/30' },
    UNDER_WATCH: { label: 'Under Watch', style: 'bg-amber-50 dark:bg-amber-500/15 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-500/30' },
    DELAYED: { label: 'Delayed', style: 'bg-orange-50 dark:bg-orange-500/15 text-orange-700 dark:text-orange-400 border-orange-200 dark:border-orange-500/30' },
    CRITICAL: { label: 'Critical Delay', style: 'bg-red-50 dark:bg-red-500/15 text-red-700 dark:text-red-400 border-red-200 dark:border-red-500/30 font-bold' },
    COMPLETED: { label: 'Completed', style: 'bg-emerald-50 dark:bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/30' },
  };

  const current = configs[status] || { label: status, style: 'bg-slate-100 dark:bg-slate-500/15 text-slate-700 dark:text-slate-400 border-slate-200 dark:border-slate-500/30' };
  const sizeClasses = size === 'sm' ? 'text-[11px] px-2 py-0.5 font-medium' : 'text-xs px-2.5 py-0.5 font-medium';

  return (
    <span className={`inline-flex items-center rounded border ${current.style} ${sizeClasses}`}>
      {current.label}
    </span>
  );
};
