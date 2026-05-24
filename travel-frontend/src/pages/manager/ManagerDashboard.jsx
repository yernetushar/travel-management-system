import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { MapPin, Calendar, MessageCircle, BarChart2, Plus } from 'lucide-react'
import { toast } from 'react-hot-toast'
import ManagerLayout from '../../components/layout/ManagerLayout'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import { getMySites } from '../../api/siteApi'
import { getBookingsByLocation } from '../../api/bookingApi'
import { getLocationAnalytics } from '../../api/analyticsApi'
import useAuthStore from '../../store/authStore'

export default function ManagerDashboard() {
  const navigate = useNavigate()
  const { user } = useAuthStore()
  const [sites, setSites] = useState([])
  const [bookings, setBookings] = useState([])
  const [analytics, setAnalytics] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      try {
        const [sitesRes, bookingsRes, analyticsRes] = await Promise.all([
          getMySites(),
          getBookingsByLocation(user?.locationId),
          getLocationAnalytics(user?.locationId)
        ])
        setSites(sitesRes.data)
        setBookings(bookingsRes.data)
        setAnalytics(analyticsRes.data)
      } catch {
        toast.error('Failed to load dashboard')
      } finally {
        setLoading(false)
      }
    }
    if (user?.locationId) load()
  }, [user])

  const pendingBookings = bookings.filter(b => b.status === 'PENDING').length
  const totalViews = analytics.reduce((sum, a) => sum + (a.totalViews || 0), 0)
  const totalLikes = analytics.reduce((sum, a) => sum + (a.totalLikes || 0), 0)

  const stats = [
    { label: 'Total Sites', value: sites.length, icon: MapPin, color: 'var(--terra)', path: '/manager/sites' },
    { label: 'Pending Bookings', value: pendingBookings, icon: Calendar, color: '#2d5a7a', path: '/manager/bookings' },
    { label: 'Total Views', value: totalViews, icon: BarChart2, color: 'var(--success)', path: '/manager/analytics' },
    { label: 'Total Likes', value: totalLikes, icon: BarChart2, color: '#7a4f2d', path: '/manager/analytics' },
  ]

  return (
    <ManagerLayout>
      <div style={{ marginBottom: 32 }}>
        <h1 style={{
          fontFamily: 'Playfair Display, serif',
          fontSize: 32, color: 'var(--ink)', marginBottom: 6
        }}>
          Dashboard
        </h1>
        <p style={{ color: 'var(--mist)', fontSize: 14 }}>
          Managing tourism for <strong style={{ color: 'var(--terra)' }}>{user?.locationName}</strong>
        </p>
      </div>

      {/* Stats */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
        gap: 16, marginBottom: 32
      }}>
        {stats.map(({ label, value, icon: Icon, color, path }) => (
          <Card key={label} onClick={() => navigate(path)} style={{ padding: 20 }}>
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

      {/* Quick Actions */}
      <div style={{ marginBottom: 32 }}>
        <h2 style={{
          fontFamily: 'Playfair Display, serif',
          fontSize: 20, marginBottom: 16, color: 'var(--ink)'
        }}>
          Quick Actions
        </h2>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          <Button onClick={() => navigate('/manager/sites/new')}>
            <Plus size={16} /> Add New Site
          </Button>
          <Button variant="secondary" onClick={() => navigate('/manager/bookings')}>
            <Calendar size={16} /> View Bookings
          </Button>
          <Button variant="ghost" onClick={() => navigate('/manager/chat')}>
            <MessageCircle size={16} /> Check Messages
          </Button>
        </div>
      </div>

      {/* Recent Sites */}
      <div>
        <h2 style={{
          fontFamily: 'Playfair Display, serif',
          fontSize: 20, marginBottom: 16, color: 'var(--ink)'
        }}>
          Your Sites
        </h2>
        {loading ? (
          <div style={{ color: 'var(--mist)', padding: 20 }}>Loading...</div>
        ) : sites.length === 0 ? (
          <Card>
            <div style={{ textAlign: 'center', padding: 20 }}>
              <p style={{ color: 'var(--mist)', marginBottom: 16 }}>No sites yet</p>
              <Button onClick={() => navigate('/manager/sites/new')}>
                <Plus size={16} /> Add Your First Site
              </Button>
            </div>
          </Card>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: 16
          }}>
            {sites.slice(0, 6).map(site => (
              <Card key={site.id} onClick={() => navigate(`/manager/sites/edit/${site.id}`)}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                  <span style={{
                    fontSize: 11, fontWeight: 500,
                    background: 'rgba(196,98,45,0.1)',
                    color: 'var(--terra)',
                    padding: '2px 8px', borderRadius: 20
                  }}>
                    {site.category}
                  </span>
                  <span style={{
                    fontSize: 11,
                    color: site.active ? 'var(--success)' : 'var(--mist)'
                  }}>
                    {site.active ? '● Active' : '○ Inactive'}
                  </span>
                </div>
                <h3 style={{
                  fontFamily: 'Playfair Display, serif',
                  fontSize: 16, color: 'var(--ink)', marginBottom: 6
                }}>
                  {site.name}
                </h3>
                <p style={{
                  fontSize: 12, color: 'var(--mist)',
                  display: '-webkit-box', WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical', overflow: 'hidden'
                }}>
                  {site.shortDescription || site.description}
                </p>
                <div style={{
                  display: 'flex', gap: 16, marginTop: 12,
                  borderTop: '1px solid var(--border)', paddingTop: 10
                }}>
                  <span style={{ fontSize: 12, color: 'var(--mist)' }}>👁 {site.viewCount}</span>
                  <span style={{ fontSize: 12, color: 'var(--mist)' }}>❤️ {site.likeCount}</span>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </ManagerLayout>
  )
}