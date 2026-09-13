import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ShieldAlert,
  Clock,
  IndianRupee,
  TrendingUp,
  Activity,
  ArrowRight,
  Flame,
  Layers,
  ChevronRight,
} from 'lucide-react';
import { ProvenanceBadge, ProvenanceType } from '../common/ProvenanceBadge';
import { ConfidenceBadge } from '../common/ConfidenceBadge';

export interface ProjectHealthCardProps {
  project: {
    project_id: string;
    project_name: string;
    sector: string;
    ministry: string;
    state?: string;
    physical_progress: number;
    original_cost?: number;
    revised_cost?: number;
    cost_overrun_cr?: number;
    cost_growth_pct?: number;
    schedule_extension_months?: number;
    riskScore?: number;
    riskBand?: string;
    riskMomentum?: string;
    confidenceScore?: number;
    priorityScore?: number;
    priorityBand?: string;
    topDriver?: string;
    provenanceType?: ProvenanceType;
  };
  onSimulateScenario?: (projectId: string) => void;
  onOverrideRisk?: (projectId: string) => void;
}

export const ProjectHealthCard: React.FC<ProjectHealthCardProps> = ({
  project,
  onSimulateScenario,
  onOverrideRisk,
}) => {
  const navigate = useNavigate();

  const riskScore = project.riskScore !== undefined ? project.riskScore : 50;
  const riskBand = project.riskBand || (riskScore >= 75 ? 'CRITICAL' : riskScore >= 50 ? 'HIGH' : riskScore >= 25 ? 'MODERATE' : 'LOW');
  const momentum = project.riskMomentum || 'STABLE';

  const getRiskBandBadge = () => {
    switch (riskBand) {
      case 'CRITICAL':
        return 'bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-400 border-rose-200 dark:border-rose-800';
      case 'HIGH':
        return 'bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-800';
      case 'MODERATE':
        return 'bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-800';
      case 'LOW':
      default:
        return 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800';
    }
  };

  const getMomentumBadge = () => {
    switch (momentum) {
      case 'CRITICAL_ACCELERATION':
      case 'RAPID_DETERIORATION':
        return 'bg-rose-100 dark:bg-rose-900/40 text-rose-800 dark:text-rose-300 border-rose-300';
      case 'DETERIORATING':
        return 'bg-amber-100 dark:bg-amber-900/40 text-amber-800 dark:text-amber-300 border-amber-300';
      case 'RECOVERING':
      case 'IMPROVING':
        return 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-800 dark:text-emerald-300 border-emerald-300';
      case 'STABLE':
      default:
        return 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-300';
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-5 shadow-sm hover:shadow-md transition space-y-4">
      {/* Top Header: ID, Badges & Priority */}
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-mono font-bold text-blue-600 dark:text-blue-400">
              {project.project_id}
            </span>
            <ProvenanceBadge type={project.provenanceType || 'REAL_PAIMANA'} size="sm" />
            <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border uppercase ${getMomentumBadge()}`}>
              {momentum.replace('_', ' ')}
            </span>
          </div>
          <h3 className="text-base font-extrabold text-slate-900 dark:text-white mt-1 leading-snug">
            {project.project_name}
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-mono mt-0.5">
            {project.ministry} • {project.sector} {project.state ? `• ${project.state}` : ''}
          </p>
        </div>

        {/* Big Risk Score Visual */}
        <div className="flex items-baseline gap-2 bg-slate-50 dark:bg-slate-950 p-2.5 rounded-lg border border-slate-200 dark:border-slate-800 shrink-0 font-mono text-right">
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400">Risk Score</span>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-black text-slate-900 dark:text-white">{riskScore}</span>
              <span className="text-xs text-slate-400">/100</span>
            </div>
          </div>
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${getRiskBandBadge()}`}>
            {riskBand}
          </span>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3 bg-slate-50 dark:bg-slate-950/70 border border-slate-100 dark:border-slate-800/80 rounded font-mono text-xs">
        <div>
          <span className="text-slate-400 text-[10px] block uppercase">Physical Progress</span>
          <span className="font-bold text-slate-900 dark:text-white">{project.physical_progress}%</span>
          <div className="w-full bg-slate-200 dark:bg-slate-800 h-1 rounded-full mt-1 overflow-hidden">
            <div
              className="bg-blue-600 h-full rounded-full"
              style={{ width: `${Math.min(100, project.physical_progress)}%` }}
            />
          </div>
        </div>

        <div>
          <span className="text-slate-400 text-[10px] block uppercase">Cost Revision</span>
          <span className="font-bold text-amber-600 dark:text-amber-400">
            +{project.cost_growth_pct || 0}%
          </span>
          <span className="text-[10px] text-slate-400 block truncate">
            +₹{project.cost_overrun_cr?.toLocaleString() || 0} Cr
          </span>
        </div>

        <div>
          <span className="text-slate-400 text-[10px] block uppercase">Schedule Delay</span>
          <span className="font-bold text-rose-600 dark:text-rose-400">
            {project.schedule_extension_months || 0} Mo
          </span>
          <span className="text-[10px] text-slate-400 block truncate">COD Slip</span>
        </div>

        <div>
          <span className="text-slate-400 text-[10px] block uppercase">Priority Queue</span>
          <span className="font-bold text-purple-600 dark:text-purple-400">
            {project.priorityBand || 'ROUTINE'}
          </span>
          <span className="text-[10px] text-slate-400 block truncate">
            Score: {project.priorityScore || 50}/100
          </span>
        </div>
      </div>

      {/* Primary Driver & Confidence Indicator */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-1">
        <div className="text-xs text-slate-600 dark:text-slate-400 font-mono flex items-center gap-1.5 truncate">
          <span className="text-slate-400 font-bold uppercase text-[10px]">Top Driver:</span>
          <span className="truncate text-slate-800 dark:text-slate-200">
            {project.topDriver || 'Multi-snapshot delivery velocity lag'}
          </span>
        </div>

        <ConfidenceBadge score={project.confidenceScore || 88} size="sm" />
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-2">
          {onSimulateScenario && (
            <button
              onClick={() => onSimulateScenario(project.project_id)}
              className="px-2.5 py-1 text-[11px] font-semibold bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded font-mono transition"
            >
              What-If Scenarios
            </button>
          )}
          {onOverrideRisk && (
            <button
              onClick={() => onOverrideRisk(project.project_id)}
              className="px-2.5 py-1 text-[11px] font-semibold bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-blue-600 dark:text-blue-400 rounded font-mono transition"
            >
              Officer Override
            </button>
          )}
        </div>

        <button
          onClick={() => navigate(`/projects/${project.project_id}`)}
          className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 flex items-center gap-1 transition font-mono"
        >
          <span>Deep-Dive Telemetry</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
