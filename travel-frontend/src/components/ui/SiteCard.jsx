import { useNavigate } from 'react-router-dom'
import { MapPin, Eye, Heart, Clock } from 'lucide-react'

export default function SiteCard({ site }) {
  const navigate = useNavigate()

  return (
    <div
      onClick={() => navigate(`/site/${site.id}`)}
      style={{
        background: 'var(--card-bg)',
        borderRadius: 'var(--radius)',
        overflow: 'hidden',
        boxShadow: 'var(--shadow)',
        border: '1px solid var(--border)',
        cursor: 'pointer',
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
      {/* Image */}
      <div style={{
        height: 180,
        background: site.imageUrls?.[0]
          ? `url(${site.imageUrls[0]}) center/cover`
          : 'linear-gradient(135deg, var(--terra) 0%, var(--terra-dark) 100%)',
        position: 'relative'
      }}>
        <div style={{
          position: 'absolute',
          top: 12,
          right: 12,
          background: 'rgba(26,20,16,0.7)',
          borderRadius: 20,
          padding: '4px 10px',
          fontSize: 11,
          color: 'var(--sand)',
          backdropFilter: 'blur(4px)'
        }}>
          {site.category}
        </div>
      </div>

      {/* Content */}
      <div style={{ padding: '16px' }}>
        <h3 style={{
          fontFamily: 'Playfair Display, serif',
          fontSize: 17,
          fontWeight: 700,
          color: 'var(--ink)',
          marginBottom: 6
        }}>
          {site.name}
        </h3>

        <p style={{
          fontSize: 13,
          color: 'var(--mist)',
          marginBottom: 12,
          lineHeight: 1.5,
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden'
        }}>
          {site.shortDescription || site.description}
        </p>

        <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginBottom: 8 }}>
          <MapPin size={13} color="var(--terra)" />
          <span style={{ fontSize: 12, color: 'var(--mist)' }}>
            {site.address || site.locationName}
          </span>
        </div>

        {site.openingHours && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginBottom: 12 }}>
            <Clock size={13} color="var(--mist)" />
            <span style={{ fontSize: 12, color: 'var(--mist)' }}>{site.openingHours}</span>
          </div>
        )}

        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          borderTop: '1px solid var(--border)',
          paddingTop: 10
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <Eye size={14} color="var(--mist)" />
            <span style={{ fontSize: 12, color: 'var(--mist)' }}>{site.viewCount || 0}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <Heart size={14} color="var(--terra)" />
            <span style={{ fontSize: 12, color: 'var(--mist)' }}>{site.likeCount || 0}</span>
          </div>
          <span style={{
            fontSize: 12,
            fontWeight: 500,
            color: site.entryFee === 'Free' ? 'var(--success)' : 'var(--terra)'
          }}>
            {site.entryFee || 'Free'}
          </span>
        </div>
      </div>
    </div>
  )
}