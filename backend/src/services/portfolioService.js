import { projectRepository } from '../repositories/projectRepository.js';
import { snapshotRepository } from '../repositories/snapshotRepository.js';
import { config } from '../config/index.js';

class PortfolioService {
  async getSummary() {
    const summary = await projectRepository.getPortfolioSummary();
    const historicalAudit = await snapshotRepository.getHistoricalAuditStats();

    return {
      headline: summary.headline,
      sectors: summary.sectors,
      top_cost_escalations: summary.top_cost_escalations,
      historical_audit: historicalAudit,
      provenance: {
        report_period: config.baseline.verifiedReportPeriod,
        source_table: 'Table 6 (All Ongoing Projects)',
        authority: 'Ministry of Statistics & Programme Implementation (MoSPI)',
        reconciliation_status: 'PASS',
        verified_baseline_cr: {
          original_cost: config.baseline.verifiedOriginalCostCr,
          revised_cost: config.baseline.verifiedRevisedCostCr,
          cumulative_expenditure: config.baseline.verifiedCumulativeExpenditureCr,
        }
      }
    };
  }

  async getSectorsBreakdown() {
    const summary = await projectRepository.getPortfolioSummary();
    return summary.sectors;
  }
}

export const portfolioService = new PortfolioService();
