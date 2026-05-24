import api from './axios'

export const touristSignup = (data) =>
  api.post('/auth/signup', { ...data, role: 'TOURIST' })

export const managerSignup = (data) =>
  api.post('/auth/signup', { ...data, role: 'TOURISM_MANAGER' })

export const login = (data) =>
  api.post('/auth/login', data)
export const googleLogin = () => {
  // ✅ Go through gateway on port 8181
  window.location.href = 'http://localhost:8181/oauth2/authorization/google'
}