import { useState, useEffect, useRef } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { toast } from 'react-hot-toast'
import { Upload, X } from 'lucide-react'
import ManagerLayout from '../../components/layout/ManagerLayout'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'
import { createSite, updateSite, getSiteById } from '../../api/siteApi'
import { uploadImage } from '../../api/imageApi'
import useAuthStore from '../../store/authStore'

const CATEGORIES = ['BEACH', 'TEMPLE', 'FORT', 'MUSEUM', 'PARK', 'OTHER']

export default function SiteForm() {
  const { siteId } = useParams()
  const navigate = useNavigate()
  const { user } = useAuthStore()
  const isEdit = !!siteId
  const fileRef = useRef()

  const [form, setForm] = useState({
    name: '', description: '', shortDescription: '',
    category: 'BEACH', address: '',
    openingHours: '', entryFee: 'Free',
    latitude: '', longitude: '', imageUrls: []
  })
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)

  useEffect(() => {
    if (isEdit) {
      getSiteById(siteId)
        .then(r => setForm(r.data))
        .catch(() => toast.error('Failed to load site'))
    }
  }, [siteId])

  const handleImageUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return
    setUploading(true)
    try {
      const res = await uploadImage(file, siteId || 'new', form.name || 'site')
      const url = res.data.imageUrl
      setForm(prev => ({ ...prev, imageUrls: [...prev.imageUrls, url] }))
      toast.success('Image uploaded!')
    } catch {
      toast.error('Image upload failed')
    } finally {
      setUploading(false)
    }
  }

  const removeImage = (url) => {
    setForm(prev => ({ ...prev, imageUrls: prev.imageUrls.filter(u => u !== url) }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      if (isEdit) {
        await updateSite(siteId, form)
        toast.success('Site updated!')
      } else {
        await createSite(form)
        toast.success('Site created!')
      }
      navigate('/manager/sites')
    } catch (err) {
      toast.error(err.response?.data?.error || 'Save failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <ManagerLayout>
      <div style={{ maxWidth: 680 }}>
        <button onClick={() => navigate('/manager/sites')} style={{
          background: 'none', border: 'none',
          color: 'var(--terra)', cursor: 'pointer',
          fontSize: 13, marginBottom: 16,
          display: 'flex', alignItems: 'center', gap: 4
        }}>
          ← Back to Sites
        </button>

        <h1 style={{
          fontFamily: 'Playfair Display, serif',
          fontSize: 28, color: 'var(--ink)', marginBottom: 24
        }}>
          {isEdit ? 'Edit Site' : 'Add New Site'}
        </h1>

        <form onSubmit={handleSubmit}>
          <div style={{
            background: 'var(--card-bg)', borderRadius: 20,
            padding: 28, boxShadow: 'var(--shadow)', marginBottom: 20
          }}>
            <h3 style={{ fontSize: 15, fontWeight: 600, color: 'var(--ink-soft)', marginBottom: 16 }}>
              Basic Information
            </h3>
            <Input label="Site Name" value={form.name}
              onChange={e => setForm({ ...form, name: e.target.value })}
              placeholder="e.g. Calangute Beach" required />

            <Input label="Short Description (for cards)" value={form.shortDescription}
              onChange={e => setForm({ ...form, shortDescription: e.target.value })}
              placeholder="One-line description" />

            <div style={{ marginBottom: 16 }}>
              <label style={{
                fontSize: 13, fontWeight: 500,
                color: 'var(--ink-soft)', display: 'block', marginBottom: 6
              }}>
                Full Description
              </label>
              <textarea
                value={form.description}
                onChange={e => setForm({ ...form, description: e.target.value })}
                placeholder="Detailed description of the site..."
                rows={4}
                style={{
                  width: '100%', padding: '11px 14px',
                  border: '1.5px solid var(--border)',
                  borderRadius: 10, fontSize: 14, outline: 'none',
                  resize: 'vertical', color: 'var(--ink)'
                }}
              />
            </div>

            <div style={{ marginBottom: 16 }}>
              <label style={{
                fontSize: 13, fontWeight: 500,
                color: 'var(--ink-soft)', display: 'block', marginBottom: 6
              }}>
                Category
              </label>
              <select
                value={form.category}
                onChange={e => setForm({ ...form, category: e.target.value })}
                style={{
                  width: '100%', padding: '11px 14px',
                  border: '1.5px solid var(--border)',
                  borderRadius: 10, fontSize: 14, outline: 'none',
                  background: 'var(--white)', color: 'var(--ink)'
                }}
              >
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>

          <div style={{
            background: 'var(--card-bg)', borderRadius: 20,
            padding: 28, boxShadow: 'var(--shadow)', marginBottom: 20
          }}>
            <h3 style={{ fontSize: 15, fontWeight: 600, color: 'var(--ink-soft)', marginBottom: 16 }}>
              Location & Timings
            </h3>
            <Input label="Address" value={form.address}
              onChange={e => setForm({ ...form, address: e.target.value })}
              placeholder="Full address" />

            <Input label="Opening Hours" value={form.openingHours}
              onChange={e => setForm({ ...form, openingHours: e.target.value })}
              placeholder="e.g. 9:00 AM - 6:00 PM" />

            <Input label="Entry Fee" value={form.entryFee}
              onChange={e => setForm({ ...form, entryFee: e.target.value })}
              placeholder="e.g. Free or ₹50" />

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <Input label="Latitude" value={form.latitude}
                onChange={e => setForm({ ...form, latitude: e.target.value })}
                placeholder="15.5440" type="number" />
              <Input label="Longitude" value={form.longitude}
                onChange={e => setForm({ ...form, longitude: e.target.value })}
                placeholder="73.7552" type="number" />
            </div>
          </div>

          <div style={{
            background: 'var(--card-bg)', borderRadius: 20,
            padding: 28, boxShadow: 'var(--shadow)', marginBottom: 24
          }}>
            <h3 style={{ fontSize: 15, fontWeight: 600, color: 'var(--ink-soft)', marginBottom: 16 }}>
              Images
            </h3>

            <input
              ref={fileRef} type="file"
              accept="image/*" style={{ display: 'none' }}
              onChange={handleImageUpload}
            />

            <button
              type="button"
              onClick={() => fileRef.current.click()}
              disabled={uploading}
              style={{
                width: '100%', padding: '20px',
                border: '2px dashed var(--border)',
                borderRadius: 12, background: 'transparent',
                color: 'var(--mist)', cursor: 'pointer',
                display: 'flex', flexDirection: 'column',
                alignItems: 'center', gap: 8, marginBottom: 16,
                transition: 'border-color 0.2s'
              }}
              onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--terra)'}
              onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}
            >
              <Upload size={24} />
              <span style={{ fontSize: 13 }}>
                {uploading ? 'Uploading...' : 'Click to upload image'}
              </span>
              <span style={{ fontSize: 11 }}>JPG, PNG — max 10MB</span>
            </button>

            {form.imageUrls?.length > 0 && (
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))',
                gap: 8
              }}>
                {form.imageUrls.map((url, i) => (
                  <div key={i} style={{ position: 'relative' }}>
                    <img src={url} alt="" style={{
                      width: '100%', height: 90,
                      objectFit: 'cover', borderRadius: 8
                    }} />
                    <button
                      type="button"
                      onClick={() => removeImage(url)}
                      style={{
                        position: 'absolute', top: 4, right: 4,
                        background: 'rgba(26,20,16,0.7)',
                        border: 'none', borderRadius: '50%',
                        width: 22, height: 22, cursor: 'pointer',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        color: 'white'
                      }}
                    >
                      <X size={12} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div style={{ display: 'flex', gap: 12 }}>
            <Button variant="secondary" type="button" onClick={() => navigate('/manager/sites')}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading} size="lg">
              {loading ? 'Saving...' : isEdit ? 'Update Site' : 'Create Site'}
            </Button>
          </div>
        </form>
      </div>
    </ManagerLayout>
  )
}