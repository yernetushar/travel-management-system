import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search } from 'lucide-react'
import TouristLayout from '../../components/layout/TouristLayout'
import useAuthStore from '../../store/authStore'

const LOCATIONS = [
  { id: 'goa', name: 'Goa', emoji: '🏖️', desc: 'Beaches & Portuguese heritage' },
  { id: 'jaipur', name: 'Jaipur', emoji: '🏰', desc: 'Pink city forts & palaces' },
  { id: 'kerala', name: 'Kerala', emoji: '🌴', desc: 'Backwaters & spice gardens' },
  { id: 'delhi', name: 'Delhi', emoji: '🕌', desc: 'Historical monuments' },
  { id: 'mumbai', name: 'Mumbai', emoji: '🌆', desc: 'City of dreams' },
  { id: 'agra', name: 'Agra', emoji: '🕍', desc: 'Taj Mahal & Mughal history' },
  { id: 'varanasi', name: 'Varanasi', emoji: '🪔', desc: 'Spiritual city on Ganges' },
  { id: 'manali', name: 'Manali', emoji: '🏔️', desc: 'Snow-capped mountains' },
]

export default function TouristHome() {
  const navigate = useNavigate()
  const { user } = useAuthStore()
  const [search, setSearch] = useState('')

  const filtered = LOCATIONS.filter(l =>
    l.name.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <TouristLayout>
      {/* Welcome */}
      <div style={{
        background: 'linear-gradient(135deg, var(--ink) 0%, var(--ink-soft) 100%)',
        borderRadius: 20, padding: '32px',
        marginBottom: 28, position: 'relative', overflow: 'hidden'
      }}>
        <div style={{
          position: 'absolute', top: -20, right: -20,
          width: 120, height: 120,
          background: 'rgba(196,98,45,0.15)',
          borderRadius: '50%'
        }} />
        <h1 style={{
          fontFamily: 'Playfair Display, serif',
          fontSize: 26, color: 'var(--white)',
          marginBottom: 6, position: 'relative'
        }}>
          Welcome, {user?.name?.split(' ')[0]}! 👋
        </h1>
        <p style={{ color: 'rgba(245,240,232,0.7)', fontSize: 14, position: 'relative' }}>
          Where would you like to explore today?
        </p>
      </div>

      {/* Search */}
      <div style={{
        position: 'relative', marginBottom: 28
      }}>
        <Search size={18} style={{
          position: 'absolute', left: 14, top: '50%',
          transform: 'translateY(-50%)', color: 'var(--mist)'
        }} />
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search destinations..."
          style={{
            width: '100%', padding: '12px 12px 12px 42px',
            border: '1.5px solid var(--border)',
            borderRadius: 12, background: 'var(--card-bg)',
            fontSize: 14, outline: 'none', color: 'var(--ink)'
          }}
        />
      </div>

      {/* Destinations Grid */}
      <h2 style={{
        fontFamily: 'Playfair Display, serif',
        fontSize: 22, marginBottom: 16, color: 'var(--ink)'
      }}>
        Choose a Destination
      </h2>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
        gap: 16
      }}>
        {filtered.map(loc => (
          <div
            key={loc.id}
            onClick={() => navigate(`/sites/${loc.id}`)}
            style={{
              background: 'var(--card-bg)',
              borderRadius: 16,
              padding: 20,
              cursor: 'pointer',
              border: '1px solid var(--border)',
              boxShadow: 'var(--shadow)',
              transition: 'all 0.2s',
              textAlign: 'center'
            }}
            onMouseEnter={e => {
              e.currentTarget.style.transform = 'translateY(-4px)'
              e.currentTarget.style.boxShadow = 'var(--shadow-lg)'
              e.currentTarget.style.borderColor = 'var(--terra)'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.transform = 'translateY(0)'
              e.currentTarget.style.boxShadow = 'var(--shadow)'
              e.currentTarget.style.borderColor = 'var(--border)'
            }}
          >
            <div style={{ fontSize: 36, marginBottom: 10 }}>{loc.emoji}</div>
            <h3 style={{
              fontFamily: 'Playfair Display, serif',
              fontSize: 16, fontWeight: 700,
              color: 'var(--ink)', marginBottom: 4
            }}>
              {loc.name}
            </h3>
            <p style={{ fontSize: 12, color: 'var(--mist)', lineHeight: 1.4 }}>
              {loc.desc}
            </p>
          </div>
        ))}
      </div>
    </TouristLayout>
  )
}