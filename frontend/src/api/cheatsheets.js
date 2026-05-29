import api from './axios'

export const getCheatsheets = () => api.get('/cheatsheets')
export const getCheatsheet = (slug) => api.get(`/cheatsheets/${slug}`)
export const createCheatsheet = (data) => api.post('/cheatsheets', data)
