import api from './axios'

export const getArticlesByCourse = (courseId) => api.get(`/articles/course/${courseId}`)
export const getArticle = (id) => api.get(`/articles/${id}`)
export const createArticle = (data) => api.post('/articles', data)
