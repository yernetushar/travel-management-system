import api from './axios'

export const getSitesByLocation = (locationId) =>
  api.get(`/sites/location/${locationId}`)

export const getSiteById = (siteId) =>
  api.get(`/sites/${siteId}`)

export const searchSites = (locationId, keyword) =>
  api.get(`/sites/location/${locationId}/search?keyword=${keyword}`)

export const getSitesByCategory = (locationId, category) =>
  api.get(`/sites/location/${locationId}/category/${category}`)

export const getMySites = () =>
  api.get('/sites/my')

export const createSite = (data) =>
  api.post('/sites', data)

export const updateSite = (siteId, data) =>
  api.put(`/sites/${siteId}`, data)

export const deleteSite = (siteId) =>
  api.delete(`/sites/${siteId}`)