import api from './axios'

export const getPendingOrganizers = () => api.get('/admin/organizers/pending')
export const approveOrganizer = (userId) => api.put(`/admin/organizers/${userId}/approve`)
export const rejectOrganizer = (userId) => api.put(`/admin/organizers/${userId}/reject`)
export const getAllUsers = () => api.get('/admin/users')
export const deleteUser = (userId) => api.delete(`/admin/users/${userId}`)
export const getAdminHackathons = () => api.get('/admin/hackathons')
export const updateHackathonStatus = (hackathonId, status) =>
  api.patch(`/admin/hackathons/${hackathonId}/status`, { status })
export const getAdminCourses = () => api.get('/admin/courses')
export const getAdminArticlesByCourse = (courseId) => api.get(`/admin/courses/${courseId}/articles`)
