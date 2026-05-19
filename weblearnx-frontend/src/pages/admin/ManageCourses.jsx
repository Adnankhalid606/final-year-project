import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getCourses, createCourse } from '../../api/courses'

export default function ManageCourses() {
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [successMsg, setSuccessMsg] = useState('')
  const [form, setForm] = useState({ title: '', description: '' })
  const [submitting, setSubmitting] = useState(false)
  const [showForm, setShowForm] = useState(false)

  const fetchCourses = async () => {
    try {
      const res = await getCourses()
      setCourses(res.data.data ?? res.data)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load courses.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCourses()
  }, [])

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccessMsg('')
    setSubmitting(true)
    try {
      const res = await createCourse(form)
      setCourses((prev) => [...prev, res.data.data ?? res.data])
      setForm({ title: '', description: '' })
      setShowForm(false)
      setSuccessMsg('Course created successfully!')
      setTimeout(() => setSuccessMsg(''), 3000)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create course.')
    } finally {
      setSubmitting(false)
    }
  }

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
      <div className="d-flex align-items-center gap-3 mb-4">
        <Link to="/admin/dashboard" className="btn btn-outline-secondary btn-sm">← Dashboard</Link>
        <div>
          <h2 className="fw-bold mb-0">Manage Courses</h2>
          <p className="text-muted mb-0 small">Create and manage learning courses</p>
        </div>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}
      {successMsg && <div className="alert alert-success">{successMsg}</div>}

      {/* Create Course Form */}
      <div className="card border-0 shadow-sm mb-4">
        <div className="card-header bg-white d-flex justify-content-between align-items-center py-3">
          <h6 className="fw-bold mb-0">Create New Course</h6>
          <button
            className="btn btn-sm btn-outline-primary"
            onClick={() => setShowForm(!showForm)}
          >
            {showForm ? 'Cancel' : '+ New Course'}
          </button>
        </div>
        {showForm && (
          <div className="card-body">
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label htmlFor="title" className="form-label fw-semibold">
                  Title <span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="title"
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  required
                  placeholder="Course title"
                />
              </div>
              <div className="mb-3">
                <label htmlFor="description" className="form-label fw-semibold">Description</label>
                <textarea
                  className="form-control"
                  id="description"
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  rows={3}
                  placeholder="Course description"
                />
              </div>
              <button type="submit" className="btn btn-primary" disabled={submitting}>
                {submitting ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    Creating...
                  </>
                ) : 'Create Course'}
              </button>
            </form>
          </div>
        )}
      </div>

      {/* Courses List */}
      <div className="card border-0 shadow-sm">
        <div className="card-header bg-white py-3">
          <h6 className="fw-bold mb-0">All Courses ({courses.length})</h6>
        </div>
        {courses.length === 0 ? (
          <div className="card-body text-center py-5 text-muted">
            No courses yet. Create your first course above.
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="table-light">
                <tr>
                  <th>#</th>
                  <th>Title</th>
                  <th>Description</th>
                  <th className="text-end">Actions</th>
                </tr>
              </thead>
              <tbody>
                {courses.map((course, idx) => (
                  <tr key={course.id}>
                    <td className="text-muted">{idx + 1}</td>
                    <td className="fw-semibold">{course.title}</td>
                    <td className="text-muted small">
                      {course.description
                        ? course.description.substring(0, 80) + (course.description.length > 80 ? '...' : '')
                        : '—'}
                    </td>
                    <td className="text-end">
                      <Link
                        to={`/admin/courses/${course.id}/articles`}
                        className="btn btn-outline-primary btn-sm"
                      >
                        Manage Articles
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
