import React, { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { projectService } from '../services/projectService';
import { riskNetworkService } from '../services/riskNetworkService';
import { RiskNode, NodeType } from '../types/riskNetwork';
import {
  GitFork,
  ArrowRight,
  ShieldAlert,
  Clock,
  IndianRupee,
  Layers,
  Sparkles,
  Info,
  Building,
  CheckCircle2,
  ExternalLink,
  ChevronRight,
} from 'lucide-react';

export const RiskNetworkPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const projectId = searchParams.get('projectId') || 'PJ-1042';

  const project = projectService.getProjectById(projectId) || projectService.getHeroProject();
  const chain = riskNetworkService.getPropagationChain(project);

  const [selectedNodeId, setSelectedNodeId] = useState<string>(
    chain.nodes[0]?.id || 'node-root-land'
  );

  const selectedNode = chain.nodes.find(n => n.id === selectedNodeId) || chain.nodes[0];

  const rootNodes = chain.nodes.filter(n => n.type === 'ROOT_CAUSE');
  const intermediateNodes = chain.nodes.filter(n => n.type === 'INTERMEDIATE_EFFECT');
  const downstreamNodes = chain.nodes.filter(n => n.type === 'DOWNSTREAM_CONSEQUENCE');
  const terminalNodes = chain.nodes.filter(n => n.type === 'TERMINAL_IMPACT');

  const getNodeBorder = (node: RiskNode) => {
    if (node.id === selectedNodeId) {
      return 'ring-2 ring-blue-500 border-blue-500 bg-blue-50/80 dark:bg-slate-900 shadow-md scale-[1.02]';
    }
    if (node.severity === 'CRITICAL') {
      return 'border-red-200 dark:border-red-800/80 bg-red-50/50 dark:bg-slate-950/90 hover:border-red-400 hover:bg-red-50 dark:hover:bg-slate-900';
    }
    if (node.severity === 'HIGH') {
      return 'border-orange-200 dark:border-orange-800/80 bg-orange-50/50 dark:bg-slate-950/90 hover:border-orange-400 hover:bg-orange-50 dark:hover:bg-slate-900';
    }
    return 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950/90 hover:border-slate-300 dark:hover:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-900';
  };

  return (
    <div className="space-y-6">
      {/* Header & Project Selector */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-6 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-800 font-mono">
                Risk Propagation Network
              </span>
              <span className="text-xs text-slate-400 dark:text-slate-500">•</span>
              <span className="text-xs text-slate-500 dark:text-slate-400">One Issue ➔ Cascading Multi-Tier Impacts</span>
            </div>
            <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Risk Propagation Network — {project.project_id}: {project.project_name}
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-3xl">
              Interactive multi-branch dependency graph tracing how primary Right-of-Way and utility frictions propagate downstream into milestone delays, COD extensions, and terminal cost escalations.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <select
              value={project.project_id}
              onChange={e => {
                setSearchParams({ projectId: e.target.value });
                const nextProj = projectService.getProjectById(e.target.value);
                if (nextProj) {
                  const nextChain = riskNetworkService.getPropagationChain(nextProj);
                  setSelectedNodeId(nextChain.nodes[0]?.id || '');
                }
              }}
              aria-label="Select Project for Propagation Network"
              className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-blue-500 font-mono"
            >
              <option value="PJ-1042">PJ-1042: Eastern Freight Corridor Expansion</option>
              {projectService.getAllProjects().slice(1, 25).map(p => (
                <option key={p.project_id} value={p.project_id}>
                  {p.project_id}: {p.project_name.slice(0, 35)}...
                </option>
              ))}
            </select>

            <button
              onClick={() => navigate(`/projects/${project.project_id}`)}
              className="px-3.5 py-2 text-xs font-semibold bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-white rounded border border-slate-200 dark:border-slate-700 flex items-center gap-1.5 shrink-0 transition"
            >
              <span>Project Detail</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Propagation Summary Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-4 shadow-sm">
          <span className="text-xs text-slate-500 dark:text-slate-400 uppercase font-semibold font-mono">Identified Root Causes</span>
          <p className="text-2xl font-bold font-mono text-blue-600 dark:text-blue-400 mt-1">{chain.rootCausesCount} Nodes</p>
          <span className="text-[10px] text-slate-400 dark:text-slate-500">Primary bottleneck points</span>
        </div>
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-4 shadow-sm">
          <span className="text-xs text-slate-500 dark:text-slate-400 uppercase font-semibold font-mono">Downstream Impact Nodes</span>
          <p className="text-2xl font-bold font-mono text-purple-600 dark:text-purple-400 mt-1">{chain.downstreamRisksCount} Nodes</p>
          <span className="text-[10px] text-slate-400 dark:text-slate-500">Cascading consequences</span>
        </div>
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-4 shadow-sm">
          <span className="text-xs text-slate-500 dark:text-slate-400 uppercase font-semibold font-mono">Predicted Delay Exposure</span>
          <p className="text-2xl font-bold font-mono text-orange-600 dark:text-orange-400 mt-1">+{chain.estimatedDelayMonths} Months</p>
          <span className="text-[10px] text-slate-400 dark:text-slate-500">Schedule duration impact</span>
        </div>
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-4 shadow-sm">
          <span className="text-xs text-slate-500 dark:text-slate-400 uppercase font-semibold font-mono">Predicted Cost Exposure</span>
          <p className="text-2xl font-bold font-mono text-red-600 dark:text-red-400 mt-1">₹{chain.estimatedCostExposureCr.toLocaleString()} Cr</p>
          <span className="text-[10px] text-slate-400 dark:text-slate-500">Compounded budget exposure</span>
        </div>
      </div>

      {/* Narrative Callout Banner */}
      <div className="p-4 bg-white dark:bg-slate-900/90 border border-blue-200 dark:border-blue-900/50 rounded-lg flex items-start gap-3 text-xs text-slate-700 dark:text-slate-300 shadow-sm">
        <Sparkles className="w-5 h-5 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
        <div>
          <strong className="text-slate-900 dark:text-white font-semibold">Systemic Propagation Assessment:</strong> {chain.summaryNarrative}
        </div>
      </div>

      {/* Multi-Column Tiered Interactive Network Canvas & Inspector Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Visual Multi-Tier Graph Canvas (8 cols) */}
        <div className="lg:col-span-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 flex flex-col justify-between shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3 mb-6">
            <div>
              <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider font-mono">
                Multi-Branch Causality Network Canvas
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">Click on any node to load full diagnostic & downstream metrics</p>
            </div>
            <span className="text-[10px] font-mono bg-slate-100 dark:bg-slate-950 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800 px-2 py-0.5 rounded">
              Interactive Graph View
            </span>
          </div>

          {/* 4-Tier Network Columns */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 relative">
            {/* Column 1: Root Causes */}
            <div className="space-y-3">
              <div className="text-[10px] font-bold uppercase tracking-wider text-blue-700 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/40 px-2 py-1 rounded text-center border border-blue-200 dark:border-blue-900/50 font-mono">
                1. Root Causes ({rootNodes.length})
              </div>
              {rootNodes.map(node => (
                <div
                  key={node.id}
                  onClick={() => setSelectedNodeId(node.id)}
                  className={`p-3.5 rounded-lg border cursor-pointer transition-all shadow-sm ${getNodeBorder(node)}`}
                >
                  <div className="flex items-center justify-between gap-1 mb-1">
                    <span className="text-[9px] font-bold uppercase px-1.5 py-0.2 rounded bg-blue-100 dark:bg-blue-500/20 text-blue-800 dark:text-blue-400 font-mono">
                      Root Cause
                    </span>
                    <span className="text-red-600 dark:text-red-400 font-mono text-[10px] font-bold">+{node.impactPoints} pts</span>
                  </div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white leading-tight">{node.label}</h4>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1 font-mono">{node.currentValue}</p>
                </div>
              ))}
            </div>

            {/* Column 2: Intermediate Effects */}
            <div className="space-y-3">
              <div className="text-[10px] font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 px-2 py-1 rounded text-center border border-amber-200 dark:border-amber-900/50 font-mono">
                2. Intermediate ({intermediateNodes.length})
              </div>
              {intermediateNodes.map(node => (
                <div
                  key={node.id}
                  onClick={() => setSelectedNodeId(node.id)}
                  className={`p-3.5 rounded-lg border cursor-pointer transition-all shadow-sm ${getNodeBorder(node)}`}
                >
                  <div className="flex items-center justify-between gap-1 mb-1">
                    <span className="text-[9px] font-bold uppercase px-1.5 py-0.2 rounded bg-amber-100 dark:bg-amber-500/20 text-amber-800 dark:text-amber-400 font-mono">
                      Execution Lag
                    </span>
                    <span className="text-red-600 dark:text-red-400 font-mono text-[10px] font-bold">+{node.impactPoints} pts</span>
                  </div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white leading-tight">{node.label}</h4>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1 font-mono">{node.currentValue}</p>
                </div>
              ))}
            </div>

            {/* Column 3: Downstream Consequences */}
            <div className="space-y-3">
              <div className="text-[10px] font-bold uppercase tracking-wider text-purple-700 dark:text-purple-400 bg-purple-50 dark:bg-purple-950/40 px-2 py-1 rounded text-center border border-purple-200 dark:border-purple-900/50 font-mono">
                3. Consequence ({downstreamNodes.length})
              </div>
              {downstreamNodes.map(node => (
                <div
                  key={node.id}
                  onClick={() => setSelectedNodeId(node.id)}
                  className={`p-3.5 rounded-lg border cursor-pointer transition-all shadow-sm ${getNodeBorder(node)}`}
                >
                  <div className="flex items-center justify-between gap-1 mb-1">
                    <span className="text-[9px] font-bold uppercase px-1.5 py-0.2 rounded bg-purple-100 dark:bg-purple-500/20 text-purple-800 dark:text-purple-400 font-mono">
                      Slippage
                    </span>
                    <span className="text-red-600 dark:text-red-400 font-mono text-[10px] font-bold">+{node.impactPoints} pts</span>
                  </div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white leading-tight">{node.label}</h4>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1 font-mono">{node.currentValue}</p>
                </div>
              ))}
            </div>

            {/* Column 4: Terminal Impact */}
            <div className="space-y-3">
              <div className="text-[10px] font-bold uppercase tracking-wider text-red-700 dark:text-red-400 bg-red-50 dark:bg-red-950/40 px-2 py-1 rounded text-center border border-red-200 dark:border-red-900/50 font-mono">
                4. Terminal Impact ({terminalNodes.length})
              </div>
              {terminalNodes.map(node => (
                <div
                  key={node.id}
                  onClick={() => setSelectedNodeId(node.id)}
                  className={`p-3.5 rounded-lg border cursor-pointer transition-all shadow-sm ${getNodeBorder(node)}`}
                >
                  <div className="flex items-center justify-between gap-1 mb-1">
                    <span className="text-[9px] font-bold uppercase px-1.5 py-0.2 rounded bg-red-100 dark:bg-red-500/20 text-red-800 dark:text-red-400 font-mono">
                      Escalation
                    </span>
                    <span className="text-red-600 dark:text-red-400 font-mono text-[10px] font-bold">+{node.impactPoints} pts</span>
                  </div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white leading-tight">{node.label}</h4>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1 font-mono">{node.currentValue}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-8 pt-4 border-t border-slate-200 dark:border-slate-800 text-[11px] text-slate-500 flex items-center justify-between">
            <span>Flow: Root Causes ➔ Intermediate Stoppages ➔ Schedule Extensions ➔ Capital Overruns</span>
            <span className="font-mono text-blue-600 dark:text-blue-400">{chain.edges.length} Active Causality Edges</span>
          </div>
        </div>

        {/* Selected Node Diagnostic Inspector Panel (4 cols) */}
        <div className="lg:col-span-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 flex flex-col justify-between shadow-sm">
          <div className="space-y-4">
            <div className="border-b border-slate-200 dark:border-slate-800 pb-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono text-blue-600 dark:text-blue-400 font-bold uppercase tracking-wider">
                  Node Diagnostic Inspector
                </span>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase font-mono ${
                  selectedNode.severity === 'CRITICAL'
                    ? 'bg-red-50 dark:bg-red-500/20 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-500/40'
                    : 'bg-orange-50 dark:bg-orange-500/20 text-orange-700 dark:text-orange-400 border border-orange-200 dark:border-orange-500/40'
                }`}>
                  {selectedNode.severity}
                </span>
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white mt-1">{selectedNode.label}</h3>
              <span className="text-xs text-slate-500 dark:text-slate-400">{selectedNode.category}</span>
            </div>

            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-2 bg-slate-50 dark:bg-slate-950 p-2.5 rounded border border-slate-200 dark:border-slate-800 font-mono text-[11px]">
                <div>
                  <span className="text-slate-500 block text-[10px] font-sans">Current Telemetry</span>
                  <span className="text-slate-900 dark:text-white font-bold">{selectedNode.currentValue}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px] font-sans">Target Baseline</span>
                  <span className="text-blue-600 dark:text-blue-400 font-bold">{selectedNode.expectedValue}</span>
                </div>
              </div>

              <div className="bg-slate-50 dark:bg-slate-950 p-3 rounded border border-slate-200 dark:border-slate-800 space-y-1">
                <span className="text-slate-600 dark:text-slate-400 font-semibold block text-[11px]">Verified Ground Evidence:</span>
                <p className="text-slate-700 dark:text-slate-300 text-xs">{selectedNode.evidence}</p>
              </div>

              <div className="bg-slate-50 dark:bg-slate-950 p-3 rounded border border-slate-200 dark:border-slate-800 space-y-1">
                <span className="text-slate-600 dark:text-slate-400 font-semibold block text-[11px]">Causality Mechanism:</span>
                <p className="text-slate-700 dark:text-slate-300 text-xs">{selectedNode.explanation}</p>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="bg-slate-50 dark:bg-slate-950 p-2.5 rounded border border-slate-200 dark:border-slate-800">
                  <span className="text-orange-600 dark:text-orange-400 font-semibold block text-[10px]">Schedule Effect</span>
                  <p className="text-slate-700 dark:text-slate-300 text-[11px] mt-0.5">{selectedNode.timeDelayEffect}</p>
                </div>
                <div className="bg-slate-50 dark:bg-slate-950 p-2.5 rounded border border-slate-200 dark:border-slate-800">
                  <span className="text-red-600 dark:text-red-400 font-semibold block text-[10px]">Financial Effect</span>
                  <p className="text-slate-700 dark:text-slate-300 text-[11px] mt-0.5">{selectedNode.costEscalationEffect}</p>
                </div>
              </div>

              <div className="bg-blue-50 dark:bg-blue-950/30 p-3 rounded border border-blue-200 dark:border-blue-800/50">
                <span className="text-blue-700 dark:text-blue-300 font-bold block text-[11px] mb-0.5">Target Mitigation Directive:</span>
                <p className="text-slate-800 dark:text-slate-200 text-xs">{selectedNode.mitigation}</p>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs">
            <span className="text-slate-600 dark:text-slate-400 font-mono">Impact: <strong className="text-red-600 dark:text-red-400">+{selectedNode.impactPoints} Risk Pts</strong></span>
            <button
              onClick={() => navigate(`/projects/${project.project_id}`)}
              className="text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300 font-semibold flex items-center gap-1"
            >
              <span>View Full Project Intelligence</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
