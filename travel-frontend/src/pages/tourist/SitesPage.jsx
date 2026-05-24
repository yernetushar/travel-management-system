import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Search, Filter } from 'lucide-react'
import { toast } from 'react-hot-toast'
import TouristLayout from '../../components/layout/TouristLayout'
import SiteCard from '../../components/ui/SiteCard'
import { getSitesByLocation, searchSites, getSitesByCategory } from '../../api/siteApi'

const CATEGORIES = ['ALL', 'BEACH', 'TEMPLE', 'FORT', 'MUSEUM', 'PARK', 'OTHER']

export default function SitesPage() {
  const { locationId } = useParams()
  const navigate = useNavigate()
  const [sites, setSites] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('ALL')

  useEffect(() => {
    loadSites()
  }, [locationId])

  const loadSites = async () => {
    setLoading(true)
    try {
      const res = await getSitesByLocation(locationId)
      setSites(res.data)
    } catch {
      toast.error('Failed to load sites')
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = async () => {
    if (!search.trim()) { loadSites(); return }
    try {
      const res = await searchSites(locationId, search)
      setSites(res.data)
    } catch {
      toast.error('Search failed')
    }
  }

  const handleCategory = async (cat) => {
    setCategory(cat)
    if (cat === 'ALL') { loadSites(); return }
    try {
      const res = await getSitesByCategory(locationId, cat)
      setSites(res.data)
    } catch {
      toast.error('Filter failed')
    }
  }

  return (
    <TouristLayout>
      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <button onClick={() => navigate('/home')} style={{
          background: 'none', border: 'none',
          color: 'var(--terra)', fontSize: 13,
          cursor: 'pointer', marginBottom: 12,
          display: 'flex', alignItems: 'center', gap: 4
        }}>
          ← Back
        </button>
        <h1 style={{
          fontFamily: 'Playfair Display, serif',
          fontSize: 28, color: 'var(--ink)',
          textTransform: 'capitalize'
        }}>
          {locationId} Sites
        </h1>
        <p style={{ color: 'var(--mist)', fontSize: 14 }}>
          {sites.length} verified sites available
        </p>
      </div>

      {/* Search */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
        <div style={{ flex: 1, position: 'relative' }}>
          <Search size={16} style={{
            position: 'absolute', left: 12, top: '50%',
            transform: 'translateY(-50%)', color: 'var(--mist)'
          }} />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSearch()}
            placeholder="Search sites..."
            style={{
              width: '100%', padding: '10px 10px 10px 36px',
              border: '1.5px solid var(--border)',
              borderRadius: 10, background: 'var(--card-bg)',
              fontSize: 14, outline: 'none', color: 'var(--ink)'
            }}
          />
        </div>
        <button onClick={handleSearch} style={{
          padding: '10px 16px', background: 'var(--terra)',
          color: 'white', border: 'none', borderRadius: 10,
          cursor: 'pointer', fontSize: 13, fontWeight: 500
        }}>
          Search
        </button>
      </div>

      {/* Categories */}
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 24 }}>
        {CATEGORIES.map(cat => (
          <button
            key={cat}
            onClick={() => handleCategory(cat)}
            style={{
              padding: '6px 14px',
              borderRadius: 20,
              border: '1.5px solid',
              borderColor: category === cat ? 'var(--terra)' : 'var(--border)',
              background: category === cat ? 'var(--terra)' : 'transparent',
              color: category === cat ? 'white' : 'var(--mist)',
              fontSize: 12, fontWeight: 500, cursor: 'pointer',
              transition: 'all 0.2s'
            }}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Sites Grid */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: 60, color: 'var(--mist)' }}>
          Loading sites...
        </div>
      ) : sites.length === 0 ? (
        <div style={{
          textAlign: 'center', padding: 60,
          background: 'var(--card-bg)', borderRadius: 16
        }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>🗺️</div>
          <p style={{ color: 'var(--mist)' }}>
            No sites found for this location yet
          </p>
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: 20
        }}>
          {sites.map(site => <SiteCard key={site.id} site={site} />)}
        </div>
      )}
    </TouristLayout>
  )
}