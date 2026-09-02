import { projectRepository } from '../repositories/projectRepository.js';
import { snapshotRepository } from '../repositories/snapshotRepository.js';

class AssistantService {
  async processQuery(rawQuery) {
    const q = (rawQuery || '').toLowerCase().trim();
    const timestamp = new Date().toISOString();

    // 1. GREETINGS & PURPOSE
    if (
      q === 'hi' || q === 'hello' || q === 'hey' || q.startsWith('hi ') ||
      q.includes('what are you for') || q.includes('who are you') || q.includes('what is paimana') || q.includes('help')
    ) {
      return {
        query: rawQuery,
        timestamp,
        intent: 'GREETING_AND_PURPOSE',
        content: `I am the **PAIMANA Grounded Intelligence Copilot**, an infrastructure monitoring assistant grounded in the **1,981 authentic April 2026 Table 6 projects** from MoSPI.\n\nYou can ask me to inspect project financials, physical progress, sector breakdowns, or multi-snapshot trajectories.`,
        evidence: {
          dataSource: 'MoSPI Flash Report (April 2026, Table 6)',
          scope: '1,981 Ongoing Projects (≥ ₹150 Cr)',
        },
        suggestedQueries: [
          'Tell me about BharatNet (PAI-706775)',
          'What is the April 2026 portfolio summary?',
          'Which projects have the highest cost growth?',
        ],
      };
    }

    // 2. SPECIFIC PROJECT LOOKUP (e.g. BharatNet, Mumbai-Ahmedabad HSR)
    if (q.includes('bharatnet') || q.includes('706775')) {
      const bnet = await projectRepository.findById('706775');
      const snaps = await snapshotRepository.findByProjectCode('706775');
      return {
        query: rawQuery,
        timestamp,
        intent: 'PROJECT_LOOKUP',
        project_id: bnet.project_id,
        content: `### Grounded Project Profile: ${bnet.project_name} (\`${bnet.project_id}\`)\n\n• **Ministry:** ${bnet.ministry} • **Sector:** ${bnet.sector}\n• **Original Sanctioned Cost:** ₹${bnet.original_cost.toLocaleString()} Cr\n• **Revised Anticipated Cost:** ₹${bnet.revised_cost.toLocaleString()} Cr\n• **Observed Cost Revision:** **+${bnet.cost_growth_pct}%** (+₹${bnet.cost_overrun_cr.toLocaleString()} Cr)\n• **Cumulative Expenditure:** ₹${bnet.cumulative_expenditure.toLocaleString()} Cr (${bnet.expenditure_ratio_pct}% of revised budget)\n• **Physical Progress:** **${bnet.physical_progress}%**\n• **Historical Snapshots:** Continuous tracking across ${snaps.length} reporting periods.`,
        evidence: {
          dataSource: 'Table 6, Flash Report April 2026 • MoSPI',
          metrics: {
            'Original Cost': `₹${bnet.original_cost.toLocaleString()} Cr`,
            'Revised Cost': `₹${bnet.revised_cost.toLocaleString()} Cr`,
            'Observed Revision': `+${bnet.cost_growth_pct}%`,
            'Progress': `${bnet.physical_progress}%`,
          },
        },
      };
    }

    // 3. PORTFOLIO SUMMARY
    if (q.includes('portfolio') || q.includes('summary') || q.includes('total cost') || q.includes('how many projects')) {
      const summary = await projectRepository.getPortfolioSummary();
      return {
        query: rawQuery,
        timestamp,
        intent: 'PORTFOLIO_SUMMARY',
        content: `### Portfolio Headline (April 2026 Flash Report)\n\n• **Total Ongoing Projects:** **${summary.headline.total_projects.toLocaleString()} Projects** (≥ ₹150 Cr)\n• **Original Cost Baseline:** ₹${(summary.headline.original_cost_cr / 100000).toFixed(2)} Lakh Cr\n• **Revised Cost Baseline:** ₹${(summary.headline.revised_cost_cr / 100000).toFixed(2)} Lakh Cr (+${summary.headline.cost_growth_total_pct}% revision)\n• **Cumulative Expenditure:** ₹${(summary.headline.cumulative_expenditure_cr / 100000).toFixed(2)} Lakh Cr (${summary.headline.expenditure_ratio_pct}% of budget)\n• **Average Progress:** ${summary.headline.average_physical_progress_pct}%\n• **Cost-Revised Projects:** ${summary.headline.projects_with_cost_growth} Projects`,
        evidence: {
          dataSource: 'Table 6, Flash Report April 2026 • 100% Ingestion Audit Match',
        },
      };
    }

    // 4. DYNAMIC SEARCH
    const searchRes = await projectRepository.findAll({ search: rawQuery, limit: 3 });
    if (searchRes.data.length > 0) {
      const p = searchRes.data[0];
      return {
        query: rawQuery,
        timestamp,
        intent: 'DYNAMIC_SEARCH',
        content: `### Found ${searchRes.pagination.total} Projects Matching "${rawQuery}"\n\nTop match: **${p.project_name}** (\`${p.project_id}\`)\n• Sector: *${p.sector}* • Revised Cost: ₹${p.revised_cost.toLocaleString()} Cr • Progress: **${p.physical_progress}%**`,
        evidence: {
          dataSource: 'Table 6, Flash Report April 2026',
        },
      };
    }

    // Default Fallback
    return {
      query: rawQuery,
      timestamp,
      intent: 'FALLBACK',
      content: `I am connected directly to the **1,981 authentic April 2026 PAIMANA projects**. You can ask about project codes, ministries, sectors, or portfolio cost statistics.`,
      evidence: {
        dataSource: 'Table 6, Flash Report April 2026 • MoSPI',
      },
    };
  }
}

export const assistantService = new AssistantService();
