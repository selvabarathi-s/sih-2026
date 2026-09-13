import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { assistantApi } from '../api/assistant';
import { groundedAssistantService, GroundedAssistantResponse } from '../services/groundedAssistantService';
import {
  BotMessageSquare,
  Send,
  User,
  ShieldCheck,
  ArrowRight,
  RotateCcw,
  Database,
  ExternalLink,
} from 'lucide-react';

export const AssistantPage: React.FC = () => {
  const navigate = useNavigate();

  const getInitialMessage = (): GroundedAssistantResponse => ({
    id: 'init-1',
    sender: 'assistant',
    timestamp: 'Just now',
    content: `### Welcome to PAIMANA Grounded Intelligence Copilot

I am your **Grounded Infrastructure Assistant**, linked directly to the **1,981 authentic April 2026 PAIMANA projects** and **10 monthly historical reporting snapshots** from the Ministry of Statistics & Programme Implementation (MoSPI).

**You can ask me to:**
• **Lookup Real Projects:** *"Tell me about BharatNet (PAI-706775)"* or *"Mumbai-Ahmedabad High Speed Rail (PAI-705728)"*
• **Analyze Portfolio Metrics:** *"What is the April 2026 portfolio summary?"*
• **Inspect Cost Growth:** *"Which projects have the highest cost escalations?"*
• **Query Sectoral Undertakings:** *"Show me Railways sector projects"* or *"Road Transport sector"*
• **Review Multi-Snapshot Trajectories:** *"How many historical reporting snapshots are available?"*`,
    suggestedQuestions: [
      'Tell me about BharatNet (PAI-706775)',
      'What is the April 2026 portfolio summary?',
      'Which projects have the highest cost escalations?',
      'Tell me about Mumbai-Ahmedabad High Speed Rail (PAI-705728)',
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

  const handleSend = async (textToSend?: string) => {
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

    try {
      // 1. Try backend API query
      const apiRes = await assistantApi.query(q, 'REAL_PAIMANA');
      if (apiRes.data?.answer) {
        const botMsg: GroundedAssistantResponse = {
          id: `bot-${Date.now()}`,
          sender: 'assistant',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          content: apiRes.data.answer,
          evidence: apiRes.data.evidence as any,
        };
        setMessages(prev => [...prev, botMsg]);
        setIsProcessing(false);
        return;
      }
    } catch (err) {
      console.warn('Backend assistant query failed, using local grounding:', err);
    }

    // 2. Fallback to local grounding engine
    setTimeout(() => {
      const response = groundedAssistantService.processQuery(q);
      setMessages(prev => [...prev, response]);
      setIsProcessing(false);
    }, 200);
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
              <h1 className="text-base font-bold text-slate-900 dark:text-white">
                PAIMANA Grounded Intelligence Assistant
              </h1>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 font-semibold flex items-center gap-1">
                <Database className="w-3 h-3" />
                <span>REAL PAIMANA MODE (1,981 Projects)</span>
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Zero hallucination • Grounded in 1,981 authentic Table 6 project records.
            </p>
          </div>
        </div>

        <button
          onClick={() => setMessages([getInitialMessage()])}
          className="p-1.5 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white border border-slate-200 dark:border-slate-800 rounded hover:bg-slate-50 dark:hover:bg-slate-800 transition text-xs flex items-center gap-1 font-medium"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset</span>
        </button>
      </div>

      {/* Messages Feed */}
      <div className="flex-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-4 overflow-y-auto space-y-4 shadow-sm">
        {messages.map(msg => (
          <div
            key={msg.id}
            className={`flex gap-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {msg.sender === 'assistant' && (
              <div className="w-7 h-7 rounded bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-sm mt-0.5">
                <BotMessageSquare className="w-4 h-4" />
              </div>
            )}

            <div
              className={`max-w-2xl rounded-lg p-4 text-xs ${
                msg.sender === 'user'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 shadow-sm'
              }`}
            >
              <div className="flex items-center justify-between gap-4 mb-2 pb-1.5 border-b border-slate-200/50 dark:border-slate-800/80">
                <span className="font-semibold text-[11px] font-mono opacity-90">
                  {msg.sender === 'user' ? 'You' : 'PAIMANA Copilot'}
                </span>
                <span className="text-[10px] font-mono opacity-70">{msg.timestamp}</span>
              </div>

              <div className="whitespace-pre-line leading-relaxed font-sans">{msg.content}</div>

              {/* Evidence and Project Links */}
              {Array.isArray(msg.evidence) && msg.evidence.length > 0 && (
                <div className="mt-3 pt-3 border-t border-slate-200 dark:border-slate-800 space-y-1.5">
                  <span className="text-[10px] font-mono uppercase font-bold text-slate-400 block">
                    Grounded Project Telemetry Evidence:
                  </span>
                  {(msg.evidence as any[]).map((ev: any, idx: number) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-2 bg-white dark:bg-slate-900 rounded border border-slate-200 dark:border-slate-800 text-[11px]"
                    >
                      <span className="font-semibold">{ev.project_name || ev.projectId} ({ev.project_id || ev.projectId})</span>
                      <button
                        onClick={() => navigate(`/projects/${ev.project_id || ev.projectId}`)}
                        className="text-blue-600 hover:text-blue-500 flex items-center gap-1 font-semibold"
                      >
                        <span>View Project</span>
                        <ExternalLink className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Suggested Questions */}
              {msg.suggestedQuestions && msg.suggestedQuestions.length > 0 && (
                <div className="mt-4 pt-3 border-t border-slate-200/60 dark:border-slate-800/80">
                  <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2 font-mono">
                    Suggested Next Inquiries
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {msg.suggestedQuestions.map((q, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleSend(q)}
                        className="text-left px-2.5 py-1 rounded bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-blue-500 text-[11px] text-slate-700 dark:text-slate-300 font-medium transition"
                      >
                        "{q}"
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {msg.sender === 'user' && (
              <div className="w-7 h-7 rounded bg-slate-800 dark:bg-slate-700 text-white flex items-center justify-center shrink-0 shadow-sm mt-0.5">
                <User className="w-4 h-4" />
              </div>
            )}
          </div>
        ))}

        {isProcessing && (
          <div className="flex gap-3 justify-start items-center">
            <div className="w-7 h-7 rounded bg-blue-600 text-white flex items-center justify-center shadow-sm">
              <BotMessageSquare className="w-4 h-4 animate-pulse" />
            </div>
            <div className="p-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-xs text-slate-500 font-mono">
              Retrieving telemetry across 1,981 projects...
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Bar */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-3 shrink-0 shadow-sm">
        <form
          onSubmit={e => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            value={inputQuery}
            onChange={e => setInputQuery(e.target.value)}
            placeholder="Ask anything about 1,981 projects (e.g. 'Tell me about BharatNet PAI-706775' or 'What is total cost growth?')..."
            className="flex-1 px-3.5 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-md text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-blue-500"
          />
          <button
            type="submit"
            disabled={!inputQuery.trim() || isProcessing}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white text-xs font-semibold rounded-md transition flex items-center gap-1.5 shadow-sm"
          >
            <span>Ask</span>
            <Send className="w-3.5 h-3.5" />
          </button>
        </form>
      </div>
    </div>
  );
};
