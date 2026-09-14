import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  TrendingUp,
  CheckCircle2,
  AlertTriangle,
  FolderKanban,
  FileCheck,
  BarChart3,
  DollarSign,
  Activity,
  Send,
  PieChart,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const FinancialReviewPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [notice, setNotice] = useState<string | null>(null);

  const rceCases = [
    {
      id: 'RCE-2026-88',
      projectId: 'PAI-706775',
      name: 'BharatNet Project Phase-II (National Rural OFC)',
      sanctionedCost: 20117.0,
      revisedCost: 61950.0,
      cumulativeExp: 21850.0,
      physicalProgress: 88.0,
      financialProgressPercent: 108.6,
      decouplingStatus: 'CRITICAL_DECOUPLING',
      macroDriver: 'Underestimated OFC Aerial Cable Terrain Length (+42%) & Commodity Price Surges',
      status: 'UNDER_IFD_AUDIT',
    },
    {
      id: 'RCE-2026-92',
      projectId: 'PAI-619032',
      name: 'Western Dedicated Freight Corridor (Phase-II)',
      sanctionedCost: 51200.0,
      revisedCost: 81400.0,
      cumulativeExp: 58200.0,
      physicalProgress: 74.5,
      financialProgressPercent: 71.5,
      decouplingStatus: 'NORMAL_CORRELATION',
      macroDriver: 'Land Acquisition Compensation Revision (2013 LARR Act Arbitration Awards)',
      status: 'APPROVED_WITH_CONDITIONS',
    },
  ];

  const handleAuditSignoff = (id: string) => {
    setNotice(`Fiscal scrutiny signoff completed for ${id}. Dispatched to Ministry of Finance IFD register.`);
    setTimeout(() => setNotice(null), 4000);
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
                <h1 className="text-xl font-bold text-slate-900 dark:text-white">Financial Review & Capital Outlay</h1>
                <span className="px-2 py-0.5 text-xs font-semibold rounded bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300">
                  IFD & Financial Review Authority
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Macro portfolio fiscal exposure, physical-financial decoupling diagnostics, and RCE expenditure audit
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono text-slate-500">
            <span>Capital Envelope: ₹42.78L Cr</span>
          </div>
        </div>

        {notice && (
          <div className="mt-4 p-3 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 rounded-md text-xs text-emerald-800 dark:text-emerald-300 flex items-center gap-2 font-medium">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{notice}</span>
          </div>
        )}
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-4">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">National Envelope</span>
          <div className="text-2xl font-bold text-slate-900 dark:text-white mt-1">₹42.78L Cr</div>
          <span className="text-[11px] text-slate-500">Across 1,981 Projects</span>
        </div>
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-4">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Total Cost Overrun</span>
          <div className="text-2xl font-bold text-rose-600 dark:text-rose-400 mt-1">₹5.65L Cr</div>
          <span className="text-[11px] text-rose-600 font-semibold">+15.24% Net Portfolio Expansion</span>
        </div>
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-4">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Decoupled Projects</span>
          <div className="text-2xl font-bold text-amber-600 dark:text-amber-400 mt-1">84 Projects</div>
          <span className="text-[11px] text-amber-600 font-medium">Fund burn &gt; Physical Progress</span>
        </div>
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-4">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Pending RCE Cases</span>
          <div className="text-2xl font-bold text-blue-600 dark:text-blue-400 mt-1">16 Cases</div>
          <span className="text-[11px] text-slate-500">Awaiting IFD Sanction</span>
        </div>
      </div>

      {/* RCE Audit Cases */}
      <div className="space-y-4">
        <h2 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider font-mono">
          Revised Cost Estimate (RCE) Scrutiny & Decoupling Flags
        </h2>

        {rceCases.map(rce => (
          <div
            key={rce.id}
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm space-y-3"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300 font-mono text-xs font-bold rounded">
                  {rce.id}
                </span>
                <span className="text-sm font-bold text-slate-900 dark:text-white">{rce.name}</span>
              </div>
              <span className={`text-[10px] px-2 py-0.5 rounded font-mono font-bold ${
                rce.decouplingStatus === 'CRITICAL_DECOUPLING' ? 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300' : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
              }`}>
                {rce.decouplingStatus}
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 dark:bg-slate-950 p-3 rounded-lg border border-slate-100 dark:border-slate-800 text-xs">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400">Original Sanction</span>
                <div className="text-sm font-mono font-bold text-slate-900 dark:text-white">₹{rce.sanctionedCost.toLocaleString()} Cr</div>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400">Revised Cost (RCE)</span>
                <div className="text-sm font-mono font-bold text-rose-600">₹{rce.revisedCost.toLocaleString()} Cr</div>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400">Physical vs Financial</span>
                <div className="text-sm font-mono font-bold text-blue-600">
                  {rce.physicalProgress}% physical / {rce.financialProgressPercent}% fund burn
                </div>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400">IFD Audit Status</span>
                <div className="text-sm font-mono font-semibold text-slate-700 dark:text-slate-300">{rce.status}</div>
              </div>
            </div>

            <div className="p-3 bg-slate-50 dark:bg-slate-950 rounded-lg text-xs space-y-1 border border-slate-100 dark:border-slate-800">
              <span className="text-[10px] uppercase font-bold text-slate-400">Macro Cost Driver Diagnosis</span>
              <p className="text-slate-700 dark:text-slate-300">{rce.macroDriver}</p>
            </div>

            <div className="flex items-center justify-between pt-1">
              <button
                onClick={() => navigate(`/projects/${rce.projectId}`)}
                className="text-xs text-blue-600 dark:text-blue-400 font-semibold hover:underline"
              >
                Inspect Project Financial Ledger →
              </button>
              <button
                onClick={() => handleAuditSignoff(rce.id)}
                className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs font-semibold flex items-center gap-1.5 transition"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Complete IFD Audit Scrutiny</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
