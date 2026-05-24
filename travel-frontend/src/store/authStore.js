import { create } from 'zustand'

const useAuthStore = create((set) => ({
  token: localStorage.getItem('token') || null,
  user: JSON.parse(localStorage.getItem('user') || 'null'),

  setAuth: (token, user) => {
    localStorage.setItem('token', token)
    localStorage.setItem('user', JSON.stringify(user))
    set({ token, user })
  },

  logout: () => {
    localStorage.clear()
    set({ token: null, user: null })
    window.location.href = '/login'
  },

  isAuthenticated: () => !!localStorage.getItem('token'),

  isTourist: () => {
    const user = JSON.parse(localStorage.getItem('user') || 'null')
    return user?.role === 'TOURIST'
  },

  isManager: () => {
    const user = JSON.parse(localStorage.getItem('user') || 'null')
    return user?.role === 'TOURISM_MANAGER'
  }
}))

export default useAuthStore