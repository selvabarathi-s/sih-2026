import React, { useState } from 'react';
import { ShieldAlert, CheckCircle2, AlertCircle, X, UserCheck } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface HumanOverrideModalProps {
  isOpen: boolean;
  onClose: () => void;
  projectId: string;
  projectName: string;
  currentAiScore: number;
  currentAiBand: string;
  onOverrideSuccess?: (updatedRecord: any) => void;
}

export const HumanOverrideModal: React.FC<HumanOverrideModalProps> = ({
  isOpen,
  onClose,
  projectId,
  projectName,
  currentAiScore,
  currentAiBand,
  onOverrideSuccess,
}) => {
  const { user, currentRole } = useAuth();
  const [humanScore, setHumanScore] = useState<number>(currentAiScore);
  const [reasonCategory, setReasonCategory] = useState('GROUND_VERIFICATION_COMPLETE');
  const [justificationNotes, setJustificationNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const getHumanBand = (score: number) => {
    if (score >= 75) return 'CRITICAL';
    if (score >= 50) return 'HIGH';
    if (score >= 25) return 'MODERATE';
    return 'LOW';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!justificationNotes.trim() || justificationNotes.trim().length < 10) {
      setErrorMsg('Mandatory justification note must be at least 10 characters.');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg(null);

    try {
      const token = localStorage.getItem('paimana_auth_token');
      const res = await fetch(`/api/v1/overrides/projects/${projectId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          originalScore: currentAiScore,
          originalBand: currentAiBand,
          humanScore,
          humanBand: getHumanBand(humanScore),
          reasonCategory,
          justificationNotes,
        }),
      });

      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.error?.message || 'Failed to submit human override');
      }

      if (onOverrideSuccess) {
        onOverrideSuccess(json.data);
      }
      onClose();
    } catch (err: any) {
      setErrorMsg(err.message || 'Error recording human override');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg shadow-2xl max-w-lg w-full overflow-hidden animate-in fade-in zoom-in-95">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950">
          <div className="flex items-center gap-2">
            <UserCheck className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <h2 className="text-sm font-extrabold uppercase tracking-wider text-slate-900 dark:text-white font-mono">
              Human-in-the-Loop Risk Score Override
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-800 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <span className="text-[11px] font-mono text-slate-500 uppercase tracking-wider">Project Focus</span>
            <p className="text-sm font-bold text-slate-900 dark:text-white mt-0.5">
              {projectId}: {projectName}
            </p>
          </div>

          {/* AI vs Human Score Comparison */}
          <div className="grid grid-cols-2 gap-3 p-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-md font-mono">
            <div>
              <span className="text-[10px] text-slate-500 uppercase font-semibold">Algorithm AI Score</span>
              <div className="text-2xl font-extrabold text-slate-700 dark:text-slate-300 mt-1">
                {currentAiScore} <span className="text-xs font-normal">/100</span>
              </div>
              <span className="text-[10px] text-slate-500">[{currentAiBand}]</span>
            </div>

            <div>
              <span className="text-[10px] text-blue-600 dark:text-blue-400 uppercase font-semibold">Adjusted Human Assessment</span>
              <div className="text-2xl font-extrabold text-blue-600 dark:text-blue-400 mt-1">
                {humanScore} <span className="text-xs font-normal">/100</span>
              </div>
              <span className="text-[10px] text-blue-500">[{getHumanBand(humanScore)}]</span>
            </div>
          </div>

          {/* Score Slider */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-mono">
              <label className="text-slate-700 dark:text-slate-300 font-semibold">Set Reassessed Risk Score:</label>
              <span className="text-blue-600 font-bold">{humanScore}/100</span>
            </div>
            <input
              type="range"
              min={0}
              max={100}
              value={humanScore}
              onChange={e => setHumanScore(Number(e.target.value))}
              className="w-full h-2 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
            <div className="flex justify-between text-[10px] font-mono text-slate-400">
              <span>0 (Low Risk)</span>
              <span>50 (High)</span>
              <span>100 (Critical)</span>
            </div>
          </div>

          {/* Reason Category */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 font-mono">
              Primary Justification Category:
            </label>
            <select
              value={reasonCategory}
              onChange={e => setReasonCategory(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded text-slate-900 dark:text-white font-mono focus:outline-none focus:border-blue-500"
            >
              <option value="GROUND_VERIFICATION_COMPLETE">Field Ground Verification Milestone Delivered</option>
              <option value="PENDING_CLEARANCE_RESOLVED">Statutory Environmental / ROW Clearance Handover Issued</option>
              <option value="CONTRACTOR_AUGMENTED">Supplementary EPC Contractor Resource Mobilization Confirmed</option>
              <option value="SCOPE_RESTRUCTURED">Empowered Committee Formal Budget / Scope Restructuring</option>
              <option value="DISPUTED_SIGNAL">Telemetry Decoupling Explained by Seasonal / Geological Factors</option>
            </select>
          </div>

          {/* Justification Textarea */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 font-mono">
              Detailed Audit Justification (Mandatory):
            </label>
            <textarea
              rows={3}
              value={justificationNotes}
              onChange={e => setJustificationNotes(e.target.value)}
              placeholder="State the verifiable administrative basis, official order reference, or field inspection report justifying the score modification..."
              className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded text-slate-900 dark:text-white focus:outline-none focus:border-blue-500 font-mono"
            />
          </div>

          {errorMsg && (
            <div className="flex items-center gap-2 p-2.5 text-xs text-rose-700 bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800 rounded font-mono">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <div className="p-2.5 bg-blue-50/50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900/50 rounded text-[11px] text-slate-600 dark:text-slate-400 font-mono">
            <strong>Audit Guarantee:</strong> Submitting this override preserves the original AI inference and records an append-only audit trail with your verified officer credentials ({user?.fullName || 'Monitoring Officer'}).
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-200 dark:border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-1.5 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded transition font-mono"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-1.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 rounded transition font-mono shadow-sm flex items-center gap-1.5"
            >
              {isSubmitting ? 'Recording Audit...' : 'Commit Human Override'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
