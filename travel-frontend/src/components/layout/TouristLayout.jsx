import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Home, Map, Calendar, MessageCircle, User, LogOut } from 'lucide-react'
import useAuthStore from '../../store/authStore'
import NotificationBell from '../common/NotificationBell'

export default function TouristLayout({ children }) {
  const location = useLocation()
  const navigate = useNavigate()
  const { logout, user } = useAuthStore()

  const nav = [
    { path: '/home', icon: Home, label: 'Home' },
    { path: '/sites/goa', icon: Map, label: 'Explore' },
    { path: '/bookings', icon: Calendar, label: 'Bookings' },
    { path: '/chat', icon: MessageCircle, label: 'Chat' },
    { path: '/profile', icon: User, label: 'Profile' },
  ]

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Top Navbar */}
      <header style={{
        background: 'var(--ink)',
        padding: '0 24px',
        height: 64,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'sticky',
        top: 0,
        zIndex: 100,
        boxShadow: '0 2px 24px rgba(0,0,0,0.3)'
      }}>
        <Link to="/home" style={{
          fontFamily: 'Playfair Display, serif',
          fontSize: 22,
          fontWeight: 700,
          color: 'var(--terra-light)',
          letterSpacing: '-0.5px'
        }}>
          TravelMgmt
        </Link>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ color: 'var(--sand)', fontSize: 14, opacity: 0.8 }}>
            {user?.name}
          </span>

          <NotificationBell />

          <button onClick={logout} style={{
            background: 'rgba(196,98,45,0.2)',
            border: 'none',
            borderRadius: 8,
            padding: '8px 12px',
            color: 'var(--terra-light)',
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            fontSize: 13,
            cursor: 'pointer',
            transition: 'background 0.2s'
          }}>
            <LogOut size={15} /> Logout
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main style={{ flex: 1, padding: '24px', maxWidth: 1200, margin: '0 auto', width: '100%' }}>
        {children}
      </main>

      {/* Bottom Nav */}
      <nav style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        background: 'var(--ink)',
        display: 'flex',
        borderTop: '1px solid rgba(196,98,45,0.2)',
        zIndex: 100
      }}>
        {nav.map(({ path, icon: Icon, label }) => {
          const active = location.pathname === path
          return (
            <Link key={path} to={path} style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              padding: '10px 0',
              color: active ? 'var(--terra-light)' : 'var(--mist)',
              fontSize: 11,
              gap: 4,
              transition: 'color 0.2s'
            }}>
              <Icon size={20} />
              {label}
            </Link>
          )
        })}
      </nav>

      <div style={{ height: 64 }} />
    </div>
  )
}