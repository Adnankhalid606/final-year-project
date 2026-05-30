import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getCourses } from '../../api/courses'
import { getCourseProgress } from '../../api/progress'

export default function Courses() {
  const [courses, setCourses] = useState([])
  const [progressMap, setProgressMap] = useState({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getCourses()
        const courseList = res.data.data ?? res.data
        setCourses(courseList)

        const progressResults = await Promise.allSettled(
          courseList.map((c) => getCourseProgress(c.id))
        )
        const map = {}
        progressResults.forEach((result, idx) => {
          if (result.status === 'fulfilled') {
            map[courseList[idx].id] = result.value.data
          } else {
            map[courseList[idx].id] = { totalArticles: 0, completedCount: 0, progress: 0 }
          }
        })
        setProgressMap(map)
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load courses.')
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '60vh' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="container py-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold mb-0">All Courses</h2>
        <span className="badge bg-secondary fs-6">{courses.length} courses</span>
      </div>

      {error && (
        <div className="alert alert-danger" role="alert">{error}</div>
      )}

      {courses.length === 0 && !error && (
        <div className="text-center py-5 text-muted">
          <p className="fs-5">No courses available yet.</p>
        </div>
      )}

      <div className="row g-4">
        {courses.map((course) => {
          const prog = progressMap[course.id] || { totalArticles: 0, completedCount: 0, progress: 0 }
          const pct = Math.round(prog.progress || 0)
          return (
            <div key={course.id} className="col-md-6 col-lg-4">
              <div className="card h-100 shadow-sm border-0">
                <div className="card-body d-flex flex-column">
                  <h5 className="card-title fw-bold">{course.title}</h5>
                  <div className="mt-3">
                    <div className="d-flex justify-content-between mb-1">
                      <small className="text-muted">Progress</small>
                      <small className="fw-semibold">{pct}%</small>
                    </div>
                    <div className="progress mb-3" style={{ height: 8 }}>
                      <div
                        className={`progress-bar ${pct === 100 ? 'bg-success' : 'bg-primary'}`}
                        role="progressbar"
                        style={{ width: `${pct}%` }}
                        aria-valuenow={pct}
                        aria-valuemin={0}
                        aria-valuemax={100}
                      ></div>
                    </div>
                    <div className="d-flex justify-content-between align-items-center">
                      <small className="text-muted">
                        {prog.completedCount}/{prog.totalArticles} articles
                      </small>
                      <Link to={`/courses/${course.id}`} className="btn btn-primary btn-sm">
                        {pct === 0 ? 'Start' : pct === 100 ? 'Review' : 'Continue'}
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
