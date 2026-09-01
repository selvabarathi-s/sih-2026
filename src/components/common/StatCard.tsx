import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: LucideIcon;
  trend?: {
    value: string;
    isPositive?: boolean;
    isNeutral?: boolean;
  };
  variant?: 'default' | 'critical' | 'warning' | 'success' | 'highlight';
  onClick?: () => void;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  variant = 'default',
  onClick,
}) => {
  const variantStyles = {
    default: 'bg-white dark:bg-slate-900/80 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 shadow-sm',
    critical: 'bg-red-50/70 dark:bg-red-950/25 border-red-200 dark:border-red-800/40 hover:border-red-300 dark:hover:border-red-700/60 shadow-sm',
    warning: 'bg-amber-50/70 dark:bg-amber-950/25 border-amber-200 dark:border-amber-800/40 hover:border-amber-300 dark:hover:border-amber-700/60 shadow-sm',
    success: 'bg-emerald-50/70 dark:bg-emerald-950/25 border-emerald-200 dark:border-emerald-800/40 hover:border-emerald-300 dark:hover:border-emerald-700/60 shadow-sm',
    highlight: 'bg-blue-50/70 dark:bg-blue-950/30 border-blue-200 dark:border-blue-800/50 hover:border-blue-300 dark:hover:border-blue-700/70 shadow-sm',
  }[variant];

  const iconColors = {
    default: 'text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800/60',
    critical: 'text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/40',
    warning: 'text-amber-600 dark:text-amber-400 bg-amber-100 dark:bg-amber-900/40',
    success: 'text-emerald-600 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-900/40',
    highlight: 'text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/40',
  }[variant];

  return (
    <div
      onClick={onClick}
      className={`rounded-lg border p-4 transition-all duration-200 ${variantStyles} ${onClick ? 'cursor-pointer hover:shadow-md' : ''}`}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider font-mono">{title}</p>
          <p className="mt-1.5 text-2xl font-bold tracking-tight text-slate-900 dark:text-white font-mono">{value}</p>
        </div>
        {Icon && (
          <div className={`p-2 rounded-md ${iconColors}`}>
            <Icon className="w-5 h-5" />
          </div>
        )}
      </div>

      {(subtitle || trend) && (
        <div className="mt-3 flex items-center justify-between text-xs pt-2 border-t border-slate-100 dark:border-slate-800/60">
          {subtitle && <span className="text-slate-500 dark:text-slate-400 font-medium">{subtitle}</span>}
          {trend && (
            <span
              className={`font-semibold font-mono ${
                trend.isPositive
                  ? 'text-emerald-600 dark:text-emerald-400'
                  : trend.isNeutral
                  ? 'text-slate-500 dark:text-slate-400'
                  : 'text-red-600 dark:text-red-400'
              }`}
            >
              {trend.value}
            </span>
          )}
        </div>
      )}
    </div>
  );
};
