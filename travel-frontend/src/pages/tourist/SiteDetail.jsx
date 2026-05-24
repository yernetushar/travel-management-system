import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { MapPin, Clock, Ticket, Eye, Heart, MessageCircle, Calendar } from 'lucide-react'
import { toast } from 'react-hot-toast'
import TouristLayout from '../../components/layout/TouristLayout'
import Button from '../../components/ui/Button'
import { getSiteById } from '../../api/siteApi'
import { trackView, trackLike, getSiteAnalytics } from '../../api/analyticsApi'
import { createBooking } from '../../api/bookingApi'
import useAuthStore from '../../store/authStore'

export default function SiteDetail() {
  const { siteId } = useParams()
  const navigate = useNavigate()
  const { user } = useAuthStore()
  const [site, setSite] = useState(null)
  const [analytics, setAnalytics] = useState(null)
  const [loading, setLoading] = useState(true)
  const [liked, setLiked] = useState(false)
  const [showBooking, setShowBooking] = useState(false)
  const [booking, setBooking] = useState({ visitDate: '', numberOfPeople: 1, notes: '' })
  const [bookingLoading, setBookingLoading] = useState(false)

  useEffect(() => {
    loadData()
  }, [siteId])

  const loadData = async () => {
    try {
      const [siteRes, analyticsRes] = await Promise.all([
        getSiteById(siteId),
        getSiteAnalytics(siteId)
      ])
      setSite(siteRes.data)
      setAnalytics(analyticsRes.data)
      // Track view
      trackView(siteId, siteRes.data.name, siteRes.data.locationId).catch(() => {})
    } catch {
      toast.error('Failed to load site')
      navigate(-1)
    } finally {
      setLoading(false)
    }
  }

  const handleLike = async () => {
    if (liked) return
    try {
      await trackLike(siteId, site.name, site.locationId)
      setLiked(true)
      setAnalytics(prev => ({ ...prev, totalLikes: prev.totalLikes + 1 }))
      toast.success('Liked!')
    } catch {
      toast.error('Failed to like')
    }
  }

  const handleBook = async () => {
    if (!booking.visitDate) { toast.error('Select visit date'); return }
    setBookingLoading(true)
    try {
      await createBooking({
        siteId: site.id,
        siteName: site.name,
        locationId: site.locationId,
        visitDate: booking.visitDate,
        numberOfPeople: booking.numberOfPeople,
        notes: booking.notes
      })
      toast.success('Booking request sent!')
      setShowBooking(false)
    } catch {
      toast.error('Booking failed')
    } finally {
      setBookingLoading(false)
    }
  }

  if (loading) return (
    <TouristLayout>
      <div style={{ textAlign: 'center', padding: 60, color: 'var(--mist)' }}>
        Loading...
      </div>
    </TouristLayout>
  )

  if (!site) return null

  return (
    <TouristLayout>
      <button onClick={() => navigate(-1)} style={{
        background: 'none', border: 'none',
        color: 'var(--terra)', fontSize: 13,
        cursor: 'pointer', marginBottom: 16,
        display: 'flex', alignItems: 'center', gap: 4
      }}>
        ← Back to sites
      </button>

      {/* Hero Image */}
      {site.imageUrls?.[0] && (
        <div style={{
          height: 260,
          borderRadius: 20,
          background: `url(${site.imageUrls[0]}) center/cover`,
          marginBottom: 24
        }} />
      )}

      {/* Site Info */}
      <div style={{
        background: 'var(--card-bg)',
        borderRadius: 20,
        padding: 28,
        marginBottom: 20,
        boxShadow: 'var(--shadow)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12 }}>
          <div>
            <div style={{
              display: 'inline-block',
              background: 'var(--terra)',
              color: 'white',
              borderRadius: 20,
              padding: '3px 10px',
              fontSize: 11,
              fontWeight: 500,
              marginBottom: 10
            }}>
              {site.category}
            </div>
            <h1 style={{
              fontFamily: 'Playfair Display, serif',
              fontSize: 28, color: 'var(--ink)',
              marginBottom: 8
            }}>
              {site.name}
            </h1>
            <p style={{ color: 'var(--mist)', fontSize: 14, lineHeight: 1.6 }}>
              {site.description}
            </p>
          </div>
        </div>

        {/* Meta Info */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
          gap: 12, marginTop: 20
        }}>
          {[
            { icon: MapPin, text: site.address, color: 'var(--terra)' },
            { icon: Clock, text: site.openingHours, color: 'var(--ink-soft)' },
            { icon: Ticket, text: site.entryFee, color: site.entryFee === 'Free' ? 'var(--success)' : 'var(--terra)' },
          ].filter(i => i.text).map(({ icon: Icon, text, color }) => (
            <div key={text} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Icon size={15} color={color} />
              <span style={{ fontSize: 13, color: 'var(--ink-soft)' }}>{text}</span>
            </div>
          ))}
        </div>

        {/* Analytics */}
        {analytics && (
          <div style={{
            display: 'flex', gap: 20,
            marginTop: 20, paddingTop: 20,
            borderTop: '1px solid var(--border)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <Eye size={16} color="var(--mist)" />
              <span style={{ fontSize: 14, color: 'var(--mist)' }}>
                {analytics.totalViews} views
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <Heart size={16} color={liked ? 'var(--danger)' : 'var(--mist)'} fill={liked ? 'var(--danger)' : 'none'} />
              <span style={{ fontSize: 14, color: 'var(--mist)' }}>
                {analytics.totalLikes} likes
              </span>
            </div>
            {analytics.currentViewers > 0 && (
              <div style={{
                display: 'flex', alignItems: 'center', gap: 6,
                background: 'rgba(45,122,79,0.1)',
                padding: '4px 10px', borderRadius: 20
              }}>
                <div style={{
                  width: 7, height: 7,
                  background: 'var(--success)',
                  borderRadius: '50%'
                }} />
                <span style={{ fontSize: 13, color: 'var(--success)' }}>
                  {analytics.currentViewers} viewing now
                </span>
              </div>
            )}
          </div>
        )}

        {/* Actions */}
        <div style={{ display: 'flex', gap: 12, marginTop: 20, flexWrap: 'wrap' }}>
          <Button onClick={handleLike} variant={liked ? 'danger' : 'ghost'}>
            <Heart size={16} /> {liked ? 'Liked!' : 'Like'}
          </Button>
          <Button onClick={() => setShowBooking(true)}>
            <Calendar size={16} /> Book Visit
          </Button>
          <Button
            variant="secondary"
            onClick={() => navigate('/chat', { state: { managerId: site.managerId, managerName: site.managerName, locationId: site.locationId } })}
          >
            <MessageCircle size={16} /> Chat with Manager
          </Button>
        </div>
      </div>

      {/* More Images */}
      {site.imageUrls?.length > 1 && (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
          gap: 12, marginBottom: 20
        }}>
          {site.imageUrls.slice(1).map((url, i) => (
            <div key={i} style={{
              height: 120, borderRadius: 12,
              background: `url(${url}) center/cover`
            }} />
          ))}
        </div>
      )}

      {/* Booking Modal */}
      {showBooking && (
        <div style={{
          position: 'fixed', inset: 0,
          background: 'rgba(26,20,16,0.7)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 200, padding: 24
        }}>
          <div style={{
            background: 'var(--white)',
            borderRadius: 20, padding: 32,
            width: '100%', maxWidth: 420,
            boxShadow: 'var(--shadow-lg)'
          }}>
            <h2 style={{
              fontFamily: 'Playfair Display, serif',
              fontSize: 22, marginBottom: 20
            }}>
              Book {site.name}
            </h2>

            <div style={{ marginBottom: 16 }}>
              <label style={{ fontSize: 13, fontWeight: 500, color: 'var(--ink-soft)', display: 'block', marginBottom: 6 }}>
                Visit Date *
              </label>
              <input
                type="date"
                value={booking.visitDate}
                min={new Date().toISOString().split('T')[0]}
                onChange={e => setBooking({ ...booking, visitDate: e.target.value })}
                style={{
                  width: '100%', padding: '11px 14px',
                  border: '1.5px solid var(--border)',
                  borderRadius: 10, fontSize: 14, outline: 'none'
                }}
              />
            </div>

            <div style={{ marginBottom: 16 }}>
              <label style={{ fontSize: 13, fontWeight: 500, color: 'var(--ink-soft)', display: 'block', marginBottom: 6 }}>
                Number of People
              </label>
              <input
                type="number"
                min={1} max={20}
                value={booking.numberOfPeople}
                onChange={e => setBooking({ ...booking, numberOfPeople: parseInt(e.target.value) })}
                style={{
                  width: '100%', padding: '11px 14px',
                  border: '1.5px solid var(--border)',
                  borderRadius: 10, fontSize: 14, outline: 'none'
                }}
              />
            </div>

            <div style={{ marginBottom: 24 }}>
              <label style={{ fontSize: 13, fontWeight: 500, color: 'var(--ink-soft)', display: 'block', marginBottom: 6 }}>
                Notes (optional)
              </label>
              <textarea
                value={booking.notes}
                onChange={e => setBooking({ ...booking, notes: e.target.value })}
                placeholder="Any special requirements..."
                rows={3}
                style={{
                  width: '100%', padding: '11px 14px',
                  border: '1.5px solid var(--border)',
                  borderRadius: 10, fontSize: 14, outline: 'none',
                  resize: 'none'
                }}
              />
            </div>

            <div style={{ display: 'flex', gap: 12 }}>
              <Button variant="secondary" onClick={() => setShowBooking(false)} fullWidth>
                Cancel
              </Button>
              <Button onClick={handleBook} disabled={bookingLoading} fullWidth>
                {bookingLoading ? 'Booking...' : 'Confirm Booking'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </TouristLayout>
  )
}