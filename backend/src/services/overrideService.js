/**
 * PAIMANA PREDICT — HUMAN-IN-THE-LOOP & RISK OVERRIDE SERVICE (Part 21)
 * 
 * Enables authorized government officers to review, dispute, or override AI risk scores.
 * Enforces mandatory justification, non-destructive coexistence (AI score & Human score both preserved),
 * and append-only audit logging.
 */

import { auditService } from './auditService.js';
import { notificationService } from './notificationService.js';

class OverrideService {
  constructor() {
    this.overrides = new Map(); // projectId -> Array of override records
  }

  /**
   * Submits a formal human review or risk score override.
   */
  async submitOverride(data, user) {
    const {
      projectId,
      originalScore,
      originalBand,
      humanScore,
      humanBand,
      reasonCategory,
      justificationNotes,
    } = data;

    const justification = (data.justificationNotes || data.justification || '').trim();

    if (!projectId) throw new Error('Project ID is required');
    if (humanScore === undefined || humanScore === null) throw new Error('Human assessment score is required');
    if (justification.length < 10) {
      throw new Error('Mandatory justification notes required (minimum 10 characters)');
    }

    const cleanId = projectId.replace(/^PAI-/i, '').trim();
    const formattedId = `PAI-${cleanId}`;
    const overrideId = `OVR-${Date.now()}`;

    const record = {
      id: overrideId,
      projectId: formattedId,
      originalAiScore: Number(originalScore || 0),
      originalAiBand: originalBand || 'UNKNOWN',
      humanScore: Math.max(0, Math.min(100, Number(humanScore))),
      humanBand: humanBand || 'MODERATE',
      reasonCategory: reasonCategory || 'GROUND_VERIFICATION_COMPLETE',
      justificationNotes: justification,
      evidenceLinks: data.evidenceLinks || [],
      officerId: user?.id || 'usr-officer-01',
      officerName: user?.fullName || 'Monitoring Officer',
      officerRole: user?.role || 'MONITORING_OFFICER',
      officerDepartment: user?.department || 'MoSPI Monitoring Division',
      submittedAt: new Date().toISOString(),
      status: 'ACTIVE_OVERRIDE',
    };

    // Store record in project override history
    const existing = this.overrides.get(formattedId) || [];
    existing.unshift(record);
    this.overrides.set(formattedId, existing);

    // Write immutable audit log
    await auditService.log({
      action: 'RECORD_RISK_OVERRIDE',
      userId: user?.id || 'usr-officer-01',
      userRole: user?.role || 'MONITORING_OFFICER',
      officerId: user?.id || 'usr-officer-01',
      officerName: user?.fullName || 'Monitoring Officer',
      resourceType: 'PROJECT_RISK_SCORE',
      resourceId: formattedId,
      details: {
        overrideId,
        originalAiScore: record.originalAiScore,
        humanScore: record.humanScore,
        delta: record.humanScore - record.originalAiScore,
        reasonCategory: record.reasonCategory,
        justification: record.justificationNotes,
      },
    });

    // Dispatch notification to senior decision makers & nodal officers
    await notificationService.createNotification({
      type: 'HUMAN_OVERRIDE',
      title: `Risk Score Overridden: ${formattedId}`,
      message: `${record.officerName} (${record.officerRole}) adjusted risk score from ${record.originalAiScore} to ${record.humanScore}.`,
      targetRoles: ['DECISION_MAKER', 'MONITORING_OFFICER', 'PROJECT_ADMIN'],
      projectId: formattedId,
      severity: 'INFO',
    });

    return record;
  }

  /**
   * Retrieves override history for a project.
   */
  getOverrides(projectId) {
    const formattedId = `PAI-${projectId.replace(/^PAI-/i, '').trim()}`;
    return this.overrides.get(formattedId) || [];
  }

  /**
   * Returns latest active override if any.
   */
  getLatestOverride(projectId) {
    const history = this.getOverrides(projectId);
    return history.length > 0 ? history[0] : null;
  }
}

export const overrideService = new OverrideService();
