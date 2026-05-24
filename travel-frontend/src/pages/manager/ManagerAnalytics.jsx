import { useState, useEffect } from 'react'
import { BarChart2, Eye, Heart, Calendar } from 'lucide-react'
import { toast } from 'react-hot-toast'
import ManagerLayout from '../../components/layout/ManagerLayout'
import Card from '../../components/ui/Card'
import { getLocationAnalytics } from '../../api/analyticsApi'
import useAuthStore from '../../store/authStore'

export default function ManagerAnalytics() {
  const { user } = useAuthStore()
  const [analytics, setAnalytics] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user?.locationId) {
      getLocationAnalytics(user.locationId)
        .then(r => setAnalytics(r.data))
        .catch(() => toast.error('Failed to load analytics'))
        .finally(() => setLoading(false))
    }
  }, [user])

  const totals = analytics.reduce((acc, a) => ({
    views: acc.views + (a.totalViews || 0),
    likes: acc.likes + (a.totalLikes || 0),
    bookings: acc.bookings + (a.totalBookings || 0),
    viewers: acc.viewers + (a.currentViewers || 0)
  }), { views: 0, likes: 0, bookings: 0, viewers: 0 })

  return (
    <ManagerLayout>
      <h1 style={{
        fontFamily: 'Playfair Display, serif',
        fontSize: 28, color: 'var(--ink)', marginBottom: 24
      }}>
        Analytics — {user?.locationName}
      </h1>

      {/* Summary Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
        gap: 16, marginBottom: 32
      }}>
        {[
          { label: 'Total Views', value: totals.views, icon: Eye, color: 'var(--terra)' },
          { label: 'Total Likes', value: totals.likes, icon: Heart, color: '#c43a2d' },
          { label: 'Total Bookings', value: totals.bookings, icon: Calendar, color: 'var(--success)' },
          { label: 'Live Viewers', value: totals.viewers, icon: BarChart2, color: '#2d5a7a' },
        ].map(({ label, value, icon: Icon, color }) => (
          <Card key={label} style={{ padding: 20 }}>
            <div style={{
              width: 44, height: 44, borderRadius: 12,
              background: `${color}20`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              marginBottom: 12
            }}>
              <Icon size={22} color={color} />
            </div>
            <div style={{ fontSize: 28, fontWeight: 700, color: 'var(--ink)', marginBottom: 4 }}>
              {loading ? '...' : value}
            </div>
            <div style={{ fontSize: 13, color: 'var(--mist)' }}>{label}</div>
          </Card>
        ))}
      </div>

      {/* Per Site Analytics */}
      <h2 style={{
        fontFamily: 'Playfair Display, serif',
        fontSize: 20, marginBottom: 16, color: 'var(--ink)'
      }}>
        Per Site Breakdown
      </h2>

      {loading ? (
        <div style={{ textAlign: 'center', padding: 60, color: 'var(--mist)' }}>Loading...</div>
      ) : analytics.length === 0 ? (
        <Card>
          <div style={{ textAlign: 'center', padding: 40, color: 'var(--mist)' }}>
            No analytics data yet
          </div>
        </Card>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {analytics.map(a => (
            <div key={a.siteId} style={{
              background: 'var(--card-bg)', borderRadius: 16,
              padding: 20, boxShadow: 'var(--shadow)',
              border: '1px solid var(--border)'
            }}>
              <div style={{
                display: 'flex', justifyContent: 'space-between',
                alignItems: 'center', flexWrap: 'wrap', gap: 12
              }}>
                <h3 style={{
                  fontFamily: 'Playfair Display, serif',
                  fontSize: 17, color: 'var(--ink)'
                }}>
                  {a.siteName}
                </h3>

                {a.currentViewers > 0 && (
                  <div style={{
                    display: 'flex', alignItems: 'center', gap: 6,
                    background: 'rgba(45,122,79,0.1)',
                    padding: '4px 12px', borderRadius: 20
                  }}>
                    <div style={{
                      width: 7, height: 7,
                      background: 'var(--success)',
                      borderRadius: '50%'
                    }} />
                    <span style={{ fontSize: 12, color: 'var(--success)' }}>
                      {a.currentViewers} live
                    </span>
                  </div>
                )}
              </div>

              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))',
                gap: 12, marginTop: 16
              }}>
                {[
                  { label: 'Views', value: a.totalViews, color: 'var(--terra)' },
                  { label: 'Likes', value: a.totalLikes, color: '#c43a2d' },
                  { label: 'Bookings', value: a.totalBookings, color: 'var(--success)' },
                ].map(({ label, value, color }) => (
                  <div key={label} style={{
                    background: `${color}10`,
                    borderRadius: 10, padding: '10px 14px',
                    border: `1px solid ${color}20`
                  }}>
                    <div style={{ fontSize: 20, fontWeight: 700, color }}>{value}</div>
                    <div style={{ fontSize: 12, color: 'var(--mist)' }}>{label}</div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </ManagerLayout>
  )
}