import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { toast } from 'react-hot-toast'
import { login, googleLogin } from '../../api/authApi'
import useAuthStore from '../../store/authStore'
import Input from '../../components/ui/Input'
import Button from '../../components/ui/Button'

export default function TouristLogin() {
  const navigate = useNavigate()
  const { setAuth } = useAuthStore()
  const [form, setForm] = useState({ email: '', password: '' })
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await login(form)
      const { token, email, role } = res.data

      if (role !== 'TOURIST') {
        toast.error('Please use Manager login')
        setLoading(false)
        return
      }

      const payload = JSON.parse(atob(token.split('.')[1]))
      const user = { id: payload.userId, email, name: payload.name, role }
      setAuth(token, user)
      toast.success(`Welcome back, ${payload.name}!`)
      navigate('/home')
    } catch (err) {
      toast.error(err.response?.data?.error || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      background: 'var(--sand)'
    }}>
      {/* Left decorative panel */}
      <div style={{
        flex: 1,
        background: 'linear-gradient(135deg, var(--ink) 0%, var(--ink-soft) 100%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 48,
        display: 'none'
      }} className="auth-panel">
        <h1 style={{
          fontFamily: 'Playfair Display, serif',
          fontSize: 40,
          color: 'var(--terra-light)',
          textAlign: 'center',
          lineHeight: 1.2
        }}>
          Discover<br />Incredible<br />India
        </h1>
      </div>

      {/* Right form panel */}
      <div style={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 32
      }}>
        <div style={{ width: '100%', maxWidth: 400 }}>
          <div style={{ marginBottom: 32 }}>
            <div style={{
              fontFamily: 'Playfair Display, serif',
              fontSize: 28,
              fontWeight: 700,
              color: 'var(--ink)',
              marginBottom: 8
            }}>
              Welcome back
            </div>
            <p style={{ color: 'var(--mist)', fontSize: 14 }}>
              Sign in to explore amazing destinations
            </p>
          </div>

          <form onSubmit={handleLogin}>
            <Input
              label="Email"
              type="email"
              value={form.email}
              onChange={e => setForm({ ...form, email: e.target.value })}
              placeholder="you@example.com"
              required
            />
            <Input
              label="Password"
              type="password"
              value={form.password}
              onChange={e => setForm({ ...form, password: e.target.value })}
              placeholder="Your password"
              required
            />

            <Button type="submit" fullWidth disabled={loading} size="lg"
              style={{ marginBottom: 12 }}>
              {loading ? 'Signing in...' : 'Sign In'}
            </Button>
          </form>

          <div style={{
            textAlign: 'center',
            margin: '16px 0',
            color: 'var(--mist)',
            fontSize: 13
          }}>
            — or —
          </div>

          <button
            onClick={googleLogin}
            style={{
              width: '100%',
              padding: '11px',
              border: '1.5px solid var(--border)',
              borderRadius: 10,
              background: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 10,
              fontSize: 14,
              fontWeight: 500,
              cursor: 'pointer',
              marginBottom: 24
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Continue with Google
          </button>

          <p style={{ textAlign: 'center', fontSize: 13, color: 'var(--mist)' }}>
            Don't have an account?{' '}
            <Link to="/signup" style={{ color: 'var(--terra)', fontWeight: 500 }}>
              Sign up
            </Link>
          </p>

          <p style={{ textAlign: 'center', fontSize: 13, color: 'var(--mist)', marginTop: 12 }}>
            Are you a manager?{' '}
            <Link to="/manager/login" style={{ color: 'var(--terra)', fontWeight: 500 }}>
              Manager Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}