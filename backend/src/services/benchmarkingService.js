import { projectRepository } from '../repositories/projectRepository.js';

class BenchmarkingService {
  async getSectorBenchmarks() {
    const { data: allProjects } = await projectRepository.findAll({ limit: 2500 });
    
    const sectorStats = {};
    allProjects.forEach(p => {
      const sec = p.sector || 'Uncategorized';
      if (!sectorStats[sec]) {
        sectorStats[sec] = {
          sector: sec,
          projectCount: 0,
          totalOriginalCost: 0,
          totalRevisedCost: 0,
          totalExpenditure: 0,
          sumProgress: 0,
          sumCostGrowthPct: 0,
          sumScheduleExtensionMonths: 0,
          costEscalatedCount: 0,
          scheduleExtendedCount: 0,
        };
      }
      const s = sectorStats[sec];
      s.projectCount++;
      s.totalOriginalCost += p.original_cost;
      s.totalRevisedCost += p.revised_cost;
      s.totalExpenditure += p.cumulative_expenditure;
      s.sumProgress += p.physical_progress || 0;
      s.sumCostGrowthPct += p.cost_growth_pct || 0;
      s.sumScheduleExtensionMonths += p.schedule_extension_months || 0;
      if (p.is_cost_escalated) s.costEscalatedCount++;
      if (p.is_schedule_extended) s.scheduleExtendedCount++;
    });

    return Object.values(sectorStats)
      .map(s => ({
        sector: s.sector,
        project_count: s.projectCount,
        total_original_cost_cr: Number(s.totalOriginalCost.toFixed(2)),
        total_revised_cost_cr: Number(s.totalRevisedCost.toFixed(2)),
        total_expenditure_cr: Number(s.totalExpenditure.toFixed(2)),
        avg_physical_progress_pct: Number((s.sumProgress / s.projectCount).toFixed(2)),
        avg_cost_growth_pct: Number((s.sumCostGrowthPct / s.projectCount).toFixed(2)),
        avg_schedule_extension_months: Number((s.sumScheduleExtensionMonths / s.projectCount).toFixed(1)),
        cost_escalation_rate_pct: Number(((s.costEscalatedCount / s.projectCount) * 100).toFixed(1)),
        schedule_extension_rate_pct: Number(((s.scheduleExtendedCount / s.projectCount) * 100).toFixed(1)),
      }))
      .sort((a, b) => b.total_revised_cost_cr - a.total_revised_cost_cr);
  }

  async getProjectBenchmark(projectId) {
    const project = await projectRepository.findById(projectId);
    if (!project) return null;

    const sectorBenchmarks = await this.getSectorBenchmarks();
    const sectorStats = sectorBenchmarks.find(s => s.sector === project.sector);

    const nationalAvgProgress = 54.8;
    const nationalAvgCostGrowth = 15.2;

    return {
      project: {
        project_id: project.project_id,
        project_name: project.project_name,
        sector: project.sector,
        ministry: project.ministry,
        physical_progress: project.physical_progress,
        cost_growth_pct: project.cost_growth_pct,
        schedule_extension_months: project.schedule_extension_months,
      },
      sector_benchmark: sectorStats || null,
      national_benchmark: {
        avg_physical_progress_pct: nationalAvgProgress,
        avg_cost_growth_pct: nationalAvgCostGrowth,
      },
      comparison: {
        progress_vs_sector_delta: sectorStats ? Number((project.physical_progress - sectorStats.avg_physical_progress_pct).toFixed(2)) : 0,
        cost_growth_vs_sector_delta: sectorStats ? Number((project.cost_growth_pct - sectorStats.avg_cost_growth_pct).toFixed(2)) : 0,
      },
    };
  }
}

export const benchmarkingService = new BenchmarkingService();
