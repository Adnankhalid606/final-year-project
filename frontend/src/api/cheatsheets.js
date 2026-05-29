import api from './axios'

export const getCheatsheets = () => api.get('/cheatsheets')
export const getCheatsheet = (slug) => api.get(`/cheatsheets/${slug}`)
export const createCheatsheet = (data) => api.post('/cheatsheets', data)
export const updateCheatsheet = (id, data) => api.put(`/cheatsheets/${id}`, data)
export const deleteCheatsheet = (id) => api.delete(`/cheatsheets/${id}`)
