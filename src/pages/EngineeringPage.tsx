import React, { useState } from 'react';
import { Wrench, CheckCircle2, AlertOctagon, FileCheck, Layers, Eye, Plus } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { ProvenanceBadge } from '../components/common/ProvenanceBadge';

export const EngineeringPage: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'hindrances' | 'milestones' | 'site-observations'>('hindrances');

  const hindrances = [
    { id: 'HIN-ENG-01', chainage: 'Km 114+200', type: 'GEOLOGICAL_SUBSIDENCE', severity: 'HIGH', desc: 'Soft marine clay layer encountered; requires stone column ground improvement.', status: 'SOLUTION_APPROVED', date: '2026-08-12' },
    { id: 'HIN-ENG-02', chainage: 'Km 142+800', type: 'BRIDGE_FOUNDATION_SCOUR', severity: 'CRITICAL', desc: 'Monsoon scouring at Pier P3 exceeded hydraulic model threshold. Requires rip-rap pitching.', status: 'REDESIGN_UNDERWAY', date: '2026-08-28' },
    { id: 'HIN-ENG-03', chainage: 'Km 98+400', type: 'OPTICAL_DUCT_CRUSH', severity: 'MEDIUM', desc: 'Collapsed HDPE duct along road widening sector; optical fiber blown cable blocked.', status: 'REWORK_ORDERED', date: '2026-09-02' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
        <div className="flex items-center gap-3">
          <span className="p-2 bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400 rounded-lg">
            <Wrench className="w-6 h-6" />
          </span>
          <div>
            <h1 className="text-xl font-bold text-slate-900 dark:text-white">Project Engineering Assessment & Technical Review</h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {user?.fullName || 'Project Engineering Officer'} • Central Design & Engineering Directorate • Technical Hindrances & Specs
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <ProvenanceBadge type="OBSERVED" label="Field Engineering Telemetry" />
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-700 pb-2">
        <button
          onClick={() => setActiveTab('hindrances')}
          className={`px-4 py-2 text-xs font-semibold rounded-lg transition ${activeTab === 'hindrances' ? 'bg-indigo-600 text-white' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'}`}
        >
          Engineering Hindrances ({hindrances.length})
        </button>
        <button
          onClick={() => setActiveTab('milestones')}
          className={`px-4 py-2 text-xs font-semibold rounded-lg transition ${activeTab === 'milestones' ? 'bg-indigo-600 text-white' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'}`}
        >
          Milestone Technical Sign-Off
        </button>
        <button
          onClick={() => setActiveTab('site-observations')}
          className={`px-4 py-2 text-xs font-semibold rounded-lg transition ${activeTab === 'site-observations' ? 'bg-indigo-600 text-white' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'}`}
        >
          Site Condition Telemetry
        </button>
      </div>

      {activeTab === 'hindrances' && (
        <div className="bg-white dark:bg-slate-800 p-5 rounded-xl border border-slate-200 dark:border-slate-700 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-slate-900 dark:text-white">Active Technical & Structural Hindrances</h2>
            <button className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold rounded-lg flex items-center gap-1.5">
              <Plus className="w-3.5 h-3.5" />
              Record Engineering Anomaly
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {hindrances.map((h) => (
              <div key={h.id} className="p-4 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-850">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-mono font-bold text-slate-500">{h.id}</span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${h.severity === 'CRITICAL' ? 'bg-rose-100 text-rose-700' : 'bg-amber-100 text-amber-700'}`}>{h.severity}</span>
                </div>
                <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-1">{h.type}</h3>
                <p className="text-xs text-slate-600 dark:text-slate-300 mb-3">{h.desc}</p>
                <div className="flex items-center justify-between text-[11px] text-slate-400 border-t border-slate-200 dark:border-slate-750 pt-2">
                  <span>Chainage: {h.chainage}</span>
                  <span className="font-mono text-emerald-600 font-medium">{h.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'milestones' && (
        <div className="bg-white dark:bg-slate-800 p-5 rounded-xl border border-slate-200 dark:border-slate-700">
          <h2 className="font-semibold text-slate-900 dark:text-white mb-4">Milestone Engineering Feasibility Review</h2>
          <p className="text-xs text-slate-500 mb-4">Milestones pending technical engineer sign-off prior to certification.</p>
          <div className="p-4 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 rounded-lg text-xs text-emerald-700 dark:text-emerald-300">
            All current assigned milestone submissions comply with Ministry Standard Specifications (IRC:SP:84 / CPWD).
          </div>
        </div>
      )}

      {activeTab === 'site-observations' && (
        <div className="bg-white dark:bg-slate-800 p-5 rounded-xl border border-slate-200 dark:border-slate-700">
          <h2 className="font-semibold text-slate-900 dark:text-white mb-4">Ground Site Condition Log</h2>
          <p className="text-xs text-slate-500 mb-4">Real-time geological, water table, and terrain observations recorded by field engineering teams.</p>
          <div className="text-xs text-slate-600 dark:text-slate-400">
            Telemetry synchronized with Central Design & Engineering Directorate. No critical structural deviations active.
          </div>
        </div>
      )}
    </div>
  );
};
