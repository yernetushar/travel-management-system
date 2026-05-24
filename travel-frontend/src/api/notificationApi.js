import api from './axios'

export const getMyNotifications = () =>
  api.get('/notifications/my')

export const getUnreadCount = () =>
  api.get('/notifications/unread/count')

export const markAsRead = (notificationId) =>
  api.put(`/notifications/${notificationId}/read`)

export const markAllAsRead = () =>
  api.put('/notifications/read-all')