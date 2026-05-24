import { useState, useEffect } from 'react'
import { Calendar, MapPin, Users, Clock } from 'lucide-react'
import { toast } from 'react-hot-toast'
import TouristLayout from '../../components/layout/TouristLayout'
import Button from '../../components/ui/Button'
import { getMyBookings, cancelBooking } from '../../api/bookingApi'

const STATUS_COLORS = {
  PENDING: { bg: 'rgba(196,98,45,0.1)', color: 'var(--terra)' },
  CONFIRMED: { bg: 'rgba(45,122,79,0.1)', color: 'var(--success)' },
  CANCELLED: { bg: 'rgba(196,58,45,0.1)', color: 'var(--danger)' }
}

export default function TouristBookings() {
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getMyBookings()
      .then(r => setBookings(r.data))
      .catch(() => toast.error('Failed to load bookings'))
      .finally(() => setLoading(false))
  }, [])

  const handleCancel = async (id) => {
    if (!confirm('Cancel this booking?')) return
    try {
      await cancelBooking(id)
      setBookings(prev => prev.map(b =>
        b.id === id ? { ...b, status: 'CANCELLED' } : b
      ))
      toast.success('Booking cancelled')
    } catch {
      toast.error('Cancel failed')
    }
  }

  return (
    <TouristLayout>
      <h1 style={{
        fontFamily: 'Playfair Display, serif',
        fontSize: 28, color: 'var(--ink)', marginBottom: 24
      }}>
        My Bookings
      </h1>

      {loading ? (
        <div style={{ textAlign: 'center', padding: 60, color: 'var(--mist)' }}>Loading...</div>
      ) : bookings.length === 0 ? (
        <div style={{
          textAlign: 'center', padding: 60,
          background: 'var(--card-bg)', borderRadius: 16
        }}>
          <Calendar size={40} color="var(--mist)" style={{ marginBottom: 12 }} />
          <p style={{ color: 'var(--mist)' }}>No bookings yet</p>
          <p style={{ color: 'var(--mist)', fontSize: 13, marginTop: 4 }}>
            Explore sites and book a visit
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {bookings.map(b => {
            const statusStyle = STATUS_COLORS[b.status] || STATUS_COLORS.PENDING
            return (
              <div key={b.id} style={{
                background: 'var(--card-bg)',
                borderRadius: 16, padding: 20,
                boxShadow: 'var(--shadow)',
                border: '1px solid var(--border)'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 8 }}>
                  <div>
                    <h3 style={{
                      fontFamily: 'Playfair Display, serif',
                      fontSize: 18, color: 'var(--ink)', marginBottom: 8
                    }}>
                      {b.siteName}
                    </h3>
                    <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                        <MapPin size={13} color="var(--terra)" />
                        <span style={{ fontSize: 13, color: 'var(--mist)', textTransform: 'capitalize' }}>
                          {b.locationId}
                        </span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                        <Calendar size={13} color="var(--mist)" />
                        <span style={{ fontSize: 13, color: 'var(--mist)' }}>{b.visitDate}</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                        <Users size={13} color="var(--mist)" />
                        <span style={{ fontSize: 13, color: 'var(--mist)' }}>{b.numberOfPeople} people</span>
                      </div>
                    </div>
                    {b.notes && (
                      <p style={{ fontSize: 12, color: 'var(--mist)', marginTop: 6, fontStyle: 'italic' }}>
                        "{b.notes}"
                      </p>
                    )}
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 10 }}>
                    <span style={{
                      padding: '4px 12px', borderRadius: 20, fontSize: 12, fontWeight: 600,
                      background: statusStyle.bg, color: statusStyle.color
                    }}>
                      {b.status}
                    </span>
                    {b.status === 'PENDING' && (
                      <Button variant="danger" size="sm" onClick={() => handleCancel(b.id)}>
                        Cancel
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </TouristLayout>
  )
}