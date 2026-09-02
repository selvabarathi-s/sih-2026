import { normalizeRole } from '../middleware/rbac.js';

class NotificationService {
  constructor() {
    this.notifications = [
      // 1. Monitoring Officer Notifications
      {
        id: 'notif-mo-1',
        type: 'DETERIORATION_SIGNAL',
        title: 'New Deterioration Signal: BharatNet Package 3',
        message: 'Weak signal detected: Multi-period execution velocity decelerated by -42.8% over past 3 reporting months.',
        targetRoles: ['monitoring_officer', 'MONITORING_OFFICER'],
        projectId: 'PAI-706775',
        severity: 'HIGH',
        isRead: false,
        createdAt: new Date(Date.now() - 1800000).toISOString(),
      },
      {
        id: 'notif-mo-2',
        type: 'CRITICAL_WARNING',
        title: 'Critical Warning: Mumbai-Ahmedabad High Speed Rail',
        message: 'Milestone target date extended to 2028. Inter-agency utility line clearance pending in Maharashtra section.',
        targetRoles: ['monitoring_officer', 'MONITORING_OFFICER'],
        projectId: 'PAI-705728',
        severity: 'CRITICAL',
        isRead: false,
        createdAt: new Date(Date.now() - 3600000).toISOString(),
      },
      {
        id: 'notif-mo-3',
        type: 'INTERVENTION_UPDATE',
        title: 'Intervention Update: Dedicated Freight Corridor (Western)',
        message: 'Project Nodal Officer submitted milestone justification and requested joint taskforce escalation.',
        targetRoles: ['monitoring_officer', 'MONITORING_OFFICER'],
        projectId: 'PAI-704981',
        severity: 'INFO',
        isRead: true,
        createdAt: new Date(Date.now() - 7200000).toISOString(),
      },

      // 2. Project Administrator Notifications
      {
        id: 'notif-pa-1',
        type: 'ASSIGNED_INTERVENTION',
        title: 'Intervention Assigned: BharatNet (PAI-706775)',
        message: 'Monitoring Division assigned action: Establish Special Taskforce for Gram Panchayat Fiber Handover.',
        targetRoles: ['project_admin', 'PROJECT_ADMIN'],
        projectId: 'PAI-706775',
        severity: 'CRITICAL',
        isRead: false,
        createdAt: new Date(Date.now() - 2400000).toISOString(),
      },
      {
        id: 'notif-pa-2',
        type: 'RESPONSE_DEADLINE',
        title: 'Response Deadline Approaching: OFC Stringing Package',
        message: 'Evidence submission deadline for Bihar Phase 2 OFC execution is due in 5 business days.',
        targetRoles: ['project_admin', 'PROJECT_ADMIN'],
        projectId: 'PAI-706775',
        severity: 'HIGH',
        isRead: false,
        createdAt: new Date(Date.now() - 5400000).toISOString(),
      },

      // 3. Risk / Data Analyst Notifications
      {
        id: 'notif-ra-1',
        type: 'MODEL_EVALUATION',
        title: 'Governed Temporal Model time-gbm-v1.4 Calibrated',
        message: 'Temporal validation complete on 1,981 projects. ROC-AUC: 0.8850, Brier Score: 0.1714 (Pass).',
        targetRoles: ['risk_analyst', 'DATA_ANALYST'],
        projectId: 'ALL',
        severity: 'INFO',
        isRead: false,
        createdAt: new Date(Date.now() - 4800000).toISOString(),
      },
      {
        id: 'notif-ra-2',
        type: 'MODEL_DRIFT_ALERT',
        title: 'PSI Drift Surveillance: Road Transport Sector',
        message: 'Population Stability Index (PSI = 0.042) is within stable boundary (< 0.10). No distribution shift detected.',
        targetRoles: ['risk_analyst', 'DATA_ANALYST'],
        projectId: 'SECTOR-ROADS',
        severity: 'INFO',
        isRead: true,
        createdAt: new Date(Date.now() - 9600000).toISOString(),
      },

      // 4. Senior Decision Maker Notifications
      {
        id: 'notif-sdm-1',
        type: 'CRITICAL_PROJECT_ESCALATION',
        title: 'Cabinet Escalation: National Capital Exposure Alert',
        message: 'Top 5 delayed infrastructure projects account for ₹1,84,320 Cr in total cost escalation. Executive brief prepared.',
        targetRoles: ['senior_decision_maker', 'DECISION_MAKER'],
        projectId: 'PORTFOLIO_TOP5',
        severity: 'CRITICAL',
        isRead: false,
        createdAt: new Date(Date.now() - 1200000).toISOString(),
      },
      {
        id: 'notif-sdm-2',
        type: 'PRIORITY_INTERVENTION_REQUEST',
        title: 'Strategic Intervention Recommendation: Railways & Telecom',
        message: 'Inter-ministerial coordination recommended for Right-of-Way (ROW) clearance across 14 mega-projects.',
        targetRoles: ['senior_decision_maker', 'DECISION_MAKER'],
        projectId: 'SECTOR-RAIL-TELECOM',
        severity: 'HIGH',
        isRead: false,
        createdAt: new Date(Date.now() - 6000000).toISOString(),
      },

      // 5. System Administrator Notifications
      {
        id: 'notif-sa-1',
        type: 'INGESTION_RECONCILIATION',
        title: 'April 2026 Table 6 Ingestion Reconciled (100% Match)',
        message: 'All 1,981 central sector projects ingested with 0.0000% mathematical error delta against official baseline.',
        targetRoles: ['system_admin', 'SYSTEM_ADMIN'],
        projectId: 'SYSTEM_INGESTION',
        severity: 'INFO',
        isRead: true,
        createdAt: new Date(Date.now() - 14400000).toISOString(),
      },
      {
        id: 'notif-sa-2',
        type: 'SECURITY_AUDIT_EVENT',
        title: 'Immutable Audit Trail Verification: Pass',
        message: 'Audit log append integrity check completed. Cryptographic hash chain unbroken across all 65 captured events.',
        targetRoles: ['system_admin', 'SYSTEM_ADMIN'],
        projectId: 'SECURITY_AUDIT',
        severity: 'INFO',
        isRead: false,
        createdAt: new Date(Date.now() - 8400000).toISOString(),
      },
    ];
  }

  async getNotifications(role, userId) {
    let filtered = [...this.notifications];
    if (role) {
      const canonical = normalizeRole(role);
      filtered = filtered.filter(n => {
        if (!n.targetRoles || n.targetRoles.includes('ALL')) return true;
        return n.targetRoles.some(r => normalizeRole(r) === canonical || r === role);
      });
    }
    return {
      count: filtered.length,
      unreadCount: filtered.filter(n => !n.isRead).length,
      notifications: filtered,
    };
  }

  async markAsRead(notificationId) {
    const notif = this.notifications.find(n => n.id === notificationId);
    if (notif) {
      notif.isRead = true;
      return notif;
    }
    return null;
  }

  async createNotification(data) {
    const targetRoles = data.targetRoles || ['monitoring_officer'];
    const newNotif = {
      id: `notif-${Date.now()}`,
      type: data.type || 'INFO',
      title: data.title,
      message: data.message,
      targetRoles,
      projectId: data.projectId,
      severity: data.severity || 'INFO',
      isRead: false,
      createdAt: new Date().toISOString(),
    };
    this.notifications.unshift(newNotif);
    return newNotif;
  }
}

export const notificationService = new NotificationService();
