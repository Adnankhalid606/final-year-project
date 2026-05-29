import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { createCourse, updateCourse, deleteCourse } from '../../api/courses'
import { getAdminCourses } from '../../api/admin'

const EMPTY_FORM = { title: '', description: '' }

export default function ManageCourses() {
  const [courses, setCourses]       = useState([])
  const [loading, setLoading]       = useState(true)
  const [error, setError]           = useState('')
  const [successMsg, setSuccessMsg] = useState('')

  // Create form
  const [form, setForm]             = useState(EMPTY_FORM)
  const [submitting, setSubmitting] = useState(false)
  const [showForm, setShowForm]     = useState(false)
  const [createPreview, setCreatePreview] = useState('write')

  // Edit state
  const [editingId, setEditingId]   = useState(null)
  const [editForm, setEditForm]     = useState(EMPTY_FORM)
  const [editPreview, setEditPreview] = useState('write')
  const [saving, setSaving]         = useState(false)

  // Delete state
  const [deleting, setDeleting]     = useState(null)

  const fetchCourses = async () => {
    try {
      const res = await getAdminCourses()
      setCourses(res.data.data ?? res.data)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load courses.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchCourses() }, [])

  // ── Create handlers ──────────────────────────────────────────────────────────
  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccessMsg('')
    setSubmitting(true)
    try {
      await createCourse(form)
      setForm(EMPTY_FORM)
      setShowForm(false)
      setSuccessMsg('Course created successfully!')
      setTimeout(() => setSuccessMsg(''), 3000)
      await fetchCourses()
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create course.')
    } finally {
      setSubmitting(false)
    }
  }

  // ── Edit handlers ─────────────────────────────────────────────────────────────
  const openEdit = (course) => {
    setEditingId(course.id)
    setEditForm({ title: course.title || '', description: course.description || '' })
    setEditPreview('write')
    setError('')
  }

  const cancelEdit = () => {
    setEditingId(null)
    setEditForm(EMPTY_FORM)
  }

  const handleEditChange = (e) => setEditForm(prev => ({ ...prev, [e.target.name]: e.target.value }))

  const handleEditSave = async (id) => {
    setSaving(true)
    setError('')
    try {
      await updateCourse(id, editForm)
      setCourses(prev => prev.map(c => c.id === id ? { ...c, ...editForm } : c))
      setSuccessMsg('Course updated successfully!')
      setTimeout(() => setSuccessMsg(''), 3000)
      cancelEdit()
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update course.')
    } finally {
      setSaving(false)
    }
  }

  // ── Delete handler ────────────────────────────────────────────────────────────
  const handleDelete = async (id, title) => {
    if (!window.confirm(`Delete "${title}"? This will also hide all its articles.`)) return
    setDeleting(id)
    setError('')
    try {
      await deleteCourse(id)
      setCourses(prev => prev.filter(c => c.id !== id))
      setSuccessMsg('Course deleted successfully.')
      setTimeout(() => setSuccessMsg(''), 3000)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete course.')
    } finally {
      setDeleting(null)
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
          <p className="text-muted mb-0 small">Create, edit, and remove learning courses</p>
        </div>
      </div>

      {error      && <div className="alert alert-danger">{error}</div>}
      {successMsg && <div className="alert alert-success">{successMsg}</div>}

      {/* ── Create Form ─────────────────────────────────────────────────────── */}
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
              <DescriptionField
                value={form.description}
                name="description"
                onChange={handleChange}
                previewMode={createPreview}
                setPreviewMode={setCreatePreview}
              />
              <button type="submit" className="btn btn-primary" disabled={submitting}>
                {submitting
                  ? <><span className="spinner-border spinner-border-sm me-2" />Creating...</>
                  : 'Create Course'}
              </button>
            </form>
          </div>
        )}
      </div>

      {/* ── Courses List ─────────────────────────────────────────────────────── */}
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
                  <>
                    {/* Main row */}
                    <tr key={course.id}>
                      <td className="text-muted">{idx + 1}</td>
                      <td className="fw-semibold">{course.title}</td>
                      <td className="text-muted small">
                        {course.description
                          ? course.description.substring(0, 80) + (course.description.length > 80 ? '...' : '')
                          : '—'}
                      </td>
                      <td className="text-end">
                        <div className="d-flex gap-2 justify-content-end">
                          <Link
                            to={`/admin/courses/${course.id}/articles`}
                            className="btn btn-outline-secondary btn-sm"
                          >
                            Articles
                          </Link>
                          <button
                            className={`btn btn-sm ${editingId === course.id ? 'btn-secondary' : 'btn-outline-primary'}`}
                            onClick={() => editingId === course.id ? cancelEdit() : openEdit(course)}
                            disabled={deleting === course.id}
                          >
                            {editingId === course.id ? 'Cancel' : 'Edit'}
                          </button>
                          <button
                            className="btn btn-outline-danger btn-sm"
                            onClick={() => handleDelete(course.id, course.title)}
                            disabled={deleting === course.id || editingId === course.id}
                          >
                            {deleting === course.id
                              ? <span className="spinner-border spinner-border-sm" />
                              : 'Delete'}
                          </button>
                        </div>
                      </td>
                    </tr>

                    {/* Inline edit row */}
                    {editingId === course.id && (
                      <tr key={`edit-${course.id}`} className="table-light">
                        <td colSpan={4} className="p-4">
                          <div className="mb-3">
                            <label className="form-label fw-semibold small">
                              Title <span className="text-danger">*</span>
                            </label>
                            <input
                              type="text"
                              className="form-control form-control-sm"
                              name="title"
                              value={editForm.title}
                              onChange={handleEditChange}
                              required
                            />
                          </div>
                          <DescriptionField
                            value={editForm.description}
                            name="description"
                            onChange={handleEditChange}
                            previewMode={editPreview}
                            setPreviewMode={setEditPreview}
                            small
                          />
                          <div className="d-flex gap-2 mt-3">
                            <button
                              className="btn btn-primary btn-sm"
                              onClick={() => handleEditSave(course.id)}
                              disabled={saving}
                            >
                              {saving
                                ? <><span className="spinner-border spinner-border-sm me-1" />Saving...</>
                                : 'Save Changes'}
                            </button>
                            <button
                              className="btn btn-outline-secondary btn-sm"
                              onClick={cancelEdit}
                              disabled={saving}
                            >
                              Cancel
                            </button>
                          </div>
                        </td>
                      </tr>
                    )}
                  </>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

