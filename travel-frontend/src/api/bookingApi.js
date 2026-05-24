import api from './axios'

export const createBooking = (data) =>
  api.post('/bookings', data)

export const getMyBookings = () =>
  api.get('/bookings/my')

export const cancelBooking = (bookingId) =>
  api.put(`/bookings/${bookingId}/cancel`)

export const getBookingsByLocation = (locationId) =>
  api.get(`/bookings/location/${locationId}`)

export const updateBookingStatus = (bookingId, status) =>
  api.put(`/bookings/${bookingId}/status`, { status })