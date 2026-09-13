import React from 'react';
import { Eye, CheckSquare, ClipboardList, ShieldAlert, UserCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { ProvenanceBadge } from '../components/common/ProvenanceBadge';

export const SupervisionPage: React.FC = () => {
  const { user } = useAuth();

  const inspectionRecords = [
    { id: 'INSP-2026-088', project: 'BharatNet Phase II OFC', chainage: 'Ch 42+000 to 58+000', inspector: 'Deepak Sen (PMC)', date: '2026-09-10', result: 'SATISFACTORY', remarks: 'Duct depth verified with ground penetrating radar (GPR) at 1.68m.' },
    { id: 'INSP-2026-089', project: 'BharatNet Phase II OFC', chainage: 'Ch 60+400', inspector: 'Deepak Sen (PMC)', date: '2026-09-11', result: 'CORRECTIVE_ACTION_REQUIRED', remarks: 'Joint chamber manhole cover unsealed; rain water ingress detected.' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
        <div className="flex items-center gap-3">
          <span className="p-2 bg-teal-50 dark:bg-teal-950/50 text-teal-600 dark:text-teal-400 rounded-lg">
            <UserCheck className="w-6 h-6" />
          </span>
          <div>
            <h1 className="text-xl font-bold text-slate-900 dark:text-white">Supervision Consultant & Independent Engineer Hub</h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {user?.fullName || 'Supervision Consultant'} • Feedback Infra PMC • Contractual Oversight & Milestone Verification
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <ProvenanceBadge type="OBSERVED" label="Third-Party Field Inspection" />
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
          <span className="text-xs font-semibold text-slate-500 uppercase">Independent Inspections</span>
          <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">42 Completed</p>
          <span className="text-xs text-emerald-600">38 Pass • 4 Corrective Action</span>
        </div>
        <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
          <span className="text-xs font-semibold text-slate-500 uppercase">Milestones Verified</span>
          <p className="text-2xl font-bold text-teal-600 mt-1">16 Packages</p>
          <span className="text-xs text-slate-500">Contractor Claims Audited</span>
        </div>
        <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
          <span className="text-xs font-semibold text-slate-500 uppercase">PMC Recommendations</span>
          <p className="text-2xl font-bold text-indigo-600 mt-1">7 Active</p>
          <span className="text-xs text-slate-500">Submitted to Nodal Authority</span>
        </div>
      </div>

      {/* Inspection Ledger */}
      <div className="bg-white dark:bg-slate-800 p-5 rounded-xl border border-slate-200 dark:border-slate-700">
        <h2 className="font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
          <ClipboardList className="w-4 h-4 text-teal-600" />
          <span>Independent Engineer Inspection Records</span>
        </h2>
        <div className="space-y-3">
          {inspectionRecords.map((r) => (
            <div key={r.id} className="p-4 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-850 flex flex-col md:flex-row md:items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-mono font-bold text-slate-500">{r.id}</span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${r.result === 'SATISFACTORY' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>{r.result}</span>
                </div>
                <h3 className="text-sm font-semibold text-slate-900 dark:text-white">{r.project} — {r.chainage}</h3>
                <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">{r.remarks}</p>
              </div>
              <div className="text-right text-xs text-slate-500">
                <div>{r.inspector}</div>
                <div className="font-mono">{r.date}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
