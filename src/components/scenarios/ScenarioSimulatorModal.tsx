import React, { useState, useEffect } from 'react';
import { Sparkles, X, TrendingDown, Clock, IndianRupee, ShieldCheck, CheckCircle2, ArrowRight } from 'lucide-react';

interface ScenarioSimulatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  projectId: string;
  projectName: string;
}

export const ScenarioSimulatorModal: React.FC<ScenarioSimulatorModalProps> = ({
  isOpen,
  onClose,
  projectId,
  projectName,
}) => {
  const [data, setData] = useState<any>(null);
  const [selectedScenarioIndex, setSelectedScenarioIndex] = useState(1);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!isOpen) return;
    setIsLoading(true);

    const fetchScenarios = async () => {
      try {
        const token = localStorage.getItem('paimana_auth_token');
        const res = await fetch('/api/v1/scenarios/simulate', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          body: JSON.stringify({ projectId }),
        });
        const json = await res.json();
        if (json.data) {
          setData(json.data);
        }
      } catch (err) {
        console.warn('Backend scenario simulate failed, using local fallback:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchScenarios();
  }, [isOpen, projectId]);

  if (!isOpen) return null;

  const scenarios = data?.scenarios || [];
  const selectedScenario = scenarios[selectedScenarioIndex] || scenarios[0];
  const baseline = data?.baselineMetrics || { riskScore: 84, scheduleExtensionMonths: 24, costOverrunCr: 126891 };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg shadow-2xl max-w-3xl w-full overflow-hidden animate-in fade-in zoom-in-95 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 shrink-0">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            <div>
              <h2 className="text-sm font-extrabold uppercase tracking-wider text-slate-900 dark:text-white font-mono">
                Prescriptive Scenario Simulator: What If We Intervene?
              </h2>
              <span className="text-[11px] font-mono text-slate-500">
                {projectId}: {projectName}
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-800 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-5 overflow-y-auto flex-1 font-mono">
          {/* Baseline vs Selected Scenario Comparison Banner */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 p-4 bg-purple-50/50 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-900/60 rounded-lg">
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-500">Status Quo Baseline</span>
              <div className="text-xl font-extrabold text-slate-900 dark:text-white mt-1">
                Risk: {baseline.riskScore} <span className="text-xs font-normal">/100</span>
              </div>
              <span className="text-xs text-rose-600">Delay: +{baseline.scheduleExtensionMonths} Mo</span>
            </div>

            <div>
              <span className="text-[10px] uppercase font-bold text-purple-600 dark:text-purple-400">Simulated Outcome</span>
              <div className="text-xl font-extrabold text-purple-700 dark:text-purple-300 mt-1">
                Risk: {selectedScenario?.simulatedRiskScore || baseline.riskScore} <span className="text-xs font-normal">/100</span>
              </div>
              <span className="text-xs text-emerald-600 font-bold">
                Recovery: -{selectedScenario?.delayRecoveryMonths || 0} Months
              </span>
            </div>

            <div>
              <span className="text-[10px] uppercase font-bold text-emerald-600">Expected Net Benefit</span>
              <div className="text-xl font-extrabold text-emerald-600 mt-1">
                {selectedScenario?.riskDelta < 0 ? `${selectedScenario.riskDelta} pts` : 'No reduction'}
              </div>
              <span className="text-xs text-slate-600 dark:text-slate-400">
                Cost Saved: ~₹{selectedScenario?.expectedCostSavingsCr || 0} Cr
              </span>
            </div>
          </div>

          {/* Scenario Option Selection Cards */}
          <div className="space-y-2">
            <span className="text-xs font-bold uppercase text-slate-700 dark:text-slate-300">
              Select Counterfactual Intervention Package:
            </span>

            <div className="space-y-2">
              {scenarios.map((scen: any, idx: number) => {
                const isSelected = idx === selectedScenarioIndex;
                return (
                  <button
                    key={scen.id || idx}
                    type="button"
                    onClick={() => setSelectedScenarioIndex(idx)}
                    className={`w-full text-left p-3.5 rounded-lg border transition flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                      isSelected
                        ? 'border-purple-500 bg-purple-50 dark:bg-purple-950/50 ring-1 ring-purple-500 shadow-sm'
                        : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60 hover:border-slate-300'
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded border uppercase ${
                          scen.riskDelta < 0 ? 'bg-emerald-100 text-emerald-800 border-emerald-300' : 'bg-rose-100 text-rose-800 border-rose-300'
                        }`}>
                          {scen.riskDelta < 0 ? `${scen.riskDelta} Risk Points` : 'Status Quo'}
                        </span>
                        <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                          {scen.title}
                        </h4>
                      </div>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                        {scen.description}
                      </p>
                    </div>

                    <div className="text-right shrink-0 text-xs">
                      <span className="text-slate-400 block text-[10px]">Predicted Risk:</span>
                      <strong className="text-slate-900 dark:text-white font-mono text-sm">
                        {scen.simulatedRiskScore}/100 [{scen.riskBand}]
                      </strong>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Scientific Disclaimer */}
          <div className="p-3 bg-slate-100 dark:bg-slate-800 rounded border border-slate-200 dark:border-slate-700 text-[11px] text-slate-500 dark:text-slate-400 space-y-1">
            <strong>Scientific & Administrative Guardrail:</strong>
            <p>
              These simulations are model-based counterfactual estimates generated from historical cross-project correlation benchmarks. They do not assert mathematical causality or represent statutory contract modifications.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-3 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 shrink-0 font-mono">
          <button
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 rounded transition"
          >
            Close Simulator
          </button>
        </div>
      </div>
    </div>
  );
};
