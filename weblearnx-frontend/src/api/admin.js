import api from './axios'

export const getPendingOrganizers = () => api.get('/admin/organizers/pending')
export const approveOrganizer = (userId) => api.put(`/admin/organizers/${userId}/approve`)
export const rejectOrganizer = (userId) => api.put(`/admin/organizers/${userId}/reject`)
