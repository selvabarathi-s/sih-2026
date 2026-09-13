export const AUDIT_EVENT_TYPES = {
  LOGIN: 'USER_LOGIN',
  USER_LOGIN: 'USER_LOGIN',
  LOGOUT: 'USER_LOGOUT',
  USER_LOGOUT: 'USER_LOGOUT',
  ROLE_SWITCH: 'ROLE_SWITCH',
  ROLE_SWITCH_DENIED: 'ROLE_SWITCH_DENIED',
  PROJECT_VIEW: 'PROJECT_VIEW',
  PROJECT_UPDATE: 'PROJECT_UPDATED',
  PROJECT_UPDATED: 'PROJECT_UPDATED',
  MONTHLY_SUBMISSION: 'MONTHLY_SUBMISSION',
  DATA_IMPORT: 'DATA_IMPORT',
  DATA_PUBLICATION: 'DATA_PUBLICATION',
  WARNING_CREATED: 'WARNING_CREATED',
  WARNING_ACKNOWLEDGED: 'WARNING_ACKNOWLEDGED',
  CASE_CREATED: 'CASE_CREATED',
  INTERVENTION_ASSIGNED: 'INTERVENTION_ASSIGNED',
  SLA_BREACH: 'SLA_BREACH',
  NCR_CREATED: 'NCR_CREATED',
  NCR_VERIFIED: 'NCR_VERIFIED',
  NCR_CLOSED: 'NCR_CLOSED',
  FINANCIAL_REVIEW: 'FINANCIAL_REVIEW',
  COORDINATION_CASE_CREATED: 'COORDINATION_CASE_CREATED',
  DIRECTIVE_CREATED: 'DIRECTIVE_CREATED',
  DIRECTIVE_ISSUED: 'DIRECTIVE_ISSUED',
  RISK_OVERRIDE: 'RISK_OVERRIDE',
  MODEL_APPROVAL: 'MODEL_APPROVAL',
  MODEL_DRIFT_SIGNOFF: 'MODEL_DRIFT_SIGNOFF',
  PERMISSION_DENIED: 'PERMISSION_DENIED',
};

class AuditService {
  constructor() {
    this.logs = [
      {
        id: 'aud-001',
        action: 'DATA_PUBLICATION',
        userId: 'system',
        actor: 'system',
        userRole: 'data_platform_security_admin',
        organization: 'National Informatics Centre (NIC)',
        resourceType: 'INGESTION',
        resourceId: 'FlashReport_April2026.pdf',
        resource: 'FlashReport_April2026.pdf',
        actionResult: 'SUCCESS',
        details: {
          extractedCount: 1981,
          reconciliationStatus: 'PASS',
          originalCostCr: 3712662.01,
          revisedCostCr: 4278402.37,
        },
        ipAddress: '127.0.0.1',
        timestamp: new Date(Date.now() - 3600000).toISOString(),
      },
      {
        id: 'aud-002',
        action: 'WARNING_CREATED',
        userId: 'system',
        actor: 'system',
        userRole: 'monitoring_officer',
        organization: 'MoSPI / IPMD',
        resourceType: 'ALERT',
        resourceId: 'SIG-706775',
        resource: 'SIG-706775',
        actionResult: 'SUCCESS',
        details: {
          projectId: 'PAI-706775',
          projectName: 'BharatNet',
          severity: 'CRITICAL',
          trigger: 'Observed +207.65% Cost Revision',
        },
        ipAddress: '127.0.0.1',
        timestamp: new Date(Date.now() - 1800000).toISOString(),
      },
    ];
  }

  async logEvent(eventData) {
    const actor = eventData.actor || eventData.userId || 'anonymous';
    const role = eventData.role || eventData.userRole || 'PUBLIC';
    const org = typeof eventData.organization === 'object' && eventData.organization !== null
      ? eventData.organization.name || eventData.organization.code || 'GOV_ENTITY'
      : (eventData.organization || 'GOV_ENTITY');
    const resource = eventData.resource || eventData.resourceId || 'N/A';
    const actionResult = eventData.actionResult || (eventData.success === false ? 'FAILURE' : 'SUCCESS');

    const logEntry = {
      id: `aud-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      action: eventData.action,
      userId: actor,
      actor,
      userRole: role,
      role,
      organization: org,
      resourceType: eventData.resourceType || 'GENERAL',
      resourceId: resource,
      resource,
      actionResult,
      reason: eventData.reason || null,
      details: eventData.details || {},
      ipAddress: eventData.ipAddress || '127.0.0.1',
      timestamp: new Date().toISOString(),
    };

    this.logs.unshift(logEntry);
    if (this.logs.length > 1000) {
      this.logs = this.logs.slice(0, 1000); // keep most recent 1000 logs
    }

    return logEntry;
  }

  async log(eventData) {
    return this.logEvent(eventData);
  }

  async logAction(eventData) {
    return this.logEvent(eventData);
  }

  async getLogs(filters = {}) {
    let result = [...this.logs];
    const { action, userId, resourceType, organization, limit = 100 } = filters;

    if (action) {
      result = result.filter(l => l.action.toLowerCase() === action.toLowerCase());
    }
    if (userId) {
      result = result.filter(l => (l.userId && l.userId.toLowerCase() === userId.toLowerCase()) || (l.actor && l.actor.toLowerCase() === userId.toLowerCase()));
    }
    if (resourceType) {
      result = result.filter(l => l.resourceType.toLowerCase() === resourceType.toLowerCase());
    }
    if (organization) {
      result = result.filter(l => l.organization.toLowerCase().includes(organization.toLowerCase()));
    }

    return {
      count: result.length,
      logs: result.slice(0, Number(limit)),
    };
  }
}

export const auditService = new AuditService();