// ── Shared description field with write/preview toggle ────────────────────────
function DescriptionField({ value, name, onChange, previewMode, setPreviewMode, small = false }) {
  return (
    <div className="mb-3">
      <div className="d-flex justify-content-between align-items-center mb-2">
        <label className={`form-label fw-semibold mb-0${small ? ' small' : ''}`}>Description</label>
        <div className="btn-group btn-group-sm" role="group">
          {['write', 'preview'].map((mode) => (
            <button
              key={mode}
              type="button"
              className={`btn ${previewMode === mode ? 'btn-primary' : 'btn-outline-secondary'}`}
              onClick={() => setPreviewMode(mode)}
            >
              {mode.charAt(0).toUpperCase() + mode.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {previewMode === 'write' ? (
        <textarea
          className={`form-control${small ? ' form-control-sm' : ''}`}
          name={name}
          value={value}
          onChange={onChange}
          rows={3}
          placeholder="Course description (supports Markdown)"
        />
      ) : (
        <div
          className="border rounded p-3"
          style={{ minHeight: '4.5rem', fontSize: '0.9rem', lineHeight: 1.7 }}
        >
          {value.trim() ? (
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{value}</ReactMarkdown>
          ) : (
            <span className="text-muted fst-italic">Nothing to preview yet.</span>
          )}
        </div>
      )}
    </div>
  )
}
