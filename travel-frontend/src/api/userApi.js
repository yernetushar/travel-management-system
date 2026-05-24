import api from './axios'

export const getMyProfile = () =>
  api.get('/users/me')

export const updateMyProfile = (data) =>
  api.put('/users/me', data)

export const getUserById = (userId) =>
  api.get(`/users/${userId}`)