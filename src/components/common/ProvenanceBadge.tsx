import React from 'react';
import { Database, Sparkles, Cpu, Layers } from 'lucide-react';

export type ProvenanceType = 'REAL_PAIMANA' | 'DERIVED_VARIABLE' | 'AI_DEMO_ENRICHMENT' | 'SYNTHETIC_BENCHMARK';

interface ProvenanceBadgeProps {
  type?: ProvenanceType;
  label?: string;
  size?: 'sm' | 'md';
  className?: string;
}

export const ProvenanceBadge: React.FC<ProvenanceBadgeProps> = ({
  type = 'REAL_PAIMANA',
  label,
  size = 'sm',
  className = '',
}) => {
  const getBadgeConfig = () => {
    switch (type) {
      case 'REAL_PAIMANA':
        return {
          text: label || 'Real MoSPI PAIMANA',
          icon: Database,
          classes: 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800',
        };
      case 'DERIVED_VARIABLE':
        return {
          text: label || 'Derived Telemetry (Rule T)',
          icon: Layers,
          classes: 'bg-blue-50 dark:bg-blue-950/60 text-blue-800 dark:text-blue-300 border-blue-300 dark:border-blue-800',
        };
      case 'AI_DEMO_ENRICHMENT':
        return {
          text: label || 'Field Expansion Telemetry',
          icon: Sparkles,
          classes: 'bg-amber-50 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border-amber-300 dark:border-amber-800',
        };
      case 'SYNTHETIC_BENCHMARK':
      default:
        return {
          text: label || 'Synthetic Benchmark',
          icon: Cpu,
          classes: 'bg-purple-50 dark:bg-purple-950/60 text-purple-800 dark:text-purple-300 border-purple-300 dark:border-purple-800',
        };
    }
  };

  const config = getBadgeConfig();
  const IconComponent = config.icon;
  const padding = size === 'sm' ? 'px-2 py-0.5 text-[10px]' : 'px-2.5 py-1 text-xs';

  return (
    <span
      className={`inline-flex items-center gap-1 font-mono font-semibold rounded border uppercase tracking-wider ${padding} ${config.classes} ${className}`}
      title={`Data Provenance Classification: ${config.text}`}
    >
      <IconComponent className={size === 'sm' ? 'w-3 h-3' : 'w-3.5 h-3.5'} />
      <span>{config.text}</span>
    </span>
  );
};
