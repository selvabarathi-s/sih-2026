import React, { useState } from 'react';
import { MapPin, CheckCircle2, Clock, AlertTriangle, Layers, ChevronRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { ProvenanceBadge } from '../components/common/ProvenanceBadge';

export const StateCoordinationPage: React.FC = () => {
  const { user } = useAuth();

  const clearances = [
    { id: 'CLR-ST-01', project: 'BharatNet Phase II OFC', state: 'Maharashtra', authority: 'State Forest Dept', type: 'Forest Transit Clearances', status: 'STAGE_2_REVIEW', slaDays: 14, landHa: 14.2 },
    { id: 'CLR-ST-02', project: 'BharatNet Phase II OFC', state: 'Uttar Pradesh', authority: 'UPPTCL (Power Transmission)', type: 'Power Line Crossing Shifting', status: 'ESTIMATE_APPROVED', slaDays: 6, landHa: 0.0 },
    { id: 'CLR-ST-03', project: 'Delhi-Mumbai Expressway', state: 'Gujarat', authority: 'Revenue Department', type: 'Private Land Parcel Handover', status: 'IN_PROGRESS', slaDays: 21, landHa: 48.6 },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
        <div className="flex items-center gap-3">
          <span className="p-2 bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 rounded-lg">
            <MapPin className="w-6 h-6" />
          </span>
          <div>
            <h1 className="text-xl font-bold text-slate-900 dark:text-white">State Project Coordination & Statutory Clearances</h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {user?.fullName || 'State Coordination Officer'} • State Infrastructure Coordination Cell • Land, RoW & Utility Shifting
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <ProvenanceBadge type="OBSERVED" label="State Government Records" />
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
          <span className="text-xs font-semibold text-slate-500 uppercase">Active State Clearances</span>
          <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">28 Items</p>
          <span className="text-xs text-slate-500">Across 14 Districts</span>
        </div>
        <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
          <span className="text-xs font-semibold text-emerald-600 uppercase">Land Handed Over</span>
          <p className="text-2xl font-bold text-emerald-600 mt-1">92.4%</p>
          <span className="text-xs text-slate-500">Of Total Corridors Required</span>
        </div>
        <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
          <span className="text-xs font-semibold text-amber-600 uppercase">Utility Shifting Cases</span>
          <p className="text-2xl font-bold text-amber-600 mt-1">9 Pending</p>
          <span className="text-xs text-slate-500">Power, Water, Gas Lines</span>
        </div>
        <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
          <span className="text-xs font-semibold text-rose-600 uppercase">Approaching SLA</span>
          <p className="text-2xl font-bold text-rose-600 mt-1">3 Breaches Risk</p>
          <span className="text-xs text-slate-500">Less than 7 days left</span>
        </div>
      </div>

      {/* Clearances Table */}
      <div className="bg-white dark:bg-slate-800 p-5 rounded-xl border border-slate-200 dark:border-slate-700">
        <h2 className="font-semibold text-slate-900 dark:text-white mb-4">State Clearances & RoW Tracker</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 dark:bg-slate-900/50 text-xs font-semibold text-slate-500 uppercase border-b border-slate-200 dark:border-slate-700">
              <tr>
                <th className="py-2.5 px-3">Case ID</th>
                <th className="py-2.5 px-3">Project</th>
                <th className="py-2.5 px-3">State & Authority</th>
                <th className="py-2.5 px-3">Clearance Scope</th>
                <th className="py-2.5 px-3">Status</th>
                <th className="py-2.5 px-3">SLA Deadline</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
              {clearances.map((c) => (
                <tr key={c.id} className="hover:bg-slate-50 dark:hover:bg-slate-750">
                  <td className="py-3 px-3 font-mono text-xs font-bold text-slate-500">{c.id}</td>
                  <td className="py-3 px-3 font-medium text-slate-900 dark:text-white">{c.project}</td>
                  <td className="py-3 px-3 text-xs">
                    <div className="font-semibold text-slate-800 dark:text-slate-200">{c.state}</div>
                    <span className="text-slate-400">{c.authority}</span>
                  </td>
                  <td className="py-3 px-3 text-xs text-slate-600 dark:text-slate-300">
                    <div>{c.type}</div>
                    {c.landHa > 0 && <span className="text-slate-400">{c.landHa} Hectares</span>}
                  </td>
                  <td className="py-3 px-3">
                    <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-blue-100 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300 font-mono">
                      {c.status}
                    </span>
                  </td>
                  <td className="py-3 px-3 font-mono text-xs text-amber-600 font-medium">{c.slaDays} Days Remaining</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
