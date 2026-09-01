import { MonthlyObservation } from '../types/project';
import { SYNTHETIC_PROJECTS } from './syntheticProjects';

const MONTHS_HISTORY = [
  '2025-09', '2025-10', '2025-11', '2025-12',
  '2026-01', '2026-02', '2026-03', '2026-04',
  '2026-05', '2026-06', '2026-07', '2026-08'
];

/**
 * Generates monthly historical observations for each project
 */
export function generateMonthlyObservations(): Record<string, MonthlyObservation[]> {
  const observationsByProject: Record<string, MonthlyObservation[]> = {};

  SYNTHETIC_PROJECTS.forEach(project => {
    const list: MonthlyObservation[] = [];
    const endPlanned = project.planned_progress;
    const endActual = project.physical_progress;
    const endPlannedExp = (project.planned_progress / 100) * project.revised_cost;
    const endActualExp = project.cumulative_expenditure;
    const endRisk = project.risk_score;

    // Start 12 months ago with lower progress and evolve toward current values
    const startPlanned = Math.max(5, endPlanned - 24);
    const startActual = Math.max(5, endActual - (project.risk_score > 70 ? 12 : 22));
    const startPlannedExp = (startPlanned / 100) * project.revised_cost;
    const startActualExp = (startActual / 100) * project.revised_cost * 0.95;
    const startRisk = Math.max(15, endRisk - (project.risk_score > 70 ? 35 : 10));

    MONTHS_HISTORY.forEach((month, idx) => {
      const alpha = idx / (MONTHS_HISTORY.length - 1);
      // Non-linear progress curve (S-curve progression)
      const easedAlpha = Math.pow(alpha, 1.2);

      const plannedProg = Math.round(startPlanned + (endPlanned - startPlanned) * easedAlpha);
      // For high risk projects, actual progress flattened out in recent 4-5 months
      const delayDampener = project.risk_score > 70 && idx > 6 ? 0.75 : 1.0;
      const actualProg = Math.round(startActual + (endActual - startActual) * easedAlpha * delayDampener);

      const plannedExp = Math.round(startPlannedExp + (endPlannedExp - startPlannedExp) * easedAlpha);
      const actualExp = Math.round(startActualExp + (endActualExp - startActualExp) * easedAlpha * delayDampener);

      const risk = Math.round(startRisk + (endRisk - startRisk) * alpha);

      list.push({
        project_id: project.project_id,
        month,
        planned_progress: Math.min(100, Math.max(0, plannedProg)),
        actual_progress: Math.min(100, Math.max(0, actualProg)),
        planned_expenditure: plannedExp,
        actual_expenditure: actualExp,
        milestones_due: Math.floor(alpha * project.milestones_total),
        milestones_completed: Math.floor(alpha * project.milestones_completed),
        issues_open: project.risk_score > 70 ? Math.floor(alpha * 6) + 2 : Math.floor(alpha * 2),
        issues_closed: Math.floor(alpha * 3),
        risk_score: risk,
      });
    });

    observationsByProject[project.project_id] = list;
  });

  return observationsByProject;
}

export const MONTHLY_OBSERVATIONS: Record<string, MonthlyObservation[]> = generateMonthlyObservations();
