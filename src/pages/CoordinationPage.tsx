import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Network,
  CheckCircle2,
  AlertTriangle,
  FolderKanban,
  FileCheck,
  Send,
  Building2,
  Users,
  Sliders,
  ExternalLink,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const CoordinationPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [notice, setNotice] = useState<string | null>(null);

  const crossMinistryCases = [
    {
      id: 'IMC-CASE-101',
      title: 'Dedicated Freight Corridor vs State Highway 14 Level Crossing Clearance',
      participatingMinistries: ['Ministry of Railways', 'Ministry of Road Transport & Highways', 'Government of Rajasthan'],
      leadBottleneckOwner: 'Dedicated Freight Corridor Corp (DFCCIL)',
      actionRequired: 'Finalize General Arrangement Drawing (GAD) for Grade Separated RoB.',
      slaDeadline: '2026-05-15',
      status: 'INTER_AGENCY_AGREEMENT_PENDING',
      priority: 'CRITICAL',
    },
    {
      id: 'IMC-CASE-102',
      title: 'Gas Pipeline Crossing BharatNet OFC Alignment in Sonipat Logistics Hub',
      participatingMinistries: ['Ministry of Petroleum & Natural Gas', 'Department of Telecommunications'],
      leadBottleneckOwner: 'GAIL (India) Limited',
      actionRequired: 'Joint trenching depth agreement and safe separation protocol clearance.',
      slaDeadline: '2026-05-02',
      status: 'COMMITTEE_REVIEW',
      priority: 'HIGH',
    },
    {
      id: 'IMC-CASE-103',
      title: 'Transmission Line Vertical Clearance over Western Expressway Package II',
      participatingMinistries: ['Ministry of Power', 'Ministry of Road Transport & Highways'],
      leadBottleneckOwner: 'Power Grid Corporation of India (POWERGRID)',
      actionRequired: 'Height raising of 400kV line tower T-88 and T-89.',
      slaDeadline: '2026-05-28',
      status: 'WORKS_SCHEDULED',
      priority: 'MEDIUM',
    },
  ];

  const handleDispatchDirective = (caseId: string) => {
    setNotice(`Inter-Ministerial Taskforce resolution dispatched for ${caseId} to all participating line ministries.`);
    setTimeout(() => setNotice(null), 4000);
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header Banner */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-lg bg-blue-100 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 flex items-center justify-center text-blue-600 dark:text-blue-400">
              <Network className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold text-slate-900 dark:text-white">Inter-Ministerial Coordination Hub</h1>
                <span className="px-2 py-0.5 text-xs font-semibold rounded bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300">
                  Cabinet Secretariat / IMC Wing
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Resolution of cross-ministry bottlenecks, multi-agency action matrices, and statutory clearance synchronization
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono text-slate-500">
            <span>Inter-Agency Matrix: 3 Active Disputes</span>
          </div>
        </div>

        {notice && (
          <div className="mt-4 p-3 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 rounded-md text-xs text-emerald-800 dark:text-emerald-300 flex items-center gap-2 font-medium">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{notice}</span>
          </div>
        )}
      </div>

      {/* Cross-Ministry Cases Grid */}
      <div className="space-y-4">
        <h2 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider font-mono">
          Active Cross-Ministry Deadlocks & Ownership Matrix
        </h2>

        {crossMinistryCases.map(c => (
          <div
            key={c.id}
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm space-y-3"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300 font-mono text-xs font-bold rounded">
                  {c.id}
                </span>
                <span className="text-sm font-bold text-slate-900 dark:text-white">{c.title}</span>
              </div>
              <span className={`text-[10px] px-2 py-0.5 rounded font-mono font-bold ${
                c.priority === 'CRITICAL' ? 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300' : 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300'
              }`}>
                {c.priority}
              </span>
            </div>

            <div className="flex items-center gap-2 flex-wrap text-xs">
              <span className="text-slate-400 font-medium">Participating Ministries:</span>
              {c.participatingMinistries.map((min, idx) => (
                <span key={idx} className="px-2 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded text-[11px] font-medium">
                  {min}
                </span>
              ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 bg-slate-50 dark:bg-slate-950 p-3 rounded-lg border border-slate-100 dark:border-slate-800 text-xs">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400">Lead Bottleneck Agency</span>
                <p className="text-slate-900 dark:text-white font-semibold mt-0.5">{c.leadBottleneckOwner}</p>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400">Agreed Action & SLA</span>
                <p className="text-blue-700 dark:text-blue-300 font-medium mt-0.5">{c.actionRequired} (Deadline: {c.slaDeadline})</p>
              </div>
            </div>

            <div className="flex items-center justify-between pt-1">
              <span className="text-[11px] text-slate-500 font-mono">Status: {c.status}</span>
              <button
                onClick={() => handleDispatchDirective(c.id)}
                className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs font-semibold flex items-center gap-1.5 transition shadow-sm"
              >
                <Send className="w-3 h-3" />
                <span>Dispatch Resolution Mandate</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
