import { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuthStore } from '../../store/authStore'
import { apiUnreadCount } from '../../api'
import {
  Compass, User, LogOut, Bell, MessageSquare,
  Menu, X, BookOpen, LayoutDashboard, Map, Image
} from 'lucide-react'
import './Navbar.css'

export default function Navbar() {
  const { isAuthenticated, user, logout } = useAuthStore()
  const [open, setOpen] = useState(false)
  const [unread, setUnread] = useState(0)
  const nav = useNavigate()
  const loc = useLocation()

  const isManager = user?.role === 'TOURISM_MANAGER'

  useEffect(() => {
    if (!isAuthenticated) return
    apiUnreadCount().then(r => setUnread(r.data.count)).catch(() => {})
  }, [isAuthenticated, loc.pathname])

  const go = (path) => { nav(path); setOpen(false) }

  return (
    <nav className="navbar">
      <div className="navbar-wrap">
        {/* Logo */}
        <button className="nav-logo" onClick={() => go(isManager ? '/manager' : '/')}>
          <Compass size={20} strokeWidth={1.8} />
          <span>TravelMgmt</span>
        </button>

        {/* Links */}
        <ul className={`nav-links ${open ? 'is-open' : ''}`}>
          {!isManager && (
            <li><button onClick={() => go('/')}><Map size={15}/>Explore</button></li>
          )}
          {isManager && <>
            <li><button onClick={() => go('/manager')}><LayoutDashboard size={15}/>Dashboard</button></li>
            <li><button onClick={() => go('/manager/sites')}><Map size={15}/>My Sites</button></li>
            <li><button onClick={() => go('/manager/bookings')}><BookOpen size={15}/>Bookings</button></li>
            <li><button onClick={() => go('/manager/images')}><Image size={15}/>Images</button></li>
            <li><button onClick={() => go('/manager/chat')}><MessageSquare size={15}/>Messages</button></li>
          </>}
          {isAuthenticated && !isManager && <>
            <li><button onClick={() => go('/my-bookings')}><BookOpen size={15}/>My Bookings</button></li>
            <li><button onClick={() => go('/chat')}><MessageSquare size={15}/>Chat</button></li>
          </>}
        </ul>

        {/* Right actions */}
        <div className="nav-actions">
          {isAuthenticated ? <>
            <button className="nav-icon-btn" onClick={() => go('/notifications')} title="Notifications">
              <Bell size={17} />
              {unread > 0 && <span className="notif-dot">{unread > 9 ? '9+' : unread}</span>}
            </button>
            <button className="nav-icon-btn" onClick={() => go('/profile')} title="Profile">
              <User size={17} />
            </button>
            <button className="nav-icon-btn" onClick={() => { logout(); nav('/login') }} title="Logout">
              <LogOut size={17} />
            </button>
          </> : <>
            <Link to="/login" className="btn btn-ghost btn-sm">Login</Link>
            <Link to="/signup" className="btn btn-primary btn-sm">Sign up</Link>
          </>}
          <button className="hamburger" onClick={() => setOpen(!open)}>
            {open ? <X size={20}/> : <Menu size={20}/>}
          </button>
        </div>
      </div>
    </nav>
  )
}