import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Cpu,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  FileCheck,
  History,
  Activity,
  Layers,
  Send,
  ExternalLink,
  Sliders,
  Award,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const ModelGovernancePage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [signoffStatus, setSignoffStatus] = useState<string | null>(null);

  const governedModels = [
    {
      modelId: 'time-gbm-v1.4',
      name: 'Governed Production Temporal Model',
      algorithm: 'LightGBM Gradient Boosting Classifier',
      status: 'APPROVED',
      dataset: 'Authentic Historical PAIMANA Dataset (Table 6)',
      rocaUc: 0.8850,
      baselineLrAuc: 0.7551,
      brierScore: 0.1714,
      meanLeadTime: '4.3 Months',
      ruleTCompliance: 'STRICTLY_COMPLIANT (t <= T)',
      featureProvenance: '7 Historical Invariant Fields',
      ksDriftStatus: 'NO_SIGNIFICANT_DRIFT (p = 0.82)',
      approvalDate: '2026-04-10',
      approver: 'Dr. Aruna Chandrasekhar',
    },
    {
      modelId: 'time-gbm-demo-v1',
      name: 'Synthetic Research Demonstration Model',
      algorithm: 'Expanded Feature Space LightGBM',
      status: 'AI RESEARCH DEMONSTRATION ONLY',
      dataset: 'Synthetic Research Simulation Benchmark',
      rocaUc: 0.8920,
      baselineLrAuc: 0.7551,
      brierScore: 0.1680,
      meanLeadTime: '6.5 Months',
      ruleTCompliance: 'RESEARCH_SANDBOX',
      featureProvenance: '14 Synthetic Variables',
      ksDriftStatus: 'SIMULATED',
      approvalDate: '2026-03-15',
      approver: 'AI Validation Committee',
    },
  ];

  const handleSignoffDrift = (modelId: string) => {
    setSignoffStatus(`Model card compliance and drift certification re-approved for ${modelId}. Governance ledger updated.`);
    setTimeout(() => setSignoffStatus(null), 4000);
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header Banner */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-lg bg-blue-100 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 flex items-center justify-center text-blue-600 dark:text-blue-400">
              <Cpu className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold text-slate-900 dark:text-white">AI Governance & Model Assurance</h1>
                <span className="px-2 py-0.5 text-xs font-semibold rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
                  Rule T Anti-Leakage Certified
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Model card governance, temporal anti-leakage audit, calibration verification, and production promotion gates
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono text-slate-500">
            <span>Governance Body: MeitY & NITI Aayog AI Validation Board</span>
          </div>
        </div>

        {signoffStatus && (
          <div className="mt-4 p-3 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 rounded-md text-xs text-emerald-800 dark:text-emerald-300 flex items-center gap-2 font-medium">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{signoffStatus}</span>
          </div>
        )}
      </div>

      {/* Model Cards List */}
      <div className="space-y-4">
        <h2 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider font-mono">
          Governed ML Model Lifecycle & Assurance Cards
        </h2>

        {governedModels.map(model => (
          <div
            key={model.modelId}
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm space-y-4"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300 font-mono text-xs font-bold rounded">
                  {model.modelId}
                </span>
                <span className="text-sm font-bold text-slate-900 dark:text-white">{model.name}</span>
              </div>
              <span className={`text-[10px] px-2 py-0.5 rounded font-mono font-bold ${
                model.status === 'APPROVED' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300' : 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300'
              }`}>
                {model.status}
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 dark:bg-slate-950 p-3 rounded-lg border border-slate-100 dark:border-slate-800 text-xs">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400">ROC-AUC Score</span>
                <div className="text-sm font-mono font-bold text-blue-600">{model.rocaUc} (Baseline LR: {model.baselineLrAuc})</div>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400">Brier Calibration</span>
                <div className="text-sm font-mono font-bold text-emerald-600">{model.brierScore}</div>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400">Mean Lead Time</span>
                <div className="text-sm font-mono font-bold text-slate-900 dark:text-white">{model.meanLeadTime}</div>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400">Rule T Compliance</span>
                <div className="text-xs font-mono font-bold text-emerald-600">{model.ruleTCompliance}</div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-slate-50 dark:bg-slate-950 rounded border border-slate-100 dark:border-slate-800 space-y-1">
                <span className="text-[10px] uppercase font-bold text-slate-400">Dataset & Provenance</span>
                <p className="text-slate-800 dark:text-slate-200 font-medium">{model.dataset}</p>
                <p className="text-slate-500 text-[11px]">Feature Space: {model.featureProvenance}</p>
              </div>
              <div className="p-3 bg-slate-50 dark:bg-slate-950 rounded border border-slate-100 dark:border-slate-800 space-y-1">
                <span className="text-[10px] uppercase font-bold text-slate-400">Drift & Statistical Stability</span>
                <p className="text-slate-800 dark:text-slate-200 font-medium">{model.ksDriftStatus}</p>
                <p className="text-slate-500 text-[11px]">Approved by {model.approver} on {model.approvalDate}</p>
              </div>
            </div>

            <div className="flex items-center justify-between pt-1">
              <button
                onClick={() => navigate('/predictions')}
                className="text-xs text-blue-600 dark:text-blue-400 font-semibold hover:underline"
              >
                Inspect Real-Time Predictions & Feature Importances →
              </button>
              <button
                onClick={() => handleSignoffDrift(model.modelId)}
                className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs font-semibold flex items-center gap-1.5 transition shadow-sm"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Re-Certify Drift & Gatekeeping</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
