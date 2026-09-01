import { Project } from '../types/project';
import { projectService } from './projectService';

export interface DriverConcentrationItem {
  id: string;
  name: string;
  category: string;
  affectedProjectsCount: number;
  criticalProjectsCount: number;
  pctOfHighCriticalAffected: number; // e.g. 72%
  avgImpactPoints: number;
  systemicSeverity: 'CRITICAL' | 'HIGH' | 'MEDIUM';
  description: string;
  topAffectedSectors: string[];
}

export interface EmergingTrendSignal {
  id: string;
  title: string;
  category: string;
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM';
  affectedCount: number;
  detectionCycle: string;
  signalDescription: string;
  leadTimeImpact: string;
}

class RiskIntelligenceService {
  /**
   * Calculates comprehensive portfolio risk intelligence aggregations.
   */
  public getRiskIntelligenceSummary() {
    const allProjects = projectService.getAllProjects();
    const totalProjects = allProjects.length;
    const criticalProjects = allProjects.filter(p => p.risk_level === 'CRITICAL');
    const highProjects = allProjects.filter(p => p.risk_level === 'HIGH');
    const highCriticalTotal = criticalProjects.length + highProjects.length;

    // Current Portfolio Risk Index & Period-over-Period Delta
    const currentRiskIndex = Math.round(allProjects.reduce((acc, p) => acc + p.risk_score, 0) / totalProjects);
    const previousRiskIndex = currentRiskIndex - 4; // Simulated previous reporting cycle (e.g. 64 -> 68)
    const riskIndexDelta = +4.0;

    // 1. Risk Driver Concentrations across all projects
    const driversConcentration: DriverConcentrationItem[] = [
      {
        id: 'drv-conc-land',
        name: 'Right-of-Way / Land Acquisition Handover',
        category: 'Statutory & Land',
        affectedProjectsCount: allProjects.filter(p => p.land_progress < p.land_target - 10).length,
        criticalProjectsCount: criticalProjects.filter(p => p.land_progress < p.land_target - 15).length,
        pctOfHighCriticalAffected: Math.round(
          (allProjects.filter(p => (p.risk_level === 'CRITICAL' || p.risk_level === 'HIGH') && p.land_progress < p.land_target - 10).length /
            Math.max(1, highCriticalTotal)) *
            100
        ),
        avgImpactPoints: 17.5,
        systemicSeverity: 'CRITICAL',
        description: 'Non-contiguous linear RoW handover halting mechanized earthworks and piling access in highway, railway, and transmission corridors.',
        topAffectedSectors: ['Transport & Logistics', 'Energy', 'Coal'],
      },
      {
        id: 'drv-conc-milestone',
        name: 'Sequential Intermediate Milestone Slippage',
        category: 'Execution Deliverables',
        affectedProjectsCount: allProjects.filter(p => p.milestones_delayed > 0).length,
        criticalProjectsCount: criticalProjects.filter(p => p.milestones_delayed >= 2).length,
        pctOfHighCriticalAffected: Math.round(
          (allProjects.filter(p => (p.risk_level === 'CRITICAL' || p.risk_level === 'HIGH') && p.milestones_delayed > 0).length /
            Math.max(1, highCriticalTotal)) *
            100
        ),
        avgImpactPoints: 14.2,
        systemicSeverity: 'CRITICAL',
        description: 'Cumulative failure of interim technical milestones causing irreversible critical-path compression.',
        topAffectedSectors: ['Transport & Logistics', 'Water & Sanitation', 'Social Infrastructure'],
      },
      {
        id: 'drv-conc-utility',
        name: 'High-Tension Utility Relocation Bottlenecks',
        category: 'Inter-Agency Clearances',
        affectedProjectsCount: allProjects.filter(p => p.utility_shift_status === 'Critical Delay' || p.utility_shift_status === 'In Progress').length,
        criticalProjectsCount: criticalProjects.filter(p => p.utility_shift_status === 'Critical Delay').length,
        pctOfHighCriticalAffected: Math.round(
          (allProjects.filter(p => (p.risk_level === 'CRITICAL' || p.risk_level === 'HIGH') && (p.utility_shift_status === 'Critical Delay' || p.utility_shift_status === 'In Progress')).length /
            Math.max(1, highCriticalTotal)) *
            100
        ),
        avgImpactPoints: 8.8,
        systemicSeverity: 'HIGH',
        description: 'Delayed transmission line shutdowns and underground pipeline crossings blocking bridge superstructure erection.',
        topAffectedSectors: ['Transport & Logistics', 'Energy', 'Mining'],
      },
      {
        id: 'drv-conc-exp',
        name: 'Capital Expenditure & Cash Flow Trajectory Lag',
        category: 'Financial Liquidity',
        affectedProjectsCount: allProjects.filter(p => (p.planned_progress - p.financial_progress) > 10).length,
        criticalProjectsCount: criticalProjects.filter(p => (p.planned_progress - p.financial_progress) > 15).length,
        pctOfHighCriticalAffected: Math.round(
          (allProjects.filter(p => (p.risk_level === 'CRITICAL' || p.risk_level === 'HIGH') && (p.planned_progress - p.financial_progress) > 10).length /
            Math.max(1, highCriticalTotal)) *
            100
        ),
        avgImpactPoints: 11.4,
        systemicSeverity: 'HIGH',
        description: 'Disputed variation clauses and withheld price-escalation invoices reducing contractor liquidity and workforce deployment.',
        topAffectedSectors: ['Transport & Logistics', 'Steel', 'Water & Sanitation'],
      },
      {
        id: 'drv-conc-labour',
        name: 'Contractor Workforce & Material Supply Constraints',
        category: 'Operational Resources',
        affectedProjectsCount: allProjects.filter(p => p.labour_status === 'Severe Shortage' || p.material_status === 'Cost Inflation' || p.material_status === 'Supply Disrupted').length,
        criticalProjectsCount: criticalProjects.filter(p => p.labour_status === 'Severe Shortage').length,
        pctOfHighCriticalAffected: Math.round(
          (allProjects.filter(p => (p.risk_level === 'CRITICAL' || p.risk_level === 'HIGH') && (p.labour_status === 'Severe Shortage' || p.material_status === 'Cost Inflation')).length /
            Math.max(1, highCriticalTotal)) *
            100
        ),
        avgImpactPoints: 7.9,
        systemicSeverity: 'MEDIUM',
        description: 'Peak-to-actual on-site labour mobilization gaps and regional cement/steel spot price spikes.',
        topAffectedSectors: ['Social Infrastructure', 'Steel', 'Mining'],
      },
    ];

    // 2. Emerging Risk Trends (Deterioration Patterns from telemetry)
    const emergingTrends: EmergingTrendSignal[] = [
      {
        id: 'trend-1',
        title: 'Milestone Slippage Surge across Linear Transport Corridors',
        category: 'Critical Path Velocity',
        severity: 'CRITICAL',
        affectedCount: 14,
        detectionCycle: 'Last 3 Reporting Cycles (Jun - Aug 2026)',
        signalDescription: '14 Transport & Rail corridor projects experienced 2 or more sequential milestone delays past revised target windows.',
        leadTimeImpact: 'Yields 4.3 months advance warning before projected commercial COD slippage.',
      },
      {
        id: 'trend-2',
        title: 'Capital Expenditure Trajectory Lag in Mega Energy Schemes',
        category: 'Financial Disbursement',
        severity: 'HIGH',
        affectedCount: 9,
        detectionCycle: 'Last 2 Reporting Cycles (Jul - Aug 2026)',
        signalDescription: 'Financial progress fell >15% below physical progress due to delayed billing milestones in Solar & Hydro packages.',
        leadTimeImpact: 'Anticipates contractor liquidity constraints 3 reporting cycles in advance.',
      },
      {
        id: 'trend-3',
        title: 'Transmission Relocation Clearances Bottlenecking Bridge Launches',
        category: 'Inter-Agency Grid Clearances',
        severity: 'HIGH',
        affectedCount: 11,
        detectionCycle: 'Last 4 Reporting Cycles (May - Aug 2026)',
        signalDescription: 'High-voltage line shutdown permits delayed across 4 state utilities, immobilizing heavy launching girders.',
        leadTimeImpact: 'Provides 3.5 months window for SLMC inter-ministerial resolution before idle claims compound.',
      },
    ];

    // 3. Sector Risk Matrix Breakdown
    const sectorMatrix = projectService.getSectorBreakdown();

    return {
      currentRiskIndex,
      previousRiskIndex,
      riskIndexDelta,
      totalProjects,
      criticalCount: criticalProjects.length,
      highCount: highProjects.length,
      moderateCount: allProjects.filter(p => p.risk_level === 'MODERATE').length,
      lowCount: allProjects.filter(p => p.risk_level === 'LOW').length,
      driversConcentration,
      emergingTrends,
      sectorMatrix,
    };
  }
}

export const riskIntelligenceService = new RiskIntelligenceService();
