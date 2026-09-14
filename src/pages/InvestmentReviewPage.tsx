import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  TrendingUp,
  CheckCircle2,
  AlertTriangle,
  FolderKanban,
  FileCheck,
  BarChart3,
  Cpu,
  Layers,
  Download,
  Sliders,
  DollarSign,
  Calendar,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const InvestmentReviewPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [authorityType, setAuthorityType] = useState<'PIB' | 'DIB' | 'EFC' | 'SFC'>('PIB');
  const [inflationScenario, setInflationScenario] = useState<number>(5.5);
  const [idcScenario, setIdcScenario] = useState<number>(7.2);
  const [dossierGenerated, setDossierGenerated] = useState(false);

  const appraisalPackages = [
    {
      id: 'APP-2026-01',
      projectId: 'PAI-706775',
      name: 'BharatNet Project Phase-II (National Rural OFC)',
      originalSanction: 20117.0,
      revisedCostProposal: 61950.0,
      costGrowthPercent: 207.9,
      historicalPeerMeanOverrun: 42.4,
      modelPredictedFinalCost: 65420.0,
      scheduleOverrunMonths: 72,
      riskAdjustmentFactor: 1.18,
      recommendedCeiling: 62500.0,
      status: 'UNDER_PIB_SCRUTINY',
    },
    {
      id: 'APP-2026-02',
      projectId: 'PAI-619032',
      name: 'Greenfield Industrial Corridor Logistics Spur',
      originalSanction: 8400.0,
      revisedCostProposal: 11200.0,
      costGrowthPercent: 33.3,
      historicalPeerMeanOverrun: 38.0,
      modelPredictedFinalCost: 11580.0,
      scheduleOverrunMonths: 18,
      riskAdjustmentFactor: 1.05,
      recommendedCeiling: 11400.0,
      status: 'VIABLE_FOR_SANCTION',
    },
  ];

  const handleGenerateDossier = () => {
    setDossierGenerated(true);
    setTimeout(() => setDossierGenerated(false), 4000);
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header Banner */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-lg bg-blue-100 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 flex items-center justify-center text-blue-600 dark:text-blue-400">
              <TrendingUp className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold text-slate-900 dark:text-white">Investment Appraisal & Project Review</h1>
                <span className="px-2 py-0.5 text-xs font-semibold rounded bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300">
                  {authorityType} Authority Review Mode
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Predictive cost escalation envelope, schedule risk appraisal, and evidence packages for PIB / DIB / EFC / SFC
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500 font-medium">Appraisal Body:</span>
            <div className="flex items-center rounded-lg border border-slate-200 dark:border-slate-800 p-0.5 bg-slate-50 dark:bg-slate-950 text-xs font-bold">
              {(['PIB', 'DIB', 'EFC', 'SFC'] as const).map(mode => (
                <button
                  key={mode}
                  onClick={() => setAuthorityType(mode)}
                  className={`px-3 py-1 rounded-md transition ${
                    authorityType === mode
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                  }`}
                >
                  {mode}
                </button>
              ))}
            </div>
          </div>
        </div>

        {dossierGenerated && (
          <div className="mt-4 p-3 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 rounded-md text-xs text-emerald-800 dark:text-emerald-300 flex items-center gap-2 font-medium">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Risk-Adjusted Appraisal Evidence Dossier compiled and signed off for {authorityType} Committee.</span>
          </div>
        )}
      </div>

      {/* Scenario Sensitivity Analysis */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sliders className="w-4 h-4 text-blue-600" />
            <h2 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider font-mono">
              Appraisal Scenario Sensitivity Controls (IDC & Inflation)
            </h2>
          </div>
          <span className="text-xs text-slate-500 font-mono">Monte Carlo Stress Engine</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-3 bg-slate-50 dark:bg-slate-950 rounded-lg border border-slate-100 dark:border-slate-800 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-700 dark:text-slate-300">Annual Construction Inflation Assumption:</span>
              <span className="font-mono font-bold text-blue-600 dark:text-blue-400">{inflationScenario}%</span>
            </div>
            <input
              type="range"
              min="2.0"
              max="12.0"
              step="0.5"
              value={inflationScenario}
              onChange={e => setInflationScenario(parseFloat(e.target.value))}
              className="w-full accent-blue-600"
            />
          </div>

          <div className="p-3 bg-slate-50 dark:bg-slate-950 rounded-lg border border-slate-100 dark:border-slate-800 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-700 dark:text-slate-300">Interest During Construction (IDC) Rate:</span>
              <span className="font-mono font-bold text-blue-600 dark:text-blue-400">{idcScenario}%</span>
            </div>
            <input
              type="range"
              min="4.0"
              max="14.0"
              step="0.2"
              value={idcScenario}
              onChange={e => setIdcScenario(parseFloat(e.target.value))}
              className="w-full accent-blue-600"
            />
          </div>
        </div>
      </div>

      {/* Appraisal Packages */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider font-mono">
            Active Investment Appraisal Packages Under Scrutiny
          </h2>
          <button
            onClick={handleGenerateDossier}
            className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs font-semibold flex items-center gap-1.5 transition shadow-sm"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export {authorityType} Appraisal Dossier</span>
          </button>
        </div>

        {appraisalPackages.map(p => (
          <div
            key={p.id}
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm space-y-3"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300 font-mono text-xs font-bold rounded">
                  {p.id}
                </span>
                <span className="text-sm font-bold text-slate-900 dark:text-white">{p.name}</span>
              </div>
              <span className={`text-[10px] px-2 py-0.5 rounded font-mono font-bold ${
                p.status === 'VIABLE_FOR_SANCTION' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300' : 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300'
              }`}>
                {p.status}
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 dark:bg-slate-950 p-3 rounded-lg border border-slate-100 dark:border-slate-800 text-xs">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400">Original Sanction</span>
                <div className="text-sm font-mono font-bold text-slate-900 dark:text-white">₹{p.originalSanction.toLocaleString()} Cr</div>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400">Revised Proposal</span>
                <div className="text-sm font-mono font-bold text-rose-600">₹{p.revisedCostProposal.toLocaleString()} Cr (+{p.costGrowthPercent}%)</div>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400">AI Predicted Final Cost</span>
                <div className="text-sm font-mono font-bold text-blue-600">₹{p.modelPredictedFinalCost.toLocaleString()} Cr</div>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400">Recommended Ceiling</span>
                <div className="text-sm font-mono font-bold text-emerald-600">₹{p.recommendedCeiling.toLocaleString()} Cr</div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-1 text-[11px] text-slate-500 font-mono">
              <span>Peer Sector Overrun Baseline: {p.historicalPeerMeanOverrun}% • Schedule Delay: {p.scheduleOverrunMonths} Mos</span>
              <button
                onClick={() => navigate(`/projects/${p.projectId}`)}
                className="text-blue-600 dark:text-blue-400 font-semibold hover:underline"
              >
                Inspect Telemetry →
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
