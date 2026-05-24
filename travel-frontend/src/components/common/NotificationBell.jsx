import { useState, useEffect, useRef } from 'react'
import { Bell } from 'lucide-react'
import { getMyNotifications, getUnreadCount, markAsRead, markAllAsRead } from '../../api/notificationApi'
import useAuthStore from '../../store/authStore'

export default function NotificationBell() {
  const { user } = useAuthStore()
  const [notifications, setNotifications] = useState([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    if (!user) return
    loadNotifications()
    // Poll every 10 seconds for new notifications
    const interval = setInterval(loadNotifications, 10000)
    return () => clearInterval(interval)
  }, [user])

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const loadNotifications = async () => {
    try {
      const [notifsRes, countRes] = await Promise.all([
        getMyNotifications(),
        getUnreadCount()
      ])
      setNotifications(notifsRes.data)
      setUnreadCount(countRes.data.count)
    } catch {
      // silent fail
    }
  }

  const handleOpen = async () => {
    setOpen(prev => !prev)
  }

  const handleMarkAllRead = async () => {
    try {
      await markAllAsRead()
      setUnreadCount(0)
      setNotifications(prev => prev.map(n => ({ ...n, read: true })))
    } catch {}
  }

  const handleMarkOne = async (id) => {
    try {
      await markAsRead(id)
      setNotifications(prev =>
        prev.map(n => n.id === id ? { ...n, read: true } : n)
      )
      setUnreadCount(prev => Math.max(0, prev - 1))
    } catch {}
  }

  return (
    <div ref={ref} style={{ position: 'relative' }}>
      {/* Bell Icon */}
      <button
        onClick={handleOpen}
        style={{
          position: 'relative',
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          padding: 8,
          borderRadius: 10,
          display: 'flex',
          alignItems: 'center',
          color: 'var(--ink)'
        }}
      >
        <Bell size={22} />
        {unreadCount > 0 && (
          <span style={{
            position: 'absolute',
            top: 2, right: 2,
            background: 'var(--terra)',
            color: 'white',
            borderRadius: '50%',
            width: 18, height: 18,
            fontSize: 11,
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {open && (
        <div style={{
          position: 'absolute',
          top: '110%',
          right: 0,
          width: 340,
          background: 'white',
          borderRadius: 16,
          boxShadow: '0 8px 32px rgba(0,0,0,0.15)',
          zIndex: 1000,
          overflow: 'hidden',
          border: '1px solid var(--border)'
        }}>
          {/* Header */}
          <div style={{
            padding: '14px 20px',
            borderBottom: '1px solid var(--border)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <span style={{ fontWeight: 600, fontSize: 15, color: 'var(--ink)' }}>
              Notifications
            </span>
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllRead}
                style={{
                  background: 'none', border: 'none',
                  color: 'var(--terra)', fontSize: 12,
                  cursor: 'pointer', fontWeight: 500
                }}
              >
                Mark all read
              </button>
            )}
          </div>

          {/* List */}
          <div style={{ maxHeight: 380, overflowY: 'auto' }}>
            {notifications.length === 0 ? (
              <div style={{
                padding: 40, textAlign: 'center',
                color: 'var(--mist)', fontSize: 14
              }}>
                No notifications yet
              </div>
            ) : (
              notifications.map(n => (
                <div
                  key={n.id}
                  onClick={() => !n.read && handleMarkOne(n.id)}
                  style={{
                    padding: '14px 20px',
                    borderBottom: '1px solid var(--border)',
                    background: n.read ? 'white' : 'rgba(196,98,45,0.06)',
                    cursor: n.read ? 'default' : 'pointer',
                    transition: 'background 0.15s'
                  }}
                >
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    gap: 8
                  }}>
                    <div>
                      <div style={{
                        fontWeight: n.read ? 400 : 600,
                        fontSize: 13,
                        color: 'var(--ink)',
                        marginBottom: 4
                      }}>
                        {n.title}
                      </div>
                      <div style={{ fontSize: 12, color: 'var(--mist)' }}>
                        {n.message}
                      </div>
                    </div>
                    {!n.read && (
                      <div style={{
                        width: 8, height: 8,
                        borderRadius: '50%',
                        background: 'var(--terra)',
                        flexShrink: 0,
                        marginTop: 4
                      }} />
                    )}
                  </div>
                  <div style={{
                    fontSize: 11, color: 'var(--mist)',
                    marginTop: 6
                  }}>
                    {new Date(n.createdAt).toLocaleString()}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  )
}