import React from 'react';
import { ShieldCheck, Key, Lock, AlertTriangle, UserX, Cpu } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { ProvenanceBadge } from '../components/common/ProvenanceBadge';

export const SecurityPage: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
        <div className="flex items-center gap-3">
          <span className="p-2 bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400 rounded-lg">
            <ShieldCheck className="w-6 h-6" />
          </span>
          <div>
            <h1 className="text-xl font-bold text-slate-900 dark:text-white">Platform Security & Access Control Operations</h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {user?.fullName || 'Platform Administrator'} • NIC / National Infrastructure Cyber Cell • Session Tokens & RBAC Policies
            </p>
          </div>
        </div>
      </div>

      {/* Security Telemetry */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
          <span className="text-xs font-semibold text-slate-500 uppercase">Active Gov Sessions</span>
          <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">19 Tokens</p>
          <span className="text-xs text-emerald-600">Zero rogue sessions detected</span>
        </div>
        <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
          <span className="text-xs font-semibold text-amber-600 uppercase">Unauthorized Switch Attempts</span>
          <p className="text-2xl font-bold text-amber-600 mt-1">0 Alarms</p>
          <span className="text-xs text-slate-500">Enforced by HTTP 403 Guards</span>
        </div>
        <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
          <span className="text-xs font-semibold text-indigo-600 uppercase">Token Policy</span>
          <p className="text-2xl font-bold text-indigo-600 mt-1">Parichay 2.0</p>
          <span className="text-xs text-slate-500">Bearer Token with AES-256</span>
        </div>
        <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
          <span className="text-xs font-semibold text-emerald-600 uppercase">API RBAC Status</span>
          <p className="text-2xl font-bold text-emerald-600 mt-1">6-Tier Active</p>
          <span className="text-xs text-slate-500">Resource assignment checked</span>
        </div>
      </div>

      {/* Security Policies */}
      <div className="bg-white dark:bg-slate-800 p-5 rounded-xl border border-slate-200 dark:border-slate-700 space-y-3">
        <h2 className="font-semibold text-slate-900 dark:text-white">Active Government Cyber Invariants</h2>
        <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-300">
          <li className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            <span>Strict Project Assignment Isolation: Execution accounts restricted strictly to assigned PAI project IDs.</span>
          </li>
          <li className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            <span>Multi-Assignment Capability Guard: Role switching permitted strictly within authorized user.assigned_roles.</span>
          </li>
          <li className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            <span>Audit Immutability: Independent audit observers cannot perform state mutating POST/PUT/DELETE operations.</span>
          </li>
        </ul>
      </div>
    </div>
  );
};
