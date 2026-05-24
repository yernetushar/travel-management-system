import { useState, useEffect } from 'react'
import { toast } from 'react-hot-toast'
import { User, Mail, Phone, Edit3, Save } from 'lucide-react'
import TouristLayout from '../../components/layout/TouristLayout'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'
import { getMyProfile, updateMyProfile } from '../../api/userApi'
import useAuthStore from '../../store/authStore'

export default function TouristProfile() {
  const { user, setAuth } = useAuthStore()
  const [profile, setProfile] = useState(null)
  const [editing, setEditing] = useState(false)
  const [form, setForm] = useState({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    getMyProfile()
      .then(r => { setProfile(r.data); setForm(r.data) })
      .catch(() => toast.error('Failed to load profile'))
      .finally(() => setLoading(false))
  }, [])

  const handleSave = async () => {
    setSaving(true)
    try {
      const res = await updateMyProfile({
        name: form.name, phone: form.phone, bio: form.bio
      })
      setProfile(res.data)
      const token = localStorage.getItem('token')
      setAuth(token, { ...user, name: form.name })
      setEditing(false)
      toast.success('Profile updated!')
    } catch {
      toast.error('Update failed')
    } finally {
      setSaving(false)
    }
  }

  if (loading) return (
    <TouristLayout>
      <div style={{ textAlign: 'center', padding: 60 }}>Loading...</div>
    </TouristLayout>
  )

  return (
    <TouristLayout>
      <h1 style={{
        fontFamily: 'Playfair Display, serif',
        fontSize: 28, color: 'var(--ink)', marginBottom: 24
      }}>
        My Profile
      </h1>

      <div style={{
        background: 'var(--card-bg)', borderRadius: 20,
        padding: 32, boxShadow: 'var(--shadow)', maxWidth: 560
      }}>
        {/* Avatar */}
        <div style={{
          width: 80, height: 80, borderRadius: '50%',
          background: 'linear-gradient(135deg, var(--terra) 0%, var(--terra-dark) 100%)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 32, color: 'white', marginBottom: 20,
          fontFamily: 'Playfair Display, serif'
        }}>
          {profile?.name?.[0]?.toUpperCase()}
        </div>

        {editing ? (
          <>
            <Input
              label="Full Name"
              value={form.name || ''}
              onChange={e => setForm({ ...form, name: e.target.value })}
            />
            <Input
              label="Phone"
              value={form.phone || ''}
              onChange={e => setForm({ ...form, phone: e.target.value })}
              placeholder="+91 9876543210"
            />
            <div style={{ marginBottom: 16 }}>
              <label style={{
                display: 'block', fontSize: 13, fontWeight: 500,
                color: 'var(--ink-soft)', marginBottom: 6
              }}>Bio</label>
              <textarea
                value={form.bio || ''}
                onChange={e => setForm({ ...form, bio: e.target.value })}
                placeholder="Tell us about yourself..."
                rows={3}
                style={{
                  width: '100%', padding: '11px 14px',
                  border: '1.5px solid var(--border)',
                  borderRadius: 10, fontSize: 14, outline: 'none',
                  resize: 'none', color: 'var(--ink)'
                }}
              />
            </div>
            <div style={{ display: 'flex', gap: 12 }}>
              <Button variant="secondary" onClick={() => setEditing(false)}>Cancel</Button>
              <Button onClick={handleSave} disabled={saving}>
                <Save size={15} /> {saving ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          </>
        ) : (
          <>
            {[
              { icon: User, label: 'Name', value: profile?.name },
              { icon: Mail, label: 'Email', value: profile?.email },
              { icon: Phone, label: 'Phone', value: profile?.phone || 'Not set' },
            ].map(({ icon: Icon, label, value }) => (
              <div key={label} style={{
                display: 'flex', gap: 12,
                padding: '12px 0',
                borderBottom: '1px solid var(--border)'
              }}>
                <Icon size={18} color="var(--terra)" style={{ marginTop: 2 }} />
                <div>
                  <div style={{ fontSize: 12, color: 'var(--mist)', marginBottom: 2 }}>{label}</div>
                  <div style={{ fontSize: 14, color: 'var(--ink)', fontWeight: 500 }}>{value}</div>
                </div>
              </div>
            ))}

            {profile?.bio && (
              <div style={{ padding: '12px 0' }}>
                <div style={{ fontSize: 12, color: 'var(--mist)', marginBottom: 4 }}>Bio</div>
                <p style={{ fontSize: 14, color: 'var(--ink)', lineHeight: 1.6 }}>{profile.bio}</p>
              </div>
            )}

            <div style={{
              marginTop: 8, padding: '6px 14px',
              background: 'rgba(196,98,45,0.1)', borderRadius: 20,
              display: 'inline-block', color: 'var(--terra)',
              fontSize: 12, fontWeight: 600, marginBottom: 20
            }}>
              {profile?.role}
            </div>

            <br />
            <Button onClick={() => setEditing(true)} variant="ghost">
              <Edit3 size={15} /> Edit Profile
            </Button>
          </>
        )}
      </div>
    </TouristLayout>
  )
}