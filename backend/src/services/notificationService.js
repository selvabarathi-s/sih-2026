import { normalizeRole } from '../middleware/rbac.js';

class NotificationService {
  constructor() {
    this.notifications = [
      {
        id: 'notif-1',
        type: 'CRITICAL_RISK',
        title: 'Critical Cost Overrun Detected: BharatNet',
        message: 'BharatNet (PAI-706775) cost revision exceeds 200% (+₹1,26,891 Cr). Immediate review recommended.',
        targetRoles: ['monitoring_officer', 'senior_decision_maker', 'system_admin', 'MONITORING_OFFICER', 'DECISION_MAKER', 'SYSTEM_ADMIN'],
        projectId: 'PAI-706775',
        severity: 'CRITICAL',
        isRead: false,
        createdAt: new Date(Date.now() - 7200000).toISOString(),
      },
      {
        id: 'notif-2',
        type: 'NEW_WARNING',
        title: 'Schedule Slippage Warning: Mumbai-Ahmedabad HSR',
        message: 'Milestone target date extended to 2028. Inter-agency utility clearance pending in Maharashtra section.',
        targetRoles: ['monitoring_officer', 'project_admin', 'risk_analyst', 'MONITORING_OFFICER', 'PROJECT_ADMIN', 'DATA_ANALYST'],
        projectId: 'PAI-705728',
        severity: 'HIGH',
        isRead: false,
        createdAt: new Date(Date.now() - 3600000).toISOString(),
      },
      {
        id: 'notif-3',
        type: 'DATA_QUALITY_ALERT',
        title: 'April 2026 Ingestion Reconciled (100% Match)',
        message: 'All 1,981 central sector projects ingested with zero error delta across Table 6.',
        targetRoles: ['system_admin', 'risk_analyst', 'SYSTEM_ADMIN', 'DATA_ANALYST'],
        severity: 'INFO',
        isRead: true,
        createdAt: new Date(Date.now() - 14400000).toISOString(),
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
