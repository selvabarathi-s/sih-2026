import { Project, MonthlyObservation, SectorType, RiskLevel, ProjectStatus } from '../types/project';
import { SYNTHETIC_PROJECTS } from '../data/syntheticProjects';
import { MONTHLY_OBSERVATIONS } from '../data/monthlyObservations';

export interface ProjectFilterOptions {
  search?: string;
  sector?: SectorType | 'ALL';
  riskLevel?: RiskLevel | 'ALL';
  status?: ProjectStatus | 'ALL';
  state?: string | 'ALL';
  minCost?: number;
  maxCost?: number;
  minDelay?: number;
  maxDelay?: number;
}

export type SortField =
  | 'risk_score'
  | 'predicted_cost_overrun'
  | 'predicted_delay_months'
  | 'physical_progress'
  | 'revised_cost'
  | 'project_name'
  | 'project_id';

export type SortDirection = 'asc' | 'desc';

class ProjectService {
  private projects: Project[] = [...SYNTHETIC_PROJECTS];
  private observations: Record<string, MonthlyObservation[]> = { ...MONTHLY_OBSERVATIONS };

  public getAllProjects(): Project[] {
    return this.projects;
  }

  public getProjectById(id: string): Project | undefined {
    return this.projects.find(p => p.project_id.toLowerCase() === id.toLowerCase());
  }

  public getHeroProject(): Project {
    const hero = this.getProjectById('PJ-1042');
    return hero || this.projects[0];
  }

  public getMonthlyObservations(projectId: string): MonthlyObservation[] {
    return this.observations[projectId] || [];
  }

  public getFilteredProjects(
    filters: ProjectFilterOptions = {},
    sortField: SortField = 'risk_score',
    sortDir: SortDirection = 'desc'
  ): Project[] {
    let result = [...this.projects];

    if (filters.search && filters.search.trim()) {
      const q = filters.search.toLowerCase().trim();
      result = result.filter(p =>
        p.project_id.toLowerCase().includes(q) ||
        p.project_name.toLowerCase().includes(q) ||
        p.ministry.toLowerCase().includes(q) ||
        p.state.toLowerCase().includes(q) ||
        p.implementing_agency.toLowerCase().includes(q) ||
        p.sector.toLowerCase().includes(q)
      );
    }

    if (filters.sector && filters.sector !== 'ALL') {
      result = result.filter(p => p.sector === filters.sector);
    }

    if (filters.riskLevel && filters.riskLevel !== 'ALL') {
      result = result.filter(p => p.risk_level === filters.riskLevel);
    }

    if (filters.status && filters.status !== 'ALL') {
      result = result.filter(p => p.status === filters.status);
    }

    if (filters.state && filters.state !== 'ALL') {
      result = result.filter(p => p.state.toLowerCase().includes(filters.state!.toLowerCase()));
    }

    if (filters.minCost !== undefined) {
      result = result.filter(p => p.revised_cost >= filters.minCost!);
    }

    if (filters.maxCost !== undefined) {
      result = result.filter(p => p.revised_cost <= filters.maxCost!);
    }

    if (filters.minDelay !== undefined) {
      result = result.filter(p => p.predicted_delay_months >= filters.minDelay!);
    }

    // Sorting
    result.sort((a, b) => {
      let aVal = a[sortField];
      let bVal = b[sortField];

      if (typeof aVal === 'string' && typeof bVal === 'string') {
        return sortDir === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
      }

      const aNum = Number(aVal) || 0;
      const bNum = Number(bVal) || 0;
      return sortDir === 'asc' ? aNum - bNum : bNum - aNum;
    });

    return result;
  }

  public getPortfolioKPIs() {
    const totalProjects = this.projects.length;
    const ongoingProjects = this.projects.filter(p => p.status !== 'COMPLETED').length;
    const criticalProjects = this.projects.filter(p => p.risk_level === 'CRITICAL').length;
    const highRiskProjects = this.projects.filter(p => p.risk_level === 'HIGH').length;
    const moderateRiskProjects = this.projects.filter(p => p.risk_level === 'MODERATE').length;
    const lowRiskProjects = this.projects.filter(p => p.risk_level === 'LOW').length;

    const totalOriginalCostCr = this.projects.reduce((acc, p) => acc + p.original_cost, 0);
    const totalRevisedCostCr = this.projects.reduce((acc, p) => acc + p.revised_cost, 0);
    const totalExpenditureCr = this.projects.reduce((acc, p) => acc + p.cumulative_expenditure, 0);
    const totalCostExposureCr = this.projects.reduce((acc, p) => acc + p.predicted_cost_overrun, 0);
    const totalDelayExposureMonths = this.projects.reduce((acc, p) => acc + p.predicted_delay_months, 0);
    const avgRiskScore = Math.round(this.projects.reduce((acc, p) => acc + p.risk_score, 0) / totalProjects);

    const costOverrunCount = this.projects.filter(p => p.revised_cost > p.original_cost || p.predicted_cost_overrun > 0).length;
    const timeOverrunCount = this.projects.filter(p => p.predicted_delay_months > 0).length;

    return {
      totalProjects,
      ongoingProjects,
      criticalProjects,
      highRiskProjects,
      moderateRiskProjects,
      lowRiskProjects,
      totalOriginalCostCr,
      totalRevisedCostCr,
      totalExpenditureCr,
      totalCostExposureCr,
      totalDelayExposureMonths,
      avgRiskScore,
      costOverrunCount,
      timeOverrunCount,
    };
  }

  public getSectorBreakdown() {
    const sectors = Array.from(new Set(this.projects.map(p => p.sector))) as SectorType[];
    return sectors.map(sector => {
      const projs = this.projects.filter(p => p.sector === sector);
      const count = projs.length;
      const criticalCount = projs.filter(p => p.risk_level === 'CRITICAL').length;
      const highCount = projs.filter(p => p.risk_level === 'HIGH').length;
      const moderateCount = projs.filter(p => p.risk_level === 'MODERATE').length;
      const lowCount = projs.filter(p => p.risk_level === 'LOW').length;
      const avgRisk = Math.round(projs.reduce((acc, p) => acc + p.risk_score, 0) / count);
      const totalCostExposure = projs.reduce((acc, p) => acc + p.predicted_cost_overrun, 0);

      return {
        sector,
        count,
        avgRisk,
        criticalCount,
        highCount,
        moderateCount,
        lowCount,
        totalCostExposure,
      };
    });
  }
}

export const projectService = new ProjectService();
