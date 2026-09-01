import React from 'react';
import { Project } from '../../types/project';
import { useNavigate } from 'react-router-dom';
import { Sparkles, ArrowRight, ShieldAlert, Clock, IndianRupee, FileText, ChevronRight } from 'lucide-react';

interface DecisionModeSectionProps {
  project: Project;
  onOpenBrief: () => void;
}

export const DecisionModeSection: React.FC<DecisionModeSectionProps> = ({ project, onOpenBrief }) => {
  const navigate = useNavigate();

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-blue-900/60 rounded-xl p-6 shadow-sm dark:shadow-xl space-y-6">
      {/* Header with "View Decision Brief" action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-600/20 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-500/30">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white tracking-tight">
              Prescriptive Decision Intelligence Loop
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              End-to-end operational decision flow: Signals ➔ Root Causes ➔ Cascading Forecast ➔ Immediate Action Directives.
            </p>
          </div>
        </div>

        <button
          onClick={onOpenBrief}
          className="px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white rounded-md text-xs font-bold flex items-center gap-2 shadow-md dark:shadow-blue-950/50 transition transform hover:scale-[1.02]"
        >
          <FileText className="w-4 h-4" />
          <span>View Executive Decision Brief</span>
        </button>
      </div>

      {/* 4-Step Decision Loop Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Step 1: WHAT THE SYSTEM SEES */}
        <div className="bg-slate-50 dark:bg-slate-950/80 p-4 rounded-lg border border-slate-200 dark:border-slate-800 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-bold font-mono uppercase text-blue-600 dark:text-blue-400 tracking-wider">
                1. What The System Sees
              </span>
              <span className="w-2 h-2 rounded-full bg-blue-500 dark:bg-blue-400" />
            </div>
            <div className="space-y-2 text-xs font-mono mt-3">
              <div className="bg-white dark:bg-slate-900 p-2 rounded border border-slate-200 dark:border-slate-800 shadow-sm">
                <span className="text-slate-500 block font-sans text-[10px]">Composite Risk Score</span>
                <span className="text-lg font-bold text-red-600 dark:text-red-400">{project.risk_score} / 100</span>
                <span className="text-slate-500 dark:text-slate-400 text-[10px] ml-1.5 font-sans">({project.risk_level})</span>
              </div>
              <div className="bg-white dark:bg-slate-900 p-2 rounded border border-slate-200 dark:border-slate-800 shadow-sm">
                <span className="text-slate-500 block font-sans text-[10px]">Predicted Schedule Slippage</span>
                <span className="text-sm font-bold text-orange-600 dark:text-orange-400">+{project.predicted_delay_months} Months</span>
                <span className="text-slate-500 text-[10px] ml-1">({project.time_overrun_probability}% prob)</span>
              </div>
              <div className="bg-white dark:bg-slate-900 p-2 rounded border border-slate-200 dark:border-slate-800 shadow-sm">
                <span className="text-slate-500 block font-sans text-[10px]">Predicted Cost Exposure</span>
                <span className="text-sm font-bold text-red-600 dark:text-red-400">₹{project.predicted_cost_overrun.toLocaleString()} Cr</span>
                <span className="text-slate-500 text-[10px] ml-1">({project.cost_overrun_probability}% prob)</span>
              </div>
            </div>
          </div>
          <p className="text-[10px] text-slate-500 mt-3 pt-2 border-t border-slate-200 dark:border-slate-900">
            Detected via continuous PAIMANA telemetry ingestion.
          </p>
        </div>

        {/* Step 2: WHY THIS IS HAPPENING */}
        <div className="bg-slate-50 dark:bg-slate-950/80 p-4 rounded-lg border border-slate-200 dark:border-slate-800 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-bold font-mono uppercase text-amber-600 dark:text-amber-400 tracking-wider">
                2. Why This Is Happening
              </span>
              <span className="w-2 h-2 rounded-full bg-amber-500 dark:bg-amber-400" />
            </div>
            <div className="space-y-1.5 text-xs font-mono mt-3">
              {(project.risk_drivers || []).slice(0, 4).map((d, idx) => (
                <div key={idx} className="flex items-center justify-between bg-white dark:bg-slate-900 p-2 rounded border border-slate-200 dark:border-slate-800 shadow-sm">
                  <span className="text-slate-700 dark:text-slate-300 font-sans text-xs truncate max-w-[130px]">{d.name}</span>
                  <span className="font-bold text-red-600 dark:text-red-400">+{d.impact_points} pts</span>
                </div>
              ))}
            </div>
          </div>
          <p className="text-[10px] text-slate-500 mt-3 pt-2 border-t border-slate-200 dark:border-slate-900">
            Multi-variable deterministic driver contribution model.
          </p>
        </div>

        {/* Step 3: WHAT MAY HAPPEN NEXT */}
        <div className="bg-slate-50 dark:bg-slate-950/80 p-4 rounded-lg border border-slate-200 dark:border-slate-800 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-bold font-mono uppercase text-purple-600 dark:text-purple-400 tracking-wider">
                3. What May Happen Next
              </span>
              <span className="w-2 h-2 rounded-full bg-purple-500 dark:bg-purple-400" />
            </div>
            <div className="space-y-2 text-xs mt-3">
              <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-900 p-1.5 rounded border border-slate-200 dark:border-slate-800 text-[11px] shadow-sm">
                <span className="font-mono text-purple-600 dark:text-purple-400 font-bold">1</span>
                <span>Land Deficit & Utility Hold-Up</span>
              </div>
              <div className="text-center text-slate-400 dark:text-slate-600 text-xs leading-none">↓</div>
              <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-900 p-1.5 rounded border border-slate-200 dark:border-slate-800 text-[11px] shadow-sm">
                <span className="font-mono text-purple-600 dark:text-purple-400 font-bold">2</span>
                <span>{project.milestones_delayed} Critical Milestone Slippage(s)</span>
              </div>
              <div className="text-center text-slate-400 dark:text-slate-600 text-xs leading-none">↓</div>
              <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-900 p-1.5 rounded border border-slate-200 dark:border-slate-800 text-[11px] shadow-sm">
                <span className="font-mono text-purple-600 dark:text-purple-400 font-bold">3</span>
                <span>+{project.predicted_delay_months} Mo Schedule Overrun</span>
              </div>
            </div>
          </div>
          <button
            onClick={() => navigate(`/risk-network?projectId=${project.project_id}`)}
            className="text-[10px] text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300 flex items-center justify-between w-full mt-3 pt-2 border-t border-slate-200 dark:border-slate-900 font-semibold"
          >
            <span>Inspect Full Propagation Graph</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>

        {/* Step 4: WHAT SHOULD HAPPEN NOW */}
        <div className="bg-slate-50 dark:bg-slate-950/80 p-4 rounded-lg border border-slate-200 dark:border-slate-800 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-bold font-mono uppercase text-emerald-600 dark:text-emerald-400 tracking-wider">
                4. What Should Happen Now
              </span>
              <span className="w-2 h-2 rounded-full bg-emerald-500 dark:bg-emerald-400" />
            </div>
            <div className="space-y-2 text-xs mt-3">
              {(project.recommendations || []).slice(0, 3).map(rec => (
                <div key={rec.id} className="bg-white dark:bg-slate-900 p-2 rounded border border-slate-200 dark:border-slate-800 shadow-sm">
                  <div className="flex items-center justify-between">
                    <span className={`text-[9px] font-bold font-mono uppercase px-1.5 py-0.2 rounded ${
                      rec.priority === 1 ? 'bg-red-50 dark:bg-red-500/20 text-red-700 dark:text-red-400' : 'bg-amber-50 dark:bg-amber-500/20 text-amber-700 dark:text-amber-400'
                    }`}>
                      Priority {rec.priority}
                    </span>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400 truncate max-w-[100px]">{rec.responsible_entity.split(' / ')[0]}</span>
                  </div>
                  <p className="text-[11px] font-semibold text-slate-900 dark:text-white mt-1 line-clamp-1">{rec.title}</p>
                </div>
              ))}
            </div>
          </div>
          <button
            onClick={onOpenBrief}
            className="text-[10px] text-emerald-600 dark:text-emerald-400 hover:text-emerald-500 dark:hover:text-emerald-300 flex items-center justify-between w-full mt-3 pt-2 border-t border-slate-200 dark:border-slate-900 font-semibold"
          >
            <span>Review Full Intervention Directives</span>
            <ChevronRight className="w-3 h-3" />
          </button>
        </div>
      </div>
    </div>
  );
};
