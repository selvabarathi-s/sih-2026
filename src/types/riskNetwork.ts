export type NodeType = 'ROOT_CAUSE' | 'INTERMEDIATE_EFFECT' | 'DOWNSTREAM_CONSEQUENCE' | 'TERMINAL_IMPACT';
export type NodeSeverity = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';

export interface RiskNode {
  id: string;
  label: string;
  category: string;
  type: NodeType;
  severity: NodeSeverity;
  currentValue: string;
  expectedValue: string;
  variance: string;
  impactPoints: number;
  evidence: string;
  explanation: string;
  timeDelayEffect: string;
  costEscalationEffect: string;
  mitigation: string;
  downstreamEffects: string[];
  x?: number;
  y?: number;
}

export interface RiskEdge {
  id: string;
  source: string;
  target: string;
  label?: string;
  animated?: boolean;
}

export interface RiskPropagationChain {
  projectId: string;
  projectName: string;
  rootCausesCount: number;
  downstreamRisksCount: number;
  estimatedCostExposureCr: number;
  estimatedDelayMonths: number;
  summaryNarrative: string;
  nodes: RiskNode[];
  edges: RiskEdge[];
}

export interface DecisionBrief {
  projectId: string;
  projectName: string;
  ministry: string;
  sector: string;
  state: string;
  riskScore: number;
  riskLevel: string;
  predictedDelayMonths: number;
  delayProbability: number;
  predictedCostExposureCr: number;
  costOverrunProbability: number;
  topDrivers: { name: string; impact: number; evidence: string }[];
  riskChainSummary: string[];
  priorityActions: {
    priority: number;
    title: string;
    action: string;
    owner: string;
    benefit: string;
    urgency: string;
  }[];
  generatedAt: string;
}
