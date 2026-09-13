import React, { useState } from 'react';
import { X, Award, CheckCircle, AlertTriangle, ShieldCheck, Scale, FileText, Send } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface ExecutiveDecisionModalProps {
  isOpen: boolean;
  onClose: () => void;
  briefId?: string;
  projectId?: string;
  projectName?: string;
  onSuccess?: () => void;
}

export const ExecutiveDecisionModal: React.FC<ExecutiveDecisionModalProps> = ({
  isOpen,
  onClose,
  briefId = 'DEC-2026-00042',
  projectId = 'PAI-706775',
  projectName = 'BharatNet Phase-II Optical Fiber Connectivity',
  onSuccess,
}) => {
  const { user, currentRole } = useAuth();
  const roleClean = (currentRole || user?.role || '').toLowerCase();
  const isDecisionMaker = roleClean.includes('decision') || roleClean.includes('secretary') || roleClean.includes('senior');
  const isSystemAdmin = roleClean.includes('system') || roleClean.includes('admin');
  const [selectedOption, setSelectedOption] = useState<string>('OPT_B');
  const [justification, setJustification] = useState<string>(
    'Comprehensive digital fiber connectivity for border and aspirational district Gram Panchayats is of paramount national strategic priority. Additional budgetary support sanctioned under Revised Estimate.'
  );
  const [immediateActions, setImmediateActions] = useState<string>('Notify Empowered Committee; Convene MoRTH and State PWD joint session');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const options = [
    {
      id: 'OPT_A',
      title: 'Option A: Scope Rationalization & Phase Freeze',
      costImpact: '₹0 Cr (Budget Frozen)',
      scheduleImpact: '+3 Months',
      legalRisk: 'LOW',
      desc: 'Freeze GP connectivity at 85% completion, hand over completed Gram Panchayats to state telecom discoms, drop contested remote nodes.',
      pros: 'Immediate fiscal containment; zero additional burden on central treasury.',
      cons: 'Leaves 15% remote tribal blocks without high-speed fiber until Phase-III.',
    },
    {
      id: 'OPT_B',
      title: 'Option B: Inter-Ministerial Fast-Track & Baseline Extension (Recommended)',
      costImpact: '+₹1,250 Cr',
      scheduleImpact: '+9 Months',
      legalRisk: 'MEDIUM',
      desc: 'Convene Empowered Committee with Ministry of MoRTH and State PWD to grant blanket Right-of-Way exemption with ₹1,250 Cr additional budgetary sanction.',
      pros: 'Delivers 100% promised digital connectivity; resolves inter-agency deadlock.',
      cons: 'Requires Cabinet Committee on Economic Affairs (CCEA) supplemental sanction.',
    },
    {
      id: 'OPT_C',
      title: 'Option C: EPC Contract Termination & Retendering',
      costImpact: '+₹2,800 Cr (Litigation & Retender)',
      scheduleImpact: '+24 Months',
      legalRisk: 'CRITICAL',
      desc: 'Issue immediate default notice to non-performing consortium, invoke bank guarantees, and retender balance works.',
      pros: 'Enforces strict contractor accountability and penalizes delays.',
      cons: 'Triggers multi-year legal arbitration in High Court; delays project completion by 2+ years.',
    },
  ];

  const handleIssueDirective = async () => {
    if (!justification || justification.trim().length < 15) {
      setError('Substantive executive justification (min 15 chars) is mandatory.');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('paimana_token') || 'secretary';
      const res = await fetch(`/api/v1/decisions/briefs/${briefId}/directive`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          selectedOptionId: selectedOption,
          justification: justification.trim(),
          immediateActions: immediateActions.split(';').map(s => s.trim()).filter(Boolean),
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to issue executive directive.');
      }

      setSuccessMsg('Executive Directive issued with digital sign-off and immutably recorded.');
      setTimeout(() => {
        if (onSuccess) onSuccess();
        onClose();
      }, 1500);
    } catch (err: any) {
      setError(err.message || 'Directive execution failed.');
    } finally {
      setLoading(false);
    }
  };

  const isAuthorized = isDecisionMaker || isSystemAdmin;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 rounded-xl max-w-3xl w-full border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden my-8">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50">
          <div>
            <div className="flex items-center gap-2">
              <Award className="w-5 h-5 text-amber-600 dark:text-amber-400" />
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                Executive Decision Brief & Resolution Matrix
              </h2>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Brief Ref: <span className="font-mono font-bold text-amber-600 dark:text-amber-400">{briefId}</span> • {projectName}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
          {error && (
            <div className="p-3 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300 text-xs rounded-lg flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              {error}
            </div>
          )}

          {successMsg && (
            <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900 text-emerald-700 dark:text-emerald-300 text-xs rounded-lg flex items-center gap-2">
              <CheckCircle className="w-4 h-4 shrink-0" />
              {successMsg}
            </div>
          )}

          {/* Context Overview */}
          <div className="p-3.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg text-xs space-y-1">
            <div className="font-bold text-slate-900 dark:text-white">Strategic Impasse Summary:</div>
            <p className="text-slate-600 dark:text-slate-400">
              Project has breached the Tier-3 escalation threshold (+207% cost revision and 60-month schedule extension) due to right-of-way permissions in 480 Gram Panchayats. A senior executive directive is required to determine the forward trajectory.
            </p>
          </div>

          {/* Options A/B/C Trade-off Comparison Cards */}
          <div className="space-y-3">
            <div className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
              <Scale className="w-4 h-4 text-amber-600 dark:text-amber-400" />
              Select Strategic Option:
            </div>

            {options.map(opt => (
              <div
                key={opt.id}
                onClick={() => setSelectedOption(opt.id)}
                className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                  selectedOption === opt.id
                    ? 'border-amber-500 bg-amber-50/40 dark:bg-amber-950/20 shadow-sm'
                    : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-white dark:bg-slate-800/40'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <input
                      type="radio"
                      checked={selectedOption === opt.id}
                      onChange={() => setSelectedOption(opt.id)}
                      className="w-4 h-4 text-amber-600 accent-amber-600"
                    />
                    <div className="text-xs font-bold text-slate-900 dark:text-white">
                      {opt.title}
                    </div>
                  </div>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                      opt.legalRisk === 'LOW'
                        ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                        : opt.legalRisk === 'MEDIUM'
                        ? 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300'
                        : 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300'
                    }`}
                  >
                    Risk: {opt.legalRisk}
                  </span>
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-400 mt-2">{opt.desc}</p>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 text-[11px]">
                  <div>
                    <span className="text-slate-400 block">Fiscal Impact</span>
                    <span className="font-bold text-slate-800 dark:text-slate-200">{opt.costImpact}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Schedule Delta</span>
                    <span className="font-bold text-slate-800 dark:text-slate-200">{opt.scheduleImpact}</span>
                  </div>
                  <div className="sm:col-span-2">
                    <span className="text-slate-400 block">Core Trade-off</span>
                    <span className="text-slate-700 dark:text-slate-300 font-medium">{opt.pros}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Substantive Justification Input */}
          <div className="space-y-3 pt-2">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Executive Directive & Policy Justification (Mandatory)
              </label>
              <textarea
                rows={3}
                value={justification}
                onChange={e => setJustification(e.target.value)}
                placeholder="State the strategic, public-interest, or legal justification for this decision..."
                className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:ring-2 focus:ring-amber-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Mandatory Follow-up Directives (Semicolon separated)
              </label>
              <input
                type="text"
                value={immediateActions}
                onChange={e => setImmediateActions(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:ring-2 focus:ring-amber-500 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50">
          <div className="text-xs text-slate-500 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            Signatory: <span className="font-bold text-slate-800 dark:text-slate-200">{user?.fullName || 'V. K. Sundaram (Secretary)'}</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
            >
              Close
            </button>
            <button
              type="button"
              onClick={handleIssueDirective}
              disabled={loading || !isAuthorized}
              className={`px-5 py-2 text-xs font-bold rounded-lg flex items-center gap-2 transition-all ${
                !isAuthorized
                  ? 'bg-slate-300 dark:bg-slate-700 text-slate-500 cursor-not-allowed'
                  : 'bg-amber-600 hover:bg-amber-700 text-white shadow-md shadow-amber-500/20'
              }`}
            >
              <Send className="w-4 h-4" />
              {loading ? 'Issuing Directive...' : 'Issue Executive Directive'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
