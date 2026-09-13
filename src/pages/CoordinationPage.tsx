import React, { useState, useEffect } from 'react';
import { GitMerge, Plus, AlertTriangle, CheckCircle2, Clock, Calendar, Building2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { ProvenanceBadge } from '../components/common/ProvenanceBadge';

export const CoordinationPage: React.FC = () => {
  const { user } = useAuth();
  const [cases, setCases] = useState<any[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newProjectId, setNewProjectId] = useState('PAI-706775');
  const [leadMinistry, setLeadMinistry] = useState('Ministry of Communications');

  useEffect(() => {
    fetch('/api/v1/coordination/cases')
      .then(res => res.json())
      .then(d => {
        if (d.cases) setCases(d.cases);
      })
      .catch(() => {});
  }, []);

  const handleCreateCase = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    try {
      const res = await fetch('/api/v1/coordination/cases', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token') || ''}`,
        },
        body: JSON.stringify({
          projectId: newProjectId,
          projectName: 'BharatNet Phase II OFC',
          title: newTitle,
          leadMinistry,
          participatingMinistries: ['Ministry of Railways', 'Ministry of Road Transport and Highways'],
          severity: 'HIGH',
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setCases([data.case, ...cases]);
        setShowModal(false);
        setNewTitle('');
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
        <div className="flex items-center gap-3">
          <span className="p-2 bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 rounded-lg">
            <GitMerge className="w-6 h-6" />
          </span>
          <div>
            <h1 className="text-xl font-bold text-slate-900 dark:text-white">Inter-Ministerial Coordination Center</h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {user?.fullName || 'Inter-Ministerial Officer'} • Inter-Ministerial Project Steering Committee (IMPSC) • Multi-Agency Dispute Resolution
            </p>
          </div>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-lg flex items-center gap-2 transition"
        >
          <Plus className="w-4 h-4" />
          Initiate Coordination Case
        </button>
      </div>

      {/* Cases List */}
      <div className="space-y-4">
        {cases.map((c) => (
          <div key={c.id} className="p-5 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 mb-3">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold text-slate-500">{c.id}</span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                  c.severity === 'CRITICAL' ? 'bg-rose-100 text-rose-700' : 'bg-amber-100 text-amber-700'
                }`}>{c.severity}</span>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-blue-100 text-blue-700 font-mono">
                  {c.status}
                </span>
              </div>
              <span className="text-xs text-slate-400 font-mono">Lead: {c.leadMinistry}</span>
            </div>

            <h3 className="text-base font-semibold text-slate-900 dark:text-white mb-2">{c.title}</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-3">
              Project: <span className="font-medium text-slate-700 dark:text-slate-300">{c.projectName} ({c.projectId})</span>
            </p>

            {c.participatingMinistries && (
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <span className="text-xs text-slate-400">Participating:</span>
                {c.participatingMinistries.map((m: string, idx: number) => (
                  <span key={idx} className="text-[11px] px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                    {m}
                  </span>
                ))}
              </div>
            )}

            {c.lastMeetingMinutes && (
              <div className="p-3 bg-slate-50 dark:bg-slate-900/50 rounded-lg text-xs text-slate-600 dark:text-slate-300 border border-slate-100 dark:border-slate-750">
                <span className="font-semibold text-slate-800 dark:text-slate-200">Latest Steering Minutes: </span>
                {c.lastMeetingMinutes}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Initiate Case Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-800 rounded-xl max-w-md w-full p-6 border border-slate-200 dark:border-slate-700 shadow-xl">
            <h2 className="text-base font-bold text-slate-900 dark:text-white mb-4">Open Inter-Ministerial Case</h2>
            <form onSubmit={handleCreateCase} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">Issue Title</label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Right of Way rail crossing deadlock"
                  className="w-full text-xs p-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">Project ID</label>
                <input
                  type="text"
                  value={newProjectId}
                  onChange={(e) => setNewProjectId(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">Lead Ministry</label>
                <input
                  type="text"
                  value={leadMinistry}
                  onChange={(e) => setLeadMinistry(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                  required
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 text-xs text-slate-600 dark:text-slate-400 hover:bg-slate-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-lg"
                >
                  Create Steering Case
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
