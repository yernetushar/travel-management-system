import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { toast } from 'react-hot-toast'
import { touristSignup } from '../../api/authApi'
import Input from '../../components/ui/Input'
import Button from '../../components/ui/Button'

export default function TouristSignup() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [loading, setLoading] = useState(false)

  const handle = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await touristSignup(form)
      toast.success('Account created! Please login.')
      navigate('/login')
    } catch (err) {
      toast.error(err.response?.data?.error || 'Signup failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{
      minHeight: '100vh', display: 'flex',
      alignItems: 'center', justifyContent: 'center',
      background: 'var(--sand)', padding: 24
    }}>
      <div style={{ width: '100%', maxWidth: 400 }}>
        <div style={{ marginBottom: 32, textAlign: 'center' }}>
          <h1 style={{
            fontFamily: 'Playfair Display, serif',
            fontSize: 28, fontWeight: 700, color: 'var(--ink)', marginBottom: 8
          }}>
            Create Account
          </h1>
          <p style={{ color: 'var(--mist)', fontSize: 14 }}>
            Start exploring amazing destinations
          </p>
        </div>

        <div style={{
          background: 'var(--card-bg)', borderRadius: 20,
          padding: 32, boxShadow: 'var(--shadow)'
        }}>
          <form onSubmit={handle}>
            <Input label="Full Name" value={form.name}
              onChange={e => setForm({ ...form, name: e.target.value })}
              placeholder="Your full name" required />
            <Input label="Email" type="email" value={form.email}
              onChange={e => setForm({ ...form, email: e.target.value })}
              placeholder="you@example.com" required />
            <Input label="Password" type="password" value={form.password}
              onChange={e => setForm({ ...form, password: e.target.value })}
              placeholder="Min 6 characters" required />
            <Button type="submit" fullWidth disabled={loading} size="lg">
              {loading ? 'Creating...' : 'Create Account'}
            </Button>
          </form>

          <p style={{ textAlign: 'center', fontSize: 13, color: 'var(--mist)', marginTop: 20 }}>
            Already have an account?{' '}
            <Link to="/login" style={{ color: 'var(--terra)', fontWeight: 500 }}>Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  )
}