class AuditService {
  constructor() {
    this.logs = [
      {
        id: 'aud-001',
        action: 'DATA_IMPORT',
        userId: 'sysadmin',
        userRole: 'data_platform_security_admin',
        organization: 'MoSPI / National Platform Architecture Cell',
        resourceType: 'INGESTION',
        resourceId: 'FlashReport_April2026.pdf',
        result: 'SUCCESS',
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
        userRole: 'monitoring_officer',
        organization: 'MoSPI / IPMD',
        resourceType: 'ALERT',
        resourceId: 'SIG-706775',
        result: 'SUCCESS',
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
    const logEntry = {
      id: `aud-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      action: eventData.action,
      userId: eventData.userId || 'anonymous',
      userRole: eventData.userRole || 'PUBLIC',
      organization: eventData.organization || 'Government Infrastructure Monitoring Body',
      resourceType: eventData.resourceType || 'GENERAL',
      resourceId: eventData.resourceId || 'N/A',
      result: eventData.result || (eventData.action?.includes('DENIED') ? 'DENIED' : 'SUCCESS'),
      reason: eventData.reason || eventData.details?.reason || null,
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
      result = result.filter(l => l.userId.toLowerCase() === userId.toLowerCase());
    }
    if (resourceType) {
      result = result.filter(l => l.resourceType.toLowerCase() === resourceType.toLowerCase());
    }
    if (organization) {
      result = result.filter(l => (l.organization || '').toLowerCase().includes(organization.toLowerCase()));
    }

    return {
      count: result.length,
      logs: result.slice(0, Number(limit)),
    };
  }
}

export const auditService = new AuditService();
