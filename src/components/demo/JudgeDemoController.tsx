import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Award,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  Sparkles,
  ExternalLink,
  Play,
  CheckCircle2,
} from 'lucide-react';

interface Stage {
  step: number;
  id: string;
  title: string;
  route: string;
  description: string;
}

export const JudgeDemoController: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [stages, setStages] = useState<Stage[]>([]);
  const [currentStep, setCurrentStep] = useState(1);
  const [isOpen, setIsOpen] = useState(true);

  useEffect(() => {
    fetch('/api/v1/demo/state')
      .then(res => res.json())
      .then(json => {
        if (json.data?.allStages) {
          setStages(json.data.allStages);
          setCurrentStep(json.data.activeStep || 1);
        }
      })
      .catch(() => {});
  }, []);

  const currentStage = stages.find(s => s.step === currentStep) || {
    step: 1,
    id: 'SELECT_PROJECT',
    title: '1. Select Critical Project',
    route: '/projects/PAI-706775',
    description: 'Inspect Hero Project PAI-706775 (BharatNet) under national surveillance.',
  };

  const handleGoToStep = async (stepNum: number) => {
    setCurrentStep(stepNum);
    try {
      await fetch(`/api/v1/demo/step/${stepNum}`, { method: 'POST' });
    } catch (e) {}

    const target = stages.find(s => s.step === stepNum);
    if (target?.route) {
      navigate(target.route);
    }
  };

  const handleReset = async () => {
    try {
      await fetch('/api/v1/demo/reset', { method: 'POST' });
    } catch (e) {}
    setCurrentStep(1);
    navigate('/projects/PAI-706775');
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 z-40 px-3.5 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-full shadow-lg flex items-center gap-2 text-xs font-bold font-mono transition"
        title="Open SIH Judge Demo Controller"
      >
        <Award className="w-4 h-4" />
        <span>Judge Demo Flow (Step {currentStep}/12)</span>
      </button>
    );
  }

  return (
    <aside
      aria-label="SIH 2026 Judge Demo Controller"
      className="bg-purple-950 text-white border-b border-purple-800/80 px-4 py-2 sticky top-0 z-40 shadow-md font-mono text-xs"
    >
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-2">
        {/* Left: Indicator & Stage Title */}
        <div className="flex items-center gap-2.5">
          <div className="flex items-center gap-1 bg-purple-900/80 px-2 py-0.5 rounded border border-purple-700 text-purple-200">
            <Award className="w-3.5 h-3.5 text-amber-400" />
            <span className="font-bold">SIH 2026 EVALUATOR MODE</span>
            <span className="text-purple-300">[{currentStep}/12]</span>
          </div>

          <div>
            <h4 className="font-bold text-white tracking-wide">
              {currentStage.title}
            </h4>
            <p className="text-[11px] text-purple-300 hidden sm:block">
              {currentStage.description}
            </p>
          </div>
        </div>

        {/* Right: Step Controls */}
        <div className="flex items-center gap-2 self-end md:self-auto">
          {/* Stage Dropdown */}
          <select
            value={currentStep}
            onChange={e => handleGoToStep(Number(e.target.value))}
            aria-label="Select Judge Demo Step"
            className="bg-purple-900 border border-purple-700 rounded px-2 py-1 text-xs text-white focus:outline-none font-mono"
          >
            {stages.map(s => (
              <option key={s.step} value={s.step}>
                {s.title}
              </option>
            ))}
          </select>

          {/* Prev / Next Buttons */}
          <button
            onClick={() => handleGoToStep(Math.max(1, currentStep - 1))}
            disabled={currentStep <= 1}
            className="p-1 rounded bg-purple-900 hover:bg-purple-800 disabled:opacity-40 border border-purple-700 transition"
            title="Previous Demo Stage"
            aria-label="Previous Demo Stage"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <button
            onClick={() => handleGoToStep(Math.min(stages.length || 12, currentStep + 1))}
            disabled={currentStep >= (stages.length || 12)}
            className="px-2.5 py-1 rounded bg-purple-600 hover:bg-purple-500 disabled:opacity-40 font-bold text-white transition flex items-center gap-1 shadow-sm"
            title="Next Demo Stage"
            aria-label="Next Demo Stage"
          >
            <span>Next</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>

          {/* Reset Demo State Button */}
          <button
            onClick={handleReset}
            className="p-1 rounded bg-purple-900 hover:bg-purple-800 text-purple-300 hover:text-white border border-purple-700 transition"
            title="Reset Demonstration to Initial State"
            aria-label="Reset Demonstration to Initial State"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={() => setIsOpen(false)}
            className="text-[10px] text-purple-400 hover:text-purple-200 px-1"
            title="Minimize controller"
            aria-label="Minimize Judge Demo Controller"
          >
            ✕
          </button>
        </div>
      </div>
    </aside>
  );
};
