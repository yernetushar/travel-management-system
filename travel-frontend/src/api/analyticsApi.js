import api from './axios'

export const trackView = (siteId, siteName, locationId) =>
  api.post(`/analytics/view?siteId=${siteId}&siteName=${encodeURIComponent(siteName)}&locationId=${locationId}`)

export const trackLike = (siteId, siteName, locationId) =>
  api.post(`/analytics/like?siteId=${siteId}&siteName=${encodeURIComponent(siteName)}&locationId=${locationId}`)

export const getSiteAnalytics = (siteId) =>
  api.get(`/analytics/site/${siteId}`)

export const getLocationAnalytics = (locationId) =>
  api.get(`/analytics/location/${locationId}`)