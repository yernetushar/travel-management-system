import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Plus, Edit, Trash2, Eye, EyeOff } from 'lucide-react'
import { toast } from 'react-hot-toast'
import ManagerLayout from '../../components/layout/ManagerLayout'
import Button from '../../components/ui/Button'
import { getMySites, deleteSite, updateSite } from '../../api/siteApi'

export default function ManageSites() {
  const navigate = useNavigate()
  const [sites, setSites] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getMySites()
      .then(r => setSites(r.data))
      .catch(() => toast.error('Failed to load sites'))
      .finally(() => setLoading(false))
  }, [])

  const handleDelete = async (siteId, siteName) => {
    if (!confirm(`Delete "${siteName}"?`)) return
    try {
      await deleteSite(siteId)
      setSites(prev => prev.filter(s => s.id !== siteId))
      toast.success('Site deleted')
    } catch {
      toast.error('Delete failed')
    }
  }

  const handleToggleActive = async (site) => {
    try {
      const res = await updateSite(site.id, { active: !site.active })
      setSites(prev => prev.map(s => s.id === site.id ? res.data : s))
      toast.success(site.active ? 'Site deactivated' : 'Site activated')
    } catch {
      toast.error('Update failed')
    }
  }

  return (
    <ManagerLayout>
      <div style={{
        display: 'flex', justifyContent: 'space-between',
        alignItems: 'center', marginBottom: 28, flexWrap: 'wrap', gap: 12
      }}>
        <h1 style={{
          fontFamily: 'Playfair Display, serif',
          fontSize: 28, color: 'var(--ink)'
        }}>
          Manage Sites
        </h1>
        <Button onClick={() => navigate('/manager/sites/new')}>
          <Plus size={16} /> Add New Site
        </Button>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: 60, color: 'var(--mist)' }}>Loading...</div>
      ) : sites.length === 0 ? (
        <div style={{
          textAlign: 'center', padding: 60,
          background: 'var(--card-bg)', borderRadius: 16
        }}>
          <p style={{ color: 'var(--mist)', marginBottom: 20 }}>No sites yet</p>
          <Button onClick={() => navigate('/manager/sites/new')}>
            <Plus size={16} /> Add Your First Site
          </Button>
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
          gap: 20
        }}>
          {sites.map(site => (
            <div key={site.id} style={{
              background: 'var(--card-bg)',
              borderRadius: 16, overflow: 'hidden',
              boxShadow: 'var(--shadow)',
              border: `1px solid ${site.active ? 'var(--border)' : 'rgba(196,58,45,0.2)'}`,
              opacity: site.active ? 1 : 0.75
            }}>
              {site.imageUrls?.[0] && (
                <div style={{
                  height: 140,
                  background: `url(${site.imageUrls[0]}) center/cover`
                }} />
              )}
              <div style={{ padding: 20 }}>
                <div style={{
                  display: 'flex', justifyContent: 'space-between',
                  alignItems: 'center', marginBottom: 10
                }}>
                  <span style={{
                    fontSize: 11, fontWeight: 500,
                    background: 'rgba(196,98,45,0.1)',
                    color: 'var(--terra)',
                    padding: '2px 8px', borderRadius: 20
                  }}>
                    {site.category}
                  </span>
                  <span style={{
                    fontSize: 11, fontWeight: 500,
                    color: site.active ? 'var(--success)' : 'var(--danger)'
                  }}>
                    {site.active ? '● Active' : '○ Inactive'}
                  </span>
                </div>

                <h3 style={{
                  fontFamily: 'Playfair Display, serif',
                  fontSize: 17, color: 'var(--ink)', marginBottom: 6
                }}>
                  {site.name}
                </h3>

                <p style={{
                  fontSize: 12, color: 'var(--mist)', marginBottom: 12,
                  display: '-webkit-box', WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical', overflow: 'hidden'
                }}>
                  {site.shortDescription || site.description}
                </p>

                <div style={{
                  display: 'flex', gap: 16, marginBottom: 14,
                  fontSize: 12, color: 'var(--mist)'
                }}>
                  <span>👁 {site.viewCount} views</span>
                  <span>❤️ {site.likeCount} likes</span>
                </div>

                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  <Button
                    size="sm" variant="ghost"
                    onClick={() => navigate(`/manager/sites/edit/${site.id}`)}
                  >
                    <Edit size={14} /> Edit
                  </Button>
                  <Button
                    size="sm" variant="ghost"
                    onClick={() => handleToggleActive(site)}
                  >
                    {site.active
                      ? <><EyeOff size={14} /> Deactivate</>
                      : <><Eye size={14} /> Activate</>
                    }
                  </Button>
                  <Button
                    size="sm" variant="danger"
                    onClick={() => handleDelete(site.id, site.name)}
                  >
                    <Trash2 size={14} /> Delete
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </ManagerLayout>
  )
}