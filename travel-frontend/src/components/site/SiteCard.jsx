import { useNavigate } from 'react-router-dom'
import { MapPin, Eye, Heart, Clock, Tag } from 'lucide-react'
import './SiteCard.css'

export default function SiteCard({ site }) {
  const nav = useNavigate()

  return (
    <div className="site-card" onClick={() => nav(`/site/${site.id}`)}>
      <div className="site-card-img">
        {site.imageUrls?.length > 0
          ? <img src={`http://localhost:8087/images/${site.imageUrls[0]}/data`} alt={site.name} />
          : <div className="site-card-img-placeholder">
              <span>{site.category?.[0] || '🏛'}</span>
            </div>
        }
        {site.category && (
          <span className="site-card-cat badge badge-earth">
            <Tag size={10}/>{site.category}
          </span>
        )}
      </div>

      <div className="site-card-body">
        <h3>{site.name}</h3>
        <p className="site-card-desc">{site.shortDescription || site.description?.slice(0,90) + '…'}</p>

        <div className="site-card-meta">
          {site.locationName && (
            <span><MapPin size={12}/>{site.locationName}</span>
          )}
          {site.openingHours && (
            <span><Clock size={12}/>{site.openingHours}</span>
          )}
        </div>

        <div className="site-card-footer">
          <div className="site-card-stats">
            <span><Eye size={12}/>{site.viewCount ?? 0}</span>
            <span><Heart size={12}/>{site.likeCount ?? 0}</span>
          </div>
          {site.entryFee != null && (
            <span className="site-card-fee">
              {site.entryFee === 0 ? 'Free entry' : `₹${site.entryFee}`}
            </span>
          )}
        </div>
      </div>
    </div>
  )
}