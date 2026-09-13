import React, { useState } from 'react';
import { Award, ShieldAlert, CheckCircle, FileText, Cpu, AlertTriangle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { ProvenanceBadge } from '../components/common/ProvenanceBadge';

export const ModelGovernancePage: React.FC = () => {
  const { user } = useAuth();
  const [modelApproved, setModelApproved] = useState(true);
  const [driftSignedOff, setDriftSignedOff] = useState(true);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
        <div className="flex items-center gap-3">
          <span className="p-2 bg-purple-50 dark:bg-purple-950/50 text-purple-600 dark:text-purple-400 rounded-lg">
            <Award className="w-6 h-6" />
          </span>
          <div>
            <h1 className="text-xl font-bold text-slate-900 dark:text-white">AI Governance & Model Assurance Certification</h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {user?.fullName || 'AI Governance Officer'} • MeitY AI Ethics & Validation Committee • Model Cards & Rule T Compliance
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <ProvenanceBadge type="PREDICTED" label="Governed Production Model" />
        </div>
      </div>

      {/* Verification Card */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-slate-800 p-5 rounded-xl border border-slate-200 dark:border-slate-700">
          <span className="text-xs font-semibold text-slate-500 uppercase">Governed Production Model</span>
          <p className="text-lg font-bold text-slate-900 dark:text-white mt-1">Time-GBM v1.4</p>
          <div className="mt-3 space-y-1 text-xs text-slate-600 dark:text-slate-300 font-mono">
            <div>ROC-AUC: <span className="font-bold text-emerald-600">0.8850</span></div>
            <div>Brier Score: <span className="font-bold text-blue-600">0.1714</span></div>
            <div>Lead Time: <span className="font-bold text-purple-600">4.3 Months</span></div>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-700 flex items-center justify-between">
            <span className="text-xs text-emerald-600 font-bold flex items-center gap-1">
              <CheckCircle className="w-4 h-4" />
              STATUS: APPROVED
            </span>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 p-5 rounded-xl border border-slate-200 dark:border-slate-700">
          <span className="text-xs font-semibold text-slate-500 uppercase">Temporal Anti-Leakage (Rule T)</span>
          <p className="text-lg font-bold text-emerald-600 mt-1">100% Verified</p>
          <p className="text-xs text-slate-500 mt-2">
            Strict adherence: At observation time $t$, features only use telemetry prior to $t$. Zero future state contamination.
          </p>
          <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-700 text-xs text-slate-400">
            Certificate ID: MEITY-AIGOV-2026-RULE-T-PASS
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 p-5 rounded-xl border border-slate-200 dark:border-slate-700 flex flex-col justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-500 uppercase">Concept Drift Assurance</span>
            <p className="text-lg font-bold text-slate-900 dark:text-white mt-1">PSI = 0.042 (Stable)</p>
            <p className="text-xs text-slate-500 mt-2">
              Population Stability Index within statutory limits (&lt; 0.10). No significant distribution shift.
            </p>
          </div>
          <button
            onClick={() => setDriftSignedOff(true)}
            className="w-full py-2 bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold rounded-lg mt-4 transition"
          >
            {driftSignedOff ? '✓ Drift Formally Signed-Off' : 'Sign-Off Monthly Drift Audit'}
          </button>
        </div>
      </div>
    </div>
  );
};
