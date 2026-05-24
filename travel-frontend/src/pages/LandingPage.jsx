import { useNavigate } from 'react-router-dom'
import { MapPin, Star, Shield, MessageCircle } from 'lucide-react'
import Button from '../components/ui/Button'

const DESTINATIONS = [
  { id: 'goa', name: 'Goa', desc: 'Beaches & heritage', emoji: '🏖️' },
  { id: 'jaipur', name: 'Jaipur', desc: 'Pink city forts', emoji: '🏰' },
  { id: 'kerala', name: 'Kerala', desc: 'Backwaters & nature', emoji: '🌴' },
  { id: 'delhi', name: 'Delhi', desc: 'Capital monuments', emoji: '🕌' },
  { id: 'mumbai', name: 'Mumbai', desc: 'City of dreams', emoji: '🌆' },
  { id: 'agra', name: 'Agra', desc: 'Taj Mahal & more', emoji: '🕍' },
]

export default function LandingPage() {
  const navigate = useNavigate()

  return (
    <div style={{ minHeight: '100vh', background: 'var(--sand)' }}>
      {/* Header */}
      <header style={{
        padding: '20px 48px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        background: 'var(--ink)'
      }}>
        <div style={{
          fontFamily: 'Playfair Display, serif',
          fontSize: 24, fontWeight: 700,
          color: 'var(--terra-light)'
        }}>
          TravelMgmt
        </div>
        <div style={{ display: 'flex', gap: 12 }}>
          <Button variant="ghost" onClick={() => navigate('/login')}>
            Tourist Login
          </Button>
          <Button onClick={() => navigate('/manager/login')} variant="secondary">
            Manager Login
          </Button>
        </div>
      </header>

      {/* Hero */}
      <section style={{
        background: 'linear-gradient(135deg, var(--ink) 0%, var(--ink-soft) 100%)',
        padding: '100px 48px',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(196,98,45,0.15) 0%, transparent 50%), radial-gradient(circle at 80% 50%, rgba(196,98,45,0.1) 0%, transparent 50%)',
          pointerEvents: 'none'
        }} />

        <h1 style={{
          fontFamily: 'Playfair Display, serif',
          fontSize: 'clamp(36px, 6vw, 72px)',
          fontWeight: 900,
          color: 'var(--white)',
          lineHeight: 1.1,
          marginBottom: 24,
          position: 'relative'
        }}>
          Discover Incredible<br />
          <span style={{ color: 'var(--terra-light)' }}>India</span>
        </h1>

        <p style={{
          fontSize: 18, color: 'rgba(245,240,232,0.7)',
          maxWidth: 520, margin: '0 auto 40px',
          lineHeight: 1.6, position: 'relative'
        }}>
          Explore verified tourist sites, book experiences, and connect with local tourism managers in real-time.
        </p>

        <div style={{
          display: 'flex', gap: 16,
          justifyContent: 'center', flexWrap: 'wrap',
          position: 'relative'
        }}>
          <Button size="lg" onClick={() => navigate('/signup')} style={{ padding: '14px 36px' }}>
            Start Exploring
          </Button>
          <Button size="lg" variant="secondary" onClick={() => navigate('/manager/signup')}>
            Register as Manager
          </Button>
        </div>
      </section>

      {/* Destinations */}
      <section style={{ padding: '80px 48px' }}>
        <h2 style={{
          fontFamily: 'Playfair Display, serif',
          fontSize: 36, textAlign: 'center',
          color: 'var(--ink)', marginBottom: 8
        }}>
          Popular Destinations
        </h2>
        <p style={{
          textAlign: 'center', color: 'var(--mist)',
          marginBottom: 48, fontSize: 15
        }}>
          Explore real-time verified sites managed by local tourism managers
        </p>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
          gap: 20, maxWidth: 1100, margin: '0 auto'
        }}>
          {DESTINATIONS.map(d => (
            <div
              key={d.id}
              onClick={() => navigate('/login')}
              style={{
                background: 'var(--card-bg)',
                borderRadius: 'var(--radius)',
                padding: 24,
                textAlign: 'center',
                cursor: 'pointer',
                border: '1px solid var(--border)',
                boxShadow: 'var(--shadow)',
                transition: 'transform 0.2s, box-shadow 0.2s'
              }}
              onMouseEnter={e => {
                e.currentTarget.style.transform = 'translateY(-4px)'
                e.currentTarget.style.boxShadow = 'var(--shadow-lg)'
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = 'translateY(0)'
                e.currentTarget.style.boxShadow = 'var(--shadow)'
              }}
            >
              <div style={{ fontSize: 40, marginBottom: 12 }}>{d.emoji}</div>
              <h3 style={{
                fontFamily: 'Playfair Display, serif',
                fontSize: 18, fontWeight: 700,
                color: 'var(--ink)', marginBottom: 4
              }}>
                {d.name}
              </h3>
              <p style={{ fontSize: 13, color: 'var(--mist)' }}>{d.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section style={{
        padding: '80px 48px',
        background: 'var(--ink)'
      }}>
        <h2 style={{
          fontFamily: 'Playfair Display, serif',
          fontSize: 36, textAlign: 'center',
          color: 'var(--white)', marginBottom: 48
        }}>
          Why TravelMgmt?
        </h2>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
          gap: 24, maxWidth: 900, margin: '0 auto'
        }}>
          {[
            { icon: MapPin, title: 'Real-time Sites', desc: 'Only verified sites posted by official tourism managers' },
            { icon: Star, title: 'Live Analytics', desc: 'See how many people are viewing a site right now' },
            { icon: MessageCircle, title: 'Direct Chat', desc: 'Chat with local managers for real-time assistance' },
            { icon: Shield, title: 'Secure Booking', desc: 'Book sites with instant confirmation from managers' },
          ].map(({ icon: Icon, title, desc }) => (
            <div key={title} style={{
              padding: 28,
              background: 'rgba(254,252,248,0.05)',
              borderRadius: 'var(--radius)',
              border: '1px solid rgba(196,98,45,0.15)'
            }}>
              <Icon size={28} color="var(--terra-light)" style={{ marginBottom: 12 }} />
              <h3 style={{
                fontFamily: 'Playfair Display, serif',
                fontSize: 18, color: 'var(--white)', marginBottom: 8
              }}>
                {title}
              </h3>
              <p style={{ fontSize: 14, color: 'var(--mist)', lineHeight: 1.6 }}>{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer style={{
        padding: '32px 48px',
        background: 'var(--ink)',
        borderTop: '1px solid rgba(196,98,45,0.1)',
        textAlign: 'center',
        color: 'var(--mist)',
        fontSize: 13
      }}>
        © 2026 TravelMgmt — Built for Incredible India
      </footer>
    </div>
  )
}