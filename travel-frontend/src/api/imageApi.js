import axios from 'axios'

const IMAGE_BASE = 'http://localhost:8087'

export const uploadImage = (file, siteId, siteName) => {
  const token = localStorage.getItem('token')
  const formData = new FormData()
  formData.append('file', file)
  formData.append('siteId', siteId)
  formData.append('siteName', siteName)

  return axios.post(`${IMAGE_BASE}/images/upload`, formData, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'multipart/form-data'
    }
  })
}

export const getImagesBySite = (siteId) =>
  axios.get(`${IMAGE_BASE}/images/site/${siteId}`)

export const deleteImage = (imageId) => {
  const token = localStorage.getItem('token')
  return axios.delete(`${IMAGE_BASE}/images/${imageId}`, {
    headers: { Authorization: `Bearer ${token}` }
  })
}