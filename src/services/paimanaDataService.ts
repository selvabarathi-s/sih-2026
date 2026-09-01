import { PaimanaProject, PaimanaSnapshot, PaimanaPortfolioSummary, IngestionAudit } from '../types/paimana';

// Import canonical normalized data directly from the data/ directory (single source of truth)
import paimanaProjectsRaw from '../../data/normalized/paimana_april_2026.json';
import paimanaPortfolioSummaryRaw from '../../data/normalized/paimana_portfolio_summary.json';
import paimanaHistoricalSnapshotsRaw from '../../data/snapshots/paimana_historical_snapshots.json';
import ingestionAuditRaw from '../../data/metadata/ingestion_audit.json';

class PaimanaDataService {
  private projects: PaimanaProject[];
  private portfolioSummary: PaimanaPortfolioSummary;
  private historicalSnapshots: Record<string, PaimanaSnapshot[]>;
  private audit: IngestionAudit;

  constructor() {
    this.projects = paimanaProjectsRaw as PaimanaProject[];
    this.portfolioSummary = paimanaPortfolioSummaryRaw as PaimanaPortfolioSummary;
    this.historicalSnapshots = paimanaHistoricalSnapshotsRaw as Record<string, PaimanaSnapshot[]>;
    this.audit = ingestionAuditRaw as IngestionAudit;
  }

  // ---------------------------------------------------------
  // Project Retrieval & Search
  // ---------------------------------------------------------

  public getAllProjects(): PaimanaProject[] {
    return this.projects;
  }

  public getProjectById(projectId: string): PaimanaProject | undefined {
    // Lookup by project_id (e.g. "PAI-705728") or project_code (e.g. "705728")
    return this.projects.find(
      p => p.project_id === projectId || p.project_code === projectId || p.project_id === `PAI-${projectId}`
    );
  }

  public getRealHeroProject(): PaimanaProject {
    // Primary candidates with high significance and rich multi-period snapshots
    const hero = this.getProjectById('PAI-705728') || // Mumbai-Ahmedabad HSR
                 this.getProjectById('PAI-705237') || // Western DFC
                 this.getProjectById('PAI-706775') || // BharatNet
                 this.projects[0];
    return hero;
  }

  public getFilteredProjects(
    filters: {
      search?: string;
      ministry?: string;
      sector?: string;
      state?: string;
      costEscalatedOnly?: boolean;
      scheduleExtendedOnly?: boolean;
    },
    sortField: keyof PaimanaProject = 'revised_cost',
    sortDir: 'asc' | 'desc' = 'desc'
  ): PaimanaProject[] {
    let result = [...this.projects];

    if (filters.search) {
      const q = filters.search.toLowerCase().trim();
      result = result.filter(
        p =>
          p.project_id.toLowerCase().includes(q) ||
          p.project_code.toLowerCase().includes(q) ||
          p.project_name.toLowerCase().includes(q) ||
          p.agency.toLowerCase().includes(q) ||
          p.ministry.toLowerCase().includes(q) ||
          p.state.toLowerCase().includes(q) ||
          p.sector.toLowerCase().includes(q) ||
          (p.legacy_ocms_code && p.legacy_ocms_code.toLowerCase().includes(q)) ||
          (p.pmgid && p.pmgid.toLowerCase().includes(q))
      );
    }

    if (filters.ministry && filters.ministry !== 'ALL') {
      result = result.filter(p => p.ministry === filters.ministry);
    }

    if (filters.sector && filters.sector !== 'ALL') {
      result = result.filter(p => p.sector === filters.sector);
    }

    if (filters.state && filters.state !== 'ALL') {
      result = result.filter(p => p.state.includes(filters.state!));
    }

    if (filters.costEscalatedOnly) {
      result = result.filter(p => p.is_cost_escalated);
    }

    if (filters.scheduleExtendedOnly) {
      result = result.filter(p => p.is_schedule_extended);
    }

    // Sort
    result.sort((a, b) => {
      const valA = a[sortField];
      const valB = b[sortField];

      if (typeof valA === 'number' && typeof valB === 'number') {
        return sortDir === 'asc' ? valA - valB : valB - valA;
      }
      if (typeof valA === 'string' && typeof valB === 'string') {
        return sortDir === 'asc' ? valA.localeCompare(valB) : valB.localeCompare(valA);
      }
      return 0;
    });

    return result;
  }

  // ---------------------------------------------------------
  // Historical Snapshots Lookups
  // ---------------------------------------------------------

  public getSnapshotsForProject(projectCode: string): PaimanaSnapshot[] {
    const cleanCode = projectCode.replace(/^PAI-/, '');
    return this.historicalSnapshots[cleanCode] || [];
  }

  // ---------------------------------------------------------
  // Ingestion Audit & Summary
  // ---------------------------------------------------------

  public getPortfolioSummary(): PaimanaPortfolioSummary {
    return this.portfolioSummary;
  }

  public getIngestionAudit(): IngestionAudit {
    return this.audit;
  }

  public getDistinctMinistries(): string[] {
    return Array.from(new Set(this.projects.map(p => p.ministry))).sort();
  }

  public getDistinctSectors(): string[] {
    return Array.from(new Set(this.projects.map(p => p.sector))).sort();
  }

  public getDistinctStates(): string[] {
    return Array.from(new Set(this.projects.map(p => p.state))).filter(Boolean).sort();
  }
}

export const paimanaDataService = new PaimanaDataService();
