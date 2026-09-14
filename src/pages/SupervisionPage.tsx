import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Eye,
  CheckCircle2,
  AlertTriangle,
  FolderKanban,
  FileCheck,
  Activity,
  Send,
  ExternalLink,
  ShieldCheck,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const SupervisionPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [notice, setNotice] = useState<string | null>(null);

  const inspections = [
    {
      id: 'PMC-INSP-01',
      projectId: 'PAI-706775',
      packageName: 'BharatNet Telecom Corridor Km 80–120',
      contractor: 'L&T Infrastructure EPC Consortium',
      date: '2026-04-18',
      scope: 'HDPE Duct Trench Bedding & Cable Blowing',
      finding: 'Sand bedding depth verified at 100mm according to IRC:SP:79. Blowing pressure maintained at 10 bar.',
      status: 'CONFORMANT',
      recommendation: 'Clear package for backfilling and warning tape installation.',
    },
    {
      id: 'PMC-INSP-02',
      projectId: 'PAI-706775',
      packageName: 'BharatNet Telecom Sub-Station Joint Chamber',
      contractor: 'L&T Infrastructure EPC Consortium',
      date: '2026-04-15',
      scope: 'Pre-Cast RCC Chamber Structural Integrity',
      finding: 'Minor honeycomb formation on exterior wall of Manhole MH-44.',
      status: 'REWORK_RECOMMENDED',
      recommendation: 'Instruct contractor to apply non-shrink polymer modified mortar repair before backfilling.',
    },
  ];

  const handleEscalate = (id: string) => {
    setNotice(`Independent PMC recommendation for inspection ${id} formally submitted to Project Nodal Authority.`);
    setTimeout(() => setNotice(null), 4000);
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header Banner */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-lg bg-blue-100 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 flex items-center justify-center text-blue-600 dark:text-blue-400">
              <Eye className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold text-slate-900 dark:text-white">Supervision Consultant / PMC Hub</h1>
                <span className="px-2 py-0.5 text-xs font-semibold rounded bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300">
                  Independent Engineer Authority
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Independent construction supervision, milestone inspection measurements, and consultant verification
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono text-slate-500">
            <span>PMC Agency: Tata Consulting Engineers</span>
          </div>
        </div>

        {notice && (
          <div className="mt-4 p-3 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 rounded-md text-xs text-emerald-800 dark:text-emerald-300 flex items-center gap-2 font-medium">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{notice}</span>
          </div>
        )}
      </div>

      {/* Inspections Table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider font-mono">
            Independent PMC Supervision Logs & Milestone Verifications
          </h2>
          <span className="text-xs font-mono text-slate-500">{inspections.length} Field Records</span>
        </div>

        <div className="space-y-3">
          {inspections.map(insp => (
            <div
              key={insp.id}
              className="p-4 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg space-y-2.5"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300 font-mono text-xs font-bold rounded">
                    {insp.id}
                  </span>
                  <span className="text-xs font-bold text-slate-900 dark:text-white">{insp.scope}</span>
                </div>
                <span className={`text-[10px] px-2 py-0.5 rounded font-mono font-bold ${
                  insp.status === 'CONFORMANT'
                    ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                    : 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300'
                }`}>
                  {insp.status}
                </span>
              </div>

              <p className="text-xs text-slate-600 dark:text-slate-300">{insp.finding}</p>

              <div className="p-2.5 bg-blue-50/60 dark:bg-blue-950/40 rounded border border-blue-100 dark:border-blue-900/60 text-xs">
                <span className="text-[10px] uppercase font-bold text-blue-800 dark:text-blue-300">PMC Independent Recommendation</span>
                <p className="text-blue-900 dark:text-blue-200 mt-0.5 font-medium">{insp.recommendation}</p>
              </div>

              <div className="flex items-center justify-between pt-1 text-[11px] text-slate-500">
                <span>Date: {insp.date} • Package: {insp.packageName}</span>
                <button
                  onClick={() => handleEscalate(insp.id)}
                  className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs font-semibold flex items-center gap-1.5 transition"
                >
                  <Send className="w-3 h-3" />
                  <span>Submit to Nodal Authority</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
