import React from 'react';
import { RiskDriver } from '../../types/project';
import { AlertTriangle, CheckCircle, Info, ShieldAlert } from 'lucide-react';

interface DriverBarProps {
  driver: RiskDriver;
}

export const DriverBar: React.FC<DriverBarProps> = ({ driver }) => {
  const severityConfig = {
    CRITICAL: {
      bg: 'bg-red-50/80 dark:bg-red-950/40 border-red-200 dark:border-red-800/60',
      text: 'text-red-700 dark:text-red-400',
      badge: 'bg-red-100 dark:bg-red-500/20 text-red-800 dark:text-red-300 border-red-200 dark:border-red-500/40',
      bar: 'bg-red-500',
      icon: ShieldAlert,
    },
    HIGH: {
      bg: 'bg-orange-50/80 dark:bg-orange-950/40 border-orange-200 dark:border-orange-800/60',
      text: 'text-orange-700 dark:text-orange-400',
      badge: 'bg-orange-100 dark:bg-orange-500/20 text-orange-800 dark:text-orange-300 border-orange-200 dark:border-orange-500/40',
      bar: 'bg-orange-500',
      icon: AlertTriangle,
    },
    MEDIUM: {
      bg: 'bg-amber-50/80 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800/60',
      text: 'text-amber-700 dark:text-amber-400',
      badge: 'bg-amber-100 dark:bg-amber-500/20 text-amber-800 dark:text-amber-300 border-amber-200 dark:border-amber-500/40',
      bar: 'bg-amber-500',
      icon: Info,
    },
    LOW: {
      bg: 'bg-emerald-50/80 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800/60',
      text: 'text-emerald-700 dark:text-emerald-400',
      badge: 'bg-emerald-100 dark:bg-emerald-500/20 text-emerald-800 dark:text-emerald-300 border-emerald-200 dark:border-emerald-500/40',
      bar: 'bg-emerald-500',
      icon: CheckCircle,
    },
  }[driver.severity];

  const Icon = severityConfig.icon;

  return (
    <div className={`p-4 rounded-lg border ${severityConfig.bg} transition-all shadow-sm`}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <div className={`p-2 rounded-md ${severityConfig.badge}`}>
            <Icon className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="text-sm font-semibold text-slate-900 dark:text-white">{driver.name}</h4>
              <span className={`text-xs px-2 py-0.5 rounded border font-mono font-medium ${severityConfig.badge}`}>
                +{driver.impact_points} Risk Points
              </span>
            </div>
            <p className="mt-1 text-xs text-slate-700 dark:text-slate-300 font-medium">
              {driver.evidence}
            </p>
          </div>
        </div>
      </div>

      <div className="mt-3 pt-3 border-t border-slate-200/60 dark:border-slate-800/60 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div className="text-slate-600 dark:text-slate-400">
          <span>Operational Impact: </span>
          <span className="text-slate-800 dark:text-slate-200 font-medium">{driver.explanation}</span>
        </div>
        <div className="text-[11px] font-mono text-slate-500 dark:text-slate-400">
          Driver ID: {driver.id}
        </div>
      </div>
    </div>
  );
};
