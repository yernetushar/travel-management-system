import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import useAuthStore from '../../store/authStore'

export default function OAuthCallback() {
  const navigate = useNavigate()
  const { setAuth } = useAuthStore()

  useEffect(() => {
    console.log('=== OAuth Callback Loaded ===')
    console.log('Full URL:', window.location.href)
    
    const params = new URLSearchParams(window.location.search)
    const token = params.get('token')
    
    console.log('Token:', token ? token.substring(0, 30) + '...' : 'NOT FOUND')

    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]))
        console.log('Payload:', payload)

        const user = {
          id: payload.userId,
          email: payload.email,
          name: payload.name,
          role: payload.role
        }
        setAuth(token, user)
        navigate(user.role === 'TOURISM_MANAGER' ? '/manager' : '/home')
      } catch(err) {
        console.error('Decode error:', err)
        navigate('/login')
      }
    } else {
      console.error('NO TOKEN IN URL - redirecting to login')
      navigate('/login')
    }
  }, [])

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'var(--sand)'
    }}>
      <p>Completing login...</p>
    </div>
  )
}