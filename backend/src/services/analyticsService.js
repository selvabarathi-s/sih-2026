import { projectRepository } from '../repositories/projectRepository.js';

class AnalyticsService {
  async getOverviewAnalytics() {
    const summary = await projectRepository.getPortfolioSummary();
    const { data: allProjects } = await projectRepository.findAll({ limit: 2500 });

    // Calculate cost bands and progress brackets
    const costBands = {
      under_500cr: 0,
      '500cr_to_1000cr': 0,
      '1000cr_to_5000cr': 0,
      mega_over_5000cr: 0,
    };

    const progressBrackets = {
      '0_to_25pct': 0,
      '26_to_50pct': 0,
      '51_to_75pct': 0,
      '76_to_100pct': 0,
    };

    allProjects.forEach(p => {
      const cost = p.revised_cost || 0;
      if (cost < 500) costBands.under_500cr++;
      else if (cost < 1000) costBands['500cr_to_1000cr']++;
      else if (cost < 5000) costBands['1000cr_to_5000cr']++;
      else costBands.mega_over_5000cr++;

      const prog = p.physical_progress || 0;
      if (prog <= 25) progressBrackets['0_to_25pct']++;
      else if (prog <= 50) progressBrackets['26_to_50pct']++;
      else if (prog <= 75) progressBrackets['51_to_75pct']++;
      else progressBrackets['76_to_100pct']++;
    });

    return {
      headline: summary.headline,
      cost_bands: costBands,
      progress_brackets: progressBrackets,
      top_ministries: summary.ministries.slice(0, 8),
      top_sectors: summary.sectors.slice(0, 8),
      top_states: summary.states.slice(0, 8),
    };
  }

  async getStateAnalytics() {
    const summary = await projectRepository.getPortfolioSummary();
    return summary.states || [];
  }

  async getSectorAnalytics() {
    const summary = await projectRepository.getPortfolioSummary();
    return summary.sectors || [];
  }
}

export const analyticsService = new AnalyticsService();
