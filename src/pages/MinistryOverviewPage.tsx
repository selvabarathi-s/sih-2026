import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Building2,
  FolderKanban,
  AlertTriangle,
  CheckCircle2,
  Clock,
  ArrowRight,
  ShieldAlert,
  Send,
  ExternalLink,
  ChevronRight,
  Filter,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { paimanaDataService } from '../services/paimanaDataService';

export const MinistryOverviewPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [selectedMinistry, setSelectedMinistry] = useState('Ministry of Road Transport and Highways');
  const [actionNotice, setActionNotice] = useState<string | null>(null);

  // Filter projects by selected ministry
  const allProjects = paimanaDataService.getAllProjects();
  const ministryProjects = allProjects.filter(p =>
    (p.ministry || '').toLowerCase().includes(selectedMinistry.toLowerCase()) ||
    (p.agency || '').toLowerCase().includes('nhai')
  ).slice(0, 8);

  const escalatedCases = [
    {
      id: 'CASE-MIN-01',
      projectId: 'PAI-706775',
      projectName: 'BharatNet Optical Fiber Connectivity Network Phase-II',
      agency: 'BBNL',
      state: 'Bihar / UP',
      escalationLevel: 'MINISTRY_LEVEL',
      issue: 'Right-of-Way (RoW) clearance dispute along National Highway 31 with NHAI',
      status: 'ACTION_ASSIGNED',
      targetAgency: 'NHAI Project Directorate',
      daysOpen: 14,
      severity: 'HIGH',
    },
    {
      id: 'CASE-MIN-02',
      projectId: 'PAI-619032',
      projectName: 'Delhi-Amritsar-Katra Greenfield Expressway Package IV',
      agency: 'NHAI',
      state: 'Punjab',
      escalationLevel: 'MINISTRY_LEVEL',
      issue: 'Pending forest diversion clearance for 42 hectares in Ludhiana division',
      status: 'UNDER_MINISTRY_REVIEW',
      targetAgency: 'State Forest Cell',
      daysOpen: 21,
      severity: 'CRITICAL',
    },
    {
      id: 'CASE-MIN-03',
      projectId: 'PAI-619088',
      projectName: 'Vadodara-Mumbai Expressway Corridor Phase-I',
      agency: 'NHAI',
      state: 'Gujarat',
      escalationLevel: 'MINISTRY_LEVEL',
      issue: 'High-tension power transmission line relocation pending discom schedule',
      status: 'INTER_AGENCY_SYNC',
      targetAgency: 'GETCO Gujarat',
      daysOpen: 9,
      severity: 'MEDIUM',
    },
  ];

  const handleIssueDirective = (caseId: string, agency: string) => {
    setActionNotice(`Administrative directive issued to ${agency} for ${caseId}. Status synchronized with IPMD.`);
    setTimeout(() => setActionNotice(null), 4000);
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header Banner */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-lg bg-blue-100 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 flex items-center justify-center text-blue-600 dark:text-blue-400">
              <Building2 className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold text-slate-900 dark:text-white">Administrative Ministry Review</h1>
                <span className="px-2 py-0.5 text-xs font-semibold rounded bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300">
                  MoRTH / Line Ministry Scope
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Executive monitoring, agency bottleneck directives, and clearance tracking for ministry portfolio
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <select
              value={selectedMinistry}
              onChange={e => setSelectedMinistry(e.target.value)}
              className="text-xs py-1.5 px-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-md text-slate-800 dark:text-slate-200 font-medium focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="Ministry of Road Transport and Highways">Ministry of Road Transport & Highways</option>
              <option value="Ministry of Railways">Ministry of Railways</option>
              <option value="Ministry of Power">Ministry of Power</option>
              <option value="Ministry of Petroleum and Natural Gas">Ministry of Petroleum & Natural Gas</option>
              <option value="Department of Telecommunications">Department of Telecommunications</option>
            </select>
          </div>
        </div>

        {actionNotice && (
          <div className="mt-4 p-3 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 rounded-md text-xs text-emerald-800 dark:text-emerald-300 flex items-center gap-2 font-medium">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{actionNotice}</span>
          </div>
        )}
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-4">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Ministry Projects</span>
          <div className="text-2xl font-bold text-slate-900 dark:text-white mt-1">482</div>
          <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold">Active in IPMD Registry</span>
        </div>
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-4">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Escalated Cases</span>
          <div className="text-2xl font-bold text-amber-600 dark:text-amber-400 mt-1">12</div>
          <span className="text-[11px] text-amber-600 font-medium">Requires Ministry Review</span>
        </div>
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-4">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Inter-Agency Deadlocks</span>
          <div className="text-2xl font-bold text-rose-600 dark:text-rose-400 mt-1">4</div>
          <span className="text-[11px] text-rose-600 font-medium">RoW / Forest Clearances</span>
        </div>
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-4">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Agency Compliance Rate</span>
          <div className="text-2xl font-bold text-blue-600 dark:text-blue-400 mt-1">91.4%</div>
          <span className="text-[11px] text-slate-500">Monthly Reporting SLA</span>
        </div>
      </div>

      {/* Escalated Cases Section */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-amber-500" />
            <h2 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider font-mono">
              Escalated Cases Awaiting Ministry Action
            </h2>
          </div>
          <span className="text-xs font-mono text-slate-500 dark:text-slate-400">
            {escalatedCases.length} Critical Issues
          </span>
        </div>

        <div className="space-y-3">
          {escalatedCases.map(c => (
            <div
              key={c.id}
              className="p-4 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg flex flex-col md:flex-row md:items-center justify-between gap-3"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="px-2 py-0.5 bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300 font-mono text-xs font-bold rounded">
                    {c.id}
                  </span>
                  <span className="text-xs font-semibold text-slate-900 dark:text-white">{c.projectName}</span>
                  <span className="text-[11px] px-1.5 py-0.2 bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded font-mono">
                    {c.agency} • {c.state}
                  </span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300">{c.issue}</p>
                <div className="flex items-center gap-3 text-[11px] text-slate-500">
                  <span>Target: <strong className="text-slate-700 dark:text-slate-200">{c.targetAgency}</strong></span>
                  <span>•</span>
                  <span>Days Open: <strong className="text-amber-600">{c.daysOpen}d</strong></span>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => handleIssueDirective(c.id, c.targetAgency)}
                  className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs font-semibold flex items-center gap-1.5 transition shadow-sm"
                >
                  <Send className="w-3 h-3" />
                  <span>Issue Directive</span>
                </button>
                <button
                  onClick={() => navigate(`/projects/${c.projectId}`)}
                  className="px-2.5 py-1.5 bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 rounded text-xs font-medium transition"
                  title="View Project Detail"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Ministry Projects Table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <FolderKanban className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <h2 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider font-mono">
              Key Projects in Ministry Envelope
            </h2>
          </div>
          <button
            onClick={() => navigate('/projects')}
            className="text-xs text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 font-semibold"
          >
            <span>View All in Directory</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 dark:bg-slate-950 text-slate-500 font-mono uppercase text-[10px] border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="py-2.5 px-3">Project ID</th>
                <th className="py-2.5 px-3">Project Name</th>
                <th className="py-2.5 px-3">Agency</th>
                <th className="py-2.5 px-3">State</th>
                <th className="py-2.5 px-3 text-right">Sanction (₹ Cr)</th>
                <th className="py-2.5 px-3 text-right">Progress</th>
                <th className="py-2.5 px-3">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {ministryProjects.map(p => (
                <tr key={p.project_id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition">
                  <td className="py-2.5 px-3 font-mono font-bold text-blue-600 dark:text-blue-400">{p.project_id}</td>
                  <td className="py-2.5 px-3 font-medium text-slate-900 dark:text-white max-w-[260px] truncate">{p.project_name}</td>
                  <td className="py-2.5 px-3 text-slate-600 dark:text-slate-300">{p.agency || 'NHAI'}</td>
                  <td className="py-2.5 px-3 text-slate-600 dark:text-slate-300">{p.state}</td>
                  <td className="py-2.5 px-3 text-right font-mono font-semibold">₹{(p.original_cost || 0).toLocaleString()}</td>
                  <td className="py-2.5 px-3 text-right font-mono font-bold text-emerald-600">{p.physical_progress || 0}%</td>
                  <td className="py-2.5 px-3">
                    <button
                      onClick={() => navigate(`/projects/${p.project_id}`)}
                      className="px-2 py-1 bg-slate-100 dark:bg-slate-800 hover:bg-blue-600 hover:text-white rounded text-[11px] font-semibold transition"
                    >
                      Inspect
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
