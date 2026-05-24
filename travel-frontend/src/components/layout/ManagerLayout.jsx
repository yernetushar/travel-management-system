import { Link, useLocation } from 'react-router-dom'
import { LayoutDashboard, MapPin, Calendar, MessageCircle, BarChart2, User, LogOut } from 'lucide-react'
import useAuthStore from '../../store/authStore'
import NotificationBell from '../common/NotificationBell'

export default function ManagerLayout({ children }) {
  const location = useLocation()
  const { logout, user } = useAuthStore()

  const nav = [
    { path: '/manager', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/manager/sites', icon: MapPin, label: 'Sites' },
    { path: '/manager/bookings', icon: Calendar, label: 'Bookings' },
    { path: '/manager/chat', icon: MessageCircle, label: 'Messages' },
    { path: '/manager/analytics', icon: BarChart2, label: 'Analytics' },
    { path: '/manager/profile', icon: User, label: 'Profile' },
  ]

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      {/* Sidebar */}
      <aside style={{
        width: 240,
        background: 'var(--ink)',
        display: 'flex',
        flexDirection: 'column',
        padding: '24px 0',
        position: 'fixed',
        top: 0,
        left: 0,
        height: '100vh',
        zIndex: 100,
        boxShadow: '4px 0 32px rgba(0,0,0,0.2)'
      }}>
        <div style={{ padding: '0 24px 32px' }}>
          <div style={{
            fontFamily: 'Playfair Display, serif',
            fontSize: 20,
            fontWeight: 700,
            color: 'var(--terra-light)'
          }}>
            TravelMgmt
          </div>
          <div style={{
            fontSize: 11,
            color: 'var(--mist)',
            marginTop: 4,
            textTransform: 'uppercase',
            letterSpacing: 1
          }}>
            Manager Portal
          </div>
        </div>

        <div style={{
          padding: '12px 16px',
          margin: '0 12px 24px',
          background: 'rgba(196,98,45,0.1)',
          borderRadius: 12,
          border: '1px solid rgba(196,98,45,0.2)'
        }}>
          <div style={{ color: 'var(--sand)', fontSize: 13, fontWeight: 500 }}>
            {user?.name}
          </div>
          <div style={{ color: 'var(--terra-light)', fontSize: 12, marginTop: 2 }}>
            📍 {user?.locationName || 'Location Manager'}
          </div>
        </div>

        <nav style={{ flex: 1 }}>
          {nav.map(({ path, icon: Icon, label }) => {
            const active = location.pathname === path
            return (
              <Link key={path} to={path} style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                padding: '12px 24px',
                color: active ? 'var(--terra-light)' : 'var(--mist)',
                background: active ? 'rgba(196,98,45,0.15)' : 'transparent',
                borderLeft: active ? '3px solid var(--terra)' : '3px solid transparent',
                fontSize: 14,
                fontWeight: active ? 500 : 400,
                transition: 'all 0.2s',
                marginBottom: 2
              }}>
                <Icon size={18} />
                {label}
              </Link>
            )
          })}
        </nav>

        <button onClick={logout} style={{
          margin: '0 16px 16px',
          background: 'rgba(196,98,45,0.1)',
          border: '1px solid rgba(196,98,45,0.2)',
          borderRadius: 10,
          padding: '10px 16px',
          color: 'var(--terra-light)',
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          fontSize: 13,
          cursor: 'pointer'
        }}>
          <LogOut size={16} /> Logout
        </button>
      </aside>

      {/* Main */}
      <main style={{
        marginLeft: 240,
        flex: 1,
        padding: '32px',
        minHeight: '100vh',
        background: 'var(--sand)'
      }}>
        {/* Top bar with notification bell */}
        <div style={{
          display: 'flex',
          justifyContent: 'flex-end',
          marginBottom: 24
        }}>
          <NotificationBell />
        </div>

        {children}
      </main>
    </div>
  )
}