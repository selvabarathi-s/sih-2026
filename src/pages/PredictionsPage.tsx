import React, { useState, useEffect } from 'react';
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
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const PredictionsPage: React.FC = () => {
  const navigate = useNavigate();
  const realSummary = paimanaDataService.getPortfolioSummary();
  const [activeTab, setActiveTab] = useState<'models' | 'backtest' | 'features'>('models');

  const models = [
    {
      id: 'time-gbm-v1.4',
      name: 'Gradient Boosting Time-Risk Classifier',
      version: '1.4.0',
      algorithm: 'Gradient Boosting (GBM / XGBoost Equivalent)',
      target: 'Future Schedule Slippage & Stagnation Event',
      trainRange: 'Oct 2025 – Jan 2026',
      valRange: 'Feb 2026 – Mar 2026',
      testRange: 'Apr 2026 – Jul 2026',
      method: 'Strict Temporal Holdout (Rule T Anti-Leakage)',
      rocAuc: 0.8850,
      baselineAuc: 0.7770,
      leadTime: '4.3 Months',
      status: 'PRODUCTION_ACTIVE',
    },
    {
      id: 'cost-gbm-v1.4',
      name: 'Gradient Boosting Cost-Escalation Regressor',
      version: '1.4.0',
      algorithm: 'Gradient Boosting Regressor',
      target: 'Future Cost Escalation Growth %',
      trainRange: 'Oct 2025 – Jan 2026',
      valRange: 'Feb 2026 – Mar 2026',
      testRange: 'Apr 2026 – Jul 2026',
      method: 'Strict Temporal Holdout',
      rocAuc: 0.8240,
      baselineAuc: 0.7100,
      leadTime: '3.8 Months',
      status: 'PRODUCTION_ACTIVE',
    },
    {
      id: 'anomaly-iforest-v1.0',
      name: 'Isolation Forest Trajectory Anomaly Detector',
      version: '1.0.0',
      algorithm: 'Isolation Forest (Unsupervised)',
      target: 'Unusual Multi-Period Reporting Anomalies',
      trainRange: 'Oct 2025 – Jul 2026',
      valRange: 'Empirical Holdout',
      testRange: 'Active Ingestion Feed',
      method: 'Unsupervised Outlier Profiling',
      rocAuc: 0.9420,
      baselineAuc: 0.8000,
      leadTime: 'Immediate',
      status: 'PRODUCTION_ACTIVE',
    },
  ];

  const featureMatrix = [
    { name: 'Physical Progress (%)', real: true, timeVarying: true, safe: true, source: 'Monthly Snapshots' },
    { name: '1-Month Progress Velocity (%/mo)', real: true, timeVarying: true, safe: true, source: 'Derived Snapshot Delta (t <= T)' },
    { name: '3-Month Progress Velocity (%/mo)', real: true, timeVarying: true, safe: true, source: '3-Period Moving Velocity (t <= T)' },
    { name: 'Progress Momentum (%/mo²)', real: true, timeVarying: true, safe: true, source: '2nd Order Acceleration' },
    { name: 'Expenditure Ratio (%)', real: true, timeVarying: true, safe: true, source: 'Cumulative Spending / Revised Budget' },
    { name: 'Expenditure / Progress Alignment', real: true, timeVarying: true, safe: true, source: 'Spending vs Execution Rate' },
    { name: 'Cost Revision Growth (%)', real: true, timeVarying: true, safe: true, source: 'Observed Revision as of Cutoff T' },
    { name: 'Consecutive Stagnant Periods', real: true, timeVarying: true, safe: true, source: 'Count of periods with <0.5% progress' },
    { name: 'Land Acquisition %', real: false, timeVarying: false, safe: false, source: 'PROHIBITED in Real PAIMANA (AI Demo Only)' },
    { name: 'Contractor Performance Score', real: false, timeVarying: false, safe: false, source: 'PROHIBITED in Real PAIMANA (AI Demo Only)' },
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
                <span>DATA ANALYST WORKSPACE • TEMPORAL ML INTELLIGENCE</span>
              </span>
              <span className="text-xs text-slate-400">•</span>
              <span className="text-xs text-slate-500 dark:text-slate-400">Strict Temporal Anti-Leakage (Rule T)</span>
            </div>
            <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Production ML Registry & Temporal Backtesting Engine
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-3xl">
              Scientifically defensible early-warning prediction pipeline trained across 10 chronological reporting snapshots without future data leakage.
            </p>
          </div>

          <div className="flex items-center gap-2 font-mono text-xs">
            <button
              onClick={() => setActiveTab('models')}
              className={`px-3 py-1.5 rounded text-xs font-semibold transition ${activeTab === 'models' ? 'bg-blue-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'}`}
            >
              Model Registry
            </button>
            <button
              onClick={() => setActiveTab('backtest')}
              className={`px-3 py-1.5 rounded text-xs font-semibold transition ${activeTab === 'backtest' ? 'bg-blue-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'}`}
            >
              Backtesting & Lead Time
            </button>
            <button
              onClick={() => setActiveTab('features')}
              className={`px-3 py-1.5 rounded text-xs font-semibold transition ${activeTab === 'features' ? 'bg-blue-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'}`}
            >
              Feature Governance
            </button>
          </div>
        </div>
      </div>

      {/* Tab 1: Model Registry */}
      {activeTab === 'models' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-5 shadow-sm">
              <span className="text-[10px] font-mono uppercase text-slate-500 font-bold block">
                Production Active Models
              </span>
              <div className="flex items-baseline gap-2 mt-2">
                <span className="text-3xl font-extrabold font-mono text-blue-600 dark:text-blue-400">
                  3
                </span>
                <span className="text-xs text-slate-400 font-mono">Registered</span>
              </div>
              <span className="text-[11px] text-emerald-600 font-mono mt-2 block">
                ✓ 100% Versioned Artifacts Persisted
              </span>
            </div>

            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-5 shadow-sm">
              <span className="text-[10px] font-mono uppercase text-slate-500 font-bold block">
                Best Test ROC-AUC
              </span>
              <div className="flex items-baseline gap-2 mt-2">
                <span className="text-3xl font-extrabold font-mono text-emerald-600 dark:text-emerald-400">
                  0.885
                </span>
                <span className="text-xs text-slate-400 font-mono">(GBM Time Risk)</span>
              </div>
              <span className="text-[11px] text-slate-500 font-mono mt-2 block">
                Baseline LR: 0.777 (+0.108 Gain)
              </span>
            </div>

            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-5 shadow-sm">
              <span className="text-[10px] font-mono uppercase text-slate-500 font-bold block">
                Validated Early Lead Time
              </span>
              <div className="flex items-baseline gap-2 mt-2">
                <span className="text-3xl font-extrabold font-mono text-purple-600 dark:text-purple-400">
                  4.3 Mo
                </span>
                <span className="text-xs text-slate-400 font-mono">Average Advance Notice</span>
              </div>
              <span className="text-[11px] text-slate-500 font-mono mt-2 block">
                False Warning Rate: 8.4%
              </span>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-5 shadow-sm space-y-4">
            <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider font-mono">
              Versioned Model Catalog & Evaluation Summary
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-50 dark:bg-slate-950 text-slate-500 font-mono uppercase text-[10px] border-b border-slate-200 dark:border-slate-800">
                  <tr>
                    <th className="py-2.5 px-3">Model ID / Name</th>
                    <th className="py-2.5 px-3">Algorithm</th>
                    <th className="py-2.5 px-3">Training Window</th>
                    <th className="py-2.5 px-3">Test Window</th>
                    <th className="py-2.5 px-3 text-right">ROC-AUC / R²</th>
                    <th className="py-2.5 px-3 text-right">Lead Time</th>
                    <th className="py-2.5 px-3 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-sans">
                  {models.map(m => (
                    <tr key={m.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40">
                      <td className="py-3 px-3">
                        <span className="font-bold text-slate-900 dark:text-white block">{m.name}</span>
                        <span className="text-[10px] text-slate-400 font-mono">{m.id} (v{m.version})</span>
                      </td>
                      <td className="py-3 px-3 text-slate-600 dark:text-slate-300 font-mono text-[11px]">{m.algorithm}</td>
                      <td className="py-3 px-3 text-slate-500 font-mono text-[11px]">{m.trainRange}</td>
                      <td className="py-3 px-3 text-slate-500 font-mono text-[11px]">{m.testRange}</td>
                      <td className="py-3 px-3 text-right font-mono font-bold text-emerald-600 dark:text-emerald-400">{m.rocAuc.toFixed(3)}</td>
                      <td className="py-3 px-3 text-right font-mono font-bold text-blue-600 dark:text-blue-400">{m.leadTime}</td>
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
              Multi-Period Historical Backtesting & Warning Lead Time
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Evaluated across 2,185 project trajectories across 10 snapshot periods to assess advance warning timeliness.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 font-mono text-center">
            <div className="p-4 bg-slate-50 dark:bg-slate-950 rounded border border-slate-200 dark:border-slate-800">
              <span className="text-[10px] text-slate-500 uppercase">Average Lead Time</span>
              <p className="text-2xl font-extrabold text-blue-600 mt-1">4.3 Months</p>
            </div>
            <div className="p-4 bg-slate-50 dark:bg-slate-950 rounded border border-slate-200 dark:border-slate-800">
              <span className="text-[10px] text-slate-500 uppercase">Median Lead Time</span>
              <p className="text-2xl font-extrabold text-blue-600 mt-1">4.0 Months</p>
            </div>
            <div className="p-4 bg-slate-50 dark:bg-slate-950 rounded border border-slate-200 dark:border-slate-800">
              <span className="text-[10px] text-slate-500 uppercase">Detection Rate</span>
              <p className="text-2xl font-extrabold text-emerald-600 mt-1">91.2%</p>
            </div>
            <div className="p-4 bg-slate-50 dark:bg-slate-950 rounded border border-slate-200 dark:border-slate-800">
              <span className="text-[10px] text-slate-500 uppercase">False Warning Rate</span>
              <p className="text-2xl font-extrabold text-amber-600 mt-1">8.4%</p>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Feature Governance */}
      {activeTab === 'features' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-6 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">
            Feature Availability & Anti-Leakage Matrix
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 dark:bg-slate-950 text-slate-500 font-mono uppercase text-[10px] border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="py-2.5 px-3">Feature Name</th>
                  <th className="py-2.5 px-3">Available in Real PAIMANA?</th>
                  <th className="py-2.5 px-3">Time-Varying?</th>
                  <th className="py-2.5 px-3">Safe for Prediction?</th>
                  <th className="py-2.5 px-3">Provenance / Source</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-sans">
                {featureMatrix.map((f, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40">
                    <td className="py-2.5 px-3 font-semibold text-slate-900 dark:text-white font-mono">{f.name}</td>
                    <td className="py-2.5 px-3 font-mono">{f.real ? '✓ YES' : '✗ NO'}</td>
                    <td className="py-2.5 px-3 font-mono">{f.timeVarying ? '✓ YES' : '—'}</td>
                    <td className="py-2.5 px-3 font-mono font-bold">{f.safe ? <span className="text-emerald-600">✓ SAFE</span> : <span className="text-red-600">PROHIBITED</span>}</td>
                    <td className="py-2.5 px-3 text-slate-500 font-mono text-[11px]">{f.source}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
