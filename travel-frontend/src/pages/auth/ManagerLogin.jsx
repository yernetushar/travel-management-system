import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { toast } from 'react-hot-toast'
import { login } from '../../api/authApi'
import useAuthStore from '../../store/authStore'
import Input from '../../components/ui/Input'
import Button from '../../components/ui/Button'

export default function ManagerLogin() {
  const navigate = useNavigate()
  const { setAuth } = useAuthStore()
  const [form, setForm] = useState({ email: '', password: '' })
  const [loading, setLoading] = useState(false)

  const handle = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await login(form)
      const { token, email, role } = res.data

      if (role !== 'TOURISM_MANAGER') {
        toast.error('Please use Tourist login')
        setLoading(false)
        return
      }

      const payload = JSON.parse(atob(token.split('.')[1]))
      const user = {
        id: payload.userId, email,
        name: payload.name, role,
        locationId: payload.locationId,
        locationName: payload.locationName
      }
      setAuth(token, user)
      toast.success(`Welcome, ${payload.name}!`)
      navigate('/manager')
    } catch (err) {
      toast.error(err.response?.data?.error || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{
      minHeight: '100vh', display: 'flex',
      alignItems: 'center', justifyContent: 'center',
      background: 'var(--ink)', padding: 24
    }}>
      <div style={{ width: '100%', maxWidth: 420 }}>
        <div style={{ marginBottom: 32, textAlign: 'center' }}>
          <div style={{
            fontFamily: 'Playfair Display, serif',
            fontSize: 28, fontWeight: 700,
            color: 'var(--terra-light)', marginBottom: 8
          }}>
            Manager Portal
          </div>
          <p style={{ color: 'var(--mist)', fontSize: 14 }}>
            Manage your tourism sites and visitors
          </p>
        </div>

        <div style={{
          background: 'rgba(254,252,248,0.05)',
          border: '1px solid rgba(196,98,45,0.2)',
          borderRadius: 20, padding: 32
        }}>
          <form onSubmit={handle}>
            <div style={{ marginBottom: 16 }}>
              <label style={{
                display: 'block', fontSize: 13, fontWeight: 500,
                color: 'var(--sand)', marginBottom: 6
              }}>
                Email
              </label>
              <input
                type="email"
                value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })}
                placeholder="manager@tourism.com"
                style={{
                  width: '100%', padding: '11px 14px',
                  border: '1.5px solid rgba(196,98,45,0.3)',
                  borderRadius: 10, background: 'rgba(254,252,248,0.05)',
                  color: 'var(--sand)', fontSize: 14, outline: 'none'
                }}
              />
            </div>
            <div style={{ marginBottom: 24 }}>
              <label style={{
                display: 'block', fontSize: 13, fontWeight: 500,
                color: 'var(--sand)', marginBottom: 6
              }}>
                Password
              </label>
              <input
                type="password"
                value={form.password}
                onChange={e => setForm({ ...form, password: e.target.value })}
                placeholder="Your password"
                style={{
                  width: '100%', padding: '11px 14px',
                  border: '1.5px solid rgba(196,98,45,0.3)',
                  borderRadius: 10, background: 'rgba(254,252,248,0.05)',
                  color: 'var(--sand)', fontSize: 14, outline: 'none'
                }}
              />
            </div>
            <Button type="submit" fullWidth disabled={loading} size="lg">
              {loading ? 'Signing in...' : 'Sign In'}
            </Button>
          </form>

          <p style={{ textAlign: 'center', fontSize: 13, color: 'var(--mist)', marginTop: 20 }}>
            New manager?{' '}
            <Link to="/manager/signup" style={{ color: 'var(--terra-light)', fontWeight: 500 }}>
              Register here
            </Link>
          </p>
          <p style={{ textAlign: 'center', fontSize: 13, color: 'var(--mist)', marginTop: 8 }}>
            Are you a tourist?{' '}
            <Link to="/login" style={{ color: 'var(--terra-light)', fontWeight: 500 }}>
              Tourist Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}