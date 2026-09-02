class AuditService {
  constructor() {
    this.logs = [
      {
        id: 'aud-001',
        action: 'INGESTION_COMPLETED',
        userId: 'system',
        userRole: 'SYSTEM_ADMIN',
        resourceType: 'INGESTION',
        resourceId: 'FlashReport_April2026.pdf',
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
        action: 'WARNING_GENERATED',
        userId: 'system',
        userRole: 'SYSTEM_ADMIN',
        resourceType: 'ALERT',
        resourceId: 'SIG-706775',
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
      resourceType: eventData.resourceType || 'GENERAL',
      resourceId: eventData.resourceId || 'N/A',
      details: eventData.details || {},
      ipAddress: eventData.ipAddress || '127.0.0.1',
      timestamp: new Date().toISOString(),
    };

    this.logs.unshift(logEntry);
    if (this.logs.length > 500) {
      this.logs = this.logs.slice(0, 500); // keep most recent 500 logs
    }

    return logEntry;
  }

  async log(eventData) {
    return this.logEvent(eventData);
  }

  async getLogs(filters = {}) {
    let result = [...this.logs];
    const { action, userId, resourceType, limit = 50 } = filters;

    if (action) {
      result = result.filter(l => l.action.toLowerCase() === action.toLowerCase());
    }
    if (userId) {
      result = result.filter(l => l.userId.toLowerCase() === userId.toLowerCase());
    }
    if (resourceType) {
      result = result.filter(l => l.resourceType.toLowerCase() === resourceType.toLowerCase());
    }

    return {
      count: result.length,
      logs: result.slice(0, Number(limit)),
    };
  }
}

export const auditService = new AuditService();
