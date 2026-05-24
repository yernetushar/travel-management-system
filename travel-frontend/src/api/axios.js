import axios from 'axios'

// All requests go through API Gateway on port 8080
const API_BASE = 'http://localhost:8181/api'

const api = axios.create({
  baseURL: API_BASE,
  headers: { 'Content-Type': 'application/json' }
})

// Attach JWT token to every request automatically
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Handle 401 — token expired, redirect to login
api.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      console.error('=== 401 FIRED ON URL:', error.config.url) // ← find the culprit
      localStorage.clear()
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export default api