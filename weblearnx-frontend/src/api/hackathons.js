import api from './axios'

export const getHackathons = (params) => api.get('/hackathons', { params })
export const getHackathon = (id) => api.get(`/hackathons/${id}`)
export const createHackathon = (data) => api.post('/hackathons', data)
export const updateHackathon = (id, data) => api.put(`/hackathons/${id}`, data)
export const deleteHackathon = (id) => api.delete(`/hackathons/${id}`)
export const bookmarkHackathon = (id) => api.post(`/hackathons/${id}/bookmark`)
export const removeBookmark = (id) => api.delete(`/hackathons/${id}/bookmark`)
export const getMyBookmarks = () => api.get('/hackathons/bookmarks/me')
