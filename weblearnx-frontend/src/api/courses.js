import api from './axios'

export const getCourses = () => api.get('/courses')
export const getCourse = (id) => api.get(`/courses/${id}`)
export const createCourse = (data) => api.post('/courses', data)
export const getPublicCourses = () => api.get('/courses/public')
