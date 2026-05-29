import api from './axios'

export const completeArticle = (articleId) => api.post('/progress/complete', { articleId })
export const getCourseProgress = (courseId) => api.get(`/progress/${courseId}`)
