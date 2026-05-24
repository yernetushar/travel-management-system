import api from './axios'

export const sendMessage = (data) =>
  api.post('/chat/send', data)

export const getConversation = (otherUserId, locationId) =>
  api.get(`/chat/conversation?otherUserId=${otherUserId}&locationId=${locationId}`)

export const getMyConversations = () =>
  api.get('/chat/my')

export const getLocationMessages = (locationId) =>
  api.get(`/chat/location/${locationId}`)        // ← ADD THIS

export const getUnreadMessages = () =>
  api.get('/chat/unread')

export const markAsRead = (conversationId) =>
  api.put(`/chat/read/${conversationId}`)

export const checkOnline = (userId) =>
  api.get(`/chat/online/${userId}`)