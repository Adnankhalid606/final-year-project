import api from './axios'

export const getArticlesByCourse = (courseId) => api.get(`/articles/course/${courseId}`)
export const getArticle = (id) => api.get(`/articles/${id}`)
export const createArticle = (data) => api.post('/articles', data)
export const updateArticle = (id, data) => api.put(`/articles/${id}`, data)
export const deleteArticle = (id) => api.delete(`/articles/${id}`)
