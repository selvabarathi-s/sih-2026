import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { groundedAssistantService, GroundedAssistantResponse } from '../services/groundedAssistantService';
import { useDatasetMode } from '../context/DatasetModeContext';
import {
  BotMessageSquare,
  Send,
  User,
  Sparkles,
  ExternalLink,
  ShieldCheck,
  HelpCircle,
  Clock,
  ArrowRight,
  RotateCcw,
  CheckCircle2,
  Database,
} from 'lucide-react';

export const AssistantPage: React.FC = () => {
  const navigate = useNavigate();
  const { isRealMode, isDemoMode } = useDatasetMode();

  const getInitialMessage = (): GroundedAssistantResponse => ({
    id: 'init-1',
    sender: 'assistant',
    timestamp: 'Just now',
    content: isRealMode
      ? `### Welcome to PAIMANA Predict Intelligence Copilot (Real Data Mode)

I am your **Grounded Infrastructure Assistant**, linked directly to the **1,981 authentic April 2026 PAIMANA projects** and multi-snapshot historical trajectory data.

**You can ask me to:**
• **Lookup Real Projects:** *"Tell me about BharatNet (PAI-706775)"*
• **Analyze Portfolio Metrics:** *"What is the April 2026 portfolio summary?"*
• **Inspect Cost Escalations:** *"Which projects have the highest cost growth?"*
• **Compare Multi-Period Trajectory:** *"What changed in BharatNet across reporting periods?"*`
      : `### Welcome to PAIMANA Predict Intelligence Copilot (AI Demonstration Mode)

I am your **Grounded Infrastructure Decision-Support Assistant**, linked directly to the enriched research telemetry database, ML prediction models, and the prescriptive risk engine.

**You can ask me to:**
• **Explain Project Risk:** *"Why is PJ-1042 high risk?"*
• **Forecast Schedule Delay:** *"What is the predicted delay for PJ-1042?"*
• **Prescribe Interventions:** *"What should we do about PJ-1042?"*
• **Evaluate ML Performance:** *"Which model performs best?"*`,
    suggestedQuestions: isRealMode
      ? [
          'Tell me about BharatNet (PAI-706775)',
          'What is the April 2026 portfolio summary?',
          'What is BharatNet\'s predicted 7-month delay?',
          'Which model performs best on research data?',
        ]
      : [
          'Why is PJ-1042 high risk?',
          'What is the predicted delay for PJ-1042?',
          'What should we do about PJ-1042?',
          'Which model performs best?',
        ],
  });

  const [messages, setMessages] = useState<GroundedAssistantResponse[]>([getInitialMessage()]);
  const [inputQuery, setInputQuery] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isProcessing]);

  const handleSend = (textToSend?: string) => {
    const q = textToSend || inputQuery;
    if (!q.trim() || isProcessing) return;

    const userMsg: GroundedAssistantResponse = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      content: q,
    };

    setMessages(prev => [...prev, userMsg]);
    setInputQuery('');
    setIsProcessing(true);

    setTimeout(() => {
      const response = groundedAssistantService.processQuery(q);
      setMessages(prev => [...prev, response]);
      setIsProcessing(false);
    }, 400);
  };

  return (
    <div className="space-y-4 max-w-5xl mx-auto h-[calc(100vh-140px)] flex flex-col">
      {/* Copilot Header */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-4 shrink-0 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-blue-600 text-white shadow-md">
            <BotMessageSquare className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base font-bold text-slate-900 dark:text-white tracking-tight">
                PAIMANA Grounded Intelligence Assistant
              </h1>
              {isRealMode ? (
                <span className="text-[10px] font-mono px-2 py-0.2 rounded bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 flex items-center gap-1">
                  <Database className="w-2.5 h-2.5" />
                  <span>REAL PAIMANA MODE (1,981 Projects)</span>
                </span>
              ) : (
                <span className="text-[10px] font-mono px-2 py-0.2 rounded bg-purple-50 dark:bg-purple-950 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800 flex items-center gap-1">
                  <Sparkles className="w-2.5 h-2.5" />
                  <span>SYNTHETIC AI DEMO MODE</span>
                </span>
              )}
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Zero hallucination • Grounded in {isRealMode ? '1,981 authentic Table 6 project records' : 'research telemetry and ML models'}.
            </p>
          </div>
        </div>

        <button
          onClick={() => setMessages([getInitialMessage()])}
          className="p-2 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white bg-slate-50 dark:bg-slate-950 rounded border border-slate-200 dark:border-slate-800 text-xs flex items-center gap-1 transition"
          title="Reset Conversation"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Reset</span>
        </button>
      </div>

      {/* Chat Messages Scrollable Canvas */}
      <div className="flex-1 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg p-4 overflow-y-auto space-y-4 shadow-inner">
        {messages.map(msg => (
          <div
            key={msg.id}
            className={`flex items-start gap-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {msg.sender === 'assistant' && (
              <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center shrink-0 mt-1 shadow-md">
                <BotMessageSquare className="w-4 h-4" />
              </div>
            )}

            <div
              className={`max-w-[85%] rounded-xl p-4 text-xs space-y-3 leading-relaxed shadow-sm ${
                msg.sender === 'user'
                  ? 'bg-blue-600 text-white rounded-tr-none'
                  : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 rounded-tl-none'
              }`}
            >
              <div className="flex items-center justify-between text-[10px] opacity-70 pb-1 border-b border-black/10 dark:border-white/10">
                <span className="font-semibold">{msg.sender === 'user' ? 'You' : 'PAIMANA Copilot'}</span>
                <span>{msg.timestamp}</span>
              </div>

              {/* Message Markdown-like Content */}
              <div className="space-y-2 whitespace-pre-line leading-relaxed font-sans">
                {msg.content}
              </div>

              {/* Grounded Evidence Card */}
              {msg.evidence && (
                <div className="mt-3 p-3 bg-slate-50 dark:bg-slate-950/80 rounded-lg border border-slate-200 dark:border-slate-800 space-y-2 text-[11px] font-mono">
                  <div className="flex items-center gap-1.5 text-blue-600 dark:text-blue-400 font-bold uppercase text-[10px]">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                    <span>Grounded Evidence Matrix</span>
                  </div>

                  {msg.evidence.metrics && (
                    <div className="grid grid-cols-2 gap-2 pt-1">
                      {Object.entries(msg.evidence.metrics).map(([k, v]) => (
                        <div key={k} className="p-1.5 bg-white dark:bg-slate-900 rounded border border-slate-200 dark:border-slate-800">
                          <span className="text-slate-400 text-[9px] block uppercase">{k}</span>
                          <span className="text-slate-900 dark:text-white font-bold">{v}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {msg.evidence.dataSource && (
                    <div className="text-[10px] text-slate-500 dark:text-slate-400 pt-1 border-t border-slate-200 dark:border-slate-800 font-sans">
                      Source: <strong>{msg.evidence.dataSource}</strong>
                    </div>
                  )}
                </div>
              )}

              {/* Navigation Action Button */}
              {msg.navigationAction && (
                <button
                  onClick={() => {
                    if (msg.navigationAction?.type === 'PROJECT' && msg.navigationAction.targetId) {
                      navigate(`/projects/${msg.navigationAction.targetId}`);
                    } else if (msg.navigationAction?.type === 'PREDICTIONS') {
                      navigate('/predictions');
                    } else if (msg.navigationAction?.type === 'HEALTH') {
                      navigate('/data-health');
                    }
                  }}
                  className="w-full mt-2 py-2 px-3 bg-blue-50 dark:bg-blue-950 hover:bg-blue-100 dark:hover:bg-blue-900/50 text-blue-700 dark:text-blue-300 font-semibold rounded-md border border-blue-200 dark:border-blue-800 flex items-center justify-between transition"
                >
                  <span>{msg.navigationAction.label}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}

              {/* Suggested Follow-up Questions */}
              {msg.suggestedQuestions && msg.suggestedQuestions.length > 0 && (
                <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-1.5">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block font-mono">
                    Suggested Next Inquiries
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {msg.suggestedQuestions.map((sq, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleSend(sq)}
                        className="text-left px-2.5 py-1 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded text-[11px] text-slate-700 dark:text-slate-200 transition font-medium"
                      >
                        "{sq}"
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {msg.sender === 'user' && (
              <div className="w-8 h-8 rounded-lg bg-slate-700 text-white flex items-center justify-center shrink-0 mt-1 shadow-md">
                <User className="w-4 h-4" />
              </div>
            )}
          </div>
        ))}

        {isProcessing && (
          <div className="flex items-center gap-2 text-xs text-slate-500 font-mono italic">
            <BotMessageSquare className="w-4 h-4 animate-bounce text-blue-500" />
            <span>Consulting project telemetry and grounding index...</span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Composer */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-2.5 shrink-0 flex items-center gap-2 shadow-sm">
        <input
          type="text"
          value={inputQuery}
          onChange={e => setInputQuery(e.target.value)}
          onKeyDown={e => {
            if (e.key === 'Enter') handleSend();
          }}
          placeholder={
            isRealMode
              ? "Ask about real projects (e.g., 'Tell me about BharatNet', 'April 2026 portfolio')..."
              : "Ask about project risks, delay forecasts, ML models (e.g., 'Why is PJ-1042 high risk?')..."
          }
          className="flex-1 bg-transparent px-3 py-1.5 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none"
        />

        <button
          onClick={() => handleSend()}
          disabled={!inputQuery.trim() || isProcessing}
          className="p-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-md transition shadow-sm"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
