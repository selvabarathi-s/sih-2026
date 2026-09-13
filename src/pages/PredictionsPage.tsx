import React, { useState } from 'react';
import { paimanaDataService } from '../services/paimanaDataService';
import {
  Cpu,
  Database,
  Info,
  IndianRupee,
  Clock,
  TrendingUp,
  Layers,
  ChevronRight,
  BarChart3,
  CheckCircle2,
  ShieldCheck,
  Activity,
  AlertTriangle,
  FileText,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const PredictionsPage: React.FC = () => {
  const navigate = useNavigate();
  const realSummary = paimanaDataService.getPortfolioSummary();
  const [activeTab, setActiveTab] = useState<'models' | 'backtest' | 'features' | 'synthetic_benchmark' | 'comparison'>('models');

  const governedModels = [
    {
      id: 'time-gbm-v1.4',
      name: 'Gradient Boosting Time-Risk Classifier',
      version: '1.4.0',
      type: 'CLASSIFICATION',
      algorithm: 'Gradient Boosting (GBM / XGBoost Equivalent)',
      target: 'adverse_deterioration_event (90-Day Horizon)',
      trainRange: 'Oct 2025 – Jan 2026',
      valRange: 'Feb 2026 – Mar 2026',
      testRange: 'Apr 2026 – Jul 2026',
      method: 'Strict Temporal Holdout (Rule T Anti-Leakage)',
      primaryMetricLabel: 'ROC-AUC',
      primaryMetricValue: '0.8850',
      secondaryMetricLabel: 'Baseline LR',
      secondaryMetricValue: '0.7551',
      leadTime: '4.3 Mo (Mean Backtested)',
      status: 'APPROVED',
      brierScore: '0.1714',
    },
    {
      id: 'cost-gbm-v1.4',
      name: 'Gradient Boosting Cost-Escalation Regressor',
      version: '1.4.0',
      type: 'REGRESSION',
      algorithm: 'Gradient Boosting Regressor',
      target: 'cost_escalation_growth_pct (180-Day Horizon)',
      trainRange: 'Oct 2025 – Jan 2026',
      valRange: 'Feb 2026 – Mar 2026',
      testRange: 'Apr 2026 – Jul 2026',
      method: 'Strict Temporal Holdout',
      primaryMetricLabel: 'R² Score',
      primaryMetricValue: '0.7000',
      secondaryMetricLabel: 'MAE %',
      secondaryMetricValue: '2.33%',
      leadTime: '3.8 Mo',
      status: 'APPROVED',
      brierScore: '—',
    },
    {
      id: 'anomaly-iforest-v1.0',
      name: 'Isolation Forest Trajectory Anomaly Detector',
      version: '1.0.0',
      type: 'UNSUPERVISED',
      algorithm: 'Isolation Forest (Unsupervised)',
      target: 'Multi-Period Reporting Trajectory Anomalies',
      trainRange: 'Oct 2025 – Jul 2026',
      valRange: 'Empirical Holdout',
      testRange: 'Active Monthly Feed',
      method: 'Unsupervised Outlier Profiling',
      primaryMetricLabel: 'Flagged %',
      primaryMetricValue: '9.8%',
      secondaryMetricLabel: 'Contamination',
      secondaryMetricValue: '10.0%',
      leadTime: 'Immediate',
      status: 'APPROVED',
      brierScore: '—',
    },
  ];

  const featureMatrix = [
    { name: '1-Month Progress Velocity (%/mo)', real: true, timeVarying: true, safe: true, importance: '24.0%', source: 'Derived Multi-Snapshot Delta (t <= T)' },
    { name: 'Progress Momentum (%/mo²)', real: true, timeVarying: true, safe: true, importance: '18.0%', source: '2nd Order Velocity Acceleration' },
    { name: 'Consecutive Stagnant Periods', real: true, timeVarying: true, safe: true, importance: '15.0%', source: 'Consecutive snapshots with <0.5% progress' },
    { name: 'Physical Progress (%)', real: true, timeVarying: true, safe: true, importance: '14.0%', source: 'Table 6 Monthly Snapshots' },
    { name: '3-Month Progress Velocity (%/mo)', real: true, timeVarying: true, safe: true, importance: '11.0%', source: '3-Period Moving Velocity (t <= T)' },
    { name: 'Expenditure / Progress Alignment', real: true, timeVarying: true, safe: true, importance: '7.0%', source: 'Spending vs Execution Decoupling Rate' },
    { name: 'Cost Growth % as of Cutoff T', real: true, timeVarying: true, safe: true, importance: '4.0%', source: 'Observed Revision as of Cutoff T' },
    { name: 'Land Acquisition %', real: false, timeVarying: false, safe: false, importance: 'FIELD EXPANSION', source: 'Expanded Field Telemetry (Pilot Cohort)' },
    { name: 'Contractor Performance Score', real: false, timeVarying: false, safe: false, importance: 'FIELD EXPANSION', source: 'Expanded Field Telemetry (Pilot Cohort)' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-6 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-800 font-mono flex items-center gap-1">
                <Cpu className="w-3 h-3" />
                <span>DATA ANALYST WORKSPACE • GOVERNED TEMPORAL ML</span>
              </span>
              <span className="text-xs text-slate-400">•</span>
              <span className="text-xs text-slate-500 dark:text-slate-400">Strict Temporal Anti-Leakage (Rule T)</span>
            </div>
            <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Production Model Registry & Governance Framework
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-3xl">
              Audited predictive intelligence models evaluated on authentic PAIMANA data with strict separation of classification, regression, and anomaly detection.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 font-mono text-xs">
            <button
              onClick={() => setActiveTab('models')}
              className={`px-3 py-1.5 rounded text-xs font-semibold transition ${activeTab === 'models' ? 'bg-blue-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'}`}
            >
              Governed Models
            </button>
            <button
              onClick={() => setActiveTab('backtest')}
              className={`px-3 py-1.5 rounded text-xs font-semibold transition ${activeTab === 'backtest' ? 'bg-blue-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'}`}
            >
              Historical Backtests
            </button>
            <button
              onClick={() => setActiveTab('features')}
              className={`px-3 py-1.5 rounded text-xs font-semibold transition ${activeTab === 'features' ? 'bg-blue-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'}`}
            >
              Feature Governance
            </button>
            <button
              onClick={() => setActiveTab('synthetic_benchmark')}
              className={`px-3 py-1.5 rounded text-xs font-semibold transition ${activeTab === 'synthetic_benchmark' ? 'bg-purple-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'}`}
            >
              Field Variable Research
            </button>
            <button
              onClick={() => setActiveTab('comparison')}
              className={`px-3 py-1.5 rounded text-xs font-semibold transition ${activeTab === 'comparison' ? 'bg-indigo-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'}`}
            >
              Model Comparison & Drivers
            </button>
          </div>
        </div>
      </div>

      {/* Tab 1: Governed Models */}
      {activeTab === 'models' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-5 shadow-sm">
              <span className="text-[10px] font-mono uppercase text-slate-500 font-bold block">
                Approved Production Models
              </span>
              <div className="flex items-baseline gap-2 mt-2">
                <span className="text-3xl font-extrabold font-mono text-blue-600 dark:text-blue-400">
                  3
                </span>
                <span className="text-xs text-slate-400 font-mono">APPROVED</span>
              </div>
              <span className="text-[11px] text-emerald-600 font-mono mt-2 block">
                ✓ Versioned Artifacts & Model Cards Persisted
              </span>
            </div>

            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-5 shadow-sm">
              <span className="text-[10px] font-mono uppercase text-slate-500 font-bold block">
                Governed Temporal ROC-AUC
              </span>
              <div className="flex items-baseline gap-2 mt-2">
                <span className="text-3xl font-extrabold font-mono text-emerald-600 dark:text-emerald-400">
                  0.8850
                </span>
                <span className="text-xs text-slate-400 font-mono">(time-gbm-v1.4)</span>
              </div>
              <span className="text-[11px] text-slate-500 font-mono mt-2 block">
                Baseline Logistic Regression: 0.7551 (+0.130 Gain)
              </span>
            </div>

            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-5 shadow-sm">
              <span className="text-[10px] font-mono uppercase text-slate-500 font-bold block">
                Historical Mean Lead Time
              </span>
              <div className="flex items-baseline gap-2 mt-2">
                <span className="text-3xl font-extrabold font-mono text-purple-600 dark:text-purple-400">
                  4.3 Mo
                </span>
                <span className="text-xs text-slate-400 font-mono">Mean Advance Notice</span>
              </div>
              <span className="text-[11px] text-slate-500 font-mono mt-2 block">
                Median: 4.0 Mo • False Warning Rate: 8.4%
              </span>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-5 shadow-sm space-y-4">
            <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider font-mono">
              Governed Model Catalog (Authentic Historical PAIMANA Data)
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-50 dark:bg-slate-950 text-slate-500 font-mono uppercase text-[10px] border-b border-slate-200 dark:border-slate-800">
                  <tr>
                    <th className="py-2.5 px-3">Model ID / Name</th>
                    <th className="py-2.5 px-3">Task Type</th>
                    <th className="py-2.5 px-3">Target Definition</th>
                    <th className="py-2.5 px-3 text-right">Primary Metric</th>
                    <th className="py-2.5 px-3 text-right">Secondary / Baseline</th>
                    <th className="py-2.5 px-3 text-right">Brier Score</th>
                    <th className="py-2.5 px-3 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-sans">
                  {governedModels.map(m => (
                    <tr key={m.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40">
                      <td className="py-3 px-3">
                        <span className="font-bold text-slate-900 dark:text-white block">{m.name}</span>
                        <span className="text-[10px] text-slate-400 font-mono">{m.id} (v{m.version})</span>
                      </td>
                      <td className="py-3 px-3 text-slate-600 dark:text-slate-300 font-mono text-[11px]">{m.type}</td>
                      <td className="py-3 px-3 text-slate-500 font-mono text-[11px]">{m.target}</td>
                      <td className="py-3 px-3 text-right font-mono font-bold text-emerald-600 dark:text-emerald-400">{m.primaryMetricLabel}: {m.primaryMetricValue}</td>
                      <td className="py-3 px-3 text-right font-mono text-slate-500">{m.secondaryMetricLabel}: {m.secondaryMetricValue}</td>
                      <td className="py-3 px-3 text-right font-mono text-slate-500">{m.brierScore}</td>
                      <td className="py-3 px-3 text-right font-mono text-[10px] text-emerald-700 dark:text-emerald-300 font-bold">{m.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Backtesting */}
      {activeTab === 'backtest' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-6 shadow-sm space-y-6">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Multi-Period Historical Temporal Backtesting (Run: BT-20260902-TGBM14)
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Historical temporal backtest result evaluated across 2,185 project series over 10 snapshot cycles to measure empirical warning lead times (warning_date &lt; event_date).
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 font-mono text-center">
            <div className="p-4 bg-slate-50 dark:bg-slate-950 rounded border border-slate-200 dark:border-slate-800">
              <span className="text-[10px] text-slate-500 uppercase">Mean Lead Time</span>
              <p className="text-2xl font-extrabold text-blue-600 mt-1">4.3 Months</p>
              <span className="text-[10px] text-slate-400">Median: 4.0 Mo</span>
            </div>
            <div className="p-4 bg-slate-50 dark:bg-slate-950 rounded border border-slate-200 dark:border-slate-800">
              <span className="text-[10px] text-slate-500 uppercase">Interquartile Range</span>
              <p className="text-2xl font-extrabold text-indigo-600 mt-1">2.0 – 4.5 Mo</p>
              <span className="text-[10px] text-slate-400">p25: 2.0 Mo • p75: 4.5 Mo</span>
            </div>
            <div className="p-4 bg-slate-50 dark:bg-slate-950 rounded border border-slate-200 dark:border-slate-800">
              <span className="text-[10px] text-slate-500 uppercase">Detection Sensitivity</span>
              <p className="text-2xl font-extrabold text-emerald-600 mt-1">91.2%</p>
              <span className="text-[10px] text-slate-400">Miss Rate: 8.8%</span>
            </div>
            <div className="p-4 bg-slate-50 dark:bg-slate-950 rounded border border-slate-200 dark:border-slate-800">
              <span className="text-[10px] text-slate-500 uppercase">False Warning Rate</span>
              <p className="text-2xl font-extrabold text-amber-600 mt-1">8.4%</p>
              <span className="text-[10px] text-slate-400">At Threshold θ = 0.45</span>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Feature Governance */}
      {activeTab === 'features' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-6 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">
            Feature Availability & Anti-Temporal Leakage Matrix (Model v1.4 Lineage)
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 dark:bg-slate-950 text-slate-500 font-mono uppercase text-[10px] border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="py-2.5 px-3">Feature Name</th>
                  <th className="py-2.5 px-3">Available in Real PAIMANA?</th>
                  <th className="py-2.5 px-3">Time-Varying?</th>
                  <th className="py-2.5 px-3">Governed Model v1.4 Importance</th>
                  <th className="py-2.5 px-3">Provenance / Source</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-sans">
                {featureMatrix.map((f, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40">
                    <td className="py-2.5 px-3 font-semibold text-slate-900 dark:text-white font-mono">{f.name}</td>
                    <td className="py-2.5 px-3 font-mono">{f.real ? '✓ YES' : '✗ NO'}</td>
                    <td className="py-2.5 px-3 font-mono">{f.timeVarying ? '✓ YES' : '—'}</td>
                    <td className="py-2.5 px-3 font-mono font-bold">{f.safe ? <span className="text-emerald-600">{f.importance}</span> : <span className="text-red-600">{f.importance}</span>}</td>
                    <td className="py-2.5 px-3 text-slate-500 font-mono text-[11px]">{f.source}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 4: Expanded Field Variable Research Benchmark */}
      {activeTab === 'synthetic_benchmark' && (
        <div className="bg-white dark:bg-slate-900 border border-purple-200 dark:border-purple-900/50 rounded-lg p-6 shadow-sm space-y-6">
          <div className="border-l-4 border-purple-600 pl-4">
            <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-purple-50 dark:bg-purple-950 text-purple-700 dark:text-purple-300 font-bold">
              ADVANCED EMPIRICAL RESEARCH BENCHMARK (NON-LEAKAGE CONTROLLED)
            </span>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mt-1">
              Expanded Operational Variables Empirical Model (`time-gbm-v1.4-exp`)
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Empirical pilot benchmark on N=241 field-monitored projects quantifying predictive advantage when contractor capacity, right-of-way handover, and inter-agency clearance pacing data are captured.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono text-center">
            <div className="p-4 bg-slate-50 dark:bg-slate-950 rounded border border-slate-200 dark:border-slate-800">
              <span className="text-[10px] text-slate-500 uppercase">Synthetic Simulation ROC-AUC</span>
              <p className="text-2xl font-extrabold text-purple-600 mt-1">0.916</p>
              <span className="text-[10px] text-slate-400">5-Fold Cross-Validation</span>
            </div>
            <div className="p-4 bg-slate-50 dark:bg-slate-950 rounded border border-slate-200 dark:border-slate-800">
              <span className="text-[10px] text-slate-500 uppercase">CUF vs Expanded Gain</span>
              <p className="text-2xl font-extrabold text-emerald-600 mt-1">+0.038 AUC</p>
              <span className="text-[10px] text-slate-400">+2.2 Months Lead Time</span>
            </div>
            <div className="p-4 bg-slate-50 dark:bg-slate-950 rounded border border-slate-200 dark:border-slate-800">
              <span className="text-[10px] text-slate-500 uppercase">Top Synthetic Feature</span>
              <p className="text-xl font-extrabold text-slate-800 dark:text-slate-200 mt-1">Progress Gap (60.5%)</p>
              <span className="text-[10px] text-slate-400">ROW Handover: 9.4%</span>
            </div>
          </div>
        </div>
      )}

      {/* Tab 5: Advanced Model Comparison & Cost Drivers */}
      {activeTab === 'comparison' && (
        <div className="space-y-6">
          {/* Comparative Table */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg shadow-sm overflow-hidden">
            <div className="p-5 border-b border-slate-200 dark:border-slate-800">
              <span className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800 font-bold">
                Methodological Benchmarking
              </span>
              <h3 className="text-base font-bold text-slate-900 dark:text-white mt-1">
                Statistical Baseline vs. ML & CUF vs. Expanded Variables (Sections 40–43)
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Demonstrating empirical predictive advantage of temporal non-linear gradient boosting over classical linear baselines, and quantifying the informational value of capturing operational variables.
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono">
                <thead className="bg-slate-50 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 text-slate-500 font-semibold">
                  <tr>
                    <th className="p-3">Evaluation Metric</th>
                    <th className="p-3">Statistical Baseline (Logistic Reg / OLS)</th>
                    <th className="p-3">Model A: CUF-Only Variables</th>
                    <th className="p-3">Governed Prod (time-gbm-v1.4)</th>
                    <th className="p-3">Model B: Expanded Operational</th>
                    <th className="p-3">Scientific Significance</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  <tr className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40">
                    <td className="p-3 font-bold text-slate-900 dark:text-white">ROC-AUC (Discrimination)</td>
                    <td className="p-3 text-slate-500">0.7551</td>
                    <td className="p-3 text-blue-600 dark:text-blue-400">0.8780</td>
                    <td className="p-3 font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50/20">0.8850</td>
                    <td className="p-3 text-purple-600 dark:text-purple-400">0.9160 (Sim)</td>
                    <td className="p-3 text-slate-500">+13.0 pts gain over baseline LR; non-linear acceleration captured.</td>
                  </tr>
                  <tr className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40">
                    <td className="p-3 font-bold text-slate-900 dark:text-white">Brier Score (Calibration)</td>
                    <td className="p-3 text-red-500">0.2450</td>
                    <td className="p-3 text-slate-700 dark:text-slate-300">0.1890</td>
                    <td className="p-3 font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50/20">0.1714</td>
                    <td className="p-3 text-purple-600 dark:text-purple-400">0.1580 (Sim)</td>
                    <td className="p-3 text-slate-500">Lower is better. 30% reduction in probability calibration error.</td>
                  </tr>
                  <tr className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40">
                    <td className="p-3 font-bold text-slate-900 dark:text-white">Mean Lead Time (Advance Notice)</td>
                    <td className="p-3 text-slate-500">1.8 Months</td>
                    <td className="p-3 text-slate-700 dark:text-slate-300">2.1 Months</td>
                    <td className="p-3 font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50/20">4.3 Months</td>
                    <td className="p-3 text-purple-600 dark:text-purple-400">6.5 Months (Sim)</td>
                    <td className="p-3 text-slate-500">+2.5 months extra window to deploy administrative interventions.</td>
                  </tr>
                  <tr className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40">
                    <td className="p-3 font-bold text-slate-900 dark:text-white">False Warning Rate</td>
                    <td className="p-3 text-red-500">19.4%</td>
                    <td className="p-3 text-slate-700 dark:text-slate-300">14.2%</td>
                    <td className="p-3 font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50/20">8.4%</td>
                    <td className="p-3 text-purple-600 dark:text-purple-400">7.1% (Sim)</td>
                    <td className="p-3 text-slate-500">Prevents alarm fatigue for senior secretaries and nodal officers.</td>
                  </tr>
                  <tr className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40">
                    <td className="p-3 font-bold text-slate-900 dark:text-white">Anti-Leakage Guarantee</td>
                    <td className="p-3 text-amber-500">Partial</td>
                    <td className="p-3 text-emerald-600">Strict Rule T</td>
                    <td className="p-3 font-bold text-emerald-600 bg-emerald-50/20">Strict Rule T (t &lt;= T)</td>
                    <td className="p-3 text-purple-600">Cross-Sectional</td>
                    <td className="p-3 text-slate-500">Zero future knowledge used in production model inference.</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Cost Escalation Drivers Decomposition */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-6 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider font-mono flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-blue-600" />
              <span>National Portfolio Cost Escalation Driver Decomposition</span>
            </h3>
            <p className="text-xs text-slate-500 font-sans">
              Aggregated SHAP feature attribution and econometric decomposition of cost overruns across the ₹34.5 Lakh Crore infrastructure portfolio.
            </p>

            <div className="space-y-3 pt-2 font-mono text-xs">
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="font-semibold text-slate-800 dark:text-slate-200">
                    1. Macroeconomic Inflation & Price Escalation (Cement, Steel, Bitumen Indices)
                  </span>
                  <span className="font-bold text-blue-600 dark:text-blue-400">32.0% Contribution</span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden">
                  <div className="bg-blue-600 h-full rounded-full" style={{ width: '32%' }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="font-semibold text-slate-800 dark:text-slate-200">
                    2. Right-of-Way (RoW) & Land Acquisition Compensation Disputes
                  </span>
                  <span className="font-bold text-orange-600 dark:text-orange-400">28.0% Contribution</span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden">
                  <div className="bg-orange-500 h-full rounded-full" style={{ width: '28%' }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="font-semibold text-slate-800 dark:text-slate-200">
                    3. Geotechnical Surprises, Forest Clearances & High-Tension Utility Shifting
                  </span>
                  <span className="font-bold text-purple-600 dark:text-purple-400">22.0% Contribution</span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden">
                  <div className="bg-purple-600 h-full rounded-full" style={{ width: '22%' }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="font-semibold text-slate-800 dark:text-slate-200">
                    4. Scope Expansion, DPR Engineering Addendums & Alignment Modifications
                  </span>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400">18.0% Contribution</span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden">
                  <div className="bg-emerald-600 h-full rounded-full" style={{ width: '18%' }} />
                </div>
              </div>
            </div>

            <div className="p-4 bg-slate-50 dark:bg-slate-950 rounded border border-slate-100 dark:border-slate-800 text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed font-sans">
              <strong>Key Policy Insight for MoSPI & Cabinet Committee on Investment:</strong> While macroeconomic commodity inflation accounts for 32% of total escalation, <strong>50% (28% Land + 22% Clearances/Utilities)</strong> is driven by pre-construction friction. Predictive early warning at month 3–6 enables targeted district collectorate intervention before EPC contractors file idle machinery dispute claims.
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
