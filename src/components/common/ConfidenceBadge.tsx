import React from 'react';
import { ShieldCheck, AlertTriangle, HelpCircle } from 'lucide-react';

interface ConfidenceBadgeProps {
  score?: number;
  level?: 'HIGH' | 'MODERATE' | 'LOW' | string;
  warnings?: Array<{ code: string; message: string }>;
  showLabel?: boolean;
  size?: 'sm' | 'md';
}

export const ConfidenceBadge: React.FC<ConfidenceBadgeProps> = ({
  score = 88,
  level,
  warnings = [],
  showLabel = true,
  size = 'sm',
}) => {
  const effectiveLevel = level || (score >= 80 ? 'HIGH' : score >= 60 ? 'MODERATE' : 'LOW');

  const getColorClasses = () => {
    switch (effectiveLevel) {
      case 'HIGH':
        return 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800';
      case 'MODERATE':
        return 'bg-blue-50 dark:bg-blue-950/60 text-blue-800 dark:text-blue-300 border-blue-300 dark:border-blue-800';
      case 'LOW':
      default:
        return 'bg-amber-50 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border-amber-300 dark:border-amber-800';
    }
  };

  const hasWarnings = warnings.length > 0;
  const padding = size === 'sm' ? 'px-2 py-0.5 text-[10px]' : 'px-2.5 py-1 text-xs';

  return (
    <div className="inline-flex items-center gap-1.5 font-mono">
      <span
        className={`inline-flex items-center gap-1 font-semibold rounded border uppercase tracking-wider ${padding} ${getColorClasses()}`}
        title={`Prediction Epistemic Confidence: ${score}%. Factoring data completeness, snapshot depth, and velocity stability.`}
      >
        <ShieldCheck className={size === 'sm' ? 'w-3 h-3' : 'w-3.5 h-3.5'} />
        <span>
          {showLabel ? 'Confidence: ' : ''}
          {score}%
        </span>
      </span>

      {hasWarnings && (
        <span
          className="text-amber-600 dark:text-amber-400 cursor-help"
          title={warnings.map(w => w.message).join(' | ')}
        >
          <AlertTriangle className="w-3.5 h-3.5" />
        </span>
      )}
    </div>
  );
};
