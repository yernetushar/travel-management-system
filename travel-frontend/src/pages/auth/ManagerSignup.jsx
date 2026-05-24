import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { toast } from 'react-hot-toast'
import { managerSignup } from '../../api/authApi'
import Button from '../../components/ui/Button'

const LOCATIONS = [
  { id: 'goa', name: 'Goa' },
  { id: 'jaipur', name: 'Jaipur' },
  { id: 'mumbai', name: 'Mumbai' },
  { id: 'delhi', name: 'Delhi' },
  { id: 'kerala', name: 'Kerala' },
  { id: 'agra', name: 'Agra' },
  { id: 'varanasi', name: 'Varanasi' },
  { id: 'manali', name: 'Manali' },
]

export default function ManagerSignup() {
  const navigate = useNavigate()
  const [form, setForm] = useState({
    name: '', email: '', password: '', locationId: '', locationName: ''
  })
  const [loading, setLoading] = useState(false)

  const handleLocation = (e) => {
    const loc = LOCATIONS.find(l => l.id === e.target.value)
    setForm({ ...form, locationId: loc?.id || '', locationName: loc?.name || '' })
  }

  const handle = async (e) => {
    e.preventDefault()
    if (!form.locationId) { toast.error('Please select a location'); return }
    setLoading(true)
    try {
      await managerSignup(form)
      toast.success('Manager account created!')
      navigate('/manager/login')
    } catch (err) {
      toast.error(err.response?.data?.error || 'Signup failed')
    } finally {
      setLoading(false)
    }
  }

  const inputStyle = {
    width: '100%', padding: '11px 14px',
    border: '1.5px solid rgba(196,98,45,0.3)',
    borderRadius: 10, background: 'rgba(254,252,248,0.05)',
    color: 'var(--sand)', fontSize: 14, outline: 'none',
    marginBottom: 16
  }

  return (
    <div style={{
      minHeight: '100vh', display: 'flex',
      alignItems: 'center', justifyContent: 'center',
      background: 'var(--ink)', padding: 24
    }}>
      <div style={{ width: '100%', maxWidth: 440 }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <h1 style={{
            fontFamily: 'Playfair Display, serif', fontSize: 28,
            color: 'var(--terra-light)', marginBottom: 8
          }}>
            Register as Manager
          </h1>
          <p style={{ color: 'var(--mist)', fontSize: 14 }}>
            Manage tourism for your location
          </p>
        </div>

        <div style={{
          background: 'rgba(254,252,248,0.05)',
          border: '1px solid rgba(196,98,45,0.2)',
          borderRadius: 20, padding: 32
        }}>
          <form onSubmit={handle}>
            {[
              { key: 'name', label: 'Full Name', type: 'text', placeholder: 'Your name' },
              { key: 'email', label: 'Email', type: 'email', placeholder: 'manager@tourism.com' },
              { key: 'password', label: 'Password', type: 'password', placeholder: 'Min 6 characters' },
            ].map(({ key, label, type, placeholder }) => (
              <div key={key}>
                <label style={{
                  display: 'block', fontSize: 13, fontWeight: 500,
                  color: 'var(--sand)', marginBottom: 6
                }}>
                  {label}
                </label>
                <input
                  type={type}
                  value={form[key]}
                  onChange={e => setForm({ ...form, [key]: e.target.value })}
                  placeholder={placeholder}
                  style={inputStyle}
                />
              </div>
            ))}

            <label style={{
              display: 'block', fontSize: 13, fontWeight: 500,
              color: 'var(--sand)', marginBottom: 6
            }}>
              Location
            </label>
            <select
              value={form.locationId}
              onChange={handleLocation}
              style={{ ...inputStyle, marginBottom: 24 }}
            >
              <option value="">Select your location</option>
              {LOCATIONS.map(l => (
                <option key={l.id} value={l.id}>{l.name}</option>
              ))}
            </select>

            <Button type="submit" fullWidth disabled={loading} size="lg">
              {loading ? 'Creating...' : 'Create Manager Account'}
            </Button>
          </form>

          <p style={{ textAlign: 'center', fontSize: 13, color: 'var(--mist)', marginTop: 20 }}>
            Already registered?{' '}
            <Link to="/manager/login" style={{ color: 'var(--terra-light)', fontWeight: 500 }}>
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}