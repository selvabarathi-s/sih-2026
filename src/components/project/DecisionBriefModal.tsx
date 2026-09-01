import React from 'react';
import { DecisionBrief } from '../../types/riskNetwork';
import { useDatasetMode } from '../../context/DatasetModeContext';
import { X, Printer, ShieldAlert, Sparkles, Building2, Landmark, CheckCircle, ArrowRight, Clock, IndianRupee, Database } from 'lucide-react';

interface DecisionBriefModalProps {
  brief: DecisionBrief;
  isOpen: boolean;
  onClose: () => void;
  isRealModeOverride?: boolean;
}

export const DecisionBriefModal: React.FC<DecisionBriefModalProps> = ({ brief, isOpen, onClose, isRealModeOverride }) => {
  const { isRealMode } = useDatasetMode();
  const isReal = isRealModeOverride !== undefined ? isRealModeOverride : isRealMode;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 dark:bg-slate-950/80 backdrop-blur-sm overflow-y-auto print:p-0 print:bg-white">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl max-w-4xl w-full p-6 shadow-2xl space-y-6 max-h-[92vh] overflow-y-auto print:max-h-none print:shadow-none print:border-none print:p-2">
        {/* Modal Top Header */}
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className={`w-9 h-9 rounded-lg flex items-center justify-center text-white shadow-md ${isReal ? 'bg-emerald-600' : 'bg-purple-600'}`}>
              {isReal ? <Database className="w-5 h-5" /> : <Sparkles className="w-5 h-5" />}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded font-mono ${
                  isReal
                    ? 'bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                    : 'bg-purple-50 dark:bg-purple-950 text-purple-700 dark:text-purple-400 border border-purple-200 dark:border-purple-800'
                }`}>
                  {isReal ? 'PAIMANA OBSERVATION BRIEF' : 'AI DECISION SIMULATION'}
                </span>
                <span className="text-xs text-slate-400">•</span>
                <span className="text-xs text-slate-500 dark:text-slate-400">Date: {brief.generatedAt}</span>
              </div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white mt-0.5">
                {isReal
                  ? `Observed Telemetry & Status Brief — ${brief.projectId}`
                  : `Strategic Predictive Decision Brief — ${brief.projectId}`}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2 print:hidden">
            <button
              onClick={() => window.print()}
              className="p-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white bg-slate-100 dark:bg-slate-800 rounded border border-slate-200 dark:border-slate-700 text-xs flex items-center gap-1.5 transition"
              title="Print Brief"
            >
              <Printer className="w-4 h-4" />
              <span className="hidden sm:inline">Print Brief</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white bg-slate-100 dark:bg-slate-800 rounded border border-slate-200 dark:border-slate-700 transition"
              aria-label="Close Modal"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Section 1: Project Metadata & Risk Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2 bg-slate-50 dark:bg-slate-950/80 p-4 rounded-lg border border-slate-200 dark:border-slate-800 space-y-2 text-xs">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">{brief.projectName}</h3>
            <div className="grid grid-cols-2 gap-2 text-slate-600 dark:text-slate-400 pt-1">
              <p>Ministry: <strong className="text-slate-900 dark:text-white font-medium">{brief.ministry}</strong></p>
              <p>Sector: <strong className="text-slate-900 dark:text-white font-medium">{brief.sector}</strong></p>
              <p>State / Region: <strong className="text-slate-900 dark:text-white font-medium">{brief.state}</strong></p>
              <p>Project ID: <strong className="text-slate-900 dark:text-white font-medium">{brief.projectId}</strong></p>
            </div>
          </div>

          <div className="bg-slate-50 dark:bg-slate-950/80 p-4 rounded-lg border border-slate-200 dark:border-slate-800 flex flex-col justify-between text-xs space-y-2">
            <div>
              <span className="text-[10px] font-mono text-slate-400 uppercase">
                {isReal ? 'Observed Parameter Rating' : 'Simulated Risk Classification'}
              </span>
              <p className="text-xl font-bold font-mono text-red-600 dark:text-red-400 mt-1">
                {isReal ? 'Cost-Revised Project' : `${brief.riskScore} / 100 (${brief.riskLevel})`}
              </p>
            </div>
            <div className="text-[11px] text-slate-500 dark:text-slate-400 border-t border-slate-200 dark:border-slate-800 pt-1 font-mono">
              {isReal ? 'Source: Table 6 PAIMANA Report' : `Predicted Slippage: +${brief.predictedDelayMonths} Mo`}
            </div>
          </div>
        </div>

        {/* Section 2: Executive Summary & Causal Chain */}
        <div className="p-4 bg-slate-50 dark:bg-slate-950/50 rounded-lg border border-slate-200 dark:border-slate-800 space-y-2">
          <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider font-mono">
            {isReal ? 'Observed Executive Summary' : 'AI Executive Risk Assessment'}
          </h4>
          <ul className="space-y-1 text-xs text-slate-700 dark:text-slate-300 font-sans">
            {brief.riskChainSummary.map((line, idx) => (
              <li key={idx} className="leading-relaxed">• {line}</li>
            ))}
          </ul>
        </div>

        {/* Section 3: Primary Risk Drivers / Bottlenecks */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider font-mono">
            {isReal ? 'Identified Project Bottlenecks' : 'Root-Cause Bottlenecks (Feature Impact)'}
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {brief.topDrivers.map((d, i) => (
              <div key={i} className="p-3 bg-slate-50 dark:bg-slate-950/80 rounded-lg border border-slate-200 dark:border-slate-800 space-y-1 text-xs">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-mono font-bold text-red-600 dark:text-red-400">Driver {i + 1}</span>
                  <span className="text-[10px] font-mono text-slate-400">+{d.impact} pts</span>
                </div>
                <p className="font-semibold text-slate-900 dark:text-white truncate">{d.name}</p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">{d.evidence}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Section 4: Prescriptive Interventions */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider font-mono">
            {isReal ? 'Actionable Departmental Directives' : 'Prescriptive Decision Directives'}
          </h4>
          <div className="space-y-2">
            {brief.priorityActions.map((rec, i) => (
              <div key={i} className="p-3 bg-blue-50/50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800/60 flex items-start gap-3 text-xs">
                <span className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                  {rec.priority || i + 1}
                </span>
                <div className="space-y-0.5 flex-1">
                  <div className="flex items-center justify-between">
                    <strong className="text-slate-900 dark:text-white block font-medium">{rec.title}</strong>
                    <span className="text-[10px] font-mono text-blue-600 dark:text-blue-400 font-semibold">{rec.urgency}</span>
                  </div>
                  <p className="text-slate-600 dark:text-slate-400 text-[11px]">{rec.action}</p>
                  <p className="text-[10px] text-slate-500 font-mono pt-0.5">Owner: <strong>{rec.owner}</strong> • Benefit: {rec.benefit}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Modal Footer Note */}
        <div className="flex items-center justify-between text-[11px] text-slate-400 dark:text-slate-500 pt-3 border-t border-slate-200 dark:border-slate-800 font-mono">
          <span>PAIMANA Predict • SIH 2026 Problem Statement 26103</span>
          <span>{isReal ? 'Classification: OFFICIAL PAIMANA OBSERVATION' : 'Classification: DECISION SIMULATION ONLY'}</span>
        </div>
      </div>
    </div>
  );
};
