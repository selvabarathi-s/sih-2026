import { apiClient, ApiResponse } from './client';

export interface NotificationItem {
  id: string;
  type: string;
  title: string;
  message: string;
  targetRoles: string[];
  projectId?: string;
  severity: string;
  isRead: boolean;
  createdAt: string;
}

export const notificationsApi = {
  getNotifications: async (role?: string): Promise<ApiResponse<{ count: number; unreadCount: number; notifications: NotificationItem[] }>> => {
    return apiClient.get('/notifications', { role });
  },

  markRead: async (id: string): Promise<ApiResponse<NotificationItem>> => {
    return apiClient.patch(`/notifications/${id}/read`);
  },
};
