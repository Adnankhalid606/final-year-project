import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getCheatsheets, createCheatsheet } from '../../api/cheatsheets'

export default function ManageCheatsheets() {
  const [cheatsheets, setCheatsheets] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [successMsg, setSuccessMsg] = useState('')
  const [form, setForm] = useState({ title: '', slug: '', category: '', content: '' })
  const [submitting, setSubmitting] = useState(false)
  const [showForm, setShowForm] = useState(false)

  const fetchCheatsheets = async () => {
    try {
      const res = await getCheatsheets()
      setCheatsheets(res.data.data ?? res.data)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load cheatsheets.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCheatsheets()
  }, [])

  const handleChange = (e) => {
    const { name, value } = e.target
    // Auto-generate slug from title
    if (name === 'title') {
      const slug = value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
      setForm({ ...form, title: value, slug })
    } else {
      setForm({ ...form, [name]: value })
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccessMsg('')
    setSubmitting(true)
    try {
      const res = await createCheatsheet(form)
      setCheatsheets((prev) => [...prev, res.data.data ?? res.data])
      setForm({ title: '', slug: '', category: '', content: '' })
      setShowForm(false)
      setSuccessMsg('Cheatsheet created successfully!')
      setTimeout(() => setSuccessMsg(''), 3000)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create cheatsheet.')
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
          <h2 className="fw-bold mb-0">Manage Cheatsheets</h2>
          <p className="text-muted mb-0 small">Create and manage quick reference guides</p>
        </div>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}
      {successMsg && <div className="alert alert-success">{successMsg}</div>}

      {/* Create Cheatsheet Form */}
      <div className="card border-0 shadow-sm mb-4">
        <div className="card-header bg-white d-flex justify-content-between align-items-center py-3">
          <h6 className="fw-bold mb-0">Create New Cheatsheet</h6>
          <button
            className="btn btn-sm btn-outline-primary"
            onClick={() => setShowForm(!showForm)}
          >
            {showForm ? 'Cancel' : '+ New Cheatsheet'}
          </button>
        </div>
        {showForm && (
          <div className="card-body">
            <form onSubmit={handleSubmit}>
              <div className="row g-3 mb-3">
                <div className="col-md-6">
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
                    placeholder="e.g. JavaScript ES6"
                  />
                </div>
                <div className="col-md-6">
                  <label htmlFor="slug" className="form-label fw-semibold">
                    Slug <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="slug"
                    name="slug"
                    value={form.slug}
                    onChange={handleChange}
                    required
                    placeholder="e.g. javascript-es6"
                  />
                  <div className="form-text">Auto-generated from title. Must be unique.</div>
                </div>
              </div>
              <div className="mb-3">
                <label htmlFor="category" className="form-label fw-semibold">Category</label>
                <input
                  type="text"
                  className="form-control"
                  id="category"
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                  placeholder="e.g. JavaScript, Python, CSS"
                />
              </div>
              <div className="mb-3">
                <label htmlFor="content" className="form-label fw-semibold">
                  Content <span className="text-danger">*</span>
                </label>
                <textarea
                  className="form-control"
                  id="content"
                  name="content"
                  value={form.content}
                  onChange={handleChange}
                  rows={10}
                  required
                  placeholder="Write the cheatsheet content here (plain text or markdown)..."
                  style={{ fontFamily: 'monospace' }}
                />
              </div>
              <button type="submit" className="btn btn-primary" disabled={submitting}>
                {submitting ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    Creating...
                  </>
                ) : 'Create Cheatsheet'}
              </button>
            </form>
          </div>
        )}
      </div>

      {/* Cheatsheets List */}
      <div className="card border-0 shadow-sm">
        <div className="card-header bg-white py-3">
          <h6 className="fw-bold mb-0">All Cheatsheets ({cheatsheets.length})</h6>
        </div>
        {cheatsheets.length === 0 ? (
          <div className="card-body text-center py-5 text-muted">
            No cheatsheets yet. Create your first one above.
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="table-light">
                <tr>
                  <th>Title</th>
                  <th>Slug</th>
                  <th>Category</th>
                  <th className="text-end">Actions</th>
                </tr>
              </thead>
              <tbody>
                {cheatsheets.map((cs) => (
                  <tr key={cs.id}>
                    <td className="fw-semibold">{cs.title}</td>
                    <td><code className="text-muted">{cs.slug}</code></td>
                    <td>
                      {cs.category ? (
                        <span className="badge bg-secondary">{cs.category}</span>
                      ) : '—'}
                    </td>
                    <td className="text-end">
                      <Link
                        to={`/cheatsheets/${cs.slug}`}
                        className="btn btn-outline-primary btn-sm"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        View
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
