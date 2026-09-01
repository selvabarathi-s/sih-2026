import { AssistantMessage } from '../types/assistant';
import { projectService } from './projectService';
import { paimanaDataService } from './paimanaDataService';
import { modelService } from './modelService';
import { riskIntelligenceService } from './riskIntelligenceService';
import { alertService } from './alertService';
import { recommendationService } from './recommendationService';

export interface GroundedAssistantResponse extends AssistantMessage {
  navigationAction?: {
    type: 'PROJECT' | 'DRIVERS' | 'NETWORK' | 'PREDICTIONS' | 'HEALTH';
    targetId?: string;
    label: string;
  };
}

class GroundedAssistantService {
  /**
   * Question Parser + Structured Data Retrieval + Evidence Builder + Grounded Response Generator
   */
  public processQuery(rawQuery: string): GroundedAssistantResponse {
    const q = rawQuery.toLowerCase().trim();
    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    // 1. OUT OF DOMAIN / NO HALLUCINATION RULE
    if (
      q.includes('legal status') ||
      q.includes('court judgment') ||
      q.includes('ceo personal') ||
      q.includes('stock price') ||
      q.includes('bank account') ||
      q.includes('arbitration lawyer')
    ) {
      return {
        id: `msg-${Date.now()}`,
        sender: 'assistant',
        timestamp,
        content: `**Information Boundary Notice**\n\nThe current project telemetry dataset does not contain sufficient legal, personal, or commercial financial records to answer this inquiry.\n\n*In accordance with PAIMANA Predict Scientific Honesty & No Hallucination Policy, the system will not invent unverified facts.*`,
        evidence: {
          dataSource: 'PAIMANA Grounding & Trust Policy (Field Not Available in Telemetry Schema)',
        },
        suggestedQuestions: [
          'Tell me about BharatNet (PAI-706775)',
          'What is the April 2026 portfolio summary?',
          'Why is PJ-1042 high risk in AI Demo?',
        ],
      };
    }

    // 2. REAL PAIMANA HERO: BHARATNET LOOKUP (PAI-706775 / 706775 / BharatNet)
    if (q.includes('bharatnet') || q.includes('706775') || q.includes('pai-706775')) {
      const bnet = paimanaDataService.getProjectById('PAI-706775')!;
      const snapshots = paimanaDataService.getSnapshotsForProject('706775');

      // Check if asking for non-existent operational prediction
      if (q.includes('predicted delay') || q.includes('7-month') || q.includes('predict') || q.includes('overrun forecast')) {
        return {
          id: `msg-${Date.now()}`,
          sender: 'assistant',
          timestamp,
          content: `### Scientific Honesty Notice: Predictive Boundary on Real PAIMANA Data
          
**Project:** BharatNet (\`PAI-706775\`)

The supplied public PAIMANA flash reports track **macro milestone dates and financial figures**, but **do not provide a validated predictive delay estimate** or internal contractor operational variables.

**Observed Real Data from April 2026 Report:**
• **Observed Cost Revision:** Original ₹${bnet.original_cost.toLocaleString()} Cr ➔ Revised ₹${bnet.revised_cost.toLocaleString()} Cr (**+${bnet.cost_growth_pct}% Observed Cost Revision**)
• **Cumulative Expenditure:** ₹${bnet.cumulative_expenditure.toLocaleString()} Cr (${bnet.expenditure_ratio_pct}% of revised)
• **Reported Progress:** ${bnet.physical_progress}%
• **Historical Snapshots:** 10 consecutive monthly periods (\`Oct 2025\` – \`Jul 2026\`)

*To explore advance early warning prediction models and causal risk propagation, switch to **AI DEMONSTRATION MODE** in the top navigation.*`,
          evidence: {
            projectId: bnet.project_id,
            projectName: bnet.project_name,
            metrics: {
              'Original Cost': `₹${bnet.original_cost.toLocaleString()} Cr`,
              'Revised Cost': `₹${bnet.revised_cost.toLocaleString()} Cr`,
              'Observed Cost Revision': `+${bnet.cost_growth_pct}%`,
              'Cumulative Exp': `₹${bnet.cumulative_expenditure.toLocaleString()} Cr`,
              'Physical Progress': `${bnet.physical_progress}%`,
              'Historical Depth': `${snapshots.length} monthly snapshots`,
            },
            dataSource: 'Table 6, Flash Report April 2026 • MoSPI, Government of India',
          },
          navigationAction: {
            type: 'PROJECT',
            targetId: bnet.project_id,
            label: 'Open BharatNet Real Profile',
          },
          suggestedQuestions: [
            'What is the April 2026 portfolio summary?',
            'Which projects have the highest cost escalations?',
            'What is the ML model benchmark on research data?',
          ],
        };
      }

      return {
        id: `msg-${Date.now()}`,
        sender: 'assistant',
        timestamp,
        content: `### Grounded Real PAIMANA Profile: ${bnet.project_name} (\`${bnet.project_id}\`)

**Authority:** ${bnet.ministry} • **State:** ${bnet.state} • **Sector:** ${bnet.sector}

**Observed Financial Telemetry:**
• **Original Sanctioned Cost:** ₹${bnet.original_cost.toLocaleString()} Cr
• **Revised Anticipated Cost:** ₹${bnet.revised_cost.toLocaleString()} Cr
• **Observed Cost Revision:** **+${bnet.cost_growth_pct}%** (+₹${bnet.cost_overrun_cr.toLocaleString()} Cr)
• **Cumulative Expenditure:** ₹${bnet.cumulative_expenditure.toLocaleString()} Cr (${bnet.expenditure_ratio_pct}% of budget)

**Observed Execution & Schedule:**
• **Physical Progress:** **${bnet.physical_progress}%**
• **Target Date of Commissioning:** ${bnet.target_completion_date || 'N/A'}
• **Historical Snapshots:** Tracked continuously across **${snapshots.length} monthly reporting snapshots** (October 2025 to July 2026).`,
        evidence: {
          projectId: bnet.project_id,
          projectName: bnet.project_name,
          metrics: {
            'Project Code': bnet.project_code,
            'Ministry': bnet.ministry,
            'Original Cost': `₹${bnet.original_cost.toLocaleString()} Cr`,
            'Revised Cost': `₹${bnet.revised_cost.toLocaleString()} Cr`,
            'Observed Revision': `+${bnet.cost_growth_pct}%`,
            'Progress': `${bnet.physical_progress}%`,
            'Snapshots': `${snapshots.length} periods`,
          },
          dataSource: 'Table 6, Flash Report April 2026 • MoSPI, Government of India',
        },
        navigationAction: {
          type: 'PROJECT',
          targetId: bnet.project_id,
          label: 'Open BharatNet Full Real Profile',
        },
        suggestedQuestions: [
          'What is BharatNet\'s historical trajectory?',
          'What is the April 2026 portfolio summary?',
          'Which projects have the highest cost escalations?',
        ],
      };
    }

    // 3. REAL PORTFOLIO SUMMARY QUERY
    if (q.includes('portfolio') || q.includes('april 2026') || q.includes('how many projects') || q.includes('total cost') || q.includes('headline')) {
      const summary = paimanaDataService.getPortfolioSummary();
      return {
        id: `msg-${Date.now()}`,
        sender: 'assistant',
        timestamp,
        content: `### Grounded Portfolio Summary: April 2026 Flash Report (MoSPI)

**Ongoing Portfolio Scope:**
• **Total Monitored Projects:** **${summary.headline.total_projects.toLocaleString()} Projects** (Central Sector ≥ ₹150 Cr)
• **Coverage:** ${summary.headline.total_ministries} Line Ministries & Departments • ${summary.headline.total_sectors} Infrastructure Sectors

**Financial Baselines:**
• **Original Sanctioned Cost:** ₹${(summary.headline.original_cost_cr / 100000).toFixed(2)} Lakh Cr
• **Revised Anticipated Cost:** ₹${(summary.headline.revised_cost_cr / 100000).toFixed(2)} Lakh Cr (**+${summary.headline.cost_growth_total_pct}% / +₹${(summary.headline.cost_growth_total_cr / 100000).toFixed(2)} Lakh Cr Total Revision**)
• **Cumulative Expenditure:** ₹${(summary.headline.cumulative_expenditure_cr / 100000).toFixed(2)} Lakh Cr (${summary.headline.expenditure_ratio_pct}% of Revised Budget)

**Execution Health:**
• **Average Physical Progress:** **${summary.headline.average_physical_progress_pct}%**
• **Projects with Cost Revision:** ${summary.headline.projects_with_cost_growth} Projects
• **Projects with Schedule Extension:** ${summary.headline.projects_with_schedule_extension} Projects`,
        evidence: {
          dataSource: 'Table 6, Flash Report April 2026 • 100% Reconciled Ingestion Audit',
          metrics: {
            'Ongoing Projects': `${summary.headline.total_projects}`,
            'Original Cost': `₹${(summary.headline.original_cost_cr / 100000).toFixed(2)}L Cr`,
            'Revised Cost': `₹${(summary.headline.revised_cost_cr / 100000).toFixed(2)}L Cr`,
            'Cumulative Exp': `₹${(summary.headline.cumulative_expenditure_cr / 100000).toFixed(2)}L Cr`,
            'Avg Progress': `${summary.headline.average_physical_progress_pct}%`,
          },
        },
        navigationAction: {
          type: 'HEALTH',
          label: 'Open Ingestion Audit & Data Health',
        },
        suggestedQuestions: [
          'Tell me about BharatNet (PAI-706775)',
          'Which projects have the highest cost escalations?',
          'Which model performs best in AI Demo mode?',
        ],
      };
    }

    // 4. SYNTHETIC DEMO HERO: PJ-1042
    if (q.includes('pj-1042') || q.includes('1042') || q.includes('western high-speed')) {
      const demoHero = projectService.getHeroProject();
      const recs = recommendationService.getRecommendations(demoHero);

      return {
        id: `msg-${Date.now()}`,
        sender: 'assistant',
        timestamp,
        content: `### Synthetic AI Demo Hero: ${demoHero.project_id} (${demoHero.project_name})

**Current Classification:** **${demoHero.risk_level} Risk** (Composite Score: **${demoHero.risk_score} / 100**)

**Predicted Overrun Impacts:**
• **Schedule Slippage:** Projected **+${demoHero.predicted_delay_months} Months Delay** (Confidence: **${demoHero.time_overrun_probability}%**)
• **Financial Exposure:** Estimated **₹${demoHero.predicted_cost_overrun.toLocaleString()} Cr** additional capital cost (Probability: **${demoHero.cost_overrun_probability}%**)

**Verified Root-Cause Risk Drivers:**
${demoHero.risk_drivers.map(d => `• **${d.name} (+${d.impact_points} pts):** ${d.evidence}`).join('\n')}

**Recommended Immediate Intervention:**
${recs[0]?.action || 'Establish Joint Taskforce for ROW Handover'}`,
        evidence: {
          projectId: demoHero.project_id,
          projectName: demoHero.project_name,
          metrics: {
            'Composite Risk Score': `${demoHero.risk_score} / 100`,
            'Physical / Planned': `${demoHero.physical_progress}% / ${demoHero.planned_progress}%`,
            'Land Handover': `${demoHero.land_progress}% (Target: ${demoHero.land_target}%)`,
            'Predicted Delay': `+${demoHero.predicted_delay_months} Months`,
            'Predicted Escalation': `₹${demoHero.predicted_cost_overrun.toLocaleString()} Cr`,
          },
          drivers: demoHero.risk_drivers.map(d => `${d.name} (+${d.impact_points} pts)`),
          dataSource: 'Enriched Research Dataset (PS 26103) • Synthetic AI Demo Mode',
        },
        navigationAction: {
          type: 'PROJECT',
          targetId: demoHero.project_id,
          label: 'Open PJ-1042 Decision Mode',
        },
        suggestedQuestions: [
          'What should we do about PJ-1042?',
          'Tell me about BharatNet (PAI-706775)',
          'Which model performs best?',
        ],
      };
    }

    // 5. ML MODEL BENCHMARKING
    if (q.includes('model') || q.includes('auc') || q.includes('gbm') || q.includes('random forest') || q.includes('accuracy') || q.includes('cuf')) {
      const metrics = modelService.getModelMetrics();
      const topModel = metrics.time_overrun_models["Gradient Boosting (GBM / XGBoost Equivalent)"];
      const cufGain = modelService.getCUFComparison().time_overrun;

      return {
        id: `msg-${Date.now()}`,
        sender: 'assistant',
        timestamp,
        content: `### ML Architecture & Research Benchmarking Summary

**Recommended Production Model:** **Gradient Boosting (GBM / XGBoost Equivalent)**
• **ROC-AUC:** **${topModel.roc_auc.toFixed(3)}** | **Accuracy:** **${(topModel.accuracy * 100).toFixed(1)}%**
• **Recall:** **${(topModel.recall * 100).toFixed(1)}%** | **Precision:** **${(topModel.precision * 100).toFixed(1)}%**
• **Average Early Warning Lead Time:** **${topModel.early_warning_lead_months.toFixed(1)} Months Advance Notice**

**CUF Baseline vs Expanded Variables Gain:**
• **AUC Gain:** **+${cufGain.auc_delta.toFixed(3)} AUC** over standard CUF macro fields.
• **Lead Time Improvement:** **+${cufGain.lead_time_delta_months.toFixed(1)} Months** earlier detection.

*Note: Prototype validation on synthetic PAIMANA-like enriched data (PS 26103).*`,
        evidence: {
          dataSource: '5-Fold Stratified Cross-Validation on Enriched Research Dataset',
          metrics: {
            'Top Model': 'Gradient Boosting (GBM)',
            'ROC-AUC': `${topModel.roc_auc.toFixed(3)}`,
            'Recall': `${(topModel.recall * 100).toFixed(1)}%`,
            'Lead Time': `${topModel.early_warning_lead_months.toFixed(1)} Months`,
            'CUF Gain': `+${cufGain.auc_delta.toFixed(3)} AUC`,
          },
        },
        navigationAction: {
          type: 'PREDICTIONS',
          label: 'Open Model Benchmark Matrix',
        },
        suggestedQuestions: [
          'Tell me about BharatNet (PAI-706775)',
          'What is the April 2026 portfolio summary?',
          'Why is PJ-1042 high risk in AI Demo?',
        ],
      };
    }

    // Default Fallback
    return {
      id: `msg-${Date.now()}`,
      sender: 'assistant',
      timestamp,
      content: `I can provide verified intelligence from both the **1,981 authentic April 2026 PAIMANA projects** and the **synthetic AI demonstration research dataset**.

**Suggested Inquiries:**
• **Real PAIMANA Hero:** *"Tell me about BharatNet (PAI-706775)"*
• **April 2026 Portfolio:** *"What is the April 2026 portfolio summary?"*
• **AI Demo Hero:** *"Why is PJ-1042 high risk?"*
• **ML Models:** *"Which model performs best?"*`,
      suggestedQuestions: [
        'Tell me about BharatNet (PAI-706775)',
        'What is the April 2026 portfolio summary?',
        'Why is PJ-1042 high risk in AI Demo?',
        'Which model performs best?',
      ],
    };
  }
}

export const groundedAssistantService = new GroundedAssistantService();
