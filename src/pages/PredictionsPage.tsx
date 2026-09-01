import React, { useState } from 'react';
import { modelService } from '../services/modelService';
import { paimanaDataService } from '../services/paimanaDataService';
import { useDatasetMode } from '../context/DatasetModeContext';
import {
  Cpu,
  TrendingUp,
  Sparkles,
  Layers,
  CheckCircle2,
  Sliders,
  ShieldCheck,
  Timer,
  BarChart3,
  HelpCircle,
  FileCheck2,
  Database,
  Info,
  IndianRupee,
  Activity,
  AlertTriangle,
} from 'lucide-react';

export const PredictionsPage: React.FC = () => {
  const { isRealMode, isDemoMode, setDatasetMode } = useDatasetMode();
  const [activeSection, setActiveSection] = useState<'real' | 'ai_demo'>(isRealMode ? 'real' : 'ai_demo');

  const modelMetrics = modelService.getModelMetrics();
  const cufComparison = modelService.getCUFComparison();
  const costImportance = modelService.getFeatureImportance('cost_overrun');
  const timeImportance = modelService.getFeatureImportance('time_overrun');
  const trustSummary = modelService.getModelTrustSummary();

  const realSummary = paimanaDataService.getPortfolioSummary();
  const realAudit = paimanaDataService.getIngestionAudit();

  const [activeTargetTab, setActiveTargetTab] = useState<'time_overrun' | 'cost_overrun'>('time_overrun');

  // Interactive Live Inference Simulator State
  const [simProgressGap, setSimProgressGap] = useState(15);
  const [simLandDeficit, setSimLandDeficit] = useState(38);
  const [simMilestonesDelayed, setSimMilestonesDelayed] = useState(3);
  const [simUtilityDelay, setSimUtilityDelay] = useState(true);

  // Computed simulation output using modelService
  const simResult = modelService.predictTimeRisk({
    planned_progress: 76,
    physical_progress: 76 - simProgressGap,
    land_target: 90,
    land_progress: 90 - simLandDeficit,
    milestones_delayed: simMilestonesDelayed,
    utility_shift_status: simUtilityDelay ? 'Critical Delay' : 'Completed',
  });

  const simCostResult = modelService.predictCostRisk({
    original_cost: 8450,
    revised_cost: 9180,
    planned_progress: 76,
    physical_progress: 76 - simProgressGap,
    land_progress: 90 - simLandDeficit,
  });

  const currentModels =
    activeTargetTab === 'time_overrun'
      ? Object.entries(modelMetrics.time_overrun_models).map(([name, m]) => ({ name, ...m }))
      : Object.entries(modelMetrics.cost_overrun_models).map(([name, m]) => ({ name, ...m }));

  const currentCUF =
    activeTargetTab === 'time_overrun'
      ? cufComparison.time_overrun
      : cufComparison.cost_overrun;

  const currentImportance =
    activeTargetTab === 'time_overrun' ? timeImportance : costImportance;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-6 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-purple-50 dark:bg-purple-950 text-purple-700 dark:text-purple-400 border border-purple-200 dark:border-purple-800 font-mono flex items-center gap-1">
                <Cpu className="w-3 h-3" />
                <span>ANALYTICS & PREDICTIVE ARCHITECTURE</span>
              </span>
              <span className="text-xs text-slate-400">•</span>
              <span className="text-xs text-slate-500 dark:text-slate-400">Problem Statement 26103</span>
            </div>
            <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Predictive Models & Real Portfolio Intelligence
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-3xl">
              Distinguishing between observed analytical indicators from the 1,981 authentic April 2026 projects and machine learning benchmarks evaluated on the enriched research dataset.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveSection('real')}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold flex items-center gap-1.5 transition ${
                activeSection === 'real'
                  ? 'bg-emerald-600 text-white shadow-md font-bold'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
              }`}
            >
              <Database className="w-3.5 h-3.5" />
              <span>REAL PAIMANA ANALYTICS</span>
            </button>

            <button
              onClick={() => setActiveSection('ai_demo')}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold flex items-center gap-1.5 transition ${
                activeSection === 'ai_demo'
                  ? 'bg-purple-600 text-white shadow-md font-bold'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>AI RESEARCH DEMONSTRATION</span>
            </button>
          </div>
        </div>
      </div>

      {/* SECTION 1: REAL PAIMANA ANALYTICS */}
      {activeSection === 'real' && (
        <div className="space-y-6">
          {/* Summary KPIs */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-5 shadow-sm space-y-2">
              <span className="text-[10px] font-mono uppercase text-slate-500 font-bold block">
                Observed Portfolio Cost Escalation
              </span>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-extrabold font-mono text-amber-600 dark:text-amber-400">
                  +{realSummary.headline.cost_growth_total_pct}%
                </span>
                <span className="text-xs text-slate-500 font-mono">Total Revision</span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                +₹{(realSummary.headline.cost_growth_total_cr / 100000).toFixed(2)} Lakh Crore cost growth across {realSummary.headline.projects_with_cost_growth} projects.
              </p>
            </div>

            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-5 shadow-sm space-y-2">
              <span className="text-[10px] font-mono uppercase text-slate-500 font-bold block">
                Observed Schedule Extensions
              </span>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-extrabold font-mono text-blue-600 dark:text-blue-400">
                  {realSummary.headline.projects_with_schedule_extension}
                </span>
                <span className="text-xs text-slate-500 font-mono">Projects Extended</span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                Out of 1,981 ongoing projects with revised Date of Commissioning (DoC).
              </p>
            </div>

            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-5 shadow-sm space-y-2">
              <span className="text-[10px] font-mono uppercase text-slate-500 font-bold block">
                Average Physical Execution
              </span>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-extrabold font-mono text-emerald-600 dark:text-emerald-400">
                  {realSummary.headline.average_physical_progress_pct}%
                </span>
                <span className="text-xs text-slate-500 font-mono">Reported Progress</span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                Cumulative expenditure: ₹{(realSummary.headline.cumulative_expenditure_cr / 100000).toFixed(2)} Lakh Cr ({realSummary.headline.expenditure_ratio_pct}% of budget).
              </p>
            </div>
          </div>

          {/* Model Readiness & Real Training Boundary Notice */}
          <div className="bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 rounded-lg p-5 space-y-3">
            <div className="flex items-center gap-2">
              <Info className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider font-mono">
                Scientific Governance: Transition from Descriptive PAIMANA to Predictive AI
              </h3>
            </div>
            <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
              The public PAIMANA flash reports published by MoSPI provide essential macro milestones and financial snapshots. However, <strong>predictive machine learning (e.g. 7-month advance slippage warning) requires operational telemetry variables</strong> (such as land parcel handover percentages, forest clearances, and 400kV utility shifting logs).
            </p>
            <div className="p-3 bg-white dark:bg-slate-900 rounded border border-slate-200 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-400">
              <strong className="text-slate-900 dark:text-white">Scientific Honesty Policy:</strong> The ML model ROC-AUC benchmark of <strong>0.916</strong> was trained on an enriched research benchmark dataset incorporating these granular operational variables. To explore this predictive model architecture, click the <strong>AI RESEARCH DEMONSTRATION</strong> tab above.
            </div>
          </div>
        </div>
      )}

      {/* SECTION 2: AI RESEARCH DEMONSTRATION */}
      {activeSection === 'ai_demo' && (
        <div className="space-y-6">
          {/* Permanent Disclaimer Badge */}
          <div className="p-3 bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800 rounded-md text-xs text-purple-800 dark:text-purple-300 font-mono flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-purple-600" />
              <span>NOTE: Prototype evaluation on synthetic PAIMANA-like enriched data (Problem Statement 26103).</span>
            </div>
            <span className="text-[10px] bg-purple-200 dark:bg-purple-900 px-2 py-0.5 rounded font-bold">RESEARCH BENCHMARK</span>
          </div>

          {/* Target Switcher: Time Overrun vs Cost Overrun */}
          <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
            <button
              onClick={() => setActiveTargetTab('time_overrun')}
              className={`px-4 py-2 text-xs font-semibold rounded-md transition ${
                activeTargetTab === 'time_overrun'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-900'
              }`}
            >
              Target: Time Overrun (Delay &gt; 3 Mo)
            </button>

            <button
              onClick={() => setActiveTargetTab('cost_overrun')}
              className={`px-4 py-2 text-xs font-semibold rounded-md transition ${
                activeTargetTab === 'cost_overrun'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-900'
              }`}
            >
              Target: Cost Overrun (Overrun &gt; 10%)
            </button>
          </div>

          {/* Model Evaluation Matrix Table */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div>
                <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider font-mono">
                  Machine Learning Model Comparison Matrix
                </h3>
                <p className="text-[11px] text-slate-500">Cross-validated on 228 model-ready project records</p>
              </div>
              <span className="text-[10px] font-mono bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 px-2 py-0.5 rounded border border-blue-200 dark:border-blue-800">
                5-Fold Stratified CV
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 text-[10px] uppercase">
                    <th className="py-2.5 px-3">Model Architecture</th>
                    <th className="py-2.5 px-3">Accuracy</th>
                    <th className="py-2.5 px-3">ROC-AUC</th>
                    <th className="py-2.5 px-3">Precision</th>
                    <th className="py-2.5 px-3">Recall</th>
                    <th className="py-2.5 px-3">F1 Score</th>
                    <th className="py-2.5 px-3 text-right">Early Warning Lead</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                  {currentModels.map((m, idx) => (
                    <tr
                      key={m.name}
                      className={idx === 2 ? 'bg-blue-50/60 dark:bg-blue-950/25 font-semibold' : 'hover:bg-slate-50 dark:hover:bg-slate-800/40'}
                    >
                      <td className="py-2.5 px-3 font-sans flex items-center gap-1.5">
                        <span className="text-slate-900 dark:text-white">{m.name}</span>
                        {idx === 2 && (
                          <span className="text-[9px] bg-blue-600 text-white px-1.5 py-0.2 rounded font-mono font-bold">
                            RECOMMENDED
                          </span>
                        )}
                      </td>
                      <td className="py-2.5 px-3">{m.accuracy.toFixed(3)}</td>
                      <td className="py-2.5 px-3 text-blue-600 dark:text-blue-400 font-bold">{m.roc_auc.toFixed(3)}</td>
                      <td className="py-2.5 px-3">{m.precision.toFixed(3)}</td>
                      <td className="py-2.5 px-3">{m.recall.toFixed(3)}</td>
                      <td className="py-2.5 px-3">{m.f1_score.toFixed(3)}</td>
                      <td className="py-2.5 px-3 text-right text-emerald-600 dark:text-emerald-400 font-bold font-sans">
                        {m.early_warning_lead_months.toFixed(1)} Months
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* CUF Baseline vs Expanded Variables */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-5 shadow-sm space-y-3">
              <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider font-mono">
                CUF Baseline vs Expanded Variables Gain
              </h4>
              <p className="text-xs text-slate-500">
                Proving empirical gain when operational variables (ROW, utility, clearances) are combined with CUF data.
              </p>

              <div className="space-y-2.5 pt-2 text-xs font-mono">
                <div className="p-3 bg-slate-50 dark:bg-slate-950 rounded border border-slate-200 dark:border-slate-800 flex justify-between items-center">
                  <span>ROC-AUC Gain:</span>
                  <strong className="text-emerald-600 dark:text-emerald-400 text-sm">+{currentCUF.auc_delta.toFixed(3)} AUC</strong>
                </div>
                <div className="p-3 bg-slate-50 dark:bg-slate-950 rounded border border-slate-200 dark:border-slate-800 flex justify-between items-center">
                  <span>Lead Time Advance:</span>
                  <strong className="text-emerald-600 dark:text-emerald-400 text-sm">+{currentCUF.lead_time_delta_months.toFixed(1)} Months</strong>
                </div>
                <div className="p-3 bg-slate-50 dark:bg-slate-950 rounded border border-slate-200 dark:border-slate-800 flex justify-between items-center">
                  <span>Recall Improvement:</span>
                  <strong className="text-emerald-600 dark:text-emerald-400 text-sm">+{((currentCUF.expanded_recall - currentCUF.cuf_only_recall) * 100).toFixed(1)}%</strong>
                </div>
              </div>
            </div>

            {/* Feature Importance */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-5 shadow-sm space-y-3">
              <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider font-mono">
                Top Gini Feature Importance
              </h4>
              <p className="text-xs text-slate-500">Relative contribution of variables to risk prediction</p>

              <div className="space-y-2 pt-2">
                {currentImportance.slice(0, 5).map(f => (
                  <div key={f.feature} className="text-xs space-y-1">
                    <div className="flex justify-between font-mono">
                      <span className="text-slate-800 dark:text-slate-200 truncate max-w-[220px]">{f.label || f.feature}</span>
                      <span className="text-blue-600 dark:text-blue-400 font-bold">{f.importance_score}%</span>
                    </div>
                    <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-blue-600 h-full rounded-full" style={{ width: `${f.importance_score}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Interactive Live Inference Simulator */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Sliders className="w-4 h-4 text-purple-600" />
                <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider font-mono">
                  Interactive Live Inference Simulator
                </h4>
              </div>
              <span className="text-[10px] font-mono text-purple-600 bg-purple-50 dark:bg-purple-950 px-2 py-0.5 rounded border border-purple-200 dark:border-purple-800">
                Real-Time Gradient Boosting Inference
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3 text-xs">
                <div>
                  <div className="flex justify-between mb-1 font-mono">
                    <span className="text-slate-600 dark:text-slate-400">Execution Progress Gap:</span>
                    <strong className="text-blue-600">{simProgressGap}%</strong>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="40"
                    value={simProgressGap}
                    onChange={e => setSimProgressGap(Number(e.target.value))}
                    className="w-full"
                  />
                </div>

                <div>
                  <div className="flex justify-between mb-1 font-mono">
                    <span className="text-slate-600 dark:text-slate-400">Land Acquisition Deficit:</span>
                    <strong className="text-amber-600">{simLandDeficit}%</strong>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="60"
                    value={simLandDeficit}
                    onChange={e => setSimLandDeficit(Number(e.target.value))}
                    className="w-full"
                  />
                </div>

                <div>
                  <div className="flex justify-between mb-1 font-mono">
                    <span className="text-slate-600 dark:text-slate-400">Delayed Milestones Count:</span>
                    <strong className="text-red-600">{simMilestonesDelayed}</strong>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="8"
                    value={simMilestonesDelayed}
                    onChange={e => setSimMilestonesDelayed(Number(e.target.value))}
                    className="w-full"
                  />
                </div>
              </div>

              {/* Simulation Output Card */}
              <div className="bg-slate-50 dark:bg-slate-950 p-4 rounded-lg border border-slate-200 dark:border-slate-800 flex flex-col justify-between space-y-3 font-mono">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase block font-bold">Model Output Probability</span>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="text-3xl font-extrabold text-red-600 dark:text-red-400">
                      {simResult.probability.toFixed(1)}%
                    </span>
                    <span className="text-xs text-slate-500 font-sans">Delay Risk Probability</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-200 dark:border-slate-800 text-xs space-y-1 font-sans">
                  <p className="text-slate-700 dark:text-slate-300">
                    Forecasted Slippage: <strong className="text-red-600 font-mono font-bold">+{simResult.predictedValue} Months</strong>
                  </p>
                  <p className="text-slate-700 dark:text-slate-300">
                    Forecasted Cost Exposure: <strong className="text-amber-600 font-mono font-bold">₹{simCostResult.predictedValue.toFixed(1)} Cr</strong>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
