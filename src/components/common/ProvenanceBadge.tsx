import React from 'react';
import { ProvenanceType } from '../../types/auth';

export type { ProvenanceType };

interface ProvenanceBadgeProps {
  type: ProvenanceType;
  label?: string;
  size?: 'xs' | 'sm' | 'md';
  className?: string;
}

const BADGE_CONFIG: Record<ProvenanceType, { bg: string; text: string; border: string; desc: string; icon: string }> = {
  OBSERVED: {
    bg: 'bg-emerald-50 dark:bg-emerald-950/40',
    text: 'text-emerald-700 dark:text-emerald-300',
    border: 'border-emerald-200 dark:border-emerald-800',
    desc: 'Official ground-truth observed data directly reported by executing agency / PAIMANA source.',
    icon: '●',
  },
  REAL_PAIMANA: {
    bg: 'bg-emerald-50 dark:bg-emerald-950/40',
    text: 'text-emerald-700 dark:text-emerald-300',
    border: 'border-emerald-200 dark:border-emerald-800',
    desc: 'Official ground-truth observed data directly reported by executing agency / PAIMANA source.',
    icon: '●',
  },
  DERIVED: {
    bg: 'bg-blue-50 dark:bg-blue-950/40',
    text: 'text-blue-700 dark:text-blue-300',
    border: 'border-blue-200 dark:border-blue-800',
    desc: 'Deterministically computed mathematical metric calculated from observed time-series.',
    icon: '▲',
  },
  DERIVED_VARIABLE: {
    bg: 'bg-blue-50 dark:bg-blue-950/40',
    text: 'text-blue-700 dark:text-blue-300',
    border: 'border-blue-200 dark:border-blue-800',
    desc: 'Deterministically computed mathematical metric calculated from observed time-series.',
    icon: '▲',
  },
  PREDICTED: {
    bg: 'bg-amber-50 dark:bg-amber-950/40',
    text: 'text-amber-700 dark:text-amber-300',
    border: 'border-amber-200 dark:border-amber-800',
    desc: 'Forward-looking model inference produced by governed Time-GBM (v1.4) under Rule T anti-leakage.',
    icon: '◆',
  },
  AI_DEMO_ENRICHMENT: {
    bg: 'bg-amber-50 dark:bg-amber-950/40',
    text: 'text-amber-700 dark:text-amber-300',
    border: 'border-amber-200 dark:border-amber-800',
    desc: 'Forward-looking model inference produced by governed Time-GBM (v1.4) under Rule T anti-leakage.',
    icon: '◆',
  },
  SIMULATED: {
    bg: 'bg-purple-50 dark:bg-purple-950/40',
    text: 'text-purple-700 dark:text-purple-300',
    border: 'border-purple-200 dark:border-purple-800',
    desc: 'What-if network scenario simulation modeling upstream dependency delay cascade exposures.',
    icon: '◈',
  },
  SYNTHETIC_BENCHMARK: {
    bg: 'bg-purple-50 dark:bg-purple-950/40',
    text: 'text-purple-700 dark:text-purple-300',
    border: 'border-purple-200 dark:border-purple-800',
    desc: 'What-if network scenario simulation modeling upstream dependency delay cascade exposures.',
    icon: '◈',
  },
};

export const ProvenanceBadge: React.FC<ProvenanceBadgeProps> = ({
  type,
  label,
  size = 'xs',
  className = '',
}) => {
  const config = BADGE_CONFIG[type] || BADGE_CONFIG.OBSERVED;
  const sizeClasses = {
    xs: 'text-[10px] px-1.5 py-0.5',
    sm: 'text-xs px-2 py-0.5',
    md: 'text-sm px-2.5 py-1',
  }[size];

  return (
    <span
      className={`inline-flex items-center gap-1 font-mono uppercase tracking-wider rounded border ${config.bg} ${config.text} ${config.border} ${sizeClasses} ${className}`}
      title={`${type}: ${config.desc}`}
    >
      <span className="text-[9px]">{config.icon}</span>
      <span>{label || type}</span>
    </span>
  );
};
