import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Wrench,
  CheckCircle2,
  AlertTriangle,
  FolderKanban,
  FileCheck,
  Activity,
  Layers,
  Send,
  Upload,
  ExternalLink,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const EngineeringPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'hindrances' | 'milestones' | 'site_conditions'>('hindrances');
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const engineeringHindrances = [
    {
      id: 'ENG-HIN-01',
      projectId: 'PAI-706775',
      title: 'Geological Strata Hard Rock Encounter in Trenching Km 114–119',
      severity: 'HIGH',
      assignedPackage: 'BharatNet Bihar Package 3',
      location: 'Chainage 114+200',
      status: 'UNDER_TECHNICAL_ASSESSMENT',
      recommendation: 'Deploy controlled rock-sawing trenchers to prevent cable micro-bending.',
      engineerNotes: 'Rock hardness exceeded 80 MPa; conventional manual trenching stalled.',
    },
    {
      id: 'ENG-HIN-02',
      projectId: 'PAI-619032',
      title: 'Bridge Pier P-14 Sub-Surface Cavity During Bored Cast-in-Situ Piling',
      severity: 'CRITICAL',
      assignedPackage: 'Expressway Package IV',
      location: 'River Crossing Axis',
      status: 'REMEDIAL_DESIGN_IN_PROGRESS',
      recommendation: 'Recommend pressure grouting and 2 additional reinforcement piles to redistribute axial load.',
      engineerNotes: 'Geotechnical core test verified 4m karst void at 22m depth.',
    },
  ];

  const milestonesReview = [
    {
      id: 'MS-REV-01',
      projectId: 'PAI-706775',
      milestone: 'OFC Optical Splice & Joint Enclosure Closure (500 Km)',
      contractorClaim: '98.5% Complete',
      engineeringStatus: 'VERIFIED_WITH_CONDITIONS',
      technicalObservation: 'Splice loss averages 0.04 dB conforming to ITU-T G.652D. OTDR backscatter traces verified.',
      readiness: 'READY_FOR_COMMISSIONING',
    },
    {
      id: 'MS-REV-02',
      projectId: 'PAI-619032',
      milestone: 'Superstructure Pre-Stressed Concrete Girder Launching Span 8–12',
      contractorClaim: '100% Complete',
      engineeringStatus: 'REWORK_REQUIRED',
      technicalObservation: 'Bearing pad alignment deviation observed on Pier 9 cap. Elongation records require re-verification.',
      readiness: 'HOLD_STAGE',
    },
  ];

  const handleRecordRecommendation = (id: string) => {
    setSuccessMsg(`Technical recommendation recorded and dispatched to Project Nodal Officer for ${id}.`);
    setTimeout(() => setSuccessMsg(null), 4000);
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header Banner */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-lg bg-blue-100 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 flex items-center justify-center text-blue-600 dark:text-blue-400">
              <Wrench className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold text-slate-900 dark:text-white">Project Engineering Directorate</h1>
                <span className="px-2 py-0.5 text-xs font-semibold rounded bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300">
                  Engineering Review & Ground Truth
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Technical assessment, geological hindrance appraisal, milestone sign-off, and site condition logs
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500 font-mono">Assigned Packages: PAI-706775, PAI-619032</span>
          </div>
        </div>

        {successMsg && (
          <div className="mt-4 p-3 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 rounded-md text-xs text-emerald-800 dark:text-emerald-300 flex items-center gap-2 font-medium">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 text-xs font-semibold">
        <button
          onClick={() => setActiveTab('hindrances')}
          className={`pb-3 px-3 transition border-b-2 flex items-center gap-1.5 ${
            activeTab === 'hindrances'
              ? 'border-blue-600 text-blue-600 dark:text-blue-400 font-bold'
              : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <AlertTriangle className="w-4 h-4" />
          <span>Technical Hindrances ({engineeringHindrances.length})</span>
        </button>
        <button
          onClick={() => setActiveTab('milestones')}
          className={`pb-3 px-3 transition border-b-2 flex items-center gap-1.5 ${
            activeTab === 'milestones'
              ? 'border-blue-600 text-blue-600 dark:text-blue-400 font-bold'
              : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <FileCheck className="w-4 h-4" />
          <span>Milestones Technical Review ({milestonesReview.length})</span>
        </button>
      </div>

      {/* Tab Content: Technical Hindrances */}
      {activeTab === 'hindrances' && (
        <div className="space-y-4">
          {engineeringHindrances.map(h => (
            <div
              key={h.id}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm space-y-3"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300 font-mono text-xs font-bold rounded">
                    {h.id}
                  </span>
                  <span className="text-sm font-bold text-slate-900 dark:text-white">{h.title}</span>
                </div>
                <span className={`text-[10px] px-2 py-0.5 rounded font-mono font-bold ${
                  h.severity === 'CRITICAL' ? 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300' : 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300'
                }`}>
                  {h.severity}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs bg-slate-50 dark:bg-slate-950 p-3 rounded-lg border border-slate-100 dark:border-slate-800">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400">Site Condition & Finding</span>
                  <p className="text-slate-700 dark:text-slate-300 mt-0.5">{h.engineerNotes}</p>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400">Engineering Recommendation</span>
                  <p className="text-blue-700 dark:text-blue-300 font-medium mt-0.5">{h.recommendation}</p>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <span className="text-[11px] text-slate-500 font-mono">Location: {h.location} • {h.assignedPackage}</span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleRecordRecommendation(h.id)}
                    className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs font-semibold flex items-center gap-1.5 transition shadow-sm"
                  >
                    <Send className="w-3 h-3" />
                    <span>Submit Recommendation</span>
                  </button>
                  <button
                    onClick={() => navigate(`/projects/${h.projectId}`)}
                    className="px-2.5 py-1.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 rounded text-xs font-medium hover:bg-slate-200 transition"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab Content: Milestones Technical Review */}
      {activeTab === 'milestones' && (
        <div className="space-y-4">
          {milestonesReview.map(m => (
            <div
              key={m.id}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm space-y-3"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-mono text-xs font-bold rounded">
                    {m.id}
                  </span>
                  <span className="text-sm font-bold text-slate-900 dark:text-white">{m.milestone}</span>
                </div>
                <span className={`text-[10px] px-2 py-0.5 rounded font-mono font-bold ${
                  m.readiness === 'READY_FOR_COMMISSIONING' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300' : 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300'
                }`}>
                  {m.readiness}
                </span>
              </div>

              <div className="p-3 bg-slate-50 dark:bg-slate-950 rounded-lg text-xs space-y-1.5 border border-slate-100 dark:border-slate-800">
                <div className="flex items-center justify-between text-[11px] text-slate-500">
                  <span>Contractor Claim: <strong className="text-slate-800 dark:text-slate-200">{m.contractorClaim}</strong></span>
                  <span>Status: <strong className="text-blue-600 dark:text-blue-400">{m.engineeringStatus}</strong></span>
                </div>
                <p className="text-slate-700 dark:text-slate-300 font-mono text-[11px]">{m.technicalObservation}</p>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  onClick={() => handleRecordRecommendation(m.id)}
                  className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs font-semibold flex items-center gap-1.5 transition"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Sign-Off Technical Assessment</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
