import React from 'react';
import { RiskLevel } from '../../types/project';

interface RiskBadgeProps {
  level: RiskLevel;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}

export const RiskBadge: React.FC<RiskBadgeProps> = ({ level, size = 'md', showLabel = true }) => {
  const styles = {
    LOW: 'bg-emerald-50 dark:bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-emerald-300 dark:border-emerald-500/30',
    MODERATE: 'bg-amber-50 dark:bg-amber-500/15 text-amber-700 dark:text-amber-400 border-amber-300 dark:border-amber-500/30',
    HIGH: 'bg-orange-50 dark:bg-orange-500/15 text-orange-700 dark:text-orange-400 border-orange-300 dark:border-orange-500/30',
    CRITICAL: 'bg-red-50 dark:bg-red-500/15 text-red-700 dark:text-red-400 border-red-300 dark:border-red-500/30 font-bold',
  }[level] || 'bg-slate-100 dark:bg-slate-500/15 text-slate-700 dark:text-slate-400 border-slate-300 dark:border-slate-500/30';

  const dotColors = {
    LOW: 'bg-emerald-500 dark:bg-emerald-400',
    MODERATE: 'bg-amber-500 dark:bg-amber-400',
    HIGH: 'bg-orange-500 dark:bg-orange-400',
    CRITICAL: 'bg-red-500 dark:bg-red-400 animate-pulse',
  }[level];

  const sizeClasses = {
    sm: 'text-[11px] px-2 py-0.5 font-mono',
    md: 'text-xs px-2.5 py-0.5 font-medium font-mono',
    lg: 'text-sm px-3 py-1 font-semibold font-mono',
  }[size];

  return (
    <span className={`inline-flex items-center gap-1.5 rounded border ${styles} ${sizeClasses}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${dotColors}`} />
      {showLabel ? level : ''}
    </span>
  );
};
