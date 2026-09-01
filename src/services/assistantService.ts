import { AssistantMessage } from '../types/assistant';
import { projectService } from './projectService';

export const SUGGESTED_QUERIES = [
  'Why is Project PJ-1042 high risk?',
  'Which projects have the highest delay risk?',
  'Show transport projects with cost escalation risk',
  'What are the main drivers of risk in PJ-1042?',
  'Which project needs intervention first?',
  'What additional variables improve the prediction model?',
  'How does PJ-1042 compare with its peers?',
  'What is the total cost exposure across the portfolio?',
];

class AssistantService {
  public answerQuestion(query: string): AssistantMessage {
    const q = query.toLowerCase().trim();
    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    // 1. Specific Query: PJ-1042 / Hero Project
    if (q.includes('1042') || q.includes('eastern freight') || (q.includes('why') && q.includes('hero'))) {
      const hero = projectService.getHeroProject();
      return {
        id: `msg-${Date.now()}`,
        sender: 'assistant',
        timestamp,
        content: `**Project Intelligence Summary for ${hero.project_id}: ${hero.project_name}**

• **Current Status:** Critical Risk (Risk Score: **${hero.risk_score}/100**)
• **Schedule Divergence:** Physical progress is **${hero.physical_progress}%** vs planned **${hero.planned_progress}%** (${hero.planned_progress - hero.physical_progress}% lag), predicting **${hero.predicted_delay_months} months** slippage.
• **Financial Exposure:** Revised cost ₹${hero.revised_cost.toLocaleString()} Cr vs Original ₹${hero.original_cost.toLocaleString()} Cr. Additional predicted exposure: **₹${hero.predicted_cost_overrun} Cr** (Cost Overrun Probability: **${hero.cost_overrun_probability}%**).

**Primary Root-Cause Drivers:**
1. **Land Acquisition Delay (+18 pts):** Land handover achieved is **52%** against target **90%** along the Varanasi-Sasaram stretch.
2. **Milestone Slippage (+14 pts):** 3 consecutive critical engineering milestones have slipped.
3. **Low Expenditure Trajectory (+11 pts):** Actual expenditure (58%) is trailing planned financial progress (76%).
4. **Utility Shifting Bottlenecks (+8 pts):** 3 high-voltage 400kV line relocations pending clearance.`,
        evidence: {
          projectId: hero.project_id,
          projectName: hero.project_name,
          metrics: {
            'Risk Score': `${hero.risk_score} / 100`,
            'Physical vs Planned': `${hero.physical_progress}% / ${hero.planned_progress}%`,
            'Predicted Delay': `${hero.predicted_delay_months} Months`,
            'Predicted Cost Overrun': `₹${hero.predicted_cost_overrun} Cr`,
            'Land Progress': `${hero.land_progress}% (Target: ${hero.land_target}%)`,
          },
          drivers: hero.risk_drivers.map(d => `${d.name} (+${d.impact_points} pts)`),
          recommendations: hero.recommendations.map(r => `Priority ${r.priority}: ${r.title}`),
          dataSource: 'Synthetic PAIMANA Engine — Verified Local Observation & Prediction Layers',
        },
        suggestedQuestions: [
          'What intervention is recommended for PJ-1042?',
          'How does PJ-1042 compare with peers?',
          'Which projects have the highest delay risk?',
        ],
      };
    }

    // 2. Highest Delay Risk Query
    if (q.includes('highest delay') || q.includes('most delayed') || q.includes('delay risk')) {
      const topDelayed = projectService.getFilteredProjects({}, 'predicted_delay_months', 'desc').slice(0, 5);
      const listStr = topDelayed.map((p, idx) => `${idx + 1}. **${p.project_id}** — ${p.project_name} (**+${p.predicted_delay_months} mo delay**, Risk Score: ${p.risk_score}/100, Sector: ${p.sector})`).join('\n');

      return {
        id: `msg-${Date.now()}`,
        sender: 'assistant',
        timestamp,
        content: `**Top 5 Infrastructure Projects with Highest Predicted Delay:**\n\n${listStr}\n\n*Common systemic factors across these projects include Right-of-Way (RoW) acquisition deficits and inter-agency utility relocation clearance delays.*`,
        evidence: {
          dataSource: 'Portfolio Delay Forecasting Engine (n=241 projects)',
          metrics: {
            'Top Delay Project': topDelayed[0]?.project_id || 'N/A',
            'Max Delay': `${topDelayed[0]?.predicted_delay_months} Months`,
            'Portfolio Total Delay': `${projectService.getPortfolioKPIs().totalDelayExposureMonths} Months`,
          },
        },
        suggestedQuestions: [
          `Why is Project ${topDelayed[0]?.project_id} high risk?`,
          'Show transport projects with cost escalation risk',
          'Which project needs intervention first?',
        ],
      };
    }

    // 3. Cost Escalation / Transport Query
    if (q.includes('cost escalation') || q.includes('cost overrun') || q.includes('transport')) {
      const highCost = projectService.getFilteredProjects({ sector: 'Transport & Logistics', riskLevel: 'CRITICAL' }, 'predicted_cost_overrun', 'desc').slice(0, 5);
      const listStr = highCost.map((p, idx) => `${idx + 1}. **${p.project_id}** — ${p.project_name} (Predicted Exposure: **₹${p.predicted_cost_overrun} Cr**, Rev: ₹${p.revised_cost} Cr)`).join('\n');

      return {
        id: `msg-${Date.now()}`,
        sender: 'assistant',
        timestamp,
        content: `**Critical Transport & Logistics Projects with High Cost Escalation Exposure:**\n\n${listStr}\n\n*These projects combine long execution durations with statutory material price adjustment triggers.*`,
        evidence: {
          dataSource: 'Sector Cost Escalation Module',
          metrics: {
            'Total Transport Cost Exposure': `₹${highCost.reduce((a, b) => a + b.predicted_cost_overrun, 0).toLocaleString()} Cr`,
          },
        },
        suggestedQuestions: [
          'Why is Project PJ-1042 high risk?',
          'What additional variables improve the prediction model?',
          'What is the total cost exposure across the portfolio?',
        ],
      };
    }

    // 4. Variables Query
    if (q.includes('variable') || q.includes('cuf') || q.includes('improve')) {
      return {
        id: `msg-${Date.now()}`,
        sender: 'assistant',
        timestamp,
        content: `**Model Benchmarking: CUF vs Expanded Operational Variables**

Adding operational ground-reality indicators beyond standard Centralized Unified Format (CUF) fields significantly boosts predictive performance:

1. **ROC-AUC (Cost Escalation):** 0.78 (CUF Only) ➔ **0.89** (Expanded Model) **[+14.1% Gain]**
2. **ROC-AUC (Time Overrun):** 0.75 (CUF Only) ➔ **0.87** (Expanded Model) **[+16.0% Gain]**
3. **Early Warning Lead Time:** 2.3 Months ➔ **4.8 Months** **[+2.5 Months Gain]**

**Top 3 High-Impact Additional Variables:**
• **Land Acquisition Progress Deficit (Importance: 94/100)**
• **Consecutive Milestone Slippage Sequence (Importance: 88/100)**
• **Utility Shifting & Clearance Bottleneck Status (Importance: 76/100)**`,
        evidence: {
          dataSource: 'Model Benchmark & SHAP Feature Importance Evaluation',
          metrics: {
            'Baseline AUC': '0.78',
            'Enriched Model AUC': '0.89',
            'Lead Time Boost': '+2.5 Months',
          },
        },
        suggestedQuestions: [
          'Which project needs intervention first?',
          'Why is Project PJ-1042 high risk?',
          'What is the total cost exposure across the portfolio?',
        ],
      };
    }

    // 5. General Portfolio / Intervention Query
    const kpi = projectService.getPortfolioKPIs();
    const critical = projectService.getFilteredProjects({ riskLevel: 'CRITICAL' }, 'risk_score', 'desc')[0];

    return {
      id: `msg-${Date.now()}`,
      sender: 'assistant',
      timestamp,
      content: `**Portfolio Intelligence Overview**

• Total Monitored Projects: **${kpi.totalProjects}** across 8 national sectors
• Critical Zone: **${kpi.criticalProjects} projects** require priority intervention
• Total Projected Cost Escalation Exposure: **₹${kpi.totalCostExposureCr.toLocaleString()} Cr**
• Total Schedule Delay Exposure: **${kpi.totalDelayExposureMonths} Months**

**Top Priority Project for Urgent Intervention:**
**${critical?.project_id || 'PJ-1042'}** (${critical?.project_name || 'Eastern Freight Corridor Expansion'}) with Risk Score **${critical?.risk_score || 82}/100**.`,
      evidence: {
        dataSource: 'PAIMANA Portfolio Master Aggregate',
        metrics: {
          'Portfolio Risk Index': `${kpi.avgRiskScore} / 100`,
          'Critical Projects': kpi.criticalProjects,
          'Total Cost Exposure': `₹${kpi.totalCostExposureCr.toLocaleString()} Cr`,
        },
      },
      suggestedQuestions: [
        'Why is Project PJ-1042 high risk?',
        'Which projects have the highest delay risk?',
        'What additional variables improve the prediction model?',
      ],
    };
  }
}

export const assistantService = new AssistantService();
