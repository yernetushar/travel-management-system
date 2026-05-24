import { useState, useEffect } from 'react'
import { Calendar, Users, MapPin } from 'lucide-react'
import { toast } from 'react-hot-toast'
import ManagerLayout from '../../components/layout/ManagerLayout'
import Button from '../../components/ui/Button'
import { getBookingsByLocation, updateBookingStatus } from '../../api/bookingApi'
import useAuthStore from '../../store/authStore'

const STATUS_COLORS = {
  PENDING: { bg: 'rgba(196,98,45,0.1)', color: 'var(--terra)' },
  CONFIRMED: { bg: 'rgba(45,122,79,0.1)', color: 'var(--success)' },
  CANCELLED: { bg: 'rgba(196,58,45,0.1)', color: 'var(--danger)' }
}

export default function ManagerBookings() {
  const { user } = useAuthStore()
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('ALL')

  useEffect(() => {
    if (user?.locationId) {
      getBookingsByLocation(user.locationId)
        .then(r => setBookings(r.data))
        .catch(() => toast.error('Failed to load bookings'))
        .finally(() => setLoading(false))
    }
  }, [user])

  const handleStatus = async (bookingId, status) => {
    try {
      const res = await updateBookingStatus(bookingId, status)
      setBookings(prev => prev.map(b => b.id === bookingId ? res.data : b))
      toast.success(`Booking ${status.toLowerCase()}`)
    } catch {
      toast.error('Update failed')
    }
  }

  const filtered = filter === 'ALL' ? bookings : bookings.filter(b => b.status === filter)

  return (
    <ManagerLayout>
      <h1 style={{
        fontFamily: 'Playfair Display, serif',
        fontSize: 28, color: 'var(--ink)', marginBottom: 24
      }}>
        Bookings
      </h1>

      {/* Filter Tabs */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 24 }}>
        {['ALL', 'PENDING', 'CONFIRMED', 'CANCELLED'].map(s => (
          <button key={s} onClick={() => setFilter(s)} style={{
            padding: '7px 16px', borderRadius: 20,
            border: '1.5px solid',
            borderColor: filter === s ? 'var(--terra)' : 'var(--border)',
            background: filter === s ? 'var(--terra)' : 'transparent',
            color: filter === s ? 'white' : 'var(--mist)',
            fontSize: 13, fontWeight: 500, cursor: 'pointer',
            transition: 'all 0.2s'
          }}>
            {s} {s !== 'ALL' && `(${bookings.filter(b => b.status === s).length})`}
          </button>
        ))}
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: 60, color: 'var(--mist)' }}>Loading...</div>
      ) : filtered.length === 0 ? (
        <div style={{
          textAlign: 'center', padding: 60,
          background: 'var(--card-bg)', borderRadius: 16
        }}>
          <Calendar size={40} color="var(--mist)" style={{ marginBottom: 12 }} />
          <p style={{ color: 'var(--mist)' }}>No bookings found</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {filtered.map(b => {
            const statusStyle = STATUS_COLORS[b.status] || STATUS_COLORS.PENDING
            return (
              <div key={b.id} style={{
                background: 'var(--card-bg)', borderRadius: 16,
                padding: 20, boxShadow: 'var(--shadow)',
                border: '1px solid var(--border)'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
                  <div>
                    <h3 style={{
                      fontFamily: 'Playfair Display, serif',
                      fontSize: 17, color: 'var(--ink)', marginBottom: 8
                    }}>
                      {b.siteName}
                    </h3>
                    <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', marginBottom: 8 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                        <Users size={13} color="var(--mist)" />
                        <span style={{ fontSize: 13, color: 'var(--ink-soft)' }}>
                          {b.userName} ({b.userEmail})
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
                      <p style={{ fontSize: 12, color: 'var(--mist)', fontStyle: 'italic' }}>
                        "{b.notes}"
                      </p>
                    )}
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 10 }}>
                    <span style={{
                      padding: '4px 12px', borderRadius: 20,
                      fontSize: 12, fontWeight: 600,
                      background: statusStyle.bg, color: statusStyle.color
                    }}>
                      {b.status}
                    </span>

                    {b.status === 'PENDING' && (
                      <div style={{ display: 'flex', gap: 8 }}>
                        <Button size="sm" onClick={() => handleStatus(b.id, 'CONFIRMED')}>
                          Confirm
                        </Button>
                        <Button size="sm" variant="danger" onClick={() => handleStatus(b.id, 'CANCELLED')}>
                          Reject
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </ManagerLayout>
  )
}