import { notificationService } from '../services/notificationService.js';

export const getNotifications = async (req, res, next) => {
  try {
    const role = req.user?.role || req.query.role;
    const userId = req.user?.userId;
    const result = await notificationService.getNotifications(role, userId);
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
};

export const markNotificationRead = async (req, res, next) => {
  try {
    const updated = await notificationService.markAsRead(req.params.id);
    if (!updated) {
      return res.status(404).json({ error: 'Notification not found' });
    }
    res.status(200).json(updated);
  } catch (err) {
    next(err);
  }
};
